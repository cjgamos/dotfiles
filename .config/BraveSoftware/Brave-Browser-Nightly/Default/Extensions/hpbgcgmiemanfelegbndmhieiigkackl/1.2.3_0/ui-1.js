LavaPack.loadBundle([
[3328, {"./auth":3325,"./response":3327,"./sctransport":3329,"buffer/":1440,"clone":3331,"component-emitter":3332,"linked-list":2498,"querystring":2996,"sc-channel":3240,"sc-errors":3243,"sc-formatter":3244}, function (require, module, exports) {
(function (global){
var Emitter = require('component-emitter');
var SCChannel = require('sc-channel').SCChannel;
var Response = require('./response').Response;
var AuthEngine = require('./auth').AuthEngine;
var formatter = require('sc-formatter');
var SCTransport = require('./sctransport').SCTransport;
var querystring = require('querystring');
var LinkedList = require('linked-list');
var Buffer = require('buffer/').Buffer;
var clone = require('clone');

var scErrors = require('sc-errors');
var InvalidArgumentsError = scErrors.InvalidArgumentsError;
var InvalidMessageError = scErrors.InvalidMessageError;
var InvalidActionError = scErrors.InvalidActionError;
var SocketProtocolError = scErrors.SocketProtocolError;
var TimeoutError = scErrors.TimeoutError;
var BadConnectionError = scErrors.BadConnectionError;

var isBrowser = typeof window !== 'undefined';


var SCClientSocket = function (opts) {
  var self = this;

  Emitter.call(this);

  this.id = null;
  this.state = this.CLOSED;
  this.authState = this.UNAUTHENTICATED;
  this.signedAuthToken = null;
  this.authToken = null;
  this.pendingReconnect = false;
  this.pendingReconnectTimeout = null;
  this.preparingPendingSubscriptions = false;
  this.clientId = opts.clientId;

  this.connectTimeout = opts.connectTimeout;
  this.ackTimeout = opts.ackTimeout;
  this.channelPrefix = opts.channelPrefix || null;
  this.disconnectOnUnload = opts.disconnectOnUnload == null ? true : opts.disconnectOnUnload;
  this.authTokenName = opts.authTokenName;

  // pingTimeout will be ackTimeout at the start, but it will
  // be updated with values provided by the 'connect' event
  this.pingTimeout = this.ackTimeout;
  this.pingTimeoutDisabled = !!opts.pingTimeoutDisabled;
  this.active = true;

  this._clientMap = opts.clientMap || {};

  var maxTimeout = Math.pow(2, 31) - 1;

  var verifyDuration = function (propertyName) {
    if (self[propertyName] > maxTimeout) {
      throw new InvalidArgumentsError('The ' + propertyName +
        ' value provided exceeded the maximum amount allowed');
    }
  };

  verifyDuration('connectTimeout');
  verifyDuration('ackTimeout');

  this._localEvents = {
    'connect': 1,
    'connectAbort': 1,
    'close': 1,
    'disconnect': 1,
    'message': 1,
    'error': 1,
    'raw': 1,
    'kickOut': 1,
    'subscribe': 1,
    'unsubscribe': 1,
    'subscribeStateChange': 1,
    'authStateChange': 1,
    'authenticate': 1,
    'deauthenticate': 1,
    'removeAuthToken': 1,
    'subscribeRequest': 1
  };

  this.connectAttempts = 0;

  this._emitBuffer = new LinkedList();
  this.channels = {};

  this.options = opts;

  this._cid = 1;

  this.options.callIdGenerator = function () {
    return self._cid++;
  };

  if (this.options.autoReconnect) {
    if (this.options.autoReconnectOptions == null) {
      this.options.autoReconnectOptions = {};
    }

    // Add properties to the this.options.autoReconnectOptions object.
    // We assign the reference to a reconnectOptions variable to avoid repetition.
    var reconnectOptions = this.options.autoReconnectOptions;
    if (reconnectOptions.initialDelay == null) {
      reconnectOptions.initialDelay = 10000;
    }
    if (reconnectOptions.randomness == null) {
      reconnectOptions.randomness = 10000;
    }
    if (reconnectOptions.multiplier == null) {
      reconnectOptions.multiplier = 1.5;
    }
    if (reconnectOptions.maxDelay == null) {
      reconnectOptions.maxDelay = 60000;
    }
  }

  if (this.options.subscriptionRetryOptions == null) {
    this.options.subscriptionRetryOptions = {};
  }

  if (this.options.authEngine) {
    this.auth = this.options.authEngine;
  } else {
    this.auth = new AuthEngine();
  }

  if (this.options.codecEngine) {
    this.codec = this.options.codecEngine;
  } else {
    // Default codec engine
    this.codec = formatter;
  }

  if (this.options.protocol) {
    var protocolOptionError = new InvalidArgumentsError('The "protocol" option' +
      ' does not affect socketcluster-client. If you want to utilize SSL/TLS' +
      ' - use "secure" option instead');
    this._onSCError(protocolOptionError);
  }

  this.options.path = this.options.path.replace(/\/$/, '') + '/';

  this.options.query = opts.query || {};
  if (typeof this.options.query === 'string') {
    this.options.query = querystring.parse(this.options.query);
  }

  this._channelEmitter = new Emitter();

  this._unloadHandler = function () {
    self.disconnect();
  };

  if (isBrowser && this.disconnectOnUnload && global.addEventListener) {
    global.addEventListener('beforeunload', this._unloadHandler, false);
  }
  this._clientMap[this.clientId] = this;

  if (this.options.autoConnect) {
    this.connect();
  }
};

SCClientSocket.prototype = Object.create(Emitter.prototype);

SCClientSocket.CONNECTING = SCClientSocket.prototype.CONNECTING = SCTransport.prototype.CONNECTING;
SCClientSocket.OPEN = SCClientSocket.prototype.OPEN = SCTransport.prototype.OPEN;
SCClientSocket.CLOSED = SCClientSocket.prototype.CLOSED = SCTransport.prototype.CLOSED;

SCClientSocket.AUTHENTICATED = SCClientSocket.prototype.AUTHENTICATED = 'authenticated';
SCClientSocket.UNAUTHENTICATED = SCClientSocket.prototype.UNAUTHENTICATED = 'unauthenticated';

SCClientSocket.PENDING = SCClientSocket.prototype.PENDING = 'pending';

SCClientSocket.ignoreStatuses = scErrors.socketProtocolIgnoreStatuses;
SCClientSocket.errorStatuses = scErrors.socketProtocolErrorStatuses;

SCClientSocket.prototype._privateEventHandlerMap = {
  '#publish': function (data) {
    var undecoratedChannelName = this._undecorateChannelName(data.channel);
    var isSubscribed = this.isSubscribed(undecoratedChannelName, true);

    if (isSubscribed) {
      this._channelEmitter.emit(undecoratedChannelName, data.data);
    }
  },
  '#kickOut': function (data) {
    var undecoratedChannelName = this._undecorateChannelName(data.channel);
    var channel = this.channels[undecoratedChannelName];
    if (channel) {
      Emitter.prototype.emit.call(this, 'kickOut', data.message, undecoratedChannelName);
      channel.emit('kickOut', data.message, undecoratedChannelName);
      this._triggerChannelUnsubscribe(channel);
    }
  },
  '#setAuthToken': function (data, response) {
    var self = this;

    if (data) {
      var triggerAuthenticate = function (err) {
        if (err) {
          // This is a non-fatal error, we don't want to close the connection
          // because of this but we do want to notify the server and throw an error
          // on the client.
          response.error(err);
          self._onSCError(err);
        } else {
          self._changeToAuthenticatedState(data.token);
          response.end();
        }
      };

      this.auth.saveToken(this.authTokenName, data.token, {}, triggerAuthenticate);
    } else {
      response.error(new InvalidMessageError('No token data provided by #setAuthToken event'));
    }
  },
  '#removeAuthToken': function (data, response) {
    var self = this;

    this.auth.removeToken(this.authTokenName, function (err, oldToken) {
      if (err) {
        // Non-fatal error - Do not close the connection
        response.error(err);
        self._onSCError(err);
      } else {
        Emitter.prototype.emit.call(self, 'removeAuthToken', oldToken);
        self._changeToUnauthenticatedStateAndClearTokens();
        response.end();
      }
    });
  },
  '#disconnect': function (data) {
    this.transport.close(data.code, data.data);
  }
};

SCClientSocket.prototype.getState = function () {
  return this.state;
};

SCClientSocket.prototype.getBytesReceived = function () {
  return this.transport.getBytesReceived();
};

SCClientSocket.prototype.deauthenticate = function (callback) {
  var self = this;

  this.auth.removeToken(this.authTokenName, function (err, oldToken) {
    if (err) {
      // Non-fatal error - Do not close the connection
      self._onSCError(err);
    } else {
      Emitter.prototype.emit.call(self, 'removeAuthToken', oldToken);
      if (self.state !== self.CLOSED) {
        self.emit('#removeAuthToken');
      }
      self._changeToUnauthenticatedStateAndClearTokens();
    }
    callback && callback(err);
  });
};

SCClientSocket.prototype.connect = SCClientSocket.prototype.open = function () {
  var self = this;

  if (!this.active) {
    var error = new InvalidActionError('Cannot connect a destroyed client');
    this._onSCError(error);
    return;
  }

  if (this.state === this.CLOSED) {
    this.pendingReconnect = false;
    this.pendingReconnectTimeout = null;
    clearTimeout(this._reconnectTimeoutRef);

    this.state = this.CONNECTING;
    Emitter.prototype.emit.call(this, 'connecting');

    if (this.transport) {
      this.transport.off();
    }

    this.transport = new SCTransport(this.auth, this.codec, this.options);

    this.transport.on('open', function (status) {
      self.state = self.OPEN;
      self._onSCOpen(status);
    });

    this.transport.on('error', function (err) {
      self._onSCError(err);
    });

    this.transport.on('close', function (code, data) {
      self.state = self.CLOSED;
      self._onSCClose(code, data);
    });

    this.transport.on('openAbort', function (code, data) {
      self.state = self.CLOSED;
      self._onSCClose(code, data, true);
    });

    this.transport.on('event', function (event, data, res) {
      self._onSCEvent(event, data, res);
    });
  }
};

SCClientSocket.prototype.reconnect = function (code, data) {
  this.disconnect(code, data);
  this.connect();
};

SCClientSocket.prototype.disconnect = function (code, data) {
  code = code || 1000;

  if (typeof code !== 'number') {
    throw new InvalidArgumentsError('If specified, the code argument must be a number');
  }

  if (this.state === this.OPEN || this.state === this.CONNECTING) {
    this.transport.close(code, data);
  } else {
    this.pendingReconnect = false;
    this.pendingReconnectTimeout = null;
    clearTimeout(this._reconnectTimeoutRef);
  }
};

SCClientSocket.prototype.destroy = function (code, data) {
  if (isBrowser && global.removeEventListener) {
    global.removeEventListener('beforeunload', this._unloadHandler, false);
  }
  this.active = false;
  this.disconnect(code, data);
  delete this._clientMap[this.clientId];
};

SCClientSocket.prototype._changeToUnauthenticatedStateAndClearTokens = function () {
  if (this.authState !== this.UNAUTHENTICATED) {
    var oldState = this.authState;
    var oldSignedToken = this.signedAuthToken;
    this.authState = this.UNAUTHENTICATED;
    this.signedAuthToken = null;
    this.authToken = null;

    var stateChangeData = {
      oldState: oldState,
      newState: this.authState
    };
    Emitter.prototype.emit.call(this, 'authStateChange', stateChangeData);
    Emitter.prototype.emit.call(this, 'deauthenticate', oldSignedToken);
  }
};

SCClientSocket.prototype._changeToAuthenticatedState = function (signedAuthToken) {
  this.signedAuthToken = signedAuthToken;
  this.authToken = this._extractAuthTokenData(signedAuthToken);

  if (this.authState !== this.AUTHENTICATED) {
    var oldState = this.authState;
    this.authState = this.AUTHENTICATED;
    var stateChangeData = {
      oldState: oldState,
      newState: this.authState,
      signedAuthToken: signedAuthToken,
      authToken: this.authToken
    };
    if (!this.preparingPendingSubscriptions) {
      this.processPendingSubscriptions();
    }

    Emitter.prototype.emit.call(this, 'authStateChange', stateChangeData);
  }
  Emitter.prototype.emit.call(this, 'authenticate', signedAuthToken);
};

SCClientSocket.prototype.decodeBase64 = function (encodedString) {
  return Buffer.from(encodedString, 'base64').toString('utf8');
};

SCClientSocket.prototype.encodeBase64 = function (decodedString) {
  return Buffer.from(decodedString, 'utf8').toString('base64');
};

SCClientSocket.prototype._extractAuthTokenData = function (signedAuthToken) {
  var tokenParts = (signedAuthToken || '').split('.');
  var encodedTokenData = tokenParts[1];
  if (encodedTokenData != null) {
    var tokenData = encodedTokenData;
    try {
      tokenData = this.decodeBase64(tokenData);
      return JSON.parse(tokenData);
    } catch (e) {
      return tokenData;
    }
  }
  return null;
};

SCClientSocket.prototype.getAuthToken = function () {
  return this.authToken;
};

SCClientSocket.prototype.getSignedAuthToken = function () {
  return this.signedAuthToken;
};

// Perform client-initiated authentication by providing an encrypted token string.
SCClientSocket.prototype.authenticate = function (signedAuthToken, callback) {
  var self = this;

  this.emit('#authenticate', signedAuthToken, function (err, authStatus) {
    if (authStatus && authStatus.isAuthenticated != null) {
      // If authStatus is correctly formatted (has an isAuthenticated property),
      // then we will rehydrate the authError.
      if (authStatus.authError) {
        authStatus.authError = scErrors.hydrateError(authStatus.authError);
      }
    } else {
      // Some errors like BadConnectionError and TimeoutError will not pass a valid
      // authStatus object to the current function, so we need to create it ourselves.
      authStatus = {
        isAuthenticated: self.authState,
        authError: null
      };
    }
    if (err) {
      if (err.name !== 'BadConnectionError' && err.name !== 'TimeoutError') {
        // In case of a bad/closed connection or a timeout, we maintain the last
        // known auth state since those errors don't mean that the token is invalid.

        self._changeToUnauthenticatedStateAndClearTokens();
      }
      callback && callback(err, authStatus);
    } else {
      self.auth.saveToken(self.authTokenName, signedAuthToken, {}, function (err) {
        if (err) {
          self._onSCError(err);
        }
        if (authStatus.isAuthenticated) {
          self._changeToAuthenticatedState(signedAuthToken);
        } else {
          self._changeToUnauthenticatedStateAndClearTokens();
        }
        callback && callback(err, authStatus);
      });
    }
  });
};

SCClientSocket.prototype._tryReconnect = function (initialDelay) {
  var self = this;

  var exponent = this.connectAttempts++;
  var reconnectOptions = this.options.autoReconnectOptions;
  var timeout;

  if (initialDelay == null || exponent > 0) {
    var initialTimeout = Math.round(reconnectOptions.initialDelay + (reconnectOptions.randomness || 0) * Math.random());

    timeout = Math.round(initialTimeout * Math.pow(reconnectOptions.multiplier, exponent));
  } else {
    timeout = initialDelay;
  }

  if (timeout > reconnectOptions.maxDelay) {
    timeout = reconnectOptions.maxDelay;
  }

  clearTimeout(this._reconnectTimeoutRef);

  this.pendingReconnect = true;
  this.pendingReconnectTimeout = timeout;
  this._reconnectTimeoutRef = setTimeout(function () {
    self.connect();
  }, timeout);
};

SCClientSocket.prototype._onSCOpen = function (status) {
  var self = this;

  this.preparingPendingSubscriptions = true;

  if (status) {
    this.id = status.id;
    this.pingTimeout = status.pingTimeout;
    this.transport.pingTimeout = this.pingTimeout;
    if (status.isAuthenticated) {
      this._changeToAuthenticatedState(status.authToken);
    } else {
      this._changeToUnauthenticatedStateAndClearTokens();
    }
  } else {
    // This can happen if auth.loadToken (in sctransport.js) fails with
    // an error - This means that the signedAuthToken cannot be loaded by
    // the auth engine and therefore, we need to unauthenticate the client.
    this._changeToUnauthenticatedStateAndClearTokens();
  }

  this.connectAttempts = 0;

  if (this.options.autoSubscribeOnConnect) {
    this.processPendingSubscriptions();
  }

  // If the user invokes the callback while in autoSubscribeOnConnect mode, it
  // won't break anything.
  Emitter.prototype.emit.call(this, 'connect', status, function () {
    self.processPendingSubscriptions();
  });

  if (this.state === this.OPEN) {
    this._flushEmitBuffer();
  }
};

SCClientSocket.prototype._onSCError = function (err) {
  var self = this;

  // Throw error in different stack frame so that error handling
  // cannot interfere with a reconnect action.
  setTimeout(function () {
    if (self.listeners('error').length < 1) {
      throw err;
    } else {
      Emitter.prototype.emit.call(self, 'error', err);
    }
  }, 0);
};

SCClientSocket.prototype._suspendSubscriptions = function () {
  var channel, newState;
  for (var channelName in this.channels) {
    if (this.channels.hasOwnProperty(channelName)) {
      channel = this.channels[channelName];
      if (channel.state === channel.SUBSCRIBED ||
        channel.state === channel.PENDING) {

        newState = channel.PENDING;
      } else {
        newState = channel.UNSUBSCRIBED;
      }

      this._triggerChannelUnsubscribe(channel, newState);
    }
  }
};

SCClientSocket.prototype._abortAllPendingEventsDueToBadConnection = function (failureType) {
  var currentNode = this._emitBuffer.head;
  var nextNode;

  while (currentNode) {
    nextNode = currentNode.next;
    var eventObject = currentNode.data;
    clearTimeout(eventObject.timeout);
    delete eventObject.timeout;
    currentNode.detach();
    currentNode = nextNode;

    var callback = eventObject.callback;
    if (callback) {
      delete eventObject.callback;
      var errorMessage = "Event '" + eventObject.event +
        "' was aborted due to a bad connection";
      var error = new BadConnectionError(errorMessage, failureType);
      callback.call(eventObject, error, eventObject);
    }
    // Cleanup any pending response callback in the transport layer too.
    if (eventObject.cid) {
      this.transport.cancelPendingResponse(eventObject.cid);
    }
  }
};

SCClientSocket.prototype._onSCClose = function (code, data, openAbort) {
  var self = this;

  this.id = null;

  if (this.transport) {
    this.transport.off();
  }
  this.pendingReconnect = false;
  this.pendingReconnectTimeout = null;
  clearTimeout(this._reconnectTimeoutRef);

  this._suspendSubscriptions();
  this._abortAllPendingEventsDueToBadConnection(openAbort ? 'connectAbort' : 'disconnect');

  // Try to reconnect
  // on server ping timeout (4000)
  // or on client pong timeout (4001)
  // or on close without status (1005)
  // or on handshake failure (4003)
  // or on handshake rejection (4008)
  // or on socket hung up (1006)
  if (this.options.autoReconnect) {
    if (code === 4000 || code === 4001 || code === 1005) {
      // If there is a ping or pong timeout or socket closes without
      // status, don't wait before trying to reconnect - These could happen
      // if the client wakes up after a period of inactivity and in this case we
      // want to re-establish the connection as soon as possible.
      this._tryReconnect(0);

      // Codes 4500 and above will be treated as permanent disconnects.
      // Socket will not try to auto-reconnect.
    } else if (code !== 1000 && code < 4500) {
      this._tryReconnect();
    }
  }

  if (openAbort) {
    Emitter.prototype.emit.call(self, 'connectAbort', code, data);
  } else {
    Emitter.prototype.emit.call(self, 'disconnect', code, data);
  }
  Emitter.prototype.emit.call(self, 'close', code, data);

  if (!SCClientSocket.ignoreStatuses[code]) {
    var closeMessage;
    if (data) {
      closeMessage = 'Socket connection closed with status code ' + code + ' and reason: ' + data;
    } else {
      closeMessage = 'Socket connection closed with status code ' + code;
    }
    var err = new SocketProtocolError(SCClientSocket.errorStatuses[code] || closeMessage, code);
    this._onSCError(err);
  }
};

SCClientSocket.prototype._onSCEvent = function (event, data, res) {
  var handler = this._privateEventHandlerMap[event];
  if (handler) {
    handler.call(this, data, res);
  } else {
    Emitter.prototype.emit.call(this, event, data, function () {
      res && res.callback.apply(res, arguments);
    });
  }
};

SCClientSocket.prototype.decode = function (message) {
  return this.transport.decode(message);
};

SCClientSocket.prototype.encode = function (object) {
  return this.transport.encode(object);
};

SCClientSocket.prototype._flushEmitBuffer = function () {
  var currentNode = this._emitBuffer.head;
  var nextNode;

  while (currentNode) {
    nextNode = currentNode.next;
    var eventObject = currentNode.data;
    currentNode.detach();
    this.transport.emitObject(eventObject);
    currentNode = nextNode;
  }
};

SCClientSocket.prototype._handleEventAckTimeout = function (eventObject, eventNode) {
  if (eventNode) {
    eventNode.detach();
  }
  delete eventObject.timeout;

  var callback = eventObject.callback;
  if (callback) {
    delete eventObject.callback;
    var error = new TimeoutError("Event response for '" + eventObject.event + "' timed out");
    callback.call(eventObject, error, eventObject);
  }
  // Cleanup any pending response callback in the transport layer too.
  if (eventObject.cid) {
    this.transport.cancelPendingResponse(eventObject.cid);
  }
};

SCClientSocket.prototype._emit = function (event, data, callback) {
  var self = this;

  if (this.state === this.CLOSED) {
    this.connect();
  }
  var eventObject = {
    event: event,
    callback: callback
  };

  var eventNode = new LinkedList.Item();

  if (this.options.cloneData) {
    eventObject.data = clone(data);
  } else {
    eventObject.data = data;
  }
  eventNode.data = eventObject;

  eventObject.timeout = setTimeout(function () {
    self._handleEventAckTimeout(eventObject, eventNode);
  }, this.ackTimeout);

  this._emitBuffer.append(eventNode);
  if (this.state === this.OPEN) {
    this._flushEmitBuffer();
  }
};

SCClientSocket.prototype.send = function (data) {
  this.transport.send(data);
};

SCClientSocket.prototype.emit = function (event, data, callback) {
  if (this._localEvents[event] == null) {
    this._emit(event, data, callback);
  } else if (event === 'error') {
    Emitter.prototype.emit.call(this, event, data);
  } else {
    var error = new InvalidActionError('The "' + event + '" event is reserved and cannot be emitted on a client socket');
    this._onSCError(error);
  }
};

SCClientSocket.prototype.publish = function (channelName, data, callback) {
  var pubData = {
    channel: this._decorateChannelName(channelName),
    data: data
  };
  this.emit('#publish', pubData, callback);
};

SCClientSocket.prototype._triggerChannelSubscribe = function (channel, subscriptionOptions) {
  var channelName = channel.name;

  if (channel.state !== channel.SUBSCRIBED) {
    var oldState = channel.state;
    channel.state = channel.SUBSCRIBED;

    var stateChangeData = {
      channel: channelName,
      oldState: oldState,
      newState: channel.state,
      subscriptionOptions: subscriptionOptions
    };
    channel.emit('subscribeStateChange', stateChangeData);
    channel.emit('subscribe', channelName, subscriptionOptions);
    Emitter.prototype.emit.call(this, 'subscribeStateChange', stateChangeData);
    Emitter.prototype.emit.call(this, 'subscribe', channelName, subscriptionOptions);
  }
};

SCClientSocket.prototype._triggerChannelSubscribeFail = function (err, channel, subscriptionOptions) {
  var channelName = channel.name;
  var meetsAuthRequirements = !channel.waitForAuth || this.authState === this.AUTHENTICATED;

  if (channel.state !== channel.UNSUBSCRIBED && meetsAuthRequirements) {
    channel.state = channel.UNSUBSCRIBED;

    channel.emit('subscribeFail', err, channelName, subscriptionOptions);
    Emitter.prototype.emit.call(this, 'subscribeFail', err, channelName, subscriptionOptions);
  }
};

// Cancel any pending subscribe callback
SCClientSocket.prototype._cancelPendingSubscribeCallback = function (channel) {
  if (channel._pendingSubscriptionCid != null) {
    this.transport.cancelPendingResponse(channel._pendingSubscriptionCid);
    delete channel._pendingSubscriptionCid;
  }
};

SCClientSocket.prototype._decorateChannelName = function (channelName) {
  if (this.channelPrefix) {
    channelName = this.channelPrefix + channelName;
  }
  return channelName;
};

SCClientSocket.prototype._undecorateChannelName = function (decoratedChannelName) {
  if (this.channelPrefix && decoratedChannelName.indexOf(this.channelPrefix) === 0) {
    return decoratedChannelName.replace(this.channelPrefix, '');
  }
  return decoratedChannelName;
};

SCClientSocket.prototype._trySubscribe = function (channel) {
  var self = this;

  var meetsAuthRequirements = !channel.waitForAuth || this.authState === this.AUTHENTICATED;

  // We can only ever have one pending subscribe action at any given time on a channel
  if (this.state === this.OPEN && !this.preparingPendingSubscriptions &&
    channel._pendingSubscriptionCid == null && meetsAuthRequirements) {

    var options = {
      noTimeout: true
    };

    var subscriptionOptions = {
      channel: this._decorateChannelName(channel.name)
    };
    if (channel.waitForAuth) {
      options.waitForAuth = true;
      subscriptionOptions.waitForAuth = options.waitForAuth;
    }
    if (channel.data) {
      subscriptionOptions.data = channel.data;
    }
    if (channel.batch) {
      options.batch = true;
      subscriptionOptions.batch = true;
    }

    channel._pendingSubscriptionCid = this.transport.emit(
      '#subscribe', subscriptionOptions, options,
      function (err) {
        delete channel._pendingSubscriptionCid;
        if (err) {
          self._triggerChannelSubscribeFail(err, channel, subscriptionOptions);
        } else {
          self._triggerChannelSubscribe(channel, subscriptionOptions);
        }
      }
    );
    Emitter.prototype.emit.call(this, 'subscribeRequest', channel.name, subscriptionOptions);
  }
};

SCClientSocket.prototype.subscribe = function (channelName, options) {
  var channel = this.channels[channelName];

  if (!channel) {
    channel = new SCChannel(channelName, this, options);
    this.channels[channelName] = channel;
  } else if (options) {
    channel.setOptions(options);
  }

  if (channel.state === channel.UNSUBSCRIBED) {
    channel.state = channel.PENDING;
    this._trySubscribe(channel);
  }

  return channel;
};

SCClientSocket.prototype._triggerChannelUnsubscribe = function (channel, newState) {
  var channelName = channel.name;
  var oldState = channel.state;

  if (newState) {
    channel.state = newState;
  } else {
    channel.state = channel.UNSUBSCRIBED;
  }
  this._cancelPendingSubscribeCallback(channel);

  if (oldState === channel.SUBSCRIBED) {
    var stateChangeData = {
      channel: channelName,
      oldState: oldState,
      newState: channel.state
    };
    channel.emit('subscribeStateChange', stateChangeData);
    channel.emit('unsubscribe', channelName);
    Emitter.prototype.emit.call(this, 'subscribeStateChange', stateChangeData);
    Emitter.prototype.emit.call(this, 'unsubscribe', channelName);
  }
};

SCClientSocket.prototype._tryUnsubscribe = function (channel) {
  var self = this;

  if (this.state === this.OPEN) {
    var options = {
      noTimeout: true
    };
    if (channel.batch) {
      options.batch = true;
    }
    // If there is a pending subscribe action, cancel the callback
    this._cancelPendingSubscribeCallback(channel);

    // This operation cannot fail because the TCP protocol guarantees delivery
    // so long as the connection remains open. If the connection closes,
    // the server will automatically unsubscribe the client and thus complete
    // the operation on the server side.
    var decoratedChannelName = this._decorateChannelName(channel.name);
    this.transport.emit('#unsubscribe', decoratedChannelName, options);
  }
};

SCClientSocket.prototype.unsubscribe = function (channelName) {
  var channel = this.channels[channelName];

  if (channel) {
    if (channel.state !== channel.UNSUBSCRIBED) {
      this._triggerChannelUnsubscribe(channel);
      this._tryUnsubscribe(channel);
    }
  }
};

SCClientSocket.prototype.channel = function (channelName, options) {
  var currentChannel = this.channels[channelName];

  if (!currentChannel) {
    currentChannel = new SCChannel(channelName, this, options);
    this.channels[channelName] = currentChannel;
  }
  return currentChannel;
};

SCClientSocket.prototype.destroyChannel = function (channelName) {
  var channel = this.channels[channelName];

  if (channel) {
    channel.unwatch();
    channel.unsubscribe();
    delete this.channels[channelName];
  }
};

SCClientSocket.prototype.subscriptions = function (includePending) {
  var subs = [];
  var channel, includeChannel;
  for (var channelName in this.channels) {
    if (this.channels.hasOwnProperty(channelName)) {
      channel = this.channels[channelName];

      if (includePending) {
        includeChannel = channel && (channel.state === channel.SUBSCRIBED ||
          channel.state === channel.PENDING);
      } else {
        includeChannel = channel && channel.state === channel.SUBSCRIBED;
      }

      if (includeChannel) {
        subs.push(channelName);
      }
    }
  }
  return subs;
};

SCClientSocket.prototype.isSubscribed = function (channelName, includePending) {
  var channel = this.channels[channelName];
  if (includePending) {
    return !!channel && (channel.state === channel.SUBSCRIBED ||
      channel.state === channel.PENDING);
  }
  return !!channel && channel.state === channel.SUBSCRIBED;
};

SCClientSocket.prototype.processPendingSubscriptions = function () {
  var self = this;

  this.preparingPendingSubscriptions = false;

  var pendingChannels = [];

  for (var i in this.channels) {
    if (this.channels.hasOwnProperty(i)) {
      var channel = this.channels[i];
      if (channel.state === channel.PENDING) {
        pendingChannels.push(channel);
      }
    }
  }

  pendingChannels.sort(function (a, b) {
    var ap = a.priority || 0;
    var bp = b.priority || 0;
    if (ap > bp) {
      return -1;
    }
    if (ap < bp) {
      return 1;
    }
    return 0;
  });

  pendingChannels.forEach(function (channel) {
    self._trySubscribe(channel);
  });
};

SCClientSocket.prototype.watch = function (channelName, handler) {
  if (typeof handler !== 'function') {
    throw new InvalidArgumentsError('No handler function was provided');
  }
  this._channelEmitter.on(channelName, handler);
};

SCClientSocket.prototype.unwatch = function (channelName, handler) {
  if (handler) {
    this._channelEmitter.removeListener(channelName, handler);
  } else {
    this._channelEmitter.removeAllListeners(channelName);
  }
};

SCClientSocket.prototype.watchers = function (channelName) {
  return this._channelEmitter.listeners(channelName);
};

module.exports = SCClientSocket;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/socketcluster-client/lib/scclientsocket.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/lib/scclientsocket.js",}],
[1884, {}, function (require, module, exports) {
/* global window */
var GetParams = function (func) {
	'use strict';

	if (typeof func !== 'function') {
		return [];
	}

	var patternComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var patternArguments = /([^\s,]+)/g;

	var funcString = func
		.toString()
		.replace(patternComments, '');

	var result = funcString
		.slice(
			funcString.indexOf('(') + 1,
			funcString.indexOf(')')
		)
		.match(patternArguments);

	if (result === null) {
		return [];
	}

	return result;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = GetParams;
}

if (typeof window !== 'undefined') {
	window.GetParams = GetParams;
}

//# sourceMappingURL=node_modules/get-params/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/get-params/index.js",}],
[2723, {}, function (require, module, exports) {
// This alphabet uses a-z A-Z 0-9 _- symbols.
// Symbols are generated for smaller size.
// -_zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA
var url = '-_'
// Loop from 36 to 0 (from z to a and 9 to 0 in Base36).
var i = 36
while (i--) {
  // 36 is radix. Number.prototype.toString(36) returns number
  // in Base36 representation. Base36 is like hex, but it uses 0–9 and a-z.
  url += i.toString(36)
}
// Loop from 36 to 10 (from Z to A in Base36).
i = 36
while (i-- - 10) {
  url += i.toString(36).toUpperCase()
}

/**
 * Generate URL-friendly unique ID. This method use non-secure predictable
 * random generator with bigger collision probability.
 *
 * @param {number} [size=21] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * const nanoid = require('nanoid/non-secure')
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 *
 * @name nonSecure
 * @function
 */
module.exports = function (size) {
  var id = ''
  i = size || 21
  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (i--) {
    // `| 0` is compact and faster alternative for `Math.floor()`
    id += url[Math.random() * 64 | 0]
  }
  return id
}

//# sourceMappingURL=node_modules/nanoid/non-secure/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/nanoid/non-secure/index.js",}],
[3157, {"../constants/options":3155,"../helpers":3156}, function (require, module, exports) {
var helpers = require('../helpers');
var mark = helpers.mark;
var extract = helpers.extract;
var refer = helpers.refer;
var options = require('../constants/options');

module.exports = function serialize(
  Immutable,
  refs,
  customReplacer,
  customReviver
) {
  function replacer(key, value) {
    if (value instanceof Immutable.Record)
      return refer(value, 'ImmutableRecord', 'toObject', refs);
    if (value instanceof Immutable.Range)
      return extract(value, 'ImmutableRange');
    if (value instanceof Immutable.Repeat)
      return extract(value, 'ImmutableRepeat');
    if (Immutable.OrderedMap.isOrderedMap(value))
      return mark(value, 'ImmutableOrderedMap', 'toObject');
    if (Immutable.Map.isMap(value))
      return mark(value, 'ImmutableMap', 'toObject');
    if (Immutable.List.isList(value))
      return mark(value, 'ImmutableList', 'toArray');
    if (Immutable.OrderedSet.isOrderedSet(value))
      return mark(value, 'ImmutableOrderedSet', 'toArray');
    if (Immutable.Set.isSet(value))
      return mark(value, 'ImmutableSet', 'toArray');
    if (Immutable.Seq.isSeq(value))
      return mark(value, 'ImmutableSeq', 'toArray');
    if (Immutable.Stack.isStack(value))
      return mark(value, 'ImmutableStack', 'toArray');
    return value;
  }

  function reviver(key, value) {
    if (
      typeof value === 'object' &&
      value !== null &&
      '__serializedType__' in value
    ) {
      var data = value.data;
      switch (value.__serializedType__) {
        case 'ImmutableMap':
          return Immutable.Map(data);
        case 'ImmutableOrderedMap':
          return Immutable.OrderedMap(data);
        case 'ImmutableList':
          return Immutable.List(data);
        case 'ImmutableRange':
          return Immutable.Range(data._start, data._end, data._step);
        case 'ImmutableRepeat':
          return Immutable.Repeat(data._value, data.size);
        case 'ImmutableSet':
          return Immutable.Set(data);
        case 'ImmutableOrderedSet':
          return Immutable.OrderedSet(data);
        case 'ImmutableSeq':
          return Immutable.Seq(data);
        case 'ImmutableStack':
          return Immutable.Stack(data);
        case 'ImmutableRecord':
          return refs && refs[value.__serializedRef__]
            ? new refs[value.__serializedRef__](data)
            : Immutable.Map(data);
        default:
          return data;
      }
    }
    return value;
  }

  return {
    replacer: customReplacer
      ? function (key, value) {
          return customReplacer(key, value, replacer);
        }
      : replacer,
    reviver: customReviver
      ? function (key, value) {
          return customReviver(key, value, reviver);
        }
      : reviver,
    options: options,
  };
};

//# sourceMappingURL=node_modules/remotedev-serialize/immutable/serialize.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/remotedev-serialize/immutable/serialize.js",}],
[3142, {"_process":2892,"lodash/difference":2627,"lodash/isPlainObject":2642,"lodash/union":2654,"symbol-observable":3381}, function (require, module, exports) {
(function (process){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.liftAction = liftAction;
exports.liftReducerWith = liftReducerWith;
exports.unliftState = unliftState;
exports.unliftStore = unliftStore;
exports["default"] = instrument;
exports.INIT_ACTION = exports.ActionCreators = exports.ActionTypes = void 0;

var _difference = _interopRequireDefault(require("lodash/difference"));

var _union = _interopRequireDefault(require("lodash/union"));

var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));

var _symbolObservable = _interopRequireDefault(require("symbol-observable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  SET_ACTIONS_ACTIVE: 'SET_ACTIONS_ACTIVE',
  JUMP_TO_STATE: 'JUMP_TO_STATE',
  JUMP_TO_ACTION: 'JUMP_TO_ACTION',
  REORDER_ACTION: 'REORDER_ACTION',
  IMPORT_STATE: 'IMPORT_STATE',
  LOCK_CHANGES: 'LOCK_CHANGES',
  PAUSE_RECORDING: 'PAUSE_RECORDING'
};
exports.ActionTypes = ActionTypes;
var isChrome = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && (typeof window.chrome !== 'undefined' || typeof window.process !== 'undefined' && window.process.type === 'renderer');
var isChromeOrNode = isChrome || typeof process !== 'undefined' && process.release && process.release.name === 'node';

/**
 * Action creators to change the History state.
 */
var ActionCreators = {
  performAction: function performAction(action, trace, traceLimit, // eslint-disable-next-line @typescript-eslint/ban-types
  toExcludeFromTrace) {
    if (!(0, _isPlainObject["default"])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    var stack;

    if (trace) {
      var extraFrames = 0;

      if (typeof trace === 'function') {
        stack = trace(action);
      } else {
        var error = Error();
        var prevStackTraceLimit;

        if (Error.captureStackTrace && isChromeOrNode) {
          // avoid error-polyfill
          if (traceLimit && Error.stackTraceLimit < traceLimit) {
            prevStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = traceLimit;
          }

          Error.captureStackTrace(error, toExcludeFromTrace);
        } else {
          extraFrames = 3;
        }

        stack = error.stack;
        if (prevStackTraceLimit) Error.stackTraceLimit = prevStackTraceLimit;

        if (extraFrames || typeof Error.stackTraceLimit !== 'number' || traceLimit && Error.stackTraceLimit > traceLimit) {
          if (stack != null) {
            var frames = stack.split('\n');

            if (traceLimit && frames.length > traceLimit) {
              stack = frames.slice(0, traceLimit + extraFrames + (frames[0].startsWith('Error') ? 1 : 0)).join('\n');
            }
          }
        }
      }
    }

    return {
      type: ActionTypes.PERFORM_ACTION,
      action: action,
      timestamp: Date.now(),
      stack: stack
    };
  },
  reset: function reset() {
    return {
      type: ActionTypes.RESET,
      timestamp: Date.now()
    };
  },
  rollback: function rollback() {
    return {
      type: ActionTypes.ROLLBACK,
      timestamp: Date.now()
    };
  },
  commit: function commit() {
    return {
      type: ActionTypes.COMMIT,
      timestamp: Date.now()
    };
  },
  sweep: function sweep() {
    return {
      type: ActionTypes.SWEEP
    };
  },
  toggleAction: function toggleAction(id) {
    return {
      type: ActionTypes.TOGGLE_ACTION,
      id: id
    };
  },
  setActionsActive: function setActionsActive(start, end) {
    var active = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return {
      type: ActionTypes.SET_ACTIONS_ACTIVE,
      start: start,
      end: end,
      active: active
    };
  },
  reorderAction: function reorderAction(actionId, beforeActionId) {
    return {
      type: ActionTypes.REORDER_ACTION,
      actionId: actionId,
      beforeActionId: beforeActionId
    };
  },
  jumpToState: function jumpToState(index) {
    return {
      type: ActionTypes.JUMP_TO_STATE,
      index: index
    };
  },
  jumpToAction: function jumpToAction(actionId) {
    return {
      type: ActionTypes.JUMP_TO_ACTION,
      actionId: actionId
    };
  },
  importState: function importState(nextLiftedState, noRecompute) {
    return {
      type: ActionTypes.IMPORT_STATE,
      nextLiftedState: nextLiftedState,
      noRecompute: noRecompute
    };
  },
  lockChanges: function lockChanges(status) {
    return {
      type: ActionTypes.LOCK_CHANGES,
      status: status
    };
  },
  pauseRecording: function pauseRecording(status) {
    return {
      type: ActionTypes.PAUSE_RECORDING,
      status: status
    };
  }
};
exports.ActionCreators = ActionCreators;
var INIT_ACTION = {
  type: '@@INIT'
};
/**
 * Computes the next entry with exceptions catching.
 */

exports.INIT_ACTION = INIT_ACTION;

function computeWithTryCatch(reducer, action, state) {
  var nextState = state;
  var nextError;

  try {
    nextState = reducer(state, action);
  } catch (err) {
    nextError = err.toString();

    if (isChrome) {
      // In Chrome, rethrowing provides better source map support
      setTimeout(function () {
        throw err;
      });
    } else {
      console.error(err); // eslint-disable-line no-console
    }
  }

  return {
    state: nextState,
    error: nextError
  };
}
/**
 * Computes the next entry in the log by applying an action.
 */


function computeNextEntry(reducer, action, state, shouldCatchErrors) {
  if (!shouldCatchErrors) {
    return {
      state: reducer(state, action)
    };
  }

  return computeWithTryCatch(reducer, action, state);
}
/**
 * Runs the reducer on invalidated actions to get a fresh computation log.
 */


function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, shouldCatchErrors) {
  // Optimization: exit early and return the same reference
  // if we know nothing could have changed.
  if (!computedStates || minInvalidatedStateIndex === -1 || minInvalidatedStateIndex >= computedStates.length && computedStates.length === stagedActionIds.length) {
    return computedStates;
  }

  var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);

  for (var i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
    var _actionId = stagedActionIds[i];
    var _action = actionsById[_actionId].action;
    var previousEntry = nextComputedStates[i - 1];
    var previousState = previousEntry ? previousEntry.state : committedState;
    var shouldSkip = skippedActionIds.indexOf(_actionId) > -1;
    var entry = void 0;

    if (shouldSkip) {
      entry = previousEntry;
    } else {
      if (shouldCatchErrors && previousEntry && previousEntry.error) {
        entry = {
          state: previousState,
          error: 'Interrupted by an error up the chain'
        };
      } else {
        entry = computeNextEntry(reducer, _action, previousState, shouldCatchErrors);
      }
    }

    nextComputedStates.push(entry);
  }

  return nextComputedStates;
}
/**
 * Lifts an app's action into an action on the lifted store.
 */


function liftAction(action, trace, traceLimit, // eslint-disable-next-line @typescript-eslint/ban-types
toExcludeFromTrace) {
  return ActionCreators.performAction(action, trace, traceLimit, toExcludeFromTrace);
}

function isArray(nextLiftedState) {
  return Array.isArray(nextLiftedState);
}

/**
 * Creates a history state reducer from an app's reducer.
 */
function liftReducerWith(reducer, initialCommittedState, monitorReducer, options) {
  var initialLiftedState = {
    monitorState: monitorReducer(undefined, {}),
    nextActionId: 1,
    actionsById: {
      0: liftAction(INIT_ACTION)
    },
    stagedActionIds: [0],
    skippedActionIds: [],
    committedState: initialCommittedState,
    currentStateIndex: 0,
    computedStates: [],
    isLocked: options.shouldStartLocked === true,
    isPaused: options.shouldRecordChanges === false
  };
  /**
   * Manages how the history actions modify the history state.
   */

  return function (liftedState, liftedAction) {
    var _ref = liftedState || initialLiftedState,
        monitorState = _ref.monitorState,
        actionsById = _ref.actionsById,
        nextActionId = _ref.nextActionId,
        stagedActionIds = _ref.stagedActionIds,
        skippedActionIds = _ref.skippedActionIds,
        committedState = _ref.committedState,
        currentStateIndex = _ref.currentStateIndex,
        computedStates = _ref.computedStates,
        isLocked = _ref.isLocked,
        isPaused = _ref.isPaused;

    if (!liftedState) {
      // Prevent mutating initialLiftedState
      actionsById = _objectSpread({}, actionsById);
    }

    function commitExcessActions(n) {
      // Auto-commits n-number of excess actions.
      var excess = n;
      var idsToDelete = stagedActionIds.slice(1, excess + 1);

      for (var i = 0; i < idsToDelete.length; i++) {
        if (computedStates[i + 1].error) {
          // Stop if error is found. Commit actions up to error.
          excess = i;
          idsToDelete = stagedActionIds.slice(1, excess + 1);
          break;
        } else {
          delete actionsById[idsToDelete[i]];
        }
      }

      skippedActionIds = skippedActionIds.filter(function (id) {
        return idsToDelete.indexOf(id) === -1;
      });
      stagedActionIds = [0].concat(_toConsumableArray(stagedActionIds.slice(excess + 1)));
      committedState = computedStates[excess].state;
      computedStates = computedStates.slice(excess);
      currentStateIndex = currentStateIndex > excess ? currentStateIndex - excess : 0;
    }

    function computePausedAction(shouldInit) {
      var computedState;

      if (shouldInit) {
        computedState = computedStates[currentStateIndex];
        monitorState = monitorReducer(monitorState, liftedAction);
      } else {
        computedState = computeNextEntry(reducer, liftedAction.action, computedStates[currentStateIndex].state, false);
      }

      if (!options.pauseActionType || nextActionId === 1) {
        return {
          monitorState: monitorState,
          actionsById: {
            0: liftAction(INIT_ACTION)
          },
          nextActionId: 1,
          stagedActionIds: [0],
          skippedActionIds: [],
          committedState: computedState.state,
          currentStateIndex: 0,
          computedStates: [computedState],
          isLocked: isLocked,
          isPaused: true
        };
      }

      if (shouldInit) {
        if (currentStateIndex === stagedActionIds.length - 1) {
          currentStateIndex++;
        }

        stagedActionIds = [].concat(_toConsumableArray(stagedActionIds), [nextActionId]);
        nextActionId++;
      }

      return {
        monitorState: monitorState,
        actionsById: _objectSpread(_objectSpread({}, actionsById), {}, _defineProperty({}, nextActionId - 1, liftAction({
          type: options.pauseActionType
        }))),
        nextActionId: nextActionId,
        stagedActionIds: stagedActionIds,
        skippedActionIds: skippedActionIds,
        committedState: committedState,
        currentStateIndex: currentStateIndex,
        computedStates: [].concat(_toConsumableArray(computedStates.slice(0, stagedActionIds.length - 1)), [computedState]),
        isLocked: isLocked,
        isPaused: true
      };
    } // By default, aggressively recompute every state whatever happens.
    // This has O(n) performance, so we'll override this to a sensible
    // value whenever we feel like we don't have to recompute the states.


    var minInvalidatedStateIndex = 0; // maxAge number can be changed dynamically

    var maxAge = options.maxAge;
    if (typeof maxAge === 'function') maxAge = maxAge(liftedAction, liftedState);

    if (/^@@redux\/(INIT|REPLACE)/.test(liftedAction.type)) {
      if (options.shouldHotReload === false) {
        actionsById = {
          0: liftAction(INIT_ACTION)
        };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = computedStates.length === 0 ? initialCommittedState : computedStates[currentStateIndex].state;
        currentStateIndex = 0;
        computedStates = [];
      } // Recompute states on hot reload and init.


      minInvalidatedStateIndex = 0;

      if (maxAge && stagedActionIds.length > maxAge) {
        // States must be recomputed before committing excess.
        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, options.shouldCatchErrors);
        commitExcessActions(stagedActionIds.length - maxAge); // Avoid double computation.

        minInvalidatedStateIndex = Infinity;
      }
    } else {
      switch (liftedAction.type) {
        case ActionTypes.PERFORM_ACTION:
          {
            if (isLocked) return liftedState || initialLiftedState;
            if (isPaused) return computePausedAction(); // Auto-commit as new actions come in.

            if (maxAge && stagedActionIds.length >= maxAge) {
              commitExcessActions(stagedActionIds.length - maxAge + 1);
            }

            if (currentStateIndex === stagedActionIds.length - 1) {
              currentStateIndex++;
            }

            var _actionId2 = nextActionId++; // Mutation! This is the hottest path, and we optimize on purpose.
            // It is safe because we set a new key in a cache dictionary.


            actionsById[_actionId2] = liftedAction;
            stagedActionIds = [].concat(_toConsumableArray(stagedActionIds), [_actionId2]); // Optimization: we know that only the new action needs computing.

            minInvalidatedStateIndex = stagedActionIds.length - 1;
            break;
          }

        case ActionTypes.RESET:
          {
            // Get back to the state the store was created with.
            actionsById = {
              0: liftAction(INIT_ACTION)
            };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            committedState = initialCommittedState;
            currentStateIndex = 0;
            computedStates = [];
            break;
          }

        case ActionTypes.COMMIT:
          {
            // Consider the last committed state the new starting point.
            // Squash any staged actions into a single committed state.
            actionsById = {
              0: liftAction(INIT_ACTION)
            };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            committedState = computedStates[currentStateIndex].state;
            currentStateIndex = 0;
            computedStates = [];
            break;
          }

        case ActionTypes.ROLLBACK:
          {
            // Forget about any staged actions.
            // Start again from the last committed state.
            actionsById = {
              0: liftAction(INIT_ACTION)
            };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            currentStateIndex = 0;
            computedStates = [];
            break;
          }

        case ActionTypes.TOGGLE_ACTION:
          {
            // Toggle whether an action with given ID is skipped.
            // Being skipped means it is a no-op during the computation.
            var _actionId3 = liftedAction.id;
            var index = skippedActionIds.indexOf(_actionId3);

            if (index === -1) {
              skippedActionIds = [_actionId3].concat(_toConsumableArray(skippedActionIds));
            } else {
              skippedActionIds = skippedActionIds.filter(function (id) {
                return id !== _actionId3;
              });
            } // Optimization: we know history before this action hasn't changed


            minInvalidatedStateIndex = stagedActionIds.indexOf(_actionId3);
            break;
          }

        case ActionTypes.SET_ACTIONS_ACTIVE:
          {
            // Toggle whether an action with given ID is skipped.
            // Being skipped means it is a no-op during the computation.
            var start = liftedAction.start,
                end = liftedAction.end,
                active = liftedAction.active;
            var actionIds = [];

            for (var i = start; i < end; i++) {
              actionIds.push(i);
            }

            if (active) {
              skippedActionIds = (0, _difference["default"])(skippedActionIds, actionIds);
            } else {
              skippedActionIds = (0, _union["default"])(skippedActionIds, actionIds);
            } // Optimization: we know history before this action hasn't changed


            minInvalidatedStateIndex = stagedActionIds.indexOf(start);
            break;
          }

        case ActionTypes.JUMP_TO_STATE:
          {
            // Without recomputing anything, move the pointer that tell us
            // which state is considered the current one. Useful for sliders.
            currentStateIndex = liftedAction.index; // Optimization: we know the history has not changed.

            minInvalidatedStateIndex = Infinity;
            break;
          }

        case ActionTypes.JUMP_TO_ACTION:
          {
            // Jumps to a corresponding state to a specific action.
            // Useful when filtering actions.
            var _index = stagedActionIds.indexOf(liftedAction.actionId);

            if (_index !== -1) currentStateIndex = _index;
            minInvalidatedStateIndex = Infinity;
            break;
          }

        case ActionTypes.SWEEP:
          {
            // Forget any actions that are currently being skipped.
            stagedActionIds = (0, _difference["default"])(stagedActionIds, skippedActionIds);
            skippedActionIds = [];
            currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
            break;
          }

        case ActionTypes.REORDER_ACTION:
          {
            // Recompute actions in a new order.
            var _actionId4 = liftedAction.actionId;
            var idx = stagedActionIds.indexOf(_actionId4); // do nothing in case the action is already removed or trying to move the first action

            if (idx < 1) break;
            var beforeActionId = liftedAction.beforeActionId;
            var newIdx = stagedActionIds.indexOf(beforeActionId);

            if (newIdx < 1) {
              // move to the beginning or to the end
              var count = stagedActionIds.length;
              newIdx = beforeActionId > stagedActionIds[count - 1] ? count : 1;
            }

            var diff = idx - newIdx;

            if (diff > 0) {
              // move left
              stagedActionIds = [].concat(_toConsumableArray(stagedActionIds.slice(0, newIdx)), [_actionId4], _toConsumableArray(stagedActionIds.slice(newIdx, idx)), _toConsumableArray(stagedActionIds.slice(idx + 1)));
              minInvalidatedStateIndex = newIdx;
            } else if (diff < 0) {
              // move right
              stagedActionIds = [].concat(_toConsumableArray(stagedActionIds.slice(0, idx)), _toConsumableArray(stagedActionIds.slice(idx + 1, newIdx)), [_actionId4], _toConsumableArray(stagedActionIds.slice(newIdx)));
              minInvalidatedStateIndex = idx;
            }

            break;
          }

        case ActionTypes.IMPORT_STATE:
          {
            if (isArray(liftedAction.nextLiftedState)) {
              // recompute array of actions
              actionsById = {
                0: liftAction(INIT_ACTION)
              };
              nextActionId = 1;
              stagedActionIds = [0];
              skippedActionIds = [];
              currentStateIndex = liftedAction.nextLiftedState.length;
              computedStates = [];
              committedState = liftedAction.preloadedState;
              minInvalidatedStateIndex = 0; // iterate through actions

              liftedAction.nextLiftedState.forEach(function (action) {
                actionsById[nextActionId] = liftAction(action, options.trace || options.shouldIncludeCallstack);
                stagedActionIds.push(nextActionId);
                nextActionId++;
              });
            } else {
              // Completely replace everything.
              var _liftedAction$nextLif = liftedAction.nextLiftedState;
              monitorState = _liftedAction$nextLif.monitorState;
              actionsById = _liftedAction$nextLif.actionsById;
              nextActionId = _liftedAction$nextLif.nextActionId;
              stagedActionIds = _liftedAction$nextLif.stagedActionIds;
              skippedActionIds = _liftedAction$nextLif.skippedActionIds;
              committedState = _liftedAction$nextLif.committedState;
              currentStateIndex = _liftedAction$nextLif.currentStateIndex;
              computedStates = _liftedAction$nextLif.computedStates;

              if (liftedAction.noRecompute) {
                minInvalidatedStateIndex = Infinity;
              }
            }

            break;
          }

        case ActionTypes.LOCK_CHANGES:
          {
            isLocked = liftedAction.status;
            minInvalidatedStateIndex = Infinity;
            break;
          }

        case ActionTypes.PAUSE_RECORDING:
          {
            isPaused = liftedAction.status;

            if (isPaused) {
              return computePausedAction(true);
            } // Commit when unpausing


            actionsById = {
              0: liftAction(INIT_ACTION)
            };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            committedState = computedStates[currentStateIndex].state;
            currentStateIndex = 0;
            computedStates = [];
            break;
          }

        default:
          {
            // If the action is not recognized, it's a monitor action.
            // Optimization: a monitor action can't change history.
            minInvalidatedStateIndex = Infinity;
            break;
          }
      }
    }

    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, options.shouldCatchErrors);
    monitorState = monitorReducer(monitorState, liftedAction);
    return {
      monitorState: monitorState,
      actionsById: actionsById,
      nextActionId: nextActionId,
      stagedActionIds: stagedActionIds,
      skippedActionIds: skippedActionIds,
      committedState: committedState,
      currentStateIndex: currentStateIndex,
      computedStates: computedStates,
      isLocked: isLocked,
      isPaused: isPaused
    };
  };
}
/**
 * Provides an app's view into the state of the lifted store.
 */


function unliftState(liftedState) {
  var computedStates = liftedState.computedStates,
      currentStateIndex = liftedState.currentStateIndex;
  var state = computedStates[currentStateIndex].state;
  return state;
}

/**
 * Provides an app's view into the lifted store.
 */
function unliftStore(liftedStore, liftReducer, options) {
  var lastDefinedState;
  var trace = options.trace || options.shouldIncludeCallstack;
  var traceLimit = options.traceLimit || 10;

  function getState() {
    var state = unliftState(liftedStore.getState());

    if (state !== undefined) {
      lastDefinedState = state;
    }

    return lastDefinedState;
  }

  function dispatch(action) {
    liftedStore.dispatch(liftAction(action, trace, traceLimit, dispatch));
    return action;
  }

  return _objectSpread(_objectSpread({}, liftedStore), {}, _defineProperty({
    liftedStore: liftedStore,
    dispatch: dispatch,
    getState: getState,
    replaceReducer: function replaceReducer(nextReducer) {
      liftedStore.replaceReducer(liftReducer(nextReducer));
    }
  }, _symbolObservable["default"], function () {
    return _objectSpread(_objectSpread({}, liftedStore[_symbolObservable["default"]]()), {}, _defineProperty({
      subscribe: function subscribe(observer) {
        if (_typeof(observer) !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = liftedStore.subscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _symbolObservable["default"], function () {
      return this;
    }));
  }));
}

/**
 * Redux instrumentation store enhancer.
 */
function instrument() {
  var monitorReducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return null;
  };
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof options.maxAge === 'number' && options.maxAge < 2) {
    throw new Error('DevTools.instrument({ maxAge }) option, if specified, ' + 'may not be less than 2.');
  }

  return function (createStore) {
    return function (reducer, initialState) {
      function liftReducer(r) {
        if (typeof r !== 'function') {
          if (r && typeof r["default"] === 'function') {
            throw new Error('Expected the reducer to be a function. ' + 'Instead got an object with a "default" field. ' + 'Did you pass a module instead of the default export? ' + 'Try passing require(...).default instead.');
          }

          throw new Error('Expected the reducer to be a function.');
        }

        return liftReducerWith(r, initialState, monitorReducer, options);
      }

      var liftedStore = createStore(liftReducer(reducer));

      if (liftedStore.liftedStore) {
        throw new Error('DevTools instrumentation should not be applied more than once. ' + 'Check your store configuration.');
      }

      return unliftStore(liftedStore, liftReducer, options);
    };
  };
}

}).call(this,require('_process'))

//# sourceMappingURL=node_modules/redux-devtools-instrument/lib/instrument.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/redux-devtools-instrument/lib/instrument.js",}],
[2647, {"./_baseAssignValue":2527,"./_baseForOwn":2532,"./_baseIteratee":2546}, function (require, module, exports) {
var baseAssignValue = require('./_baseAssignValue'),
    baseForOwn = require('./_baseForOwn'),
    baseIteratee = require('./_baseIteratee');

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

module.exports = mapValues;

//# sourceMappingURL=node_modules/lodash/mapValues.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/mapValues.js",}],
[3083, {"../utils/verifyPlainObject":3095,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.wrapMapToPropsConstant = wrapMapToPropsConstant;
exports.getDependsOnOwnProps = getDependsOnOwnProps;
exports.wrapMapToPropsFunc = wrapMapToPropsFunc;

var _verifyPlainObject = _interopRequireDefault(require("../utils/verifyPlainObject"));

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }

    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
} // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
//
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..


function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
} // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
//
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//


function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    }; // allow detectFactoryAndVerify to get ownProps


    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if ("production" !== 'production') (0, _verifyPlainObject["default"])(props, displayName, methodName);
      return props;
    };

    return proxy;
  };
}
//# sourceMappingURL=node_modules/react-redux/lib/connect/wrapMapToProps.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-redux/lib/connect/wrapMapToProps.js",}],
[3095, {"./isPlainObject":3091,"./warning":3096,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = verifyPlainObject;

var _isPlainObject = _interopRequireDefault(require("./isPlainObject"));

var _warning = _interopRequireDefault(require("./warning"));

function verifyPlainObject(value, displayName, methodName) {
  if (!(0, _isPlainObject["default"])(value)) {
    (0, _warning["default"])(methodName + "() in " + displayName + " must return a plain object. Instead received " + value + ".");
  }
}
//# sourceMappingURL=node_modules/react-redux/lib/utils/verifyPlainObject.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-redux/lib/utils/verifyPlainObject.js",}],
[3082, {"../utils/warning":3096,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = verifySubselectors;

var _warning = _interopRequireDefault(require("../utils/warning"));

function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error("Unexpected value for " + methodName + " in " + displayName + ".");
  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
    if (!Object.prototype.hasOwnProperty.call(selector, 'dependsOnOwnProps')) {
      (0, _warning["default"])("The selector for " + methodName + " of " + displayName + " did not specify a value for dependsOnOwnProps.");
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}
//# sourceMappingURL=node_modules/react-redux/lib/connect/verifySubselectors.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-redux/lib/connect/verifySubselectors.js",}],
[3103, {"history":3108,"hoist-non-react-statics":1924,"mini-create-react-context":2669,"path-to-regexp":2874,"prop-types":2900,"react":3121,"react-is":3067,"tiny-invariant":3388,"tiny-warning":3389}, function (require, module, exports) {
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));
var history = require('history');
var warning = _interopDefault(require('tiny-warning'));
var createContext = _interopDefault(require('mini-create-react-context'));
var invariant = _interopDefault(require('tiny-invariant'));
var pathToRegexp = _interopDefault(require('path-to-regexp'));
var reactIs = require('react-is');
var hoistStatics = _interopDefault(require('hoist-non-react-statics'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

// TODO: Replace with React.createContext once we can assume React 16+

var createNamedContext = function createNamedContext(name) {
  var context = createContext();
  context.displayName = name;
  return context;
};

var context =
/*#__PURE__*/
createNamedContext("Router");

/**
 * The public API for putting history on context.
 */

var Router =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Router, _React$Component);

  Router.computeRootMatch = function computeRootMatch(pathname) {
    return {
      path: "/",
      url: "/",
      params: {},
      isExact: pathname === "/"
    };
  };

  function Router(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      location: props.history.location
    }; // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.

    _this._isMounted = false;
    _this._pendingLocation = null;

    if (!props.staticContext) {
      _this.unlisten = props.history.listen(function (location) {
        if (_this._isMounted) {
          _this.setState({
            location: location
          });
        } else {
          _this._pendingLocation = location;
        }
      });
    }

    return _this;
  }

  var _proto = Router.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._isMounted = true;

    if (this._pendingLocation) {
      this.setState({
        location: this._pendingLocation
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  };

  _proto.render = function render() {
    return React.createElement(context.Provider, {
      children: this.props.children || null,
      value: {
        history: this.props.history,
        location: this.state.location,
        match: Router.computeRootMatch(this.state.location.pathname),
        staticContext: this.props.staticContext
      }
    });
  };

  return Router;
}(React.Component);

{
  Router.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    staticContext: PropTypes.object
  };

  Router.prototype.componentDidUpdate = function (prevProps) {
     warning(prevProps.history === this.props.history, "You cannot change <Router history>") ;
  };
}

/**
 * The public API for a <Router> that stores location in memory.
 */

var MemoryRouter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(MemoryRouter, _React$Component);

  function MemoryRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = history.createMemoryHistory(_this.props);
    return _this;
  }

  var _proto = MemoryRouter.prototype;

  _proto.render = function render() {
    return React.createElement(Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return MemoryRouter;
}(React.Component);

{
  MemoryRouter.propTypes = {
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.node
  };

  MemoryRouter.prototype.componentDidMount = function () {
     warning(!this.props.history, "<MemoryRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { MemoryRouter as Router }`.") ;
  };
}

var Lifecycle =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Lifecycle, _React$Component);

  function Lifecycle() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Lifecycle.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (this.props.onMount) this.props.onMount.call(this, this);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount.call(this, this);
  };

  _proto.render = function render() {
    return null;
  };

  return Lifecycle;
}(React.Component);

/**
 * The public API for prompting the user before navigating away from a screen.
 */

function Prompt(_ref) {
  var message = _ref.message,
      _ref$when = _ref.when,
      when = _ref$when === void 0 ? true : _ref$when;
  return React.createElement(context.Consumer, null, function (context) {
    !context ?  invariant(false, "You should not use <Prompt> outside a <Router>")  : void 0;
    if (!when || context.staticContext) return null;
    var method = context.history.block;
    return React.createElement(Lifecycle, {
      onMount: function onMount(self) {
        self.release = method(message);
      },
      onUpdate: function onUpdate(self, prevProps) {
        if (prevProps.message !== message) {
          self.release();
          self.release = method(message);
        }
      },
      onUnmount: function onUnmount(self) {
        self.release();
      },
      message: message
    });
  });
}

{
  var messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);
  Prompt.propTypes = {
    when: PropTypes.bool,
    message: messageType.isRequired
  };
}

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;

function compilePath(path) {
  if (cache[path]) return cache[path];
  var generator = pathToRegexp.compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}
/**
 * Public API for generating a URL pathname from a path and parameters.
 */


function generatePath(path, params) {
  if (path === void 0) {
    path = "/";
  }

  if (params === void 0) {
    params = {};
  }

  return path === "/" ? path : compilePath(path)(params, {
    pretty: true
  });
}

/**
 * The public API for navigating programmatically with a component.
 */

function Redirect(_ref) {
  var computedMatch = _ref.computedMatch,
      to = _ref.to,
      _ref$push = _ref.push,
      push = _ref$push === void 0 ? false : _ref$push;
  return React.createElement(context.Consumer, null, function (context) {
    !context ?  invariant(false, "You should not use <Redirect> outside a <Router>")  : void 0;
    var history$1 = context.history,
        staticContext = context.staticContext;
    var method = push ? history$1.push : history$1.replace;
    var location = history.createLocation(computedMatch ? typeof to === "string" ? generatePath(to, computedMatch.params) : _extends({}, to, {
      pathname: generatePath(to.pathname, computedMatch.params)
    }) : to); // When rendering in a static context,
    // set the new location immediately.

    if (staticContext) {
      method(location);
      return null;
    }

    return React.createElement(Lifecycle, {
      onMount: function onMount() {
        method(location);
      },
      onUpdate: function onUpdate(self, prevProps) {
        var prevLocation = history.createLocation(prevProps.to);

        if (!history.locationsAreEqual(prevLocation, _extends({}, location, {
          key: prevLocation.key
        }))) {
          method(location);
        }
      },
      to: to
    });
  });
}

{
  Redirect.propTypes = {
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  };
}

var cache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;

function compilePath$1(path, options) {
  var cacheKey = "" + options.end + options.strict + options.sensitive;
  var pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  var keys = [];
  var regexp = pathToRegexp(path, keys, options);
  var result = {
    regexp: regexp,
    keys: keys
  };

  if (cacheCount$1 < cacheLimit$1) {
    pathCache[path] = result;
    cacheCount$1++;
  }

  return result;
}
/**
 * Public API for matching a URL pathname to a path.
 */


function matchPath(pathname, options) {
  if (options === void 0) {
    options = {};
  }

  if (typeof options === "string" || Array.isArray(options)) {
    options = {
      path: options
    };
  }

  var _options = options,
      path = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
  var paths = [].concat(path);
  return paths.reduce(function (matched, path) {
    if (!path && path !== "") return null;
    if (matched) return matched;

    var _compilePath = compilePath$1(path, {
      end: exact,
      strict: strict,
      sensitive: sensitive
    }),
        regexp = _compilePath.regexp,
        keys = _compilePath.keys;

    var match = regexp.exec(pathname);
    if (!match) return null;
    var url = match[0],
        values = match.slice(1);
    var isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: path,
      // the path used to match
      url: path === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact: isExact,
      // whether or not we matched exactly
      params: keys.reduce(function (memo, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

function isEmptyChildren(children) {
  return React.Children.count(children) === 0;
}

function evalChildrenDev(children, props, path) {
  var value = children(props);
   warning(value !== undefined, "You returned `undefined` from the `children` function of " + ("<Route" + (path ? " path=\"" + path + "\"" : "") + ">, but you ") + "should have returned a React element or `null`") ;
  return value || null;
}
/**
 * The public API for matching a single path and rendering.
 */


var Route =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Route, _React$Component);

  function Route() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Route.prototype;

  _proto.render = function render() {
    var _this = this;

    return React.createElement(context.Consumer, null, function (context$1) {
      !context$1 ?  invariant(false, "You should not use <Route> outside a <Router>")  : void 0;
      var location = _this.props.location || context$1.location;
      var match = _this.props.computedMatch ? _this.props.computedMatch // <Switch> already computed the match for us
      : _this.props.path ? matchPath(location.pathname, _this.props) : context$1.match;

      var props = _extends({}, context$1, {
        location: location,
        match: match
      });

      var _this$props = _this.props,
          children = _this$props.children,
          component = _this$props.component,
          render = _this$props.render; // Preact uses an empty array as children by
      // default, so use null if that's the case.

      if (Array.isArray(children) && children.length === 0) {
        children = null;
      }

      return React.createElement(context.Provider, {
        value: props
      }, props.match ? children ? typeof children === "function" ?  evalChildrenDev(children, props, _this.props.path)  : children : component ? React.createElement(component, props) : render ? render(props) : null : typeof children === "function" ?  evalChildrenDev(children, props, _this.props.path)  : null);
    });
  };

  return Route;
}(React.Component);

{
  Route.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    component: function component(props, propName) {
      if (props[propName] && !reactIs.isValidElementType(props[propName])) {
        return new Error("Invalid prop 'component' supplied to 'Route': the prop is not a valid React component");
      }
    },
    exact: PropTypes.bool,
    location: PropTypes.object,
    path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    render: PropTypes.func,
    sensitive: PropTypes.bool,
    strict: PropTypes.bool
  };

  Route.prototype.componentDidMount = function () {
     warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.component), "You should not use <Route component> and <Route children> in the same route; <Route component> will be ignored") ;
     warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.render), "You should not use <Route render> and <Route children> in the same route; <Route render> will be ignored") ;
     warning(!(this.props.component && this.props.render), "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored") ;
  };

  Route.prototype.componentDidUpdate = function (prevProps) {
     warning(!(this.props.location && !prevProps.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') ;
     warning(!(!this.props.location && prevProps.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') ;
  };
}

function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}

function addBasename(basename, location) {
  if (!basename) return location;
  return _extends({}, location, {
    pathname: addLeadingSlash(basename) + location.pathname
  });
}

function stripBasename(basename, location) {
  if (!basename) return location;
  var base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return _extends({}, location, {
    pathname: location.pathname.substr(base.length)
  });
}

function createURL(location) {
  return typeof location === "string" ? location : history.createPath(location);
}

function staticHandler(methodName) {
  return function () {
      invariant(false, "You cannot %s with <StaticRouter>", methodName)  ;
  };
}

function noop() {}
/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */


var StaticRouter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(StaticRouter, _React$Component);

  function StaticRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handlePush = function (location) {
      return _this.navigateTo(location, "PUSH");
    };

    _this.handleReplace = function (location) {
      return _this.navigateTo(location, "REPLACE");
    };

    _this.handleListen = function () {
      return noop;
    };

    _this.handleBlock = function () {
      return noop;
    };

    return _this;
  }

  var _proto = StaticRouter.prototype;

  _proto.navigateTo = function navigateTo(location, action) {
    var _this$props = this.props,
        _this$props$basename = _this$props.basename,
        basename = _this$props$basename === void 0 ? "" : _this$props$basename,
        _this$props$context = _this$props.context,
        context = _this$props$context === void 0 ? {} : _this$props$context;
    context.action = action;
    context.location = addBasename(basename, history.createLocation(location));
    context.url = createURL(context.location);
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        _this$props2$basename = _this$props2.basename,
        basename = _this$props2$basename === void 0 ? "" : _this$props2$basename,
        _this$props2$context = _this$props2.context,
        context = _this$props2$context === void 0 ? {} : _this$props2$context,
        _this$props2$location = _this$props2.location,
        location = _this$props2$location === void 0 ? "/" : _this$props2$location,
        rest = _objectWithoutPropertiesLoose(_this$props2, ["basename", "context", "location"]);

    var history$1 = {
      createHref: function createHref(path) {
        return addLeadingSlash(basename + createURL(path));
      },
      action: "POP",
      location: stripBasename(basename, history.createLocation(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    };
    return React.createElement(Router, _extends({}, rest, {
      history: history$1,
      staticContext: context
    }));
  };

  return StaticRouter;
}(React.Component);

{
  StaticRouter.propTypes = {
    basename: PropTypes.string,
    context: PropTypes.object,
    location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  StaticRouter.prototype.componentDidMount = function () {
     warning(!this.props.history, "<StaticRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { StaticRouter as Router }`.") ;
  };
}

/**
 * The public API for rendering the first <Route> that matches.
 */

var Switch =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Switch, _React$Component);

  function Switch() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Switch.prototype;

  _proto.render = function render() {
    var _this = this;

    return React.createElement(context.Consumer, null, function (context) {
      !context ?  invariant(false, "You should not use <Switch> outside a <Router>")  : void 0;
      var location = _this.props.location || context.location;
      var element, match; // We use React.Children.forEach instead of React.Children.toArray().find()
      // here because toArray adds keys to all child elements and we do not want
      // to trigger an unmount/remount for two <Route>s that render the same
      // component at different URLs.

      React.Children.forEach(_this.props.children, function (child) {
        if (match == null && React.isValidElement(child)) {
          element = child;
          var path = child.props.path || child.props.from;
          match = path ? matchPath(location.pathname, _extends({}, child.props, {
            path: path
          })) : context.match;
        }
      });
      return match ? React.cloneElement(element, {
        location: location,
        computedMatch: match
      }) : null;
    });
  };

  return Switch;
}(React.Component);

{
  Switch.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  };

  Switch.prototype.componentDidUpdate = function (prevProps) {
     warning(!(this.props.location && !prevProps.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') ;
     warning(!(!this.props.location && prevProps.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') ;
  };
}

/**
 * A public higher-order component to access the imperative API
 */

function withRouter(Component) {
  var displayName = "withRouter(" + (Component.displayName || Component.name) + ")";

  var C = function C(props) {
    var wrappedComponentRef = props.wrappedComponentRef,
        remainingProps = _objectWithoutPropertiesLoose(props, ["wrappedComponentRef"]);

    return React.createElement(context.Consumer, null, function (context) {
      !context ?  invariant(false, "You should not use <" + displayName + " /> outside a <Router>")  : void 0;
      return React.createElement(Component, _extends({}, remainingProps, context, {
        ref: wrappedComponentRef
      }));
    });
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  {
    C.propTypes = {
      wrappedComponentRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object])
    };
  }

  return hoistStatics(C, Component);
}

var useContext = React.useContext;
function useHistory() {
  {
    !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useHistory()")  : void 0;
  }

  return useContext(context).history;
}
function useLocation() {
  {
    !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useLocation()")  : void 0;
  }

  return useContext(context).location;
}
function useParams() {
  {
    !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useParams()")  : void 0;
  }

  var match = useContext(context).match;
  return match ? match.params : {};
}
function useRouteMatch(path) {
  {
    !(typeof useContext === "function") ?  invariant(false, "You must use React >= 16.8 in order to use useRouteMatch()")  : void 0;
  }

  return path ? matchPath(useLocation().pathname, path) : useContext(context).match;
}

{
  if (typeof window !== "undefined") {
    var global = window;
    var key = "__react_router_build__";
    var buildNames = {
      cjs: "CommonJS",
      esm: "ES modules",
      umd: "UMD"
    };

    if (global[key] && global[key] !== "cjs") {
      var initialBuildName = buildNames[global[key]];
      var secondaryBuildName = buildNames["cjs"]; // TODO: Add link to article that explains in detail how to avoid
      // loading 2 different builds.

      throw new Error("You are loading the " + secondaryBuildName + " build of React Router " + ("on a page that is already running the " + initialBuildName + " ") + "build, so things won't work right.");
    }

    global[key] = "cjs";
  }
}

exports.MemoryRouter = MemoryRouter;
exports.Prompt = Prompt;
exports.Redirect = Redirect;
exports.Route = Route;
exports.Router = Router;
exports.StaticRouter = StaticRouter;
exports.Switch = Switch;
exports.__RouterContext = context;
exports.generatePath = generatePath;
exports.matchPath = matchPath;
exports.useHistory = useHistory;
exports.useLocation = useLocation;
exports.useParams = useParams;
exports.useRouteMatch = useRouteMatch;
exports.withRouter = withRouter;
//# sourceMappingURL=react-router.js.map

//# sourceMappingURL=node_modules/react-router/cjs/react-router.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-router/cjs/react-router.js",}],
[3104, {"history":3108,"hoist-non-react-statics":1924,"mini-create-react-context":2669,"path-to-regexp":2874,"prop-types":2900,"react":3121,"react-is":3067,"tiny-invariant":3388,"tiny-warning":3389}, function (require, module, exports) {
"use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}Object.defineProperty(exports,"__esModule",{value:!0});var React=_interopDefault(require("react"));require("prop-types");var history=require("history");require("tiny-warning");var createContext=_interopDefault(require("mini-create-react-context")),invariant=_interopDefault(require("tiny-invariant")),pathToRegexp=_interopDefault(require("path-to-regexp"));require("react-is");var hoistStatics=_interopDefault(require("hoist-non-react-statics"));function _extends(){return(_extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _objectWithoutPropertiesLoose(t,e){if(null==t)return{};var n,o,r={},a=Object.keys(t);for(o=0;o<a.length;o++)n=a[o],0<=e.indexOf(n)||(r[n]=t[n]);return r}var createNamedContext=function(t){var e=createContext();return e.displayName=t,e},context=createNamedContext("Router"),Router=function(n){function t(t){var e;return(e=n.call(this,t)||this).state={location:t.history.location},e._isMounted=!1,e._pendingLocation=null,t.staticContext||(e.unlisten=t.history.listen(function(t){e._isMounted?e.setState({location:t}):e._pendingLocation=t})),e}_inheritsLoose(t,n),t.computeRootMatch=function(t){return{path:"/",url:"/",params:{},isExact:"/"===t}};var e=t.prototype;return e.componentDidMount=function(){this._isMounted=!0,this._pendingLocation&&this.setState({location:this._pendingLocation})},e.componentWillUnmount=function(){this.unlisten&&this.unlisten()},e.render=function(){return React.createElement(context.Provider,{children:this.props.children||null,value:{history:this.props.history,location:this.state.location,match:t.computeRootMatch(this.state.location.pathname),staticContext:this.props.staticContext}})},t}(React.Component),MemoryRouter=function(r){function t(){for(var t,e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return(t=r.call.apply(r,[this].concat(n))||this).history=history.createMemoryHistory(t.props),t}return _inheritsLoose(t,r),t.prototype.render=function(){return React.createElement(Router,{history:this.history,children:this.props.children})},t}(React.Component),Lifecycle=function(t){function e(){return t.apply(this,arguments)||this}_inheritsLoose(e,t);var n=e.prototype;return n.componentDidMount=function(){this.props.onMount&&this.props.onMount.call(this,this)},n.componentDidUpdate=function(t){this.props.onUpdate&&this.props.onUpdate.call(this,this,t)},n.componentWillUnmount=function(){this.props.onUnmount&&this.props.onUnmount.call(this,this)},n.render=function(){return null},e}(React.Component);function Prompt(t){var o=t.message,e=t.when,r=void 0===e||e;return React.createElement(context.Consumer,null,function(t){if(t||invariant(!1),!r||t.staticContext)return null;var n=t.history.block;return React.createElement(Lifecycle,{onMount:function(t){t.release=n(o)},onUpdate:function(t,e){e.message!==o&&(t.release(),t.release=n(o))},onUnmount:function(t){t.release()},message:o})})}var cache={},cacheLimit=1e4,cacheCount=0;function compilePath(t){if(cache[t])return cache[t];var e=pathToRegexp.compile(t);return cacheCount<cacheLimit&&(cache[t]=e,cacheCount++),e}function generatePath(t,e){return void 0===t&&(t="/"),void 0===e&&(e={}),"/"===t?t:compilePath(t)(e,{pretty:!0})}function Redirect(t){var a=t.computedMatch,i=t.to,e=t.push,c=void 0!==e&&e;return React.createElement(context.Consumer,null,function(t){t||invariant(!1);var e=t.history,n=t.staticContext,o=c?e.push:e.replace,r=history.createLocation(a?"string"==typeof i?generatePath(i,a.params):_extends({},i,{pathname:generatePath(i.pathname,a.params)}):i);return n?(o(r),null):React.createElement(Lifecycle,{onMount:function(){o(r)},onUpdate:function(t,e){var n=history.createLocation(e.to);history.locationsAreEqual(n,_extends({},r,{key:n.key}))||o(r)},to:i})})}var cache$1={},cacheLimit$1=1e4,cacheCount$1=0;function compilePath$1(t,e){var n=""+e.end+e.strict+e.sensitive,o=cache$1[n]||(cache$1[n]={});if(o[t])return o[t];var r=[],a={regexp:pathToRegexp(t,r,e),keys:r};return cacheCount$1<cacheLimit$1&&(o[t]=a,cacheCount$1++),a}function matchPath(u,t){void 0===t&&(t={}),"string"!=typeof t&&!Array.isArray(t)||(t={path:t});var e=t,n=e.path,o=e.exact,p=void 0!==o&&o,r=e.strict,h=void 0!==r&&r,a=e.sensitive,l=void 0!==a&&a;return[].concat(n).reduce(function(t,e){if(!e&&""!==e)return null;if(t)return t;var n=compilePath$1(e,{end:p,strict:h,sensitive:l}),o=n.regexp,r=n.keys,a=o.exec(u);if(!a)return null;var i=a[0],c=a.slice(1),s=u===i;return p&&!s?null:{path:e,url:"/"===e&&""===i?"/":i,isExact:s,params:r.reduce(function(t,e,n){return t[e.name]=c[n],t},{})}},null)}var Route=function(t){function e(){return t.apply(this,arguments)||this}return _inheritsLoose(e,t),e.prototype.render=function(){var c=this;return React.createElement(context.Consumer,null,function(t){t||invariant(!1);var e=c.props.location||t.location,n=_extends({},t,{location:e,match:c.props.computedMatch?c.props.computedMatch:c.props.path?matchPath(e.pathname,c.props):t.match}),o=c.props,r=o.children,a=o.component,i=o.render;return Array.isArray(r)&&0===r.length&&(r=null),React.createElement(context.Provider,{value:n},n.match?r?"function"==typeof r?r(n):r:a?React.createElement(a,n):i?i(n):null:"function"==typeof r?r(n):null)})},e}(React.Component);function addLeadingSlash(t){return"/"===t.charAt(0)?t:"/"+t}function addBasename(t,e){return t?_extends({},e,{pathname:addLeadingSlash(t)+e.pathname}):e}function stripBasename(t,e){if(!t)return e;var n=addLeadingSlash(t);return 0!==e.pathname.indexOf(n)?e:_extends({},e,{pathname:e.pathname.substr(n.length)})}function createURL(t){return"string"==typeof t?t:history.createPath(t)}function staticHandler(t){return function(){invariant(!1)}}function noop(){}var StaticRouter=function(r){function t(){for(var e,t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return(e=r.call.apply(r,[this].concat(n))||this).handlePush=function(t){return e.navigateTo(t,"PUSH")},e.handleReplace=function(t){return e.navigateTo(t,"REPLACE")},e.handleListen=function(){return noop},e.handleBlock=function(){return noop},e}_inheritsLoose(t,r);var e=t.prototype;return e.navigateTo=function(t,e){var n=this.props,o=n.basename,r=void 0===o?"":o,a=n.context,i=void 0===a?{}:a;i.action=e,i.location=addBasename(r,history.createLocation(t)),i.url=createURL(i.location)},e.render=function(){var t=this.props,e=t.basename,n=void 0===e?"":e,o=t.context,r=void 0===o?{}:o,a=t.location,i=void 0===a?"/":a,c=_objectWithoutPropertiesLoose(t,["basename","context","location"]),s={createHref:function(t){return addLeadingSlash(n+createURL(t))},action:"POP",location:stripBasename(n,history.createLocation(i)),push:this.handlePush,replace:this.handleReplace,go:staticHandler(),goBack:staticHandler(),goForward:staticHandler(),listen:this.handleListen,block:this.handleBlock};return React.createElement(Router,_extends({},c,{history:s,staticContext:r}))},t}(React.Component),Switch=function(t){function e(){return t.apply(this,arguments)||this}return _inheritsLoose(e,t),e.prototype.render=function(){var t=this;return React.createElement(context.Consumer,null,function(n){n||invariant(!1);var o,r,a=t.props.location||n.location;return React.Children.forEach(t.props.children,function(t){if(null==r&&React.isValidElement(t)){var e=(o=t).props.path||t.props.from;r=e?matchPath(a.pathname,_extends({},t.props,{path:e})):n.match}}),r?React.cloneElement(o,{location:a,computedMatch:r}):null})},e}(React.Component);function withRouter(o){function t(t){var e=t.wrappedComponentRef,n=_objectWithoutPropertiesLoose(t,["wrappedComponentRef"]);return React.createElement(context.Consumer,null,function(t){return t||invariant(!1),React.createElement(o,_extends({},n,t,{ref:e}))})}var e="withRouter("+(o.displayName||o.name)+")";return t.displayName=e,t.WrappedComponent=o,hoistStatics(t,o)}var useContext=React.useContext;function useHistory(){return useContext(context).history}function useLocation(){return useContext(context).location}function useParams(){var t=useContext(context).match;return t?t.params:{}}function useRouteMatch(t){return t?matchPath(useLocation().pathname,t):useContext(context).match}exports.MemoryRouter=MemoryRouter,exports.Prompt=Prompt,exports.Redirect=Redirect,exports.Route=Route,exports.Router=Router,exports.StaticRouter=StaticRouter,exports.Switch=Switch,exports.__RouterContext=context,exports.generatePath=generatePath,exports.matchPath=matchPath,exports.useHistory=useHistory,exports.useLocation=useLocation,exports.useParams=useParams,exports.useRouteMatch=useRouteMatch,exports.withRouter=withRouter;
//# sourceMappingURL=react-router.min.js.map

//# sourceMappingURL=node_modules/react-router/cjs/react-router.min.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-router/cjs/react-router.min.js",}],
[3100, {"resolve-pathname":3162,"tiny-invariant":3388,"tiny-warning":3389,"value-equal":3468}, function (require, module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var resolvePathname = _interopDefault(require('resolve-pathname'));
var valueEqual = _interopDefault(require('value-equal'));
var warning = _interopDefault(require('tiny-warning'));
var invariant = _interopDefault(require('tiny-invariant'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}
function hasBasename(path, prefix) {
  return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
    warning(prompt == null, 'A history supports only one prompt at a time');
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
          warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ? invariant(false, 'Browser history needs a DOM') : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
    warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

var HashChangeEvent$1 = 'hashchange';
var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

function stripHash(url) {
  var hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}

function pushHashPath(path) {
  window.location.hash = path;
}

function replaceHashPath(path) {
  window.location.replace(stripHash(window.location.href) + '#' + path);
}

function createHashHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ? invariant(false, 'Hash history needs a DOM') : void 0;
  var globalHistory = window.history;
  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
  var _props = props,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$hashType = _props.hashType,
      hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;

  function getDOMLocation() {
    var path = decodePath(getHashPath());
    warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
    if (basename) path = stripBasename(path, basename);
    return createLocation(path);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  var forceNextPop = false;
  var ignorePath = null;

  function locationsAreEqual$$1(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
  }

  function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;
      if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

      ignorePath = null;
      handlePop(location);
    }
  }

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  } // Ensure the hash is encoded properly before doing anything else.


  var path = getHashPath();
  var encodedPath = encodePath(path);
  if (path !== encodedPath) replaceHashPath(encodedPath);
  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)]; // Public interface

  function createHref(location) {
    var baseTag = document.querySelector('base');
    var href = '';

    if (baseTag && baseTag.getAttribute('href')) {
      href = stripHash(window.location.href);
    }

    return href + '#' + encodePath(basename + createPath(location));
  }

  function push(path, state) {
    warning(state === undefined, 'Hash history cannot push state; it is ignored');
    var action = 'PUSH';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);
        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
        var nextPaths = allPaths.slice(0, prevIndex + 1);
        nextPaths.push(path);
        allPaths = nextPaths;
        setState({
          action: action,
          location: location
        });
      } else {
        warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
        setState();
      }
    });
  }

  function replace(path, state) {
    warning(state === undefined, 'Hash history cannot replace state; it is ignored');
    var action = 'REPLACE';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf(createPath(history.location));
      if (prevIndex !== -1) allPaths[prevIndex] = path;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent$1, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent$1, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
/**
 * Creates a history object that stores locations in memory.
 */


function createMemoryHistory(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      getUserConfirmation = _props.getUserConfirmation,
      _props$initialEntries = _props.initialEntries,
      initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
      _props$initialIndex = _props.initialIndex,
      initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = history.entries.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function (entry) {
    return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
  }); // Public interface

  var createHref = createPath;

  function push(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var prevIndex = history.index;
      var nextIndex = prevIndex + 1;
      var nextEntries = history.entries.slice(0);

      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }

      setState({
        action: action,
        location: location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  }

  function replace(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      history.entries[history.index] = location;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
    var action = 'POP';
    var location = history.entries[nextIndex];
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (ok) {
        setState({
          action: action,
          location: location,
          index: nextIndex
        });
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState();
      }
    });
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function canGo(n) {
    var nextIndex = history.index + n;
    return nextIndex >= 0 && nextIndex < history.entries.length;
  }

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    return transitionManager.setPrompt(prompt);
  }

  function listen(listener) {
    return transitionManager.appendListener(listener);
  }

  var history = {
    length: entries.length,
    action: 'POP',
    location: entries[index],
    index: index,
    entries: entries,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    canGo: canGo,
    block: block,
    listen: listen
  };
  return history;
}

exports.createBrowserHistory = createBrowserHistory;
exports.createHashHistory = createHashHistory;
exports.createMemoryHistory = createMemoryHistory;
exports.createLocation = createLocation;
exports.locationsAreEqual = locationsAreEqual;
exports.parsePath = parsePath;
exports.createPath = createPath;

//# sourceMappingURL=node_modules/react-router-dom/node_modules/history/cjs/history.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-router-dom/node_modules/history/cjs/history.js",}],
[3101, {"resolve-pathname":3162,"tiny-invariant":3388,"tiny-warning":3389,"value-equal":3468}, function (require, module, exports) {
"use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}Object.defineProperty(exports,"__esModule",{value:!0});var resolvePathname=_interopDefault(require("resolve-pathname")),valueEqual=_interopDefault(require("value-equal"));require("tiny-warning");var invariant=_interopDefault(require("tiny-invariant"));function _extends(){return(_extends=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t}).apply(this,arguments)}function addLeadingSlash(t){return"/"===t.charAt(0)?t:"/"+t}function stripLeadingSlash(t){return"/"===t.charAt(0)?t.substr(1):t}function hasBasename(t,n){return 0===t.toLowerCase().indexOf(n.toLowerCase())&&-1!=="/?#".indexOf(t.charAt(n.length))}function stripBasename(t,n){return hasBasename(t,n)?t.substr(n.length):t}function stripTrailingSlash(t){return"/"===t.charAt(t.length-1)?t.slice(0,-1):t}function parsePath(t){var n=t||"/",e="",a="",r=n.indexOf("#");-1!==r&&(a=n.substr(r),n=n.substr(0,r));var o=n.indexOf("?");return-1!==o&&(e=n.substr(o),n=n.substr(0,o)),{pathname:n,search:"?"===e?"":e,hash:"#"===a?"":a}}function createPath(t){var n=t.pathname,e=t.search,a=t.hash,r=n||"/";return e&&"?"!==e&&(r+="?"===e.charAt(0)?e:"?"+e),a&&"#"!==a&&(r+="#"===a.charAt(0)?a:"#"+a),r}function createLocation(t,n,e,a){var r;"string"==typeof t?(r=parsePath(t)).state=n:(void 0===(r=_extends({},t)).pathname&&(r.pathname=""),r.search?"?"!==r.search.charAt(0)&&(r.search="?"+r.search):r.search="",r.hash?"#"!==r.hash.charAt(0)&&(r.hash="#"+r.hash):r.hash="",void 0!==n&&void 0===r.state&&(r.state=n));try{r.pathname=decodeURI(r.pathname)}catch(t){throw t instanceof URIError?new URIError('Pathname "'+r.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):t}return e&&(r.key=e),a?r.pathname?"/"!==r.pathname.charAt(0)&&(r.pathname=resolvePathname(r.pathname,a.pathname)):r.pathname=a.pathname:r.pathname||(r.pathname="/"),r}function locationsAreEqual(t,n){return t.pathname===n.pathname&&t.search===n.search&&t.hash===n.hash&&t.key===n.key&&valueEqual(t.state,n.state)}function createTransitionManager(){var o=null;var a=[];return{setPrompt:function(t){return o=t,function(){o===t&&(o=null)}},confirmTransitionTo:function(t,n,e,a){if(null!=o){var r="function"==typeof o?o(t,n):o;"string"==typeof r?"function"==typeof e?e(r,a):a(!0):a(!1!==r)}else a(!0)},appendListener:function(t){var n=!0;function e(){n&&t.apply(void 0,arguments)}return a.push(e),function(){n=!1,a=a.filter(function(t){return t!==e})}},notifyListeners:function(){for(var t=arguments.length,n=new Array(t),e=0;e<t;e++)n[e]=arguments[e];a.forEach(function(t){return t.apply(void 0,n)})}}}var canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement);function getConfirmation(t,n){n(window.confirm(t))}function supportsHistory(){var t=window.navigator.userAgent;return(-1===t.indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)}function supportsPopStateOnHashChange(){return-1===window.navigator.userAgent.indexOf("Trident")}function supportsGoWithoutReloadUsingHash(){return-1===window.navigator.userAgent.indexOf("Firefox")}function isExtraneousPopstateEvent(t){return void 0===t.state&&-1===navigator.userAgent.indexOf("CriOS")}var PopStateEvent="popstate",HashChangeEvent="hashchange";function getHistoryState(){try{return window.history.state||{}}catch(t){return{}}}function createBrowserHistory(t){void 0===t&&(t={}),canUseDOM||invariant(!1);var s=window.history,c=supportsHistory(),n=!supportsPopStateOnHashChange(),e=t,a=e.forceRefresh,h=void 0!==a&&a,r=e.getUserConfirmation,u=void 0===r?getConfirmation:r,o=e.keyLength,i=void 0===o?6:o,f=t.basename?stripTrailingSlash(addLeadingSlash(t.basename)):"";function l(t){var n=t||{},e=n.key,a=n.state,r=window.location,o=r.pathname+r.search+r.hash;return f&&(o=stripBasename(o,f)),createLocation(o,a,e)}function d(){return Math.random().toString(36).substr(2,i)}var v=createTransitionManager();function p(t){_extends(T,t),T.length=s.length,v.notifyListeners(T.location,T.action)}function g(t){isExtraneousPopstateEvent(t)||w(l(t.state))}function P(){w(l(getHistoryState()))}var m=!1;function w(n){if(m)m=!1,p();else{v.confirmTransitionTo(n,"POP",u,function(t){t?p({action:"POP",location:n}):function(t){var n=T.location,e=H.indexOf(n.key);-1===e&&(e=0);var a=H.indexOf(t.key);-1===a&&(a=0);var r=e-a;r&&(m=!0,L(r))}(n)})}}var y=l(getHistoryState()),H=[y.key];function x(t){return f+createPath(t)}function L(t){s.go(t)}var O=0;function E(t){1===(O+=t)&&1===t?(window.addEventListener(PopStateEvent,g),n&&window.addEventListener(HashChangeEvent,P)):0===O&&(window.removeEventListener(PopStateEvent,g),n&&window.removeEventListener(HashChangeEvent,P))}var S=!1;var T={length:s.length,action:"POP",location:y,createHref:x,push:function(t,n){var i=createLocation(t,n,d(),T.location);v.confirmTransitionTo(i,"PUSH",u,function(t){if(t){var n=x(i),e=i.key,a=i.state;if(c)if(s.pushState({key:e,state:a},null,n),h)window.location.href=n;else{var r=H.indexOf(T.location.key),o=H.slice(0,r+1);o.push(i.key),H=o,p({action:"PUSH",location:i})}else window.location.href=n}})},replace:function(t,n){var o="REPLACE",i=createLocation(t,n,d(),T.location);v.confirmTransitionTo(i,o,u,function(t){if(t){var n=x(i),e=i.key,a=i.state;if(c)if(s.replaceState({key:e,state:a},null,n),h)window.location.replace(n);else{var r=H.indexOf(T.location.key);-1!==r&&(H[r]=i.key),p({action:o,location:i})}else window.location.replace(n)}})},go:L,goBack:function(){L(-1)},goForward:function(){L(1)},block:function(t){void 0===t&&(t=!1);var n=v.setPrompt(t);return S||(E(1),S=!0),function(){return S&&(S=!1,E(-1)),n()}},listen:function(t){var n=v.appendListener(t);return E(1),function(){E(-1),n()}}};return T}var HashChangeEvent$1="hashchange",HashPathCoders={hashbang:{encodePath:function(t){return"!"===t.charAt(0)?t:"!/"+stripLeadingSlash(t)},decodePath:function(t){return"!"===t.charAt(0)?t.substr(1):t}},noslash:{encodePath:stripLeadingSlash,decodePath:addLeadingSlash},slash:{encodePath:addLeadingSlash,decodePath:addLeadingSlash}};function stripHash(t){var n=t.indexOf("#");return-1===n?t:t.slice(0,n)}function getHashPath(){var t=window.location.href,n=t.indexOf("#");return-1===n?"":t.substring(n+1)}function pushHashPath(t){window.location.hash=t}function replaceHashPath(t){window.location.replace(stripHash(window.location.href)+"#"+t)}function createHashHistory(t){void 0===t&&(t={}),canUseDOM||invariant(!1);var n=window.history,e=(supportsGoWithoutReloadUsingHash(),t),a=e.getUserConfirmation,i=void 0===a?getConfirmation:a,r=e.hashType,o=void 0===r?"slash":r,s=t.basename?stripTrailingSlash(addLeadingSlash(t.basename)):"",c=HashPathCoders[o],h=c.encodePath,u=c.decodePath;function f(){var t=u(getHashPath());return s&&(t=stripBasename(t,s)),createLocation(t)}var l=createTransitionManager();function d(t){_extends(E,t),E.length=n.length,l.notifyListeners(E.location,E.action)}var v=!1,p=null;function g(){var t=getHashPath(),n=h(t);if(t!==n)replaceHashPath(n);else{var e=f(),a=E.location;if(!v&&function(t,n){return t.pathname===n.pathname&&t.search===n.search&&t.hash===n.hash}(a,e))return;if(p===createPath(e))return;p=null,function(n){if(v)v=!1,d();else{l.confirmTransitionTo(n,"POP",i,function(t){t?d({action:"POP",location:n}):function(t){var n=E.location,e=y.lastIndexOf(createPath(n));-1===e&&(e=0);var a=y.lastIndexOf(createPath(t));-1===a&&(a=0);var r=e-a;r&&(v=!0,H(r))}(n)})}}(e)}}var P=getHashPath(),m=h(P);P!==m&&replaceHashPath(m);var w=f(),y=[createPath(w)];function H(t){n.go(t)}var x=0;function L(t){1===(x+=t)&&1===t?window.addEventListener(HashChangeEvent$1,g):0===x&&window.removeEventListener(HashChangeEvent$1,g)}var O=!1;var E={length:n.length,action:"POP",location:w,createHref:function(t){var n=document.querySelector("base"),e="";return n&&n.getAttribute("href")&&(e=stripHash(window.location.href)),e+"#"+h(s+createPath(t))},push:function(t,n){var o=createLocation(t,void 0,void 0,E.location);l.confirmTransitionTo(o,"PUSH",i,function(t){if(t){var n=createPath(o),e=h(s+n);if(getHashPath()!==e){p=n,pushHashPath(e);var a=y.lastIndexOf(createPath(E.location)),r=y.slice(0,a+1);r.push(n),y=r,d({action:"PUSH",location:o})}else d()}})},replace:function(t,n){var r="REPLACE",o=createLocation(t,void 0,void 0,E.location);l.confirmTransitionTo(o,r,i,function(t){if(t){var n=createPath(o),e=h(s+n);getHashPath()!==e&&(p=n,replaceHashPath(e));var a=y.indexOf(createPath(E.location));-1!==a&&(y[a]=n),d({action:r,location:o})}})},go:H,goBack:function(){H(-1)},goForward:function(){H(1)},block:function(t){void 0===t&&(t=!1);var n=l.setPrompt(t);return O||(L(1),O=!0),function(){return O&&(O=!1,L(-1)),n()}},listen:function(t){var n=l.appendListener(t);return L(1),function(){L(-1),n()}}};return E}function clamp(t,n,e){return Math.min(Math.max(t,n),e)}function createMemoryHistory(t){void 0===t&&(t={});var n=t,r=n.getUserConfirmation,e=n.initialEntries,a=void 0===e?["/"]:e,o=n.initialIndex,i=void 0===o?0:o,s=n.keyLength,c=void 0===s?6:s,h=createTransitionManager();function u(t){_extends(g,t),g.length=g.entries.length,h.notifyListeners(g.location,g.action)}function f(){return Math.random().toString(36).substr(2,c)}var l=clamp(i,0,a.length-1),d=a.map(function(t){return createLocation(t,void 0,"string"==typeof t?f():t.key||f())}),v=createPath;function p(t){var n=clamp(g.index+t,0,g.entries.length-1),e=g.entries[n];h.confirmTransitionTo(e,"POP",r,function(t){t?u({action:"POP",location:e,index:n}):u()})}var g={length:d.length,action:"POP",location:d[l],index:l,entries:d,createHref:v,push:function(t,n){var a=createLocation(t,n,f(),g.location);h.confirmTransitionTo(a,"PUSH",r,function(t){if(t){var n=g.index+1,e=g.entries.slice(0);e.length>n?e.splice(n,e.length-n,a):e.push(a),u({action:"PUSH",location:a,index:n,entries:e})}})},replace:function(t,n){var e="REPLACE",a=createLocation(t,n,f(),g.location);h.confirmTransitionTo(a,e,r,function(t){t&&(g.entries[g.index]=a,u({action:e,location:a}))})},go:p,goBack:function(){p(-1)},goForward:function(){p(1)},canGo:function(t){var n=g.index+t;return 0<=n&&n<g.entries.length},block:function(t){return void 0===t&&(t=!1),h.setPrompt(t)},listen:function(t){return h.appendListener(t)}};return g}exports.createBrowserHistory=createBrowserHistory,exports.createHashHistory=createHashHistory,exports.createMemoryHistory=createMemoryHistory,exports.createLocation=createLocation,exports.locationsAreEqual=locationsAreEqual,exports.parsePath=parsePath,exports.createPath=createPath;

//# sourceMappingURL=node_modules/react-router-dom/node_modules/history/cjs/history.min.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-router-dom/node_modules/history/cjs/history.min.js",}],
[1449, {}, function (require, module, exports) {
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

//# sourceMappingURL=node_modules/classnames/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/classnames/index.js",}],
[3039, {"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var react=require("react"),PropTypes=_interopDefault(require("prop-types")),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},possibleConstructorReturn=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},IS_BROWSER="object"===("undefined"==typeof window?"undefined":"undefined"==typeof window?"undefined":_typeof(window)),DEFAULT_ELEMENT=IS_BROWSER?document:{},DEFAULT_EVENTS=["mousemove","keydown","wheel","DOMMouseScroll","mouseWheel","mousedown","touchstart","touchmove","MSPointerDown","MSPointerMove"],IdleTimer=function(e){function t(e){classCallCheck(this,t);var n=possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));if(n.state={idle:!1,oldDate:+new Date,lastActive:+new Date,remaining:null,pageX:null,pageY:null},n.tId=null,n._handleEvent=function(e){var t=n.state,o=t.remaining,i=t.pageX,r=t.pageY,s=t.idle,u=n.props,a=u.timeout,l=u.onAction,p=u.debounce,c=u.throttle,d=u.stopOnIdle;if(p>0?n.debouncedAction(e):c>0?n.throttledAction(e):l(e),!o){if("mousemove"===e.type){if(e.pageX===i&&e.pageY===r)return;if(void 0===e.pageX&&void 0===e.pageY)return;if(n.getElapsedTime()<200)return}clearTimeout(n.tId),n.tId=null,s&&!d&&n.toggleIdleState(e),n.setState({lastActive:+new Date,pageX:e.pageX,pageY:e.pageY}),s&&d||(n.tId=setTimeout(n.toggleIdleState,a))}},e.debounce>0&&e.throttle>0)throw new Error("onAction can either be throttled or debounced (not both)");return e.debounce>0&&(n.debouncedAction=debounced(e.onAction,e.debounce)),e.throttle>0&&(n.throttledAction=throttled(e.onAction,e.throttle)),e.startOnMount||(n.state.idle=!0),n.toggleIdleState=n._toggleIdleState.bind(n),n.reset=n._reset.bind(n),n.pause=n._pause.bind(n),n.resume=n._resume.bind(n),n.getRemainingTime=n._getRemainingTime.bind(n),n.getElapsedTime=n._getElapsedTime.bind(n),n.getLastActiveTime=n._getLastActiveTime.bind(n),n.isIdle=n._isIdle.bind(n),n}return inherits(t,e),createClass(t,[{key:"componentWillMount",value:function(){this._bindEvents()}},{key:"componentDidMount",value:function(){this.props.startOnMount&&this.reset()}},{key:"componentDidUpdate",value:function(e){e.debounce!==this.props.debounce&&(this.debouncedAction=debounced(this.props.onAction,this.props.debounce)),e.throttle!==this.props.throttle&&(this.throttledAction=throttled(this.props.onAction,this.props.throttle))}},{key:"componentWillUnmount",value:function(){clearTimeout(this.tId),this._unbindEvents()}},{key:"render",value:function(){return this.props.children||null}},{key:"_bindEvents",value:function(){var e=this;if(IS_BROWSER){var t=this.state.eventsBound,n=this.props,o=n.element,i=n.events,r=n.passive,s=n.capture;t||(i.forEach(function(t){o.addEventListener(t,e._handleEvent,{capture:s,passive:r})}),this.setState({eventsBound:!0}))}}},{key:"_unbindEvents",value:function(){var e=this;if(IS_BROWSER){var t=this.props,n=t.element,o=t.events,i=t.passive,r=t.capture;this.state.eventsBound&&(o.forEach(function(t){n.removeEventListener(t,e._handleEvent,{capture:r,passive:i})}),this.setState({eventsBound:!1}))}}},{key:"_toggleIdleState",value:function(e){var t=this,n=this.state.idle,o=this.props,i=o.onActive,r=o.onIdle,s=o.stopOnIdle;this.setState({idle:!n},function(){n?s||(t._bindEvents(),i(e)):(s&&(clearTimeout(t.tId),t.tId=null,t._unbindEvents()),r(e))})}},{key:"_reset",value:function(){clearTimeout(this.tId),this.tId=null,this._bindEvents(),this.setState({idle:!1,oldDate:+new Date,lastActive:this.state.oldDate,remaining:null});var e=this.props.timeout;this.tId=setTimeout(this.toggleIdleState,e)}},{key:"_pause",value:function(){null===this.state.remaining&&(this._unbindEvents(),clearTimeout(this.tId),this.tId=null,this.setState({remaining:this.getRemainingTime()}))}},{key:"_resume",value:function(){var e=this.state,t=e.remaining,n=e.idle;null!==t&&(this._bindEvents(),n||(this.setState({remaining:null}),this.tId=setTimeout(this.toggleIdleState,t)))}},{key:"_getRemainingTime",value:function(){var e=this.state,t=e.remaining,n=e.idle,o=e.lastActive;if(n)return 0;if(null!==t)return t;var i=this.props.timeout-(+new Date-o);return i<0&&(i=0),i}},{key:"_getElapsedTime",value:function(){var e=this.state.oldDate;return+new Date-e}},{key:"_getLastActiveTime",value:function(){return this.state.lastActive}},{key:"_isIdle",value:function(){return this.state.idle}}]),t}(react.Component);function debounced(e,t){var n=void 0;return function(){for(var o=arguments.length,i=Array(o),r=0;r<o;r++)i[r]=arguments[r];n&&clearTimeout(n),n=setTimeout(function(){e.apply(void 0,i),n=null},t)}}function throttled(e,t){var n=0;return function(){var o=(new Date).getTime();if(!(o-n<t))return n=o,e.apply(void 0,arguments)}}IdleTimer.propTypes={timeout:PropTypes.number,events:PropTypes.arrayOf(PropTypes.string),onIdle:PropTypes.func,onActive:PropTypes.func,onAction:PropTypes.func,debounce:PropTypes.number,throttle:PropTypes.number,element:PropTypes.oneOfType([PropTypes.object,PropTypes.element]),startOnMount:PropTypes.bool,stopOnIdle:PropTypes.bool,passive:PropTypes.bool,capture:PropTypes.bool},IdleTimer.defaultProps={timeout:12e5,element:DEFAULT_ELEMENT,events:DEFAULT_EVENTS,onIdle:function(){},onActive:function(){},onAction:function(){},debounce:0,throttle:0,startOnMount:!0,stopOnIdle:!1,capture:!0,passive:!0},module.exports=IdleTimer;
//# sourceMappingURL=index.min.js.map

//# sourceMappingURL=node_modules/react-idle-timer/dist/index.min.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-idle-timer/dist/index.min.js",}],
[4006, {"../../../app/build-types/beta/beta-mascot.json":2,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBeta = isBeta;
exports.getBuildSpecificAsset = getBuildSpecificAsset;

var _betaMascot = _interopRequireDefault(require("../../../app/build-types/beta/beta-mascot.json"));

const assetList = {
  main: {
    metafoxLogoHorizontalDark: '/images/logo/metamask-logo-horizontal.svg',
    // Will use default provided by the @metamask/logo library
    foxMeshJson: undefined
  },
  beta: {
    metafoxLogoHorizontalDark: '/images/logo/metamask-logo-horizontal-dark.svg',
    foxMeshJson: _betaMascot.default
  }
};

function isBeta() {
  return "main" === 'beta';
} // Returns a specific version of an asset based on
// the current metamask version (i.e. main, beta, etc.)


function getBuildSpecificAsset(assetName) {
  var _assetList$buildType;

  const buildType = "main";

  if (!((_assetList$buildType = assetList[buildType]) !== null && _assetList$buildType !== void 0 && _assetList$buildType[assetName])) {
    console.warn(`Cannot find asset for build ${buildType}: ${assetName}, returning main build asset`);
    return assetList.main[assetName];
  }

  return assetList[buildType][assetName];
}

//# sourceMappingURL=ui/helpers/utils/build-types.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/utils/build-types.js",}],
[3836, {"../../../../shared/constants/time":3598,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _time = require("../../../../shared/constants/time");

class Alert extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      visible: false,
      msg: false,
      className: ''
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.animateIn(nextProps.msg);
    } else if (this.props.visible && !nextProps.visible) {
      this.animateOut();
    }
  }

  animateIn(msg) {
    this.setState({
      msg,
      visible: true,
      className: 'visible'
    });
  }

  animateOut() {
    this.setState({
      msg: null,
      className: 'hidden'
    });
    setTimeout(_ => {
      this.setState({
        visible: false
      });
    }, _time.MILLISECOND * 500);
  }

  render() {
    if (this.state.visible) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('global-alert', this.state.className)
      }, /*#__PURE__*/_react.default.createElement("a", {
        className: "msg"
      }, this.state.msg));
    }

    return null;
  }

}

Alert.propTypes = {
  visible: _propTypes.default.bool.isRequired,
  msg: _propTypes.default.string
  /* eslint-disable-line react/no-unused-prop-types */

};
var _default = Alert;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/alert/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/alert/index.js",}],
[4176, {"./lock.container":4178,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _lock.default;
  }
});

var _lock = _interopRequireDefault(require("./lock.container"));

//# sourceMappingURL=ui/pages/lock/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/lock/index.js",}],
[4179, {"./mobile-sync.container":4181,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _mobileSync.default;
  }
});

var _mobileSync = _interopRequireDefault(require("./mobile-sync.container"));

//# sourceMappingURL=ui/pages/mobile-sync/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/mobile-sync/index.js",}],
[4074, {"./confirm-import-token.container":4073,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _confirmImportToken = _interopRequireDefault(require("./confirm-import-token.container"));

var _default = _confirmImportToken.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-import-token/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-import-token/index.js",}],
[3999, {"./authenticated.container":3998,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _authenticated.default;
  }
});

var _authenticated = _interopRequireDefault(require("./authenticated.container"));

//# sourceMappingURL=ui/helpers/higher-order-components/authenticated/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/authenticated/index.js",}],
[4001, {"./initialized.container":4003,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _initialized.default;
  }
});

var _initialized = _interopRequireDefault(require("./initialized.container"));

//# sourceMappingURL=ui/helpers/higher-order-components/initialized/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/initialized/index.js",}],
[3688, {"./loading-network-screen.container":3690,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _loadingNetworkScreen.default;
  }
});

var _loadingNetworkScreen = _interopRequireDefault(require("./loading-network-screen.container"));

//# sourceMappingURL=ui/components/app/loading-network-screen/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/loading-network-screen/index.js",}],
[4175, {"../../components/ui/button":3842,"../../components/ui/export-text-container":3868,"../../ducks/history/history":3982,"../../store/actions":4331,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _actions = require("../../store/actions");

var _exportTextContainer = _interopRequireDefault(require("../../components/ui/export-text-container"));

var _history = require("../../ducks/history/history");

var _button = _interopRequireDefault(require("../../components/ui/button"));

const PASSWORD_PROMPT_SCREEN = 'PASSWORD_PROMPT_SCREEN';
const REVEAL_SEED_SCREEN = 'REVEAL_SEED_SCREEN';

class RevealSeedPage extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      screen: PASSWORD_PROMPT_SCREEN,
      password: '',
      seedWords: null,
      error: null
    });
  }

  componentDidMount() {
    const passwordBox = document.getElementById('password-box');

    if (passwordBox) {
      passwordBox.focus();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      seedWords: null,
      error: null
    });
    this.props.requestRevealSeedWords(this.state.password).then(seedWords => this.setState({
      seedWords,
      screen: REVEAL_SEED_SCREEN
    })).catch(error => this.setState({
      error: error.message
    }));
  }

  renderWarning() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__warning-container"
    }, /*#__PURE__*/_react.default.createElement("img", {
      className: "page-container__warning-icon",
      src: "images/warning.svg",
      alt: ""
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__warning-message"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__warning-title"
    }, this.context.t('revealSeedWordsWarningTitle')), /*#__PURE__*/_react.default.createElement("div", null, this.context.t('revealSeedWordsWarning'))));
  }

  renderContent() {
    return this.state.screen === PASSWORD_PROMPT_SCREEN ? this.renderPasswordPromptContent() : this.renderRevealSeedContent();
  }

  renderPasswordPromptContent() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("form", {
      onSubmit: event => this.handleSubmit(event)
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "input-label",
      htmlFor: "password-box"
    }, t('enterPasswordContinue')), /*#__PURE__*/_react.default.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/_react.default.createElement("input", {
      type: "password",
      placeholder: t('password'),
      id: "password-box",
      value: this.state.password,
      onChange: event => this.setState({
        password: event.target.value
      }),
      className: (0, _classnames.default)('form-control', {
        'form-control--error': this.state.error
      })
    })), this.state.error && /*#__PURE__*/_react.default.createElement("div", {
      className: "reveal-seed__error"
    }, this.state.error));
  }

  renderRevealSeedContent() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", {
      className: "reveal-seed__label"
    }, t('yourPrivateSeedPhrase')), /*#__PURE__*/_react.default.createElement(_exportTextContainer.default, {
      text: this.state.seedWords
    }));
  }

  renderFooter() {
    return this.state.screen === PASSWORD_PROMPT_SCREEN ? this.renderPasswordPromptFooter() : this.renderRevealSeedFooter();
  }

  renderPasswordPromptFooter() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__footer"
    }, /*#__PURE__*/_react.default.createElement("footer", null, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "page-container__footer-button",
      onClick: () => this.props.history.push(this.props.mostRecentOverviewPage)
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      large: true,
      className: "page-container__footer-button",
      onClick: event => this.handleSubmit(event),
      disabled: this.state.password === ''
    }, this.context.t('next'))));
  }

  renderRevealSeedFooter() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__footer"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "page-container__footer-button",
      onClick: () => this.props.history.push(this.props.mostRecentOverviewPage)
    }, this.context.t('close')));
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__title"
    }, this.context.t('revealSeedWordsTitle')), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__subtitle"
    }, this.context.t('revealSeedWordsDescription'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__content"
    }, this.renderWarning(), /*#__PURE__*/_react.default.createElement("div", {
      className: "reveal-seed__content"
    }, this.renderContent())), this.renderFooter());
  }

}

RevealSeedPage.propTypes = {
  requestRevealSeedWords: _propTypes.default.func,
  history: _propTypes.default.object,
  mostRecentOverviewPage: _propTypes.default.string.isRequired
};
RevealSeedPage.contextTypes = {
  t: _propTypes.default.func
};

const mapStateToProps = state => {
  return {
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    requestRevealSeedWords: password => dispatch((0, _actions.requestRevealSeedWords)(password))
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(RevealSeedPage);

exports.default = _default;

//# sourceMappingURL=ui/pages/keychains/reveal-seed.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/keychains/reveal-seed.js",}],
[3906, {"./loading-screen.component":3907,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loadingScreen = _interopRequireDefault(require("./loading-screen.component"));

var _default = _loadingScreen.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/loading-screen/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/loading-screen/index.js",}],
[3625, {"./app-header.container":3624,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _appHeader.default;
  }
});

var _appHeader = _interopRequireDefault(require("./app-header.container"));

//# sourceMappingURL=ui/components/app/app-header/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/app-header/index.js",}],
[4114, {"./create-account.component":4110,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _createAccount.default;
  }
});

var _createAccount = _interopRequireDefault(require("./create-account.component"));

//# sourceMappingURL=ui/pages/create-account/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/index.js",}],
[4097, {"./confirmation":4096,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmation.default;
  }
});

var _confirmation = _interopRequireDefault(require("./confirmation"));

//# sourceMappingURL=ui/pages/confirmation/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirmation/index.js",}],
[4054, {"./asset":4048,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _asset.default;
  }
});

var _asset = _interopRequireDefault(require("./asset"));

//# sourceMappingURL=ui/pages/asset/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/asset/index.js",}],
[4184, {"./permissions-connect.container":4186,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _permissionsConnect.default;
  }
});

var _permissionsConnect = _interopRequireDefault(require("./permissions-connect.container"));

//# sourceMappingURL=ui/pages/permissions-connect/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/permissions-connect/index.js",}],
[3663, {"../../../../app/scripts/lib/util":78,"../../../../shared/constants/app":3591,"../../../../shared/constants/network":3595,"../../../../shared/modules/network.utils":3605,"../../../ducks/alerts/invalid-custom-network":3975,"../../../helpers/constants/design-system":3992,"../../../helpers/constants/routes":3995,"../../../store/actions":4331,"../../ui/color-indicator":3850,"./dropdown":3662,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _redux = require("redux");

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _invalidCustomNetwork = require("../../../ducks/alerts/invalid-custom-network");

var _routes = require("../../../helpers/constants/routes");

var _app = require("../../../../shared/constants/app");

var _network = require("../../../../shared/constants/network");

var _network2 = require("../../../../shared/modules/network.utils");

var _util = require("../../../../app/scripts/lib/util");

var _colorIndicator = _interopRequireDefault(require("../../ui/color-indicator"));

var _designSystem = require("../../../helpers/constants/design-system");

var _dropdown = require("./dropdown");

// classes from nodes of the toggle element.
const notToggleElementClassnames = ['menu-icon', 'network-name', 'network-indicator', 'network-caret', 'network-component', 'modal-container__footer-button'];
const DROP_DOWN_MENU_ITEM_STYLE = {
  fontSize: '16px',
  lineHeight: '20px',
  padding: '12px 0'
};

function mapStateToProps(state) {
  return {
    provider: state.metamask.provider,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    networkDropdownOpen: state.appState.networkDropdownOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setProviderType: type => {
      dispatch(actions.setProviderType(type));
    },
    setRpcTarget: (target, chainId, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, chainId, ticker, nickname));
    },
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    setNetworksTabAddMode: isInAddMode => {
      dispatch(actions.setNetworksTabAddMode(isInAddMode));
    },
    setSelectedSettingsRpcUrl: url => {
      dispatch(actions.setSelectedSettingsRpcUrl(url));
    },
    displayInvalidCustomNetworkAlert: networkName => {
      dispatch((0, _invalidCustomNetwork.openAlert)(networkName));
    },
    showConfirmDeleteNetworkModal: ({
      target,
      onConfirm
    }) => {
      return dispatch(actions.showModal({
        name: 'CONFIRM_DELETE_NETWORK',
        target,
        onConfirm
      }));
    }
  };
}

class NetworkDropdown extends _react.Component {
  handleClick(newProviderType) {
    const {
      provider: {
        type: providerType
      },
      setProviderType
    } = this.props;
    const {
      metricsEvent
    } = this.context;
    metricsEvent({
      eventOpts: {
        category: 'Navigation',
        action: 'Home',
        name: 'Switched Networks'
      },
      customVariables: {
        fromNetwork: providerType,
        toNetwork: newProviderType
      }
    });
    setProviderType(newProviderType);
  }

  getNetworkName() {
    const {
      provider
    } = this.props;
    const providerName = provider.type;
    let name;

    if (providerName === 'monsta') {
      name = this.context.t('monsta');
    } else {
      name = provider.nickname || this.context.t('unknownNetwork');
    }

    return name;
  }

  renderNetworkEntry(network) {
    const {
      provider: {
        type: providerType
      }
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_dropdown.DropdownMenuItem, {
      key: network,
      closeMenu: this.props.hideNetworkDropdown,
      onClick: () => this.handleClick(network),
      style: DROP_DOWN_MENU_ITEM_STYLE
    }, providerType === network ? /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-check"
    }) : /*#__PURE__*/_react.default.createElement("div", {
      className: "network-check__transparent"
    }, "\u2713"), /*#__PURE__*/_react.default.createElement(_colorIndicator.default, {
      color: network,
      size: _designSystem.SIZES.LG,
      type: _colorIndicator.default.TYPES.FILLED,
      borderColor: providerType === network ? _designSystem.COLORS.WHITE : network
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "network-name-item",
      style: {
        color: providerType === network ? '#ffffff' : '#9b9b9b'
      }
    }, this.context.t(network)));
  }

  render() {
    const {
      provider: {
        rpcUrl: activeNetwork
      },
      setNetworksTabAddMode,
      setSelectedSettingsRpcUrl
    } = this.props;
    const rpcListDetail = this.props.frequentRpcListDetail;
    const isDisabled = this.props.networkDropdownDisabled;
    return /*#__PURE__*/_react.default.createElement(_dropdown.Dropdown, {
      isOpen: isDisabled,
      onClickOutside: event => {
        const {
          classList
        } = event.target;

        const isInClassList = className => classList.contains(className);

        const notToggleElementIndex = notToggleElementClassnames.findIndex(isInClassList);

        if (notToggleElementIndex === -1) {
          event.stopPropagation();
          this.props.hideNetworkDropdown();
        }
      },
      containerClassName: "network-droppo",
      zIndex: 55,
      style: {
        position: 'absolute',
        top: '58px',
        width: '309px',
        zIndex: '55px'
      },
      innerStyle: {
        padding: '18px 8px'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "network-dropdown-header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "network-dropdown-title"
    }, this.context.t('networks')), /*#__PURE__*/_react.default.createElement("div", {
      className: "network-dropdown-divider"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "network-dropdown-content"
    }, this.context.t('defaultNetwork'))), this.renderNetworkEntry('monsta'));
  }

}

(0, _defineProperty2.default)(NetworkDropdown, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(NetworkDropdown, "propTypes", {
  provider: _propTypes.default.shape({
    nickname: _propTypes.default.string,
    rpcUrl: _propTypes.default.string,
    type: _propTypes.default.string,
    ticker: _propTypes.default.string
  }).isRequired,
  setProviderType: _propTypes.default.func.isRequired,
  setRpcTarget: _propTypes.default.func.isRequired,
  hideNetworkDropdown: _propTypes.default.func.optional,
  setNetworksTabAddMode: _propTypes.default.func.isRequired,
  setSelectedSettingsRpcUrl: _propTypes.default.func.isRequired,
  frequentRpcListDetail: _propTypes.default.array.isRequired,
  networkDropdownOpen: _propTypes.default.bool.optional,
  history: _propTypes.default.object.isRequired,
  displayInvalidCustomNetworkAlert: _propTypes.default.func.isRequired,
  showConfirmDeleteNetworkModal: _propTypes.default.func.isRequired
});

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(NetworkDropdown);

exports.default = _default;

//# sourceMappingURL=ui/components/app/dropdowns/network-dropdown.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/dropdowns/network-dropdown.js",}],
[4165, {"./import-token.container":4164,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _importToken = _interopRequireDefault(require("./import-token.container"));

var _default = _importToken.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/import-token/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/import-token/index.js",}],
[3618, {"./alerts":3617,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _alerts.default;
  }
});

var _alerts = _interopRequireDefault(require("./alerts"));

//# sourceMappingURL=ui/components/app/alerts/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/alerts/index.js",}],
[4249, {"./settings.container":4265,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _settings.default;
  }
});

var _settings = _interopRequireDefault(require("./settings.container"));

//# sourceMappingURL=ui/pages/settings/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/index.js",}],
[4290, {"../../../shared/constants/swaps":3597,"../../../shared/constants/transaction":3599,"../../contexts/i18n":3970,"../../ducks/swaps/swaps":3988,"../../helpers/constants/routes":3995,"../../helpers/higher-order-components/feature-toggled-route":4000,"../../hooks/useGasFeeEstimates":4028,"../../hooks/useMetricEvent":4032,"../../selectors":4326,"../../selectors/selectors":4328,"../../store/actions":4331,"./awaiting-signatures":4267,"./awaiting-swap":4270,"./build-quote":4277,"./loading-swaps-quotes":4292,"./swaps.util":4316,"./view-quote":4317,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"bignumber.js":1351,"lodash":2646,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Swap;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _lodash = require("lodash");

var _i18n = require("../../contexts/i18n");

var _selectors = require("../../selectors/selectors");

var _swaps = require("../../ducks/swaps/swaps");

var _selectors2 = require("../../selectors");

var _routes = require("../../helpers/constants/routes");

var _swaps2 = require("../../../shared/constants/swaps");

var _actions = require("../../store/actions");

var _useMetricEvent = require("../../hooks/useMetricEvent");

var _useGasFeeEstimates = require("../../hooks/useGasFeeEstimates");

var _featureToggledRoute = _interopRequireDefault(require("../../helpers/higher-order-components/feature-toggled-route"));

var _transaction = require("../../../shared/constants/transaction");

var _swaps3 = require("./swaps.util");

var _awaitingSignatures = _interopRequireDefault(require("./awaiting-signatures"));

var _awaitingSwap = _interopRequireDefault(require("./awaiting-swap"));

var _loadingSwapsQuotes = _interopRequireDefault(require("./loading-swaps-quotes"));

var _buildQuote = _interopRequireDefault(require("./build-quote"));

var _viewQuote = _interopRequireDefault(require("./view-quote"));

function Swap() {
  var _approveTxData$txRece, _tradeTxData$txReceip, _fetchParams$sourceTo, _fetchParams$destinat;

  const t = (0, _react.useContext)(_i18n.I18nContext);
  const history = (0, _reactRouterDom.useHistory)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const {
    pathname
  } = (0, _reactRouterDom.useLocation)();
  const isAwaitingSwapRoute = pathname === _routes.AWAITING_SWAP_ROUTE;
  const isAwaitingSignaturesRoute = pathname === _routes.AWAITING_SIGNATURES_ROUTE;
  const isSwapsErrorRoute = pathname === _routes.SWAPS_ERROR_ROUTE;
  const isLoadingQuotesRoute = pathname === _routes.LOADING_QUOTES_ROUTE;
  const fetchParams = (0, _reactRedux.useSelector)(_swaps.getFetchParams);
  const {
    destinationTokenInfo = {}
  } = (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.metaData) || {};
  const [inputValue, setInputValue] = (0, _react.useState)((fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.value) || '');
  const [maxSlippage, setMaxSlippage] = (0, _react.useState)((fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage) || 3);
  const [isFeatureFlagLoaded, setIsFeatureFlagLoaded] = (0, _react.useState)(false);
  const [tokenFromError, setTokenFromError] = (0, _react.useState)(null);
  const routeState = (0, _reactRedux.useSelector)(_swaps.getBackgroundSwapRouteState);
  const selectedAccount = (0, _reactRedux.useSelector)(_selectors.getSelectedAccount);
  const quotes = (0, _reactRedux.useSelector)(_swaps.getQuotes);
  const txList = (0, _reactRedux.useSelector)(_selectors2.currentNetworkTxListSelector);
  const tradeTxId = (0, _reactRedux.useSelector)(_swaps.getTradeTxId);
  const approveTxId = (0, _reactRedux.useSelector)(_swaps.getApproveTxId);
  const aggregatorMetadata = (0, _reactRedux.useSelector)(_swaps.getAggregatorMetadata);
  const fetchingQuotes = (0, _reactRedux.useSelector)(_swaps.getFetchingQuotes);
  let swapsErrorKey = (0, _reactRedux.useSelector)(_swaps.getSwapsErrorKey);
  const swapsEnabled = (0, _reactRedux.useSelector)(_swaps.getSwapsFeatureIsLive);
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const isSwapsChain = (0, _reactRedux.useSelector)(_selectors.getIsSwapsChain);
  const useNewSwapsApi = (0, _reactRedux.useSelector)(_swaps.getUseNewSwapsApi);
  const networkAndAccountSupports1559 = (0, _reactRedux.useSelector)(_selectors2.checkNetworkAndAccountSupports1559);
  const fromToken = (0, _reactRedux.useSelector)(_swaps.getFromToken);
  const tokenList = (0, _reactRedux.useSelector)(_selectors.getTokenList);
  const listTokenValues = (0, _lodash.shuffle)(Object.values(tokenList));
  const reviewSwapClickedTimestamp = (0, _reactRedux.useSelector)(_swaps.getReviewSwapClickedTimestamp);
  const reviewSwapClicked = Boolean(reviewSwapClickedTimestamp);

  if (networkAndAccountSupports1559) {
    // This will pre-load gas fees before going to the View Quote page.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0, _useGasFeeEstimates.useGasFeeEstimates)();
  }

  const {
    balance: ethBalance,
    address: selectedAccountAddress
  } = selectedAccount;
  const {
    destinationTokenAddedForSwap
  } = fetchParams || {};
  const approveTxData = approveTxId && txList.find(({
    id
  }) => approveTxId === id);
  const tradeTxData = tradeTxId && txList.find(({
    id
  }) => tradeTxId === id);
  const tokensReceived = (tradeTxData === null || tradeTxData === void 0 ? void 0 : tradeTxData.txReceipt) && (0, _swaps3.getSwapsTokensReceivedFromTxMeta)(destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.symbol, tradeTxData, destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.address, selectedAccountAddress, destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.decimals, approveTxData, chainId);
  const tradeConfirmed = (tradeTxData === null || tradeTxData === void 0 ? void 0 : tradeTxData.status) === _transaction.TRANSACTION_STATUSES.CONFIRMED;
  const approveError = (approveTxData === null || approveTxData === void 0 ? void 0 : approveTxData.status) === _transaction.TRANSACTION_STATUSES.FAILED || (approveTxData === null || approveTxData === void 0 ? void 0 : (_approveTxData$txRece = approveTxData.txReceipt) === null || _approveTxData$txRece === void 0 ? void 0 : _approveTxData$txRece.status) === '0x0';
  const tradeError = (tradeTxData === null || tradeTxData === void 0 ? void 0 : tradeTxData.status) === _transaction.TRANSACTION_STATUSES.FAILED || (tradeTxData === null || tradeTxData === void 0 ? void 0 : (_tradeTxData$txReceip = tradeTxData.txReceipt) === null || _tradeTxData$txReceip === void 0 ? void 0 : _tradeTxData$txReceip.status) === '0x0';
  const conversionError = approveError || tradeError;

  if (conversionError && swapsErrorKey !== _swaps2.CONTRACT_DATA_DISABLED_ERROR) {
    swapsErrorKey = _swaps2.SWAP_FAILED_ERROR;
  }

  const clearTemporaryTokenRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    clearTemporaryTokenRef.current = () => {
      if (destinationTokenAddedForSwap && (!isAwaitingSwapRoute || conversionError)) {
        dispatch((0, _actions.removeToken)(destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.address));
      }
    };
  }, [conversionError, dispatch, destinationTokenAddedForSwap, destinationTokenInfo, fetchParams, isAwaitingSwapRoute]);
  (0, _react.useEffect)(() => {
    return () => {
      clearTemporaryTokenRef.current();
    };
  }, []); // eslint-disable-next-line

  (0, _react.useEffect)(() => {
    if (isFeatureFlagLoaded) {
      (0, _swaps3.fetchTokens)(chainId, useNewSwapsApi).then(tokens => {
        dispatch((0, _actions.setSwapsTokens)(tokens));
      }).catch(error => console.error(error));
      (0, _swaps3.fetchTopAssets)(chainId, useNewSwapsApi).then(topAssets => {
        dispatch((0, _swaps.setTopAssets)(topAssets));
      });
      (0, _swaps3.fetchAggregatorMetadata)(chainId, useNewSwapsApi).then(newAggregatorMetadata => {
        dispatch((0, _swaps.setAggregatorMetadata)(newAggregatorMetadata));
      });

      if (!networkAndAccountSupports1559) {
        dispatch((0, _swaps.fetchAndSetSwapsGasPriceInfo)(chainId));
      }

      return () => {
        dispatch((0, _swaps.prepareToLeaveSwaps)());
      };
    }
  }, [dispatch, chainId, isFeatureFlagLoaded, useNewSwapsApi, networkAndAccountSupports1559]);
  const hardwareWalletUsed = (0, _reactRedux.useSelector)(_selectors.isHardwareWallet);
  const hardwareWalletType = (0, _reactRedux.useSelector)(_selectors.getHardwareWalletType);
  const exitedSwapsEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Exited Swaps',
    category: 'swaps',
    sensitiveProperties: {
      token_from: fetchParams === null || fetchParams === void 0 ? void 0 : (_fetchParams$sourceTo = fetchParams.sourceTokenInfo) === null || _fetchParams$sourceTo === void 0 ? void 0 : _fetchParams$sourceTo.symbol,
      token_from_amount: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.value,
      request_type: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.balanceError,
      token_to: fetchParams === null || fetchParams === void 0 ? void 0 : (_fetchParams$destinat = fetchParams.destinationTokenInfo) === null || _fetchParams$destinat === void 0 ? void 0 : _fetchParams$destinat.symbol,
      slippage: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage,
      custom_slippage: (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage) !== 2,
      current_screen: pathname.match(/\/swaps\/(.+)/u)[1],
      is_hardware_wallet: hardwareWalletUsed,
      hardware_wallet_type: hardwareWalletType
    }
  });
  const exitEventRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    exitEventRef.current = () => {
      exitedSwapsEvent();
    };
  });
  (0, _react.useEffect)(() => {
    const fetchSwapsLivenessWrapper = async () => {
      await dispatch((0, _swaps.fetchSwapsLiveness)());
      setIsFeatureFlagLoaded(true);
    };

    fetchSwapsLivenessWrapper();
    return () => {
      exitEventRef.current();
    };
  }, [dispatch]);
  (0, _react.useEffect)(() => {
    // If there is a swapsErrorKey and reviewSwapClicked is false, there was an error in silent quotes prefetching
    // and we don't want to show the error page in that case, because another API call for quotes can be successful.
    if (swapsErrorKey && !isSwapsErrorRoute && reviewSwapClicked) {
      history.push(_routes.SWAPS_ERROR_ROUTE);
    }
  }, [history, swapsErrorKey, isSwapsErrorRoute, reviewSwapClicked]);
  const beforeUnloadEventAddedRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    const fn = () => {
      clearTemporaryTokenRef.current();

      if (isLoadingQuotesRoute) {
        dispatch((0, _swaps.prepareToLeaveSwaps)());
      }

      return null;
    };

    if (isLoadingQuotesRoute && !beforeUnloadEventAddedRef.current) {
      beforeUnloadEventAddedRef.current = true;
      window.addEventListener('beforeunload', fn);
    }

    return () => window.removeEventListener('beforeunload', fn);
  }, [dispatch, isLoadingQuotesRoute]);

  if (!isSwapsChain) {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
      to: {
        pathname: _routes.DEFAULT_ROUTE
      }
    });
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps__container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps__header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps__title"
  }, t('swap')), !isAwaitingSwapRoute && !isAwaitingSignaturesRoute && /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps__header-cancel",
    onClick: async () => {
      clearTemporaryTokenRef.current();
      dispatch((0, _swaps.clearSwapsState)());
      await dispatch((0, _actions.resetBackgroundSwapsState)());
      history.push(_routes.DEFAULT_ROUTE);
    }
  }, t('cancel'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps__content"
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_featureToggledRoute.default, {
    redirectRoute: _routes.SWAPS_MAINTENANCE_ROUTE,
    flag: swapsEnabled,
    path: _routes.BUILD_QUOTE_ROUTE,
    exact: true,
    render: () => {
      if (tradeTxData && !conversionError) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
          to: {
            pathname: _routes.AWAITING_SWAP_ROUTE
          }
        });
      } else if (tradeTxData && routeState) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
          to: {
            pathname: _routes.SWAPS_ERROR_ROUTE
          }
        });
      } else if (routeState === 'loading' && aggregatorMetadata) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
          to: {
            pathname: _routes.LOADING_QUOTES_ROUTE
          }
        });
      }

      const onInputChange = (newInputValue, balance) => {
        setInputValue(newInputValue);
        const balanceError = new _bignumber.default(newInputValue || 0).gt(balance || 0); // "setBalanceError" is just a warning, a user can still click on the "Review Swap" button.

        dispatch((0, _swaps.setBalanceError)(balanceError));
        setTokenFromError(fromToken && (0, _swaps3.countDecimals)(newInputValue) > fromToken.decimals ? 'tooManyDecimals' : null);
      };

      return /*#__PURE__*/_react.default.createElement(_buildQuote.default, {
        inputValue: inputValue,
        onInputChange: onInputChange,
        ethBalance: ethBalance,
        setMaxSlippage: setMaxSlippage,
        selectedAccountAddress: selectedAccountAddress,
        maxSlippage: maxSlippage,
        isFeatureFlagLoaded: isFeatureFlagLoaded,
        tokenFromError: tokenFromError,
        shuffledTokensList: listTokenValues
      });
    }
  }), /*#__PURE__*/_react.default.createElement(_featureToggledRoute.default, {
    redirectRoute: _routes.SWAPS_MAINTENANCE_ROUTE,
    flag: swapsEnabled,
    path: _routes.VIEW_QUOTE_ROUTE,
    exact: true,
    render: () => {
      if (Object.values(quotes).length) {
        return /*#__PURE__*/_react.default.createElement(_viewQuote.default, {
          numberOfQuotes: Object.values(quotes).length
        });
      } else if (fetchParams) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
          to: {
            pathname: _routes.SWAPS_ERROR_ROUTE
          }
        });
      }

      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.BUILD_QUOTE_ROUTE
        }
      });
    }
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: _routes.SWAPS_ERROR_ROUTE,
    exact: true,
    render: () => {
      if (swapsErrorKey) {
        return /*#__PURE__*/_react.default.createElement(_awaitingSwap.default, {
          swapComplete: false,
          errorKey: swapsErrorKey,
          txHash: tradeTxData === null || tradeTxData === void 0 ? void 0 : tradeTxData.hash,
          inputValue: inputValue,
          maxSlippage: maxSlippage,
          submittedTime: tradeTxData === null || tradeTxData === void 0 ? void 0 : tradeTxData.submittedTime
        });
      }

      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.BUILD_QUOTE_ROUTE
        }
      });
    }
  }), /*#__PURE__*/_react.default.createElement(_featureToggledRoute.default, {
    redirectRoute: _routes.SWAPS_MAINTENANCE_ROUTE,
    flag: swapsEnabled,
    path: _routes.LOADING_QUOTES_ROUTE,
    exact: true,
    render: () => {
      return aggregatorMetadata ? /*#__PURE__*/_react.default.createElement(_loadingSwapsQuotes.default, {
        loadingComplete: !fetchingQuotes && Boolean(Object.values(quotes).length),
        onDone: async () => {
          await dispatch((0, _actions.setBackgroundSwapRouteState)(''));

          if (swapsErrorKey === _swaps2.ERROR_FETCHING_QUOTES || swapsErrorKey === _swaps2.QUOTES_NOT_AVAILABLE_ERROR) {
            dispatch((0, _actions.setSwapsErrorKey)(_swaps2.QUOTES_NOT_AVAILABLE_ERROR));
            history.push(_routes.SWAPS_ERROR_ROUTE);
          } else {
            history.push(_routes.VIEW_QUOTE_ROUTE);
          }
        },
        aggregatorMetadata: aggregatorMetadata
      }) : /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.BUILD_QUOTE_ROUTE
        }
      });
    }
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: _routes.SWAPS_MAINTENANCE_ROUTE,
    exact: true,
    render: () => {
      return swapsEnabled === false ? /*#__PURE__*/_react.default.createElement(_awaitingSwap.default, {
        errorKey: _swaps2.OFFLINE_FOR_MAINTENANCE
      }) : /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.BUILD_QUOTE_ROUTE
        }
      });
    }
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: _routes.AWAITING_SIGNATURES_ROUTE,
    exact: true,
    render: () => {
      return /*#__PURE__*/_react.default.createElement(_awaitingSignatures.default, null);
    }
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: _routes.AWAITING_SWAP_ROUTE,
    exact: true,
    render: () => {
      return routeState === 'awaiting' || tradeTxData ? /*#__PURE__*/_react.default.createElement(_awaitingSwap.default, {
        swapComplete: tradeConfirmed,
        txHash: tradeTxData === null || tradeTxData === void 0 ? void 0 : tradeTxData.hash,
        tokensReceived: tokensReceived,
        submittingSwap: routeState === 'awaiting' && !(approveTxId || tradeTxId),
        inputValue: inputValue,
        maxSlippage: maxSlippage
      }) : /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.DEFAULT_ROUTE
        }
      });
    }
  })))));
}

//# sourceMappingURL=ui/pages/swaps/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/index.js",}],
[3741, {"./modal":3745,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Modal", {
  enumerable: true,
  get: function () {
    return _modal.default;
  }
});

var _modal = _interopRequireDefault(require("./modal"));

//# sourceMappingURL=ui/components/app/modals/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/index.js",}],
[4057, {"./confirm-add-suggested-token.container":4056,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _confirmAddSuggestedToken = _interopRequireDefault(require("./confirm-add-suggested-token.container"));

var _default = _confirmAddSuggestedToken.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-add-suggested-token/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-add-suggested-token/index.js",}],
[4135, {"./first-time-flow.container":4134,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _firstTimeFlow.default;
  }
});

var _firstTimeFlow = _interopRequireDefault(require("./first-time-flow.container"));

//# sourceMappingURL=ui/pages/first-time-flow/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/index.js",}],
[3615, {"./account-menu.container":3614,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _accountMenu.default;
  }
});

var _accountMenu = _interopRequireDefault(require("./account-menu.container"));

//# sourceMappingURL=ui/components/app/account-menu/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/account-menu/index.js",}],
[4174, {"../../components/ui/button":3842,"../../components/ui/text-field":3951,"../../helpers/constants/routes":3995,"../../store/actions":4331,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"ethers":1832,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _ethers = require("ethers");

var _actions = require("../../store/actions");

var _routes = require("../../helpers/constants/routes");

var _textField = _interopRequireDefault(require("../../components/ui/text-field"));

var _button = _interopRequireDefault(require("../../components/ui/button"));

const {
  isValidMnemonic
} = _ethers.ethers.utils;

class RestoreVaultPage extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      seedPhrase: '',
      showSeedPhrase: false,
      password: '',
      confirmPassword: '',
      seedPhraseError: null,
      passwordError: null,
      confirmPasswordError: null
    });
    (0, _defineProperty2.default)(this, "parseSeedPhrase", seedPhrase => {
      var _trim$toLowerCase$mat;

      return ((_trim$toLowerCase$mat = (seedPhrase || '').trim().toLowerCase().match(/\w+/gu)) === null || _trim$toLowerCase$mat === void 0 ? void 0 : _trim$toLowerCase$mat.join(' ')) || '';
    });
    (0, _defineProperty2.default)(this, "onClick", () => {
      const {
        password,
        seedPhrase
      } = this.state;
      const {
        // eslint-disable-next-line no-shadow
        createNewVaultAndRestore,
        leaveImportSeedScreenState,
        history,
        // eslint-disable-next-line no-shadow
        initializeThreeBox
      } = this.props;
      leaveImportSeedScreenState();
      createNewVaultAndRestore(password, this.parseSeedPhrase(seedPhrase)).then(() => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Retention',
            action: 'userEntersSeedPhrase',
            name: 'onboardingRestoredVault'
          }
        });
        initializeThreeBox();
        history.push(_routes.DEFAULT_ROUTE);
      });
    });
    (0, _defineProperty2.default)(this, "toggleShowSeedPhrase", () => {
      this.setState(({
        showSeedPhrase
      }) => ({
        showSeedPhrase: !showSeedPhrase
      }));
    });
  }

  handleSeedPhraseChange(seedPhrase) {
    const {
      t
    } = this.context;
    let seedPhraseError = null;
    const wordCount = this.parseSeedPhrase(seedPhrase).split(/\s/u).length;

    if (seedPhrase && (wordCount % 3 !== 0 || wordCount < 12 || wordCount > 24)) {
      seedPhraseError = t('seedPhraseReq');
    } else if (!isValidMnemonic(seedPhrase)) {
      seedPhraseError = t('invalidSeedPhrase');
    }

    this.setState({
      seedPhrase,
      seedPhraseError
    });
  }

  handlePasswordChange(password) {
    const {
      confirmPassword
    } = this.state;
    let confirmPasswordError = null;
    let passwordError = null;

    if (password && password.length < 8) {
      passwordError = this.context.t('passwordNotLongEnough');
    }

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordError = this.context.t('passwordsDontMatch');
    }

    this.setState({
      password,
      passwordError,
      confirmPasswordError
    });
  }

  handleConfirmPasswordChange(confirmPassword) {
    const {
      password
    } = this.state;
    let confirmPasswordError = null;

    if (password !== confirmPassword) {
      confirmPasswordError = this.context.t('passwordsDontMatch');
    }

    this.setState({
      confirmPassword,
      confirmPasswordError
    });
  }

  hasError() {
    const {
      passwordError,
      confirmPasswordError,
      seedPhraseError
    } = this.state;
    return passwordError || confirmPasswordError || seedPhraseError;
  }

  render() {
    const {
      seedPhrase,
      showSeedPhrase,
      password,
      confirmPassword,
      seedPhraseError,
      passwordError,
      confirmPasswordError
    } = this.state;
    const {
      t
    } = this.context;
    const {
      isLoading
    } = this.props;
    const disabled = !seedPhrase || !password || !confirmPassword || isLoading || this.hasError();
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "first-view-main-wrapper"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "first-view-main"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "import-account"
    }, /*#__PURE__*/_react.default.createElement("a", {
      className: "import-account__back-button",
      onClick: e => {
        e.preventDefault();
        this.props.leaveImportSeedScreenState();
        this.props.history.goBack();
      },
      href: "#"
    }, `< ${t('back')}`), /*#__PURE__*/_react.default.createElement("div", {
      className: "import-account__title"
    }, this.context.t('restoreAccountWithSeed')), /*#__PURE__*/_react.default.createElement("div", {
      className: "import-account__selector-label"
    }, this.context.t('secretPhrase')), /*#__PURE__*/_react.default.createElement("div", {
      className: "import-account__input-wrapper"
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "import-account__input-label"
    }, this.context.t('walletSeedRestore')), showSeedPhrase ? /*#__PURE__*/_react.default.createElement("textarea", {
      className: "import-account__secret-phrase",
      onChange: e => this.handleSeedPhraseChange(e.target.value),
      value: seedPhrase,
      autoFocus: true,
      placeholder: this.context.t('separateEachWord')
    }) : /*#__PURE__*/_react.default.createElement(_textField.default, {
      className: "import-account__textarea import-account__seedphrase",
      type: "password",
      onChange: e => this.handleSeedPhraseChange(e.target.value),
      value: seedPhrase,
      autoFocus: true,
      placeholder: t('seedPhrasePlaceholderPaste')
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "error"
    }, seedPhraseError), /*#__PURE__*/_react.default.createElement("div", {
      className: "import-account__checkbox-container",
      onClick: this.toggleShowSeedPhrase
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "import-account__checkbox",
      tabIndex: "0",
      id: "seed-checkbox",
      role: "checkbox",
      onKeyPress: this.toggleShowSeedPhrase,
      "aria-checked": showSeedPhrase,
      "aria-labelledby": "ftf-chk1-label"
    }, showSeedPhrase ? /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-check fa-2x"
    }) : null), /*#__PURE__*/_react.default.createElement("label", {
      htmlFor: "seed-checkbox",
      id: "ftf-chk1-label",
      className: "import-account__checkbox-label"
    }, t('showSeedPhrase')))), /*#__PURE__*/_react.default.createElement(_textField.default, {
      id: "password",
      label: t('newPassword'),
      type: "password",
      className: "first-time-flow__input",
      value: this.state.password,
      onChange: event => this.handlePasswordChange(event.target.value),
      error: passwordError,
      autoComplete: "new-password",
      margin: "normal",
      largeLabel: true
    }), /*#__PURE__*/_react.default.createElement(_textField.default, {
      id: "confirm-password",
      label: t('confirmPassword'),
      type: "password",
      className: "first-time-flow__input",
      value: this.state.confirmPassword,
      onChange: event => this.handleConfirmPasswordChange(event.target.value),
      error: confirmPasswordError,
      autoComplete: "confirm-password",
      margin: "normal",
      largeLabel: true
    }), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "first-time",
      className: "first-time-flow__button",
      onClick: () => !disabled && this.onClick(),
      disabled: disabled
    }, this.context.t('restore')))));
  }

}

(0, _defineProperty2.default)(RestoreVaultPage, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(RestoreVaultPage, "propTypes", {
  createNewVaultAndRestore: _propTypes.default.func.isRequired,
  leaveImportSeedScreenState: _propTypes.default.func,
  history: _propTypes.default.object,
  isLoading: _propTypes.default.bool,
  initializeThreeBox: _propTypes.default.func
});

var _default = (0, _reactRedux.connect)(({
  appState: {
    isLoading
  }
}) => ({
  isLoading
}), dispatch => ({
  leaveImportSeedScreenState: () => {
    dispatch((0, _actions.unMarkPasswordForgotten)());
  },
  createNewVaultAndRestore: (pw, seed) => dispatch((0, _actions.createNewVaultAndRestore)(pw, seed)),
  initializeThreeBox: () => dispatch((0, _actions.initializeThreeBox)())
}))(RestoreVaultPage);

exports.default = _default;

//# sourceMappingURL=ui/pages/keychains/restore-vault.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/keychains/restore-vault.js",}],
[4192, {"./send":4227,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _send.default;
  }
});

var _send = _interopRequireDefault(require("./send"));

//# sourceMappingURL=ui/pages/send/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/index.js",}],
[4162, {"./home.container":4161,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _home.default;
  }
});

var _home = _interopRequireDefault(require("./home.container"));

//# sourceMappingURL=ui/pages/home/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/home/index.js",}],
[4093, {"./confirm-transaction.container":4092,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _confirmTransaction = _interopRequireDefault(require("./confirm-transaction.container"));

var _default = _confirmTransaction.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-transaction/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-transaction/index.js",}],
[4320, {"./unlock-page.container":4322,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _unlockPage = _interopRequireDefault(require("./unlock-page.container"));

var _default = _unlockPage.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/unlock-page/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/unlock-page/index.js",}],
[2265, {"./path-getter":2267,"./utils":2268}, function (require, module, exports) {
var pathGetter = require('./path-getter');
var utils = require('./utils');

var WMap = typeof WeakMap !== 'undefined'?
  WeakMap:
  function() {
    var keys = [];
    var values = [];
    return {
      set: function(key, value) {
        keys.push(key);
        values.push(value);
      },
      get: function(key) {
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === key) {
            return values[i];
          }
        }
      }
    }
  };

// Based on https://github.com/douglascrockford/JSON-js/blob/master/cycle.js

exports.decycle = function decycle(object, options, replacer) {
  'use strict';

  var map = new WMap()

  var noCircularOption = !Object.prototype.hasOwnProperty.call(options, 'circular');
  var withRefs = options.refs !== false;

  return (function derez(_value, path, key) {

    // The derez recurses through the object, producing the deep copy.

    var i,        // The loop counter
      name,       // Property name
      nu;         // The new object or array

    // typeof null === 'object', so go on if this value is really an object but not
    // one of the weird builtin objects.

    var value = typeof replacer === 'function' ? replacer(key || '', _value) : _value;

    if (options.date && value instanceof Date) {
      return {$jsan: 'd' + value.getTime()};
    }
    if (options.regex && value instanceof RegExp) {
      return {$jsan: 'r' + utils.getRegexFlags(value) + ',' + value.source};
    }
    if (options['function'] && typeof value === 'function') {
      return {$jsan: 'f' + utils.stringifyFunction(value, options['function'])}
    }
    if (options['nan'] && typeof value === 'number' && isNaN(value)) {
      return {$jsan: 'n'}
    }
    if (options['infinity']) {
      if (Number.POSITIVE_INFINITY === value) return {$jsan: 'i'}
      if (Number.NEGATIVE_INFINITY === value) return {$jsan: 'y'}
    }
    if (options['undefined'] && value === undefined) {
      return {$jsan: 'u'}
    }
    if (options['error'] && value instanceof Error) {
      return {$jsan: 'e' + value.message}
    }
    if (options['symbol'] && typeof value === 'symbol') {
      var symbolKey = Symbol.keyFor(value)
      if (symbolKey !== undefined) {
        return {$jsan: 'g' + symbolKey}
      }

      // 'Symbol(foo)'.slice(7, -1) === 'foo'
      return {$jsan: 's' + value.toString().slice(7, -1)}
    }

    if (options['map'] && typeof Map === 'function' && value instanceof Map && typeof Array.from === 'function') {
      return {$jsan: 'm' + JSON.stringify(decycle(Array.from(value), options, replacer))}
    }

    if (options['set'] && typeof Set === 'function' && value instanceof Set && typeof Array.from === 'function') {
      return {$jsan: 'l' + JSON.stringify(decycle(Array.from(value), options, replacer))}
    }

    if (value && typeof value.toJSON === 'function') {
      try {
        value = value.toJSON(key);
      } catch (error) {
        var keyString = (key || '$');
        return "toJSON failed for '" + (map.get(value) || keyString) + "'";
      }
    }

    if (typeof value === 'object' && value !== null &&
      !(value instanceof Boolean) &&
      !(value instanceof Date)    &&
      !(value instanceof Number)  &&
      !(value instanceof RegExp)  &&
      !(value instanceof String)  &&
      !(typeof value === 'symbol')  &&
      !(value instanceof Error)) {

        // If the value is an object or array, look to see if we have already
        // encountered it. If so, return a $ref/path object.

      if (typeof value === 'object') {
        var foundPath = map.get(value);
        if (foundPath) {
          if (noCircularOption && withRefs) {
            return {$jsan: foundPath};
          }
          if (path.indexOf(foundPath) === 0) {
            if (!noCircularOption) {
              return typeof options.circular === 'function'?
              options.circular(value, path, foundPath):
              options.circular;
            }
            return {$jsan: foundPath};
          }
          if (withRefs) return {$jsan: foundPath};
        }
        map.set(value, path);
      }


      // If it is an array, replicate the array.

      if (Object.prototype.toString.apply(value) === '[object Array]') {
          nu = [];
          for (i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path + '[' + i + ']', i);
          }
      } else {

        // If it is an object, replicate the object.

        nu = {};
        for (name in value) {
          if (Object.prototype.hasOwnProperty.call(value, name)) {
            var nextPath = /^\w+$/.test(name) ?
              '.' + name :
              '[' + JSON.stringify(name) + ']';
            nu[name] = name === '$jsan' ? [derez(value[name], path + nextPath)] : derez(value[name], path + nextPath, name);
          }
        }
      }
      return nu;
    }
    return value;
  }(object, '$'));
};


exports.retrocycle = function retrocycle($) {
  'use strict';


  return (function rez(value) {

    // The rez function walks recursively through the object looking for $jsan
    // properties. When it finds one that has a value that is a path, then it
    // replaces the $jsan object with a reference to the value that is found by
    // the path.

    var i, item, name, path;

    if (value && typeof value === 'object') {
      if (Object.prototype.toString.apply(value) === '[object Array]') {
        for (i = 0; i < value.length; i += 1) {
          item = value[i];
          if (item && typeof item === 'object') {
            if (item.$jsan) {
              value[i] = utils.restore(item.$jsan, $);
            } else {
              rez(item);
            }
          }
        }
      } else {
        for (name in value) {
          // base case passed raw object
          if(typeof value[name] === 'string' && name === '$jsan'){
            return utils.restore(value.$jsan, $);
            break;
          }
          else {
            if (name === '$jsan') {
              value[name] = value[name][0];
            }
            if (typeof value[name] === 'object') {
              item = value[name];
              if (item && typeof item === 'object') {
                if (item.$jsan) {
                  value[name] = utils.restore(item.$jsan, $);
                } else {
                  rez(item);
                }
              }
            }
          }
        }
      }
    }
    return value;
  }($));
};

//# sourceMappingURL=node_modules/jsan/lib/cycle.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/jsan/lib/cycle.js",}],
[3243, {"./decycle":3242}, function (require, module, exports) {
var decycle = require('./decycle');

var isStrict = (function () { return !this; })();

function AuthTokenExpiredError(message, expiry) {
  this.name = 'AuthTokenExpiredError';
  this.message = message;
  this.expiry = expiry;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenExpiredError.prototype = Object.create(Error.prototype);


function AuthTokenInvalidError(message) {
  this.name = 'AuthTokenInvalidError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenInvalidError.prototype = Object.create(Error.prototype);


function AuthTokenNotBeforeError(message, date) {
  this.name = 'AuthTokenNotBeforeError';
  this.message = message;
  this.date = date;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenNotBeforeError.prototype = Object.create(Error.prototype);


// For any other auth token error.
function AuthTokenError(message) {
  this.name = 'AuthTokenError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthTokenError.prototype = Object.create(Error.prototype);

// For any other auth error; not specifically related to the auth token itself.
function AuthError(message) {
  this.name = 'AuthError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
AuthError.prototype = Object.create(Error.prototype);


function SilentMiddlewareBlockedError(message, type) {
  this.name = 'SilentMiddlewareBlockedError';
  this.message = message;
  this.type = type;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
SilentMiddlewareBlockedError.prototype = Object.create(Error.prototype);


function InvalidActionError(message) {
  this.name = 'InvalidActionError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidActionError.prototype = Object.create(Error.prototype);

function InvalidArgumentsError(message) {
  this.name = 'InvalidArgumentsError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidArgumentsError.prototype = Object.create(Error.prototype);

function InvalidOptionsError(message) {
  this.name = 'InvalidOptionsError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidOptionsError.prototype = Object.create(Error.prototype);


function InvalidMessageError(message) {
  this.name = 'InvalidMessageError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
InvalidMessageError.prototype = Object.create(Error.prototype);


function SocketProtocolError(message, code) {
  this.name = 'SocketProtocolError';
  this.message = message;
  this.code = code;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
SocketProtocolError.prototype = Object.create(Error.prototype);


function ServerProtocolError(message) {
  this.name = 'ServerProtocolError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
ServerProtocolError.prototype = Object.create(Error.prototype);

function HTTPServerError(message) {
  this.name = 'HTTPServerError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
HTTPServerError.prototype = Object.create(Error.prototype);


function ResourceLimitError(message) {
  this.name = 'ResourceLimitError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
ResourceLimitError.prototype = Object.create(Error.prototype);


function TimeoutError(message) {
  this.name = 'TimeoutError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
TimeoutError.prototype = Object.create(Error.prototype);


function BadConnectionError(message, type) {
  this.name = 'BadConnectionError';
  this.message = message;
  this.type = type;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
BadConnectionError.prototype = Object.create(Error.prototype);


function BrokerError(message) {
  this.name = 'BrokerError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
BrokerError.prototype = Object.create(Error.prototype);


function ProcessExitError(message, code) {
  this.name = 'ProcessExitError';
  this.message = message;
  this.code = code;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
ProcessExitError.prototype = Object.create(Error.prototype);


function UnknownError(message) {
  this.name = 'UnknownError';
  this.message = message;
  if (Error.captureStackTrace && !isStrict) {
    Error.captureStackTrace(this, arguments.callee);
  } else {
    this.stack = (new Error()).stack;
  }
}
UnknownError.prototype = Object.create(Error.prototype);


// Expose all error types.

module.exports = {
  AuthTokenExpiredError: AuthTokenExpiredError,
  AuthTokenInvalidError: AuthTokenInvalidError,
  AuthTokenNotBeforeError: AuthTokenNotBeforeError,
  AuthTokenError: AuthTokenError,
  AuthError: AuthError,
  SilentMiddlewareBlockedError: SilentMiddlewareBlockedError,
  InvalidActionError: InvalidActionError,
  InvalidArgumentsError: InvalidArgumentsError,
  InvalidOptionsError: InvalidOptionsError,
  InvalidMessageError: InvalidMessageError,
  SocketProtocolError: SocketProtocolError,
  ServerProtocolError: ServerProtocolError,
  HTTPServerError: HTTPServerError,
  ResourceLimitError: ResourceLimitError,
  TimeoutError: TimeoutError,
  BadConnectionError: BadConnectionError,
  BrokerError: BrokerError,
  ProcessExitError: ProcessExitError,
  UnknownError: UnknownError
};

module.exports.socketProtocolErrorStatuses = {
  1001: 'Socket was disconnected',
  1002: 'A WebSocket protocol error was encountered',
  1003: 'Server terminated socket because it received invalid data',
  1005: 'Socket closed without status code',
  1006: 'Socket hung up',
  1007: 'Message format was incorrect',
  1008: 'Encountered a policy violation',
  1009: 'Message was too big to process',
  1010: 'Client ended the connection because the server did not comply with extension requirements',
  1011: 'Server encountered an unexpected fatal condition',
  4000: 'Server ping timed out',
  4001: 'Client pong timed out',
  4002: 'Server failed to sign auth token',
  4003: 'Failed to complete handshake',
  4004: 'Client failed to save auth token',
  4005: 'Did not receive #handshake from client before timeout',
  4006: 'Failed to bind socket to message broker',
  4007: 'Client connection establishment timed out',
  4008: 'Server rejected handshake from client',
  4009: 'Server received a message before the client handshake'
};

module.exports.socketProtocolIgnoreStatuses = {
  1000: 'Socket closed normally',
  1001: 'Socket hung up'
};

// Properties related to error domains cannot be serialized.
var unserializableErrorProperties = {
  domain: 1,
  domainEmitter: 1,
  domainThrown: 1
};

// Convert an error into a JSON-compatible type which can later be hydrated
// back to its *original* form.
module.exports.dehydrateError = function dehydrateError(error, includeStackTrace) {
  var dehydratedError;

  if (error && typeof error === 'object') {
    dehydratedError = {
      message: error.message
    };
    if (includeStackTrace) {
      dehydratedError.stack = error.stack;
    }
    for (var i in error) {
      if (!unserializableErrorProperties[i]) {
        dehydratedError[i] = error[i];
      }
    }
  } else if (typeof error === 'function') {
    dehydratedError = '[function ' + (error.name || 'anonymous') + ']';
  } else {
    dehydratedError = error;
  }

  return decycle(dehydratedError);
};

// Convert a dehydrated error back to its *original* form.
module.exports.hydrateError = function hydrateError(error) {
  var hydratedError = null;
  if (error != null) {
    if (typeof error === 'object') {
      hydratedError = new Error(error.message);
      for (var i in error) {
        if (error.hasOwnProperty(i)) {
          hydratedError[i] = error[i];
        }
      }
    } else {
      hydratedError = error;
    }
  }
  return hydratedError;
};

module.exports.decycle = decycle;

//# sourceMappingURL=node_modules/sc-errors/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/sc-errors/index.js",}],
[3333, {"./v1":3336,"./v4":3337}, function (require, module, exports) {
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

//# sourceMappingURL=node_modules/socketcluster-client/node_modules/uuid/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/node_modules/uuid/index.js",}],
[3325, {}, function (require, module, exports) {
(function (global){
var AuthEngine = function () {
  this._internalStorage = {};
  this.isLocalStorageEnabled = this._checkLocalStorageEnabled();
};

AuthEngine.prototype._checkLocalStorageEnabled = function () {
  var err;
  try {
    // Some browsers will throw an error here if localStorage is disabled.
    global.localStorage;

    // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
    // throw QuotaExceededError. We're going to detect this and avoid hard to debug edge cases.
    global.localStorage.setItem('__scLocalStorageTest', 1);
    global.localStorage.removeItem('__scLocalStorageTest');
  } catch (e) {
    err = e;
  }
  return !err;
};

AuthEngine.prototype.saveToken = function (name, token, options, callback) {
  if (this.isLocalStorageEnabled && global.localStorage) {
    global.localStorage.setItem(name, token);
  } else {
    this._internalStorage[name] = token;
  }
  callback && callback(null, token);
};

AuthEngine.prototype.removeToken = function (name, callback) {
  var token;

  this.loadToken(name, function (err, authToken) {
    token = authToken;
  });

  if (this.isLocalStorageEnabled && global.localStorage) {
    global.localStorage.removeItem(name);
  } else {
    delete this._internalStorage[name];
  }

  callback && callback(null, token);
};

AuthEngine.prototype.loadToken = function (name, callback) {
  var token;

  if (this.isLocalStorageEnabled && global.localStorage) {
    token = global.localStorage.getItem(name);
  } else {
    token = this._internalStorage[name] || null;
  }
  callback(null, token);
};

module.exports.AuthEngine = AuthEngine;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/socketcluster-client/lib/auth.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/lib/auth.js",}],
[3244, {}, function (require, module, exports) {
(function (global){
var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var validJSONStartRegex = /^[ \n\r\t]*[{\[]/;

var arrayBufferToBase64 = function (arraybuffer) {
  var bytes = new Uint8Array(arraybuffer);
  var len = bytes.length;
  var base64 = '';

  for (var i = 0; i < len; i += 3) {
    base64 += base64Chars[bytes[i] >> 2];
    base64 += base64Chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += base64Chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += base64Chars[bytes[i + 2] & 63];
  }

  if ((len % 3) === 2) {
    base64 = base64.substring(0, base64.length - 1) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + '==';
  }

  return base64;
};

var binaryToBase64Replacer = function (key, value) {
  if (global.ArrayBuffer && value instanceof global.ArrayBuffer) {
    return {
      base64: true,
      data: arrayBufferToBase64(value)
    };
  } else if (global.Buffer) {
    if (value instanceof global.Buffer){
      return {
        base64: true,
        data: value.toString('base64')
      };
    }
    // Some versions of Node.js convert Buffers to Objects before they are passed to
    // the replacer function - Because of this, we need to rehydrate Buffers
    // before we can convert them to base64 strings.
    if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
      var rehydratedBuffer;
      if (global.Buffer.from) {
        rehydratedBuffer = global.Buffer.from(value.data);
      } else {
        rehydratedBuffer = new global.Buffer(value.data);
      }
      return {
        base64: true,
        data: rehydratedBuffer.toString('base64')
      };
    }
  }
  return value;
};

// Decode the data which was transmitted over the wire to a JavaScript Object in a format which SC understands.
// See encode function below for more details.
module.exports.decode = function (input) {
  if (input == null) {
   return null;
  }
  // Leave ping or pong message as is
  if (input === '#1' || input === '#2') {
    return input;
  }
  var message = input.toString();

  // Performance optimization to detect invalid JSON packet sooner.
  if (!validJSONStartRegex.test(message)) {
    return message;
  }

  try {
    return JSON.parse(message);
  } catch (err) {}
  return message;
};

// Encode a raw JavaScript object (which is in the SC protocol format) into a format for
// transfering it over the wire. In this case, we just convert it into a simple JSON string.
// If you want to create your own custom codec, you can encode the object into any format
// (e.g. binary ArrayBuffer or string with any kind of compression) so long as your decode
// function is able to rehydrate that object back into its original JavaScript Object format
// (which adheres to the SC protocol).
// See https://github.com/SocketCluster/socketcluster/blob/master/socketcluster-protocol.md
// for details about the SC protocol.
module.exports.encode = function (object) {
  // Leave ping or pong message as is
  if (object === '#1' || object === '#2') {
    return object;
  }
  return JSON.stringify(object, binaryToBase64Replacer);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/sc-formatter/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/sc-formatter/index.js",}],
[3331, {"buffer":1428}, function (require, module, exports) {
(function (Buffer){
var clone = (function() {
'use strict';

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function(value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function(value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/socketcluster-client/node_modules/clone/clone.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/node_modules/clone/clone.js",}],
[3329, {"./response":3327,"component-emitter":3332,"querystring":2996,"sc-errors":3243,"ws":3330}, function (require, module, exports) {
(function (global){
var Emitter = require('component-emitter');
var Response = require('./response').Response;
var querystring = require('querystring');
var WebSocket;
var createWebSocket;

if (global.WebSocket) {
  WebSocket = global.WebSocket;
  createWebSocket = function (uri, options) {
    return new WebSocket(uri);
  };
} else {
  WebSocket = require('ws');
  createWebSocket = function (uri, options) {
    return new WebSocket(uri, null, options);
  };
}

var scErrors = require('sc-errors');
var TimeoutError = scErrors.TimeoutError;
var BadConnectionError = scErrors.BadConnectionError;


var SCTransport = function (authEngine, codecEngine, options) {
  var self = this;

  this.state = this.CLOSED;
  this.auth = authEngine;
  this.codec = codecEngine;
  this.options = options;
  this.connectTimeout = options.connectTimeout;
  this.pingTimeout = options.ackTimeout;
  this.pingTimeoutDisabled = !!options.pingTimeoutDisabled;
  this.callIdGenerator = options.callIdGenerator;
  this.authTokenName = options.authTokenName;

  this._pingTimeoutTicker = null;
  this._callbackMap = {};
  this._batchSendList = [];

  // Open the connection.

  this.state = this.CONNECTING;
  var uri = this.uri();

  var wsSocket = createWebSocket(uri, this.options);
  wsSocket.binaryType = this.options.binaryType;

  this.socket = wsSocket;

  wsSocket.onopen = function () {
    self._onOpen();
  };

  wsSocket.onclose = function (event) {
    var code;
    if (event.code == null) {
      // This is to handle an edge case in React Native whereby
      // event.code is undefined when the mobile device is locked.
      // TODO: This is not perfect since this condition could also apply to
      // an abnormal close (no close control frame) which would be a 1006.
      code = 1005;
    } else {
      code = event.code;
    }
    self._onClose(code, event.reason);
  };

  wsSocket.onmessage = function (message, flags) {
    self._onMessage(message.data);
  };

  wsSocket.onerror = function (error) {
    // The onclose event will be called automatically after the onerror event
    // if the socket is connected - Otherwise, if it's in the middle of
    // connecting, we want to close it manually with a 1006 - This is necessary
    // to prevent inconsistent behavior when running the client in Node.js
    // vs in a browser.

    if (self.state === self.CONNECTING) {
      self._onClose(1006);
    }
  };

  this._connectTimeoutRef = setTimeout(function () {
    self._onClose(4007);
    self.socket.close(4007);
  }, this.connectTimeout);
};

SCTransport.prototype = Object.create(Emitter.prototype);

SCTransport.CONNECTING = SCTransport.prototype.CONNECTING = 'connecting';
SCTransport.OPEN = SCTransport.prototype.OPEN = 'open';
SCTransport.CLOSED = SCTransport.prototype.CLOSED = 'closed';

SCTransport.prototype.uri = function () {
  var query = this.options.query || {};
  var schema = this.options.secure ? 'wss' : 'ws';

  if (this.options.timestampRequests) {
    query[this.options.timestampParam] = (new Date()).getTime();
  }

  query = querystring.encode(query);

  if (query.length) {
    query = '?' + query;
  }

  var host;
  if (this.options.host) {
    host = this.options.host;
  } else {
    var port = '';

    if (this.options.port && ((schema === 'wss' && this.options.port !== 443)
      || (schema === 'ws' && this.options.port !== 80))) {
      port = ':' + this.options.port;
    }
    host = this.options.hostname + port;
  }

  return schema + '://' + host + this.options.path + query;
};

SCTransport.prototype._onOpen = function () {
  var self = this;

  clearTimeout(this._connectTimeoutRef);
  this._resetPingTimeout();

  this._handshake(function (err, status) {
    if (err) {
      var statusCode;
      if (status && status.code) {
        statusCode = status.code;
      } else {
        statusCode = 4003;
      }
      self._onError(err);
      self._onClose(statusCode, err.toString());
      self.socket.close(statusCode);
    } else {
      self.state = self.OPEN;
      Emitter.prototype.emit.call(self, 'open', status);
      self._resetPingTimeout();
    }
  });
};

SCTransport.prototype._handshake = function (callback) {
  var self = this;
  this.auth.loadToken(this.authTokenName, function (err, token) {
    if (err) {
      callback(err);
    } else {
      // Don't wait for this.state to be 'open'.
      // The underlying WebSocket (this.socket) is already open.
      var options = {
        force: true
      };
      self.emit('#handshake', {
        authToken: token
      }, options, function (err, status) {
        if (status) {
          // Add the token which was used as part of authentication attempt
          // to the status object.
          status.authToken = token;
          if (status.authError) {
            status.authError = scErrors.hydrateError(status.authError);
          }
        }
        callback(err, status);
      });
    }
  });
};

SCTransport.prototype._abortAllPendingEventsDueToBadConnection = function (failureType) {
  for (var i in this._callbackMap) {
    if (this._callbackMap.hasOwnProperty(i)) {
      var eventObject = this._callbackMap[i];
      delete this._callbackMap[i];

      clearTimeout(eventObject.timeout);
      delete eventObject.timeout;

      var errorMessage = "Event '" + eventObject.event +
        "' was aborted due to a bad connection";
      var badConnectionError = new BadConnectionError(errorMessage, failureType);

      var callback = eventObject.callback;
      delete eventObject.callback;
      callback.call(eventObject, badConnectionError, eventObject);
    }
  }
};

SCTransport.prototype._onClose = function (code, data) {
  delete this.socket.onopen;
  delete this.socket.onclose;
  delete this.socket.onmessage;
  delete this.socket.onerror;

  clearTimeout(this._connectTimeoutRef);
  clearTimeout(this._pingTimeoutTicker);
  clearTimeout(this._batchTimeout);

  if (this.state === this.OPEN) {
    this.state = this.CLOSED;
    Emitter.prototype.emit.call(this, 'close', code, data);
    this._abortAllPendingEventsDueToBadConnection('disconnect');

  } else if (this.state === this.CONNECTING) {
    this.state = this.CLOSED;
    Emitter.prototype.emit.call(this, 'openAbort', code, data);
    this._abortAllPendingEventsDueToBadConnection('connectAbort');
  }
};

SCTransport.prototype._handleEventObject = function (obj, message) {
  if (obj && obj.event != null) {
    var response = new Response(this, obj.cid);
    Emitter.prototype.emit.call(this, 'event', obj.event, obj.data, response);
  } else if (obj && obj.rid != null) {
    var eventObject = this._callbackMap[obj.rid];
    if (eventObject) {
      clearTimeout(eventObject.timeout);
      delete eventObject.timeout;
      delete this._callbackMap[obj.rid];

      if (eventObject.callback) {
        var rehydratedError = scErrors.hydrateError(obj.error);
        eventObject.callback(rehydratedError, obj.data);
      }
    }
  } else {
    Emitter.prototype.emit.call(this, 'event', 'raw', message);
  }
};

SCTransport.prototype._onMessage = function (message) {
  Emitter.prototype.emit.call(this, 'event', 'message', message);

  var obj = this.decode(message);

  // If ping
  if (obj === '#1') {
    this._resetPingTimeout();
    if (this.socket.readyState === this.socket.OPEN) {
      this.sendObject('#2');
    }
  } else {
    if (Array.isArray(obj)) {
      var len = obj.length;
      for (var i = 0; i < len; i++) {
        this._handleEventObject(obj[i], message);
      }
    } else {
      this._handleEventObject(obj, message);
    }
  }
};

SCTransport.prototype._onError = function (err) {
  Emitter.prototype.emit.call(this, 'error', err);
};

SCTransport.prototype._resetPingTimeout = function () {
  if (this.pingTimeoutDisabled) {
    return;
  }
  var self = this;

  var now = (new Date()).getTime();
  clearTimeout(this._pingTimeoutTicker);

  this._pingTimeoutTicker = setTimeout(function () {
    self._onClose(4000);
    self.socket.close(4000);
  }, this.pingTimeout);
};

SCTransport.prototype.getBytesReceived = function () {
  return this.socket.bytesReceived;
};

SCTransport.prototype.close = function (code, data) {
  code = code || 1000;

  if (this.state === this.OPEN) {
    var packet = {
      code: code,
      data: data
    };
    this.emit('#disconnect', packet);

    this._onClose(code, data);
    this.socket.close(code);

  } else if (this.state === this.CONNECTING) {
    this._onClose(code, data);
    this.socket.close(code);
  }
};

SCTransport.prototype.emitObject = function (eventObject, options) {
  var simpleEventObject = {
    event: eventObject.event,
    data: eventObject.data
  };

  if (eventObject.callback) {
    simpleEventObject.cid = eventObject.cid = this.callIdGenerator();
    this._callbackMap[eventObject.cid] = eventObject;
  }

  this.sendObject(simpleEventObject, options);

  return eventObject.cid || null;
};

SCTransport.prototype._handleEventAckTimeout = function (eventObject) {
  if (eventObject.cid) {
    delete this._callbackMap[eventObject.cid];
  }
  delete eventObject.timeout;

  var callback = eventObject.callback;
  if (callback) {
    delete eventObject.callback;
    var error = new TimeoutError("Event response for '" + eventObject.event + "' timed out");
    callback.call(eventObject, error, eventObject);
  }
};

// The last two optional arguments (a and b) can be options and/or callback
SCTransport.prototype.emit = function (event, data, a, b) {
  var self = this;

  var callback, options;

  if (b) {
    options = a;
    callback = b;
  } else {
    if (a instanceof Function) {
      options = {};
      callback = a;
    } else {
      options = a;
    }
  }

  var eventObject = {
    event: event,
    data: data,
    callback: callback
  };

  if (callback && !options.noTimeout) {
    eventObject.timeout = setTimeout(function () {
      self._handleEventAckTimeout(eventObject);
    }, this.options.ackTimeout);
  }

  var cid = null;
  if (this.state === this.OPEN || options.force) {
    cid = this.emitObject(eventObject, options);
  }
  return cid;
};

SCTransport.prototype.cancelPendingResponse = function (cid) {
  delete this._callbackMap[cid];
};

SCTransport.prototype.decode = function (message) {
  return this.codec.decode(message);
};

SCTransport.prototype.encode = function (object) {
  return this.codec.encode(object);
};

SCTransport.prototype.send = function (data) {
  if (this.socket.readyState !== this.socket.OPEN) {
    this._onClose(1005);
  } else {
    this.socket.send(data);
  }
};

SCTransport.prototype.serializeObject = function (object) {
  var str, formatError;
  try {
    str = this.encode(object);
  } catch (err) {
    formatError = err;
    this._onError(formatError);
  }
  if (!formatError) {
    return str;
  }
  return null;
};

SCTransport.prototype.sendObjectBatch = function (object) {
  var self = this;

  this._batchSendList.push(object);
  if (this._batchTimeout) {
    return;
  }

  this._batchTimeout = setTimeout(function () {
    delete self._batchTimeout;
    if (self._batchSendList.length) {
      var str = self.serializeObject(self._batchSendList);
      if (str != null) {
        self.send(str);
      }
      self._batchSendList = [];
    }
  }, this.options.pubSubBatchDuration || 0);
};

SCTransport.prototype.sendObjectSingle = function (object) {
  var str = this.serializeObject(object);
  if (str != null) {
    this.send(str);
  }
};

SCTransport.prototype.sendObject = function (object, options) {
  if (options && options.batch) {
    this.sendObjectBatch(object);
  } else {
    this.sendObjectSingle(object);
  }
};

module.exports.SCTransport = SCTransport;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/socketcluster-client/lib/sctransport.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/lib/sctransport.js",}],
[3327, {"sc-errors":3243}, function (require, module, exports) {
var scErrors = require('sc-errors');
var InvalidActionError = scErrors.InvalidActionError;

var Response = function (socket, id) {
  this.socket = socket;
  this.id = id;
  this.sent = false;
};

Response.prototype._respond = function (responseData) {
  if (this.sent) {
    throw new InvalidActionError('Response ' + this.id + ' has already been sent');
  } else {
    this.sent = true;
    this.socket.send(this.socket.encode(responseData));
  }
};

Response.prototype.end = function (data) {
  if (this.id) {
    var responseData = {
      rid: this.id
    };
    if (data !== undefined) {
      responseData.data = data;
    }
    this._respond(responseData);
  }
};

Response.prototype.error = function (error, data) {
  if (this.id) {
    var err = scErrors.dehydrateError(error);

    var responseData = {
      rid: this.id,
      error: err
    };
    if (data !== undefined) {
      responseData.data = data;
    }

    this._respond(responseData);
  }
};

Response.prototype.callback = function (error, data) {
  if (error) {
    this.error(error, data);
  } else {
    this.end(data);
  }
};

module.exports.Response = Response;

//# sourceMappingURL=node_modules/socketcluster-client/lib/response.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/lib/response.js",}],
[2498, {"./_source/linked-list.js":2497}, function (require, module, exports) {
'use strict';

module.exports = require('./_source/linked-list.js');

//# sourceMappingURL=node_modules/linked-list/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/linked-list/index.js",}],
[3240, {"component-emitter":3241}, function (require, module, exports) {
var Emitter = require('component-emitter');

var SCChannel = function (name, client, options) {
  var self = this;

  Emitter.call(this);

  this.PENDING = 'pending';
  this.SUBSCRIBED = 'subscribed';
  this.UNSUBSCRIBED = 'unsubscribed';

  this.name = name;
  this.state = this.UNSUBSCRIBED;
  this.client = client;

  this.options = options || {};
  this.setOptions(this.options);
};

SCChannel.prototype = Object.create(Emitter.prototype);

SCChannel.prototype.setOptions = function (options) {
  if (!options) {
    options = {};
  }
  this.waitForAuth = options.waitForAuth || false;
  this.batch = options.batch || false;

  if (options.data !== undefined) {
    this.data = options.data;
  }
};

SCChannel.prototype.getState = function () {
  return this.state;
};

SCChannel.prototype.subscribe = function (options) {
  this.client.subscribe(this.name, options);
};

SCChannel.prototype.unsubscribe = function () {
  this.client.unsubscribe(this.name);
};

SCChannel.prototype.isSubscribed = function (includePending) {
  return this.client.isSubscribed(this.name, includePending);
};

SCChannel.prototype.publish = function (data, callback) {
  this.client.publish(this.name, data, callback);
};

SCChannel.prototype.watch = function (handler) {
  this.client.watch(this.name, handler);
};

SCChannel.prototype.unwatch = function (handler) {
  this.client.unwatch(this.name, handler);
};

SCChannel.prototype.watchers = function () {
  return this.client.watchers(this.name);
};

SCChannel.prototype.destroy = function () {
  this.client.destroyChannel(this.name);
};

module.exports.SCChannel = SCChannel;

//# sourceMappingURL=node_modules/sc-channel/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/sc-channel/index.js",}],
[1440, {"base64-js":1346,"ieee754":1936}, function (require, module, exports) {
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        Buffer.from(buf).copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

//# sourceMappingURL=node_modules/buffer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/buffer/index.js",}],
[3155, {}, function (require, module, exports) {
// jsan stringify options

module.exports = {
  refs: false, // references can't be resolved on the original Immutable structure
  date: true,
  function: true,
  regex: true,
  undefined: true,
  error: true,
  symbol: true,
  map: true,
  set: true,
  nan: true,
  infinity: true,
};

//# sourceMappingURL=node_modules/remotedev-serialize/constants/options.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/remotedev-serialize/constants/options.js",}],
[3156, {}, function (require, module, exports) {
function mark(data, type, transformMethod) {
  return {
    data: transformMethod ? data[transformMethod]() : data,
    __serializedType__: type,
  };
}

function extract(data, type) {
  return {
    data: Object.assign({}, data),
    __serializedType__: type,
  };
}

function refer(data, type, isArray, refs) {
  var r = mark(data, type, isArray);
  if (!refs) return r;
  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i];
    if (typeof ref === 'function' && data instanceof ref) {
      r.__serializedRef__ = i;
      return r;
    }
  }
  return r;
}

module.exports = {
  mark: mark,
  extract: extract,
  refer: refer,
};

//# sourceMappingURL=node_modules/remotedev-serialize/helpers/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/remotedev-serialize/helpers/index.js",}],
[2642, {"./_baseGetTag":2535,"./_getPrototype":2574,"./isObjectLike":2641}, function (require, module, exports) {
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

//# sourceMappingURL=node_modules/lodash/isPlainObject.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/isPlainObject.js",}],
[2654, {"./_baseFlatten":2530,"./_baseRest":2552,"./_baseUniq":2557,"./isArrayLikeObject":2636}, function (require, module, exports) {
var baseFlatten = require('./_baseFlatten'),
    baseRest = require('./_baseRest'),
    baseUniq = require('./_baseUniq'),
    isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

module.exports = union;

//# sourceMappingURL=node_modules/lodash/union.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/union.js",}],
[2627, {"./_baseDifference":2528,"./_baseFlatten":2530,"./_baseRest":2552,"./isArrayLikeObject":2636}, function (require, module, exports) {
var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    baseRest = require('./_baseRest'),
    isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;

//# sourceMappingURL=node_modules/lodash/difference.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/difference.js",}],
[2527, {"./_defineProperty":2565}, function (require, module, exports) {
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

//# sourceMappingURL=node_modules/lodash/_baseAssignValue.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseAssignValue.js",}],
[2532, {"./_baseFor":2531,"./keys":2645}, function (require, module, exports) {
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

//# sourceMappingURL=node_modules/lodash/_baseForOwn.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseForOwn.js",}],
[2546, {"./_baseMatches":2548,"./_baseMatchesProperty":2549,"./identity":2631,"./isArray":2634,"./property":2650}, function (require, module, exports) {
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

//# sourceMappingURL=node_modules/lodash/_baseIteratee.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseIteratee.js",}],
[3091, {}, function (require, module, exports) {
"use strict";

exports.__esModule = true;
exports["default"] = isPlainObject;

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = Object.getPrototypeOf(obj);
  if (proto === null) return true;
  var baseProto = proto;

  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}
//# sourceMappingURL=node_modules/react-redux/lib/utils/isPlainObject.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-redux/lib/utils/isPlainObject.js",}],
[3096, {}, function (require, module, exports) {
"use strict";

exports.__esModule = true;
exports["default"] = warning;

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */

}
//# sourceMappingURL=node_modules/react-redux/lib/utils/warning.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-redux/lib/utils/warning.js",}],
[3108, {"./cjs/history.js":3106,"./cjs/history.min.js":3107}, function (require, module, exports) {
'use strict';

if ("production" === 'production') {
  module.exports = require('./cjs/history.min.js');
} else {
  module.exports = require('./cjs/history.js');
}

//# sourceMappingURL=node_modules/react-router/node_modules/history/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-router/node_modules/history/index.js",}],
[2874, {"isarray":2875}, function (require, module, exports) {
var isarray = require('isarray')

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = options && options.delimiter || '/'
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  var delimiter = escapeString(options.delimiter || '/')
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

//# sourceMappingURL=node_modules/path-to-regexp/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/path-to-regexp/index.js",}],
[2669, {"@babel/runtime/helpers/inheritsLoose":185,"gud":1895,"prop-types":2900,"react":3121,"tiny-warning":3389}, function (require, module, exports) {
'use strict';function _interopDefault(e){return(e&&(typeof e==='object')&&'default'in e)?e['default']:e}var React=require('react'),React__default=_interopDefault(React),_inheritsLoose=_interopDefault(require('@babel/runtime/helpers/inheritsLoose')),PropTypes=_interopDefault(require('prop-types')),gud=_interopDefault(require('gud')),warning=_interopDefault(require('tiny-warning'));var MAX_SIGNED_31_BIT_INT = 1073741823;

function objectIs(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function createEventEmitter(value) {
  var handlers = [];
  return {
    on: function on(handler) {
      handlers.push(handler);
    },
    off: function off(handler) {
      handlers = handlers.filter(function (h) {
        return h !== handler;
      });
    },
    get: function get() {
      return value;
    },
    set: function set(newValue, changedBits) {
      value = newValue;
      handlers.forEach(function (handler) {
        return handler(value, changedBits);
      });
    }
  };
}

function onlyChild(children) {
  return Array.isArray(children) ? children[0] : children;
}

function createReactContext(defaultValue, calculateChangedBits) {
  var _Provider$childContex, _Consumer$contextType;

  var contextProp = '__create-react-context-' + gud() + '__';

  var Provider =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(Provider, _Component);

    function Provider() {
      var _this;

      _this = _Component.apply(this, arguments) || this;
      _this.emitter = createEventEmitter(_this.props.value);
      return _this;
    }

    var _proto = Provider.prototype;

    _proto.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[contextProp] = this.emitter, _ref;
    };

    _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        var oldValue = this.props.value;
        var newValue = nextProps.value;
        var changedBits;

        if (objectIs(oldValue, newValue)) {
          changedBits = 0;
        } else {
          changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

          if ("production" !== 'production') {
            warning((changedBits & MAX_SIGNED_31_BIT_INT) === changedBits, 'calculateChangedBits: Expected the return value to be a ' + '31-bit integer. Instead received: ' + changedBits);
          }

          changedBits |= 0;

          if (changedBits !== 0) {
            this.emitter.set(nextProps.value, changedBits);
          }
        }
      }
    };

    _proto.render = function render() {
      return this.props.children;
    };

    return Provider;
  }(React.Component);

  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = PropTypes.object.isRequired, _Provider$childContex);

  var Consumer =
  /*#__PURE__*/
  function (_Component2) {
    _inheritsLoose(Consumer, _Component2);

    function Consumer() {
      var _this2;

      _this2 = _Component2.apply(this, arguments) || this;
      _this2.state = {
        value: _this2.getValue()
      };

      _this2.onUpdate = function (newValue, changedBits) {
        var observedBits = _this2.observedBits | 0;

        if ((observedBits & changedBits) !== 0) {
          _this2.setState({
            value: _this2.getValue()
          });
        }
      };

      return _this2;
    }

    var _proto2 = Consumer.prototype;

    _proto2.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var observedBits = nextProps.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };

    _proto2.componentDidMount = function componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }

      var observedBits = this.props.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };

    _proto2.componentWillUnmount = function componentWillUnmount() {
      if (this.context[contextProp]) {
        this.context[contextProp].off(this.onUpdate);
      }
    };

    _proto2.getValue = function getValue() {
      if (this.context[contextProp]) {
        return this.context[contextProp].get();
      } else {
        return defaultValue;
      }
    };

    _proto2.render = function render() {
      return onlyChild(this.props.children)(this.state.value);
    };

    return Consumer;
  }(React.Component);

  Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = PropTypes.object, _Consumer$contextType);
  return {
    Provider: Provider,
    Consumer: Consumer
  };
}var index = React__default.createContext || createReactContext;module.exports=index;
//# sourceMappingURL=node_modules/mini-create-react-context/dist/cjs/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/mini-create-react-context/dist/cjs/index.js",}],
[3162, {"./cjs/resolve-pathname.js":3160,"./cjs/resolve-pathname.min.js":3161}, function (require, module, exports) {
'use strict';

if ("production" === 'production') {
  module.exports = require('./cjs/resolve-pathname.min.js');
} else {
  module.exports = require('./cjs/resolve-pathname.js');
}

//# sourceMappingURL=node_modules/resolve-pathname/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/resolve-pathname/index.js",}],
[3468, {"./cjs/value-equal.js":3466,"./cjs/value-equal.min.js":3467}, function (require, module, exports) {
'use strict';

if ("production" === 'production') {
  module.exports = require('./cjs/value-equal.min.js');
} else {
  module.exports = require('./cjs/value-equal.js');
}

//# sourceMappingURL=node_modules/value-equal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/value-equal/index.js",}],
[2, {}, function (require, module, exports) {
module.exports={
  "chunks": [
    {
      "color": [0, 0, 0],
      "faces": [
        [11, 12, 13],
        [36, 15, 37],
        [37, 38, 36],
        [31, 39, 22],
        [22, 21, 31],
        [31, 15, 36],
        [36, 39, 31],
        [64, 65, 66],
        [75, 69, 26],
        [26, 80, 75],
        [75, 80, 38],
        [38, 37, 75],
        [38, 80, 39],
        [39, 36, 38],
        [39, 80, 26],
        [26, 22, 39]
      ]
    },
    {
      "color": [236, 229, 220],
      "faces": [
        [19, 20, 21],
        [21, 22, 19],
        [20, 19, 23],
        [23, 24, 20],
        [23, 25, 24],
        [19, 22, 26],
        [26, 27, 19],
        [23, 28, 29],
        [23, 29, 30],
        [25, 23, 30],
        [21, 20, 24],
        [24, 31, 21],
        [24, 25, 30],
        [29, 51, 52],
        [52, 30, 29],
        [27, 26, 69],
        [69, 70, 27],
        [70, 71, 72],
        [72, 27, 70],
        [72, 71, 73],
        [51, 74, 72],
        [52, 51, 72],
        [73, 52, 72],
        [69, 71, 70],
        [71, 69, 75],
        [52, 73, 71],
        [19, 27, 74],
        [74, 28, 19],
        [51, 29, 28],
        [28, 74, 51],
        [74, 27, 72],
        [28, 23, 19]
      ]
    },
    {
      "color": [119, 228, 171],
      "faces": [
        [5, 4, 35],
        [57, 59, 79]
      ]
    },
    {
      "color": [80, 157, 116],
      "faces": [
        [4, 5, 2],
        [2, 5, 6],
        [57, 56, 55],
        [58, 59, 55],
        [2, 1, 4],
        [55, 59, 57]
      ]
    },
    {
      "color": [67, 127, 95],
      "faces": [
        [0, 1, 2],
        [2, 3, 0],
        [6, 3, 2],
        [7, 8, 9],
        [10, 3, 6],
        [10, 50, 7],
        [7, 3, 10],
        [7, 9, 3],
        [49, 0, 9],
        [3, 9, 0],
        [53, 54, 55],
        [55, 56, 53],
        [55, 54, 58],
        [60, 61, 62],
        [63, 58, 54],
        [63, 60, 89],
        [60, 63, 54],
        [60, 54, 61],
        [88, 61, 53],
        [54, 53, 61]
      ]
    },
    {
      "color": [119, 228, 207],
      "faces": [
        [59, 5, 35],
        [35, 79, 59]
      ]
    },
    {
      "color": [163, 230, 235],
      "faces": [
        [14, 15, 11],
        [11, 16, 14],
        [16, 13, 12],
        [17, 33, 10],
        [17, 18, 34],
        [34, 33, 17],
        [11, 15, 31],
        [18, 12, 11],
        [41, 64, 37],
        [64, 41, 40],
        [66, 65, 40],
        [67, 63, 77],
        [67, 77, 76],
        [76, 68, 67],
        [75, 37, 64],
        [68, 64, 66]
      ]
    },
    {
      "color": [204, 237, 236],
      "faces": [
        [10, 6, 17],
        [31, 18, 11],
        [14, 16, 40],
        [40, 41, 14],
        [63, 67, 58],
        [64, 68, 75],
        [14, 41, 37],
        [37, 15, 14],
        [5, 59, 40],
        [40, 16, 5]
      ]
    },
    {
      "color": [207, 248, 247],
      "faces": [
        [6, 5, 16],
        [16, 17, 6],
        [12, 17, 16],
        [58, 67, 40],
        [40, 59, 58],
        [40, 67, 66]
      ]
    },
    {
      "color": [127, 185, 228],
      "faces": [
        [33, 34, 24],
        [71, 76, 77]
      ]
    },
    {
      "color": [119, 200, 228],
      "faces": [
        [31, 24, 18],
        [24, 34, 18],
        [35, 4, 42],
        [4, 1, 42],
        [42, 43, 44],
        [44, 35, 42],
        [45, 43, 42],
        [42, 10, 45],
        [30, 32, 24],
        [30, 33, 32],
        [33, 30, 10],
        [44, 43, 46],
        [43, 45, 47],
        [47, 46, 43],
        [48, 47, 45],
        [45, 30, 48],
        [30, 45, 10],
        [49, 42, 0],
        [8, 7, 42],
        [50, 42, 7],
        [50, 10, 42],
        [1, 0, 42],
        [42, 9, 8],
        [42, 49, 9],
        [75, 68, 71],
        [71, 68, 76],
        [79, 81, 57],
        [57, 81, 56],
        [82, 79, 35],
        [35, 44, 82],
        [81, 79, 82],
        [82, 83, 81],
        [84, 63, 81],
        [81, 83, 84],
        [44, 46, 85],
        [85, 82, 44],
        [71, 78, 52],
        [52, 78, 77],
        [77, 63, 52],
        [82, 85, 83],
        [83, 85, 86],
        [86, 84, 83],
        [87, 52, 84],
        [84, 86, 87],
        [52, 63, 84],
        [88, 53, 81],
        [62, 81, 60],
        [89, 60, 81],
        [89, 81, 63],
        [56, 81, 53],
        [81, 62, 61],
        [81, 61, 88],
        [48, 87, 86],
        [86, 47, 48],
        [47, 86, 85],
        [85, 46, 47],
        [48, 30, 52],
        [52, 87, 48]
      ]
    },
    {
      "color": [95, 167, 211],
      "faces": [
        [24, 32, 33],
        [77, 78, 71]
      ]
    },
    {
      "color": [119, 222, 228],
      "faces": [
        [17, 12, 18],
        [13, 16, 11],
        [67, 68, 66],
        [65, 64, 40]
      ]
    }
  ],
  "positions": [
    [111.024597, 52.604599, 46.225899],
    [114.025002, 87.673302, 58.9818],
    [66.192001, 80.898003, 55.394299],
    [72.113297, 35.491798, 30.871401],
    [97.804497, 116.560997, 73.978798],
    [16.7623, 58.010899, 58.078201],
    [52.608898, 30.3641, 42.556099],
    [106.881401, 31.945499, 46.9133],
    [113.484596, 38.6049, 49.121498],
    [108.6633, 43.2332, 46.315399],
    [101.216599, 15.9822, 46.308201],
    [16.6605, -16.2883, 93.618698],
    [40.775002, -10.2288, 85.276398],
    [23.926901, -2.5103, 86.736504],
    [11.1691, -7.0037, 99.377602],
    [9.5692, -34.393902, 141.671997],
    [12.596, 7.1655, 88.740997],
    [61.180901, 8.8142, 76.996803],
    [39.719501, -28.927099, 88.963799],
    [13.7962, -68.575699, 132.057007],
    [15.2674, -62.32, 129.688004],
    [14.8446, -52.6096, 140.113007],
    [12.8917, -49.771599, 144.740997],
    [35.604198, -71.758003, 81.063904],
    [47.462502, -68.606102, 63.369701],
    [38.2486, -64.730202, 38.909901],
    [-12.8917, -49.771599, 144.740997],
    [-13.7962, -68.575699, 132.057007],
    [17.802099, -71.758003, 81.063904],
    [19.1243, -69.0168, 49.420101],
    [38.2486, -66.275597, 17.776199],
    [12.8928, -36.703499, 141.671997],
    [109.283997, -93.589897, 27.824301],
    [122.117996, -36.8894, 35.025002],
    [67.7668, -30.197001, 78.417801],
    [33.180698, 101.851997, 25.3186],
    [9.4063, -35.589802, 150.722],
    [-9.5692, -34.393902, 141.671997],
    [-9.4063, -35.589802, 150.722],
    [11.4565, -37.899399, 150.722],
    [-12.596, 7.1655, 88.740997],
    [-11.1691, -7.0037, 99.377602],
    [70.236504, 62.836201, -3.9475],
    [47.263401, 54.293999, -27.414801],
    [28.7302, 91.731102, -24.972601],
    [69.167603, 6.5862, -12.7757],
    [28.7302, 49.1003, -48.3596],
    [31.903, 5.692, -47.821999],
    [35.075802, -34.432899, -16.280899],
    [115.284103, 48.681499, 48.684101],
    [110.842796, 28.4821, 49.176201],
    [-19.1243, -69.0168, 49.420101],
    [-38.2486, -66.275597, 17.776199],
    [-111.024597, 52.604599, 46.225899],
    [-72.113297, 35.491798, 30.871401],
    [-66.192001, 80.898003, 55.394299],
    [-114.025002, 87.673302, 58.9818],
    [-97.804497, 116.560997, 73.978798],
    [-52.608898, 30.3641, 42.556099],
    [-16.7623, 58.010899, 58.078201],
    [-106.881401, 31.945499, 46.9133],
    [-108.6633, 43.2332, 46.315399],
    [-113.484596, 38.6049, 49.121498],
    [-101.216599, 15.9822, 46.308201],
    [-16.6605, -16.2883, 93.618698],
    [-23.926901, -2.5103, 86.736504],
    [-40.775002, -10.2288, 85.276398],
    [-61.180901, 8.8142, 76.996803],
    [-39.719501, -28.927099, 88.963799],
    [-14.8446, -52.6096, 140.113007],
    [-15.2674, -62.32, 129.688004],
    [-47.462502, -68.606102, 63.369701],
    [-35.604198, -71.758003, 81.063904],
    [-38.2486, -64.730202, 38.909901],
    [-17.802099, -71.758003, 81.063904],
    [-12.8928, -36.703499, 141.671997],
    [-67.7668, -30.197001, 78.417801],
    [-122.117996, -36.8894, 35.025002],
    [-109.283997, -93.589897, 27.824301],
    [-33.180698, 101.851997, 25.3186],
    [-11.4565, -37.899399, 150.722],
    [-70.236504, 62.836201, -3.9475],
    [-28.7302, 91.731102, -24.972601],
    [-47.263401, 54.293999, -27.414801],
    [-69.167603, 6.5862, -12.7757],
    [-28.7302, 49.1003, -48.3596],
    [-31.903, 5.692, -47.821999],
    [-35.075802, -34.432899, -16.280899],
    [-115.284103, 48.681499, 48.684101],
    [-110.842796, 28.4821, 49.176201]
  ]
}

//# sourceMappingURL=app/build-types/beta/beta-mascot.json
}, {file:"/Users/jack/projects/monsta-wallet/app/build-types/beta/beta-mascot.json",}],
[4178, {"../../store/actions":4331,"./lock.component":4177,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _actions = require("../../store/actions");

var _lock = _interopRequireDefault(require("./lock.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      isUnlocked
    }
  } = state;
  return {
    isUnlocked
  };
};

const mapDispatchToProps = dispatch => {
  return {
    lockMetamask: () => dispatch((0, _actions.lockMetamask)())
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_lock.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/lock/lock.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/lock/lock.container.js",}],
[4181, {"../../ducks/history/history":3982,"../../selectors":4326,"../../store/actions":4331,"./mobile-sync.component":4180,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../store/actions");

var _history = require("../../ducks/history/history");

var _selectors = require("../../selectors");

var _mobileSync = _interopRequireDefault(require("./mobile-sync.component"));

const mapDispatchToProps = dispatch => {
  return {
    requestRevealSeedWords: password => dispatch((0, _actions.requestRevealSeedWords)(password)),
    fetchInfoToSync: () => dispatch((0, _actions.fetchInfoToSync)()),
    displayWarning: message => dispatch((0, _actions.displayWarning)(message || null)),
    exportAccounts: (password, addresses) => dispatch((0, _actions.exportAccounts)(password, addresses)),
    hideWarning: () => dispatch((0, _actions.hideWarning)())
  };
};

const mapStateToProps = state => {
  const {
    metamask: {
      selectedAddress
    }
  } = state;
  return {
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    selectedAddress,
    keyrings: (0, _selectors.getMetaMaskKeyrings)(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_mobileSync.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/mobile-sync/mobile-sync.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/mobile-sync/mobile-sync.container.js",}],
[4073, {"../../ducks/history/history":3982,"../../store/actions":4331,"./confirm-import-token.component":4072,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../store/actions");

var _history = require("../../ducks/history/history");

var _confirmImportToken = _interopRequireDefault(require("./confirm-import-token.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      pendingTokens
    }
  } = state;
  return {
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    pendingTokens
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addTokens: tokens => dispatch((0, _actions.addTokens)(tokens)),
    clearPendingTokens: () => dispatch((0, _actions.clearPendingTokens)())
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_confirmImportToken.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-import-token/confirm-import-token.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-import-token/confirm-import-token.container.js",}],
[3998, {"./authenticated.component":3997,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _authenticated = _interopRequireDefault(require("./authenticated.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      isUnlocked,
      completedOnboarding
    }
  } = state;
  return {
    isUnlocked,
    completedOnboarding
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_authenticated.default);

exports.default = _default;

//# sourceMappingURL=ui/helpers/higher-order-components/authenticated/authenticated.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/authenticated/authenticated.container.js",}],
[4003, {"./initialized.component":4002,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _initialized = _interopRequireDefault(require("./initialized.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      completedOnboarding
    }
  } = state;
  return {
    completedOnboarding
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_initialized.default);

exports.default = _default;

//# sourceMappingURL=ui/helpers/higher-order-components/initialized/initialized.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/initialized/initialized.container.js",}],
[3690, {"../../../../shared/constants/network":3595,"../../../selectors":4326,"../../../store/actions":4331,"./loading-network-screen.component":3689,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _network = require("../../../../shared/constants/network");

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _selectors = require("../../../selectors");

var _loadingNetworkScreen = _interopRequireDefault(require("./loading-network-screen.component"));

const mapStateToProps = state => {
  const {
    loadingMessage
  } = state.appState;
  const {
    provider
  } = state.metamask;
  const {
    rpcUrl,
    chainId,
    ticker,
    nickname,
    type
  } = provider;
  const setProviderArgs = type === _network.NETWORK_TYPE_RPC ? [rpcUrl, chainId, ticker, nickname] : [provider.type];
  return {
    isNetworkLoading: (0, _selectors.isNetworkLoading)(state),
    loadingMessage,
    setProviderArgs,
    provider,
    providerId: (0, _selectors.getNetworkIdentifier)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProviderType: type => {
      dispatch(actions.setProviderType(type));
    },
    rollbackToPreviousProvider: () => dispatch(actions.rollbackToPreviousProvider()),
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown())
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_loadingNetworkScreen.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/loading-network-screen/loading-network-screen.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/loading-network-screen/loading-network-screen.container.js",}],
[3842, {"./button.component":3841,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _button = _interopRequireDefault(require("./button.component"));

var _default = _button.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/button/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/button/index.js",}],
[3868, {"./export-text-container.component":3867,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _exportTextContainer = _interopRequireDefault(require("./export-text-container.component"));

var _default = _exportTextContainer.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/export-text-container/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/export-text-container/index.js",}],
[3907, {"../spinner":3943,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _spinner = _interopRequireDefault(require("../spinner"));

class LoadingScreen extends _react.Component {
  renderMessage() {
    const {
      loadingMessage
    } = this.props;

    if (!loadingMessage) {
      return null;
    }

    return /*#__PURE__*/(0, _react.isValidElement)(loadingMessage) ? loadingMessage : /*#__PURE__*/_react.default.createElement("span", null, loadingMessage);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "loading-overlay"
    }, this.props.header, /*#__PURE__*/_react.default.createElement("div", {
      className: "loading-overlay__container"
    }, this.props.showLoadingSpinner && /*#__PURE__*/_react.default.createElement(_spinner.default, {
      color: "#F7C06C",
      className: "loading-overlay__spinner"
    }), this.renderMessage()));
  }

}

(0, _defineProperty2.default)(LoadingScreen, "defaultProps", {
  loadingMessage: null,
  showLoadingSpinner: true
});
(0, _defineProperty2.default)(LoadingScreen, "propTypes", {
  loadingMessage: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.element]),
  showLoadingSpinner: _propTypes.default.bool,
  header: _propTypes.default.element
});
var _default = LoadingScreen;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/loading-screen/loading-screen.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/loading-screen/loading-screen.component.js",}],
[3624, {"../../../selectors":4326,"../../../store/actions":4331,"./app-header.component":3623,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _redux = require("redux");

var _selectors = require("../../../selectors");

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _appHeader = _interopRequireDefault(require("./app-header.component"));

const mapStateToProps = state => {
  const {
    appState,
    metamask
  } = state;
  const {
    networkDropdownOpen
  } = appState;
  const {
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen
  } = metamask;
  const accounts = (0, _selectors.getMetaMaskAccountsOrdered)(state);
  const selectedAddressIndex = accounts.findIndex(account => account.address === selectedAddress);
  return {
    networkDropdownOpen,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
    selectedAddressIndex
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown()),
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu())
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_appHeader.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/app-header/app-header.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/app-header/app-header.container.js",}],
[4110, {"../../helpers/constants/routes":3995,"./connect-hardware":4108,"./import-account":4111,"./new-account.container":4116,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _routes = require("../../helpers/constants/routes");

var _newAccount = _interopRequireDefault(require("./new-account.container"));

var _importAccount = _interopRequireDefault(require("./import-account"));

var _connectHardware = _interopRequireDefault(require("./connect-hardware"));

class CreateAccountPage extends _react.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account__form"
    }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.NEW_ACCOUNT_ROUTE,
      component: _newAccount.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.IMPORT_ACCOUNT_ROUTE,
      component: _importAccount.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.CONNECT_HARDWARE_ROUTE,
      component: _connectHardware.default
    }))));
  }

}

exports.default = CreateAccountPage;

//# sourceMappingURL=ui/pages/create-account/create-account.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/create-account.component.js",}],
[4096, {"../../components/app/metamask-template-renderer":3695,"../../components/app/network-display/network-display":3761,"../../components/ui/box":3838,"../../components/ui/callout":3844,"../../components/ui/chip":3848,"../../components/ui/site-icon":3939,"../../helpers/constants/design-system":3992,"../../helpers/constants/routes":3995,"../../helpers/utils/util":4020,"../../hooks/useI18nContext":4030,"../../hooks/useOriginMetadata":4033,"../../selectors":4326,"./components/confirmation-footer":4095,"./templates":4099,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"immer":1945,"lodash":2646,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ConfirmationPage;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _lodash = require("lodash");

var _immer = require("immer");

var _box = _interopRequireDefault(require("../../components/ui/box"));

var _chip = _interopRequireDefault(require("../../components/ui/chip"));

var _metamaskTemplateRenderer = _interopRequireDefault(require("../../components/app/metamask-template-renderer"));

var _siteIcon = _interopRequireDefault(require("../../components/ui/site-icon"));

var _routes = require("../../helpers/constants/routes");

var _util = require("../../helpers/utils/util");

var _useI18nContext = require("../../hooks/useI18nContext");

var _useOriginMetadata = require("../../hooks/useOriginMetadata");

var _selectors = require("../../selectors");

var _networkDisplay = _interopRequireDefault(require("../../components/app/network-display/network-display"));

var _designSystem = require("../../helpers/constants/design-system");

var _callout = _interopRequireDefault(require("../../components/ui/callout"));

var _confirmationFooter = _interopRequireDefault(require("./components/confirmation-footer"));

var _templates = require("./templates");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * a very simple reducer using produce from Immer to keep state manipulation
 * immutable and painless. This state is not stored in redux state because it
 * should persist only for the lifespan of the current session, and will only
 * be used on this page. Dismissing alerts for confirmations should persist
 * while the user pages back and forth between confirmations. However, if the
 * user closes the confirmation window and later reopens the extension they
 * should be displayed the alerts again.
 */
const alertStateReducer = (0, _immer.produce)((state, action) => {
  var _state$action$confirm;

  switch (action.type) {
    case 'dismiss':
      if (state !== null && state !== void 0 && (_state$action$confirm = state[action.confirmationId]) !== null && _state$action$confirm !== void 0 && _state$action$confirm[action.alertId]) {
        state[action.confirmationId][action.alertId].dismissed = true;
      }

      break;

    case 'set':
      if (!state[action.confirmationId]) {
        state[action.confirmationId] = {};
      }

      action.alerts.forEach(alert => {
        state[action.confirmationId][alert.id] = _objectSpread(_objectSpread({}, alert), {}, {
          dismissed: false
        });
      });
      break;

    default:
      throw new Error('You must provide a type when dispatching an action for alertState');
  }
});
/**
 * Encapsulates the state and effects needed to manage alert state for the
 * confirmation page in a custom hook. This hook is not likely to be used
 * outside of this file, but it helps to reduce complexity of the primary
 * component.
 * @param {Object} pendingConfirmation - a pending confirmation waiting for
 *  user approval
 * @returns {[alertState: Object, dismissAlert: Function]} - tuple with
 *  the current alert state and function to dismiss an alert by id
 */

function useAlertState(pendingConfirmation) {
  const [alertState, dispatch] = (0, _react.useReducer)(alertStateReducer, {});
  /**
   * Computation of the current alert state happens every time the current
   * pendingConfirmation changes. The async function getTemplateAlerts is
   * responsible for returning alert state. Setting state on unmounted
   * components is an anti-pattern, so we use a isMounted variable to keep
   * track of the current state of the component. Returning a function that
   * sets isMounted to false when the component is unmounted.
   */

  (0, _react.useEffect)(() => {
    let isMounted = true;

    if (pendingConfirmation) {
      (0, _templates.getTemplateAlerts)(pendingConfirmation).then(alerts => {
        if (isMounted && alerts) {
          dispatch({
            type: 'set',
            confirmationId: pendingConfirmation.id,
            alerts
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [pendingConfirmation]);
  const dismissAlert = (0, _react.useCallback)(alertId => {
    dispatch({
      type: 'dismiss',
      confirmationId: pendingConfirmation.id,
      alertId
    });
  }, [pendingConfirmation]);
  return [alertState, dismissAlert];
}

function ConfirmationPage() {
  const t = (0, _useI18nContext.useI18nContext)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const history = (0, _reactRouterDom.useHistory)();
  const pendingConfirmations = (0, _reactRedux.useSelector)(_selectors.getUnapprovedTemplatedConfirmations, _lodash.isEqual);
  const [currentPendingConfirmation, setCurrentPendingConfirmation] = (0, _react.useState)(0);
  const pendingConfirmation = pendingConfirmations[currentPendingConfirmation];
  const originMetadata = (0, _useOriginMetadata.useOriginMetadata)(pendingConfirmation === null || pendingConfirmation === void 0 ? void 0 : pendingConfirmation.origin);
  const [alertState, dismissAlert] = useAlertState(pendingConfirmation); // Generating templatedValues is potentially expensive, and if done on every render
  // will result in a new object. Avoiding calling this generation unnecessarily will
  // improve performance and prevent unnecessary draws.

  const templatedValues = (0, _react.useMemo)(() => {
    return pendingConfirmation ? (0, _templates.getTemplateValues)(pendingConfirmation, t, dispatch) : {};
  }, [pendingConfirmation, t, dispatch]);
  (0, _react.useEffect)(() => {
    // If the number of pending confirmations reduces to zero when the user
    // return them to the default route. Otherwise, if the number of pending
    // confirmations reduces to a number that is less than the currently
    // viewed index, reset the index.
    if (pendingConfirmations.length === 0) {
      history.push(_routes.DEFAULT_ROUTE);
    } else if (pendingConfirmations.length <= currentPendingConfirmation) {
      setCurrentPendingConfirmation(pendingConfirmations.length - 1);
    }
  }, [pendingConfirmations, history, currentPendingConfirmation]);

  if (!pendingConfirmation) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "confirmation-page"
  }, pendingConfirmations.length > 1 && /*#__PURE__*/_react.default.createElement("div", {
    className: "confirmation-page__navigation"
  }, /*#__PURE__*/_react.default.createElement("p", null, t('xOfYPending', [currentPendingConfirmation + 1, pendingConfirmations.length])), currentPendingConfirmation > 0 && /*#__PURE__*/_react.default.createElement("button", {
    className: "confirmation-page__navigation-button",
    onClick: () => setCurrentPendingConfirmation(currentPendingConfirmation - 1)
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fas fa-chevron-left"
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "confirmation-page__navigation-button",
    disabled: currentPendingConfirmation + 1 === pendingConfirmations.length,
    onClick: () => setCurrentPendingConfirmation(currentPendingConfirmation + 1)
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fas fa-chevron-right"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "confirmation-page__content"
  }, /*#__PURE__*/_react.default.createElement(_box.default, {
    justifyContent: "center"
  }, /*#__PURE__*/_react.default.createElement(_networkDisplay.default, {
    colored: false,
    indicatorSize: _designSystem.SIZES.XS,
    labelProps: {
      color: _designSystem.COLORS.BLACK
    }
  })), /*#__PURE__*/_react.default.createElement(_box.default, {
    justifyContent: "center",
    padding: [1, 4, 4]
  }, /*#__PURE__*/_react.default.createElement(_chip.default, {
    label: (0, _util.stripHttpsScheme)(originMetadata.origin),
    leftIcon: /*#__PURE__*/_react.default.createElement(_siteIcon.default, {
      icon: originMetadata.icon,
      name: originMetadata.hostname,
      size: 32
    })
  })), /*#__PURE__*/_react.default.createElement(_metamaskTemplateRenderer.default, {
    sections: templatedValues.content
  })), /*#__PURE__*/_react.default.createElement(_confirmationFooter.default, {
    alerts: alertState[pendingConfirmation.id] && Object.values(alertState[pendingConfirmation.id]).filter(alert => alert.dismissed === false).map((alert, idx, filtered) => /*#__PURE__*/_react.default.createElement(_callout.default, {
      key: alert.id,
      severity: alert.severity,
      dismiss: () => dismissAlert(alert.id),
      isFirst: idx === 0,
      isLast: idx === filtered.length - 1,
      isMultiple: filtered.length > 1
    }, /*#__PURE__*/_react.default.createElement(_metamaskTemplateRenderer.default, {
      sections: alert.content
    }))),
    onApprove: templatedValues.onApprove,
    onCancel: templatedValues.onCancel,
    approveText: templatedValues.approvalText,
    cancelText: templatedValues.cancelText
  }));
}

//# sourceMappingURL=ui/pages/confirmation/confirmation.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirmation/confirmation.js",}],
[4048, {"../../ducks/metamask/metamask":3985,"../../helpers/constants/routes":3995,"../../helpers/utils/util":4020,"./components/native-asset":4052,"./components/token-asset":4053,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _metamask = require("../../ducks/metamask/metamask");

var _routes = require("../../helpers/constants/routes");

var _util = require("../../helpers/utils/util");

var _nativeAsset = _interopRequireDefault(require("./components/native-asset"));

var _tokenAsset = _interopRequireDefault(require("./components/token-asset"));

const Asset = () => {
  const nativeCurrency = (0, _reactRedux.useSelector)(state => state.metamask.nativeCurrency);
  const tokens = (0, _reactRedux.useSelector)(_metamask.getTokens);
  const {
    asset
  } = (0, _reactRouterDom.useParams)();
  const token = tokens.find(({
    address
  }) => (0, _util.isEqualCaseInsensitive)(address, asset));
  (0, _react.useEffect)(() => {
    const el = document.querySelector('.app');
    el.scroll(0, 0);
  }, []);
  let content;

  if (token) {
    content = /*#__PURE__*/_react.default.createElement(_tokenAsset.default, {
      token: token
    });
  } else if (asset === nativeCurrency) {
    content = /*#__PURE__*/_react.default.createElement(_nativeAsset.default, {
      nativeCurrency: nativeCurrency
    });
  } else {
    content = /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
      to: {
        pathname: _routes.DEFAULT_ROUTE
      }
    });
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "main-container asset__container"
  }, content);
};

var _default = Asset;
exports.default = _default;

//# sourceMappingURL=ui/pages/asset/asset.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/asset/asset.js",}],
[4186, {"../../ducks/metamask/metamask":3985,"../../helpers/constants/routes":3995,"../../helpers/utils/util":4020,"../../selectors":4326,"../../store/actions":4331,"./permissions-connect.component":4185,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _selectors = require("../../selectors");

var _metamask = require("../../ducks/metamask/metamask");

var _util = require("../../helpers/utils/util");

var _actions = require("../../store/actions");

var _routes = require("../../helpers/constants/routes");

var _permissionsConnect = _interopRequireDefault(require("./permissions-connect.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const mapStateToProps = (state, ownProps) => {
  var _lastConnectedInfo$or;

  const {
    match: {
      params: {
        id: permissionsRequestId
      }
    },
    location: {
      pathname
    }
  } = ownProps;
  const permissionsRequests = (0, _selectors.getPermissionsRequests)(state);
  const currentAddress = (0, _selectors.getSelectedAddress)(state);
  const permissionsRequest = permissionsRequests.find(req => req.metadata.id === permissionsRequestId);
  const {
    metadata = {}
  } = permissionsRequest || {};
  const {
    origin
  } = metadata;
  const nativeCurrency = (0, _metamask.getNativeCurrency)(state);
  const domainMetadata = (0, _selectors.getDomainMetadata)(state);
  let targetDomainMetadata = null;

  if (origin) {
    if (domainMetadata[origin]) {
      targetDomainMetadata = _objectSpread(_objectSpread({}, domainMetadata[origin]), {}, {
        origin
      });
    } else {
      const targetUrl = new URL(origin);
      targetDomainMetadata = {
        host: targetUrl.host,
        name: targetUrl.hostname,
        origin
      };
    }
  }

  const accountsWithLabels = (0, _selectors.getAccountsWithLabels)(state);
  const lastConnectedInfo = (0, _selectors.getLastConnectedInfo)(state) || {};
  const addressLastConnectedMap = ((_lastConnectedInfo$or = lastConnectedInfo[origin]) === null || _lastConnectedInfo$or === void 0 ? void 0 : _lastConnectedInfo$or.accounts) || {};
  Object.keys(addressLastConnectedMap).forEach(key => {
    addressLastConnectedMap[key] = (0, _util.formatDate)(addressLastConnectedMap[key], 'yyyy-MM-dd');
  });
  const connectPath = `${_routes.CONNECT_ROUTE}/${permissionsRequestId}`;
  const confirmPermissionPath = `${_routes.CONNECT_ROUTE}/${permissionsRequestId}${_routes.CONNECT_CONFIRM_PERMISSIONS_ROUTE}`;
  let page = '';

  if (pathname === connectPath) {
    page = '1';
  } else if (pathname === confirmPermissionPath) {
    page = '2';
  } else {
    throw new Error('Incorrect path for permissions-connect component');
  }

  return {
    permissionsRequest,
    permissionsRequestId,
    accounts: accountsWithLabels,
    currentAddress,
    origin,
    newAccountNumber: accountsWithLabels.length + 1,
    nativeCurrency,
    addressLastConnectedMap,
    lastConnectedInfo,
    connectPath,
    confirmPermissionPath,
    page,
    targetDomainMetadata
  };
};

const mapDispatchToProps = dispatch => {
  return {
    approvePermissionsRequest: (request, accounts) => dispatch((0, _actions.approvePermissionsRequest)(request, accounts)),
    rejectPermissionsRequest: requestId => dispatch((0, _actions.rejectPermissionsRequest)(requestId)),
    showNewAccountModal: ({
      onCreateNewAccount,
      newAccountNumber
    }) => {
      return dispatch((0, _actions.showModal)({
        name: 'NEW_ACCOUNT',
        onCreateNewAccount,
        newAccountNumber
      }));
    },
    getRequestAccountTabIds: () => dispatch((0, _actions.getRequestAccountTabIds)()),
    getCurrentWindowTab: () => dispatch((0, _actions.getCurrentWindowTab)())
  };
};

const PermissionApprovalContainer = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_permissionsConnect.default);
PermissionApprovalContainer.propTypes = {
  history: _propTypes.default.object.isRequired,
  match: _propTypes.default.shape({
    params: _propTypes.default.shape({
      id: _propTypes.default.string
    }).isRequired
  }).isRequired
};
var _default = PermissionApprovalContainer;
exports.default = _default;

//# sourceMappingURL=ui/pages/permissions-connect/permissions-connect.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/permissions-connect/permissions-connect.container.js",}],
[3850, {"./color-indicator":3849,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _colorIndicator.default;
  }
});

var _colorIndicator = _interopRequireDefault(require("./color-indicator"));

//# sourceMappingURL=ui/components/ui/color-indicator/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/color-indicator/index.js",}],
[3662, {"../menu-droppo":3694,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownMenuItem = exports.Dropdown = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _menuDroppo = _interopRequireDefault(require("../menu-droppo"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class Dropdown extends _react.Component {
  render() {
    const {
      containerClassName,
      isOpen,
      onClickOutside,
      style,
      innerStyle,
      children,
      useCssTransition
    } = this.props;

    const innerStyleDefaults = _objectSpread({
      borderRadius: '4px',
      padding: '8px 16px',
      background: 'rgba(0, 0, 0, 0.8)',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px'
    }, innerStyle);

    return /*#__PURE__*/_react.default.createElement(_menuDroppo.default, {
      containerClassName: containerClassName,
      useCssTransition: useCssTransition,
      isOpen: isOpen,
      zIndex: 55,
      onClickOutside: onClickOutside,
      style: style,
      innerStyle: innerStyleDefaults
    }, /*#__PURE__*/_react.default.createElement("style", null, `
            li.dropdown-menu-item:hover {
              color:rgb(225, 225, 225);
              background-color: rgba(255, 255, 255, 0.05);
              border-radius: 4px;
            }
            li.dropdown-menu-item { color: rgb(185, 185, 185); }
          `), children);
  }

}

exports.Dropdown = Dropdown;
Dropdown.defaultProps = {
  useCssTransition: false
};
Dropdown.propTypes = {
  isOpen: _propTypes.default.bool.optional,
  children: _propTypes.default.node,
  style: _propTypes.default.object.isRequired,
  onClickOutside: _propTypes.default.func,
  innerStyle: _propTypes.default.object,
  useCssTransition: _propTypes.default.bool,
  containerClassName: _propTypes.default.string
};

class DropdownMenuItem extends _react.Component {
  render() {
    const {
      onClick,
      closeMenu,
      children,
      style
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("li", {
      className: "dropdown-menu-item",
      onClick: () => {
        onClick();
        closeMenu();
      },
      onKeyPress: event => {
        if (event.key === 'Enter') {
          onClick();
          closeMenu();
        }
      },
      style: _objectSpread({
        listStyle: 'none',
        padding: '8px 0px',
        fontSize: '18px',
        fontStyle: 'normal',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: 'white'
      }, style),
      tabIndex: "0"
    }, children);
  }

}

exports.DropdownMenuItem = DropdownMenuItem;
DropdownMenuItem.propTypes = {
  closeMenu: _propTypes.default.func.isRequired,
  onClick: _propTypes.default.func.isRequired,
  children: _propTypes.default.node,
  style: _propTypes.default.object
};

//# sourceMappingURL=ui/components/app/dropdowns/dropdown.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/dropdowns/dropdown.js",}],
[4164, {"../../ducks/history/history":3982,"../../selectors/selectors":4328,"../../store/actions":4331,"./import-token.component":4163,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../store/actions");

var _history = require("../../ducks/history/history");

var _selectors = require("../../selectors/selectors");

var _importToken = _interopRequireDefault(require("./import-token.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      identities,
      tokens,
      pendingTokens,
      provider: {
        chainId
      },
      useTokenDetection,
      tokenList
    }
  } = state;
  const showSearchTabCustomNetwork = useTokenDetection && Boolean(Object.keys(tokenList).length);
  const showSearchTab = (0, _selectors.getIsMainnet)(state) || showSearchTabCustomNetwork || false === 'true';
  return {
    identities,
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    tokens,
    pendingTokens,
    showSearchTab,
    chainId,
    rpcPrefs: (0, _selectors.getRpcPrefsForCurrentProvider)(state),
    tokenList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPendingTokens: tokens => dispatch((0, _actions.setPendingTokens)(tokens)),
    clearPendingTokens: () => dispatch((0, _actions.clearPendingTokens)())
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_importToken.default);

exports.default = _default;


//# sourceMappingURL=ui/pages/import-token/import-token.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/import-token/import-token.container.js",}],
[3617, {"../../../ducks/alerts/invalid-custom-network":3975,"../../../ducks/alerts/unconnected-account":3976,"./invalid-custom-network-alert":3619,"./unconnected-account-alert":3621,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _unconnectedAccount = require("../../../ducks/alerts/unconnected-account");

var _invalidCustomNetwork = require("../../../ducks/alerts/invalid-custom-network");

var _invalidCustomNetworkAlert = _interopRequireDefault(require("./invalid-custom-network-alert"));

var _unconnectedAccountAlert = _interopRequireDefault(require("./unconnected-account-alert"));

const Alerts = ({
  history
}) => {
  const _invalidCustomNetworkAlertIsOpen = (0, _reactRedux.useSelector)(_invalidCustomNetwork.alertIsOpen);

  const _unconnectedAccountAlertIsOpen = (0, _reactRedux.useSelector)(_unconnectedAccount.alertIsOpen);

  if (_invalidCustomNetworkAlertIsOpen) {
    return /*#__PURE__*/_react.default.createElement(_invalidCustomNetworkAlert.default, {
      history: history
    });
  }

  if (_unconnectedAccountAlertIsOpen) {
    return /*#__PURE__*/_react.default.createElement(_unconnectedAccountAlert.default, null);
  }

  return null;
};

Alerts.propTypes = {
  history: _propTypes.default.object.isRequired
};
var _default = Alerts;
exports.default = _default;

//# sourceMappingURL=ui/components/app/alerts/alerts.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/alerts/alerts.js",}],
[4265, {"../../../app/scripts/lib/util":78,"../../../shared/constants/app":3591,"../../../shared/modules/hexstring-utils":3604,"../../ducks/history/history":3982,"../../helpers/constants/routes":3995,"../../selectors":4326,"./settings.component":4264,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _selectors = require("../../selectors");

var _app = require("../../../shared/constants/app");

var _util = require("../../../app/scripts/lib/util");

var _history = require("../../ducks/history/history");

var _hexstringUtils = require("../../../shared/modules/hexstring-utils");

var _routes = require("../../helpers/constants/routes");

var _settings = _interopRequireDefault(require("./settings.component"));

const ROUTES_TO_I18N_KEYS = {
  [_routes.ABOUT_US_ROUTE]: 'about',
  [_routes.ADVANCED_ROUTE]: 'advanced',
  [_routes.ALERTS_ROUTE]: 'alerts',
  [_routes.GENERAL_ROUTE]: 'general',
  [_routes.CONTACT_ADD_ROUTE]: 'newContact',
  [_routes.CONTACT_EDIT_ROUTE]: 'editContact',
  [_routes.CONTACT_LIST_ROUTE]: 'contacts',
  [_routes.CONTACT_VIEW_ROUTE]: 'viewContact',
  [_routes.NETWORKS_ROUTE]: 'networks',
  [_routes.NETWORKS_FORM_ROUTE]: 'networks',
  [_routes.SECURITY_ROUTE]: 'securityAndPrivacy',
  [_routes.EXPERIMENTAL_ROUTE]: 'experimental'
};

const mapStateToProps = (state, ownProps) => {
  const {
    location
  } = ownProps;
  const {
    pathname
  } = location;
  const pathNameTail = pathname.match(/[^/]+$/u)[0];
  const isAddressEntryPage = pathNameTail.includes('0x');
  const isAddContactPage = Boolean(pathname.match(_routes.CONTACT_ADD_ROUTE));
  const isEditContactPage = Boolean(pathname.match(_routes.CONTACT_EDIT_ROUTE));
  const isNetworksFormPage = Boolean(pathname.match(_routes.NETWORKS_FORM_ROUTE));

  const isPopup = (0, _util.getEnvironmentType)() === _app.ENVIRONMENT_TYPE_POPUP;

  const pathnameI18nKey = ROUTES_TO_I18N_KEYS[pathname];
  let backRoute = _routes.SETTINGS_ROUTE;

  if (isEditContactPage) {
    backRoute = `${_routes.CONTACT_VIEW_ROUTE}/${pathNameTail}`;
  } else if (isAddressEntryPage || isAddContactPage) {
    backRoute = _routes.CONTACT_LIST_ROUTE;
  } else if (isNetworksFormPage) {
    backRoute = _routes.NETWORKS_ROUTE;
  }

  let initialBreadCrumbRoute;
  let initialBreadCrumbKey;
  const addressName = (0, _selectors.getAddressBookEntryName)(state, !(0, _hexstringUtils.isBurnAddress)(pathNameTail) && (0, _hexstringUtils.isValidHexAddress)(pathNameTail, {
    mixedCaseUseChecksum: true
  }) ? pathNameTail : '');
  return {
    isAddressEntryPage,
    backRoute,
    currentPath: pathname,
    isPopup,
    pathnameI18nKey,
    addressName,
    initialBreadCrumbRoute,
    initialBreadCrumbKey,
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state)
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps))(_settings.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/settings/settings.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/settings.container.js",}],
[4028, {"../ducks/metamask/metamask":3985,"./useSafeGasEstimatePolling":4035,"react-redux":3088}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGasFeeEstimates = useGasFeeEstimates;

var _reactRedux = require("react-redux");

var _metamask = require("../ducks/metamask/metamask");

var _useSafeGasEstimatePolling = require("./useSafeGasEstimatePolling");

/**
 * @typedef {object} GasEstimates
 * @property {GasEstimateTypes} gasEstimateType - The type of estimate provided
 * @property {import(
 *   '@metamask/controllers'
 * ).GasFeeState['gasFeeEstimates']} gasFeeEstimates - The estimate object
 * @property {import(
 *   '@metamask/controllers'
 * ).GasFeeState['estimatedGasFeeTimeBounds']} [estimatedGasFeeTimeBounds] -
 *  estimated time boundaries for fee-market type estimates
 * @property {boolean} isGasEstimateLoading - indicates whether the gas
 *  estimates are currently loading.
 */

/**
 * Gets the current gasFeeEstimates from state and begins polling for new
 * estimates. When this hook is removed from the tree it will signal to the
 * GasFeeController that it is done requiring new gas estimates. Also checks
 * the returned gas estimate for validity on the current network.
 *
 * @returns {GasFeeEstimates} - GasFeeEstimates object
 */
function useGasFeeEstimates() {
  const gasEstimateType = (0, _reactRedux.useSelector)(_metamask.getGasEstimateType);
  const gasFeeEstimates = (0, _reactRedux.useSelector)(_metamask.getGasFeeEstimates);
  const estimatedGasFeeTimeBounds = (0, _reactRedux.useSelector)(_metamask.getEstimatedGasFeeTimeBounds);
  const isGasEstimatesLoading = (0, _reactRedux.useSelector)(_metamask.getIsGasEstimatesLoading);
  (0, _useSafeGasEstimatePolling.useSafeGasEstimatePolling)();
  return {
    gasFeeEstimates,
    gasEstimateType,
    estimatedGasFeeTimeBounds,
    isGasEstimatesLoading
  };
}

//# sourceMappingURL=ui/hooks/useGasFeeEstimates.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useGasFeeEstimates.js",}],
[4032, {"../contexts/metametrics":3971,"../contexts/metametrics.new":3972,"./useEqualityCheck":4026,"react":3121}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMetricEvent = useMetricEvent;
exports.useNewMetricEvent = useNewMetricEvent;

var _react = require("react");

var _metametrics = require("../contexts/metametrics");

var _metametrics2 = require("../contexts/metametrics.new");

var _useEqualityCheck = require("./useEqualityCheck");

// Type imports

/**
 * @typedef {import('../contexts/metametrics.new').UIMetricsEventPayload} UIMetricsEventPayload
 * @typedef {import('../../shared/constants/metametrics').MetaMetricsEventOptions} MetaMetricsEventOptions
 */
function useMetricEvent(config = {}, overrides = {}) {
  const metricsEvent = (0, _react.useContext)(_metametrics.MetaMetricsContext);
  const trackEvent = (0, _react.useCallback)(() => metricsEvent(config, overrides), [config, metricsEvent, overrides]);
  return trackEvent;
}
/**
 * track a metametrics event using segment
 * e.g metricsEvent({ event: 'Unlocked MetaMask', category: 'Navigation' })
 *
 * @param {UIMetricsEventPayload}  payload - payload of the event to track
 * @param {MetaMetricsEventOptions} options - options for handling/routing event
 * @return {() => Promise<void>} function to execute the tracking event
 */


function useNewMetricEvent(payload, options) {
  const memoizedPayload = (0, _useEqualityCheck.useEqualityCheck)(payload);
  const memoizedOptions = (0, _useEqualityCheck.useEqualityCheck)(options);
  const metricsEvent = (0, _react.useContext)(_metametrics2.MetaMetricsContext);
  return (0, _react.useCallback)(() => metricsEvent(memoizedPayload, memoizedOptions), [metricsEvent, memoizedPayload, memoizedOptions]);
}

//# sourceMappingURL=ui/hooks/useMetricEvent.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useMetricEvent.js",}],
[4000, {"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FeatureToggledRoute;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

function FeatureToggledRoute(_ref) {
  let {
    flag,
    redirectRoute
  } = _ref,
      props = (0, _objectWithoutProperties2.default)(_ref, ["flag", "redirectRoute"]);

  if (flag) {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, props);
  }

  return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
    to: {
      pathname: redirectRoute
    }
  });
}

FeatureToggledRoute.propTypes = {
  flag: _propTypes.default.bool.isRequired,
  redirectRoute: _propTypes.default.string.isRequired
};

//# sourceMappingURL=ui/helpers/higher-order-components/feature-toggled-route.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/feature-toggled-route.js",}],
[4267, {"./awaiting-signatures":4266,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _awaitingSignatures.default;
  }
});

var _awaitingSignatures = _interopRequireDefault(require("./awaiting-signatures"));

//# sourceMappingURL=ui/pages/swaps/awaiting-signatures/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-signatures/index.js",}],
[4292, {"./loading-swaps-quotes":4293,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _loadingSwapsQuotes.default;
  }
});

var _loadingSwapsQuotes = _interopRequireDefault(require("./loading-swaps-quotes"));

//# sourceMappingURL=ui/pages/swaps/loading-swaps-quotes/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/loading-swaps-quotes/index.js",}],
[4270, {"./awaiting-swap":4269,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _awaitingSwap.default;
  }
});

var _awaitingSwap = _interopRequireDefault(require("./awaiting-swap"));

//# sourceMappingURL=ui/pages/swaps/awaiting-swap/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-swap/index.js",}],
[4317, {"./view-quote":4319,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _viewQuote.default;
  }
});

var _viewQuote = _interopRequireDefault(require("./view-quote"));

//# sourceMappingURL=ui/pages/swaps/view-quote/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/view-quote/index.js",}],
[4277, {"./build-quote":4276,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _buildQuote.default;
  }
});

var _buildQuote = _interopRequireDefault(require("./build-quote"));

//# sourceMappingURL=ui/pages/swaps/build-quote/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/build-quote/index.js",}],
[3745, {"../../../../app/scripts/lib/util":78,"../../../../shared/constants/app":3591,"../../../ducks/gas/gas.duck":3981,"../../../helpers/utils/is-mobile-view":4014,"../../../pages/swaps/swaps-gas-customization-modal":4313,"../../../store/actions":4331,"../gas-customization/gas-modal-page-container":3679,"./account-details-modal":3706,"./add-to-addressbook-modal":3712,"./cancel-transaction":3717,"./confirm-delete-network":3720,"./confirm-remove-account":3723,"./confirm-reset-account":3726,"./customize-nonce":3728,"./deposit-ether-modal":3731,"./edit-approval-permission":3734,"./export-private-key-modal":3737,"./fade-modal":3738,"./hide-token-confirmation-modal":3740,"./metametrics-opt-in-modal":3742,"./new-account-modal":3746,"./qr-scanner":3749,"./reject-transactions":3752,"./transaction-confirmed":3755,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _gas = require("../../../ducks/gas/gas.duck");

var _isMobileView = _interopRequireDefault(require("../../../helpers/utils/is-mobile-view"));

var _util = require("../../../../app/scripts/lib/util");

var _app = require("../../../../shared/constants/app");

var _gasModalPageContainer = _interopRequireDefault(require("../gas-customization/gas-modal-page-container"));

var _swapsGasCustomizationModal = _interopRequireDefault(require("../../../pages/swaps/swaps-gas-customization-modal"));

var _depositEtherModal = _interopRequireDefault(require("./deposit-ether-modal"));

var _accountDetailsModal = _interopRequireDefault(require("./account-details-modal"));

var _exportPrivateKeyModal = _interopRequireDefault(require("./export-private-key-modal"));

var _hideTokenConfirmationModal = _interopRequireDefault(require("./hide-token-confirmation-modal"));

var _qrScanner = _interopRequireDefault(require("./qr-scanner"));

var _confirmRemoveAccount = _interopRequireDefault(require("./confirm-remove-account"));

var _confirmResetAccount = _interopRequireDefault(require("./confirm-reset-account"));

var _transactionConfirmed = _interopRequireDefault(require("./transaction-confirmed"));

var _cancelTransaction = _interopRequireDefault(require("./cancel-transaction"));

var _fadeModal = _interopRequireDefault(require("./fade-modal"));

var _metametricsOptInModal = _interopRequireDefault(require("./metametrics-opt-in-modal"));

var _rejectTransactions = _interopRequireDefault(require("./reject-transactions"));

var _confirmDeleteNetwork = _interopRequireDefault(require("./confirm-delete-network"));

var _addToAddressbookModal = _interopRequireDefault(require("./add-to-addressbook-modal"));

var _editApprovalPermission = _interopRequireDefault(require("./edit-approval-permission"));

var _newAccountModal = _interopRequireDefault(require("./new-account-modal"));

var _customizeNonce = _interopRequireDefault(require("./customize-nonce"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const modalContainerBaseStyle = {
  transform: 'translate3d(-50%, 0, 0px)',
  border: '1px solid #CCCFD1',
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 2px 22px 0 rgba(0,0,0,0.2)'
};

const modalContainerLaptopStyle = _objectSpread(_objectSpread({}, modalContainerBaseStyle), {}, {
  width: '344px',
  top: '15%'
});

const modalContainerMobileStyle = _objectSpread(_objectSpread({}, modalContainerBaseStyle), {}, {
  width: '309px',
  top: '12.5%'
});

const accountModalStyle = {
  mobileModalStyle: {
    width: '95%',
    // top: isPopupOrNotification() === 'popup' ? '52vh' : '36.5vh',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
    borderRadius: '4px',
    top: '10%',
    transform: 'none',
    left: '0',
    right: '0',
    margin: '0 auto'
  },
  laptopModalStyle: {
    width: '360px',
    // top: 'calc(33% + 45px)',
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
    borderRadius: '4px',
    top: '10%',
    transform: 'none',
    left: '0',
    right: '0',
    margin: '0 auto'
  },
  contentStyle: {
    borderRadius: '4px'
  }
};
const MODALS = {
  DEPOSIT_ETHER: {
    contents: /*#__PURE__*/_react.default.createElement(_depositEtherModal.default, null),
    onHide: props => props.hideWarning(),
    mobileModalStyle: {
      width: '100%',
      height: '100%',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      boxShadow: '0 0 7px 0 rgba(0,0,0,0.08)',
      top: '0',
      display: 'flex'
    },
    laptopModalStyle: {
      width: 'initial',
      maxWidth: '850px',
      top: 'calc(10% + 10px)',
      left: '0',
      right: '0',
      margin: '0 auto',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.3)',
      borderRadius: '7px',
      transform: 'none',
      height: 'calc(80% - 20px)',
      overflowY: 'hidden'
    },
    contentStyle: {
      borderRadius: '7px',
      height: '100%'
    }
  },
  ADD_TO_ADDRESSBOOK: {
    contents: /*#__PURE__*/_react.default.createElement(_addToAddressbookModal.default, null),
    mobileModalStyle: {
      width: '95%',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px'
    },
    laptopModalStyle: {
      width: '375px',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px'
    },
    contentStyle: {
      borderRadius: '10px'
    }
  },
  NEW_ACCOUNT: {
    contents: /*#__PURE__*/_react.default.createElement(_newAccountModal.default, null),
    mobileModalStyle: {
      width: '95%',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px'
    },
    laptopModalStyle: {
      width: '375px',
      top: '10%',
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 2px 2px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto',
      borderRadius: '10px'
    },
    contentStyle: {
      borderRadius: '10px'
    }
  },
  ACCOUNT_DETAILS: _objectSpread({
    contents: /*#__PURE__*/_react.default.createElement(_accountDetailsModal.default, null)
  }, accountModalStyle),
  EXPORT_PRIVATE_KEY: _objectSpread({
    contents: /*#__PURE__*/_react.default.createElement(_exportPrivateKeyModal.default, null)
  }, accountModalStyle),
  HIDE_TOKEN_CONFIRMATION: {
    contents: /*#__PURE__*/_react.default.createElement(_hideTokenConfirmationModal.default, null),
    mobileModalStyle: {
      width: '95%',
      top: (0, _util.getEnvironmentType)() === _app.ENVIRONMENT_TYPE_POPUP ? '52vh' : '36.5vh'
    },
    laptopModalStyle: {
      width: '449px',
      top: 'calc(33% + 45px)'
    }
  },
  METAMETRICS_OPT_IN_MODAL: {
    contents: /*#__PURE__*/_react.default.createElement(_metametricsOptInModal.default, null),
    mobileModalStyle: _objectSpread(_objectSpread({}, modalContainerMobileStyle), {}, {
      width: '100%',
      height: '100%',
      top: '0px'
    }),
    laptopModalStyle: _objectSpread(_objectSpread({}, modalContainerLaptopStyle), {}, {
      top: '10%'
    }),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  CONFIRM_RESET_ACCOUNT: {
    contents: /*#__PURE__*/_react.default.createElement(_confirmResetAccount.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  CONFIRM_REMOVE_ACCOUNT: {
    contents: /*#__PURE__*/_react.default.createElement(_confirmRemoveAccount.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  CONFIRM_DELETE_NETWORK: {
    contents: /*#__PURE__*/_react.default.createElement(_confirmDeleteNetwork.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  LEGACY_CUSTOMIZE_GAS: {
    contents: /*#__PURE__*/_react.default.createElement(_gasModalPageContainer.default, null),
    mobileModalStyle: {
      width: '100vw',
      height: '100vh',
      top: '0',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto'
    },
    laptopModalStyle: {
      width: 'auto',
      height: '0px',
      top: '80px',
      left: '0px',
      transform: 'none',
      margin: '0 auto',
      position: 'relative'
    },
    contentStyle: {
      borderRadius: '8px'
    },
    customOnHideOpts: {
      action: _gas.resetCustomData,
      args: []
    }
  },
  CUSTOMIZE_METASWAP_GAS: {
    contents: /*#__PURE__*/_react.default.createElement(_swapsGasCustomizationModal.default, null),
    mobileModalStyle: {
      width: '100vw',
      height: '100vh',
      top: '0',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto'
    },
    laptopModalStyle: {
      width: 'auto',
      height: '0px',
      top: '80px',
      left: '0px',
      transform: 'none',
      margin: '0 auto',
      position: 'relative'
    },
    contentStyle: {
      borderRadius: '8px'
    }
  },
  EDIT_APPROVAL_PERMISSION: {
    contents: /*#__PURE__*/_react.default.createElement(_editApprovalPermission.default, null),
    mobileModalStyle: {
      width: '95vw',
      height: '100vh',
      top: '50px',
      transform: 'none',
      left: '0',
      right: '0',
      margin: '0 auto'
    },
    laptopModalStyle: {
      width: 'auto',
      height: '0px',
      top: '80px',
      left: '0px',
      transform: 'none',
      margin: '0 auto',
      position: 'relative'
    },
    contentStyle: {
      borderRadius: '8px'
    }
  },
  TRANSACTION_CONFIRMED: {
    disableBackdropClick: true,
    contents: /*#__PURE__*/_react.default.createElement(_transactionConfirmed.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  QR_SCANNER: {
    contents: /*#__PURE__*/_react.default.createElement(_qrScanner.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  CANCEL_TRANSACTION: {
    contents: /*#__PURE__*/_react.default.createElement(_cancelTransaction.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  REJECT_TRANSACTIONS: {
    contents: /*#__PURE__*/_react.default.createElement(_rejectTransactions.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  CUSTOMIZE_NONCE: {
    contents: /*#__PURE__*/_react.default.createElement(_customizeNonce.default, null),
    mobileModalStyle: _objectSpread({}, modalContainerMobileStyle),
    laptopModalStyle: _objectSpread({}, modalContainerLaptopStyle),
    contentStyle: {
      borderRadius: '8px'
    }
  },
  DEFAULT: {
    contents: [],
    mobileModalStyle: {},
    laptopModalStyle: {}
  }
};
const BACKDROPSTYLE = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)'
};

function mapStateToProps(state) {
  return {
    active: state.appState.modal.open,
    modalState: state.appState.modal.modalState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: customOnHideOpts => {
      dispatch(actions.hideModal());

      if (customOnHideOpts && customOnHideOpts.action) {
        dispatch(customOnHideOpts.action(...customOnHideOpts.args));
      }
    },
    hideWarning: () => {
      dispatch(actions.hideWarning());
    }
  };
}

class Modal extends _react.Component {
  hide() {
    this.modalRef.hide();
  }

  show() {
    this.modalRef.show();
  }

  UNSAFE_componentWillReceiveProps(nextProps, _) {
    if (nextProps.active) {
      this.show();
    } else if (this.props.active) {
      this.hide();
    }
  }

  render() {
    const modal = MODALS[this.props.modalState.name || 'DEFAULT'];
    const {
      contents: children,
      disableBackdropClick = false
    } = modal;
    const modalStyle = modal[(0, _isMobileView.default)() ? 'mobileModalStyle' : 'laptopModalStyle'];
    const contentStyle = modal.contentStyle || {};
    return /*#__PURE__*/_react.default.createElement(_fadeModal.default, {
      keyboard: false,
      onHide: () => {
        if (modal.onHide) {
          modal.onHide({
            hideWarning: this.props.hideWarning
          });
        }

        this.props.hideModal(modal.customOnHideOpts);
      },
      ref: ref => {
        this.modalRef = ref;
      },
      modalStyle: modalStyle,
      contentStyle: contentStyle,
      backdropStyle: BACKDROPSTYLE,
      closeOnClick: !disableBackdropClick
    }, children);
  }

}

(0, _defineProperty2.default)(Modal, "propTypes", {
  active: _propTypes.default.bool.isRequired,
  hideModal: _propTypes.default.func.isRequired,
  hideWarning: _propTypes.default.func.isRequired,
  modalState: _propTypes.default.object.isRequired
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Modal);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/modal.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/modal.js",}],
[4056, {"../../ducks/history/history":3982,"../../store/actions":4331,"./confirm-add-suggested-token.component":4055,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reactRouterDom = require("react-router-dom");

var _actions = require("../../store/actions");

var _history = require("../../ducks/history/history");

var _confirmAddSuggestedToken = _interopRequireDefault(require("./confirm-add-suggested-token.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      suggestedAssets,
      tokens
    }
  } = state;
  return {
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    suggestedAssets,
    tokens
  };
};

const mapDispatchToProps = dispatch => {
  return {
    rejectWatchAsset: suggestedAssetID => dispatch((0, _actions.rejectWatchAsset)(suggestedAssetID)),
    acceptWatchAsset: suggestedAssetID => dispatch((0, _actions.acceptWatchAsset)(suggestedAssetID))
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_confirmAddSuggestedToken.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-add-suggested-token/confirm-add-suggested-token.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-add-suggested-token/confirm-add-suggested-token.container.js",}],
[4134, {"../../helpers/constants/routes":3995,"../../selectors":4326,"../../store/actions":4331,"./first-time-flow.component":4133,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _selectors = require("../../selectors");

var _actions = require("../../store/actions");

var _routes = require("../../helpers/constants/routes");

var _firstTimeFlow = _interopRequireDefault(require("./first-time-flow.component"));

const mapStateToProps = (state, ownProps) => {
  const {
    metamask: {
      completedOnboarding,
      isInitialized,
      isUnlocked,
      seedPhraseBackedUp
    }
  } = state;
  const showingSeedPhraseBackupAfterOnboarding = Boolean(ownProps.location.pathname.match(_routes.INITIALIZE_BACKUP_SEED_PHRASE_ROUTE));
  return {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    nextRoute: (0, _selectors.getFirstTimeFlowTypeRoute)(state),
    showingSeedPhraseBackupAfterOnboarding,
    seedPhraseBackedUp
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createNewAccount: password => dispatch((0, _actions.createNewVaultAndGetSeedPhrase)(password)),
    createNewAccountFromSeed: (password, seedPhrase) => {
      return dispatch((0, _actions.createNewVaultAndRestore)(password, seedPhrase));
    },
    unlockAccount: password => dispatch((0, _actions.unlockAndGetSeedPhrase)(password)),
    verifySeedPhrase: () => (0, _actions.verifySeedPhrase)()
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_firstTimeFlow.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/first-time-flow/first-time-flow.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/first-time-flow.container.js",}],
[3614, {"../../../selectors":4326,"../../../store/actions":4331,"./account-menu.component":3613,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reactRouterDom = require("react-router-dom");

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _accountMenu = _interopRequireDefault(require("./account-menu.component"));

/**
 * The min amount of accounts to show search field
 */
const SHOW_SEARCH_ACCOUNTS_MIN_COUNT = 5;

function mapStateToProps(state) {
  const {
    metamask: {
      isAccountMenuOpen
    }
  } = state;
  const accounts = (0, _selectors.getMetaMaskAccountsOrdered)(state);
  const origin = (0, _selectors.getOriginOfCurrentTab)(state);
  const selectedAddress = (0, _selectors.getSelectedAddress)(state);
  return {
    isAccountMenuOpen,
    addressConnectedDomainMap: (0, _selectors.getAddressConnectedDomainMap)(state),
    originOfCurrentTab: origin,
    selectedAddress,
    keyrings: (0, _selectors.getMetaMaskKeyrings)(state),
    accounts,
    shouldShowAccountsSearch: accounts.length >= SHOW_SEARCH_ACCOUNTS_MIN_COUNT
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleAccountMenu: () => dispatch((0, _actions.toggleAccountMenu)()),
    showAccountDetail: address => {
      dispatch((0, _actions.showAccountDetail)(address));
      dispatch((0, _actions.toggleAccountMenu)());
    },
    lockMetamask: () => {
      dispatch((0, _actions.lockMetamask)());
      dispatch((0, _actions.hideWarning)());
      dispatch((0, _actions.toggleAccountMenu)());
    }
  };
}

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_accountMenu.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/account-menu/account-menu.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/account-menu/account-menu.container.js",}],
[3951, {"./text-field.component":3952,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _textField = _interopRequireDefault(require("./text-field.component"));

var _default = _textField.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/text-field/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/text-field/index.js",}],
[4227, {"../../ducks/metamask/metamask":3985,"../../ducks/send":3986,"../../hooks/useMetricEvent":4032,"../../selectors":4326,"../../store/actions":4331,"./send-content":4199,"./send-content/add-recipient":4198,"./send-content/add-recipient/ens-input":4197,"./send-footer":4221,"./send-header":4224,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SendTransactionScreen;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _send = require("../../ducks/send");

var _selectors = require("../../selectors");

var _metamask = require("../../ducks/metamask/metamask");

var _actions = require("../../store/actions");

var _useMetricEvent = require("../../hooks/useMetricEvent");

var _sendHeader = _interopRequireDefault(require("./send-header"));

var _addRecipient = _interopRequireDefault(require("./send-content/add-recipient"));

var _sendContent = _interopRequireDefault(require("./send-content"));

var _sendFooter = _interopRequireDefault(require("./send-footer"));

var _ensInput = _interopRequireDefault(require("./send-content/add-recipient/ens-input"));

const sendSliceIsCustomPriceExcessive = state => (0, _selectors.isCustomPriceExcessive)(state, true);

function SendTransactionScreen() {
  const history = (0, _reactRouterDom.useHistory)();
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const stage = (0, _reactRedux.useSelector)(_send.getSendStage);
  const gasIsExcessive = (0, _reactRedux.useSelector)(sendSliceIsCustomPriceExcessive);
  const isUsingMyAccountsForRecipientSearch = (0, _reactRedux.useSelector)(_send.getIsUsingMyAccountForRecipientSearch);
  const recipient = (0, _reactRedux.useSelector)(_send.getRecipient);
  const showHexData = (0, _reactRedux.useSelector)(_metamask.getSendHexDataFeatureFlagState);
  const userInput = (0, _reactRedux.useSelector)(_send.getRecipientUserInput);
  const location = (0, _reactRouterDom.useLocation)();
  const trackUsedQRScanner = (0, _useMetricEvent.useMetricEvent)({
    eventOpts: {
      category: 'Transactions',
      action: 'Edit Screen',
      name: 'Used QR scanner'
    }
  });
  const dispatch = (0, _reactRedux.useDispatch)();
  const cleanup = (0, _react.useCallback)(() => {
    dispatch((0, _send.resetSendState)());
  }, [dispatch]);
  (0, _react.useEffect)(() => {
    if (chainId !== undefined) {
      dispatch((0, _send.initializeSendState)());
      window.addEventListener('beforeunload', cleanup);
    }
  }, [chainId, dispatch, cleanup]);
  (0, _react.useEffect)(() => {
    if (location.search === '?scan=true') {
      dispatch((0, _actions.showQrScanner)()); // Clear the queryString param after showing the modal

      const cleanUrl = window.location.href.split('?')[0];
      window.history.pushState({}, null, `${cleanUrl}`);
      window.location.hash = '#send';
    }
  }, [location, dispatch]);
  (0, _react.useEffect)(() => {
    return () => {
      dispatch((0, _send.resetSendState)());
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [dispatch, cleanup]);
  let content;

  if ([_send.SEND_STAGES.EDIT, _send.SEND_STAGES.DRAFT].includes(stage)) {
    content = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_sendContent.default, {
      showHexData: showHexData,
      gasIsExcessive: gasIsExcessive
    }), /*#__PURE__*/_react.default.createElement(_sendFooter.default, {
      key: "send-footer",
      history: history
    }));
  } else {
    content = /*#__PURE__*/_react.default.createElement(_addRecipient.default, null);
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "page-container"
  }, /*#__PURE__*/_react.default.createElement(_sendHeader.default, {
    history: history
  }), /*#__PURE__*/_react.default.createElement(_ensInput.default, {
    userInput: userInput,
    className: "send__to-row",
    onChange: address => dispatch((0, _send.updateRecipientUserInput)(address)),
    onValidAddressTyped: address => dispatch((0, _send.updateRecipient)({
      address: address.replace('monsta:', '0x'),
      nickname: ''
    })),
    internalSearch: isUsingMyAccountsForRecipientSearch,
    selectedAddress: recipient.address,
    selectedName: recipient.nickname,
    onPaste: text => (0, _send.updateRecipient)({
      address: text,
      nickname: ''
    }),
    onReset: () => dispatch((0, _send.resetRecipientInput)()),
    scanQrCode: () => {
      trackUsedQRScanner();
      dispatch((0, _actions.showQrScanner)());
    }
  }), content);
}

//# sourceMappingURL=ui/pages/send/send.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send.js",}],
[4161, {"../../../app/scripts/lib/util":78,"../../../shared/constants/alerts":3590,"../../../shared/constants/app":3591,"../../ducks/app/app":3977,"../../ducks/metamask/metamask":3985,"../../ducks/swaps/swaps":3988,"../../selectors":4326,"../../store/actions":4331,"./home.component":4160,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _selectors = require("../../selectors");

var _actions = require("../../store/actions");

var _app = require("../../ducks/app/app");

var _metamask = require("../../ducks/metamask/metamask");

var _swaps = require("../../ducks/swaps/swaps");

var _util = require("../../../app/scripts/lib/util");

var _app2 = require("../../../shared/constants/app");

var _alerts = require("../../../shared/constants/alerts");

var _home = _interopRequireDefault(require("./home.component"));

const mapStateToProps = state => {
  const {
    metamask,
    appState
  } = state;
  const {
    suggestedAssets,
    seedPhraseBackedUp,
    tokens,
    threeBoxSynced,
    showRestorePrompt,
    selectedAddress,
    connectedStatusPopoverHasBeenShown,
    defaultHomeActiveTabName,
    swapsState,
    dismissSeedBackUpReminder
  } = metamask;
  const accountBalance = (0, _selectors.getCurrentEthBalance)(state);
  const {
    forgottenPassword,
    threeBoxLastUpdated
  } = appState;
  const totalUnapprovedCount = (0, _selectors.getTotalUnapprovedCount)(state);
  const swapsEnabled = (0, _swaps.getSwapsFeatureIsLive)(state);
  const pendingConfirmations = (0, _selectors.getUnapprovedTemplatedConfirmations)(state);
  const envType = (0, _util.getEnvironmentType)();
  const isPopup = envType === _app2.ENVIRONMENT_TYPE_POPUP;
  const isNotification = envType === _app2.ENVIRONMENT_TYPE_NOTIFICATION;
  const firstPermissionsRequest = (0, _selectors.getFirstPermissionRequest)(state);
  const firstPermissionsRequestId = firstPermissionsRequest && firstPermissionsRequest.metadata ? firstPermissionsRequest.metadata.id : null;
  const originOfCurrentTab = (0, _selectors.getOriginOfCurrentTab)(state);

  const shouldShowWeb3ShimUsageNotification = isPopup && (0, _metamask.getWeb3ShimUsageAlertEnabledness)(state) && (0, _selectors.activeTabHasPermissions)(state) && (0, _selectors.getWeb3ShimUsageStateForOrigin)(state, originOfCurrentTab) === _alerts.WEB3_SHIM_USAGE_ALERT_STATES.RECORDED;

  return {
    forgottenPassword,
    suggestedAssets,
    swapsEnabled,
    unconfirmedTransactionsCount: (0, _selectors.unconfirmedTransactionsCountSelector)(state),
    shouldShowSeedPhraseReminder: seedPhraseBackedUp === false && (parseInt(accountBalance, 16) > 0 || tokens.length > 0) && dismissSeedBackUpReminder === false,
    isPopup,
    isNotification,
    threeBoxSynced,
    showRestorePrompt,
    selectedAddress,
    threeBoxLastUpdated,
    firstPermissionsRequestId,
    totalUnapprovedCount,
    connectedStatusPopoverHasBeenShown,
    defaultHomeActiveTabName,
    haveSwapsQuotes: Boolean(Object.values(swapsState.quotes || {}).length),
    swapsFetchParams: swapsState.fetchParams,
    showAwaitingSwapScreen: swapsState.routeState === 'awaiting',
    isMainnet: (0, _selectors.getIsMainnet)(state),
    originOfCurrentTab,
    shouldShowWeb3ShimUsageNotification,
    pendingConfirmations,
    infuraBlocked: (0, _selectors.getInfuraBlocked)(state),
    notificationsToShow: (0, _selectors.getSortedNotificationsToShow)(state).length > 0,
    showWhatsNewPopup: (0, _selectors.getShowWhatsNewPopup)(state),
    showRecoveryPhraseReminder: (0, _selectors.getShowRecoveryPhraseReminder)(state),
    seedPhraseBackedUp
  };
};

const mapDispatchToProps = dispatch => ({
  turnThreeBoxSyncingOn: () => dispatch((0, _actions.turnThreeBoxSyncingOn)()),
  setupThreeBox: () => {
    dispatch((0, _actions.getThreeBoxLastUpdated)()).then(lastUpdated => {
      if (lastUpdated) {
        dispatch((0, _app.setThreeBoxLastUpdated)(lastUpdated));
      } else {
        dispatch((0, _actions.setShowRestorePromptToFalse)());
        dispatch((0, _actions.turnThreeBoxSyncingOn)());
      }
    });
  },
  restoreFromThreeBox: address => dispatch((0, _actions.restoreFromThreeBox)(address)),
  setShowRestorePromptToFalse: () => dispatch((0, _actions.setShowRestorePromptToFalse)()),
  setConnectedStatusPopoverHasBeenShown: () => dispatch((0, _actions.setConnectedStatusPopoverHasBeenShown)()),
  onTabClick: name => dispatch((0, _actions.setDefaultHomeActiveTabName)(name)),
  setWeb3ShimUsageAlertDismissed: origin => (0, _actions.setWeb3ShimUsageAlertDismissed)(origin),
  disableWeb3ShimUsageAlert: () => (0, _actions.setAlertEnabledness)(_alerts.ALERT_TYPES.web3ShimUsage, false),
  hideWhatsNewPopup: () => dispatch((0, _app.hideWhatsNewPopup)()),
  setRecoveryPhraseReminderHasBeenShown: () => dispatch((0, _actions.setRecoveryPhraseReminderHasBeenShown)()),
  setRecoveryPhraseReminderLastShown: lastShown => dispatch((0, _actions.setRecoveryPhraseReminderLastShown)(lastShown))
});

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_home.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/home/home.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/home/home.container.js",}],
[4092, {"../../ducks/confirm-transaction/confirm-transaction.duck":3978,"../../ducks/history/history":3982,"../../ducks/send":3986,"../../helpers/utils/transactions.util":4018,"../../selectors":4326,"../../store/actions":4331,"./confirm-transaction.component":4091,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reactRouterDom = require("react-router-dom");

var _confirmTransaction = require("../../ducks/confirm-transaction/confirm-transaction.duck");

var _transactions = require("../../helpers/utils/transactions.util");

var _actions = require("../../store/actions");

var _selectors = require("../../selectors");

var _history = require("../../ducks/history/history");

var _send = require("../../ducks/send");

var _confirmTransaction2 = _interopRequireDefault(require("./confirm-transaction.component"));

const mapStateToProps = (state, ownProps) => {
  const {
    metamask: {
      unapprovedTxs
    }
  } = state;
  const {
    match: {
      params = {}
    }
  } = ownProps;
  const {
    id
  } = params;
  const sendTo = (0, _send.getSendTo)(state);
  const unconfirmedTransactions = (0, _selectors.unconfirmedTransactionsListSelector)(state);
  const totalUnconfirmed = unconfirmedTransactions.length;
  const transaction = totalUnconfirmed ? unapprovedTxs[id] || unconfirmedTransactions[0] : {};
  const {
    id: transactionId,
    type
  } = transaction;
  return {
    totalUnapprovedCount: totalUnconfirmed,
    sendTo,
    unapprovedTxs,
    id,
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    paramsTransactionId: id && String(id),
    transactionId: transactionId && String(transactionId),
    transaction,
    isTokenMethodAction: (0, _transactions.isTokenMethodAction)(type)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTransactionToConfirm: transactionId => {
      dispatch((0, _confirmTransaction.setTransactionToConfirm)(transactionId));
    },
    clearConfirmTransaction: () => dispatch((0, _confirmTransaction.clearConfirmTransaction)()),
    getContractMethodData: data => dispatch((0, _actions.getContractMethodData)(data)),
    getTokenParams: tokenAddress => dispatch((0, _actions.getTokenParams)(tokenAddress)),
    setDefaultHomeActiveTabName: tabName => dispatch((0, _actions.setDefaultHomeActiveTabName)(tabName))
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_confirmTransaction2.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-transaction/confirm-transaction.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-transaction/confirm-transaction.container.js",}],
[4322, {"../../../app/scripts/lib/util":78,"../../../shared/constants/app":3591,"../../helpers/constants/routes":3995,"../../store/actions":4331,"./unlock-page.component":4321,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _redux = require("redux");

var _util = require("../../../app/scripts/lib/util");

var _app = require("../../../shared/constants/app");

var _routes = require("../../helpers/constants/routes");

var _actions = require("../../store/actions");

var _unlockPage = _interopRequireDefault(require("./unlock-page.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const mapStateToProps = state => {
  const {
    metamask: {
      isUnlocked
    }
  } = state;
  return {
    isUnlocked
  };
};

const mapDispatchToProps = dispatch => {
  return {
    forgotPassword: () => dispatch((0, _actions.forgotPassword)()),
    tryUnlockMetamask: password => dispatch((0, _actions.tryUnlockMetamask)(password)),
    markPasswordForgotten: () => dispatch((0, _actions.markPasswordForgotten)()),
    forceUpdateMetamaskState: () => (0, _actions.forceUpdateMetamaskState)(dispatch),
    showOptInModal: () => dispatch((0, _actions.showModal)({
      name: 'METAMETRICS_OPT_IN_MODAL'
    }))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    // eslint-disable-next-line no-shadow
    markPasswordForgotten,
    // eslint-disable-next-line no-shadow
    tryUnlockMetamask
  } = dispatchProps,
        restDispatchProps = (0, _objectWithoutProperties2.default)(dispatchProps, ["markPasswordForgotten", "tryUnlockMetamask"]);
  const {
    history,
    onSubmit: ownPropsSubmit
  } = ownProps,
        restOwnProps = (0, _objectWithoutProperties2.default)(ownProps, ["history", "onSubmit"]);

  const onImport = async () => {
    await markPasswordForgotten();
    history.push(_routes.RESTORE_VAULT_ROUTE);

    if ((0, _util.getEnvironmentType)() === _app.ENVIRONMENT_TYPE_POPUP) {
      global.platform.openExtensionInBrowser(_routes.RESTORE_VAULT_ROUTE);
    }
  };

  const onSubmit = async password => {
    await tryUnlockMetamask(password);
    history.push(_routes.DEFAULT_ROUTE);
  };

  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, stateProps), restDispatchProps), restOwnProps), {}, {
    onRestore: onImport,
    onSubmit: ownPropsSubmit || onSubmit,
    history
  });
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps))(_unlockPage.default);

exports.default = _default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/unlock-page/unlock-page.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/unlock-page/unlock-page.container.js",}],
[2267, {}, function (require, module, exports) {
module.exports = pathGetter;

function pathGetter(obj, path) {
  if (path !== '$') {
    var paths = getPaths(path);
    for (var i = 0; i < paths.length; i++) {
      path = paths[i].toString().replace(/\\"/g, '"');
      if (typeof obj[path] === 'undefined' && i !== paths.length - 1) continue;
      obj = obj[path];
    }
  }
  return obj;
}

function getPaths(pathString) {
  var regex = /(?:\.(\w+))|(?:\[(\d+)\])|(?:\["((?:[^\\"]|\\.)*)"\])/g;
  var matches = [];
  var match;
  while (match = regex.exec(pathString)) {
    matches.push( match[1] || match[2] || match[3] );
  }
  return matches;
}

//# sourceMappingURL=node_modules/jsan/lib/path-getter.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/jsan/lib/path-getter.js",}],
[2268, {"./":2266,"./path-getter":2267}, function (require, module, exports) {
var pathGetter = require('./path-getter');
var jsan = require('./');

exports.getRegexFlags = function getRegexFlags(regex) {
  var flags = '';
  if (regex.ignoreCase) flags += 'i';
  if (regex.global) flags += 'g';
  if (regex.multiline) flags += 'm';
  return flags;
};

exports.stringifyFunction = function stringifyFunction(fn, customToString) {
  if (typeof customToString === 'function') {
    return customToString(fn);
  }
  var str = fn.toString();
  var match = str.match(/^[^{]*{|^[^=]*=>/);
  var start = match ? match[0] : '<function> ';
  var end = str[str.length - 1] === '}' ? '}' : '';
  return start.replace(/\r\n|\n/g, ' ').replace(/\s+/g, ' ') + ' /* ... */ ' + end;
};

exports.restore = function restore(obj, root) {
  var type = obj[0];
  var rest = obj.slice(1);
  switch(type) {
    case '$':
      return pathGetter(root, obj);
    case 'r':
      var comma = rest.indexOf(',');
      var flags = rest.slice(0, comma);
      var source = rest.slice(comma + 1);
      return RegExp(source, flags);
    case 'd':
      return new Date(+rest);
    case 'f':
      var fn = function() { throw new Error("can't run jsan parsed function") };
      fn.toString = function() { return rest; };
      return fn;
    case 'u':
      return undefined;
    case 'e':
      var error = new Error(rest);
      error.stack = 'Stack is unavailable for jsan parsed errors';
      return error;
    case 's':
      return Symbol(rest);
    case 'g':
      return Symbol.for(rest);
    case 'm':
      return new Map(jsan.parse(rest));
    case 'l':
      return new Set(jsan.parse(rest));
    case 'n':
      return NaN;
    case 'i':
      return Infinity;
    case 'y':
      return -Infinity;
    default:
      console.warn('unknown type', obj);
      return obj;
  }
}

//# sourceMappingURL=node_modules/jsan/lib/utils.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/jsan/lib/utils.js",}],
[3242, {}, function (require, module, exports) {
// Based on https://github.com/dscape/cycle/blob/master/cycle.js

module.exports = function decycle(object) {
// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form
//      {$ref: PATH}
// where the PATH is a JSONPath string that locates the first occurance.
// So,
//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));
// produces the string '[{"$ref":"$"}]'.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child member or
// property.

    var objects = [],   // Keep a reference to each unique object or array
        paths = [];     // Keep the path to each unique object or array

    return (function derez(value, path) {

// The derez recurses through the object, producing the deep copy.

        var i,          // The loop counter
            name,       // Property name
            nu;         // The new object or array

// typeof null === 'object', so go on if this value is really an object but not
// one of the weird builtin objects.

        if (typeof value === 'object' && value !== null &&
                !(value instanceof Boolean) &&
                !(value instanceof Date)    &&
                !(value instanceof Number)  &&
                !(value instanceof RegExp)  &&
                !(value instanceof String)) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a $ref/path object. This is a hard way,
// linear search that will get slower as the number of unique objects grows.

            for (i = 0; i < objects.length; i += 1) {
                if (objects[i] === value) {
                    return {$ref: paths[i]};
                }
            }

// Otherwise, accumulate the unique value and its path.

            objects.push(value);
            paths.push(path);

// If it is an array, replicate the array.

            if (Object.prototype.toString.apply(value) === '[object Array]') {
                nu = [];
                for (i = 0; i < value.length; i += 1) {
                    nu[i] = derez(value[i], path + '[' + i + ']');
                }
            } else {

// If it is an object, replicate the object.

                nu = {};
                for (name in value) {
                    if (Object.prototype.hasOwnProperty.call(value, name)) {
                        nu[name] = derez(value[name],
                            path + '[' + JSON.stringify(name) + ']');
                    }
                }
            }
            return nu;
        }
        return value;
    }(object, '$'));
};

//# sourceMappingURL=node_modules/sc-errors/decycle.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/sc-errors/decycle.js",}],
[3337, {"./lib/bytesToUuid":3334,"./lib/rng":3335}, function (require, module, exports) {
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

//# sourceMappingURL=node_modules/socketcluster-client/node_modules/uuid/v4.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/node_modules/uuid/v4.js",}],
[3336, {"./lib/bytesToUuid":3334,"./lib/rng":3335}, function (require, module, exports) {
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

//# sourceMappingURL=node_modules/socketcluster-client/node_modules/uuid/v1.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/node_modules/uuid/v1.js",}],
[3330, {}, function (require, module, exports) {
var global;
if (typeof WorkerGlobalScope !== 'undefined') {
  global = self;
} else {
  global = typeof window !== 'undefined' && window || (function() { return this; })();
}

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object} opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

module.exports = WebSocket ? ws : null;

//# sourceMappingURL=node_modules/socketcluster-client/lib/ws-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/lib/ws-browser.js",}],
[2497, {}, function (require, module, exports) {
'use strict';

/**
 * Constants.
 */

var errorMessage;

errorMessage = 'An argument without append, prepend, ' +
    'or detach methods was given to `List';

/**
 * Creates a new List: A linked list is a bit like an Array, but
 * knows nothing about how many items are in it, and knows only about its
 * first (`head`) and last (`tail`) items. Each item (e.g. `head`, `tail`,
 * &c.) knows which item comes before or after it (its more like the
 * implementation of the DOM in JavaScript).
 * @global
 * @private
 * @constructor
 * @class Represents an instance of List.
 */

function List(/*items...*/) {
    if (arguments.length) {
        return List.from(arguments);
    }
}

var ListPrototype;

ListPrototype = List.prototype;

/**
 * Creates a new list from the arguments (each a list item) passed in.
 * @name List.of
 * @param {...ListItem} [items] - Zero or more items to attach.
 * @returns {list} - A new instance of List.
 */

List.of = function (/*items...*/) {
    return List.from.call(this, arguments);
};

/**
 * Creates a new list from the given array-like object (each a list item)
 * passed in.
 * @name List.from
 * @param {ListItem[]} [items] - The items to append.
 * @returns {list} - A new instance of List.
 */
List.from = function (items) {
    var list = new this(), length, iterator, item;

    if (items && (length = items.length)) {
        iterator = -1;

        while (++iterator < length) {
            item = items[iterator];

            if (item !== null && item !== undefined) {
                list.append(item);
            }
        }
    }

    return list;
};

/**
 * List#head
 * Default to `null`.
 */
ListPrototype.head = null;

/**
 * List#tail
 * Default to `null`.
 */
ListPrototype.tail = null;

/**
 * Returns the list's items as an array. This does *not* detach the items.
 * @name List#toArray
 * @returns {ListItem[]} - An array of (still attached) ListItems.
 */
ListPrototype.toArray = function () {
    var item = this.head,
        result = [];

    while (item) {
        result.push(item);
        item = item.next;
    }

    return result;
};

/**
 * Prepends the given item to the list: Item will be the new first item
 * (`head`).
 * @name List#prepend
 * @param {ListItem} item - The item to prepend.
 * @returns {ListItem} - An instance of ListItem (the given item).
 */
ListPrototype.prepend = function (item) {
    if (!item) {
        return false;
    }

    if (!item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + '#prepend`.');
    }

    var self, head;

    // Cache self.
    self = this;

    // If self has a first item, defer prepend to the first items prepend
    // method, and return the result.
    head = self.head;

    if (head) {
        return head.prepend(item);
    }

    // ...otherwise, there is no `head` (or `tail`) item yet.

    // Detach the prependee.
    item.detach();

    // Set the prependees parent list to reference self.
    item.list = self;

    // Set self's first item to the prependee, and return the item.
    self.head = item;

    return item;
};

/**
 * Appends the given item to the list: Item will be the new last item (`tail`)
 * if the list had a first item, and its first item (`head`) otherwise.
 * @name List#append
 * @param {ListItem} item - The item to append.
 * @returns {ListItem} - An instance of ListItem (the given item).
 */

ListPrototype.append = function (item) {
    if (!item) {
        return false;
    }

    if (!item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + '#append`.');
    }

    var self, head, tail;

    // Cache self.
    self = this;

    // If self has a last item, defer appending to the last items append
    // method, and return the result.
    tail = self.tail;

    if (tail) {
        return tail.append(item);
    }

    // If self has a first item, defer appending to the first items append
    // method, and return the result.
    head = self.head;

    if (head) {
        return head.append(item);
    }

    // ...otherwise, there is no `tail` or `head` item yet.

    // Detach the appendee.
    item.detach();

    // Set the appendees parent list to reference self.
    item.list = self;

    // Set self's first item to the appendee, and return the item.
    self.head = item;

    return item;
};

/**
 * Creates a new ListItem: A linked list item is a bit like DOM node:
 * It knows only about its "parent" (`list`), the item before it (`prev`),
 * and the item after it (`next`).
 * @global
 * @private
 * @constructor
 * @class Represents an instance of ListItem.
 */

function ListItem() {}

List.Item = ListItem;

var ListItemPrototype = ListItem.prototype;

ListItemPrototype.next = null;

ListItemPrototype.prev = null;

ListItemPrototype.list = null;

/**
 * Detaches the item operated on from its parent list.
 * @name ListItem#detach
 * @returns {ListItem} - The item operated on.
 */
ListItemPrototype.detach = function () {
    // Cache self, the parent list, and the previous and next items.
    var self = this,
        list = self.list,
        prev = self.prev,
        next = self.next;

    // If the item is already detached, return self.
    if (!list) {
        return self;
    }

    // If self is the last item in the parent list, link the lists last item
    // to the previous item.
    if (list.tail === self) {
        list.tail = prev;
    }

    // If self is the first item in the parent list, link the lists first item
    // to the next item.
    if (list.head === self) {
        list.head = next;
    }

    // If both the last and first items in the parent list are the same,
    // remove the link to the last item.
    if (list.tail === list.head) {
        list.tail = null;
    }

    // If a previous item exists, link its next item to selfs next item.
    if (prev) {
        prev.next = next;
    }

    // If a next item exists, link its previous item to selfs previous item.
    if (next) {
        next.prev = prev;
    }

    // Remove links from self to both the next and previous items, and to the
    // parent list.
    self.prev = self.next = self.list = null;

    // Return self.
    return self;
};

/**
 * Prepends the given item *before* the item operated on.
 * @name ListItem#prepend
 * @param {ListItem} item - The item to prepend.
 * @returns {ListItem} - The item operated on, or false when that item is not
 * attached.
 */
ListItemPrototype.prepend = function (item) {
    if (!item || !item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + 'Item#prepend`.');
    }

    // Cache self, the parent list, and the previous item.
    var self = this,
        list = self.list,
        prev = self.prev;

    // If self is detached, return false.
    if (!list) {
        return false;
    }

    // Detach the prependee.
    item.detach();

    // If self has a previous item...
    if (prev) {
        // ...link the prependees previous item, to selfs previous item.
        item.prev = prev;

        // ...link the previous items next item, to self.
        prev.next = item;
    }

    // Set the prependees next item to self.
    item.next = self;

    // Set the prependees parent list to selfs parent list.
    item.list = list;

    // Set the previous item of self to the prependee.
    self.prev = item;

    // If self is the first item in the parent list, link the lists first item
    // to the prependee.
    if (self === list.head) {
        list.head = item;
    }

    // If the the parent list has no last item, link the lists last item to
    // self.
    if (!list.tail) {
        list.tail = self;
    }

    // Return the prependee.
    return item;
};

/**
 * Appends the given item *after* the item operated on.
 * @name ListItem#append
 * @param {ListItem} item - The item to append.
 * @returns {ListItem} - The item operated on, or false when that item is not
 * attached.
 */
ListItemPrototype.append = function (item) {
    // If item is falsey, return false.
    if (!item || !item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + 'Item#append`.');
    }

    // Cache self, the parent list, and the next item.
    var self = this,
        list = self.list,
        next = self.next;

    // If self is detached, return false.
    if (!list) {
        return false;
    }

    // Detach the appendee.
    item.detach();

    // If self has a next item...
    if (next) {
        // ...link the appendees next item, to selfs next item.
        item.next = next;

        // ...link the next items previous item, to the appendee.
        next.prev = item;
    }

    // Set the appendees previous item to self.
    item.prev = self;

    // Set the appendees parent list to selfs parent list.
    item.list = list;

    // Set the next item of self to the appendee.
    self.next = item;

    // If the the parent list has no last item or if self is the parent lists
    // last item, link the lists last item to the appendee.
    if (self === list.tail || !list.tail) {
        list.tail = item;
    }

    // Return the appendee.
    return item;
};

/**
 * Expose `List`.
 */

module.exports = List;

//# sourceMappingURL=node_modules/linked-list/_source/linked-list.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/linked-list/_source/linked-list.js",}],
[3241, {}, function (require, module, exports) {

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

//# sourceMappingURL=node_modules/sc-channel/node_modules/component-emitter/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/sc-channel/node_modules/component-emitter/index.js",}],
[2574, {"./_overArg":2609}, function (require, module, exports) {
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

//# sourceMappingURL=node_modules/lodash/_getPrototype.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_getPrototype.js",}],
[2552, {"./_overRest":2610,"./_setToString":2615,"./identity":2631}, function (require, module, exports) {
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

//# sourceMappingURL=node_modules/lodash/_baseRest.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseRest.js",}],
[2530, {"./_arrayPush":2524,"./_isFlattenable":2585}, function (require, module, exports) {
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

//# sourceMappingURL=node_modules/lodash/_baseFlatten.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseFlatten.js",}],
[2636, {"./isArrayLike":2635,"./isObjectLike":2641}, function (require, module, exports) {
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

//# sourceMappingURL=node_modules/lodash/isArrayLikeObject.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/isArrayLikeObject.js",}],
[2557, {"./_SetCache":2513,"./_arrayIncludes":2520,"./_arrayIncludesWith":2521,"./_cacheHas":2559,"./_createSet":2564,"./_setToArray":2614}, function (require, module, exports) {
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;

//# sourceMappingURL=node_modules/lodash/_baseUniq.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseUniq.js",}],
[2528, {"./_SetCache":2513,"./_arrayIncludes":2520,"./_arrayIncludesWith":2521,"./_arrayMap":2523,"./_baseUnary":2556,"./_cacheHas":2559}, function (require, module, exports) {
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

//# sourceMappingURL=node_modules/lodash/_baseDifference.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseDifference.js",}],
[2565, {"./_getNative":2573}, function (require, module, exports) {
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

//# sourceMappingURL=node_modules/lodash/_defineProperty.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_defineProperty.js",}],
[2531, {"./_createBaseFor":2563}, function (require, module, exports) {
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

//# sourceMappingURL=node_modules/lodash/_baseFor.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseFor.js",}],
[2650, {"./_baseProperty":2550,"./_basePropertyDeep":2551,"./_isKey":2587,"./_toKey":2624}, function (require, module, exports) {
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

//# sourceMappingURL=node_modules/lodash/property.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/property.js",}],
[2548, {"./_baseIsMatch":2542,"./_getMatchData":2572,"./_matchesStrictComparable":2603}, function (require, module, exports) {
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

//# sourceMappingURL=node_modules/lodash/_baseMatches.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseMatches.js",}],
[2549, {"./_baseIsEqual":2540,"./_isKey":2587,"./_isStrictComparable":2591,"./_matchesStrictComparable":2603,"./_toKey":2624,"./get":2629,"./hasIn":2630}, function (require, module, exports) {
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;

//# sourceMappingURL=node_modules/lodash/_baseMatchesProperty.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseMatchesProperty.js",}],
[3107, {"resolve-pathname":3162,"tiny-invariant":3388,"tiny-warning":3389,"value-equal":3468}, function (require, module, exports) {
"use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}Object.defineProperty(exports,"__esModule",{value:!0});var resolvePathname=_interopDefault(require("resolve-pathname")),valueEqual=_interopDefault(require("value-equal"));require("tiny-warning");var invariant=_interopDefault(require("tiny-invariant"));function _extends(){return(_extends=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t}).apply(this,arguments)}function addLeadingSlash(t){return"/"===t.charAt(0)?t:"/"+t}function stripLeadingSlash(t){return"/"===t.charAt(0)?t.substr(1):t}function hasBasename(t,n){return 0===t.toLowerCase().indexOf(n.toLowerCase())&&-1!=="/?#".indexOf(t.charAt(n.length))}function stripBasename(t,n){return hasBasename(t,n)?t.substr(n.length):t}function stripTrailingSlash(t){return"/"===t.charAt(t.length-1)?t.slice(0,-1):t}function parsePath(t){var n=t||"/",e="",a="",r=n.indexOf("#");-1!==r&&(a=n.substr(r),n=n.substr(0,r));var o=n.indexOf("?");return-1!==o&&(e=n.substr(o),n=n.substr(0,o)),{pathname:n,search:"?"===e?"":e,hash:"#"===a?"":a}}function createPath(t){var n=t.pathname,e=t.search,a=t.hash,r=n||"/";return e&&"?"!==e&&(r+="?"===e.charAt(0)?e:"?"+e),a&&"#"!==a&&(r+="#"===a.charAt(0)?a:"#"+a),r}function createLocation(t,n,e,a){var r;"string"==typeof t?(r=parsePath(t)).state=n:(void 0===(r=_extends({},t)).pathname&&(r.pathname=""),r.search?"?"!==r.search.charAt(0)&&(r.search="?"+r.search):r.search="",r.hash?"#"!==r.hash.charAt(0)&&(r.hash="#"+r.hash):r.hash="",void 0!==n&&void 0===r.state&&(r.state=n));try{r.pathname=decodeURI(r.pathname)}catch(t){throw t instanceof URIError?new URIError('Pathname "'+r.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):t}return e&&(r.key=e),a?r.pathname?"/"!==r.pathname.charAt(0)&&(r.pathname=resolvePathname(r.pathname,a.pathname)):r.pathname=a.pathname:r.pathname||(r.pathname="/"),r}function locationsAreEqual(t,n){return t.pathname===n.pathname&&t.search===n.search&&t.hash===n.hash&&t.key===n.key&&valueEqual(t.state,n.state)}function createTransitionManager(){var o=null;var a=[];return{setPrompt:function(t){return o=t,function(){o===t&&(o=null)}},confirmTransitionTo:function(t,n,e,a){if(null!=o){var r="function"==typeof o?o(t,n):o;"string"==typeof r?"function"==typeof e?e(r,a):a(!0):a(!1!==r)}else a(!0)},appendListener:function(t){var n=!0;function e(){n&&t.apply(void 0,arguments)}return a.push(e),function(){n=!1,a=a.filter(function(t){return t!==e})}},notifyListeners:function(){for(var t=arguments.length,n=new Array(t),e=0;e<t;e++)n[e]=arguments[e];a.forEach(function(t){return t.apply(void 0,n)})}}}var canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement);function getConfirmation(t,n){n(window.confirm(t))}function supportsHistory(){var t=window.navigator.userAgent;return(-1===t.indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)}function supportsPopStateOnHashChange(){return-1===window.navigator.userAgent.indexOf("Trident")}function supportsGoWithoutReloadUsingHash(){return-1===window.navigator.userAgent.indexOf("Firefox")}function isExtraneousPopstateEvent(t){return void 0===t.state&&-1===navigator.userAgent.indexOf("CriOS")}var PopStateEvent="popstate",HashChangeEvent="hashchange";function getHistoryState(){try{return window.history.state||{}}catch(t){return{}}}function createBrowserHistory(t){void 0===t&&(t={}),canUseDOM||invariant(!1);var s=window.history,c=supportsHistory(),n=!supportsPopStateOnHashChange(),e=t,a=e.forceRefresh,h=void 0!==a&&a,r=e.getUserConfirmation,u=void 0===r?getConfirmation:r,o=e.keyLength,i=void 0===o?6:o,f=t.basename?stripTrailingSlash(addLeadingSlash(t.basename)):"";function l(t){var n=t||{},e=n.key,a=n.state,r=window.location,o=r.pathname+r.search+r.hash;return f&&(o=stripBasename(o,f)),createLocation(o,a,e)}function d(){return Math.random().toString(36).substr(2,i)}var v=createTransitionManager();function p(t){_extends(T,t),T.length=s.length,v.notifyListeners(T.location,T.action)}function g(t){isExtraneousPopstateEvent(t)||w(l(t.state))}function P(){w(l(getHistoryState()))}var m=!1;function w(n){if(m)m=!1,p();else{v.confirmTransitionTo(n,"POP",u,function(t){t?p({action:"POP",location:n}):function(t){var n=T.location,e=H.indexOf(n.key);-1===e&&(e=0);var a=H.indexOf(t.key);-1===a&&(a=0);var r=e-a;r&&(m=!0,L(r))}(n)})}}var y=l(getHistoryState()),H=[y.key];function x(t){return f+createPath(t)}function L(t){s.go(t)}var O=0;function E(t){1===(O+=t)&&1===t?(window.addEventListener(PopStateEvent,g),n&&window.addEventListener(HashChangeEvent,P)):0===O&&(window.removeEventListener(PopStateEvent,g),n&&window.removeEventListener(HashChangeEvent,P))}var S=!1;var T={length:s.length,action:"POP",location:y,createHref:x,push:function(t,n){var i=createLocation(t,n,d(),T.location);v.confirmTransitionTo(i,"PUSH",u,function(t){if(t){var n=x(i),e=i.key,a=i.state;if(c)if(s.pushState({key:e,state:a},null,n),h)window.location.href=n;else{var r=H.indexOf(T.location.key),o=H.slice(0,r+1);o.push(i.key),H=o,p({action:"PUSH",location:i})}else window.location.href=n}})},replace:function(t,n){var o="REPLACE",i=createLocation(t,n,d(),T.location);v.confirmTransitionTo(i,o,u,function(t){if(t){var n=x(i),e=i.key,a=i.state;if(c)if(s.replaceState({key:e,state:a},null,n),h)window.location.replace(n);else{var r=H.indexOf(T.location.key);-1!==r&&(H[r]=i.key),p({action:o,location:i})}else window.location.replace(n)}})},go:L,goBack:function(){L(-1)},goForward:function(){L(1)},block:function(t){void 0===t&&(t=!1);var n=v.setPrompt(t);return S||(E(1),S=!0),function(){return S&&(S=!1,E(-1)),n()}},listen:function(t){var n=v.appendListener(t);return E(1),function(){E(-1),n()}}};return T}var HashChangeEvent$1="hashchange",HashPathCoders={hashbang:{encodePath:function(t){return"!"===t.charAt(0)?t:"!/"+stripLeadingSlash(t)},decodePath:function(t){return"!"===t.charAt(0)?t.substr(1):t}},noslash:{encodePath:stripLeadingSlash,decodePath:addLeadingSlash},slash:{encodePath:addLeadingSlash,decodePath:addLeadingSlash}};function stripHash(t){var n=t.indexOf("#");return-1===n?t:t.slice(0,n)}function getHashPath(){var t=window.location.href,n=t.indexOf("#");return-1===n?"":t.substring(n+1)}function pushHashPath(t){window.location.hash=t}function replaceHashPath(t){window.location.replace(stripHash(window.location.href)+"#"+t)}function createHashHistory(t){void 0===t&&(t={}),canUseDOM||invariant(!1);var n=window.history,e=(supportsGoWithoutReloadUsingHash(),t),a=e.getUserConfirmation,i=void 0===a?getConfirmation:a,r=e.hashType,o=void 0===r?"slash":r,s=t.basename?stripTrailingSlash(addLeadingSlash(t.basename)):"",c=HashPathCoders[o],h=c.encodePath,u=c.decodePath;function f(){var t=u(getHashPath());return s&&(t=stripBasename(t,s)),createLocation(t)}var l=createTransitionManager();function d(t){_extends(E,t),E.length=n.length,l.notifyListeners(E.location,E.action)}var v=!1,p=null;function g(){var t=getHashPath(),n=h(t);if(t!==n)replaceHashPath(n);else{var e=f(),a=E.location;if(!v&&function(t,n){return t.pathname===n.pathname&&t.search===n.search&&t.hash===n.hash}(a,e))return;if(p===createPath(e))return;p=null,function(n){if(v)v=!1,d();else{l.confirmTransitionTo(n,"POP",i,function(t){t?d({action:"POP",location:n}):function(t){var n=E.location,e=y.lastIndexOf(createPath(n));-1===e&&(e=0);var a=y.lastIndexOf(createPath(t));-1===a&&(a=0);var r=e-a;r&&(v=!0,H(r))}(n)})}}(e)}}var P=getHashPath(),m=h(P);P!==m&&replaceHashPath(m);var w=f(),y=[createPath(w)];function H(t){n.go(t)}var x=0;function L(t){1===(x+=t)&&1===t?window.addEventListener(HashChangeEvent$1,g):0===x&&window.removeEventListener(HashChangeEvent$1,g)}var O=!1;var E={length:n.length,action:"POP",location:w,createHref:function(t){var n=document.querySelector("base"),e="";return n&&n.getAttribute("href")&&(e=stripHash(window.location.href)),e+"#"+h(s+createPath(t))},push:function(t,n){var o=createLocation(t,void 0,void 0,E.location);l.confirmTransitionTo(o,"PUSH",i,function(t){if(t){var n=createPath(o),e=h(s+n);if(getHashPath()!==e){p=n,pushHashPath(e);var a=y.lastIndexOf(createPath(E.location)),r=y.slice(0,a+1);r.push(n),y=r,d({action:"PUSH",location:o})}else d()}})},replace:function(t,n){var r="REPLACE",o=createLocation(t,void 0,void 0,E.location);l.confirmTransitionTo(o,r,i,function(t){if(t){var n=createPath(o),e=h(s+n);getHashPath()!==e&&(p=n,replaceHashPath(e));var a=y.indexOf(createPath(E.location));-1!==a&&(y[a]=n),d({action:r,location:o})}})},go:H,goBack:function(){H(-1)},goForward:function(){H(1)},block:function(t){void 0===t&&(t=!1);var n=l.setPrompt(t);return O||(L(1),O=!0),function(){return O&&(O=!1,L(-1)),n()}},listen:function(t){var n=l.appendListener(t);return L(1),function(){L(-1),n()}}};return E}function clamp(t,n,e){return Math.min(Math.max(t,n),e)}function createMemoryHistory(t){void 0===t&&(t={});var n=t,r=n.getUserConfirmation,e=n.initialEntries,a=void 0===e?["/"]:e,o=n.initialIndex,i=void 0===o?0:o,s=n.keyLength,c=void 0===s?6:s,h=createTransitionManager();function u(t){_extends(g,t),g.length=g.entries.length,h.notifyListeners(g.location,g.action)}function f(){return Math.random().toString(36).substr(2,c)}var l=clamp(i,0,a.length-1),d=a.map(function(t){return createLocation(t,void 0,"string"==typeof t?f():t.key||f())}),v=createPath;function p(t){var n=clamp(g.index+t,0,g.entries.length-1),e=g.entries[n];h.confirmTransitionTo(e,"POP",r,function(t){t?u({action:"POP",location:e,index:n}):u()})}var g={length:d.length,action:"POP",location:d[l],index:l,entries:d,createHref:v,push:function(t,n){var a=createLocation(t,n,f(),g.location);h.confirmTransitionTo(a,"PUSH",r,function(t){if(t){var n=g.index+1,e=g.entries.slice(0);e.length>n?e.splice(n,e.length-n,a):e.push(a),u({action:"PUSH",location:a,index:n,entries:e})}})},replace:function(t,n){var e="REPLACE",a=createLocation(t,n,f(),g.location);h.confirmTransitionTo(a,e,r,function(t){t&&(g.entries[g.index]=a,u({action:e,location:a}))})},go:p,goBack:function(){p(-1)},goForward:function(){p(1)},canGo:function(t){var n=g.index+t;return 0<=n&&n<g.entries.length},block:function(t){return void 0===t&&(t=!1),h.setPrompt(t)},listen:function(t){return h.appendListener(t)}};return g}exports.createBrowserHistory=createBrowserHistory,exports.createHashHistory=createHashHistory,exports.createMemoryHistory=createMemoryHistory,exports.createLocation=createLocation,exports.locationsAreEqual=locationsAreEqual,exports.parsePath=parsePath,exports.createPath=createPath;

//# sourceMappingURL=node_modules/react-router/node_modules/history/cjs/history.min.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-router/node_modules/history/cjs/history.min.js",}],
[3106, {"resolve-pathname":3162,"tiny-invariant":3388,"tiny-warning":3389,"value-equal":3468}, function (require, module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var resolvePathname = _interopDefault(require('resolve-pathname'));
var valueEqual = _interopDefault(require('value-equal'));
var warning = _interopDefault(require('tiny-warning'));
var invariant = _interopDefault(require('tiny-invariant'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}
function hasBasename(path, prefix) {
  return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
    warning(prompt == null, 'A history supports only one prompt at a time');
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
          warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ? invariant(false, 'Browser history needs a DOM') : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
    warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
        warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

var HashChangeEvent$1 = 'hashchange';
var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

function stripHash(url) {
  var hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}

function pushHashPath(path) {
  window.location.hash = path;
}

function replaceHashPath(path) {
  window.location.replace(stripHash(window.location.href) + '#' + path);
}

function createHashHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ? invariant(false, 'Hash history needs a DOM') : void 0;
  var globalHistory = window.history;
  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
  var _props = props,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$hashType = _props.hashType,
      hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;

  function getDOMLocation() {
    var path = decodePath(getHashPath());
    warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
    if (basename) path = stripBasename(path, basename);
    return createLocation(path);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  var forceNextPop = false;
  var ignorePath = null;

  function locationsAreEqual$$1(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
  }

  function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;
      if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

      ignorePath = null;
      handlePop(location);
    }
  }

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  } // Ensure the hash is encoded properly before doing anything else.


  var path = getHashPath();
  var encodedPath = encodePath(path);
  if (path !== encodedPath) replaceHashPath(encodedPath);
  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)]; // Public interface

  function createHref(location) {
    var baseTag = document.querySelector('base');
    var href = '';

    if (baseTag && baseTag.getAttribute('href')) {
      href = stripHash(window.location.href);
    }

    return href + '#' + encodePath(basename + createPath(location));
  }

  function push(path, state) {
    warning(state === undefined, 'Hash history cannot push state; it is ignored');
    var action = 'PUSH';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);
        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
        var nextPaths = allPaths.slice(0, prevIndex + 1);
        nextPaths.push(path);
        allPaths = nextPaths;
        setState({
          action: action,
          location: location
        });
      } else {
        warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
        setState();
      }
    });
  }

  function replace(path, state) {
    warning(state === undefined, 'Hash history cannot replace state; it is ignored');
    var action = 'REPLACE';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf(createPath(history.location));
      if (prevIndex !== -1) allPaths[prevIndex] = path;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent$1, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent$1, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
/**
 * Creates a history object that stores locations in memory.
 */


function createMemoryHistory(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      getUserConfirmation = _props.getUserConfirmation,
      _props$initialEntries = _props.initialEntries,
      initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
      _props$initialIndex = _props.initialIndex,
      initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var transitionManager = createTransitionManager();

  function setState(nextState) {
    _extends(history, nextState);

    history.length = history.entries.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function (entry) {
    return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
  }); // Public interface

  var createHref = createPath;

  function push(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var prevIndex = history.index;
      var nextIndex = prevIndex + 1;
      var nextEntries = history.entries.slice(0);

      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }

      setState({
        action: action,
        location: location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  }

  function replace(path, state) {
    warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      history.entries[history.index] = location;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
    var action = 'POP';
    var location = history.entries[nextIndex];
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (ok) {
        setState({
          action: action,
          location: location,
          index: nextIndex
        });
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState();
      }
    });
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function canGo(n) {
    var nextIndex = history.index + n;
    return nextIndex >= 0 && nextIndex < history.entries.length;
  }

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    return transitionManager.setPrompt(prompt);
  }

  function listen(listener) {
    return transitionManager.appendListener(listener);
  }

  var history = {
    length: entries.length,
    action: 'POP',
    location: entries[index],
    index: index,
    entries: entries,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    canGo: canGo,
    block: block,
    listen: listen
  };
  return history;
}

exports.createBrowserHistory = createBrowserHistory;
exports.createHashHistory = createHashHistory;
exports.createMemoryHistory = createMemoryHistory;
exports.createLocation = createLocation;
exports.locationsAreEqual = locationsAreEqual;
exports.parsePath = parsePath;
exports.createPath = createPath;

//# sourceMappingURL=node_modules/react-router/node_modules/history/cjs/history.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-router/node_modules/history/cjs/history.js",}],
[2875, {}, function (require, module, exports) {
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

//# sourceMappingURL=node_modules/path-to-regexp/node_modules/isarray/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/path-to-regexp/node_modules/isarray/index.js",}],
[1895, {}, function (require, module, exports) {
(function (global){
// @flow
'use strict';

var key = '__global_unique_id__';

module.exports = function() {
  return global[key] = (global[key] || 0) + 1;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/gud/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/gud/index.js",}],
[3160, {}, function (require, module, exports) {
'use strict';

function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to, from) {
  if (from === undefined) from = '';

  var toParts = (to && to.split('/')) || [];
  var fromParts = (from && from.split('/')) || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  )
    fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

module.exports = resolvePathname;

//# sourceMappingURL=node_modules/resolve-pathname/cjs/resolve-pathname.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/resolve-pathname/cjs/resolve-pathname.js",}],
[3161, {}, function (require, module, exports) {
"use strict";function isAbsolute(e){return"/"===e.charAt(0)}function spliceOne(e,t){for(var s=t,n=s+1,i=e.length;n<i;s+=1,n+=1)e[s]=e[n];e.pop()}function resolvePathname(e,t){void 0===t&&(t="");var s,n=e&&e.split("/")||[],i=t&&t.split("/")||[],l=e&&isAbsolute(e),r=t&&isAbsolute(t),o=l||r;if(e&&isAbsolute(e)?i=n:n.length&&(i.pop(),i=i.concat(n)),!i.length)return"/";if(i.length){var u=i[i.length-1];s="."===u||".."===u||""===u}else s=!1;for(var a=0,c=i.length;0<=c;c--){var f=i[c];"."===f?spliceOne(i,c):".."===f?(spliceOne(i,c),a++):a&&(spliceOne(i,c),a--)}if(!o)for(;a--;a)i.unshift("..");!o||""===i[0]||i[0]&&isAbsolute(i[0])||i.unshift("");var h=i.join("/");return s&&"/"!==h.substr(-1)&&(h+="/"),h}module.exports=resolvePathname;

//# sourceMappingURL=node_modules/resolve-pathname/cjs/resolve-pathname.min.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/resolve-pathname/cjs/resolve-pathname.min.js",}],
[3466, {}, function (require, module, exports) {
'use strict';

function valueOf(obj) {
  return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
}

function valueEqual(a, b) {
  // Test for strict equality first.
  if (a === b) return true;

  // Otherwise, if either of them == null they are not equal.
  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every(function(item, index) {
        return valueEqual(item, b[index]);
      })
    );
  }

  if (typeof a === 'object' || typeof b === 'object') {
    var aValue = valueOf(a);
    var bValue = valueOf(b);

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    return Object.keys(Object.assign({}, a, b)).every(function(key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

module.exports = valueEqual;

//# sourceMappingURL=node_modules/value-equal/cjs/value-equal.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/value-equal/cjs/value-equal.js",}],
[3467, {}, function (require, module, exports) {
"use strict";function valueOf(e){return e.valueOf?e.valueOf():Object.prototype.valueOf.call(e)}function valueEqual(u,r){if(u===r)return!0;if(null==u||null==r)return!1;if(Array.isArray(u))return Array.isArray(r)&&u.length===r.length&&u.every(function(e,u){return valueEqual(e,r[u])});if("object"!=typeof u&&"object"!=typeof r)return!1;var e=valueOf(u),t=valueOf(r);return e!==u||t!==r?valueEqual(e,t):Object.keys(Object.assign({},u,r)).every(function(e){return valueEqual(u[e],r[e])})}module.exports=valueEqual;

//# sourceMappingURL=node_modules/value-equal/cjs/value-equal.min.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/value-equal/cjs/value-equal.min.js",}],
[4177, {"../../components/ui/loading-screen":3906,"../../helpers/constants/routes":3995,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _loadingScreen = _interopRequireDefault(require("../../components/ui/loading-screen"));

var _routes = require("../../helpers/constants/routes");

class Lock extends _react.PureComponent {
  componentDidMount() {
    const {
      lockMetamask,
      isUnlocked,
      history
    } = this.props;

    if (isUnlocked) {
      lockMetamask().then(() => history.push(_routes.DEFAULT_ROUTE));
    } else {
      history.replace(_routes.DEFAULT_ROUTE);
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_loadingScreen.default, null);
  }

}

exports.default = Lock;
(0, _defineProperty2.default)(Lock, "propTypes", {
  history: _propTypes.default.object,
  isUnlocked: _propTypes.default.bool,
  lockMetamask: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/lock/lock.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/lock/lock.component.js",}],
[4180, {"../../../shared/constants/time":3598,"../../components/ui/button":3842,"../../components/ui/loading-screen":3906,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"pubnub":2920,"qrcode-generator":2993,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _pubnub = _interopRequireDefault(require("pubnub"));

var _qrcodeGenerator = _interopRequireDefault(require("qrcode-generator"));

var _button = _interopRequireDefault(require("../../components/ui/button"));

var _loadingScreen = _interopRequireDefault(require("../../components/ui/loading-screen"));

var _time = require("../../../shared/constants/time");

const PASSWORD_PROMPT_SCREEN = 'PASSWORD_PROMPT_SCREEN';
const REVEAL_SEED_SCREEN = 'REVEAL_SEED_SCREEN';
const KEYS_GENERATION_TIME = _time.SECOND * 30;
const IDLE_TIME = _time.MINUTE * 2;

class MobileSyncPage extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      screen: PASSWORD_PROMPT_SCREEN,
      password: '',
      seedWords: null,
      importedAccounts: [],
      error: null,
      syncing: false,
      completed: false,
      channelName: undefined,
      cipherKey: undefined
    });
    (0, _defineProperty2.default)(this, "syncing", false);
  }

  componentDidMount() {
    const passwordBox = document.getElementById('password-box');

    if (passwordBox) {
      passwordBox.focus();
    }
  }

  startIdleTimeout() {
    this.idleTimeout = setTimeout(() => {
      this.clearTimeouts();
      this.goBack();
    }, IDLE_TIME);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      seedWords: null,
      error: null
    });
    this.props.requestRevealSeedWords(this.state.password).then(seedWords => {
      this.startKeysGeneration();
      this.startIdleTimeout();
      this.exportAccounts().then(importedAccounts => {
        this.setState({
          seedWords,
          importedAccounts,
          screen: REVEAL_SEED_SCREEN
        });
      });
    }).catch(error => this.setState({
      error: error.message
    }));
  }

  async exportAccounts() {
    const addresses = [];
    this.props.keyrings.forEach(keyring => {
      if (keyring.type === 'Simple Key Pair') {
        addresses.push(keyring.accounts[0]);
      }
    });
    const importedAccounts = await this.props.exportAccounts(this.state.password, addresses);
    return importedAccounts;
  }

  startKeysGeneration() {
    this.keysGenerationTimeout && clearTimeout(this.keysGenerationTimeout);
    this.disconnectWebsockets();
    this.generateCipherKeyAndChannelName();
    this.initWebsockets();
    this.keysGenerationTimeout = setTimeout(() => {
      this.startKeysGeneration();
    }, KEYS_GENERATION_TIME);
  }

  goBack() {
    const {
      history,
      mostRecentOverviewPage
    } = this.props;
    history.push(mostRecentOverviewPage);
  }

  clearTimeouts() {
    this.keysGenerationTimeout && clearTimeout(this.keysGenerationTimeout);
    this.idleTimeout && clearTimeout(this.idleTimeout);
  }

  generateCipherKeyAndChannelName() {
    this.cipherKey = `${this.props.selectedAddress.substr(-4)}-${_pubnub.default.generateUUID()}`;
    this.channelName = `mm-${_pubnub.default.generateUUID()}`;
    this.setState({
      cipherKey: this.cipherKey,
      channelName: this.channelName
    });
  }

  initWithCipherKeyAndChannelName(cipherKey, channelName) {
    this.cipherKey = cipherKey;
    this.channelName = channelName;
  }

  initWebsockets() {
    // Make sure there are no existing listeners
    this.disconnectWebsockets();
    this.pubnub = new _pubnub.default({
      subscribeKey: "",
      publishKey: "",
      cipherKey: this.cipherKey,
      ssl: true
    });
    this.pubnubListener = {
      message: data => {
        const {
          channel,
          message
        } = data; // handle message

        if (channel !== this.channelName || !message) {
          return;
        }

        if (message.event === 'start-sync') {
          this.startSyncing();
        } else if (message.event === 'connection-info') {
          this.keysGenerationTimeout && clearTimeout(this.keysGenerationTimeout);
          this.disconnectWebsockets();
          this.initWithCipherKeyAndChannelName(message.cipher, message.channel);
          this.initWebsockets();
        } else if (message.event === 'end-sync') {
          this.disconnectWebsockets();
          this.setState({
            syncing: false,
            completed: true
          });
        }
      }
    };
    this.pubnub.addListener(this.pubnubListener);
    this.pubnub.subscribe({
      channels: [this.channelName],
      withPresence: false
    });
  }

  disconnectWebsockets() {
    if (this.pubnub && this.pubnubListener) {
      this.pubnub.removeListener(this.pubnubListener);
    }
  } // Calculating a PubNub Message Payload Size.


  calculatePayloadSize(channel, message) {
    return encodeURIComponent(channel + JSON.stringify(message)).length + 100;
  }

  chunkString(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);
    let o = 0;

    for (let i = 0; i < numChunks; i += 1) {
      chunks[i] = str.substr(o, size);
      o += size;
    }

    return chunks;
  }

  notifyError(errorMsg) {
    return new Promise((resolve, reject) => {
      this.pubnub.publish({
        message: {
          event: 'error-sync',
          data: errorMsg
        },
        channel: this.channelName,
        sendByPost: false,
        // true to send via post
        storeInHistory: false
      }, (status, _response) => {
        if (status.error) {
          reject(status.errorData);
        } else {
          resolve();
        }
      });
    });
  }

  async startSyncing() {
    if (this.syncing) {
      return;
    }

    this.syncing = true;
    this.setState({
      syncing: true
    });
    const {
      accounts,
      network,
      preferences,
      transactions,
      tokens
    } = await this.props.fetchInfoToSync();
    const {
      t
    } = this.context;
    const allDataStr = JSON.stringify({
      accounts,
      network,
      preferences,
      transactions,
      tokens,
      udata: {
        pwd: this.state.password,
        seed: this.state.seedWords,
        importedAccounts: this.state.importedAccounts
      }
    });
    const chunks = this.chunkString(allDataStr, 17000);
    const totalChunks = chunks.length;

    try {
      for (let i = 0; i < totalChunks; i++) {
        await this.sendMessage(chunks[i], i + 1, totalChunks);
      }
    } catch (e) {
      this.props.displayWarning(`${t('syncFailed')} :(`);
      this.setState({
        syncing: false
      });
      this.syncing = false;
      this.notifyError(e.toString());
    }
  }

  sendMessage(data, pkg, count) {
    return new Promise((resolve, reject) => {
      this.pubnub.publish({
        message: {
          event: 'syncing-data',
          data,
          totalPkg: count,
          currentPkg: pkg
        },
        channel: this.channelName,
        sendByPost: false,
        // true to send via post
        storeInHistory: false
      }, (status, _response) => {
        if (status.error) {
          reject(status.errorData);
        } else {
          resolve();
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.state.error) {
      this.props.hideWarning();
    }

    this.clearTimeouts();
    this.disconnectWebsockets();
  }

  renderWarning(text) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__warning-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__warning-message"
    }, /*#__PURE__*/_react.default.createElement("div", null, text)));
  }

  renderContent() {
    const {
      syncing,
      completed,
      screen
    } = this.state;
    const {
      t
    } = this.context;

    if (syncing) {
      return /*#__PURE__*/_react.default.createElement(_loadingScreen.default, {
        loadingMessage: t('syncInProgress')
      });
    }

    if (completed) {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "reveal-seed__content"
      }, /*#__PURE__*/_react.default.createElement("label", {
        className: "reveal-seed__label",
        style: {
          width: '100%',
          textAlign: 'center'
        }
      }, t('syncWithMobileComplete')));
    }

    return screen === PASSWORD_PROMPT_SCREEN ? /*#__PURE__*/_react.default.createElement("div", null, this.renderWarning(this.context.t('mobileSyncWarning'))) : /*#__PURE__*/_react.default.createElement("div", null, this.renderWarning(this.context.t('syncWithMobileBeCareful')), /*#__PURE__*/_react.default.createElement("div", {
      className: "reveal-seed__content"
    }, this.renderRevealSeedContent()));
  }

  renderPasswordPromptContent() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("form", {
      onSubmit: event => this.handleSubmit(event)
    }, /*#__PURE__*/_react.default.createElement("label", {
      className: "input-label",
      htmlFor: "password-box"
    }, t('enterPasswordContinue')), /*#__PURE__*/_react.default.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/_react.default.createElement("input", {
      type: "password",
      placeholder: t('password'),
      id: "password-box",
      value: this.state.password,
      onChange: event => this.setState({
        password: event.target.value
      }),
      className: (0, _classnames.default)('form-control', {
        'form-control--error': this.state.error
      })
    })), this.state.error && /*#__PURE__*/_react.default.createElement("div", {
      className: "reveal-seed__error"
    }, this.state.error));
  }

  renderRevealSeedContent() {
    const qrImage = (0, _qrcodeGenerator.default)(0, 'M');
    qrImage.addData(`metamask-sync:${this.state.channelName}|@|${this.state.cipherKey}`);
    qrImage.make();
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("label", {
      className: "reveal-seed__label",
      style: {
        width: '100%',
        textAlign: 'center'
      }
    }, t('syncWithMobileScanThisCode')), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center'
      },
      dangerouslySetInnerHTML: {
        __html: qrImage.createTableTag(4)
      }
    }));
  }

  renderFooter() {
    return this.state.screen === PASSWORD_PROMPT_SCREEN ? this.renderPasswordPromptFooter() : this.renderRevealSeedFooter();
  }

  renderPasswordPromptFooter() {
    const {
      t
    } = this.context;
    const {
      password
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form__buttons",
      style: {
        padding: 30,
        marginTop: 0
      }
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "new-account-create-form__button",
      onClick: () => this.goBack()
    }, t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      large: true,
      className: "new-account-create-form__button",
      onClick: event => this.handleSubmit(event),
      disabled: password === ''
    }, t('next')));
  }

  renderRevealSeedFooter() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__footer",
      style: {
        padding: 30
      }
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "page-container__footer-button",
      onClick: () => this.goBack()
    }, t('close')));
  }

  render() {
    const {
      t
    } = this.context;
    const {
      screen
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__title"
    }, t('syncWithMobileTitle')), screen === PASSWORD_PROMPT_SCREEN ? /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__subtitle"
    }, t('syncWithMobileDesc')) : null, screen === PASSWORD_PROMPT_SCREEN ? /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__subtitle"
    }, t('syncWithMobileDescNewUsers')) : null), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__content"
    }, this.renderContent()), this.renderFooter());
  }

}

exports.default = MobileSyncPage;
(0, _defineProperty2.default)(MobileSyncPage, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(MobileSyncPage, "propTypes", {
  history: _propTypes.default.object.isRequired,
  selectedAddress: _propTypes.default.string.isRequired,
  displayWarning: _propTypes.default.func.isRequired,
  fetchInfoToSync: _propTypes.default.func.isRequired,
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  requestRevealSeedWords: _propTypes.default.func.isRequired,
  exportAccounts: _propTypes.default.func.isRequired,
  keyrings: _propTypes.default.array,
  hideWarning: _propTypes.default.func.isRequired
});

//# sourceMappingURL=ui/pages/mobile-sync/mobile-sync.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/mobile-sync/mobile-sync.component.js",}],
[4072, {"../../components/ui/button":3842,"../../components/ui/identicon":3895,"../../components/ui/token-balance":3955,"../../helpers/constants/routes":3995,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _routes = require("../../helpers/constants/routes");

var _button = _interopRequireDefault(require("../../components/ui/button"));

var _identicon = _interopRequireDefault(require("../../components/ui/identicon"));

var _tokenBalance = _interopRequireDefault(require("../../components/ui/token-balance"));

class ConfirmImportToken extends _react.Component {
  componentDidMount() {
    const {
      mostRecentOverviewPage,
      pendingTokens = {},
      history
    } = this.props;

    if (Object.keys(pendingTokens).length === 0) {
      history.push(mostRecentOverviewPage);
    }
  }

  getTokenName(name, symbol) {
    return typeof name === 'undefined' ? symbol : `${name} (${symbol})`;
  }

  render() {
    const {
      history,
      addTokens,
      clearPendingTokens,
      mostRecentOverviewPage,
      pendingTokens
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__title"
    }, this.context.t('importTokensCamelCase')), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__subtitle"
    }, this.context.t('likeToImportTokens'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__token"
    }, this.context.t('token')), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__balance"
    }, this.context.t('balance'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__token-list"
    }, Object.entries(pendingTokens).map(([address, token]) => {
      const {
        name,
        symbol
      } = token;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__token-list-item",
        key: address
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__token confirm-import-token__data"
      }, /*#__PURE__*/_react.default.createElement(_identicon.default, {
        className: "confirm-import-token__token-icon",
        diameter: 48,
        address: address
      }), /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__name"
      }, this.getTokenName(name, symbol))), /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__balance"
      }, /*#__PURE__*/_react.default.createElement(_tokenBalance.default, {
        token: token
      })));
    })))), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__footer"
    }, /*#__PURE__*/_react.default.createElement("footer", null, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "page-container__footer-button",
      onClick: () => history.push(_routes.IMPORT_TOKEN_ROUTE)
    }, this.context.t('back')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      large: true,
      className: "page-container__footer-button",
      onClick: () => {
        addTokens(pendingTokens).then(() => {
          var _pendingTokenValues$;

          const pendingTokenValues = Object.values(pendingTokens);
          pendingTokenValues.forEach(pendingToken => {
            this.context.trackEvent({
              event: 'Token Added',
              category: 'Wallet',
              sensitiveProperties: {
                token_symbol: pendingToken.symbol,
                token_contract_address: pendingToken.address,
                token_decimal_precision: pendingToken.decimals,
                unlisted: pendingToken.unlisted,
                source: pendingToken.isCustom ? 'custom' : 'list'
              }
            });
          });
          clearPendingTokens();
          const firstTokenAddress = pendingTokenValues === null || pendingTokenValues === void 0 ? void 0 : (_pendingTokenValues$ = pendingTokenValues[0].address) === null || _pendingTokenValues$ === void 0 ? void 0 : _pendingTokenValues$.toLowerCase();

          if (firstTokenAddress) {
            history.push(`${_routes.ASSET_ROUTE}/${firstTokenAddress}`);
          } else {
            history.push(mostRecentOverviewPage);
          }
        });
      }
    }, this.context.t('importTokensCamelCase')))));
  }

}

exports.default = ConfirmImportToken;
(0, _defineProperty2.default)(ConfirmImportToken, "contextTypes", {
  t: _propTypes.default.func,
  trackEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(ConfirmImportToken, "propTypes", {
  history: _propTypes.default.object,
  clearPendingTokens: _propTypes.default.func,
  addTokens: _propTypes.default.func,
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  pendingTokens: _propTypes.default.object
});

//# sourceMappingURL=ui/pages/confirm-import-token/confirm-import-token.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-import-token/confirm-import-token.component.js",}],
[3997, {"../../constants/routes":3995,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Authenticated;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _routes = require("../../constants/routes");

function Authenticated(props) {
  const {
    isUnlocked,
    completedOnboarding
  } = props;

  switch (true) {
    case isUnlocked && completedOnboarding:
      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, props);

    case !completedOnboarding:
      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.INITIALIZE_ROUTE
        }
      });

    default:
      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.UNLOCK_ROUTE
        }
      });
  }
}

Authenticated.propTypes = {
  isUnlocked: _propTypes.default.bool,
  completedOnboarding: _propTypes.default.bool
};

//# sourceMappingURL=ui/helpers/higher-order-components/authenticated/authenticated.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/authenticated/authenticated.component.js",}],
[4002, {"../../constants/routes":3995,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Initialized;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _routes = require("../../constants/routes");

function Initialized(props) {
  return props.completedOnboarding ? /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, props) : /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
    to: {
      pathname: _routes.INITIALIZE_ROUTE
    }
  });
}

Initialized.propTypes = {
  completedOnboarding: _propTypes.default.bool
};

//# sourceMappingURL=ui/helpers/higher-order-components/initialized/initialized.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/initialized/initialized.component.js",}],
[3689, {"../../../../shared/constants/time":3598,"../../ui/button":3842,"../../ui/loading-screen":3906,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _button = _interopRequireDefault(require("../../ui/button"));

var _loadingScreen = _interopRequireDefault(require("../../ui/loading-screen"));

var _time = require("../../../../shared/constants/time");

class LoadingNetworkScreen extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      showErrorScreen: false
    });
    (0, _defineProperty2.default)(this, "componentDidMount", () => {
      this.cancelCallTimeout = setTimeout(this.cancelCall, this.props.cancelTime || _time.SECOND * 15);
    });
    (0, _defineProperty2.default)(this, "getConnectingLabel", function (loadingMessage) {
      if (loadingMessage) {
        return loadingMessage;
      }

      const {
        provider,
        providerId
      } = this.props;
      const providerName = provider.type;
      let name;

      if (providerName === 'mainnet') {
        name = this.context.t('connectingToMainnet');
      } else if (providerName === 'ropsten') {
        name = this.context.t('connectingToRopsten');
      } else if (providerName === 'kovan') {
        name = this.context.t('connectingToKovan');
      } else if (providerName === 'rinkeby') {
        name = this.context.t('connectingToRinkeby');
      } else if (providerName === 'goerli') {
        name = this.context.t('connectingToGoerli');
      } else if (providerName === 'monsta') {
        name = this.context.t('connectingToMonsta');
      } else {
        name = this.context.t('connectingTo', [providerId]);
      }

      return name;
    });
    (0, _defineProperty2.default)(this, "renderErrorScreenContent", () => {
      const {
        showNetworkDropdown,
        setProviderArgs,
        setProviderType
      } = this.props;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "loading-overlay__error-screen"
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "loading-overlay__emoji"
      }, "\uD83D\uDE1E"), /*#__PURE__*/_react.default.createElement("span", null, this.context.t('somethingWentWrong')), /*#__PURE__*/_react.default.createElement("div", {
        className: "loading-overlay__error-buttons"
      }, /*#__PURE__*/_react.default.createElement(_button.default, {
        type: "default",
        onClick: () => {
          window.clearTimeout(this.cancelCallTimeout);
          showNetworkDropdown();
        }
      }, this.context.t('switchNetworks')), /*#__PURE__*/_react.default.createElement(_button.default, {
        type: "primary",
        onClick: () => {
          this.setState({
            showErrorScreen: false
          });
          setProviderType(...setProviderArgs);
          window.clearTimeout(this.cancelCallTimeout);
          this.cancelCallTimeout = setTimeout(this.cancelCall, this.props.cancelTime || _time.SECOND * 15);
        }
      }, this.context.t('tryAgain'))));
    });
    (0, _defineProperty2.default)(this, "cancelCall", () => {
      const {
        isNetworkLoading
      } = this.props;

      if (isNetworkLoading) {
        this.setState({
          showErrorScreen: true
        });
      }
    });
    (0, _defineProperty2.default)(this, "componentDidUpdate", prevProps => {
      const {
        provider
      } = this.props;
      const {
        provider: prevProvider
      } = prevProps;

      if (provider.type !== prevProvider.type) {
        window.clearTimeout(this.cancelCallTimeout);
        this.setState({
          showErrorScreen: false
        });
        this.cancelCallTimeout = setTimeout(this.cancelCall, this.props.cancelTime || _time.SECOND * 15);
      }
    });
    (0, _defineProperty2.default)(this, "componentWillUnmount", () => {
      window.clearTimeout(this.cancelCallTimeout);
    });
  }

  render() {
    const {
      rollbackToPreviousProvider
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_loadingScreen.default, {
      header: /*#__PURE__*/_react.default.createElement("div", {
        className: "page-container__header-close",
        onClick: rollbackToPreviousProvider
      }),
      showLoadingSpinner: !this.state.showErrorScreen,
      loadingMessage: this.state.showErrorScreen ? this.renderErrorScreenContent() : this.getConnectingLabel(this.props.loadingMessage)
    });
  }

}

exports.default = LoadingNetworkScreen;
(0, _defineProperty2.default)(LoadingNetworkScreen, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(LoadingNetworkScreen, "propTypes", {
  loadingMessage: _propTypes.default.string,
  cancelTime: _propTypes.default.number,
  provider: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]),
  providerId: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  showNetworkDropdown: _propTypes.default.func,
  setProviderArgs: _propTypes.default.array,
  setProviderType: _propTypes.default.func,
  rollbackToPreviousProvider: _propTypes.default.func,
  isNetworkLoading: _propTypes.default.bool
});

//# sourceMappingURL=ui/components/app/loading-network-screen/loading-network-screen.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/loading-network-screen/loading-network-screen.component.js",}],
[3841, {"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

const CLASSNAME_DEFAULT = 'btn-default';
const CLASSNAME_PRIMARY = 'btn-primary';
const CLASSNAME_SECONDARY = 'btn-secondary';
const CLASSNAME_CONFIRM = 'btn-primary';
const CLASSNAME_RAISED = 'btn-raised';
const CLASSNAME_LARGE = 'btn--large';
const CLASSNAME_ROUNDED = 'btn--rounded';
const CLASSNAME_FIRST_TIME = 'btn--first-time';
const typeHash = {
  'default': CLASSNAME_DEFAULT,
  'primary': CLASSNAME_PRIMARY,
  'secondary': CLASSNAME_SECONDARY,
  'warning': 'btn-warning',
  'danger': 'btn-danger',
  'danger-primary': 'btn-danger-primary',
  'link': 'btn-link',
  // TODO: Legacy button type to be deprecated
  'confirm': CLASSNAME_CONFIRM,
  'raised': CLASSNAME_RAISED,
  'first-time': CLASSNAME_FIRST_TIME
};

const Button = (_ref) => {
  let {
    type,
    submit,
    large,
    children,
    icon,
    rounded,
    className
  } = _ref,
      buttonProps = (0, _objectWithoutProperties2.default)(_ref, ["type", "submit", "large", "children", "icon", "rounded", "className"]);
  // To support using the Button component to render styled links that are semantic html
  // we swap the html tag we use to render this component and delete any buttonProps that
  // we know to be erroneous attributes for a link. We will likely want to extract Link
  // to its own component in the future.
  let Tag = 'button';

  if (type === 'link') {
    Tag = 'a';
  } else if (submit) {
    buttonProps.type = 'submit';
  }

  if (typeof buttonProps.onClick === 'function') {
    var _buttonProps$onKeyUp, _buttonProps$role, _buttonProps$tabIndex;

    (_buttonProps$onKeyUp = buttonProps.onKeyUp) !== null && _buttonProps$onKeyUp !== void 0 ? _buttonProps$onKeyUp : buttonProps.onKeyUp = event => {
      if (event.key === 'Enter') {
        buttonProps.onClick();
      }
    };
    (_buttonProps$role = buttonProps.role) !== null && _buttonProps$role !== void 0 ? _buttonProps$role : buttonProps.role = 'button';
    (_buttonProps$tabIndex = buttonProps.tabIndex) !== null && _buttonProps$tabIndex !== void 0 ? _buttonProps$tabIndex : buttonProps.tabIndex = 0;
  }

  return /*#__PURE__*/_react.default.createElement(Tag, (0, _extends2.default)({
    className: (0, _classnames.default)('button', typeHash[type] || CLASSNAME_DEFAULT, large && CLASSNAME_LARGE, rounded && CLASSNAME_ROUNDED, className)
  }, buttonProps), icon && /*#__PURE__*/_react.default.createElement("span", {
    className: "button__icon"
  }, icon), children);
};

Button.propTypes = {
  type: _propTypes.default.string,
  submit: _propTypes.default.bool,
  large: _propTypes.default.bool,
  rounded: _propTypes.default.bool,
  className: _propTypes.default.string,
  children: _propTypes.default.node,
  icon: _propTypes.default.node
};
Button.defaultProps = {
  submit: false
};
var _default = Button;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/button/button.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/button/button.component.js",}],
[3867, {"../../../helpers/utils/util":4020,"../../../hooks/useCopyToClipboard":4023,"../../../hooks/useI18nContext":4030,"../icon/copy-icon.component":3880,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _util = require("../../../helpers/utils/util");

var _copyIcon = _interopRequireDefault(require("../icon/copy-icon.component"));

var _useI18nContext = require("../../../hooks/useI18nContext");

var _useCopyToClipboard = require("../../../hooks/useCopyToClipboard");

function ExportTextContainer({
  text = ''
}) {
  const t = (0, _useI18nContext.useI18nContext)();
  const [copied, handleCopy] = (0, _useCopyToClipboard.useCopyToClipboard)();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container__text-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container__text notranslate"
  }, text)), /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container__buttons-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container__button export-text-container__button--copy",
    onClick: () => {
      handleCopy(text);
    }
  }, /*#__PURE__*/_react.default.createElement(_copyIcon.default, {
    size: 17,
    color: "#3098DC"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container__button-text"
  }, copied ? t('copiedExclamation') : t('copyToClipboard'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container__button",
    onClick: () => (0, _util.exportAsFile)('', text)
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: "images/download.svg",
    alt: ""
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "export-text-container__button-text"
  }, t('saveAsCsvFile')))));
}

ExportTextContainer.propTypes = {
  text: _propTypes.default.string
};

var _default = /*#__PURE__*/_react.default.memo(ExportTextContainer);

exports.default = _default;

//# sourceMappingURL=ui/components/ui/export-text-container/export-text-container.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/export-text-container/export-text-container.component.js",}],
[3943, {"./spinner.component":3944,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spinner = _interopRequireDefault(require("./spinner.component"));

var _default = _spinner.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/spinner/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/spinner/index.js",}],
[3623, {"../../../helpers/constants/routes":3995,"../../ui/identicon":3895,"../../ui/metafox-logo":3915,"../network-display":3760,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _identicon = _interopRequireDefault(require("../../ui/identicon"));

var _metafoxLogo = _interopRequireDefault(require("../../ui/metafox-logo"));

var _routes = require("../../../helpers/constants/routes");

var _networkDisplay = _interopRequireDefault(require("../network-display"));

class AppHeader extends _react.PureComponent {
  handleNetworkIndicatorClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      networkDropdownOpen,
      showNetworkDropdown,
      hideNetworkDropdown,
      disabled,
      disableNetworkIndicator
    } = this.props;

    if (disabled || disableNetworkIndicator) {
      return;
    }

    if (networkDropdownOpen === false) {
      this.context.metricsEvent({
        eventOpts: {
          category: 'Navigation',
          action: 'Home',
          name: 'Opened Network Menu'
        }
      });
      showNetworkDropdown();
    } else {
      hideNetworkDropdown();
    }
  }

  renderAccountMenu() {
    const {
      isUnlocked,
      toggleAccountMenu,
      selectedAddress,
      disabled,
      isAccountMenuOpen,
      selectedAddressIndex
    } = this.props;
    return isUnlocked && /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('account-menu__icon', {
        'account-menu__icon--disabled': disabled
      }),
      onClick: () => {
        if (!disabled) {
          !isAccountMenuOpen && this.context.metricsEvent({
            eventOpts: {
              category: 'Navigation',
              action: 'Home',
              name: 'Opened Main Menu'
            }
          });
          toggleAccountMenu();
        }
      }
    }, /*#__PURE__*/_react.default.createElement(_identicon.default, {
      address: selectedAddress,
      diameter: 32,
      addBorder: true,
      image: `./images/monsta-accounts/(${1 + selectedAddressIndex % 10}).png`
    }));
  }

  render() {
    const {
      history,
      isUnlocked,
      hideNetworkIndicator,
      disableNetworkIndicator,
      disabled,
      onClick
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('app-header', {
        'app-header--back-drop': isUnlocked
      })
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "app-header__contents"
    }, /*#__PURE__*/_react.default.createElement(_metafoxLogo.default, {
      unsetIconHeight: true,
      onClick: async () => {
        if (onClick) {
          await onClick();
        }

        history.push(_routes.DEFAULT_ROUTE);
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "app-header__account-menu-container"
    }, !hideNetworkIndicator && /*#__PURE__*/_react.default.createElement("div", {
      className: "app-header__network-component-wrapper"
    }, /*#__PURE__*/_react.default.createElement(_networkDisplay.default, {
      colored: false,
      outline: true,
      onClick: event => this.handleNetworkIndicatorClick(event),
      disabled: disabled || disableNetworkIndicator
    })), this.renderAccountMenu())));
  }

}

exports.default = AppHeader;
(0, _defineProperty2.default)(AppHeader, "propTypes", {
  history: _propTypes.default.object,
  networkDropdownOpen: _propTypes.default.bool,
  showNetworkDropdown: _propTypes.default.func,
  hideNetworkDropdown: _propTypes.default.func,
  toggleAccountMenu: _propTypes.default.func,
  selectedAddress: _propTypes.default.string,
  isUnlocked: _propTypes.default.bool,
  hideNetworkIndicator: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  disableNetworkIndicator: _propTypes.default.bool,
  isAccountMenuOpen: _propTypes.default.bool,
  onClick: _propTypes.default.func
});
(0, _defineProperty2.default)(AppHeader, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});

//# sourceMappingURL=ui/components/app/app-header/app-header.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/app-header/app-header.component.js",}],
[4116, {"../../ducks/history/history":3982,"../../store/actions":4331,"./new-account.component":4115,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var actions = _interopRequireWildcard(require("../../store/actions"));

var _history = require("../../ducks/history/history");

var _newAccount = _interopRequireDefault(require("./new-account.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      identities = {}
    }
  } = state;
  const numberOfExistingAccounts = Object.keys(identities).length;
  const newAccountNumber = numberOfExistingAccounts + 1;
  return {
    newAccountNumber,
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createAccount: newAccountName => {
      return dispatch(actions.addNewAccount()).then(newAccountAddress => {
        if (newAccountName) {
          dispatch(actions.setAccountLabel(newAccountAddress, newAccountName));
        }
      });
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_newAccount.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/create-account/new-account.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/new-account.container.js",}],
[4111, {"../../../components/ui/dropdown":3862,"./json":4112,"./private-key":4113,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dropdown = _interopRequireDefault(require("../../../components/ui/dropdown"));

var _json = _interopRequireDefault(require("./json"));

var _privateKey = _interopRequireDefault(require("./private-key"));

// Subviews
class AccountImportSubview extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {});
  }

  getMenuItemTexts() {
    return [this.context.t('privateKey'), this.context.t('jsonFile')];
  }

  renderImportView() {
    const {
      type
    } = this.state;
    const menuItems = this.getMenuItemTexts();
    const current = type || menuItems[0];

    switch (current) {
      case this.context.t('privateKey'):
        return /*#__PURE__*/_react.default.createElement(_privateKey.default, null);

      case this.context.t('jsonFile'):
        return /*#__PURE__*/_react.default.createElement(_json.default, null);

      default:
        return /*#__PURE__*/_react.default.createElement(_json.default, null);
    }
  }

  render() {
    const menuItems = this.getMenuItemTexts();
    const {
      type
    } = this.state;
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__title"
    }, "Import Account"), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__subtitle"
    }, t('importAccountMsg'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form__select-section"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form__select-label"
    }, t('selectType')), /*#__PURE__*/_react.default.createElement(_dropdown.default, {
      className: "new-account-import-form__select",
      options: menuItems.map(text => ({
        value: text
      })),
      selectedOption: type || menuItems[0],
      onChange: value => {
        this.setState({
          type: value
        });
      }
    })), this.renderImportView()));
  }

}

exports.default = AccountImportSubview;
(0, _defineProperty2.default)(AccountImportSubview, "contextTypes", {
  t: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/create-account/import-account/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/import-account/index.js",}],
[4108, {"../../../../shared/constants/time":3598,"../../../ducks/history/history":3982,"../../../helpers/utils/util":4020,"../../../selectors":4326,"../../../store/actions":4331,"./account-list":4107,"./select-hardware":4109,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _selectors = require("../../../selectors");

var _util = require("../../../helpers/utils/util");

var _history = require("../../../ducks/history/history");

var _time = require("../../../../shared/constants/time");

var _selectHardware = _interopRequireDefault(require("./select-hardware"));

var _accountList = _interopRequireDefault(require("./account-list"));

const U2F_ERROR = 'U2F';
const LEDGER_LIVE_PATH = `m/44'/60'/0'/0/0`;
const MEW_PATH = `m/44'/60'/0'`;
const BIP44_PATH = `m/44'/60'/0'/0`;
const HD_PATHS = [{
  name: 'Ledger Live',
  value: LEDGER_LIVE_PATH
}, {
  name: 'Legacy (MEW / MyCrypto)',
  value: MEW_PATH
}, {
  name: `BIP44 Standard (e.g. MetaMask, Trezor)`,
  value: BIP44_PATH
}];

class ConnectHardwareForm extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      error: null,
      selectedAccounts: [],
      accounts: [],
      browserSupported: true,
      unlocked: false,
      device: null
    });
    (0, _defineProperty2.default)(this, "connectToHardwareWallet", device => {
      this.setState({
        device
      });

      if (this.state.accounts.length) {
        return;
      } // Default values


      this.getPage(device, 0, this.props.defaultHdPaths[device]);
    });
    (0, _defineProperty2.default)(this, "onPathChange", path => {
      this.props.setHardwareWalletDefaultHdPath({
        device: this.state.device,
        path
      });
      this.setState({
        selectedAccounts: []
      });
      this.getPage(this.state.device, 0, path);
    });
    (0, _defineProperty2.default)(this, "onAccountChange", account => {
      let {
        selectedAccounts
      } = this.state;

      if (selectedAccounts.includes(account)) {
        selectedAccounts = selectedAccounts.filter(acc => account !== acc);
      } else {
        selectedAccounts.push(account);
      }

      this.setState({
        selectedAccounts,
        error: null
      });
    });
    (0, _defineProperty2.default)(this, "onAccountRestriction", () => {
      this.setState({
        error: this.context.t('ledgerAccountRestriction')
      });
    });
    (0, _defineProperty2.default)(this, "getPage", (device, page, hdPath) => {
      this.props.connectHardware(device, page, hdPath).then(accounts => {
        if (accounts.length) {
          // If we just loaded the accounts for the first time
          // (device previously locked) show the global alert
          if (this.state.accounts.length === 0 && !this.state.unlocked) {
            this.showTemporaryAlert();
          } // Map accounts with balances


          const newAccounts = accounts.map(account => {
            var _this$props$accounts$;

            const normalizedAddress = account.address.toLowerCase();
            const balanceValue = ((_this$props$accounts$ = this.props.accounts[normalizedAddress]) === null || _this$props$accounts$ === void 0 ? void 0 : _this$props$accounts$.balance) || null;
            account.balance = balanceValue ? (0, _util.formatBalance)(balanceValue, 6) : '...';
            return account;
          });
          this.setState({
            accounts: newAccounts,
            unlocked: true,
            device,
            error: null
          });
        }
      }).catch(e => {
        const errorMessage = typeof e === 'string' ? e : e.message;

        if (errorMessage === 'Window blocked') {
          this.setState({
            browserSupported: false,
            error: null
          });
        } else if (errorMessage.includes(U2F_ERROR)) {
          this.setState({
            error: U2F_ERROR
          });
        } else if (errorMessage === 'LEDGER_LOCKED' || errorMessage === 'LEDGER_WRONG_APP') {
          this.setState({
            error: this.context.t('ledgerLocked')
          });
        } else if (errorMessage.includes('timeout')) {
          this.setState({
            error: this.context.t('ledgerTimeout')
          });
        } else if (errorMessage !== 'Window closed' && errorMessage !== 'Popup closed') {
          this.setState({
            error: errorMessage
          });
        }
      });
    });
    (0, _defineProperty2.default)(this, "onForgetDevice", device => {
      this.props.forgetDevice(device).then(_ => {
        this.setState({
          error: null,
          selectedAccounts: [],
          accounts: [],
          unlocked: false
        });
      }).catch(e => {
        this.setState({
          error: e.message
        });
      });
    });
    (0, _defineProperty2.default)(this, "onUnlockAccounts", (device, path) => {
      const {
        history,
        mostRecentOverviewPage,
        unlockHardwareWalletAccounts
      } = this.props;
      const {
        selectedAccounts
      } = this.state;

      if (selectedAccounts.length === 0) {
        this.setState({
          error: this.context.t('accountSelectionRequired')
        });
      }

      const description = MEW_PATH === path ? this.context.t('hardwareWalletLegacyDescription') : '';
      return unlockHardwareWalletAccounts(selectedAccounts, device, path || null, description).then(_ => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Connected Hardware Wallet',
            name: `Connected Account with: ${device}`
          }
        });
        history.push(mostRecentOverviewPage);
      }).catch(e => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Connected Hardware Wallet',
            name: 'Error connecting hardware wallet'
          },
          customVariables: {
            error: e.message
          }
        });
        this.setState({
          error: e.message
        });
      });
    });
    (0, _defineProperty2.default)(this, "onCancel", () => {
      const {
        history,
        mostRecentOverviewPage
      } = this.props;
      history.push(mostRecentOverviewPage);
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      accounts
    } = nextProps;
    const newAccounts = this.state.accounts.map(a => {
      var _accounts$normalizedA;

      const normalizedAddress = a.address.toLowerCase();
      const balanceValue = ((_accounts$normalizedA = accounts[normalizedAddress]) === null || _accounts$normalizedA === void 0 ? void 0 : _accounts$normalizedA.balance) || null;
      a.balance = balanceValue ? (0, _util.formatBalance)(balanceValue, 6) : '...';
      return a;
    });
    this.setState({
      accounts: newAccounts
    });
  }

  componentDidMount() {
    this.checkIfUnlocked();
  }

  async checkIfUnlocked() {
    for (const device of ['trezor', 'ledger']) {
      const path = this.props.defaultHdPaths[device];
      const unlocked = await this.props.checkHardwareStatus(device, path);

      if (unlocked) {
        this.setState({
          unlocked: true
        });
        this.getPage(device, 0, path);
      }
    }
  }

  showTemporaryAlert() {
    this.props.showAlert(this.context.t('hardwareWalletConnected')); // Autohide the alert after 5 seconds

    setTimeout(_ => {
      this.props.hideAlert();
    }, _time.SECOND * 5);
  }

  renderError() {
    if (this.state.error === U2F_ERROR) {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "hw-connect__error"
      }, this.context.t('troubleConnectingToWallet', [this.state.device,
      /*#__PURE__*/
      // eslint-disable-next-line react/jsx-key
      _react.default.createElement("a", {
        href: "https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet",
        key: "hardware-connection-guide",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "hw-connect__link",
        style: {
          marginLeft: '5px',
          marginRight: '5px'
        }
      }, this.context.t('walletConnectionGuide'))]));
    }

    return this.state.error ? /*#__PURE__*/_react.default.createElement("span", {
      className: "hw-connect__error"
    }, this.state.error) : null;
  }

  renderContent() {
    if (!this.state.accounts.length) {
      return /*#__PURE__*/_react.default.createElement(_selectHardware.default, {
        connectToHardwareWallet: this.connectToHardwareWallet,
        browserSupported: this.state.browserSupported,
        useLedgerLive: this.props.useLedgerLive
      });
    }

    return /*#__PURE__*/_react.default.createElement(_accountList.default, {
      onPathChange: this.onPathChange,
      selectedPath: this.props.defaultHdPaths[this.state.device],
      device: this.state.device,
      accounts: this.state.accounts,
      connectedAccounts: this.props.connectedAccounts,
      selectedAccounts: this.state.selectedAccounts,
      onAccountChange: this.onAccountChange,
      chainId: this.props.chainId,
      rpcPrefs: this.props.rpcPrefs,
      getPage: this.getPage,
      onUnlockAccounts: this.onUnlockAccounts,
      onForgetDevice: this.onForgetDevice,
      onCancel: this.onCancel,
      onAccountRestriction: this.onAccountRestriction,
      hdPaths: HD_PATHS
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, this.renderError(), this.renderContent());
  }

}

ConnectHardwareForm.propTypes = {
  connectHardware: _propTypes.default.func,
  checkHardwareStatus: _propTypes.default.func,
  forgetDevice: _propTypes.default.func,
  showAlert: _propTypes.default.func,
  hideAlert: _propTypes.default.func,
  unlockHardwareWalletAccounts: _propTypes.default.func,
  setHardwareWalletDefaultHdPath: _propTypes.default.func,
  history: _propTypes.default.object,
  chainId: _propTypes.default.string,
  rpcPrefs: _propTypes.default.object,
  accounts: _propTypes.default.object,
  connectedAccounts: _propTypes.default.array.isRequired,
  defaultHdPaths: _propTypes.default.object,
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  useLedgerLive: _propTypes.default.bool.isRequired
};

const mapStateToProps = state => ({
  chainId: (0, _selectors.getCurrentChainId)(state),
  rpcPrefs: (0, _selectors.getRpcPrefsForCurrentProvider)(state),
  accounts: (0, _selectors.getMetaMaskAccounts)(state),
  connectedAccounts: (0, _selectors.getMetaMaskAccountsConnected)(state),
  defaultHdPaths: state.appState.defaultHdPaths,
  mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
  useLedgerLive: state.metamask.useLedgerLive
});

const mapDispatchToProps = dispatch => {
  return {
    setHardwareWalletDefaultHdPath: ({
      device,
      path
    }) => {
      return dispatch(actions.setHardwareWalletDefaultHdPath({
        device,
        path
      }));
    },
    connectHardware: (deviceName, page, hdPath) => {
      return dispatch(actions.connectHardware(deviceName, page, hdPath));
    },
    checkHardwareStatus: (deviceName, hdPath) => {
      return dispatch(actions.checkHardwareStatus(deviceName, hdPath));
    },
    forgetDevice: deviceName => {
      return dispatch(actions.forgetDevice(deviceName));
    },
    unlockHardwareWalletAccounts: (indexes, deviceName, hdPath, hdPathDescription) => {
      return dispatch(actions.unlockHardwareWalletAccounts(indexes, deviceName, hdPath, hdPathDescription));
    },
    showAlert: msg => dispatch(actions.showAlert(msg)),
    hideAlert: () => dispatch(actions.hideAlert())
  };
};

ConnectHardwareForm.contextTypes = {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(ConnectHardwareForm);

exports.default = _default;


//# sourceMappingURL=ui/pages/create-account/connect-hardware/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/connect-hardware/index.js",}],
[4030, {"../contexts/i18n":3970,"react":3121}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useI18nContext = useI18nContext;

var _react = require("react");

var _i18n = require("../contexts/i18n");

/**
 * useI18ncContext
 *
 * A time saving shortcut to using useContext + I18ncontext in many
 * different places.
 * @return {Function} I18n function from contexts/I18n.js
 */
function useI18nContext() {
  return (0, _react.useContext)(_i18n.I18nContext);
}

//# sourceMappingURL=ui/hooks/useI18nContext.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useI18nContext.js",}],
[4033, {"../selectors":4326,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useOriginMetadata = useOriginMetadata;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var _selectors = require("../selectors");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef {Object} OriginMetadata
 * @property {string} host - The host of the origin
 * @property {string} hostname - The hostname of the origin (host + port)
 * @property {string} origin - The original origin string itself
 * @property {string} [icon] - The origin's site icon if available
 * @property {number} [lastUpdated] - Timestamp of the last update to the
 *  origin's metadata
 * @property {string} [name] - The registered name of the origin if available
 */

/**
 * Gets origin metadata from redux and formats it appropriately.
 * @param {string} origin - The fully formed url of the site interacting with
 *  MetaMask
 * @returns {OriginMetadata | null} - The origin metadata available for the
 *  current origin
 */
function useOriginMetadata(origin) {
  const domainMetaData = (0, _reactRedux.useSelector)(_selectors.getDomainMetadata);

  if (!origin) {
    return null;
  }

  const url = new URL(origin);
  const minimumOriginMetadata = {
    host: url.host,
    hostname: url.hostname,
    origin
  };

  if (domainMetaData !== null && domainMetaData !== void 0 && domainMetaData[origin]) {
    return _objectSpread(_objectSpread({}, minimumOriginMetadata), domainMetaData[origin]);
  }

  return minimumOriginMetadata;
}

//# sourceMappingURL=ui/hooks/useOriginMetadata.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useOriginMetadata.js",}],
[3848, {"./chip":3847,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _chip.default;
  }
});

var _chip = _interopRequireDefault(require("./chip"));

//# sourceMappingURL=ui/components/ui/chip/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/chip/index.js",}],
[3838, {"./box":3837,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _box.default;
  }
});

var _box = _interopRequireDefault(require("./box"));

//# sourceMappingURL=ui/components/ui/box/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/box/index.js",}],
[3761, {"../../../../shared/constants/network":3595,"../../../helpers/constants/design-system":3992,"../../../hooks/useI18nContext":4030,"../../../selectors":4326,"../../ui/chip/chip":3847,"../../ui/color-indicator":3850,"../../ui/loading-indicator":3904,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NetworkDisplay;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactRedux = require("react-redux");

var _network = require("../../../../shared/constants/network");

var _loadingIndicator = _interopRequireDefault(require("../../ui/loading-indicator"));

var _colorIndicator = _interopRequireDefault(require("../../ui/color-indicator"));

var _designSystem = require("../../../helpers/constants/design-system");

var _chip = _interopRequireDefault(require("../../ui/chip/chip"));

var _useI18nContext = require("../../../hooks/useI18nContext");

var _selectors = require("../../../selectors");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function NetworkDisplay({
  colored,
  outline,
  iconClassName,
  indicatorSize,
  disabled,
  labelProps,
  targetNetwork,
  onClick
}) {
  const networkIsLoading = (0, _reactRedux.useSelector)(_selectors.isNetworkLoading);
  const currentNetwork = (0, _reactRedux.useSelector)(state => {
    return {
      nickname: state.metamask.provider.rpcUrl.includes('testnet') ? 'Monsta Testnet' : state.metamask.provider.nickname,
      type: state.metamask.provider.type
    };
  });
  const t = (0, _useI18nContext.useI18nContext)();
  const {
    nickname: networkNickname,
    type: networkType
  } = targetNetwork !== null && targetNetwork !== void 0 ? targetNetwork : currentNetwork;
  return /*#__PURE__*/_react.default.createElement(_chip.default, {
    borderColor: _designSystem.COLORS.UI3,
    onClick: onClick,
    leftIcon: /*#__PURE__*/_react.default.createElement(_loadingIndicator.default, {
      alt: t('attemptingConnect'),
      title: t('attemptingConnect'),
      isLoading: networkIsLoading
    }, /*#__PURE__*/_react.default.createElement(_colorIndicator.default, {
      color: _designSystem.COLORS.SUCCESS1,
      size: indicatorSize,
      type: _colorIndicator.default.TYPES.FILLED,
      iconClassName: undefined
    })),
    rightIcon: iconClassName && /*#__PURE__*/_react.default.createElement("i", {
      className: (0, _classnames.default)('network-display__icon', iconClassName)
    }),
    label: networkType === _network.NETWORK_TYPE_RPC ? networkNickname !== null && networkNickname !== void 0 ? networkNickname : t('privateNetwork') : t(networkType),
    className: (0, _classnames.default)('network-display', {
      'network-display--colored': colored,
      'network-display--disabled': disabled,
      [`network-display--${networkType}`]: colored && networkType,
      'network-display--clickable': typeof onClick === 'function'
    }),
    labelProps: _objectSpread({
      variant: _designSystem.TYPOGRAPHY.H7
    }, labelProps)
  });
}

NetworkDisplay.propTypes = {
  colored: _propTypes.default.bool,
  indicatorSize: _propTypes.default.oneOf(Object.values(_designSystem.SIZES)),
  labelProps: _chip.default.propTypes.labelProps,
  targetNetwork: _propTypes.default.shape({
    type: _propTypes.default.oneOf([...Object.values(_network.NETWORK_TYPE_TO_ID_MAP), _network.NETWORK_TYPE_RPC]),
    nickname: _propTypes.default.string
  }),
  outline: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  iconClassName: _propTypes.default.string,
  onClick: _propTypes.default.func
};
NetworkDisplay.defaultProps = {
  colored: true,
  indicatorSize: _designSystem.SIZES.LG
};

//# sourceMappingURL=ui/components/app/network-display/network-display.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/network-display/network-display.js",}],
[3844, {"./callout":3843,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _callout.default;
  }
});

var _callout = _interopRequireDefault(require("./callout"));

//# sourceMappingURL=ui/components/ui/callout/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/callout/index.js",}],
[4095, {"./confirmation-footer":4094,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmationFooter.default;
  }
});

var _confirmationFooter = _interopRequireDefault(require("./confirmation-footer"));

//# sourceMappingURL=ui/pages/confirmation/components/confirmation-footer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirmation/components/confirmation-footer/index.js",}],
[3939, {"./site-icon":3940,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _siteIcon.default;
  }
});

var _siteIcon = _interopRequireDefault(require("./site-icon"));

//# sourceMappingURL=ui/components/ui/site-icon/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/site-icon/index.js",}],
[3695, {"./metamask-template-renderer":3696,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _metamaskTemplateRenderer.default;
  }
});

var _metamaskTemplateRenderer = _interopRequireDefault(require("./metamask-template-renderer"));

//# sourceMappingURL=ui/components/app/metamask-template-renderer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/metamask-template-renderer/index.js",}],
[4053, {"../../../components/app/transaction-list":3816,"../../../components/app/wallet-overview":3829,"../../../helpers/constants/routes":3995,"../../../helpers/utils/util":4020,"../../../hooks/useMetricEvent":4032,"../../../selectors/selectors":4328,"../../../store/actions":4331,"./asset-navigation":4050,"./asset-options":4051,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/etherscan-link":966,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TokenAsset;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _etherscanLink = require("@metamask/etherscan-link");

var _transactionList = _interopRequireDefault(require("../../../components/app/transaction-list"));

var _walletOverview = require("../../../components/app/wallet-overview");

var _selectors = require("../../../selectors/selectors");

var _routes = require("../../../helpers/constants/routes");

var _util = require("../../../helpers/utils/util");

var _actions = require("../../../store/actions");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _assetNavigation = _interopRequireDefault(require("./asset-navigation"));

var _assetOptions = _interopRequireDefault(require("./asset-options"));

function TokenAsset({
  token
}) {
  const dispatch = (0, _reactRedux.useDispatch)();
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const rpcPrefs = (0, _reactRedux.useSelector)(_selectors.getRpcPrefsForCurrentProvider);
  const selectedIdentity = (0, _reactRedux.useSelector)(_selectors.getSelectedIdentity);
  const selectedAccountName = selectedIdentity.name;
  const selectedAddress = selectedIdentity.address;
  const history = (0, _reactRouterDom.useHistory)();
  const tokenTrackerLink = (0, _etherscanLink.getTokenTrackerLink)(token.address, chainId, null, selectedAddress, rpcPrefs);
  const blockExplorerLinkClickedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    category: 'Navigation',
    event: 'Clicked Block Explorer Link',
    properties: {
      link_type: 'Token Tracker',
      action: 'Token Options',
      block_explorer_domain: (0, _util.getURLHostName)(tokenTrackerLink)
    }
  });
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_assetNavigation.default, {
    accountName: selectedAccountName,
    assetName: token.symbol,
    onBack: () => history.push(_routes.DEFAULT_ROUTE),
    optionsButton: /*#__PURE__*/_react.default.createElement(_assetOptions.default, {
      onRemove: () => dispatch((0, _actions.showModal)({
        name: 'HIDE_TOKEN_CONFIRMATION',
        token
      })),
      isEthNetwork: !rpcPrefs.blockExplorerUrl,
      onClickBlockExplorer: () => {
        blockExplorerLinkClickedEvent();
        global.platform.openTab({
          url: tokenTrackerLink
        });
      },
      onViewAccountDetails: () => {
        dispatch((0, _actions.showModal)({
          name: 'ACCOUNT_DETAILS'
        }));
      },
      tokenSymbol: token.symbol
    })
  }), /*#__PURE__*/_react.default.createElement(_walletOverview.TokenOverview, {
    className: "asset__overview",
    token: token
  }), /*#__PURE__*/_react.default.createElement(_transactionList.default, {
    tokenAddress: token.address
  }));
}

TokenAsset.propTypes = {
  token: _propTypes.default.shape({
    address: _propTypes.default.string.isRequired,
    decimals: _propTypes.default.number,
    symbol: _propTypes.default.string
  }).isRequired
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/asset/components/token-asset.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/asset/components/token-asset.js",}],
[4052, {"../../../components/app/transaction-list":3816,"../../../components/app/wallet-overview":3829,"../../../helpers/constants/routes":3995,"../../../helpers/utils/util":4020,"../../../hooks/useMetricEvent":4032,"../../../selectors/selectors":4328,"../../../store/actions":4331,"./asset-navigation":4050,"./asset-options":4051,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/etherscan-link":966,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NativeAsset;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _etherscanLink = require("@metamask/etherscan-link");

var _transactionList = _interopRequireDefault(require("../../../components/app/transaction-list"));

var _walletOverview = require("../../../components/app/wallet-overview");

var _selectors = require("../../../selectors/selectors");

var _actions = require("../../../store/actions");

var _routes = require("../../../helpers/constants/routes");

var _util = require("../../../helpers/utils/util");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _assetNavigation = _interopRequireDefault(require("./asset-navigation"));

var _assetOptions = _interopRequireDefault(require("./asset-options"));

function NativeAsset({
  nativeCurrency
}) {
  const selectedAccountName = (0, _reactRedux.useSelector)(state => (0, _selectors.getSelectedIdentity)(state).name);
  const dispatch = (0, _reactRedux.useDispatch)();
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const rpcPrefs = (0, _reactRedux.useSelector)(_selectors.getRpcPrefsForCurrentProvider);
  const address = (0, _reactRedux.useSelector)(_selectors.getSelectedAddress);
  const history = (0, _reactRouterDom.useHistory)();
  const accountLink = (0, _etherscanLink.getAccountLink)(address, chainId, rpcPrefs);
  const blockExplorerLinkClickedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    category: 'Navigation',
    event: 'Clicked Block Explorer Link',
    properties: {
      link_type: 'Account Tracker',
      action: 'Asset Options',
      block_explorer_domain: (0, _util.getURLHostName)(accountLink)
    }
  });
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_assetNavigation.default, {
    accountName: selectedAccountName,
    assetName: nativeCurrency,
    onBack: () => history.push(_routes.DEFAULT_ROUTE),
    isEthNetwork: !rpcPrefs.blockExplorerUrl,
    optionsButton: /*#__PURE__*/_react.default.createElement(_assetOptions.default, {
      isNativeAsset: true,
      onClickBlockExplorer: () => {
        blockExplorerLinkClickedEvent();
        global.platform.openTab({
          url: accountLink
        });
      },
      onViewAccountDetails: () => {
        dispatch((0, _actions.showModal)({
          name: 'ACCOUNT_DETAILS'
        }));
      }
    })
  }), /*#__PURE__*/_react.default.createElement(_walletOverview.EthOverview, {
    className: "asset__overview"
  }), /*#__PURE__*/_react.default.createElement(_transactionList.default, {
    hideTokenTransactions: true
  }));
}

NativeAsset.propTypes = {
  nativeCurrency: _propTypes.default.string.isRequired
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/asset/components/native-asset.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/asset/components/native-asset.js",}],
[4185, {"../../../app/scripts/lib/util":78,"../../../shared/constants/app":3591,"../../../shared/constants/time":3598,"../../components/app/permission-page-container":3762,"../../helpers/constants/routes":3995,"./choose-account":4183,"./redirect":4187,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _util = require("../../../app/scripts/lib/util");

var _app = require("../../../shared/constants/app");

var _time = require("../../../shared/constants/time");

var _routes = require("../../helpers/constants/routes");

var _permissionPageContainer = _interopRequireDefault(require("../../components/app/permission-page-container"));

var _chooseAccount = _interopRequireDefault(require("./choose-account"));

var _redirect = _interopRequireDefault(require("./redirect"));

const APPROVE_TIMEOUT = _time.MILLISECOND * 1200;

class PermissionConnect extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      redirecting: false,
      selectedAccountAddresses: new Set([this.props.currentAddress]),
      permissionsApproved: null,
      origin: this.props.origin,
      targetDomainMetadata: this.props.targetDomainMetadata || {}
    });
    (0, _defineProperty2.default)(this, "beforeUnload", () => {
      const {
        permissionsRequestId,
        rejectPermissionsRequest
      } = this.props;
      const {
        permissionsApproved
      } = this.state;

      if (permissionsApproved === null && permissionsRequestId) {
        rejectPermissionsRequest(permissionsRequestId);
      }
    });
    (0, _defineProperty2.default)(this, "removeBeforeUnload", () => {
      const environmentType = (0, _util.getEnvironmentType)();

      if (environmentType === _app.ENVIRONMENT_TYPE_NOTIFICATION) {
        window.removeEventListener('beforeunload', this.beforeUnload);
      }
    });
    (0, _defineProperty2.default)(this, "selectAccounts", addresses => {
      this.setState({
        selectedAccountAddresses: addresses
      }, () => this.props.history.push(this.props.confirmPermissionPath));
    });
    (0, _defineProperty2.default)(this, "cancelPermissionsRequest", async requestId => {
      const {
        rejectPermissionsRequest
      } = this.props;

      if (requestId) {
        await rejectPermissionsRequest(requestId);
        this.redirect(false);
      }
    });
  }

  componentDidMount() {
    const {
      getCurrentWindowTab,
      getRequestAccountTabIds,
      permissionsRequest,
      history
    } = this.props;
    getCurrentWindowTab();
    getRequestAccountTabIds();

    if (!permissionsRequest) {
      history.push(_routes.DEFAULT_ROUTE);
      return;
    }

    const environmentType = (0, _util.getEnvironmentType)();

    if (environmentType === _app.ENVIRONMENT_TYPE_NOTIFICATION) {
      window.addEventListener('beforeunload', this.beforeUnload);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const {
      permissionsRequest,
      targetDomainMetadata
    } = props;
    const {
      targetDomainMetadata: savedMetadata
    } = state;

    if (permissionsRequest && savedMetadata.origin !== (targetDomainMetadata === null || targetDomainMetadata === void 0 ? void 0 : targetDomainMetadata.origin)) {
      return {
        targetDomainMetadata
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const {
      permissionsRequest,
      lastConnectedInfo
    } = this.props;
    const {
      redirecting,
      origin
    } = this.state;

    if (!permissionsRequest && prevProps.permissionsRequest && !redirecting) {
      var _lastConnectedInfo$or, _prevProps$lastConnec;

      const accountsLastApprovedTime = ((_lastConnectedInfo$or = lastConnectedInfo[origin]) === null || _lastConnectedInfo$or === void 0 ? void 0 : _lastConnectedInfo$or.lastApproved) || 0;
      const initialAccountsLastApprovedTime = ((_prevProps$lastConnec = prevProps.lastConnectedInfo[origin]) === null || _prevProps$lastConnec === void 0 ? void 0 : _prevProps$lastConnec.lastApproved) || 0;
      const approved = accountsLastApprovedTime > initialAccountsLastApprovedTime;
      this.redirect(approved);
    }
  }

  redirect(approved) {
    const {
      history
    } = this.props;
    this.setState({
      redirecting: true,
      permissionsApproved: approved
    });
    this.removeBeforeUnload();

    if (approved) {
      setTimeout(() => history.push(_routes.DEFAULT_ROUTE), APPROVE_TIMEOUT);
    } else {
      history.push(_routes.DEFAULT_ROUTE);
    }
  }

  goBack() {
    const {
      history,
      connectPath
    } = this.props;
    history.push(connectPath);
  }

  renderTopBar() {
    const {
      redirecting
    } = this.state;
    const {
      page
    } = this.props;
    const {
      t
    } = this.context;
    return redirecting ? null : /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect__top-bar"
    }, page === '2' ? /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect__back",
      onClick: () => this.goBack()
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fas fa-chevron-left"
    }), t('back')) : null, /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect__page-count"
    }, t('xOfY', [page, '2'])));
  }

  render() {
    const {
      approvePermissionsRequest,
      accounts,
      showNewAccountModal,
      newAccountNumber,
      nativeCurrency,
      permissionsRequest,
      addressLastConnectedMap,
      permissionsRequestId,
      connectPath,
      confirmPermissionPath
    } = this.props;
    const {
      selectedAccountAddresses,
      permissionsApproved,
      redirecting,
      targetDomainMetadata
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect"
    }, this.renderTopBar(), redirecting && permissionsApproved ? /*#__PURE__*/_react.default.createElement(_redirect.default, {
      domainMetadata: targetDomainMetadata
    }) : /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: connectPath,
      exact: true,
      render: () => /*#__PURE__*/_react.default.createElement(_chooseAccount.default, {
        accounts: accounts,
        nativeCurrency: nativeCurrency,
        selectAccounts: addresses => this.selectAccounts(addresses),
        selectNewAccountViaModal: handleAccountClick => {
          showNewAccountModal({
            onCreateNewAccount: address => handleAccountClick(address),
            newAccountNumber
          });
        },
        addressLastConnectedMap: addressLastConnectedMap,
        cancelPermissionsRequest: requestId => this.cancelPermissionsRequest(requestId),
        permissionsRequestId: permissionsRequestId,
        selectedAccountAddresses: selectedAccountAddresses,
        targetDomainMetadata: targetDomainMetadata
      })
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: confirmPermissionPath,
      exact: true,
      render: () => /*#__PURE__*/_react.default.createElement(_permissionPageContainer.default, {
        request: permissionsRequest || {},
        approvePermissionsRequest: (...args) => {
          approvePermissionsRequest(...args);
          this.redirect(true);
        },
        rejectPermissionsRequest: requestId => this.cancelPermissionsRequest(requestId),
        selectedIdentities: accounts.filter(account => selectedAccountAddresses.has(account.address)),
        targetDomainMetadata: targetDomainMetadata
      })
    })));
  }

}

exports.default = PermissionConnect;
(0, _defineProperty2.default)(PermissionConnect, "propTypes", {
  approvePermissionsRequest: _propTypes.default.func.isRequired,
  rejectPermissionsRequest: _propTypes.default.func.isRequired,
  getRequestAccountTabIds: _propTypes.default.func.isRequired,
  getCurrentWindowTab: _propTypes.default.func.isRequired,
  accounts: _propTypes.default.array.isRequired,
  currentAddress: _propTypes.default.string.isRequired,
  origin: _propTypes.default.string,
  showNewAccountModal: _propTypes.default.func.isRequired,
  newAccountNumber: _propTypes.default.number.isRequired,
  nativeCurrency: _propTypes.default.string,
  permissionsRequest: _propTypes.default.object,
  addressLastConnectedMap: _propTypes.default.object.isRequired,
  lastConnectedInfo: _propTypes.default.object.isRequired,
  permissionsRequestId: _propTypes.default.string,
  history: _propTypes.default.object.isRequired,
  connectPath: _propTypes.default.string.isRequired,
  confirmPermissionPath: _propTypes.default.string.isRequired,
  page: _propTypes.default.string.isRequired,
  targetDomainMetadata: _propTypes.default.shape({
    extensionId: _propTypes.default.string,
    icon: _propTypes.default.string,
    host: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    origin: _propTypes.default.string.isRequired
  })
});
(0, _defineProperty2.default)(PermissionConnect, "defaultProps", {
  origin: '',
  nativeCurrency: '',
  permissionsRequest: undefined,
  permissionsRequestId: ''
});
(0, _defineProperty2.default)(PermissionConnect, "contextTypes", {
  t: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/permissions-connect/permissions-connect.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/permissions-connect/permissions-connect.component.js",}],
[3849, {"../../../helpers/constants/design-system":3992,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ColorIndicator;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _designSystem = require("../../../helpers/constants/design-system");

function ColorIndicator({
  size = _designSystem.SIZES.SM,
  type = 'outlined',
  color = _designSystem.COLORS.UI4,
  borderColor,
  iconClassName
}) {
  const colorIndicatorClassName = (0, _classnames.default)('color-indicator', {
    'color-indicator--filled': type === 'filled' || Boolean(iconClassName),
    'color-indicator--partial-filled': type === 'partial-filled',
    [`color-indicator--border-color-${borderColor}`]: Boolean(borderColor),
    [`color-indicator--color-${color}`]: true,
    [`color-indicator--size-${size}`]: true
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: colorIndicatorClassName
  }, iconClassName ? /*#__PURE__*/_react.default.createElement("i", {
    className: (0, _classnames.default)('color-indicator__icon', iconClassName)
  }) : /*#__PURE__*/_react.default.createElement("span", {
    className: "color-indicator__inner-circle"
  }));
}

ColorIndicator.TYPES = {
  FILLED: 'filled',
  PARTIAL: 'partial-filled',
  OUTLINE: 'outline'
};
ColorIndicator.propTypes = {
  color: _propTypes.default.oneOf(Object.values(_designSystem.COLORS)),
  borderColor: _propTypes.default.oneOf(Object.values(_designSystem.COLORS)),
  size: _propTypes.default.oneOf(Object.values(_designSystem.SIZES)),
  iconClassName: _propTypes.default.string,
  type: _propTypes.default.oneOf(Object.values(ColorIndicator.TYPES))
};

//# sourceMappingURL=ui/components/ui/color-indicator/color-indicator.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/color-indicator/color-indicator.js",}],
[3694, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-dom":3037,"react-transition-group/CSSTransitionGroup":3113}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _CSSTransitionGroup = _interopRequireDefault(require("react-transition-group/CSSTransitionGroup"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class MenuDroppoComponent extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "globalClickOccurred", event => {
      const {
        target
      } = event; // eslint-disable-next-line react/no-find-dom-node

      const container = (0, _reactDom.findDOMNode)(this);

      if (this.props.isOpen && target !== container && !isDescendant(this.container, event.target) && this.props.onClickOutside) {
        this.props.onClickOutside(event);
      }
    });
  }

  renderPrimary() {
    const {
      isOpen
    } = this.props;

    if (!isOpen) {
      return null;
    }

    const innerStyle = this.props.innerStyle || {};
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "menu-droppo",
      key: "menu-droppo-drawer",
      style: innerStyle
    }, this.props.children);
  }

  componentDidMount() {
    if (this && document.body) {
      document.body.addEventListener('click', this.globalClickOccurred); // eslint-disable-next-line react/no-find-dom-node

      const container = (0, _reactDom.findDOMNode)(this);
      this.container = container;
    }
  }

  componentWillUnmount() {
    if (this && document.body) {
      document.body.removeEventListener('click', this.globalClickOccurred);
    }
  }

  render() {
    const {
      containerClassName = '',
      style
    } = this.props;
    const speed = this.props.speed || '300ms';
    const {
      useCssTransition
    } = this.props;
    const zIndex = 'zIndex' in this.props ? this.props.zIndex : 0;

    const baseStyle = _objectSpread(_objectSpread({
      position: 'fixed'
    }, style), {}, {
      zIndex
    });

    return /*#__PURE__*/_react.default.createElement("div", {
      style: baseStyle,
      className: `menu-droppo-container ${containerClassName}`
    }, /*#__PURE__*/_react.default.createElement("style", null, `
          .menu-droppo-enter {
            transition: transform ${speed} ease-in-out;
            transform: translateY(-200%);
          }

          .menu-droppo-enter.menu-droppo-enter-active {
            transition: transform ${speed} ease-in-out;
            transform: translateY(0%);
          }

          .menu-droppo-leave {
            transition: transform ${speed} ease-in-out;
            transform: translateY(0%);
          }

          .menu-droppo-leave.menu-droppo-leave-active {
            transition: transform ${speed} ease-in-out;
            transform: translateY(-200%);
          }
        `), useCssTransition ? /*#__PURE__*/_react.default.createElement(_CSSTransitionGroup.default, {
      className: "css-transition-group",
      transitionName: "menu-droppo",
      transitionEnterTimeout: parseInt(speed, 10),
      transitionLeaveTimeout: parseInt(speed, 10)
    }, this.renderPrimary()) : this.renderPrimary());
  }

}

exports.default = MenuDroppoComponent;
(0, _defineProperty2.default)(MenuDroppoComponent, "propTypes", {
  isOpen: _propTypes.default.bool.optional,
  innerStyle: _propTypes.default.object,
  children: _propTypes.default.node.isRequired,
  onClickOutside: _propTypes.default.func,
  containerClassName: _propTypes.default.string,
  zIndex: _propTypes.default.number,
  style: _propTypes.default.object.isRequired,
  useCssTransition: _propTypes.default.bool,
  speed: _propTypes.default.string
});

function isDescendant(parent, child) {
  let node = child.parentNode;

  while (node !== null) {
    if (node === parent) {
      return true;
    }

    node = node.parentNode;
  }

  return false;
}

//# sourceMappingURL=ui/components/app/menu-droppo.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/menu-droppo.js",}],
[4163, {"../../../app/scripts/lib/util":78,"../../../shared/modules/hexstring-utils":3604,"../../components/ui/actionable-message/actionable-message":3835,"../../components/ui/button":3842,"../../components/ui/page-container":3918,"../../components/ui/tabs":3945,"../../components/ui/text-field":3951,"../../components/ui/typography":3964,"../../helpers/constants/design-system":3992,"../../helpers/constants/routes":3995,"../../helpers/utils/token-util":4017,"../../helpers/utils/util":4020,"./token-list":4166,"./token-search":4171,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/etherscan-link":966,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _etherscanLink = require("@metamask/etherscan-link");

var _util = require("../../helpers/utils/util");

var _tokenUtil = require("../../helpers/utils/token-util");

var _routes = require("../../helpers/constants/routes");

var _textField = _interopRequireDefault(require("../../components/ui/text-field"));

var _pageContainer = _interopRequireDefault(require("../../components/ui/page-container"));

var _tabs = require("../../components/ui/tabs");

var _util2 = require("../../../app/scripts/lib/util");

var _hexstringUtils = require("../../../shared/modules/hexstring-utils");

var _actionableMessage = _interopRequireDefault(require("../../components/ui/actionable-message/actionable-message"));

var _typography = _interopRequireDefault(require("../../components/ui/typography"));

var _designSystem = require("../../helpers/constants/design-system");

var _button = _interopRequireDefault(require("../../components/ui/button"));

var _tokenSearch = _interopRequireDefault(require("./token-search"));

var _tokenList = _interopRequireDefault(require("./token-list"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const emptyAddr = '0x0000000000000000000000000000000000000000';
const MIN_DECIMAL_VALUE = 0;
const MAX_DECIMAL_VALUE = 36;

class ImportToken extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      customAddress: '',
      customSymbol: '',
      customDecimals: 0,
      searchResults: [],
      selectedTokens: {},
      tokenSelectorError: null,
      customAddressError: null,
      customSymbolError: null,
      customDecimalsError: null,
      forceEditSymbol: false,
      symbolAutoFilled: false,
      decimalAutoFilled: false
    });
  }

  componentDidMount() {
    this.tokenInfoGetter = (0, _tokenUtil.tokenInfoGetter)();
    const {
      pendingTokens = {}
    } = this.props;
    const pendingTokenKeys = Object.keys(pendingTokens);

    if (pendingTokenKeys.length > 0) {
      let selectedTokens = {};
      let customToken = {};
      pendingTokenKeys.forEach(tokenAddress => {
        const token = pendingTokens[tokenAddress];
        const {
          isCustom
        } = token;

        if (isCustom) {
          customToken = _objectSpread({}, token);
        } else {
          selectedTokens = _objectSpread(_objectSpread({}, selectedTokens), {}, {
            [tokenAddress]: _objectSpread({}, token)
          });
        }
      });
      const {
        address: customAddress = '',
        symbol: customSymbol = '',
        decimals: customDecimals = 0
      } = customToken;
      this.setState({
        selectedTokens,
        customAddress,
        customSymbol,
        customDecimals
      });
    }
  }

  handleToggleToken(token) {
    const {
      address
    } = token;
    const {
      selectedTokens = {}
    } = this.state;

    const selectedTokensCopy = _objectSpread({}, selectedTokens);

    if (address in selectedTokensCopy) {
      delete selectedTokensCopy[address];
    } else {
      selectedTokensCopy[address] = token;
    }

    this.setState({
      selectedTokens: selectedTokensCopy,
      tokenSelectorError: null
    });
  }

  hasError() {
    const {
      tokenSelectorError,
      customAddressError,
      customSymbolError,
      customDecimalsError
    } = this.state;
    return tokenSelectorError || customAddressError || customSymbolError || customDecimalsError;
  }

  hasSelected() {
    const {
      customAddress = '',
      selectedTokens = {}
    } = this.state;
    return customAddress || Object.keys(selectedTokens).length > 0;
  }

  handleNext() {
    if (this.hasError()) {
      return;
    }

    if (!this.hasSelected()) {
      this.setState({
        tokenSelectorError: this.context.t('mustSelectOne')
      });
      return;
    }

    const {
      setPendingTokens,
      history,
      tokenList
    } = this.props;
    const tokenAddressList = Object.keys(tokenList).map(address => address.toLowerCase());
    const {
      customAddress: address,
      customSymbol: symbol,
      customDecimals: decimals,
      selectedTokens
    } = this.state;
    const customToken = {
      address,
      symbol,
      decimals
    };
    setPendingTokens({
      customToken,
      selectedTokens,
      tokenAddressList
    });
    history.push(_routes.CONFIRM_IMPORT_TOKEN_ROUTE);
  }

  async attemptToAutoFillTokenParams(address) {
    const {
      tokenList
    } = this.props;
    const {
      symbol = '',
      decimals
    } = await this.tokenInfoGetter(address, tokenList);
    const symbolAutoFilled = Boolean(symbol);
    const decimalAutoFilled = Boolean(decimals);
    this.setState({
      symbolAutoFilled,
      decimalAutoFilled
    });
    this.handleCustomSymbolChange(symbol || '');
    this.handleCustomDecimalsChange(decimals);
  }

  handleCustomAddressChange(value) {
    const customAddress = value.trim();
    this.setState({
      customAddress,
      customAddressError: null,
      tokenSelectorError: null,
      symbolAutoFilled: false,
      decimalAutoFilled: false
    });
    const addressIsValid = (0, _hexstringUtils.isValidHexAddress)(customAddress, {
      allowNonPrefixed: false
    });
    const standardAddress = (0, _util2.addHexPrefix)(customAddress).toLowerCase();

    switch (true) {
      case !addressIsValid:
        this.setState({
          customAddressError: this.context.t('invalidAddress'),
          customSymbol: '',
          customDecimals: 0,
          customSymbolError: null,
          customDecimalsError: null
        });
        break;

      case Boolean(this.props.identities[standardAddress]):
        this.setState({
          customAddressError: this.context.t('personalAddressDetected')
        });
        break;

      case (0, _util.checkExistingAddresses)(customAddress, this.props.tokens):
        this.setState({
          customAddressError: this.context.t('tokenAlreadyAdded')
        });
        break;

      default:
        if (customAddress !== emptyAddr) {
          this.attemptToAutoFillTokenParams(customAddress);
        }

    }
  }

  handleCustomSymbolChange(value) {
    const customSymbol = value.trim();
    const symbolLength = customSymbol.length;
    let customSymbolError = null;

    if (symbolLength <= 0 || symbolLength >= 12) {
      customSymbolError = this.context.t('symbolBetweenZeroTwelve');
    }

    this.setState({
      customSymbol,
      customSymbolError
    });
  }

  handleCustomDecimalsChange(value) {
    let customDecimals;
    let customDecimalsError = null;

    if (value) {
      customDecimals = Number(value.trim());
      customDecimalsError = value < MIN_DECIMAL_VALUE || value > MAX_DECIMAL_VALUE ? this.context.t('decimalsMustZerotoTen') : null;
    } else {
      customDecimals = '';
      customDecimalsError = this.context.t('tokenDecimalFetchFailed');
    }

    this.setState({
      customDecimals,
      customDecimalsError
    });
  }

  renderCustomTokenForm() {
    var _rpcPrefs$blockExplor;

    const {
      customAddress,
      customSymbol,
      customDecimals,
      customAddressError,
      customSymbolError,
      customDecimalsError,
      forceEditSymbol,
      symbolAutoFilled,
      decimalAutoFilled
    } = this.state;
    const {
      chainId,
      rpcPrefs
    } = this.props;
    const blockExplorerTokenLink = (0, _etherscanLink.getTokenTrackerLink)(customAddress, chainId, null, null, {
      blockExplorerUrl: (_rpcPrefs$blockExplor = rpcPrefs === null || rpcPrefs === void 0 ? void 0 : rpcPrefs.blockExplorerUrl) !== null && _rpcPrefs$blockExplor !== void 0 ? _rpcPrefs$blockExplor : null
    });
    const blockExplorerLabel = rpcPrefs !== null && rpcPrefs !== void 0 && rpcPrefs.blockExplorerUrl ? (0, _util.getURLHostName)(blockExplorerTokenLink) : this.context.t('etherscan');
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "import-token__custom-token-form"
    }, /*#__PURE__*/_react.default.createElement(_actionableMessage.default, {
      message: this.context.t('fakeTokenWarning', [/*#__PURE__*/_react.default.createElement(_button.default, {
        type: "link",
        key: "import-token-fake-token-warning",
        className: "import-token__link",
        rel: "noopener noreferrer",
        target: "_blank",
        href: "https://metamask.zendesk.com/hc/en-us/articles/4403988839451"
      }, this.context.t('learnScamRisk'))]),
      type: "warning",
      withRightButton: true,
      useIcon: true,
      iconFillColor: "#f8c000"
    }), /*#__PURE__*/_react.default.createElement(_textField.default, {
      id: "custom-address",
      label: this.context.t('tokenContractAddress'),
      type: "text",
      value: customAddress,
      onChange: e => this.handleCustomAddressChange(e.target.value),
      error: customAddressError,
      fullWidth: true,
      autoFocus: true,
      margin: "normal"
    }), /*#__PURE__*/_react.default.createElement(_textField.default, {
      id: "custom-symbol",
      label: /*#__PURE__*/_react.default.createElement("div", {
        className: "import-token__custom-symbol__label-wrapper"
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "import-token__custom-symbol__label"
      }, this.context.t('tokenSymbol')), symbolAutoFilled && !forceEditSymbol && /*#__PURE__*/_react.default.createElement("div", {
        className: "import-token__custom-symbol__edit",
        onClick: () => this.setState({
          forceEditSymbol: true
        })
      }, this.context.t('edit'))),
      type: "text",
      value: customSymbol,
      onChange: e => this.handleCustomSymbolChange(e.target.value),
      error: customSymbolError,
      fullWidth: true,
      margin: "normal",
      disabled: symbolAutoFilled && !forceEditSymbol
    }), /*#__PURE__*/_react.default.createElement(_textField.default, {
      id: "custom-decimals",
      label: this.context.t('decimal'),
      type: "number",
      value: customDecimals,
      onChange: e => this.handleCustomDecimalsChange(e.target.value),
      error: customDecimals ? customDecimalsError : null,
      fullWidth: true,
      margin: "normal",
      disabled: decimalAutoFilled,
      min: MIN_DECIMAL_VALUE,
      max: MAX_DECIMAL_VALUE
    }), customDecimals === '' && /*#__PURE__*/_react.default.createElement(_actionableMessage.default, {
      message: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_typography.default, {
        variant: _designSystem.TYPOGRAPHY.H7,
        fontWeight: _designSystem.FONT_WEIGHT.BOLD
      }, this.context.t('tokenDecimalFetchFailed')), /*#__PURE__*/_react.default.createElement(_typography.default, {
        variant: _designSystem.TYPOGRAPHY.H7,
        fontWeight: _designSystem.FONT_WEIGHT.NORMAL
      }, this.context.t('verifyThisTokenDecimalOn', [/*#__PURE__*/_react.default.createElement(_button.default, {
        type: "link",
        key: "import-token-verify-token-decimal",
        className: "import-token__link",
        rel: "noopener noreferrer",
        target: "_blank",
        href: blockExplorerTokenLink
      }, blockExplorerLabel)]))),
      type: "warning",
      withRightButton: true,
      className: "import-token__decimal-warning"
    }));
  }

  renderSearchToken() {
    const {
      tokenList,
      history
    } = this.props;
    const {
      tokenSelectorError,
      selectedTokens,
      searchResults
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "import-token__search-token"
    }, /*#__PURE__*/_react.default.createElement(_actionableMessage.default, {
      message: this.context.t('tokenDetectionAnnouncement', [/*#__PURE__*/_react.default.createElement(_button.default, {
        type: "link",
        key: "token-detection-announcement",
        className: "import-token__link",
        onClick: () => history.push(_routes.EXPERIMENTAL_ROUTE)
      }, this.context.t('enableFromSettings'))]),
      type: false,
      withRightButton: true,
      useIcon: true,
      iconFillColor: "#037DD6",
      className: "import-token__token-detection-announcement"
    }), /*#__PURE__*/_react.default.createElement(_tokenSearch.default, {
      onSearch: ({
        results = []
      }) => this.setState({
        searchResults: results
      }),
      error: tokenSelectorError,
      tokenList: tokenList
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "import-token__token-list"
    }, /*#__PURE__*/_react.default.createElement(_tokenList.default, {
      results: searchResults,
      selectedTokens: selectedTokens,
      onToggleToken: token => this.handleToggleToken(token)
    })));
  }

  renderTabs() {
    const {
      showSearchTab
    } = this.props;
    const tabs = [];

    if (showSearchTab) {
      tabs.push( /*#__PURE__*/_react.default.createElement(_tabs.Tab, {
        name: this.context.t('search'),
        key: "search-tab"
      }, this.renderSearchToken()));
    }

    tabs.push( /*#__PURE__*/_react.default.createElement(_tabs.Tab, {
      name: this.context.t('customToken'),
      key: "custom-tab"
    }, this.renderCustomTokenForm()));
    return /*#__PURE__*/_react.default.createElement(_tabs.Tabs, null, tabs);
  }

  render() {
    const {
      history,
      clearPendingTokens,
      mostRecentOverviewPage
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_pageContainer.default, {
      title: this.context.t('importTokensCamelCase'),
      tabsComponent: this.renderTabs(),
      onSubmit: () => this.handleNext(),
      hideCancel: true,
      disabled: Boolean(this.hasError()) || !this.hasSelected(),
      onClose: () => {
        clearPendingTokens();
        history.push(mostRecentOverviewPage);
      }
    });
  }

}

(0, _defineProperty2.default)(ImportToken, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(ImportToken, "propTypes", {
  history: _propTypes.default.object,
  setPendingTokens: _propTypes.default.func,
  pendingTokens: _propTypes.default.object,
  clearPendingTokens: _propTypes.default.func,
  tokens: _propTypes.default.array,
  identities: _propTypes.default.object,
  showSearchTab: _propTypes.default.bool.isRequired,
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  chainId: _propTypes.default.string,
  rpcPrefs: _propTypes.default.object,
  tokenList: _propTypes.default.object
});
(0, _defineProperty2.default)(ImportToken, "defaultProps", {
  tokenList: {}
});
var _default = ImportToken;
exports.default = _default;


//# sourceMappingURL=ui/pages/import-token/import-token.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/import-token/import-token.component.js",}],
[3619, {"./invalid-custom-network-alert":3620,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _invalidCustomNetworkAlert.default;
  }
});

var _invalidCustomNetworkAlert = _interopRequireDefault(require("./invalid-custom-network-alert"));

//# sourceMappingURL=ui/components/app/alerts/invalid-custom-network-alert/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/alerts/invalid-custom-network-alert/index.js",}],
[3621, {"./unconnected-account-alert":3622,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _unconnectedAccountAlert.default;
  }
});

var _unconnectedAccountAlert = _interopRequireDefault(require("./unconnected-account-alert"));

//# sourceMappingURL=ui/components/app/alerts/unconnected-account-alert/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/alerts/unconnected-account-alert/index.js",}],
[4264, {"../../components/app/tab-bar":3789,"../../helpers/constants/routes":3995,"./advanced-tab":4231,"./alerts-tab":4233,"./contact-list-tab":4242,"./experimental-tab":4248,"./info-tab":4250,"./networks-tab":4252,"./security-tab":4258,"./settings-tab":4261,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _classnames = _interopRequireDefault(require("classnames"));

var _tabBar = _interopRequireDefault(require("../../components/app/tab-bar"));

var _routes = require("../../helpers/constants/routes");

var _settingsTab = _interopRequireDefault(require("./settings-tab"));

var _alertsTab = _interopRequireDefault(require("./alerts-tab"));

var _networksTab = _interopRequireDefault(require("./networks-tab"));

var _advancedTab = _interopRequireDefault(require("./advanced-tab"));

var _infoTab = _interopRequireDefault(require("./info-tab"));

var _securityTab = _interopRequireDefault(require("./security-tab"));

var _contactListTab = _interopRequireDefault(require("./contact-list-tab"));

var _experimentalTab = _interopRequireDefault(require("./experimental-tab"));

class SettingsPage extends _react.PureComponent {
  render() {
    const {
      history,
      backRoute,
      currentPath,
      mostRecentOverviewPage
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('main-container settings-page', {
        'settings-page--selected': currentPath !== _routes.SETTINGS_ROUTE
      })
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__header"
    }, currentPath !== _routes.SETTINGS_ROUTE && /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__back-button",
      onClick: () => history.push(backRoute)
    }), this.renderTitle(), /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__close-button",
      onClick: () => history.push(mostRecentOverviewPage)
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__content__tabs"
    }, this.renderTabs()), /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__content__modules"
    }, this.renderSubHeader(), this.renderContent())));
  }

  renderTitle() {
    const {
      t
    } = this.context;
    const {
      isPopup,
      pathnameI18nKey,
      addressName
    } = this.props;
    let titleText;

    if (isPopup && addressName) {
      titleText = addressName;
    } else if (pathnameI18nKey && isPopup) {
      titleText = t(pathnameI18nKey);
    } else {
      titleText = t('settings');
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__header__title"
    }, titleText);
  }

  renderSubHeader() {
    const {
      t
    } = this.context;
    const {
      currentPath,
      isPopup,
      isAddressEntryPage,
      pathnameI18nKey,
      addressName,
      initialBreadCrumbRoute,
      breadCrumbTextKey,
      history,
      initialBreadCrumbKey
    } = this.props;
    let subheaderText;

    if (isPopup && isAddressEntryPage) {
      subheaderText = t('settings');
    } else if (initialBreadCrumbKey) {
      subheaderText = t(initialBreadCrumbKey);
    } else {
      subheaderText = t(pathnameI18nKey || 'contacts');
    }

    return !currentPath.startsWith(_routes.NETWORKS_ROUTE) && /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__subheader"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)({
        'settings-page__subheader--link': initialBreadCrumbRoute
      }),
      onClick: () => initialBreadCrumbRoute && history.push(initialBreadCrumbRoute)
    }, subheaderText), breadCrumbTextKey && /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__subheader--break"
    }, /*#__PURE__*/_react.default.createElement("span", null, ' > '), t(breadCrumbTextKey)), isAddressEntryPage && /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__subheader--break"
    }, /*#__PURE__*/_react.default.createElement("span", null, ' > '), addressName));
  }

  renderTabs() {
    const {
      history,
      currentPath
    } = this.props;
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_tabBar.default, {
      tabs: [{
        content: t('general'),
        description: t('generalSettingsDescription'),
        key: _routes.GENERAL_ROUTE
      }, {
        content: t('advanced'),
        description: t('advancedSettingsDescription'),
        key: _routes.ADVANCED_ROUTE
      }, // {
      //   content: t('contacts'),
      //   description: t('contactsSettingsDescription'),
      //   key: CONTACT_LIST_ROUTE,
      // },
      {
        content: t('securityAndPrivacy'),
        description: t('securitySettingsDescription'),
        key: _routes.SECURITY_ROUTE
      }, {
        content: t('alerts'),
        description: t('alertsSettingsDescription'),
        key: _routes.ALERTS_ROUTE
      } // {
      //   content: t('networks'),
      //   description: t('networkSettingsDescription'),
      //   key: NETWORKS_ROUTE,
      // },
      // {
      //   content: t('experimental'),
      //   description: t('experimentalSettingsDescription'),
      //   key: EXPERIMENTAL_ROUTE,
      // },
      // {
      //   content: t('about'),
      //   description: t('aboutSettingsDescription'),
      //   key: ABOUT_US_ROUTE,
      // },
      ],
      isActive: key => {
        if (key === _routes.GENERAL_ROUTE && currentPath === _routes.SETTINGS_ROUTE) {
          return true;
        }

        return (0, _reactRouterDom.matchPath)(currentPath, {
          path: key,
          exact: true
        });
      },
      onSelect: key => history.push(key)
    });
  }

  renderContent() {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.GENERAL_ROUTE,
      component: _settingsTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.ABOUT_US_ROUTE,
      component: _infoTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.ADVANCED_ROUTE,
      component: _advancedTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.ALERTS_ROUTE,
      component: _alertsTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.NETWORKS_ROUTE,
      component: _networksTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.SECURITY_ROUTE,
      component: _securityTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.EXPERIMENTAL_ROUTE,
      component: _experimentalTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.CONTACT_LIST_ROUTE,
      component: _contactListTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.CONTACT_ADD_ROUTE,
      component: _contactListTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONTACT_EDIT_ROUTE}/:id`,
      component: _contactListTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONTACT_VIEW_ROUTE}/:id`,
      component: _contactListTab.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      component: _settingsTab.default
    }));
  }

}

(0, _defineProperty2.default)(SettingsPage, "propTypes", {
  addressName: _propTypes.default.string,
  backRoute: _propTypes.default.string,
  currentPath: _propTypes.default.string,
  history: _propTypes.default.object,
  isAddressEntryPage: _propTypes.default.bool,
  isPopup: _propTypes.default.bool,
  pathnameI18nKey: _propTypes.default.string,
  initialBreadCrumbRoute: _propTypes.default.string,
  breadCrumbTextKey: _propTypes.default.string,
  initialBreadCrumbKey: _propTypes.default.string,
  mostRecentOverviewPage: _propTypes.default.string.isRequired
});
(0, _defineProperty2.default)(SettingsPage, "contextTypes", {
  t: _propTypes.default.func
});
var _default = SettingsPage;
exports.default = _default;

//# sourceMappingURL=ui/pages/settings/settings.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/settings.component.js",}],
[4035, {"../store/actions":4331,"react":3121}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSafeGasEstimatePolling = useSafeGasEstimatePolling;

var _react = require("react");

var _actions = require("../store/actions");

/**
 * Provides a reusable hook that can be used for safely updating the polling
 * data in the gas fee controller. It makes a request to get estimates and
 * begin polling, keeping track of the poll token for the lifetime of the hook.
 * It then disconnects polling upon unmount. If the hook is unmounted while waiting
 * for `getGasFeeEstimatesAndStartPolling` to resolve, the `active` flag ensures
 * that a call to disconnect happens after promise resolution.
 */
function useSafeGasEstimatePolling() {
  (0, _react.useEffect)(() => {
    let active = true;
    let pollToken;

    const cleanup = () => {
      active = false;

      if (pollToken) {
        (0, _actions.disconnectGasFeeEstimatePoller)(pollToken);
        (0, _actions.removePollingTokenFromAppState)(pollToken);
      }
    };

    (0, _actions.getGasFeeEstimatesAndStartPolling)().then(newPollToken => {
      if (active) {
        pollToken = newPollToken;
        (0, _actions.addPollingTokenToAppState)(pollToken);
      } else {
        (0, _actions.disconnectGasFeeEstimatePoller)(newPollToken);
        (0, _actions.removePollingTokenFromAppState)(pollToken);
      }
    });
    window.addEventListener('beforeunload', cleanup);
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);
}

//# sourceMappingURL=ui/hooks/useSafeGasEstimatePolling.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useSafeGasEstimatePolling.js",}],
[4026, {"lodash":2646,"react":3121}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEqualityCheck = useEqualityCheck;

var _react = require("react");

var _lodash = require("lodash");

/**
 * Given a value and a function to determine equality, return a
 * referentially equal value if the equality function returns true.
 * This hook is helpful in avoiding re-renders and effects running
 * based on an object or value that always changes references but
 * infrequently changes it's value. By default, uses isEqual from
 * lodash. This is typically only useful with objects and arrays.
 *
 * @param {T} value - any value to check equality of
 * @param {(T, T) => boolean} equalityFn - A function to determine equality
 * @returns {T}
 */
function useEqualityCheck(value, equalityFn = _lodash.isEqual) {
  const [computedValue, setComputedValue] = (0, _react.useState)(value);
  (0, _react.useLayoutEffect)(() => {
    if (!equalityFn(value, computedValue)) {
      setComputedValue(value);
    }
  }, [value, equalityFn, computedValue]);
  return computedValue;
}

//# sourceMappingURL=ui/hooks/useEqualityCheck.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useEqualityCheck.js",}],
[4266, {"../../../components/ui/box":3838,"../../../components/ui/pulse-loader":3927,"../../../components/ui/typography":3964,"../../../contexts/i18n":3970,"../../../ducks/swaps/swaps":3988,"../../../helpers/constants/design-system":3992,"../../../helpers/constants/routes":3995,"../../../hooks/useMetricEvent":4032,"../../../selectors/selectors":4328,"../swaps-footer":4311,"./swap-step-icon":4268,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AwaitingSignatures;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _i18n = require("../../../contexts/i18n");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _swaps = require("../../../ducks/swaps/swaps");

var _selectors = require("../../../selectors/selectors");

var _routes = require("../../../helpers/constants/routes");

var _pulseLoader = _interopRequireDefault(require("../../../components/ui/pulse-loader"));

var _typography = _interopRequireDefault(require("../../../components/ui/typography"));

var _box = _interopRequireDefault(require("../../../components/ui/box"));

var _designSystem = require("../../../helpers/constants/design-system");

var _swapsFooter = _interopRequireDefault(require("../swaps-footer"));

var _swapStepIcon = _interopRequireDefault(require("./swap-step-icon"));

function AwaitingSignatures() {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const history = (0, _reactRouterDom.useHistory)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const fetchParams = (0, _reactRedux.useSelector)(_swaps.getFetchParams);
  const {
    destinationTokenInfo,
    sourceTokenInfo
  } = (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.metaData) || {};
  const approveTxParams = (0, _reactRedux.useSelector)(_swaps.getApproveTxParams);
  const hardwareWalletUsed = (0, _reactRedux.useSelector)(_selectors.isHardwareWallet);
  const hardwareWalletType = (0, _reactRedux.useSelector)(_selectors.getHardwareWalletType);
  const needsTwoConfirmations = Boolean(approveTxParams);
  const awaitingSignaturesEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Awaiting Signature(s) on a HW wallet',
    sensitiveProperties: {
      needs_two_confirmations: needsTwoConfirmations,
      token_from: sourceTokenInfo === null || sourceTokenInfo === void 0 ? void 0 : sourceTokenInfo.symbol,
      token_from_amount: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.value,
      token_to: destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.symbol,
      request_type: fetchParams !== null && fetchParams !== void 0 && fetchParams.balanceError ? 'Quote' : 'Order',
      slippage: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage,
      custom_slippage: (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage) === 2,
      is_hardware_wallet: hardwareWalletUsed,
      hardware_wallet_type: hardwareWalletType
    },
    category: 'swaps'
  });
  (0, _react.useEffect)(() => {
    awaitingSignaturesEvent(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const headerText = needsTwoConfirmations ? t('swapTwoTransactions') : t('swapConfirmWithHwWallet');
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "awaiting-signatures"
  }, /*#__PURE__*/_react.default.createElement(_box.default, {
    paddingLeft: 8,
    paddingRight: 8,
    height: _designSystem.BLOCK_SIZES.FULL,
    justifyContent: _designSystem.JUSTIFY_CONTENT.CENTER,
    display: _designSystem.DISPLAY.FLEX,
    className: "awaiting-signatures__content"
  }, /*#__PURE__*/_react.default.createElement(_box.default, {
    marginTop: 3,
    marginBottom: 4
  }, /*#__PURE__*/_react.default.createElement(_pulseLoader.default, null)), /*#__PURE__*/_react.default.createElement(_typography.default, {
    color: _designSystem.COLORS.BLACK,
    variant: _designSystem.TYPOGRAPHY.H3
  }, headerText), needsTwoConfirmations && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_typography.default, {
    variant: _designSystem.TYPOGRAPHY.Paragraph,
    boxProps: {
      marginTop: 2
    },
    fontWeight: _designSystem.FONT_WEIGHT.BOLD
  }, t('swapToConfirmWithHwWallet')), /*#__PURE__*/_react.default.createElement("ul", {
    className: "awaiting-signatures__steps"
  }, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_swapStepIcon.default, {
    stepNumber: 1
  }), t('swapAllowSwappingOf', [/*#__PURE__*/_react.default.createElement(_typography.default, {
    tag: "span",
    fontWeight: _designSystem.FONT_WEIGHT.BOLD,
    key: "allowToken"
  }, destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.symbol)])), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_swapStepIcon.default, {
    stepNumber: 2
  }), t('swapFromTo', [/*#__PURE__*/_react.default.createElement(_typography.default, {
    tag: "span",
    fontWeight: _designSystem.FONT_WEIGHT.BOLD,
    key: "tokenFrom"
  }, sourceTokenInfo === null || sourceTokenInfo === void 0 ? void 0 : sourceTokenInfo.symbol), /*#__PURE__*/_react.default.createElement(_typography.default, {
    tag: "span",
    fontWeight: _designSystem.FONT_WEIGHT.BOLD,
    key: "tokenTo"
  }, destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.symbol)]))), /*#__PURE__*/_react.default.createElement(_typography.default, {
    variant: _designSystem.TYPOGRAPHY.Paragraph
  }, t('swapGasFeesSplit')))), /*#__PURE__*/_react.default.createElement(_swapsFooter.default, {
    onSubmit: async () => {
      await dispatch((0, _swaps.prepareToLeaveSwaps)()); // Go to the default route and then to the build quote route in order to clean up
      // the `inputValue` local state in `pages/swaps/index.js`

      history.push(_routes.DEFAULT_ROUTE);
      history.push(_routes.BUILD_QUOTE_ROUTE);
    },
    submitText: t('cancel'),
    hideCancel: true
  }));
}

//# sourceMappingURL=ui/pages/swaps/awaiting-signatures/awaiting-signatures.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-signatures/awaiting-signatures.js",}],
[4293, {"../../../components/ui/mascot":3910,"../../../contexts/i18n":3970,"../../../contexts/metametrics.new":3972,"../../../ducks/swaps/swaps":3988,"../../../selectors/selectors":4328,"../swaps-footer":4311,"./background-animation":4291,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"events":1429,"lodash":2646,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LoadingSwapsQuotes;

var _events = _interopRequireDefault(require("events"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _reactRouterDom = require("react-router-dom");

var _swaps = require("../../../ducks/swaps/swaps");

var _selectors = require("../../../selectors/selectors");

var _i18n = require("../../../contexts/i18n");

var _metametrics = require("../../../contexts/metametrics.new");

var _mascot = _interopRequireDefault(require("../../../components/ui/mascot"));

var _swapsFooter = _interopRequireDefault(require("../swaps-footer"));

var _backgroundAnimation = _interopRequireDefault(require("./background-animation"));

function LoadingSwapsQuotes({
  aggregatorMetadata,
  loadingComplete,
  onDone
}) {
  var _fetchParams$sourceTo, _fetchParams$destinat;

  const t = (0, _react.useContext)(_i18n.I18nContext);
  const metaMetricsEvent = (0, _react.useContext)(_metametrics.MetaMetricsContext);
  const dispatch = (0, _reactRedux.useDispatch)();
  const history = (0, _reactRouterDom.useHistory)();
  const animationEventEmitter = (0, _react.useRef)(new _events.default());
  const fetchParams = (0, _reactRedux.useSelector)(_swaps.getFetchParams);
  const quotesFetchStartTime = (0, _reactRedux.useSelector)(_swaps.getQuotesFetchStartTime);
  const hardwareWalletUsed = (0, _reactRedux.useSelector)(_selectors.isHardwareWallet);
  const hardwareWalletType = (0, _reactRedux.useSelector)(_selectors.getHardwareWalletType);
  const quotesRequestCancelledEventConfig = {
    event: 'Quotes Request Cancelled',
    category: 'swaps',
    sensitiveProperties: {
      token_from: fetchParams === null || fetchParams === void 0 ? void 0 : (_fetchParams$sourceTo = fetchParams.sourceTokenInfo) === null || _fetchParams$sourceTo === void 0 ? void 0 : _fetchParams$sourceTo.symbol,
      token_from_amount: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.value,
      request_type: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.balanceError,
      token_to: fetchParams === null || fetchParams === void 0 ? void 0 : (_fetchParams$destinat = fetchParams.destinationTokenInfo) === null || _fetchParams$destinat === void 0 ? void 0 : _fetchParams$destinat.symbol,
      slippage: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage,
      custom_slippage: (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage) !== 2,
      response_time: Date.now() - quotesFetchStartTime,
      is_hardware_wallet: hardwareWalletUsed,
      hardware_wallet_type: hardwareWalletType
    }
  };
  const [aggregatorNames] = (0, _react.useState)(() => (0, _lodash.shuffle)(Object.keys(aggregatorMetadata)));
  const numberOfQuotes = aggregatorNames.length;
  const mascotContainer = (0, _react.useRef)();
  const currentMascotContainer = mascotContainer.current;
  const [quoteCount, updateQuoteCount] = (0, _react.useState)(0);
  const [midPointTarget, setMidpointTarget] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    let timeoutLength; // The below logic simulates a sequential loading of the aggregator quotes, even though we are fetching them all with a single call.
    // This is to give the user a sense of progress. The callback passed to `setTimeout` updates the quoteCount and therefore causes
    // a new logo to be shown, the fox to look at that logo, the logo bar and aggregator name to update.

    if (loadingComplete) {
      // If loading is complete, but the quoteCount is not, we quickly display the remaining logos/names/fox looks. 0.2s each
      timeoutLength = 20;
    } else {
      // If loading is not complete, we display remaining logos/names/fox looks at random intervals between 0.5s and 2s, to simulate the
      // sort of loading a user would experience in most async scenarios
      timeoutLength = 500 + Math.floor(Math.random() * 1500);
    }

    const quoteCountTimeout = setTimeout(() => {
      if (quoteCount < numberOfQuotes) {
        updateQuoteCount(quoteCount + 1);
      } else if (quoteCount === numberOfQuotes && loadingComplete) {
        onDone();
      }
    }, timeoutLength);
    return function cleanup() {
      clearTimeout(quoteCountTimeout);
    };
  }, [quoteCount, loadingComplete, onDone, numberOfQuotes]);
  (0, _react.useEffect)(() => {
    if (currentMascotContainer) {
      const {
        top,
        left,
        width,
        height
      } = currentMascotContainer.getBoundingClientRect();
      const center = {
        x: left + width / 2,
        y: top + height / 2
      };
      setMidpointTarget(center);
    }
  }, [currentMascotContainer]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__content"
  }, /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__quote-counter"
  }, /*#__PURE__*/_react.default.createElement("span", null, t('swapQuoteNofN', [Math.min(quoteCount + 1, numberOfQuotes), numberOfQuotes]))), /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__quote-name-check"
  }, /*#__PURE__*/_react.default.createElement("span", null, t('swapFetchingQuotes'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__loading-bar-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__loading-bar",
    style: {
      width: `${100 / numberOfQuotes * quoteCount}%`
    }
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__animation"
  }, /*#__PURE__*/_react.default.createElement(_backgroundAnimation.default, null), /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__mascot-container",
    ref: mascotContainer
  }, /*#__PURE__*/_react.default.createElement(_mascot.default, {
    animationEventEmitter: animationEventEmitter.current,
    width: "90",
    height: "90",
    followMouse: false,
    lookAtTarget: midPointTarget
  })))), /*#__PURE__*/_react.default.createElement(_swapsFooter.default, {
    submitText: t('back'),
    onSubmit: async () => {
      metaMetricsEvent(quotesRequestCancelledEventConfig);
      await dispatch((0, _swaps.navigateBackToBuildQuote)(history));
    },
    hideCancel: true
  }));
}

LoadingSwapsQuotes.propTypes = {
  loadingComplete: _propTypes.default.bool.isRequired,
  onDone: _propTypes.default.func.isRequired,
  aggregatorMetadata: _propTypes.default.objectOf(_propTypes.default.shape({
    title: _propTypes.default.string,
    color: _propTypes.default.string,
    icon: _propTypes.default.string
  }))
};

//# sourceMappingURL=ui/pages/swaps/loading-swaps-quotes/loading-swaps-quotes.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/loading-swaps-quotes/loading-swaps-quotes.js",}],
[4269, {"../../../../shared/constants/swaps":3597,"../../../../shared/modules/swaps.utils":3608,"../../../components/ui/box":3838,"../../../components/ui/mascot":3910,"../../../components/ui/pulse-loader":3927,"../../../contexts/i18n":3970,"../../../contexts/metametrics.new":3972,"../../../ducks/swaps/swaps":3988,"../../../helpers/constants/routes":3995,"../../../hooks/useMetricEvent":4032,"../../../selectors":4326,"../../../store/actions":4331,"../swaps-footer":4311,"../swaps.util":4316,"./quotes-timeout-icon":4271,"./swap-failure-icon":4272,"./swap-success-icon":4273,"./view-on-ether-scan-link":4274,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/etherscan-link":966,"events":1429,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AwaitingSwap;

var _events = _interopRequireDefault(require("events"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _etherscanLink = require("@metamask/etherscan-link");

var _i18n = require("../../../contexts/i18n");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _metametrics = require("../../../contexts/metametrics.new");

var _selectors = require("../../../selectors");

var _swaps = require("../../../ducks/swaps/swaps");

var _mascot = _interopRequireDefault(require("../../../components/ui/mascot"));

var _box = _interopRequireDefault(require("../../../components/ui/box"));

var _swaps2 = require("../../../../shared/constants/swaps");

var _swaps3 = require("../../../../shared/modules/swaps.utils");

var _pulseLoader = _interopRequireDefault(require("../../../components/ui/pulse-loader"));

var _routes = require("../../../helpers/constants/routes");

var _actions = require("../../../store/actions");

var _swaps4 = require("../swaps.util");

var _swapsFooter = _interopRequireDefault(require("../swaps-footer"));

var _swapFailureIcon = _interopRequireDefault(require("./swap-failure-icon"));

var _swapSuccessIcon = _interopRequireDefault(require("./swap-success-icon"));

var _quotesTimeoutIcon = _interopRequireDefault(require("./quotes-timeout-icon"));

var _viewOnEtherScanLink = _interopRequireDefault(require("./view-on-ether-scan-link"));

function AwaitingSwap({
  swapComplete,
  errorKey,
  txHash,
  tokensReceived,
  submittingSwap,
  inputValue,
  maxSlippage
}) {
  var _ref, _rpcPrefs$blockExplor;

  const t = (0, _react.useContext)(_i18n.I18nContext);
  const metaMetricsEvent = (0, _react.useContext)(_metametrics.MetaMetricsContext);
  const history = (0, _reactRouterDom.useHistory)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const animationEventEmitter = (0, _react.useRef)(new _events.default());
  const fetchParams = (0, _reactRedux.useSelector)(_swaps.getFetchParams);
  const {
    destinationTokenInfo,
    sourceTokenInfo
  } = (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.metaData) || {};
  const usedQuote = (0, _reactRedux.useSelector)(_swaps.getUsedQuote);
  const approveTxParams = (0, _reactRedux.useSelector)(_swaps.getApproveTxParams);
  const swapsGasPrice = (0, _reactRedux.useSelector)(_swaps.getUsedSwapsGasPrice);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  const usdConversionRate = (0, _reactRedux.useSelector)(_selectors.getUSDConversionRate);
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const rpcPrefs = (0, _reactRedux.useSelector)(_selectors.getRpcPrefsForCurrentProvider);
  const [trackedQuotesExpiredEvent, setTrackedQuotesExpiredEvent] = (0, _react.useState)(false);
  let feeinUnformattedFiat;

  if (usedQuote && swapsGasPrice) {
    var _usedQuote$trade;

    const renderableNetworkFees = (0, _swaps4.getRenderableNetworkFeesForQuote)({
      tradeGas: usedQuote.gasEstimateWithRefund || usedQuote.averageGas,
      approveGas: (approveTxParams === null || approveTxParams === void 0 ? void 0 : approveTxParams.gas) || '0x0',
      gasPrice: swapsGasPrice,
      currentCurrency,
      conversionRate: usdConversionRate,
      tradeValue: usedQuote === null || usedQuote === void 0 ? void 0 : (_usedQuote$trade = usedQuote.trade) === null || _usedQuote$trade === void 0 ? void 0 : _usedQuote$trade.value,
      sourceSymbol: sourceTokenInfo === null || sourceTokenInfo === void 0 ? void 0 : sourceTokenInfo.symbol,
      sourceAmount: usedQuote.sourceAmount,
      chainId
    });
    feeinUnformattedFiat = renderableNetworkFees.rawNetworkFees;
  }

  const hardwareWalletUsed = (0, _reactRedux.useSelector)(_selectors.isHardwareWallet);
  const hardwareWalletType = (0, _reactRedux.useSelector)(_selectors.getHardwareWalletType);
  const sensitiveProperties = {
    token_from: sourceTokenInfo === null || sourceTokenInfo === void 0 ? void 0 : sourceTokenInfo.symbol,
    token_from_amount: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.value,
    token_to: destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.symbol,
    request_type: fetchParams !== null && fetchParams !== void 0 && fetchParams.balanceError ? 'Quote' : 'Order',
    slippage: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage,
    custom_slippage: (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage) === 2,
    gas_fees: feeinUnformattedFiat,
    is_hardware_wallet: hardwareWalletUsed,
    hardware_wallet_type: hardwareWalletType
  };
  const quotesExpiredEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Quotes Timed Out',
    sensitiveProperties,
    category: 'swaps'
  });
  const makeAnotherSwapEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Make Another Swap',
    sensitiveProperties,
    category: 'swaps'
  });
  const baseNetworkUrl = (_ref = (_rpcPrefs$blockExplor = rpcPrefs.blockExplorerUrl) !== null && _rpcPrefs$blockExplor !== void 0 ? _rpcPrefs$blockExplor : _swaps2.SWAPS_CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP[chainId]) !== null && _ref !== void 0 ? _ref : null;
  const blockExplorerUrl = (0, _etherscanLink.getBlockExplorerLink)({
    hash: txHash,
    chainId
  }, {
    blockExplorerUrl: baseNetworkUrl
  });
  const isCustomBlockExplorerUrl = Boolean(_swaps2.SWAPS_CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP[chainId] || rpcPrefs.blockExplorerUrl);
  let headerText;
  let statusImage;
  let descriptionText;
  let submitText;
  let content;

  if (errorKey === _swaps2.OFFLINE_FOR_MAINTENANCE) {
    headerText = t('offlineForMaintenance');
    descriptionText = t('metamaskSwapsOfflineDescription');
    submitText = t('close');
    statusImage = /*#__PURE__*/_react.default.createElement(_swapFailureIcon.default, null);
  } else if (errorKey === _swaps2.SWAP_FAILED_ERROR) {
    headerText = t('swapFailedErrorTitle');
    descriptionText = t('swapFailedErrorDescriptionWithSupportLink', [/*#__PURE__*/_react.default.createElement("a", {
      className: "awaiting-swap__support-link",
      key: "awaiting-swap-support-link",
      href: "https://discord.gg/RCBhq6b6gA",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "support.metamask.io")]);
    submitText = t('tryAgain');
    statusImage = /*#__PURE__*/_react.default.createElement(_swapFailureIcon.default, null);
    content = blockExplorerUrl && /*#__PURE__*/_react.default.createElement(_viewOnEtherScanLink.default, {
      txHash: txHash,
      blockExplorerUrl: blockExplorerUrl,
      isCustomBlockExplorerUrl: isCustomBlockExplorerUrl
    });
  } else if (errorKey === _swaps2.QUOTES_EXPIRED_ERROR) {
    headerText = t('swapQuotesExpiredErrorTitle');
    descriptionText = t('swapQuotesExpiredErrorDescription');
    submitText = t('tryAgain');
    statusImage = /*#__PURE__*/_react.default.createElement(_quotesTimeoutIcon.default, null);

    if (!trackedQuotesExpiredEvent) {
      setTrackedQuotesExpiredEvent(true);
      quotesExpiredEvent();
    }
  } else if (errorKey === _swaps2.ERROR_FETCHING_QUOTES) {
    headerText = t('swapFetchingQuotesErrorTitle');
    descriptionText = t('swapFetchingQuotesErrorDescription');
    submitText = t('back');
    statusImage = /*#__PURE__*/_react.default.createElement(_swapFailureIcon.default, null);
  } else if (errorKey === _swaps2.QUOTES_NOT_AVAILABLE_ERROR) {
    headerText = t('swapQuotesNotAvailableErrorTitle');
    descriptionText = t('swapQuotesNotAvailableErrorDescription');
    submitText = t('tryAgain');
    statusImage = /*#__PURE__*/_react.default.createElement(_swapFailureIcon.default, null);
  } else if (errorKey === _swaps2.CONTRACT_DATA_DISABLED_ERROR) {
    headerText = t('swapContractDataDisabledErrorTitle');
    descriptionText = t('swapContractDataDisabledErrorDescription');
    submitText = t('tryAgain');
    statusImage = /*#__PURE__*/_react.default.createElement(_swapFailureIcon.default, null);
  } else if (!errorKey && !swapComplete) {
    headerText = t('swapProcessing');
    statusImage = /*#__PURE__*/_react.default.createElement(_pulseLoader.default, null);
    submitText = t('swapsViewInActivity');
    descriptionText = t('swapOnceTransactionHasProcess', [/*#__PURE__*/_react.default.createElement("span", {
      key: "swapOnceTransactionHasProcess-1",
      className: "awaiting-swap__amount-and-symbol"
    }, destinationTokenInfo.symbol)]);
    content = blockExplorerUrl && /*#__PURE__*/_react.default.createElement(_viewOnEtherScanLink.default, {
      txHash: txHash,
      blockExplorerUrl: blockExplorerUrl,
      isCustomBlockExplorerUrl: isCustomBlockExplorerUrl
    });
  } else if (!errorKey && swapComplete) {
    headerText = t('swapTransactionComplete');
    statusImage = /*#__PURE__*/_react.default.createElement(_swapSuccessIcon.default, null);
    submitText = t('close');
    descriptionText = t('swapTokenAvailable', [/*#__PURE__*/_react.default.createElement("span", {
      key: "swapTokenAvailable-2",
      className: "awaiting-swap__amount-and-symbol"
    }, `${tokensReceived || ''} ${destinationTokenInfo.symbol}`)]);
    content = blockExplorerUrl && /*#__PURE__*/_react.default.createElement(_viewOnEtherScanLink.default, {
      txHash: txHash,
      blockExplorerUrl: blockExplorerUrl,
      isCustomBlockExplorerUrl: isCustomBlockExplorerUrl
    });
  }

  const MakeAnotherSwap = () => {
    return /*#__PURE__*/_react.default.createElement(_box.default, {
      marginBottom: 3
    }, /*#__PURE__*/_react.default.createElement("a", {
      href: "#",
      onClick: () => {
        makeAnotherSwapEvent();
        dispatch((0, _swaps.navigateBackToBuildQuote)(history));
      }
    }, t('makeAnotherSwap')));
  };

  (0, _react.useEffect)(() => {
    if (errorKey) {
      // If there was an error, stop polling for quotes.
      dispatch((0, _actions.stopPollingForQuotes)());
    }
  }, [dispatch, errorKey]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "awaiting-swap"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "awaiting-swap__content"
  }, !(swapComplete || errorKey) && /*#__PURE__*/_react.default.createElement(_mascot.default, {
    animationEventEmitter: animationEventEmitter.current,
    width: "90",
    height: "90"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "awaiting-swap__status-image"
  }, statusImage), /*#__PURE__*/_react.default.createElement("div", {
    className: "awaiting-swap__header"
  }, headerText), /*#__PURE__*/_react.default.createElement("div", {
    className: "awaiting-swap__main-descrption"
  }, descriptionText), content), !errorKey && swapComplete && /*#__PURE__*/_react.default.createElement(MakeAnotherSwap, null), /*#__PURE__*/_react.default.createElement(_swapsFooter.default, {
    onSubmit: async () => {
      if (errorKey === _swaps2.OFFLINE_FOR_MAINTENANCE) {
        await dispatch((0, _swaps.prepareToLeaveSwaps)());
        history.push(_routes.DEFAULT_ROUTE);
      } else if (errorKey === _swaps2.QUOTES_EXPIRED_ERROR) {
        dispatch((0, _swaps.prepareForRetryGetQuotes)());
        await dispatch((0, _swaps.fetchQuotesAndSetQuoteState)(history, inputValue, maxSlippage, metaMetricsEvent));
      } else if (errorKey) {
        await dispatch((0, _swaps.navigateBackToBuildQuote)(history));
      } else if ((0, _swaps3.isSwapsDefaultTokenSymbol)(destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.symbol, chainId) || swapComplete) {
        history.push(_routes.DEFAULT_ROUTE);
      } else {
        history.push(`${_routes.ASSET_ROUTE}/${destinationTokenInfo === null || destinationTokenInfo === void 0 ? void 0 : destinationTokenInfo.address}`);
      }
    },
    onCancel: async () => await dispatch((0, _swaps.navigateBackToBuildQuote)(history)),
    submitText: submitText,
    disabled: submittingSwap,
    hideCancel: errorKey !== _swaps2.QUOTES_EXPIRED_ERROR
  }));
}

AwaitingSwap.propTypes = {
  swapComplete: _propTypes.default.bool,
  txHash: _propTypes.default.string,
  tokensReceived: _propTypes.default.string,
  errorKey: _propTypes.default.oneOf([_swaps2.QUOTES_EXPIRED_ERROR, _swaps2.SWAP_FAILED_ERROR, _swaps2.ERROR_FETCHING_QUOTES, _swaps2.QUOTES_NOT_AVAILABLE_ERROR, _swaps2.OFFLINE_FOR_MAINTENANCE, _swaps2.CONTRACT_DATA_DISABLED_ERROR]),
  submittingSwap: _propTypes.default.bool,
  inputValue: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  maxSlippage: _propTypes.default.number
};


//# sourceMappingURL=ui/pages/swaps/awaiting-swap/awaiting-swap.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-swap/awaiting-swap.js",}],
[4319, {"../../../../shared/constants/gas":3592,"../../../../shared/constants/swaps":3597,"../../../components/app/edit-gas-popover/edit-gas-popover.component":3668,"../../../components/ui/actionable-message/actionable-message":3835,"../../../contexts/i18n":3970,"../../../contexts/metametrics.new":3972,"../../../ducks/metamask/metamask":3985,"../../../ducks/swaps/swaps":3988,"../../../helpers/constants/routes":3995,"../../../helpers/utils/conversions.util":4009,"../../../helpers/utils/token-util":4017,"../../../helpers/utils/transactions.util":4018,"../../../helpers/utils/util":4020,"../../../hooks/useEqualityCheck":4026,"../../../hooks/useEthFiatAmount":4027,"../../../hooks/useGasFeeInputs":4029,"../../../hooks/useMetricEvent":4032,"../../../hooks/usePrevious":4034,"../../../hooks/useTokenTracker":4043,"../../../selectors":4326,"../../../store/actions":4331,"../../confirm-approve/confirm-approve.util":4061,"../../send/send.utils":4228,"../countdown-timer":4279,"../fee-card":4287,"../main-quote-summary":4294,"../select-quote-popover":4302,"../swaps-footer":4311,"../swaps.util":4316,"./view-quote-price-difference":4318,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"bignumber.js":1351,"classnames":1449,"lodash":2646,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ViewQuote;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _lodash = require("lodash");

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../../contexts/i18n");

var _selectQuotePopover = _interopRequireDefault(require("../select-quote-popover"));

var _useEthFiatAmount = require("../../../hooks/useEthFiatAmount");

var _useEqualityCheck = require("../../../hooks/useEqualityCheck");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _usePrevious = require("../../../hooks/usePrevious");

var _useGasFeeInputs = require("../../../hooks/useGasFeeInputs");

var _metametrics = require("../../../contexts/metametrics.new");

var _feeCard = _interopRequireDefault(require("../fee-card"));

var _editGasPopover = _interopRequireDefault(require("../../../components/app/edit-gas-popover/edit-gas-popover.component"));

var _swaps = require("../../../ducks/swaps/swaps");

var _selectors = require("../../../selectors");

var _metamask = require("../../../ducks/metamask/metamask");

var _util = require("../../../helpers/utils/util");

var _actions = require("../../../store/actions");

var _routes = require("../../../helpers/constants/routes");

var _transactions = require("../../../helpers/utils/transactions.util");

var _tokenUtil = require("../../../helpers/utils/token-util");

var _conversions = require("../../../helpers/utils/conversions.util");

var _mainQuoteSummary = _interopRequireDefault(require("../main-quote-summary"));

var _send = require("../../send/send.utils");

var _confirmApprove = require("../../confirm-approve/confirm-approve.util");

var _actionableMessage = _interopRequireDefault(require("../../../components/ui/actionable-message/actionable-message"));

var _swaps2 = require("../swaps.util");

var _useTokenTracker = require("../../../hooks/useTokenTracker");

var _swaps3 = require("../../../../shared/constants/swaps");

var _gas = require("../../../../shared/constants/gas");

var _countdownTimer = _interopRequireDefault(require("../countdown-timer"));

var _swapsFooter = _interopRequireDefault(require("../swaps-footer"));

var _viewQuotePriceDifference = _interopRequireDefault(require("./view-quote-price-difference"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function ViewQuote() {
  var _usedQuote$trade$valu, _usedQuote$trade, _usedQuote$priceSlipp, _usedQuote$priceSlipp2, _usedQuote$priceSlipp3, _usedQuote$priceSlipp4, _usedQuote$priceSlipp5;

  const history = (0, _reactRouterDom.useHistory)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const metaMetricsEvent = (0, _react.useContext)(_metametrics.MetaMetricsContext);
  const [dispatchedSafeRefetch, setDispatchedSafeRefetch] = (0, _react.useState)(false);
  const [submitClicked, setSubmitClicked] = (0, _react.useState)(false);
  const [selectQuotePopoverShown, setSelectQuotePopoverShown] = (0, _react.useState)(false);
  const [warningHidden, setWarningHidden] = (0, _react.useState)(false);
  const [originalApproveAmount, setOriginalApproveAmount] = (0, _react.useState)(null);
  const [showEditGasPopover, setShowEditGasPopover] = (0, _react.useState)(false); // We need to have currentTimestamp in state, otherwise it would change with each rerender.

  const [currentTimestamp] = (0, _react.useState)(Date.now());
  const [acknowledgedPriceDifference, setAcknowledgedPriceDifference] = (0, _react.useState)(false);
  const priceDifferenceRiskyBuckets = ['high', 'medium'];
  const routeState = (0, _reactRedux.useSelector)(_swaps.getBackgroundSwapRouteState);
  const quotes = (0, _reactRedux.useSelector)(_swaps.getQuotes, _lodash.isEqual);
  (0, _react.useEffect)(() => {
    if (!Object.values(quotes).length) {
      history.push(_routes.BUILD_QUOTE_ROUTE);
    } else if (routeState === 'awaiting') {
      history.push(_routes.AWAITING_SWAP_ROUTE);
    }
  }, [history, quotes, routeState]);
  const quotesLastFetched = (0, _reactRedux.useSelector)(_swaps.getQuotesLastFetched); // Select necessary data

  const gasPrice = (0, _reactRedux.useSelector)(_swaps.getUsedSwapsGasPrice);
  const customMaxGas = (0, _reactRedux.useSelector)(_swaps.getCustomSwapsGas);
  const customMaxFeePerGas = (0, _reactRedux.useSelector)(_swaps.getCustomMaxFeePerGas);
  const customMaxPriorityFeePerGas = (0, _reactRedux.useSelector)(_swaps.getCustomMaxPriorityFeePerGas);
  const swapsUserFeeLevel = (0, _reactRedux.useSelector)(_swaps.getSwapsUserFeeLevel);
  const tokenConversionRates = (0, _reactRedux.useSelector)(_selectors.getTokenExchangeRates);
  const memoizedTokenConversionRates = (0, _useEqualityCheck.useEqualityCheck)(tokenConversionRates);
  const {
    balance: ethBalance
  } = (0, _reactRedux.useSelector)(_selectors.getSelectedAccount);
  const conversionRate = (0, _reactRedux.useSelector)(_selectors.conversionRateSelector);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  const swapsTokens = (0, _reactRedux.useSelector)(_metamask.getTokens);
  const networkAndAccountSupports1559 = (0, _reactRedux.useSelector)(_selectors.checkNetworkAndAccountSupports1559);
  const balanceError = (0, _reactRedux.useSelector)(_swaps.getBalanceError);
  const fetchParams = (0, _reactRedux.useSelector)(_swaps.getFetchParams);
  const approveTxParams = (0, _reactRedux.useSelector)(_swaps.getApproveTxParams);
  const selectedQuote = (0, _reactRedux.useSelector)(_swaps.getSelectedQuote);
  const topQuote = (0, _reactRedux.useSelector)(_swaps.getTopQuote);
  const usedQuote = selectedQuote || topQuote;
  const tradeValue = (_usedQuote$trade$valu = usedQuote === null || usedQuote === void 0 ? void 0 : (_usedQuote$trade = usedQuote.trade) === null || _usedQuote$trade === void 0 ? void 0 : _usedQuote$trade.value) !== null && _usedQuote$trade$valu !== void 0 ? _usedQuote$trade$valu : '0x0';
  const swapsQuoteRefreshTime = (0, _reactRedux.useSelector)(_swaps.getSwapsQuoteRefreshTime);
  const defaultSwapsToken = (0, _reactRedux.useSelector)(_selectors.getSwapsDefaultToken);
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const nativeCurrencySymbol = (0, _reactRedux.useSelector)(_metamask.getNativeCurrency);
  const reviewSwapClickedTimestamp = (0, _reactRedux.useSelector)(_swaps.getReviewSwapClickedTimestamp);
  let gasFeeInputs;

  if (networkAndAccountSupports1559) {
    // For Swaps we want to get 'high' estimations by default.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    gasFeeInputs = (0, _useGasFeeInputs.useGasFeeInputs)('high', {
      userFeeLevel: swapsUserFeeLevel || 'high'
    });
  }

  const {
    isBestQuote
  } = usedQuote;
  const fetchParamsSourceToken = fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.sourceToken;
  const usedGasLimit = (usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.gasEstimateWithRefund) || `0x${(0, _conversions.decimalToHex)((usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.averageGas) || 0)}`;
  const gasLimitForMax = (usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.gasEstimate) || `0x0`;
  const usedGasLimitWithMultiplier = new _bignumber.default(gasLimitForMax, 16).times((usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.gasMultiplier) || _swaps.FALLBACK_GAS_MULTIPLIER, 10).round(0).toString(16);
  const nonCustomMaxGasLimit = usedQuote !== null && usedQuote !== void 0 && usedQuote.gasEstimate ? usedGasLimitWithMultiplier : `0x${(0, _conversions.decimalToHex)((usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.maxGas) || 0)}`;
  const maxGasLimit = customMaxGas || nonCustomMaxGasLimit;
  let maxFeePerGas;
  let maxPriorityFeePerGas;
  let baseAndPriorityFeePerGas;

  if (networkAndAccountSupports1559) {
    const {
      maxFeePerGas: suggestedMaxFeePerGas,
      maxPriorityFeePerGas: suggestedMaxPriorityFeePerGas,
      gasFeeEstimates: {
        estimatedBaseFee = '0'
      }
    } = gasFeeInputs;
    maxFeePerGas = customMaxFeePerGas || (0, _conversions.decGWEIToHexWEI)(suggestedMaxFeePerGas);
    maxPriorityFeePerGas = customMaxPriorityFeePerGas || (0, _conversions.decGWEIToHexWEI)(suggestedMaxPriorityFeePerGas);
    baseAndPriorityFeePerGas = (0, _conversions.addHexes)((0, _conversions.decGWEIToHexWEI)(estimatedBaseFee), maxPriorityFeePerGas);
  }

  const gasTotalInWeiHex = (0, _send.calcGasTotal)(maxGasLimit, networkAndAccountSupports1559 ? maxFeePerGas : gasPrice);
  const {
    tokensWithBalances
  } = (0, _useTokenTracker.useTokenTracker)(swapsTokens, true);
  const balanceToken = fetchParamsSourceToken === defaultSwapsToken.address ? defaultSwapsToken : tokensWithBalances.find(({
    address
  }) => address === fetchParamsSourceToken);
  const selectedFromToken = balanceToken || usedQuote.sourceTokenInfo;
  const tokenBalance = (tokensWithBalances === null || tokensWithBalances === void 0 ? void 0 : tokensWithBalances.length) && (0, _tokenUtil.calcTokenAmount)(selectedFromToken.balance || '0x0', selectedFromToken.decimals).toFixed(9);
  const tokenBalanceUnavailable = tokensWithBalances && balanceToken === undefined;
  const approveData = (0, _transactions.getTokenData)(approveTxParams === null || approveTxParams === void 0 ? void 0 : approveTxParams.data);
  const approveValue = approveData && (0, _tokenUtil.getTokenValueParam)(approveData);
  const approveAmount = approveValue && (selectedFromToken === null || selectedFromToken === void 0 ? void 0 : selectedFromToken.decimals) !== undefined && (0, _tokenUtil.calcTokenAmount)(approveValue, selectedFromToken.decimals).toFixed(9);
  const approveGas = approveTxParams === null || approveTxParams === void 0 ? void 0 : approveTxParams.gas;
  const renderablePopoverData = (0, _react.useMemo)(() => {
    return (0, _swaps2.quotesToRenderableData)(quotes, networkAndAccountSupports1559 ? baseAndPriorityFeePerGas : gasPrice, conversionRate, currentCurrency, approveGas, memoizedTokenConversionRates, chainId);
  }, [quotes, gasPrice, baseAndPriorityFeePerGas, networkAndAccountSupports1559, conversionRate, currentCurrency, approveGas, memoizedTokenConversionRates, chainId]);
  const renderableDataForUsedQuote = renderablePopoverData.find(renderablePopoverDatum => renderablePopoverDatum.aggId === usedQuote.aggregator);
  const {
    destinationTokenDecimals,
    destinationTokenSymbol,
    destinationTokenValue,
    destinationIconUrl,
    sourceTokenDecimals,
    sourceTokenSymbol,
    sourceTokenValue,
    sourceTokenIconUrl
  } = renderableDataForUsedQuote;
  const {
    feeInFiat,
    feeInEth
  } = (0, _swaps2.getRenderableNetworkFeesForQuote)({
    tradeGas: usedGasLimit,
    approveGas,
    gasPrice: networkAndAccountSupports1559 ? baseAndPriorityFeePerGas : gasPrice,
    currentCurrency,
    conversionRate,
    tradeValue,
    sourceSymbol: sourceTokenSymbol,
    sourceAmount: usedQuote.sourceAmount,
    chainId,
    nativeCurrencySymbol
  });
  const {
    feeInFiat: maxFeeInFiat,
    feeInEth: maxFeeInEth,
    nonGasFee
  } = (0, _swaps2.getRenderableNetworkFeesForQuote)({
    tradeGas: maxGasLimit,
    approveGas,
    gasPrice: networkAndAccountSupports1559 ? maxFeePerGas : gasPrice,
    currentCurrency,
    conversionRate,
    tradeValue,
    sourceSymbol: sourceTokenSymbol,
    sourceAmount: usedQuote.sourceAmount,
    chainId,
    nativeCurrencySymbol
  });
  const tokenCost = new _bignumber.default(usedQuote.sourceAmount);
  const ethCost = new _bignumber.default(usedQuote.trade.value || 0, 10).plus(new _bignumber.default(gasTotalInWeiHex, 16));
  const insufficientTokens = ((tokensWithBalances === null || tokensWithBalances === void 0 ? void 0 : tokensWithBalances.length) || balanceError) && tokenCost.gt(new _bignumber.default(selectedFromToken.balance || '0x0'));
  const insufficientEth = ethCost.gt(new _bignumber.default(ethBalance || '0x0'));
  const tokenBalanceNeeded = insufficientTokens ? (0, _util.toPrecisionWithoutTrailingZeros)((0, _tokenUtil.calcTokenAmount)(tokenCost, selectedFromToken.decimals).minus(tokenBalance).toString(10), 6) : null;
  const ethBalanceNeeded = insufficientEth ? (0, _util.toPrecisionWithoutTrailingZeros)(ethCost.minus(ethBalance, 16).div('1000000000000000000', 10).toString(10), 6) : null;
  const destinationToken = (0, _reactRedux.useSelector)(_swaps.getDestinationTokenInfo);
  (0, _react.useEffect)(() => {
    if (insufficientTokens || insufficientEth) {
      dispatch((0, _swaps.setBalanceError)(true));
    } else if (balanceError && !insufficientTokens && !insufficientEth) {
      dispatch((0, _swaps.setBalanceError)(false));
    }
  }, [insufficientTokens, insufficientEth, balanceError, dispatch]);
  (0, _react.useEffect)(() => {
    const currentTime = Date.now();
    const timeSinceLastFetched = currentTime - quotesLastFetched;

    if (timeSinceLastFetched > swapsQuoteRefreshTime && !dispatchedSafeRefetch) {
      setDispatchedSafeRefetch(true);
      dispatch((0, _actions.safeRefetchQuotes)());
    } else if (timeSinceLastFetched > swapsQuoteRefreshTime) {
      dispatch((0, _actions.setSwapsErrorKey)(_swaps3.QUOTES_EXPIRED_ERROR));
      history.push(_routes.SWAPS_ERROR_ROUTE);
    }
  }, [quotesLastFetched, dispatchedSafeRefetch, dispatch, history, swapsQuoteRefreshTime]);
  (0, _react.useEffect)(() => {
    if (!originalApproveAmount && approveAmount) {
      setOriginalApproveAmount(approveAmount);
    }
  }, [originalApproveAmount, approveAmount]);
  const showInsufficientWarning = (balanceError || tokenBalanceNeeded || ethBalanceNeeded) && !warningHidden;
  const hardwareWalletUsed = (0, _reactRedux.useSelector)(_selectors.isHardwareWallet);
  const hardwareWalletType = (0, _reactRedux.useSelector)(_selectors.getHardwareWalletType);
  const numberOfQuotes = Object.values(quotes).length;
  const bestQuoteReviewedEventSent = (0, _react.useRef)();
  const eventObjectBase = {
    token_from: sourceTokenSymbol,
    token_from_amount: sourceTokenValue,
    token_to: destinationTokenSymbol,
    token_to_amount: destinationTokenValue,
    request_type: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.balanceError,
    slippage: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage,
    custom_slippage: (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.slippage) !== 2,
    response_time: fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.responseTime,
    best_quote_source: topQuote === null || topQuote === void 0 ? void 0 : topQuote.aggregator,
    available_quotes: numberOfQuotes,
    is_hardware_wallet: hardwareWalletUsed,
    hardware_wallet_type: hardwareWalletType
  };
  const allAvailableQuotesOpened = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'All Available Quotes Opened',
    category: 'swaps',
    sensitiveProperties: _objectSpread(_objectSpread({}, eventObjectBase), {}, {
      other_quote_selected: (usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.aggregator) !== (topQuote === null || topQuote === void 0 ? void 0 : topQuote.aggregator),
      other_quote_selected_source: (usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.aggregator) === (topQuote === null || topQuote === void 0 ? void 0 : topQuote.aggregator) ? null : usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.aggregator
    })
  });
  const quoteDetailsOpened = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Quote Details Opened',
    category: 'swaps',
    sensitiveProperties: _objectSpread(_objectSpread({}, eventObjectBase), {}, {
      other_quote_selected: (usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.aggregator) !== (topQuote === null || topQuote === void 0 ? void 0 : topQuote.aggregator),
      other_quote_selected_source: (usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.aggregator) === (topQuote === null || topQuote === void 0 ? void 0 : topQuote.aggregator) ? null : usedQuote === null || usedQuote === void 0 ? void 0 : usedQuote.aggregator
    })
  });
  const editSpendLimitOpened = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Edit Spend Limit Opened',
    category: 'swaps',
    sensitiveProperties: _objectSpread(_objectSpread({}, eventObjectBase), {}, {
      custom_spend_limit_set: originalApproveAmount === approveAmount,
      custom_spend_limit_amount: originalApproveAmount === approveAmount ? null : approveAmount
    })
  });
  const bestQuoteReviewedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Best Quote Reviewed',
    category: 'swaps',
    sensitiveProperties: _objectSpread(_objectSpread({}, eventObjectBase), {}, {
      network_fees: feeInFiat
    })
  });
  const viewQuotePageLoadedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'View Quote Page Loaded',
    category: 'swaps',
    sensitiveProperties: _objectSpread(_objectSpread({}, eventObjectBase), {}, {
      response_time: currentTimestamp - reviewSwapClickedTimestamp
    })
  });
  (0, _react.useEffect)(() => {
    if (!bestQuoteReviewedEventSent.current && [sourceTokenSymbol, sourceTokenValue, destinationTokenSymbol, destinationTokenValue, fetchParams, topQuote, numberOfQuotes, feeInFiat].every(dep => dep !== null && dep !== undefined)) {
      bestQuoteReviewedEventSent.current = true;
      bestQuoteReviewedEvent();
    }
  }, [sourceTokenSymbol, sourceTokenValue, destinationTokenSymbol, destinationTokenValue, fetchParams, topQuote, numberOfQuotes, feeInFiat, bestQuoteReviewedEvent]);
  const metaMaskFee = usedQuote.fee;

  const onFeeCardTokenApprovalClick = () => {
    editSpendLimitOpened();
    dispatch((0, _actions.showModal)({
      name: 'EDIT_APPROVAL_PERMISSION',
      decimals: selectedFromToken.decimals,
      origin: 'MetaMask',
      setCustomAmount: newCustomPermissionAmount => {
        const customPermissionAmount = newCustomPermissionAmount === '' ? originalApproveAmount : newCustomPermissionAmount;
        const newData = (0, _confirmApprove.getCustomTxParamsData)(approveTxParams.data, {
          customPermissionAmount,
          decimals: selectedFromToken.decimals
        });

        if (customPermissionAmount !== null && customPermissionAmount !== void 0 && customPermissionAmount.length && approveTxParams.data !== newData) {
          dispatch((0, _actions.setCustomApproveTxData)(newData));
        }
      },
      tokenAmount: originalApproveAmount,
      customTokenAmount: originalApproveAmount === approveAmount ? null : approveAmount,
      tokenBalance,
      tokenSymbol: selectedFromToken.symbol,
      requiredMinimum: (0, _tokenUtil.calcTokenAmount)(usedQuote.sourceAmount, selectedFromToken.decimals)
    }));
  };

  const nonGasFeeIsPositive = new _bignumber.default(nonGasFee, 16).gt(0);
  const approveGasTotal = (0, _send.calcGasTotal)(approveGas || '0x0', networkAndAccountSupports1559 ? baseAndPriorityFeePerGas : gasPrice);
  const extraNetworkFeeTotalInHexWEI = new _bignumber.default(nonGasFee, 16).plus(approveGasTotal, 16).toString(16);
  const extraNetworkFeeTotalInEth = (0, _conversions.getValueFromWeiHex)({
    value: extraNetworkFeeTotalInHexWEI,
    toDenomination: 'ETH',
    numberOfDecimals: 4
  });
  let extraInfoRowLabel = '';

  if (approveGas && nonGasFeeIsPositive) {
    extraInfoRowLabel = t('approvalAndAggregatorTxFeeCost');
  } else if (approveGas) {
    extraInfoRowLabel = t('approvalTxGasCost');
  } else if (nonGasFeeIsPositive) {
    extraInfoRowLabel = t('aggregatorFeeCost');
  }

  const onFeeCardMaxRowClick = () => {
    networkAndAccountSupports1559 ? setShowEditGasPopover(true) : dispatch((0, _actions.showModal)({
      name: 'CUSTOMIZE_METASWAP_GAS',
      value: tradeValue,
      customGasLimitMessage: approveGas ? t('extraApprovalGas', [(0, _conversions.hexToDecimal)(approveGas)]) : '',
      customTotalSupplement: approveGasTotal,
      extraInfoRow: extraInfoRowLabel ? {
        label: extraInfoRowLabel,
        value: `${extraNetworkFeeTotalInEth} ${nativeCurrencySymbol}`
      } : null,
      initialGasPrice: gasPrice,
      initialGasLimit: maxGasLimit,
      minimumGasLimit: new _bignumber.default(nonCustomMaxGasLimit, 16).toNumber()
    }));
  };

  const tokenApprovalTextComponent = /*#__PURE__*/_react.default.createElement("span", {
    key: "swaps-view-quote-approve-symbol-1",
    className: "view-quote__bold"
  }, sourceTokenSymbol);

  const actionableBalanceErrorMessage = tokenBalanceUnavailable ? t('swapTokenBalanceUnavailable', [sourceTokenSymbol]) : t('swapApproveNeedMoreTokens', [/*#__PURE__*/_react.default.createElement("span", {
    key: "swapApproveNeedMoreTokens-1",
    className: "view-quote__bold"
  }, tokenBalanceNeeded || ethBalanceNeeded), tokenBalanceNeeded && !(sourceTokenSymbol === defaultSwapsToken.symbol) ? sourceTokenSymbol : defaultSwapsToken.symbol]); // Price difference warning

  const priceSlippageBucket = usedQuote === null || usedQuote === void 0 ? void 0 : (_usedQuote$priceSlipp = usedQuote.priceSlippage) === null || _usedQuote$priceSlipp === void 0 ? void 0 : _usedQuote$priceSlipp.bucket;
  const lastPriceDifferenceBucket = (0, _usePrevious.usePrevious)(priceSlippageBucket); // If the user agreed to a different bucket of risk, make them agree again

  (0, _react.useEffect)(() => {
    if (acknowledgedPriceDifference && lastPriceDifferenceBucket === 'medium' && priceSlippageBucket === 'high') {
      setAcknowledgedPriceDifference(false);
    }
  }, [priceSlippageBucket, acknowledgedPriceDifference, lastPriceDifferenceBucket]);
  let viewQuotePriceDifferenceComponent = null;
  const priceSlippageFromSource = (0, _useEthFiatAmount.useEthFiatAmount)((usedQuote === null || usedQuote === void 0 ? void 0 : (_usedQuote$priceSlipp2 = usedQuote.priceSlippage) === null || _usedQuote$priceSlipp2 === void 0 ? void 0 : _usedQuote$priceSlipp2.sourceAmountInETH) || 0, {
    showFiat: true
  });
  const priceSlippageFromDestination = (0, _useEthFiatAmount.useEthFiatAmount)((usedQuote === null || usedQuote === void 0 ? void 0 : (_usedQuote$priceSlipp3 = usedQuote.priceSlippage) === null || _usedQuote$priceSlipp3 === void 0 ? void 0 : _usedQuote$priceSlipp3.destinationAmountInETH) || 0, {
    showFiat: true
  }); // We cannot present fiat value if there is a calculation error or no slippage
  // from source or destination

  const priceSlippageUnknownFiatValue = !priceSlippageFromSource || !priceSlippageFromDestination || (usedQuote === null || usedQuote === void 0 ? void 0 : (_usedQuote$priceSlipp4 = usedQuote.priceSlippage) === null || _usedQuote$priceSlipp4 === void 0 ? void 0 : _usedQuote$priceSlipp4.calculationError);
  let priceDifferencePercentage = 0;

  if (usedQuote !== null && usedQuote !== void 0 && (_usedQuote$priceSlipp5 = usedQuote.priceSlippage) !== null && _usedQuote$priceSlipp5 !== void 0 && _usedQuote$priceSlipp5.ratio) {
    priceDifferencePercentage = parseFloat(new _bignumber.default(usedQuote.priceSlippage.ratio, 10).minus(1, 10).times(100, 10).toFixed(2), 10);
  }

  const shouldShowPriceDifferenceWarning = !tokenBalanceUnavailable && !showInsufficientWarning && usedQuote && (priceDifferenceRiskyBuckets.includes(priceSlippageBucket) || priceSlippageUnknownFiatValue);

  if (shouldShowPriceDifferenceWarning) {
    viewQuotePriceDifferenceComponent = /*#__PURE__*/_react.default.createElement(_viewQuotePriceDifference.default, {
      usedQuote: usedQuote,
      sourceTokenValue: sourceTokenValue,
      destinationTokenValue: destinationTokenValue,
      priceSlippageFromSource: priceSlippageFromSource,
      priceSlippageFromDestination: priceSlippageFromDestination,
      priceDifferencePercentage: priceDifferencePercentage,
      priceSlippageUnknownFiatValue: priceSlippageUnknownFiatValue,
      onAcknowledgementClick: () => {
        setAcknowledgedPriceDifference(true);
      },
      acknowledged: acknowledgedPriceDifference
    });
  }

  const disableSubmissionDueToPriceWarning = shouldShowPriceDifferenceWarning && !acknowledgedPriceDifference;
  const isShowingWarning = showInsufficientWarning || shouldShowPriceDifferenceWarning;

  const onCloseEditGasPopover = () => {
    setShowEditGasPopover(false);
  };

  (0, _react.useEffect)(() => {
    // Thanks to the next line we will only do quotes polling 3 times before showing a Quote Timeout modal.
    dispatch((0, _actions.setSwapsQuotesPollingLimitEnabled)(true));

    if (reviewSwapClickedTimestamp) {
      viewQuotePageLoadedEvent();
    }
  }, [dispatch, viewQuotePageLoadedEvent, reviewSwapClickedTimestamp]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "view-quote"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('view-quote__content', {
      'view-quote__content_modal': disableSubmissionDueToPriceWarning
    })
  }, selectQuotePopoverShown && /*#__PURE__*/_react.default.createElement(_selectQuotePopover.default, {
    quoteDataRows: renderablePopoverData,
    onClose: () => setSelectQuotePopoverShown(false),
    onSubmit: aggId => dispatch((0, _swaps.swapsQuoteSelected)(aggId)),
    swapToSymbol: destinationTokenSymbol,
    initialAggId: usedQuote.aggregator,
    onQuoteDetailsIsOpened: quoteDetailsOpened
  }), showEditGasPopover && networkAndAccountSupports1559 && /*#__PURE__*/_react.default.createElement(_editGasPopover.default, {
    transaction: {
      userFeeLevel: swapsUserFeeLevel || 'high',
      txParams: {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gas: maxGasLimit
      }
    },
    minimumGasLimit: usedGasLimit,
    defaultEstimateToUse: "high",
    mode: _gas.EDIT_GAS_MODES.SWAPS,
    confirmButtonText: t('submit'),
    onClose: onCloseEditGasPopover
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('view-quote__warning-wrapper', {
      'view-quote__warning-wrapper--thin': !isShowingWarning
    })
  }, viewQuotePriceDifferenceComponent, (showInsufficientWarning || tokenBalanceUnavailable) && /*#__PURE__*/_react.default.createElement(_actionableMessage.default, {
    message: actionableBalanceErrorMessage,
    onClose: () => setWarningHidden(true)
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "view-quote__countdown-timer-container"
  }, /*#__PURE__*/_react.default.createElement(_countdownTimer.default, {
    timeStarted: quotesLastFetched,
    warningTime: "0:30",
    infoTooltipLabelKey: "swapQuotesAreRefreshed",
    labelKey: "swapNewQuoteIn"
  })), /*#__PURE__*/_react.default.createElement(_mainQuoteSummary.default, {
    sourceValue: (0, _tokenUtil.calcTokenValue)(sourceTokenValue, sourceTokenDecimals),
    sourceDecimals: sourceTokenDecimals,
    sourceSymbol: sourceTokenSymbol,
    destinationValue: (0, _tokenUtil.calcTokenValue)(destinationTokenValue, destinationTokenDecimals),
    destinationDecimals: destinationTokenDecimals,
    destinationSymbol: destinationTokenSymbol,
    sourceIconUrl: sourceTokenIconUrl,
    destinationIconUrl: destinationIconUrl
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('view-quote__fee-card-container', {
      'view-quote__fee-card-container--three-rows': approveTxParams && (!balanceError || warningHidden)
    })
  }, /*#__PURE__*/_react.default.createElement(_feeCard.default, {
    primaryFee: {
      fee: feeInEth,
      maxFee: maxFeeInEth
    },
    secondaryFee: {
      fee: feeInFiat,
      maxFee: maxFeeInFiat
    },
    onFeeCardMaxRowClick: onFeeCardMaxRowClick,
    hideTokenApprovalRow: !approveTxParams || balanceError && !warningHidden,
    tokenApprovalTextComponent: tokenApprovalTextComponent,
    tokenApprovalSourceTokenSymbol: sourceTokenSymbol,
    onTokenApprovalClick: onFeeCardTokenApprovalClick,
    metaMaskFee: String(metaMaskFee),
    isBestQuote: isBestQuote,
    numberOfQuotes: Object.values(quotes).length,
    onQuotesClick: () => {
      allAvailableQuotesOpened();
      setSelectQuotePopoverShown(true);
    },
    tokenConversionRate: destinationTokenSymbol === defaultSwapsToken.symbol ? 1 : memoizedTokenConversionRates[destinationToken.address],
    chainId: chainId,
    networkAndAccountSupports1559: networkAndAccountSupports1559,
    maxPriorityFeePerGasDecGWEI: (0, _conversions.hexWEIToDecGWEI)(maxPriorityFeePerGas),
    maxFeePerGasDecGWEI: (0, _conversions.hexWEIToDecGWEI)(maxFeePerGas)
  }))), /*#__PURE__*/_react.default.createElement(_swapsFooter.default, {
    onSubmit: () => {
      setSubmitClicked(true);

      if (!balanceError) {
        dispatch((0, _swaps.signAndSendTransactions)(history, metaMetricsEvent));
      } else if (destinationToken.symbol === defaultSwapsToken.symbol) {
        history.push(_routes.DEFAULT_ROUTE);
      } else {
        history.push(`${_routes.ASSET_ROUTE}/${destinationToken.address}`);
      }
    },
    submitText: t('swap'),
    onCancel: async () => await dispatch((0, _swaps.navigateBackToBuildQuote)(history)),
    disabled: submitClicked || balanceError || tokenBalanceUnavailable || disableSubmissionDueToPriceWarning || networkAndAccountSupports1559 && baseAndPriorityFeePerGas === undefined || !networkAndAccountSupports1559 && (gasPrice === null || gasPrice === undefined),
    className: isShowingWarning && 'view-quote__thin-swaps-footer',
    showTopBorder: true
  }));
}

//# sourceMappingURL=ui/pages/swaps/view-quote/view-quote.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/view-quote/view-quote.js",}],
[4276, {"../../../../shared/constants/swaps":3597,"../../../../shared/modules/swaps.utils":3608,"../../../components/ui/actionable-message/actionable-message":3835,"../../../components/ui/info-tooltip":3896,"../../../contexts/i18n":3970,"../../../contexts/metametrics.new":3972,"../../../ducks/metamask/metamask":3985,"../../../ducks/swaps/swaps":3988,"../../../helpers/constants/routes":3995,"../../../helpers/utils/conversions.util":4009,"../../../helpers/utils/token-util":4017,"../../../helpers/utils/util":4020,"../../../hooks/useEqualityCheck":4026,"../../../hooks/useEthFiatAmount":4027,"../../../hooks/useMetricEvent":4032,"../../../hooks/usePrevious":4034,"../../../hooks/useTokenFiatAmount":4042,"../../../hooks/useTokenTracker":4043,"../../../hooks/useTokensToSearch":4044,"../../../selectors":4326,"../../../store/actions":4331,"../dropdown-input-pair":4281,"../dropdown-search-list":4283,"../slippage-buttons":4309,"../swaps-footer":4311,"../swaps.util":4316,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/etherscan-link":966,"classnames":1449,"lodash":2646,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BuildQuote;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = require("lodash");

var _reactRouterDom = require("react-router-dom");

var _etherscanLink = require("@metamask/etherscan-link");

var _metametrics = require("../../../contexts/metametrics.new");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _useTokensToSearch = require("../../../hooks/useTokensToSearch");

var _useEqualityCheck = require("../../../hooks/useEqualityCheck");

var _i18n = require("../../../contexts/i18n");

var _dropdownInputPair = _interopRequireDefault(require("../dropdown-input-pair"));

var _dropdownSearchList = _interopRequireDefault(require("../dropdown-search-list"));

var _slippageButtons = _interopRequireDefault(require("../slippage-buttons"));

var _metamask = require("../../../ducks/metamask/metamask");

var _infoTooltip = _interopRequireDefault(require("../../../components/ui/info-tooltip"));

var _actionableMessage = _interopRequireDefault(require("../../../components/ui/actionable-message/actionable-message"));

var _routes = require("../../../helpers/constants/routes");

var _swaps = require("../../../ducks/swaps/swaps");

var _selectors = require("../../../selectors");

var _conversions = require("../../../helpers/utils/conversions.util");

var _tokenUtil = require("../../../helpers/utils/token-util");

var _util = require("../../../helpers/utils/util");

var _usePrevious = require("../../../hooks/usePrevious");

var _useTokenTracker = require("../../../hooks/useTokenTracker");

var _useTokenFiatAmount = require("../../../hooks/useTokenFiatAmount");

var _useEthFiatAmount = require("../../../hooks/useEthFiatAmount");

var _swaps2 = require("../../../../shared/modules/swaps.utils");

var _swaps3 = require("../../../../shared/constants/swaps");

var _actions = require("../../../store/actions");

var _swaps4 = require("../swaps.util");

var _swapsFooter = _interopRequireDefault(require("../swaps-footer"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const fuseSearchKeys = [{
  name: 'name',
  weight: 0.499
}, {
  name: 'symbol',
  weight: 0.499
}, {
  name: 'address',
  weight: 0.002
}];
const MAX_ALLOWED_SLIPPAGE = 15;
let timeoutIdForQuotesPrefetching;

function BuildQuote({
  inputValue,
  onInputChange,
  ethBalance,
  setMaxSlippage,
  maxSlippage,
  selectedAccountAddress,
  isFeatureFlagLoaded,
  tokenFromError,
  shuffledTokensList
}) {
  var _ref, _rpcPrefs$blockExplor, _SWAPS_CHAINID_DEFAUL;

  const t = (0, _react.useContext)(_i18n.I18nContext);
  const dispatch = (0, _reactRedux.useDispatch)();
  const history = (0, _reactRouterDom.useHistory)();
  const metaMetricsEvent = (0, _react.useContext)(_metametrics.MetaMetricsContext);
  const [fetchedTokenExchangeRate, setFetchedTokenExchangeRate] = (0, _react.useState)(undefined);
  const [verificationClicked, setVerificationClicked] = (0, _react.useState)(false);
  const balanceError = (0, _reactRedux.useSelector)(_swaps.getBalanceError);
  const fetchParams = (0, _reactRedux.useSelector)(_swaps.getFetchParams);
  const {
    sourceTokenInfo = {},
    destinationTokenInfo = {}
  } = (fetchParams === null || fetchParams === void 0 ? void 0 : fetchParams.metaData) || {};
  const tokens = (0, _reactRedux.useSelector)(_metamask.getTokens);
  const topAssets = (0, _reactRedux.useSelector)(_swaps.getTopAssets);
  const fromToken = (0, _reactRedux.useSelector)(_swaps.getFromToken);
  const toToken = (0, _reactRedux.useSelector)(_swaps.getToToken) || destinationTokenInfo;
  const defaultSwapsToken = (0, _reactRedux.useSelector)(_selectors.getSwapsDefaultToken);
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const rpcPrefs = (0, _reactRedux.useSelector)(_selectors.getRpcPrefsForCurrentProvider);
  const tokenList = (0, _reactRedux.useSelector)(_selectors.getTokenList);
  const useTokenDetection = (0, _reactRedux.useSelector)(_selectors.getUseTokenDetection);
  const quotes = (0, _reactRedux.useSelector)(_swaps.getQuotes, _lodash.isEqual);
  const areQuotesPresent = Object.keys(quotes).length > 0;
  const tokenConversionRates = (0, _reactRedux.useSelector)(_selectors.getTokenExchangeRates, _lodash.isEqual);
  const conversionRate = (0, _reactRedux.useSelector)(_metamask.getConversionRate);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  const fetchParamsFromToken = (0, _swaps2.isSwapsDefaultTokenSymbol)(sourceTokenInfo === null || sourceTokenInfo === void 0 ? void 0 : sourceTokenInfo.symbol, chainId) ? defaultSwapsToken : sourceTokenInfo;
  const {
    loading,
    tokensWithBalances
  } = (0, _useTokenTracker.useTokenTracker)(tokens); // If the fromToken was set in a call to `onFromSelect` (see below), and that from token has a balance
  // but is not in tokensWithBalances or tokens, then we want to add it to the usersTokens array so that
  // the balance of the token can appear in the from token selection dropdown

  const fromTokenArray = !(0, _swaps2.isSwapsDefaultTokenSymbol)(fromToken === null || fromToken === void 0 ? void 0 : fromToken.symbol, chainId) && fromToken !== null && fromToken !== void 0 && fromToken.balance ? [fromToken] : [];
  const usersTokens = (0, _lodash.uniqBy)([...tokensWithBalances, ...tokens, ...fromTokenArray], 'address');
  const memoizedUsersTokens = (0, _useEqualityCheck.useEqualityCheck)(usersTokens);
  const selectedFromToken = (0, _useTokensToSearch.getRenderableTokenData)(fromToken || fetchParamsFromToken, tokenConversionRates, conversionRate, currentCurrency, chainId, tokenList, useTokenDetection);
  const tokensToSearch = (0, _useTokensToSearch.useTokensToSearch)({
    usersTokens: memoizedUsersTokens,
    topTokens: topAssets,
    shuffledTokensList
  });
  const selectedToToken = tokensToSearch.find(({
    address
  }) => address === (toToken === null || toToken === void 0 ? void 0 : toToken.address)) || toToken;
  const toTokenIsNotDefault = (selectedToToken === null || selectedToToken === void 0 ? void 0 : selectedToToken.address) && !(0, _swaps2.isSwapsDefaultTokenAddress)(selectedToToken === null || selectedToToken === void 0 ? void 0 : selectedToToken.address, chainId);
  const occurrences = Number((selectedToToken === null || selectedToToken === void 0 ? void 0 : selectedToToken.occurances) || (selectedToToken === null || selectedToToken === void 0 ? void 0 : selectedToToken.occurrences) || 0);
  const {
    address: fromTokenAddress,
    symbol: fromTokenSymbol,
    string: fromTokenString,
    decimals: fromTokenDecimals,
    balance: rawFromTokenBalance
  } = selectedFromToken || {};
  const {
    address: toTokenAddress
  } = selectedToToken || {};
  const fromTokenBalance = rawFromTokenBalance && (0, _tokenUtil.calcTokenAmount)(rawFromTokenBalance, fromTokenDecimals).toString(10);
  const prevFromTokenBalance = (0, _usePrevious.usePrevious)(fromTokenBalance);
  const swapFromTokenFiatValue = (0, _useTokenFiatAmount.useTokenFiatAmount)(fromTokenAddress, inputValue || 0, fromTokenSymbol, {
    showFiat: true
  }, true);
  const swapFromEthFiatValue = (0, _useEthFiatAmount.useEthFiatAmount)(inputValue || 0, {
    showFiat: true
  }, true);
  const swapFromFiatValue = (0, _swaps2.isSwapsDefaultTokenSymbol)(fromTokenSymbol, chainId) ? swapFromEthFiatValue : swapFromTokenFiatValue;

  const onFromSelect = token => {
    if (token !== null && token !== void 0 && token.address && !swapFromFiatValue && fetchedTokenExchangeRate !== null) {
      (0, _swaps4.fetchTokenPrice)(token.address).then(rate => {
        if (rate !== null && rate !== undefined) {
          setFetchedTokenExchangeRate(rate);
        }
      });
    } else {
      setFetchedTokenExchangeRate(null);
    }

    if (token !== null && token !== void 0 && token.address && !memoizedUsersTokens.find(usersToken => usersToken.address === token.address)) {
      (0, _swaps4.fetchTokenBalance)(token.address, selectedAccountAddress).then(fetchedBalance => {
        if (fetchedBalance !== null && fetchedBalance !== void 0 && fetchedBalance.balance) {
          const balanceAsDecString = fetchedBalance.balance.toString(10);
          const userTokenBalance = (0, _tokenUtil.calcTokenAmount)(balanceAsDecString, token.decimals);
          dispatch((0, _swaps.setSwapsFromToken)(_objectSpread(_objectSpread({}, token), {}, {
            string: userTokenBalance.toString(10),
            balance: balanceAsDecString
          })));
        }
      });
    }

    dispatch((0, _swaps.setSwapsFromToken)(token));
    onInputChange(token !== null && token !== void 0 && token.address ? inputValue : '', token.string, token.decimals);
  };

  const blockExplorerTokenLink = (0, _etherscanLink.getTokenTrackerLink)(selectedToToken.address, chainId, null, // no networkId
  null, // no holderAddress
  {
    blockExplorerUrl: (_ref = (_rpcPrefs$blockExplor = rpcPrefs.blockExplorerUrl) !== null && _rpcPrefs$blockExplor !== void 0 ? _rpcPrefs$blockExplor : _swaps3.SWAPS_CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP[chainId]) !== null && _ref !== void 0 ? _ref : null
  });
  const blockExplorerLabel = rpcPrefs.blockExplorerUrl ? (0, _util.getURLHostName)(blockExplorerTokenLink) : t('etherscan');
  const blockExplorerLinkClickedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    category: 'Swaps',
    event: 'Clicked Block Explorer Link',
    properties: {
      link_type: 'Token Tracker',
      action: 'Swaps Confirmation',
      block_explorer_domain: (0, _util.getURLHostName)(blockExplorerTokenLink)
    }
  });
  const {
    destinationTokenAddedForSwap
  } = fetchParams || {};
  const {
    address: toAddress
  } = toToken || {};
  const onToSelect = (0, _react.useCallback)(token => {
    if (destinationTokenAddedForSwap && token.address !== toAddress) {
      dispatch((0, _actions.removeToken)(toAddress));
    }

    dispatch((0, _swaps.setSwapToToken)(token));
    setVerificationClicked(false);
  }, [dispatch, destinationTokenAddedForSwap, toAddress]);
  const hideDropdownItemIf = (0, _react.useCallback)(item => item.address === fromTokenAddress, [fromTokenAddress]);
  const tokensWithBalancesFromToken = tokensWithBalances.find(token => token.address === (fromToken === null || fromToken === void 0 ? void 0 : fromToken.address));
  const previousTokensWithBalancesFromToken = (0, _usePrevious.usePrevious)(tokensWithBalancesFromToken);
  (0, _react.useEffect)(() => {
    const notDefault = !(0, _swaps2.isSwapsDefaultTokenAddress)(tokensWithBalancesFromToken === null || tokensWithBalancesFromToken === void 0 ? void 0 : tokensWithBalancesFromToken.address, chainId);
    const addressesAreTheSame = (tokensWithBalancesFromToken === null || tokensWithBalancesFromToken === void 0 ? void 0 : tokensWithBalancesFromToken.address) === (previousTokensWithBalancesFromToken === null || previousTokensWithBalancesFromToken === void 0 ? void 0 : previousTokensWithBalancesFromToken.address);
    const balanceHasChanged = (tokensWithBalancesFromToken === null || tokensWithBalancesFromToken === void 0 ? void 0 : tokensWithBalancesFromToken.balance) !== (previousTokensWithBalancesFromToken === null || previousTokensWithBalancesFromToken === void 0 ? void 0 : previousTokensWithBalancesFromToken.balance);

    if (notDefault && addressesAreTheSame && balanceHasChanged) {
      dispatch((0, _swaps.setSwapsFromToken)(_objectSpread(_objectSpread({}, fromToken), {}, {
        balance: tokensWithBalancesFromToken === null || tokensWithBalancesFromToken === void 0 ? void 0 : tokensWithBalancesFromToken.balance,
        string: tokensWithBalancesFromToken === null || tokensWithBalancesFromToken === void 0 ? void 0 : tokensWithBalancesFromToken.string
      })));
    }
  }, [dispatch, tokensWithBalancesFromToken, previousTokensWithBalancesFromToken, fromToken, chainId]); // If the eth balance changes while on build quote, we update the selected from token

  (0, _react.useEffect)(() => {
    if ((0, _swaps2.isSwapsDefaultTokenAddress)(fromToken === null || fromToken === void 0 ? void 0 : fromToken.address, chainId) && (fromToken === null || fromToken === void 0 ? void 0 : fromToken.balance) !== (0, _conversions.hexToDecimal)(ethBalance)) {
      dispatch((0, _swaps.setSwapsFromToken)(_objectSpread(_objectSpread({}, fromToken), {}, {
        balance: (0, _conversions.hexToDecimal)(ethBalance),
        string: (0, _conversions.getValueFromWeiHex)({
          value: ethBalance,
          numberOfDecimals: 4,
          toDenomination: 'ETH'
        })
      })));
    }
  }, [dispatch, fromToken, ethBalance, chainId]);
  (0, _react.useEffect)(() => {
    if (prevFromTokenBalance !== fromTokenBalance) {
      onInputChange(inputValue, fromTokenBalance);
    }
  }, [onInputChange, prevFromTokenBalance, inputValue, fromTokenBalance]);
  (0, _react.useEffect)(() => {
    dispatch((0, _actions.resetSwapsPostFetchState)());
    dispatch((0, _swaps.setReviewSwapClickedTimestamp)());
  }, [dispatch]);

  const BlockExplorerLink = () => {
    return /*#__PURE__*/_react.default.createElement("a", {
      className: "build-quote__token-etherscan-link build-quote__underline",
      key: "build-quote-etherscan-link",
      onClick: () => {
        blockExplorerLinkClickedEvent();
        global.platform.openTab({
          url: blockExplorerTokenLink
        });
      },
      target: "_blank",
      rel: "noopener noreferrer"
    }, blockExplorerLabel);
  };

  let tokenVerificationDescription = '';

  if (blockExplorerTokenLink) {
    if (occurrences === 1) {
      tokenVerificationDescription = t('verifyThisTokenOn', [/*#__PURE__*/_react.default.createElement(BlockExplorerLink, {
        key: "block-explorer-link"
      })]);
    } else if (occurrences === 0) {
      tokenVerificationDescription = t('verifyThisUnconfirmedTokenOn', [/*#__PURE__*/_react.default.createElement(BlockExplorerLink, {
        key: "block-explorer-link"
      })]);
    }
  }

  const swapYourTokenBalance = t('swapYourTokenBalance', [fromTokenString || '0', fromTokenSymbol || ((_SWAPS_CHAINID_DEFAUL = _swaps3.SWAPS_CHAINID_DEFAULT_TOKEN_MAP[chainId]) === null || _SWAPS_CHAINID_DEFAUL === void 0 ? void 0 : _SWAPS_CHAINID_DEFAUL.symbol) || '']);
  const isDirectWrappingEnabled = (0, _swaps4.shouldEnableDirectWrapping)(chainId, fromTokenAddress, selectedToToken.address);
  const isReviewSwapButtonDisabled = tokenFromError || !isFeatureFlagLoaded || !Number(inputValue) || !(selectedToToken !== null && selectedToToken !== void 0 && selectedToToken.address) || Number(maxSlippage) < 0 || Number(maxSlippage) > MAX_ALLOWED_SLIPPAGE || toTokenIsNotDefault && occurrences < 2 && !verificationClicked; // It's triggered every time there is a change in form values (token from, token to, amount and slippage).

  (0, _react.useEffect)(() => {
    dispatch((0, _actions.clearSwapsQuotes)());
    dispatch((0, _actions.stopPollingForQuotes)());

    const prefetchQuotesWithoutRedirecting = async () => {
      const pageRedirectionDisabled = true;
      await dispatch((0, _swaps.fetchQuotesAndSetQuoteState)(history, inputValue, maxSlippage, metaMetricsEvent, pageRedirectionDisabled));
    }; // Delay fetching quotes until a user is done typing an input value. If they type a new char in less than a second,
    // we will cancel previous setTimeout call and start running a new one.


    timeoutIdForQuotesPrefetching = setTimeout(() => {
      timeoutIdForQuotesPrefetching = null;

      if (!isReviewSwapButtonDisabled) {
        // Only do quotes prefetching if the Review Swap button is enabled.
        prefetchQuotesWithoutRedirecting();
      }
    }, 1000);
    return () => clearTimeout(timeoutIdForQuotesPrefetching);
  }, [dispatch, history, maxSlippage, metaMetricsEvent, isReviewSwapButtonDisabled, inputValue, fromTokenAddress, toTokenAddress]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__dropdown-input-pair-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__input-label"
  }, t('swapSwapFrom')), !(0, _swaps2.isSwapsDefaultTokenSymbol)(fromTokenSymbol, chainId) && /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__max-button",
    "data-testid": "build-quote__max-button",
    onClick: () => onInputChange(fromTokenBalance || '0', fromTokenBalance)
  }, t('max'))), /*#__PURE__*/_react.default.createElement(_dropdownInputPair.default, {
    onSelect: onFromSelect,
    itemsToSearch: tokensToSearch,
    onInputChange: value => {
      onInputChange(value, fromTokenBalance);
    },
    inputValue: inputValue,
    leftValue: inputValue && swapFromFiatValue,
    selectedItem: selectedFromToken,
    maxListItems: 30,
    loading: loading && (!(tokensToSearch !== null && tokensToSearch !== void 0 && tokensToSearch.length) || !topAssets || !Object.keys(topAssets).length),
    selectPlaceHolderText: t('swapSelect'),
    hideItemIf: item => item.address === (selectedToToken === null || selectedToToken === void 0 ? void 0 : selectedToToken.address),
    listContainerClassName: "build-quote__open-dropdown",
    autoFocus: true
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('build-quote__balance-message', {
      'build-quote__balance-message--error': balanceError || tokenFromError
    })
  }, !tokenFromError && !balanceError && fromTokenSymbol && swapYourTokenBalance, !tokenFromError && balanceError && fromTokenSymbol && /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quite__insufficient-funds"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quite__insufficient-funds-first"
  }, t('swapsNotEnoughForTx', [fromTokenSymbol])), /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quite__insufficient-funds-second"
  }, swapYourTokenBalance)), tokenFromError && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__form-error"
  }, t('swapTooManyDecimalsError', [fromTokenSymbol, fromTokenDecimals])), /*#__PURE__*/_react.default.createElement("div", null, swapYourTokenBalance))), /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__swap-arrows-row"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "build-quote__swap-arrows",
    onClick: () => {
      onToSelect(selectedFromToken);
      onFromSelect(selectedToToken);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: "./images/icons/swap2.svg",
    alt: t('swapSwapSwitch'),
    width: "12",
    height: "16"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__dropdown-swap-to-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__input-label"
  }, t('swapSwapTo'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-input-pair dropdown-input-pair__to"
  }, /*#__PURE__*/_react.default.createElement(_dropdownSearchList.default, {
    startingItem: selectedToToken,
    itemsToSearch: tokensToSearch,
    searchPlaceholderText: t('swapSearchForAToken'),
    fuseSearchKeys: fuseSearchKeys,
    selectPlaceHolderText: t('swapSelectAToken'),
    maxListItems: 30,
    onSelect: onToSelect,
    loading: loading && (!(tokensToSearch !== null && tokensToSearch !== void 0 && tokensToSearch.length) || !topAssets || !Object.keys(topAssets).length),
    externallySelectedItem: selectedToToken,
    hideItemIf: hideDropdownItemIf,
    listContainerClassName: "build-quote__open-to-dropdown",
    hideRightLabels: true,
    defaultToAll: true,
    shouldSearchForImports: true
  })), toTokenIsNotDefault && (occurrences < 2 ? /*#__PURE__*/_react.default.createElement(_actionableMessage.default, {
    type: occurrences === 1 ? 'warning' : 'danger',
    message: /*#__PURE__*/_react.default.createElement("div", {
      className: "build-quote__token-verification-warning-message"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "build-quote__bold"
    }, occurrences === 1 ? t('swapTokenVerificationOnlyOneSource') : t('swapTokenVerificationAddedManually')), /*#__PURE__*/_react.default.createElement("div", null, tokenVerificationDescription)),
    primaryAction: verificationClicked ? null : {
      label: t('continue'),
      onClick: () => setVerificationClicked(true)
    },
    withRightButton: true,
    infoTooltipText: blockExplorerTokenLink && t('swapVerifyTokenExplanation', [blockExplorerLabel])
  }) : /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__token-message"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "build-quote__bold",
    key: "token-verification-bold-text"
  }, t('swapTokenVerificationSources', [occurrences])), blockExplorerTokenLink && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, t('swapTokenVerificationMessage', [/*#__PURE__*/_react.default.createElement("a", {
    className: "build-quote__token-etherscan-link",
    key: "build-quote-etherscan-link",
    onClick: () => {
      blockExplorerLinkClickedEvent();
      global.platform.openTab({
        url: blockExplorerTokenLink
      });
    },
    target: "_blank",
    rel: "noopener noreferrer"
  }, blockExplorerLabel)]), /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
    position: "top",
    contentText: t('swapVerifyTokenExplanation', [blockExplorerLabel]),
    containerClassName: "build-quote__token-tooltip-container",
    key: "token-verification-info-tooltip"
  })))), !isDirectWrappingEnabled && /*#__PURE__*/_react.default.createElement("div", {
    className: "build-quote__slippage-buttons-container"
  }, /*#__PURE__*/_react.default.createElement(_slippageButtons.default, {
    onSelect: newSlippage => {
      setMaxSlippage(newSlippage);
    },
    maxAllowedSlippage: MAX_ALLOWED_SLIPPAGE,
    currentSlippage: maxSlippage
  }))), /*#__PURE__*/_react.default.createElement(_swapsFooter.default, {
    onSubmit: async () => {
      // We need this to know how long it took to go from clicking on the Review Swap button to rendered View Quote page.
      dispatch((0, _swaps.setReviewSwapClickedTimestamp)(Date.now())); // In case that quotes prefetching is waiting to be executed, but hasn't started yet,
      // we want to cancel it and fetch quotes from here.

      if (timeoutIdForQuotesPrefetching) {
        clearTimeout(timeoutIdForQuotesPrefetching);
        dispatch((0, _swaps.fetchQuotesAndSetQuoteState)(history, inputValue, maxSlippage, metaMetricsEvent));
      } else if (areQuotesPresent) {
        // If there are prefetched quotes already, go directly to the View Quote page.
        history.push(_routes.VIEW_QUOTE_ROUTE);
      } else {
        // If the "Review Swap" button was clicked while quotes are being fetched, go to the Loading Quotes page.
        await dispatch((0, _actions.setBackgroundSwapRouteState)('loading'));
        history.push(_routes.LOADING_QUOTES_ROUTE);
      }
    },
    submitText: t('swapReviewSwap'),
    disabled: isReviewSwapButtonDisabled,
    hideCancel: true,
    showTermsOfService: true
  }));
}

BuildQuote.propTypes = {
  maxSlippage: _propTypes.default.number,
  inputValue: _propTypes.default.string,
  onInputChange: _propTypes.default.func,
  ethBalance: _propTypes.default.string,
  setMaxSlippage: _propTypes.default.func,
  selectedAccountAddress: _propTypes.default.string,
  isFeatureFlagLoaded: _propTypes.default.bool.isRequired,
  tokenFromError: _propTypes.default.string,
  shuffledTokensList: _propTypes.default.array
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/swaps/build-quote/build-quote.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/build-quote/build-quote.js",}],
[4014, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Checks if viewport at invoke time fits mobile dimensions
// isMobileView :: () => Bool
const isMobileView = () => window.matchMedia('screen and (max-width: $break-small)').matches;

var _default = isMobileView;
exports.default = _default;

//# sourceMappingURL=ui/helpers/utils/is-mobile-view.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/utils/is-mobile-view.js",}],
[3738, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

let index = 0;
let extraSheet;

const insertRule = css => {
  if (!extraSheet) {
    // First time, create an extra stylesheet for adding rules
    extraSheet = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(extraSheet); // Keep reference to actual StyleSheet object (`styleSheet` for IE < 9)

    extraSheet = extraSheet.sheet || extraSheet.styleSheet;
  }

  extraSheet.insertRule(css, (extraSheet.cssRules || extraSheet.rules).length);
  return extraSheet;
};

const insertKeyframesRule = keyframes => {
  // random name
  // eslint-disable-next-line no-plusplus
  const name = `anim_${++index}${Number(new Date())}`;
  let css = `@keyframes ${name} {`;
  Object.keys(keyframes).forEach(key => {
    css += `${key} {`;
    Object.keys(keyframes[key]).forEach(property => {
      const part = `:${keyframes[key][property]};`;
      css += property + part;
    });
    css += '}';
  });
  css += '}';
  insertRule(css);
  return name;
};

const animation = {
  show: {
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-out'
  },
  hide: {
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-out'
  },
  showContentAnimation: insertKeyframesRule({
    '0%': {
      opacity: 0
    },
    '100%': {
      opacity: 1
    }
  }),
  hideContentAnimation: insertKeyframesRule({
    '0%': {
      opacity: 1
    },
    '100%': {
      opacity: 0
    }
  }),
  showBackdropAnimation: insertKeyframesRule({
    '0%': {
      opacity: 0
    },
    '100%': {
      opacity: 0.9
    }
  }),
  hideBackdropAnimation: insertKeyframesRule({
    '0%': {
      opacity: 0.9
    },
    '100%': {
      opacity: 0
    }
  })
};
const endEvents = ['transitionend', 'animationend'];

function addEventListener(node, eventName, eventListener) {
  node.addEventListener(eventName, eventListener, false);
}

function removeEventListener(node, eventName, eventListener) {
  node.removeEventListener(eventName, eventListener, false);
}

const removeEndEventListener = (node, eventListener) => {
  if (endEvents.length === 0) {
    return;
  }

  endEvents.forEach(function (endEvent) {
    removeEventListener(node, endEvent, eventListener);
  });
};

const addEndEventListener = (node, eventListener) => {
  if (endEvents.length === 0) {
    // If CSS transitions are not supported, trigger an "end animation"
    // event immediately.
    window.setTimeout(eventListener, 0);
    return;
  }

  endEvents.forEach(function (endEvent) {
    addEventListener(node, endEvent, eventListener);
  });
};

class FadeModal extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "content", null);
    (0, _defineProperty2.default)(this, "state", {
      willHide: true,
      hidden: true
    });
    (0, _defineProperty2.default)(this, "addTransitionListener", (node, handle) => {
      if (node) {
        const endListener = function (e) {
          if (e && e.target !== node) {
            return;
          }

          removeEndEventListener(node, endListener);
          handle();
        };

        addEndEventListener(node, endListener);
      }
    });
    (0, _defineProperty2.default)(this, "handleBackdropClick", () => {
      if (this.props.closeOnClick) {
        this.hide();
      }
    });
    (0, _defineProperty2.default)(this, "hasHidden", () => {
      return this.state.hidden;
    });
    (0, _defineProperty2.default)(this, "leave", () => {
      this.setState({
        hidden: true
      });
      this.props.onHide(this.state.hideSource);
    });
    (0, _defineProperty2.default)(this, "enter", () => {
      this.props.onShow();
    });
    (0, _defineProperty2.default)(this, "show", () => {
      if (!this.state.hidden) {
        return;
      }

      this.setState({
        willHide: false,
        hidden: false
      });
      setTimeout(function () {
        this.addTransitionListener(this.content, this.enter);
      }.bind(this), 0);
    });
    (0, _defineProperty2.default)(this, "hide", () => {
      if (this.hasHidden()) {
        return;
      }

      this.setState({
        willHide: true
      });
    });
    (0, _defineProperty2.default)(this, "listenKeyboard", event => {
      if (typeof this.props.keyboard === 'function') {
        this.props.keyboard(event);
      } else {
        this.closeOnEsc(event);
      }
    });
    (0, _defineProperty2.default)(this, "closeOnEsc", event => {
      if (this.props.keyboard && (event.key === 'Escape' || event.keyCode === 27)) {
        this.hide();
      }
    });
    (0, _defineProperty2.default)(this, "UNSAFE_componentDidMount", () => {
      window.addEventListener('keydown', this.listenKeyboard, true);
    });
    (0, _defineProperty2.default)(this, "UNSAFE_componentWillUnmount", () => {
      window.removeEventListener('keydown', this.listenKeyboard, true);
    });
  }

  render() {
    if (this.state.hidden) {
      return null;
    }

    const {
      willHide
    } = this.state;
    const {
      modalStyle
    } = this.props;

    const backdropStyle = _objectSpread({
      animationName: willHide ? animation.hideBackdropAnimation : animation.showBackdropAnimation,
      animationTimingFunction: (willHide ? animation.hide : animation.show).animationTimingFunction
    }, this.props.backdropStyle);

    const contentStyle = _objectSpread({
      animationDuration: (willHide ? animation.hide : animation.show).animationDuration,
      animationName: willHide ? animation.hideContentAnimation : animation.showContentAnimation,
      animationTimingFunction: (willHide ? animation.hide : animation.show).animationTimingFunction
    }, this.props.contentStyle);

    const backdrop = this.props.backdrop ? /*#__PURE__*/_react.default.createElement("div", {
      className: "modal__backdrop",
      style: backdropStyle,
      onClick: this.props.closeOnClick ? this.handleBackdropClick : null
    }) : undefined;

    if (willHide) {
      this.addTransitionListener(this.content, this.leave);
    }

    return /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "modal",
      style: modalStyle
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "modal__content",
      ref: el => this.content = el,
      tabIndex: "-1",
      style: contentStyle
    }, this.props.children)), backdrop);
  }

}

(0, _defineProperty2.default)(FadeModal, "propTypes", {
  backdrop: _propTypes.default.bool,
  backdropStyle: _propTypes.default.object,
  closeOnClick: _propTypes.default.bool,
  contentStyle: _propTypes.default.object,
  keyboard: _propTypes.default.bool,
  modalStyle: _propTypes.default.object,
  onShow: _propTypes.default.func,
  onHide: _propTypes.default.func,
  children: _propTypes.default.node
});
(0, _defineProperty2.default)(FadeModal, "defaultProps", {
  onShow: () => undefined,
  onHide: () => undefined,
  keyboard: true,
  backdrop: true,
  closeOnClick: true,
  modalStyle: {},
  backdropStyle: {},
  contentStyle: {},
  children: []
});
var _default = FadeModal;
exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/fade-modal.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/fade-modal.js",}],
[3740, {"./hide-token-confirmation-modal":3739,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _hideTokenConfirmationModal.default;
  }
});

var _hideTokenConfirmationModal = _interopRequireDefault(require("./hide-token-confirmation-modal"));

//# sourceMappingURL=ui/components/app/modals/hide-token-confirmation-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/hide-token-confirmation-modal/index.js",}],
[3731, {"./deposit-ether-modal.container":3730,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _depositEtherModal.default;
  }
});

var _depositEtherModal = _interopRequireDefault(require("./deposit-ether-modal.container"));

//# sourceMappingURL=ui/components/app/modals/deposit-ether-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/deposit-ether-modal/index.js",}],
[3749, {"./qr-scanner.container":3751,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _qrScanner = _interopRequireDefault(require("./qr-scanner.container"));

var _default = _qrScanner.default;
exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/qr-scanner/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/qr-scanner/index.js",}],
[3723, {"./confirm-remove-account.container":3722,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmRemoveAccount.default;
  }
});

var _confirmRemoveAccount = _interopRequireDefault(require("./confirm-remove-account.container"));

//# sourceMappingURL=ui/components/app/modals/confirm-remove-account/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-remove-account/index.js",}],
[3752, {"./reject-transactions.container":3754,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _rejectTransactions.default;
  }
});

var _rejectTransactions = _interopRequireDefault(require("./reject-transactions.container"));

//# sourceMappingURL=ui/components/app/modals/reject-transactions/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/reject-transactions/index.js",}],
[3742, {"./metametrics-opt-in-modal.container":3744,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _metametricsOptInModal.default;
  }
});

var _metametricsOptInModal = _interopRequireDefault(require("./metametrics-opt-in-modal.container"));

//# sourceMappingURL=ui/components/app/modals/metametrics-opt-in-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/metametrics-opt-in-modal/index.js",}],
[3746, {"./new-account-modal.container":3748,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _newAccountModal.default;
  }
});

var _newAccountModal = _interopRequireDefault(require("./new-account-modal.container"));

//# sourceMappingURL=ui/components/app/modals/new-account-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/new-account-modal/index.js",}],
[3726, {"./confirm-reset-account.container":3725,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmResetAccount.default;
  }
});

var _confirmResetAccount = _interopRequireDefault(require("./confirm-reset-account.container"));

//# sourceMappingURL=ui/components/app/modals/confirm-reset-account/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-reset-account/index.js",}],
[3720, {"./confirm-delete-network.container":3719,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmDeleteNetwork.default;
  }
});

var _confirmDeleteNetwork = _interopRequireDefault(require("./confirm-delete-network.container"));

//# sourceMappingURL=ui/components/app/modals/confirm-delete-network/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-delete-network/index.js",}],
[3755, {"./transaction-confirmed.container":3757,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _transactionConfirmed.default;
  }
});

var _transactionConfirmed = _interopRequireDefault(require("./transaction-confirmed.container"));

//# sourceMappingURL=ui/components/app/modals/transaction-confirmed/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/transaction-confirmed/index.js",}],
[3712, {"./add-to-addressbook-modal.container":3711,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _addToAddressbookModal.default;
  }
});

var _addToAddressbookModal = _interopRequireDefault(require("./add-to-addressbook-modal.container"));

//# sourceMappingURL=ui/components/app/modals/add-to-addressbook-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/add-to-addressbook-modal/index.js",}],
[3734, {"./edit-approval-permission.container":3733,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _editApprovalPermission.default;
  }
});

var _editApprovalPermission = _interopRequireDefault(require("./edit-approval-permission.container"));

//# sourceMappingURL=ui/components/app/modals/edit-approval-permission/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/edit-approval-permission/index.js",}],
[3706, {"./account-details-modal.container":3705,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _accountDetailsModal.default;
  }
});

var _accountDetailsModal = _interopRequireDefault(require("./account-details-modal.container"));

//# sourceMappingURL=ui/components/app/modals/account-details-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/account-details-modal/index.js",}],
[3728, {"./customize-nonce.component":3727,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _customizeNonce.default;
  }
});

var _customizeNonce = _interopRequireDefault(require("./customize-nonce.component"));

//# sourceMappingURL=ui/components/app/modals/customize-nonce/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/customize-nonce/index.js",}],
[3737, {"./export-private-key-modal.container":3736,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _exportPrivateKeyModal.default;
  }
});

var _exportPrivateKeyModal = _interopRequireDefault(require("./export-private-key-modal.container"));

//# sourceMappingURL=ui/components/app/modals/export-private-key-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/export-private-key-modal/index.js",}],
[3717, {"./cancel-transaction.container":3716,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _cancelTransaction.default;
  }
});

var _cancelTransaction = _interopRequireDefault(require("./cancel-transaction.container"));

//# sourceMappingURL=ui/components/app/modals/cancel-transaction/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/cancel-transaction/index.js",}],
[3679, {"./gas-modal-page-container.container":3678,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _gasModalPageContainer.default;
  }
});

var _gasModalPageContainer = _interopRequireDefault(require("./gas-modal-page-container.container"));

//# sourceMappingURL=ui/components/app/gas-customization/gas-modal-page-container/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/gas-customization/gas-modal-page-container/index.js",}],
[4313, {"./swaps-gas-customization-modal.container":4315,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _swapsGasCustomizationModal.default;
  }
});

var _swapsGasCustomizationModal = _interopRequireDefault(require("./swaps-gas-customization-modal.container"));

//# sourceMappingURL=ui/pages/swaps/swaps-gas-customization-modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/swaps-gas-customization-modal/index.js",}],
[4055, {"../../../app/scripts/lib/util":78,"../../../shared/constants/app":3591,"../../components/ui/button":3842,"../../components/ui/identicon":3895,"../../components/ui/token-balance":3955,"../../helpers/utils/util":4020,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _button = _interopRequireDefault(require("../../components/ui/button"));

var _identicon = _interopRequireDefault(require("../../components/ui/identicon"));

var _tokenBalance = _interopRequireDefault(require("../../components/ui/token-balance"));

var _util = require("../../../app/scripts/lib/util");

var _app = require("../../../shared/constants/app");

var _util2 = require("../../helpers/utils/util");

class ConfirmAddSuggestedToken extends _react.Component {
  componentDidMount() {
    this._checksuggestedAssets();
  }

  componentDidUpdate() {
    this._checksuggestedAssets();
  }

  _checksuggestedAssets() {
    const {
      mostRecentOverviewPage,
      suggestedAssets = [],
      history
    } = this.props;

    if (suggestedAssets.length > 0) {
      return;
    }

    if ((0, _util.getEnvironmentType)() === _app.ENVIRONMENT_TYPE_NOTIFICATION) {
      global.platform.closeCurrentWindow();
    } else {
      history.push(mostRecentOverviewPage);
    }
  }

  getTokenName(name, symbol) {
    return typeof name === 'undefined' ? symbol : `${name} (${symbol})`;
  }

  render() {
    const {
      suggestedAssets,
      tokens,
      rejectWatchAsset,
      history,
      mostRecentOverviewPage,
      acceptWatchAsset
    } = this.props;
    const hasTokenDuplicates = this.checkTokenDuplicates(suggestedAssets, tokens);
    const reusesName = this.checkNameReuse(suggestedAssets, tokens);
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__title"
    }, this.context.t('addSuggestedTokens')), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__subtitle"
    }, this.context.t('likeToImportTokens')), hasTokenDuplicates ? /*#__PURE__*/_react.default.createElement("div", {
      className: "warning"
    }, this.context.t('knownTokenWarning')) : null, reusesName ? /*#__PURE__*/_react.default.createElement("div", {
      className: "warning"
    }, this.context.t('reusedTokenNameWarning')) : null), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__token"
    }, this.context.t('token')), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__balance"
    }, this.context.t('balance'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-import-token__token-list"
    }, suggestedAssets.map(({
      asset
    }) => {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__token-list-item",
        key: asset.address
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__token confirm-import-token__data"
      }, /*#__PURE__*/_react.default.createElement(_identicon.default, {
        className: "confirm-import-token__token-icon",
        diameter: 48,
        address: asset.address,
        image: asset.image
      }), /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__name"
      }, this.getTokenName(asset.name, asset.symbol))), /*#__PURE__*/_react.default.createElement("div", {
        className: "confirm-import-token__balance"
      }, /*#__PURE__*/_react.default.createElement(_tokenBalance.default, {
        token: asset
      })));
    })))), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__footer"
    }, /*#__PURE__*/_react.default.createElement("footer", null, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "page-container__footer-button",
      onClick: async () => {
        await Promise.all(suggestedAssets.map(async ({
          id
        }) => rejectWatchAsset(id)));
        history.push(mostRecentOverviewPage);
      }
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      large: true,
      className: "page-container__footer-button",
      disabled: suggestedAssets.length === 0,
      onClick: async () => {
        await Promise.all(suggestedAssets.map(async ({
          asset,
          id
        }) => {
          await acceptWatchAsset(id);
          this.context.trackEvent({
            event: 'Token Added',
            category: 'Wallet',
            sensitiveProperties: {
              token_symbol: asset.symbol,
              token_contract_address: asset.address,
              token_decimal_precision: asset.decimals,
              unlisted: asset.unlisted,
              source: 'dapp'
            }
          });
        }));
        history.push(mostRecentOverviewPage);
      }
    }, this.context.t('addToken')))));
  }

  checkTokenDuplicates(suggestedAssets, tokens) {
    const pending = suggestedAssets.map(({
      asset
    }) => asset.address.toUpperCase());
    const existing = tokens.map(token => token.address.toUpperCase());
    const dupes = pending.filter(proposed => {
      return existing.includes(proposed);
    });
    return dupes.length > 0;
  }
  /**
   * Returns true if any suggestedAssets both:
   * - Share a symbol with an existing `tokens` member.
   * - Does not share an address with that same `tokens` member.
   * This should be flagged as possibly deceptive or confusing.
   */


  checkNameReuse(suggestedAssets, tokens) {
    const duplicates = suggestedAssets.filter(({
      asset
    }) => {
      const dupes = tokens.filter(old => old.symbol === asset.symbol && !(0, _util2.isEqualCaseInsensitive)(old.address, asset.address));
      return dupes.length > 0;
    });
    return duplicates.length > 0;
  }

}

exports.default = ConfirmAddSuggestedToken;
(0, _defineProperty2.default)(ConfirmAddSuggestedToken, "contextTypes", {
  t: _propTypes.default.func,
  trackEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(ConfirmAddSuggestedToken, "propTypes", {
  history: _propTypes.default.object,
  acceptWatchAsset: _propTypes.default.func,
  rejectWatchAsset: _propTypes.default.func,
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  suggestedAssets: _propTypes.default.array,
  tokens: _propTypes.default.array
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/confirm-add-suggested-token/confirm-add-suggested-token.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-add-suggested-token/confirm-add-suggested-token.component.js",}],
[4133, {"../../helpers/constants/routes":3995,"../unlock-page":4320,"./create-password":4124,"./end-of-flow":4129,"./first-time-flow-switch":4132,"./metametrics-opt-in":4136,"./seed-phrase":4144,"./select-action":4151,"./welcome":4155,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _unlockPage = _interopRequireDefault(require("../unlock-page"));

var _routes = require("../../helpers/constants/routes");

var _firstTimeFlowSwitch = _interopRequireDefault(require("./first-time-flow-switch"));

var _welcome = _interopRequireDefault(require("./welcome"));

var _selectAction = _interopRequireDefault(require("./select-action"));

var _endOfFlow = _interopRequireDefault(require("./end-of-flow"));

var _createPassword = _interopRequireDefault(require("./create-password"));

var _seedPhrase = _interopRequireDefault(require("./seed-phrase"));

var _metametricsOptIn = _interopRequireDefault(require("./metametrics-opt-in"));

class FirstTimeFlow extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      seedPhrase: ''
    });
    (0, _defineProperty2.default)(this, "handleCreateNewAccount", async password => {
      const {
        createNewAccount
      } = this.props;

      try {
        const seedPhrase = await createNewAccount(password);
        this.setState({
          seedPhrase
        });
      } catch (error) {
        throw new Error(error.message);
      }
    });
    (0, _defineProperty2.default)(this, "handleImportWithSeedPhrase", async (password, seedPhrase) => {
      const {
        createNewAccountFromSeed
      } = this.props;

      try {
        const vault = await createNewAccountFromSeed(password, seedPhrase);
        return vault;
      } catch (error) {
        throw new Error(error.message);
      }
    });
    (0, _defineProperty2.default)(this, "handleUnlock", async password => {
      const {
        unlockAccount,
        history,
        nextRoute
      } = this.props;

      try {
        const seedPhrase = await unlockAccount(password);
        this.setState({
          seedPhrase
        }, () => {
          history.push(nextRoute);
        });
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  componentDidMount() {
    const {
      completedOnboarding,
      history,
      isInitialized,
      isUnlocked,
      showingSeedPhraseBackupAfterOnboarding,
      seedPhraseBackedUp
    } = this.props;

    if (completedOnboarding && (!showingSeedPhraseBackupAfterOnboarding || seedPhraseBackedUp)) {
      history.push(_routes.DEFAULT_ROUTE);
      return;
    }

    if (isInitialized && !isUnlocked) {
      history.push(_routes.INITIALIZE_UNLOCK_ROUTE);
    }
  }

  render() {
    const {
      seedPhrase
    } = this.state;
    const {
      verifySeedPhrase
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "first-time-flow"
    }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.INITIALIZE_SEED_PHRASE_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_seedPhrase.default, (0, _extends2.default)({}, routeProps, {
        seedPhrase: seedPhrase,
        verifySeedPhrase: verifySeedPhrase
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_seedPhrase.default, (0, _extends2.default)({}, routeProps, {
        seedPhrase: seedPhrase,
        verifySeedPhrase: verifySeedPhrase
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.INITIALIZE_SEED_PHRASE_INTRO_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_seedPhrase.default, (0, _extends2.default)({}, routeProps, {
        seedPhrase: seedPhrase,
        verifySeedPhrase: verifySeedPhrase
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.INITIALIZE_CREATE_PASSWORD_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_createPassword.default, (0, _extends2.default)({}, routeProps, {
        onCreateNewAccount: this.handleCreateNewAccount,
        onCreateNewAccountFromSeed: this.handleImportWithSeedPhrase
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.INITIALIZE_SELECT_ACTION_ROUTE,
      component: _selectAction.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.INITIALIZE_UNLOCK_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_unlockPage.default, (0, _extends2.default)({}, routeProps, {
        onSubmit: this.handleUnlock
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.INITIALIZE_END_OF_FLOW_ROUTE,
      component: _endOfFlow.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.INITIALIZE_WELCOME_ROUTE,
      component: _welcome.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: "*",
      component: _firstTimeFlowSwitch.default
    })));
  }

}

exports.default = FirstTimeFlow;
(0, _defineProperty2.default)(FirstTimeFlow, "propTypes", {
  completedOnboarding: _propTypes.default.bool,
  createNewAccount: _propTypes.default.func,
  createNewAccountFromSeed: _propTypes.default.func,
  history: _propTypes.default.object,
  isInitialized: _propTypes.default.bool,
  isUnlocked: _propTypes.default.bool,
  unlockAccount: _propTypes.default.func,
  nextRoute: _propTypes.default.string,
  showingSeedPhraseBackupAfterOnboarding: _propTypes.default.bool,
  seedPhraseBackedUp: _propTypes.default.bool,
  verifySeedPhrase: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/first-time-flow/first-time-flow.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/first-time-flow.component.js",}],
[3613, {"../../../../app/scripts/lib/util":78,"../../../../shared/constants/app":3591,"../../../ducks/metamask/metamask":3985,"../../../helpers/constants/common":3990,"../../../helpers/constants/routes":3995,"../../../helpers/utils/build-types":4006,"../../../hooks/useTokenTracker":4043,"../../../selectors":4326,"../../ui/identicon":3895,"../../ui/search-icon":3934,"../../ui/site-icon":3939,"../../ui/text-field":3951,"../user-preferenced-currency-display":3820,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@material-ui/core/InputAdornment":554,"classnames":1449,"fuse.js":1881,"lodash":2646,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccountMenuItem = AccountMenuItem;
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _fuse = _interopRequireDefault(require("fuse.js"));

var _reactRedux = require("react-redux");

var _InputAdornment = _interopRequireDefault(require("@material-ui/core/InputAdornment"));

var _classnames = _interopRequireDefault(require("classnames"));

var _app = require("../../../../shared/constants/app");

var _util = require("../../../../app/scripts/lib/util");

var _identicon = _interopRequireDefault(require("../../ui/identicon"));

var _siteIcon = _interopRequireDefault(require("../../ui/site-icon"));

var _userPreferencedCurrencyDisplay = _interopRequireDefault(require("../user-preferenced-currency-display"));

var _common = require("../../../helpers/constants/common");

var _routes = require("../../../helpers/constants/routes");

var _textField = _interopRequireDefault(require("../../ui/text-field"));

var _searchIcon = _interopRequireDefault(require("../../ui/search-icon"));

var _buildTypes = require("../../../helpers/utils/build-types");

var _selectors = require("../../../selectors");

var _metamask = require("../../../ducks/metamask/metamask");

var _useTokenTracker = require("../../../hooks/useTokenTracker");

function AccountMenuItem(props) {
  const {
    icon,
    children,
    text,
    subText,
    className,
    onClick
  } = props;
  const itemClassName = (0, _classnames.default)('account-menu__item', className, {
    'account-menu__item--clickable': Boolean(onClick)
  });
  return children ? /*#__PURE__*/_react.default.createElement("div", {
    className: itemClassName,
    onClick: onClick
  }, children) : /*#__PURE__*/_react.default.createElement("div", {
    className: itemClassName,
    onClick: onClick
  }, icon ? /*#__PURE__*/_react.default.createElement("div", {
    className: "account-menu__item__icon"
  }, icon) : null, text ? /*#__PURE__*/_react.default.createElement("div", {
    className: "account-menu__item__text"
  }, text) : null, subText ? /*#__PURE__*/_react.default.createElement("div", {
    className: "account-menu__item__subtext"
  }, subText) : null);
}

AccountMenuItem.propTypes = {
  icon: _propTypes.default.node,
  children: _propTypes.default.node,
  text: _propTypes.default.node,
  subText: _propTypes.default.node,
  onClick: _propTypes.default.func,
  className: _propTypes.default.string
};

class AccountMenu extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "accountsRef", void 0);
    (0, _defineProperty2.default)(this, "state", {
      shouldShowScrollButton: false,
      searchQuery: ''
    });
    (0, _defineProperty2.default)(this, "addressFuse", new _fuse.default([], {
      threshold: 0.45,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [{
        name: 'name',
        weight: 0.5
      }, {
        name: 'address',
        weight: 0.5
      }]
    }));
    (0, _defineProperty2.default)(this, "setShouldShowScrollButton", () => {
      if (!this.accountsRef) {
        return;
      }

      const {
        scrollTop,
        offsetHeight,
        scrollHeight
      } = this.accountsRef;
      const canScroll = scrollHeight > offsetHeight;
      const atAccountListBottom = scrollTop + offsetHeight >= scrollHeight;
      const shouldShowScrollButton = canScroll && !atAccountListBottom;
      this.setState({
        shouldShowScrollButton
      });
    });
    (0, _defineProperty2.default)(this, "onScroll", (0, _lodash.debounce)(this.setShouldShowScrollButton, 25));
    (0, _defineProperty2.default)(this, "handleScrollDown", e => {
      e.stopPropagation();
      const {
        scrollHeight
      } = this.accountsRef;
      this.accountsRef.scroll({
        left: 0,
        top: scrollHeight,
        behavior: 'smooth'
      });
      this.setShouldShowScrollButton();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isAccountMenuOpen: prevIsAccountMenuOpen
    } = prevProps;
    const {
      searchQuery: prevSearchQuery
    } = prevState;
    const {
      isAccountMenuOpen
    } = this.props;
    const {
      searchQuery
    } = this.state;

    if (!prevIsAccountMenuOpen && isAccountMenuOpen) {
      this.setShouldShowScrollButton();
      this.resetSearchQuery();
    } // recalculate on each search query change
    // whether we can show scroll down button


    if (isAccountMenuOpen && prevSearchQuery !== searchQuery) {
      this.setShouldShowScrollButton();
    }
  }

  renderAccountsSearch() {
    const inputAdornment = /*#__PURE__*/_react.default.createElement(_InputAdornment.default, {
      position: "start",
      style: {
        maxHeight: 'none',
        marginRight: 0,
        marginLeft: '8px'
      }
    }, /*#__PURE__*/_react.default.createElement(_searchIcon.default, null));

    return [/*#__PURE__*/_react.default.createElement(_textField.default, {
      key: "search-text-field",
      id: "search-accounts",
      placeholder: this.context.t('searchAccounts'),
      type: "text",
      value: this.state.searchQuery,
      onChange: e => this.setSearchQuery(e.target.value),
      startAdornment: inputAdornment,
      fullWidth: true,
      theme: "material-white-padded"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__divider",
      key: "search-divider"
    })];
  }

  renderAccounts() {
    const {
      accounts,
      selectedAddress,
      keyrings,
      showAccountDetail,
      addressConnectedDomainMap,
      originOfCurrentTab
    } = this.props;
    const {
      searchQuery
    } = this.state;
    let filteredIdentities = accounts;

    if (searchQuery) {
      this.addressFuse.setCollection(accounts);
      filteredIdentities = this.addressFuse.search(searchQuery);
    }

    if (filteredIdentities.length === 0) {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: "account-menu__no-accounts"
      }, this.context.t('noAccountsFound'));
    }

    return filteredIdentities.map((identity, i) => {
      const isSelected = identity.address === selectedAddress;
      const simpleAddress = identity.address.substring(2).toLowerCase();
      const keyring = keyrings.find(kr => {
        return kr.accounts.includes(simpleAddress) || kr.accounts.includes(identity.address);
      });
      const addressDomains = addressConnectedDomainMap[identity.address] || {};
      const iconAndNameForOpenDomain = addressDomains[originOfCurrentTab];
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "account-menu__account account-menu__item--clickable",
        onClick: () => {
          this.context.metricsEvent({
            eventOpts: {
              category: 'Navigation',
              action: 'Main Menu',
              name: 'Switched Account'
            }
          });
          showAccountDetail(identity.address);
        },
        key: identity.address
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "account-menu__check-mark"
      }, isSelected && /*#__PURE__*/_react.default.createElement("div", {
        className: "account-menu__check-mark-icon"
      })), /*#__PURE__*/_react.default.createElement(_identicon.default, {
        address: identity.address,
        diameter: 24,
        image: `./images/monsta-accounts/(${1 + i % 10}).png`
      }), /*#__PURE__*/_react.default.createElement(UserCurrencyDisplay, {
        identity: identity
      }), this.renderKeyringType(keyring), iconAndNameForOpenDomain ? /*#__PURE__*/_react.default.createElement("div", {
        className: "account-menu__icon-list"
      }, /*#__PURE__*/_react.default.createElement(_siteIcon.default, {
        icon: iconAndNameForOpenDomain.icon,
        name: iconAndNameForOpenDomain.name,
        size: 32
      })) : null);
    });
  }

  renderKeyringType(keyring) {
    const {
      t
    } = this.context; // Sometimes keyrings aren't loaded yet

    if (!keyring) {
      return null;
    }

    const {
      type
    } = keyring;
    let label;

    switch (type) {
      case 'Trezor Hardware':
      case 'Ledger Hardware':
        label = t('hardware');
        break;

      case 'Simple Key Pair':
        label = t('imported');
        break;

      default:
        return null;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "keyring-label allcaps"
    }, label);
  }

  resetSearchQuery() {
    this.setSearchQuery('');
  }

  setSearchQuery(searchQuery) {
    this.setState({
      searchQuery
    });
  }

  renderScrollButton() {
    if (!this.state.shouldShowScrollButton) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__scroll-button",
      onClick: this.handleScrollDown
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "./images/icons/down-arrow.svg",
      width: "28",
      height: "28",
      alt: this.context.t('scrollDown')
    }));
  }

  render() {
    const {
      t,
      metricsEvent
    } = this.context;
    const {
      shouldShowAccountsSearch,
      isAccountMenuOpen,
      toggleAccountMenu,
      lockMetamask,
      history
    } = this.props;

    if (!isAccountMenuOpen) {
      return null;
    }

    let supportText = t('support');
    let supportLink = 'https://discord.gg/RCBhq6b6gA';

    if ((0, _buildTypes.isBeta)()) {
      supportText = t('needHelpSubmitTicket');
      supportLink = 'https://discord.gg/RCBhq6b6gA';
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__close-area",
      onClick: toggleAccountMenu
    }), /*#__PURE__*/_react.default.createElement(AccountMenuItem, {
      className: "account-menu__header"
    }, t('myAccounts'), /*#__PURE__*/_react.default.createElement("button", {
      className: "account-menu__lock-button",
      onClick: () => {
        lockMetamask();
        history.push(_routes.DEFAULT_ROUTE);
      }
    }, t('lock'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__divider"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__accounts-container"
    }, shouldShowAccountsSearch ? this.renderAccountsSearch() : null, /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__accounts",
      onScroll: this.onScroll,
      ref: ref => {
        this.accountsRef = ref;
      }
    }, this.renderAccounts()), this.renderScrollButton()), /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__divider"
    }), /*#__PURE__*/_react.default.createElement(AccountMenuItem, {
      onClick: () => {
        toggleAccountMenu();
        metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Main Menu',
            name: 'Clicked Create Account'
          }
        });
        history.push(_routes.NEW_ACCOUNT_ROUTE);
      },
      icon: /*#__PURE__*/_react.default.createElement("img", {
        className: "account-menu__item-icon",
        src: "images/plus-btn-white.svg",
        alt: t('createAccount')
      }),
      text: t('createAccount')
    }), /*#__PURE__*/_react.default.createElement(AccountMenuItem, {
      onClick: () => {
        toggleAccountMenu();
        metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Main Menu',
            name: 'Clicked Import Account'
          }
        });
        history.push(_routes.IMPORT_ACCOUNT_ROUTE);
      },
      icon: /*#__PURE__*/_react.default.createElement("img", {
        className: "account-menu__item-icon",
        src: "images/import-account.svg",
        alt: t('importAccount')
      }),
      text: t('importAccount')
    }), /*#__PURE__*/_react.default.createElement(AccountMenuItem, {
      onClick: () => {
        toggleAccountMenu();
        metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Main Menu',
            name: 'Clicked Connect Hardware'
          }
        });

        if ((0, _util.getEnvironmentType)() === _app.ENVIRONMENT_TYPE_POPUP) {
          global.platform.openExtensionInBrowser(_routes.CONNECT_HARDWARE_ROUTE);
        } else {
          history.push(_routes.CONNECT_HARDWARE_ROUTE);
        }
      },
      icon: /*#__PURE__*/_react.default.createElement("img", {
        className: "account-menu__item-icon",
        src: "images/connect-icon.svg",
        alt: t('connectHardwareWallet')
      }),
      text: t('connectHardwareWallet')
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "account-menu__divider"
    }), /*#__PURE__*/_react.default.createElement(AccountMenuItem, {
      onClick: () => {
        toggleAccountMenu();
        history.push(_routes.SETTINGS_ROUTE);
        this.context.metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Main Menu',
            name: 'Opened Settings'
          }
        });
      },
      icon: /*#__PURE__*/_react.default.createElement("img", {
        className: "account-menu__item-icon",
        src: "images/settings.svg"
      }),
      text: t('settings')
    }));
  }

}

exports.default = AccountMenu;
(0, _defineProperty2.default)(AccountMenu, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(AccountMenu, "propTypes", {
  shouldShowAccountsSearch: _propTypes.default.bool,
  accounts: _propTypes.default.array,
  history: _propTypes.default.object,
  isAccountMenuOpen: _propTypes.default.bool,
  keyrings: _propTypes.default.array,
  lockMetamask: _propTypes.default.func,
  selectedAddress: _propTypes.default.string,
  showAccountDetail: _propTypes.default.func,
  toggleAccountMenu: _propTypes.default.func,
  addressConnectedDomainMap: _propTypes.default.object,
  originOfCurrentTab: _propTypes.default.string
});

const UserCurrencyDisplay = ({
  identity
}) => {
  const shouldHideZeroBalanceTokens = (0, _reactRedux.useSelector)(_selectors.getShouldHideZeroBalanceTokens); // use `isEqual` comparison function because the token array is serialized
  // from the background so it has a new reference with each background update,
  // even if the tokens haven't changed

  const tokens = (0, _reactRedux.useSelector)(_metamask.getTokens, _lodash.isEqual);
  const {
    loading,
    tokensWithBalances
  } = (0, _useTokenTracker.useTokenTracker)(tokens, true, shouldHideZeroBalanceTokens, identity.address);
  const balance = tokensWithBalances.length > 0 ? tokensWithBalances[0].string : '0';
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "account-menu__account-info"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "account-menu__name"
  }, identity.name || ''), !loading && /*#__PURE__*/_react.default.createElement(_userPreferencedCurrencyDisplay.default, {
    justValue: true,
    className: "account-menu__balance",
    value: balance,
    type: _common.PRIMARY
  }));
};

UserCurrencyDisplay.propTypes = {
  identity: _propTypes.default.object
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/components/app/account-menu/account-menu.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/account-menu/account-menu.component.js",}],
[3952, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"@material-ui/core/TextField":679,"@material-ui/core/styles":754,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styles = require("@material-ui/core/styles");

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const inputLabelBase = {
  transform: 'none',
  transition: 'none',
  position: 'initial',
  color: '#5b5b5b'
};
const styles = {
  materialLabel: {
    '&$materialFocused': {
      color: '#aeaeae'
    },
    '&$materialError': {
      color: '#aeaeae'
    },
    'fontWeight': '400',
    'color': '#aeaeae'
  },
  materialFocused: {},
  materialUnderline: {
    '&:after': {
      borderBottom: `2px solid rgb(3, 125, 214)`
    }
  },
  materialError: {},
  materialWhitePaddedRoot: {
    color: '#aeaeae'
  },
  materialWhitePaddedInput: {
    'padding': '8px',
    '&::placeholder': {
      color: '#aeaeae'
    }
  },
  materialWhitePaddedFocused: {
    color: '#fff'
  },
  materialWhitePaddedUnderline: {
    '&:after': {
      borderBottom: '2px solid #fff'
    }
  },
  // Non-material styles
  formLabel: {
    '&$formLabelFocused': {
      color: '#5b5b5b'
    },
    '&$materialError': {
      color: '#5b5b5b'
    }
  },
  formLabelFocused: {},
  inputFocused: {},
  inputRoot: {
    'label + &': {
      marginTop: '9px'
    },
    'border': '1px solid #BBC0C5',
    'height': '48px',
    'borderRadius': '6px',
    'padding': '0 16px',
    'display': 'flex',
    'alignItems': 'center',
    '&$inputFocused': {
      border: '1px solid #2f9ae0'
    }
  },
  inputWhiteRoot: {
    'color': '#fff',
    'label + &': {
      marginTop: '9px'
    },
    'border': '1px solid #BBC0C5',
    'height': '48px',
    'borderRadius': '6px',
    'padding': '0 16px',
    'display': 'flex',
    'alignItems': 'center',
    '&$inputFocused': {
      border: '1px solid #2f9ae0'
    }
  },
  largeInputLabel: _objectSpread(_objectSpread({}, inputLabelBase), {}, {
    fontSize: '1rem'
  }),
  inputLabel: _objectSpread(_objectSpread({}, inputLabelBase), {}, {
    fontSize: '.75rem'
  }),
  largeWhiteInputLabel: _objectSpread(_objectSpread({}, inputLabelBase), {}, {
    fontSize: '1rem',
    color: '#fff'
  }),
  inputWhiteLabel: _objectSpread(_objectSpread({}, inputLabelBase), {}, {
    fontSize: '.75rem',
    color: '#fff'
  }),
  inputMultiline: {
    lineHeight: 'initial !important'
  }
};

const getMaterialThemeInputProps = ({
  dir,
  classes: {
    materialLabel,
    materialFocused,
    materialError,
    materialUnderline
  },
  startAdornment,
  min,
  max,
  autoComplete
}) => ({
  InputLabelProps: {
    classes: {
      root: materialLabel,
      focused: materialFocused,
      error: materialError
    }
  },
  InputProps: {
    startAdornment,
    classes: {
      underline: materialUnderline
    },
    inputProps: {
      dir,
      min,
      max,
      autoComplete
    }
  }
});

const getMaterialWhitePaddedThemeInputProps = ({
  dir,
  classes: {
    materialWhitePaddedRoot,
    materialWhitePaddedFocused,
    materialWhitePaddedInput,
    materialWhitePaddedUnderline
  },
  startAdornment,
  min,
  max,
  autoComplete
}) => ({
  InputProps: {
    startAdornment,
    classes: {
      root: materialWhitePaddedRoot,
      focused: materialWhitePaddedFocused,
      input: materialWhitePaddedInput,
      underline: materialWhitePaddedUnderline
    },
    inputProps: {
      dir,
      min,
      max,
      autoComplete
    }
  }
});

const getBorderedThemeInputProps = ({
  dir,
  classes: {
    formLabel,
    formLabelFocused,
    materialError,
    largeInputLabel,
    inputLabel,
    inputRoot,
    input,
    inputFocused
  },
  largeLabel,
  startAdornment,
  min,
  max,
  autoComplete
}) => ({
  InputLabelProps: {
    shrink: true,
    className: largeLabel ? largeInputLabel : inputLabel,
    classes: {
      root: formLabel,
      focused: formLabelFocused,
      error: materialError
    }
  },
  InputProps: {
    startAdornment,
    disableUnderline: true,
    classes: {
      root: inputRoot,
      input,
      focused: inputFocused
    },
    inputProps: {
      dir,
      min,
      max,
      autoComplete
    }
  }
});

const getWhiteBorderedThemeInputProps = ({
  dir,
  classes: {
    formLabel,
    formLabelFocused,
    materialError,
    largeWhiteInputLabel,
    inputWhiteLabel,
    inputWhiteRoot,
    input,
    inputFocused
  },
  largeLabel,
  startAdornment,
  min,
  max,
  autoComplete
}) => ({
  InputLabelProps: {
    shrink: true,
    className: largeLabel ? largeWhiteInputLabel : inputWhiteLabel,
    classes: {
      root: formLabel,
      focused: formLabelFocused,
      error: materialError
    }
  },
  InputProps: {
    startAdornment,
    disableUnderline: true,
    classes: {
      root: inputWhiteRoot,
      input,
      focused: inputFocused
    },
    inputProps: {
      dir,
      min,
      max,
      autoComplete
    }
  }
});

const themeToInputProps = {
  'material': getMaterialThemeInputProps,
  'bordered': getBorderedThemeInputProps,
  'white-bordered': getWhiteBorderedThemeInputProps,
  'material-white-padded': getMaterialWhitePaddedThemeInputProps
};

const TextField = (_ref) => {
  let {
    error,
    classes,
    theme,
    startAdornment,
    largeLabel,
    dir,
    min,
    max,
    autoComplete
  } = _ref,
      textFieldProps = (0, _objectWithoutProperties2.default)(_ref, ["error", "classes", "theme", "startAdornment", "largeLabel", "dir", "min", "max", "autoComplete"]);
  const inputProps = themeToInputProps[theme]({
    classes,
    startAdornment,
    largeLabel,
    dir,
    min,
    max,
    autoComplete
  });
  return /*#__PURE__*/_react.default.createElement(_TextField.default, (0, _extends2.default)({
    error: Boolean(error),
    helperText: error
  }, inputProps, textFieldProps));
};

TextField.defaultProps = {
  error: null,
  dir: 'auto',
  theme: 'bordered'
};
TextField.propTypes = {
  error: _propTypes.default.string,
  classes: _propTypes.default.object,
  dir: _propTypes.default.string,
  theme: _propTypes.default.oneOf(['bordered', 'white-bordered', 'material', 'material-white-padded']),
  startAdornment: _propTypes.default.element,
  largeLabel: _propTypes.default.bool,
  min: _propTypes.default.number,
  max: _propTypes.default.number,
  autoComplete: _propTypes.default.string
};

var _default = (0, _styles.withStyles)(styles)(TextField);

exports.default = _default;

//# sourceMappingURL=ui/components/ui/text-field/text-field.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/text-field/text-field.component.js",}],
[4224, {"./send-header.component":4225,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _sendHeader.default;
  }
});

var _sendHeader = _interopRequireDefault(require("./send-header.component"));

//# sourceMappingURL=ui/pages/send/send-header/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-header/index.js",}],
[4221, {"./send-footer.container":4223,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _sendFooter.default;
  }
});

var _sendFooter = _interopRequireDefault(require("./send-footer.container"));

//# sourceMappingURL=ui/pages/send/send-footer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-footer/index.js",}],
[4197, {"./ens-input.container":4196,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _ensInput.default;
  }
});

var _ensInput = _interopRequireDefault(require("./ens-input.container"));

//# sourceMappingURL=ui/pages/send/send-content/add-recipient/ens-input.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/add-recipient/ens-input.js",}],
[4198, {"./add-recipient.container":4194,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _addRecipient.default;
  }
});

var _addRecipient = _interopRequireDefault(require("./add-recipient.container"));

//# sourceMappingURL=ui/pages/send/send-content/add-recipient/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/add-recipient/index.js",}],
[4199, {"./send-content.container":4209,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _sendContent.default;
  }
});

var _sendContent = _interopRequireDefault(require("./send-content.container"));

//# sourceMappingURL=ui/pages/send/send-content/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/index.js",}],
[4160, {"../../components/app/asset-list":3629,"../../components/app/home-notification":3685,"../../components/app/menu-bar":3692,"../../components/app/multiple-notifications":3758,"../../components/app/recovery-phrase-reminder":3771,"../../components/app/transaction-list":3816,"../../components/app/wallet-overview":3829,"../../components/app/whats-new-popup":3832,"../../components/ui/button":3842,"../../components/ui/popover":3925,"../../components/ui/tabs":3945,"../../helpers/constants/routes":3995,"../../helpers/utils/build-types":4006,"../../helpers/utils/util":4020,"../connected-accounts":4103,"../connected-sites":4106,"./beta-home-footer.component":4159,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _util = require("../../helpers/utils/util");

var _assetList = _interopRequireDefault(require("../../components/app/asset-list"));

var _homeNotification = _interopRequireDefault(require("../../components/app/home-notification"));

var _multipleNotifications = _interopRequireDefault(require("../../components/app/multiple-notifications"));

var _transactionList = _interopRequireDefault(require("../../components/app/transaction-list"));

var _menuBar = _interopRequireDefault(require("../../components/app/menu-bar"));

var _popover = _interopRequireDefault(require("../../components/ui/popover"));

var _button = _interopRequireDefault(require("../../components/ui/button"));

var _connectedSites = _interopRequireDefault(require("../connected-sites"));

var _connectedAccounts = _interopRequireDefault(require("../connected-accounts"));

var _tabs = require("../../components/ui/tabs");

var _walletOverview = require("../../components/app/wallet-overview");

var _whatsNewPopup = _interopRequireDefault(require("../../components/app/whats-new-popup"));

var _recoveryPhraseReminder = _interopRequireDefault(require("../../components/app/recovery-phrase-reminder"));

var _buildTypes = require("../../helpers/utils/build-types");

var _routes = require("../../helpers/constants/routes");

var _betaHomeFooter = _interopRequireDefault(require("./beta-home-footer.component"));

const LEARN_MORE_URL = 'https://metamask.zendesk.com/hc/en-us/articles/360045129011-Intro-to-MetaMask-v8-extension';
const LEGACY_WEB3_URL = 'https://metamask.zendesk.com/hc/en-us/articles/360053147012';
const INFURA_BLOCKAGE_URL = 'https://metamask.zendesk.com/hc/en-us/articles/360059386712';

class Home extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      // eslint-disable-next-line react/no-unused-state
      mounted: false,
      canShowBlockageNotification: true
    });
    (0, _defineProperty2.default)(this, "onRecoveryPhraseReminderClose", () => {
      const {
        setRecoveryPhraseReminderHasBeenShown,
        setRecoveryPhraseReminderLastShown
      } = this.props;
      setRecoveryPhraseReminderHasBeenShown(true);
      setRecoveryPhraseReminderLastShown(new Date().getTime());
    });
    (0, _defineProperty2.default)(this, "renderPopover", () => {
      const {
        setConnectedStatusPopoverHasBeenShown
      } = this.props;
      const {
        t
      } = this.context;
      return /*#__PURE__*/_react.default.createElement(_popover.default, {
        title: t('whatsThis'),
        onClose: setConnectedStatusPopoverHasBeenShown,
        className: "home__connected-status-popover",
        showArrow: true,
        CustomBackground: ({
          onClose
        }) => {
          return /*#__PURE__*/_react.default.createElement("div", {
            className: "home__connected-status-popover-bg-container",
            onClick: onClose
          }, /*#__PURE__*/_react.default.createElement("div", {
            className: "home__connected-status-popover-bg"
          }));
        },
        footer: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("a", {
          href: LEARN_MORE_URL,
          target: "_blank",
          rel: "noopener noreferrer"
        }, t('learnMore')), /*#__PURE__*/_react.default.createElement(_button.default, {
          type: "primary",
          onClick: setConnectedStatusPopoverHasBeenShown
        }, t('dismiss')))
      }, /*#__PURE__*/_react.default.createElement("main", {
        className: "home__connect-status-text"
      }, /*#__PURE__*/_react.default.createElement("div", null, t('metaMaskConnectStatusParagraphOne')), /*#__PURE__*/_react.default.createElement("div", null, t('metaMaskConnectStatusParagraphTwo')), /*#__PURE__*/_react.default.createElement("div", null, t('metaMaskConnectStatusParagraphThree'))));
    });
  }

  componentDidMount() {
    const {
      firstPermissionsRequestId,
      history,
      isNotification,
      suggestedAssets = [],
      totalUnapprovedCount,
      unconfirmedTransactionsCount,
      haveSwapsQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
      pendingConfirmations
    } = this.props; // eslint-disable-next-line react/no-unused-state

    this.setState({
      mounted: true
    });

    if (isNotification && totalUnapprovedCount === 0) {
      global.platform.closeCurrentWindow();
    } else if (!isNotification && showAwaitingSwapScreen) {
      history.push(_routes.AWAITING_SWAP_ROUTE);
    } else if (!isNotification && haveSwapsQuotes) {
      history.push(_routes.VIEW_QUOTE_ROUTE);
    } else if (!isNotification && swapsFetchParams) {
      history.push(_routes.BUILD_QUOTE_ROUTE);
    } else if (firstPermissionsRequestId) {
      history.push(`${_routes.CONNECT_ROUTE}/${firstPermissionsRequestId}`);
    } else if (unconfirmedTransactionsCount > 0) {
      history.push(_routes.CONFIRM_TRANSACTION_ROUTE);
    } else if (suggestedAssets.length > 0) {
      history.push(_routes.CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE);
    } else if (pendingConfirmations.length > 0) {
      history.push(_routes.CONFIRMATION_V_NEXT_ROUTE);
    }
  }

  static getDerivedStateFromProps({
    firstPermissionsRequestId,
    isNotification,
    suggestedAssets,
    totalUnapprovedCount,
    unconfirmedTransactionsCount,
    haveSwapsQuotes,
    showAwaitingSwapScreen,
    swapsFetchParams
  }, {
    mounted
  }) {
    if (!mounted) {
      if (isNotification && totalUnapprovedCount === 0) {
        return {
          closing: true
        };
      } else if (firstPermissionsRequestId || unconfirmedTransactionsCount > 0 || suggestedAssets.length > 0 || !isNotification && (showAwaitingSwapScreen || haveSwapsQuotes || swapsFetchParams)) {
        return {
          redirecting: true
        };
      }
    }

    return null;
  }

  componentDidUpdate(_, prevState) {
    const {
      setupThreeBox,
      showRestorePrompt,
      threeBoxLastUpdated,
      threeBoxSynced
    } = this.props;

    if (!prevState.closing && this.state.closing) {
      global.platform.closeCurrentWindow();
    }

    if (threeBoxSynced && showRestorePrompt && threeBoxLastUpdated === null) {
      setupThreeBox();
    }
  }

  renderNotifications() {
    const {
      t
    } = this.context;
    const {
      history,
      shouldShowSeedPhraseReminder,
      isPopup,
      selectedAddress,
      restoreFromThreeBox,
      turnThreeBoxSyncingOn,
      setShowRestorePromptToFalse,
      showRestorePrompt,
      threeBoxLastUpdated,
      shouldShowWeb3ShimUsageNotification,
      setWeb3ShimUsageAlertDismissed,
      originOfCurrentTab,
      disableWeb3ShimUsageAlert,
      infuraBlocked
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_multipleNotifications.default, null, shouldShowWeb3ShimUsageNotification ? /*#__PURE__*/_react.default.createElement(_homeNotification.default, {
      descriptionText: t('web3ShimUsageNotification', [/*#__PURE__*/_react.default.createElement("span", {
        key: "web3ShimUsageNotificationLink",
        className: "home-notification__text-link",
        onClick: () => global.platform.openTab({
          url: LEGACY_WEB3_URL
        })
      }, t('here'))]),
      ignoreText: t('dismiss'),
      onIgnore: disable => {
        setWeb3ShimUsageAlertDismissed(originOfCurrentTab);

        if (disable) {
          disableWeb3ShimUsageAlert();
        }
      },
      checkboxText: t('dontShowThisAgain'),
      checkboxTooltipText: t('canToggleInSettings'),
      key: "home-web3ShimUsageNotification"
    }) : null, shouldShowSeedPhraseReminder ? /*#__PURE__*/_react.default.createElement(_homeNotification.default, {
      descriptionText: t('backupApprovalNotice'),
      acceptText: t('backupNow'),
      onAccept: () => {
        if (isPopup) {
          global.platform.openExtensionInBrowser(_routes.INITIALIZE_BACKUP_SEED_PHRASE_ROUTE);
        } else {
          history.push(_routes.INITIALIZE_BACKUP_SEED_PHRASE_ROUTE);
        }
      },
      infoText: t('backupApprovalInfo'),
      key: "home-backupApprovalNotice"
    }) : null, threeBoxLastUpdated && showRestorePrompt ? /*#__PURE__*/_react.default.createElement(_homeNotification.default, {
      descriptionText: t('restoreWalletPreferences', [(0, _util.formatDate)(threeBoxLastUpdated, 'M/d/y')]),
      acceptText: t('restore'),
      ignoreText: t('noThanks'),
      infoText: t('dataBackupFoundInfo'),
      onAccept: () => {
        restoreFromThreeBox(selectedAddress).then(() => {
          turnThreeBoxSyncingOn();
        });
      },
      onIgnore: () => {
        setShowRestorePromptToFalse();
      },
      key: "home-privacyModeDefault"
    }) : null, infuraBlocked && this.state.canShowBlockageNotification ? /*#__PURE__*/_react.default.createElement(_homeNotification.default, {
      descriptionText: t('infuraBlockedNotification', [/*#__PURE__*/_react.default.createElement("span", {
        key: "infuraBlockedNotificationLink",
        className: "home-notification__text-link",
        onClick: () => global.platform.openTab({
          url: INFURA_BLOCKAGE_URL
        })
      }, t('here'))]),
      ignoreText: t('dismiss'),
      onIgnore: () => {
        this.setState({
          canShowBlockageNotification: false
        });
      },
      key: "home-infuraBlockedNotification"
    }) : null);
  }

  render() {
    const {
      t
    } = this.context;
    const {
      defaultHomeActiveTabName,
      onTabClick,
      forgottenPassword,
      history,
      connectedStatusPopoverHasBeenShown,
      isPopup,
      notificationsToShow,
      showWhatsNewPopup,
      hideWhatsNewPopup,
      seedPhraseBackedUp,
      showRecoveryPhraseReminder
    } = this.props;

    if (forgottenPassword) {
      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: {
          pathname: _routes.RESTORE_VAULT_ROUTE
        }
      });
    } else if (this.state.closing || this.state.redirecting) {
      return null;
    }

    const showWhatsNew = notificationsToShow && showWhatsNewPopup;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "main-container"
    }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.CONNECTED_ROUTE,
      component: _connectedSites.default,
      exact: true
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: _routes.CONNECTED_ACCOUNTS_ROUTE,
      component: _connectedAccounts.default,
      exact: true
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "home__container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "home__main-view"
    }, /*#__PURE__*/_react.default.createElement(_menuBar.default, null), /*#__PURE__*/_react.default.createElement("div", {
      className: "home__balance-wrapper"
    }, /*#__PURE__*/_react.default.createElement(_walletOverview.EthOverview, null)), /*#__PURE__*/_react.default.createElement(_tabs.Tabs, {
      defaultActiveTabName: defaultHomeActiveTabName,
      onTabClick: onTabClick,
      tabsClassName: "home__tabs"
    }, /*#__PURE__*/_react.default.createElement(_tabs.Tab, {
      activeClassName: "home__tab--active",
      className: "home__tab",
      "data-testid": "home__asset-tab",
      name: t('assets')
    }, /*#__PURE__*/_react.default.createElement(_assetList.default, {
      onClickAsset: asset => history.push(`${_routes.ASSET_ROUTE}/${asset}`)
    })), /*#__PURE__*/_react.default.createElement(_tabs.Tab, {
      activeClassName: "home__tab--active",
      className: "home__tab",
      "data-testid": "home__activity-tab",
      name: t('activity')
    }, /*#__PURE__*/_react.default.createElement(_transactionList.default, null)))), this.renderNotifications()));
  }

}

exports.default = Home;
(0, _defineProperty2.default)(Home, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(Home, "propTypes", {
  history: _propTypes.default.object,
  forgottenPassword: _propTypes.default.bool,
  suggestedAssets: _propTypes.default.array,
  unconfirmedTransactionsCount: _propTypes.default.number,
  shouldShowSeedPhraseReminder: _propTypes.default.bool.isRequired,
  isPopup: _propTypes.default.bool,
  isNotification: _propTypes.default.bool.isRequired,
  threeBoxSynced: _propTypes.default.bool,
  setupThreeBox: _propTypes.default.func,
  turnThreeBoxSyncingOn: _propTypes.default.func,
  showRestorePrompt: _propTypes.default.bool,
  selectedAddress: _propTypes.default.string,
  restoreFromThreeBox: _propTypes.default.func,
  setShowRestorePromptToFalse: _propTypes.default.func,
  threeBoxLastUpdated: _propTypes.default.number,
  firstPermissionsRequestId: _propTypes.default.string,
  totalUnapprovedCount: _propTypes.default.number.isRequired,
  setConnectedStatusPopoverHasBeenShown: _propTypes.default.func,
  connectedStatusPopoverHasBeenShown: _propTypes.default.bool,
  defaultHomeActiveTabName: _propTypes.default.string,
  onTabClick: _propTypes.default.func.isRequired,
  haveSwapsQuotes: _propTypes.default.bool.isRequired,
  showAwaitingSwapScreen: _propTypes.default.bool.isRequired,
  swapsFetchParams: _propTypes.default.object,
  shouldShowWeb3ShimUsageNotification: _propTypes.default.bool.isRequired,
  setWeb3ShimUsageAlertDismissed: _propTypes.default.func.isRequired,
  originOfCurrentTab: _propTypes.default.string,
  disableWeb3ShimUsageAlert: _propTypes.default.func.isRequired,
  pendingConfirmations: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  infuraBlocked: _propTypes.default.bool.isRequired,
  showWhatsNewPopup: _propTypes.default.bool.isRequired,
  hideWhatsNewPopup: _propTypes.default.func.isRequired,
  notificationsToShow: _propTypes.default.bool.isRequired,
  showRecoveryPhraseReminder: _propTypes.default.bool.isRequired,
  setRecoveryPhraseReminderHasBeenShown: _propTypes.default.func.isRequired,
  setRecoveryPhraseReminderLastShown: _propTypes.default.func.isRequired,
  seedPhraseBackedUp: _propTypes.default.bool.isRequired
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/home/home.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/home/home.component.js",}],
[4091, {"../../components/ui/loading-screen":3906,"../../helpers/constants/routes":3995,"../../store/actions":4331,"../confirm-approve":4062,"../confirm-decrypt-message":4065,"../confirm-deploy-contract":4068,"../confirm-encryption-public-key":4071,"../confirm-send-ether":4077,"../confirm-send-token":4080,"../confirm-token-transaction-base":4083,"../confirm-transaction-base":4086,"../confirm-transaction-switch":4089,"./conf-tx":4090,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _loadingScreen = _interopRequireDefault(require("../../components/ui/loading-screen"));

var _confirmTransactionSwitch = _interopRequireDefault(require("../confirm-transaction-switch"));

var _confirmTransactionBase = _interopRequireDefault(require("../confirm-transaction-base"));

var _confirmSendEther = _interopRequireDefault(require("../confirm-send-ether"));

var _confirmSendToken = _interopRequireDefault(require("../confirm-send-token"));

var _confirmDeployContract = _interopRequireDefault(require("../confirm-deploy-contract"));

var _confirmApprove = _interopRequireDefault(require("../confirm-approve"));

var _confirmTokenTransactionBase = _interopRequireDefault(require("../confirm-token-transaction-base"));

var _confirmDecryptMessage = _interopRequireDefault(require("../confirm-decrypt-message"));

var _confirmEncryptionPublicKey = _interopRequireDefault(require("../confirm-encryption-public-key"));

var _routes = require("../../helpers/constants/routes");

var _actions = require("../../store/actions");

var _confTx = _interopRequireDefault(require("./conf-tx"));

class ConfirmTransaction extends _react.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "_beforeUnload", () => {
      this._isMounted = false;

      if (this.state.pollingToken) {
        (0, _actions.disconnectGasFeeEstimatePoller)(this.state.pollingToken);
        (0, _actions.removePollingTokenFromAppState)(this.state.pollingToken);
      }
    });
    this.state = {};
  }

  componentDidMount() {
    this._isMounted = true;
    const {
      totalUnapprovedCount = 0,
      sendTo,
      history,
      mostRecentOverviewPage,
      transaction: {
        txParams: {
          data,
          to
        } = {}
      } = {},
      getContractMethodData,
      transactionId,
      paramsTransactionId,
      getTokenParams,
      isTokenMethodAction
    } = this.props;
    (0, _actions.getGasFeeEstimatesAndStartPolling)().then(pollingToken => {
      if (this._isMounted) {
        this.setState({
          pollingToken
        });
        (0, _actions.addPollingTokenToAppState)(pollingToken);
      } else {
        (0, _actions.disconnectGasFeeEstimatePoller)(pollingToken);
        (0, _actions.removePollingTokenFromAppState)(pollingToken);
      }
    });
    window.addEventListener('beforeunload', this._beforeUnload);

    if (!totalUnapprovedCount && !sendTo) {
      history.replace(mostRecentOverviewPage);
      return;
    }

    getContractMethodData(data);

    if (isTokenMethodAction) {
      getTokenParams(to);
    }

    const txId = transactionId || paramsTransactionId;

    if (txId) {
      this.props.setTransactionToConfirm(txId);
    }
  }

  componentWillUnmount() {
    this._beforeUnload();

    window.removeEventListener('beforeunload', this._beforeUnload);
  }

  componentDidUpdate(prevProps) {
    const {
      setTransactionToConfirm,
      transaction: {
        txData: {
          txParams: {
            data
          } = {}
        } = {}
      },
      clearConfirmTransaction,
      getContractMethodData,
      paramsTransactionId,
      transactionId,
      history,
      mostRecentOverviewPage,
      totalUnapprovedCount,
      setDefaultHomeActiveTabName
    } = this.props;

    if (paramsTransactionId && transactionId && prevProps.paramsTransactionId !== paramsTransactionId) {
      clearConfirmTransaction();
      getContractMethodData(data);
      setTransactionToConfirm(paramsTransactionId);
    } else if (prevProps.transactionId && !transactionId && !totalUnapprovedCount) {
      setDefaultHomeActiveTabName('Activity').then(() => {
        history.replace(_routes.DEFAULT_ROUTE);
      });
    } else if (prevProps.transactionId && transactionId && prevProps.transactionId !== transactionId) {
      history.replace(mostRecentOverviewPage);
    }
  }

  render() {
    const {
      transactionId,
      paramsTransactionId
    } = this.props; // Show routes when state.confirmTransaction has been set and when either the ID in the params
    // isn't specified or is specified and matches the ID in state.confirmTransaction in order to
    // support URLs of /confirm-transaction or /confirm-transaction/<transactionId>

    return transactionId && (!paramsTransactionId || paramsTransactionId === transactionId) ? /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.CONFIRM_DEPLOY_CONTRACT_PATH}`,
      component: _confirmDeployContract.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.CONFIRM_TOKEN_METHOD_PATH}`,
      component: _confirmTransactionBase.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.CONFIRM_SEND_ETHER_PATH}`,
      component: _confirmSendEther.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.CONFIRM_SEND_TOKEN_PATH}`,
      component: _confirmSendToken.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.CONFIRM_APPROVE_PATH}`,
      component: _confirmApprove.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.CONFIRM_TRANSFER_FROM_PATH}`,
      component: _confirmTokenTransactionBase.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.SIGNATURE_REQUEST_PATH}`,
      component: _confTx.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.DECRYPT_MESSAGE_REQUEST_PATH}`,
      component: _confirmDecryptMessage.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: `${_routes.CONFIRM_TRANSACTION_ROUTE}/:id?${_routes.ENCRYPTION_PUBLIC_KEY_REQUEST_PATH}`,
      component: _confirmEncryptionPublicKey.default
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      path: "*",
      component: _confirmTransactionSwitch.default
    })) : /*#__PURE__*/_react.default.createElement(_loadingScreen.default, null);
  }

}

exports.default = ConfirmTransaction;
(0, _defineProperty2.default)(ConfirmTransaction, "contextTypes", {
  metricsEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(ConfirmTransaction, "propTypes", {
  history: _propTypes.default.object.isRequired,
  totalUnapprovedCount: _propTypes.default.number.isRequired,
  sendTo: _propTypes.default.string,
  setTransactionToConfirm: _propTypes.default.func,
  clearConfirmTransaction: _propTypes.default.func,
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  transaction: _propTypes.default.object,
  getContractMethodData: _propTypes.default.func,
  transactionId: _propTypes.default.string,
  paramsTransactionId: _propTypes.default.string,
  getTokenParams: _propTypes.default.func,
  isTokenMethodAction: _propTypes.default.bool,
  setDefaultHomeActiveTabName: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/confirm-transaction/confirm-transaction.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-transaction/confirm-transaction.component.js",}],
[4321, {"../../components/ui/text-field-white":3949,"../../helpers/constants/routes":3995,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@material-ui/core/Button":458,"events":1429,"prop-types":2900,"react":3121,"textarea-caret":3383}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _events = require("events");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Button = _interopRequireDefault(require("@material-ui/core/Button"));

var _textareaCaret = _interopRequireDefault(require("textarea-caret"));

var _textFieldWhite = _interopRequireDefault(require("../../components/ui/text-field-white"));

var _routes = require("../../helpers/constants/routes");

class UnlockPage extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      password: '',
      error: null
    });
    (0, _defineProperty2.default)(this, "submitting", false);
    (0, _defineProperty2.default)(this, "animationEventEmitter", new _events.EventEmitter());
    (0, _defineProperty2.default)(this, "handleSubmit", async event => {
      event.preventDefault();
      event.stopPropagation();
      const {
        password
      } = this.state;
      const {
        onSubmit,
        forceUpdateMetamaskState,
        showOptInModal
      } = this.props;

      if (password === '' || this.submitting) {
        return;
      }

      this.setState({
        error: null
      });
      this.submitting = true;

      try {
        await onSubmit(password);
        const newState = await forceUpdateMetamaskState();
        this.context.metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Unlock',
            name: 'Success'
          },
          isNewVisit: true
        });

        if (newState.participateInMetaMetrics === null || newState.participateInMetaMetrics === undefined) {// showOptInModal();
        }
      } catch ({
        message
      }) {
        if (message === 'Incorrect password') {
          const newState = await forceUpdateMetamaskState();
          this.context.metricsEvent({
            eventOpts: {
              category: 'Navigation',
              action: 'Unlock',
              name: 'Incorrect Password'
            },
            customVariables: {
              numberOfTokens: newState.tokens.length,
              numberOfAccounts: Object.keys(newState.accounts).length
            }
          });
        }

        this.setState({
          error: message
        });
        this.submitting = false;
      }
    });
  }

  UNSAFE_componentWillMount() {
    const {
      isUnlocked,
      history
    } = this.props;

    if (isUnlocked) {
      history.push(_routes.DEFAULT_ROUTE);
    }
  }

  handleInputChange({
    target
  }) {
    this.setState({
      password: target.value,
      error: null
    }); // tell mascot to look at page action

    if (target.getBoundingClientRect) {
      const element = target;
      const boundingRect = element.getBoundingClientRect();
      const coordinates = (0, _textareaCaret.default)(element, element.selectionEnd);
      this.animationEventEmitter.emit('point', {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop
      });
    }
  }

  renderSubmitButton() {
    const style = {
      backgroundColor: '#F1EF26',
      color: 'black',
      marginTop: '20px',
      height: '60px',
      fontWeight: '400',
      boxShadow: 'none',
      borderRadius: '4px'
    };
    return /*#__PURE__*/_react.default.createElement(_Button.default, {
      type: "submit",
      style: style,
      disabled: !this.state.password,
      fullWidth: true,
      variant: "contained",
      size: "large",
      onClick: this.handleSubmit,
      disableRipple: true
    }, this.context.t('unlock'));
  }

  render() {
    const {
      password,
      error
    } = this.state;
    const {
      t
    } = this.context;
    const {
      onRestore
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "unlock-page__container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "unlock-page"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "unlock-page__mascot-container"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "./images/logo/monsta-logo.png",
      width: "140"
    })), /*#__PURE__*/_react.default.createElement("h1", {
      className: "unlock-page__title"
    }, t('monstaWallet')), /*#__PURE__*/_react.default.createElement("div", null, t('unlockMessage')), /*#__PURE__*/_react.default.createElement("form", {
      className: "unlock-page__form",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/_react.default.createElement(_textFieldWhite.default, {
      id: "password",
      label: t('password'),
      type: "password",
      value: password,
      onChange: event => this.handleInputChange(event),
      error: error,
      autoFocus: true,
      autoComplete: "current-password",
      theme: "material",
      fullWidth: true
    })), this.renderSubmitButton(), /*#__PURE__*/_react.default.createElement("div", {
      className: "unlock-page__links"
    }, t('importAccountText', [/*#__PURE__*/_react.default.createElement("button", {
      key: "import-account",
      className: "unlock-page__link unlock-page__link--import",
      onClick: () => onRestore()
    }, t('importAccountLinkText'))]))));
  }

}

exports.default = UnlockPage;
(0, _defineProperty2.default)(UnlockPage, "contextTypes", {
  metricsEvent: _propTypes.default.func,
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(UnlockPage, "propTypes", {
  history: _propTypes.default.object.isRequired,
  isUnlocked: _propTypes.default.bool,
  onRestore: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  forceUpdateMetamaskState: _propTypes.default.func,
  showOptInModal: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/unlock-page/unlock-page.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/unlock-page/unlock-page.component.js",}],
[3335, {}, function (require, module, exports) {
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

//# sourceMappingURL=node_modules/socketcluster-client/node_modules/uuid/lib/rng-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/node_modules/uuid/lib/rng-browser.js",}],
[3334, {}, function (require, module, exports) {
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

//# sourceMappingURL=node_modules/socketcluster-client/node_modules/uuid/lib/bytesToUuid.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socketcluster-client/node_modules/uuid/lib/bytesToUuid.js",}],
[2610, {"./_apply":2518}, function (require, module, exports) {
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

//# sourceMappingURL=node_modules/lodash/_overRest.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_overRest.js",}],
[2615, {"./_baseSetToString":2553,"./_shortOut":2616}, function (require, module, exports) {
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

//# sourceMappingURL=node_modules/lodash/_setToString.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_setToString.js",}],
[2524, {}, function (require, module, exports) {
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

//# sourceMappingURL=node_modules/lodash/_arrayPush.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_arrayPush.js",}],
[2585, {"./_Symbol":2515,"./isArguments":2633,"./isArray":2634}, function (require, module, exports) {
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

//# sourceMappingURL=node_modules/lodash/_isFlattenable.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_isFlattenable.js",}],
[2520, {"./_baseIndexOf":2537}, function (require, module, exports) {
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

//# sourceMappingURL=node_modules/lodash/_arrayIncludes.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_arrayIncludes.js",}],
[2513, {"./_MapCache":2510,"./_setCacheAdd":2612,"./_setCacheHas":2613}, function (require, module, exports) {
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

//# sourceMappingURL=node_modules/lodash/_SetCache.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_SetCache.js",}],
[2521, {}, function (require, module, exports) {
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

//# sourceMappingURL=node_modules/lodash/_arrayIncludesWith.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_arrayIncludesWith.js",}],
[2559, {}, function (require, module, exports) {
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

//# sourceMappingURL=node_modules/lodash/_cacheHas.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_cacheHas.js",}],
[2614, {}, function (require, module, exports) {
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

//# sourceMappingURL=node_modules/lodash/_setToArray.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_setToArray.js",}],
[2564, {"./_Set":2512,"./_setToArray":2614,"./noop":2649}, function (require, module, exports) {
var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;

//# sourceMappingURL=node_modules/lodash/_createSet.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_createSet.js",}],
[2563, {}, function (require, module, exports) {
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

//# sourceMappingURL=node_modules/lodash/_createBaseFor.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_createBaseFor.js",}],
[2551, {"./_baseGet":2533}, function (require, module, exports) {
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

//# sourceMappingURL=node_modules/lodash/_basePropertyDeep.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_basePropertyDeep.js",}],
[2603, {}, function (require, module, exports) {
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

//# sourceMappingURL=node_modules/lodash/_matchesStrictComparable.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_matchesStrictComparable.js",}],
[2572, {"./_isStrictComparable":2591,"./keys":2645}, function (require, module, exports) {
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

//# sourceMappingURL=node_modules/lodash/_getMatchData.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_getMatchData.js",}],
[2542, {"./_Stack":2514,"./_baseIsEqual":2540}, function (require, module, exports) {
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

//# sourceMappingURL=node_modules/lodash/_baseIsMatch.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseIsMatch.js",}],
[2591, {"./isObject":2640}, function (require, module, exports) {
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

//# sourceMappingURL=node_modules/lodash/_isStrictComparable.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_isStrictComparable.js",}],
[2540, {"./_baseIsEqualDeep":2541,"./isObjectLike":2641}, function (require, module, exports) {
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

//# sourceMappingURL=node_modules/lodash/_baseIsEqual.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseIsEqual.js",}],
[2630, {"./_baseHasIn":2536,"./_hasPath":2579}, function (require, module, exports) {
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

//# sourceMappingURL=node_modules/lodash/hasIn.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/hasIn.js",}],
[2993, {}, function (require, module, exports) {
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;
      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += ' width="' + size + 'px"';
      qrSvg += ' height="' + size + 'px"';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet">';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += alt;
        img += '"';
      }
      img += '/>';

      return img;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  }
}(function () {
    return qrcode;
}));

//# sourceMappingURL=node_modules/qrcode-generator/qrcode.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/qrcode-generator/qrcode.js",}]],[],{})


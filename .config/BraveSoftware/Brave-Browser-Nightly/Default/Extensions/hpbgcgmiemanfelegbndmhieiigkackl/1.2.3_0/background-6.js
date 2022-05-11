LavaPack.loadBundle([
[1545, {"../errors":1542,"./_stream_duplex":1543,"./internal/streams/async_iterator":1548,"./internal/streams/buffer_list":1549,"./internal/streams/destroy":1550,"./internal/streams/from":1552,"./internal/streams/state":1554,"./internal/streams/stream":1555,"_process":2892,"buffer":1428,"events":1429,"inherits":1947,"string_decoder/":1558,"util":1398}, function (require, module, exports) {
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

module.exports = Readable;
/*<replacement>*/

var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = require('events').EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*<replacement>*/


var debugUtil = require('util');

var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = require('./internal/streams/buffer_list');

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


var StringDecoder;
var createReadableStreamAsyncIterator;
var from;

require('inherits')(Readable, Stream);

var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
    ;
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = require('./internal/streams/from');
    }

    return from(Readable, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/lib/_stream_readable.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/lib/_stream_readable.js",}],
[3261, {"./bn":3259}, function (require, module, exports) {
'use strict'
var BN = require('./bn')

function ECJPoint (x, y, z) {
  if (x === null && y === null && z === null) {
    this.x = ECJPoint.one
    this.y = ECJPoint.one
    this.z = ECJPoint.zero
  } else {
    this.x = x
    this.y = y
    this.z = z
  }

  this.zOne = this.z === ECJPoint.one
}

ECJPoint.zero = BN.fromNumber(0)
ECJPoint.one = BN.fromNumber(1)

ECJPoint.prototype.neg = function () {
  if (this.inf) return this

  return new ECJPoint(this.x, this.y.redNeg(), this.z)
}

ECJPoint.prototype.add = function (p) {
  // O + P = P
  if (this.inf) return p

  // P + O = P
  if (p.inf) return this

  // http://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#addition-add-1998-cmo-2
  // 12M + 4S + 7A
  var pz2 = p.z.redSqr()
  var z2 = this.z.redSqr()
  var u1 = this.x.redMul(pz2)
  var u2 = p.x.redMul(z2)
  var s1 = this.y.redMul(pz2).redMul(p.z)
  var s2 = p.y.redMul(z2).redMul(this.z)

  var h = u1.redSub(u2)
  var r = s1.redSub(s2)
  if (h.isZero()) {
    if (r.isZero()) return this.dbl()
    return new ECJPoint(null, null, null)
  }

  var h2 = h.redSqr()
  var v = u1.redMul(h2)
  var h3 = h2.redMul(h)

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v)
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3))
  var nz = this.z.redMul(p.z).redMul(h)

  return new ECJPoint(nx, ny, nz)
}

ECJPoint.prototype.mixedAdd = function (p) {
  // O + P = P
  if (this.inf) return p.toECJPoint()

  // P + O = P
  if (p.inf) return this

  // http://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#addition-add-1998-cmo-2
  //   with p.z = 1
  // 8M + 3S + 7A
  var z2 = this.z.redSqr()
  var u1 = this.x
  var u2 = p.x.redMul(z2)
  var s1 = this.y
  var s2 = p.y.redMul(z2).redMul(this.z)

  var h = u1.redSub(u2)
  var r = s1.redSub(s2)
  if (h.isZero()) {
    if (r.isZero()) return this.dbl()
    return new ECJPoint(null, null, null)
  }

  var h2 = h.redSqr()
  var v = u1.redMul(h2)
  var h3 = h2.redMul(h)

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v)
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3))
  var nz = this.z.redMul(h)

  return new ECJPoint(nx, ny, nz)
}

ECJPoint.prototype.dbl = function () {
  if (this.inf) return this

  var nx
  var ny
  var nz

  // Z = 1
  if (this.zOne) {
    // http://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#doubling-mdbl-2007-bl
    // 1M + 5S + 6A + 3*2 + 1*3 + 1*8

    // XX = X1^2
    var xx = this.x.redSqr()
    // YY = Y1^2
    var yy = this.y.redSqr()
    // YYYY = YY^2
    var yyyy = yy.redSqr()
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy)
    s = s.redIAdd(s)
    // M = 3 * XX
    var m = xx.redAdd(xx).redIAdd(xx)
    // T = M ^ 2 - 2*S
    var t = m.redSqr().redISub(s).redISub(s)

    // 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy).redIAdd(yyyy).redIAdd(yyyy)

    // X3 = T
    nx = t
    // Y3 = M * (S - T) - 8 * YYYY
    ny = m.redMul(s.redISub(t)).redISub(yyyy8)
    // Z3 = 2*Y1
    nz = this.y.redAdd(this.y)
  } else {
    // http://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#doubling-dbl-2009-l
    // 2M + 5S + 6A + 3*2 + 1*3 + 1*8

    // A = X1^2
    var a = this.x.redSqr()
    // B = Y1^2
    var b = this.y.redSqr()
    // C = B^2
    var c = b.redSqr()
    // D = 2 * ((X1 + B)^2 - A - C)
    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c)
    d = d.redIAdd(d)
    // E = 3 * A
    var e = a.redAdd(a).redIAdd(a)
    // F = E^2
    var f = e.redSqr()

    // 8 * C
    var c8 = c.redIAdd(c).redIAdd(c).redIAdd(c)

    // X3 = F - 2 * D
    nx = f.redISub(d).redISub(d)
    // Y3 = E * (D - X3) - 8 * C
    ny = e.redMul(d.redISub(nx)).redISub(c8)
    // Z3 = 2 * Y1 * Z1
    nz = this.y.redMul(this.z)
    nz = nz.redIAdd(nz)
  }

  return new ECJPoint(nx, ny, nz)
}

ECJPoint.prototype.dblp = function (pow) {
  if (pow === 0 || this.inf) return this

  var point = this
  for (var i = 0; i < pow; i++) point = point.dbl()

  return point
}

Object.defineProperty(ECJPoint.prototype, 'inf', {
  enumerable: true,
  get: function () {
    return this.z.isZero()
  }
})

module.exports = ECJPoint

//# sourceMappingURL=node_modules/secp256k1/lib/js/ecjpoint.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/secp256k1/lib/js/ecjpoint.js",}],
[3260, {}, function (require, module, exports) {
'use strict'
exports.umulTo10x10 = function (num1, num2, out) {
  var a = num1.words
  var b = num2.words
  var o = out.words
  var c = 0
  var lo
  var mid
  var hi
  var a0 = a[0] | 0
  var al0 = a0 & 0x1fff
  var ah0 = a0 >>> 13
  var a1 = a[1] | 0
  var al1 = a1 & 0x1fff
  var ah1 = a1 >>> 13
  var a2 = a[2] | 0
  var al2 = a2 & 0x1fff
  var ah2 = a2 >>> 13
  var a3 = a[3] | 0
  var al3 = a3 & 0x1fff
  var ah3 = a3 >>> 13
  var a4 = a[4] | 0
  var al4 = a4 & 0x1fff
  var ah4 = a4 >>> 13
  var a5 = a[5] | 0
  var al5 = a5 & 0x1fff
  var ah5 = a5 >>> 13
  var a6 = a[6] | 0
  var al6 = a6 & 0x1fff
  var ah6 = a6 >>> 13
  var a7 = a[7] | 0
  var al7 = a7 & 0x1fff
  var ah7 = a7 >>> 13
  var a8 = a[8] | 0
  var al8 = a8 & 0x1fff
  var ah8 = a8 >>> 13
  var a9 = a[9] | 0
  var al9 = a9 & 0x1fff
  var ah9 = a9 >>> 13
  var b0 = b[0] | 0
  var bl0 = b0 & 0x1fff
  var bh0 = b0 >>> 13
  var b1 = b[1] | 0
  var bl1 = b1 & 0x1fff
  var bh1 = b1 >>> 13
  var b2 = b[2] | 0
  var bl2 = b2 & 0x1fff
  var bh2 = b2 >>> 13
  var b3 = b[3] | 0
  var bl3 = b3 & 0x1fff
  var bh3 = b3 >>> 13
  var b4 = b[4] | 0
  var bl4 = b4 & 0x1fff
  var bh4 = b4 >>> 13
  var b5 = b[5] | 0
  var bl5 = b5 & 0x1fff
  var bh5 = b5 >>> 13
  var b6 = b[6] | 0
  var bl6 = b6 & 0x1fff
  var bh6 = b6 >>> 13
  var b7 = b[7] | 0
  var bl7 = b7 & 0x1fff
  var bh7 = b7 >>> 13
  var b8 = b[8] | 0
  var bl8 = b8 & 0x1fff
  var bh8 = b8 >>> 13
  var b9 = b[9] | 0
  var bl9 = b9 & 0x1fff
  var bh9 = b9 >>> 13

  out.length = 19
  /* k = 0 */
  lo = Math.imul(al0, bl0)
  mid = Math.imul(al0, bh0)
  mid += Math.imul(ah0, bl0)
  hi = Math.imul(ah0, bh0)
  var w0 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w0 >>> 26)
  w0 &= 0x3ffffff
  /* k = 1 */
  lo = Math.imul(al1, bl0)
  mid = Math.imul(al1, bh0)
  mid += Math.imul(ah1, bl0)
  hi = Math.imul(ah1, bh0)
  lo += Math.imul(al0, bl1)
  mid += Math.imul(al0, bh1)
  mid += Math.imul(ah0, bl1)
  hi += Math.imul(ah0, bh1)
  var w1 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w1 >>> 26)
  w1 &= 0x3ffffff
  /* k = 2 */
  lo = Math.imul(al2, bl0)
  mid = Math.imul(al2, bh0)
  mid += Math.imul(ah2, bl0)
  hi = Math.imul(ah2, bh0)
  lo += Math.imul(al1, bl1)
  mid += Math.imul(al1, bh1)
  mid += Math.imul(ah1, bl1)
  hi += Math.imul(ah1, bh1)
  lo += Math.imul(al0, bl2)
  mid += Math.imul(al0, bh2)
  mid += Math.imul(ah0, bl2)
  hi += Math.imul(ah0, bh2)
  var w2 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w2 >>> 26)
  w2 &= 0x3ffffff
  /* k = 3 */
  lo = Math.imul(al3, bl0)
  mid = Math.imul(al3, bh0)
  mid += Math.imul(ah3, bl0)
  hi = Math.imul(ah3, bh0)
  lo += Math.imul(al2, bl1)
  mid += Math.imul(al2, bh1)
  mid += Math.imul(ah2, bl1)
  hi += Math.imul(ah2, bh1)
  lo += Math.imul(al1, bl2)
  mid += Math.imul(al1, bh2)
  mid += Math.imul(ah1, bl2)
  hi += Math.imul(ah1, bh2)
  lo += Math.imul(al0, bl3)
  mid += Math.imul(al0, bh3)
  mid += Math.imul(ah0, bl3)
  hi += Math.imul(ah0, bh3)
  var w3 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w3 >>> 26)
  w3 &= 0x3ffffff
  /* k = 4 */
  lo = Math.imul(al4, bl0)
  mid = Math.imul(al4, bh0)
  mid += Math.imul(ah4, bl0)
  hi = Math.imul(ah4, bh0)
  lo += Math.imul(al3, bl1)
  mid += Math.imul(al3, bh1)
  mid += Math.imul(ah3, bl1)
  hi += Math.imul(ah3, bh1)
  lo += Math.imul(al2, bl2)
  mid += Math.imul(al2, bh2)
  mid += Math.imul(ah2, bl2)
  hi += Math.imul(ah2, bh2)
  lo += Math.imul(al1, bl3)
  mid += Math.imul(al1, bh3)
  mid += Math.imul(ah1, bl3)
  hi += Math.imul(ah1, bh3)
  lo += Math.imul(al0, bl4)
  mid += Math.imul(al0, bh4)
  mid += Math.imul(ah0, bl4)
  hi += Math.imul(ah0, bh4)
  var w4 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w4 >>> 26)
  w4 &= 0x3ffffff
  /* k = 5 */
  lo = Math.imul(al5, bl0)
  mid = Math.imul(al5, bh0)
  mid += Math.imul(ah5, bl0)
  hi = Math.imul(ah5, bh0)
  lo += Math.imul(al4, bl1)
  mid += Math.imul(al4, bh1)
  mid += Math.imul(ah4, bl1)
  hi += Math.imul(ah4, bh1)
  lo += Math.imul(al3, bl2)
  mid += Math.imul(al3, bh2)
  mid += Math.imul(ah3, bl2)
  hi += Math.imul(ah3, bh2)
  lo += Math.imul(al2, bl3)
  mid += Math.imul(al2, bh3)
  mid += Math.imul(ah2, bl3)
  hi += Math.imul(ah2, bh3)
  lo += Math.imul(al1, bl4)
  mid += Math.imul(al1, bh4)
  mid += Math.imul(ah1, bl4)
  hi += Math.imul(ah1, bh4)
  lo += Math.imul(al0, bl5)
  mid += Math.imul(al0, bh5)
  mid += Math.imul(ah0, bl5)
  hi += Math.imul(ah0, bh5)
  var w5 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w5 >>> 26)
  w5 &= 0x3ffffff
  /* k = 6 */
  lo = Math.imul(al6, bl0)
  mid = Math.imul(al6, bh0)
  mid += Math.imul(ah6, bl0)
  hi = Math.imul(ah6, bh0)
  lo += Math.imul(al5, bl1)
  mid += Math.imul(al5, bh1)
  mid += Math.imul(ah5, bl1)
  hi += Math.imul(ah5, bh1)
  lo += Math.imul(al4, bl2)
  mid += Math.imul(al4, bh2)
  mid += Math.imul(ah4, bl2)
  hi += Math.imul(ah4, bh2)
  lo += Math.imul(al3, bl3)
  mid += Math.imul(al3, bh3)
  mid += Math.imul(ah3, bl3)
  hi += Math.imul(ah3, bh3)
  lo += Math.imul(al2, bl4)
  mid += Math.imul(al2, bh4)
  mid += Math.imul(ah2, bl4)
  hi += Math.imul(ah2, bh4)
  lo += Math.imul(al1, bl5)
  mid += Math.imul(al1, bh5)
  mid += Math.imul(ah1, bl5)
  hi += Math.imul(ah1, bh5)
  lo += Math.imul(al0, bl6)
  mid += Math.imul(al0, bh6)
  mid += Math.imul(ah0, bl6)
  hi += Math.imul(ah0, bh6)
  var w6 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w6 >>> 26)
  w6 &= 0x3ffffff
  /* k = 7 */
  lo = Math.imul(al7, bl0)
  mid = Math.imul(al7, bh0)
  mid += Math.imul(ah7, bl0)
  hi = Math.imul(ah7, bh0)
  lo += Math.imul(al6, bl1)
  mid += Math.imul(al6, bh1)
  mid += Math.imul(ah6, bl1)
  hi += Math.imul(ah6, bh1)
  lo += Math.imul(al5, bl2)
  mid += Math.imul(al5, bh2)
  mid += Math.imul(ah5, bl2)
  hi += Math.imul(ah5, bh2)
  lo += Math.imul(al4, bl3)
  mid += Math.imul(al4, bh3)
  mid += Math.imul(ah4, bl3)
  hi += Math.imul(ah4, bh3)
  lo += Math.imul(al3, bl4)
  mid += Math.imul(al3, bh4)
  mid += Math.imul(ah3, bl4)
  hi += Math.imul(ah3, bh4)
  lo += Math.imul(al2, bl5)
  mid += Math.imul(al2, bh5)
  mid += Math.imul(ah2, bl5)
  hi += Math.imul(ah2, bh5)
  lo += Math.imul(al1, bl6)
  mid += Math.imul(al1, bh6)
  mid += Math.imul(ah1, bl6)
  hi += Math.imul(ah1, bh6)
  lo += Math.imul(al0, bl7)
  mid += Math.imul(al0, bh7)
  mid += Math.imul(ah0, bl7)
  hi += Math.imul(ah0, bh7)
  var w7 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w7 >>> 26)
  w7 &= 0x3ffffff
  /* k = 8 */
  lo = Math.imul(al8, bl0)
  mid = Math.imul(al8, bh0)
  mid += Math.imul(ah8, bl0)
  hi = Math.imul(ah8, bh0)
  lo += Math.imul(al7, bl1)
  mid += Math.imul(al7, bh1)
  mid += Math.imul(ah7, bl1)
  hi += Math.imul(ah7, bh1)
  lo += Math.imul(al6, bl2)
  mid += Math.imul(al6, bh2)
  mid += Math.imul(ah6, bl2)
  hi += Math.imul(ah6, bh2)
  lo += Math.imul(al5, bl3)
  mid += Math.imul(al5, bh3)
  mid += Math.imul(ah5, bl3)
  hi += Math.imul(ah5, bh3)
  lo += Math.imul(al4, bl4)
  mid += Math.imul(al4, bh4)
  mid += Math.imul(ah4, bl4)
  hi += Math.imul(ah4, bh4)
  lo += Math.imul(al3, bl5)
  mid += Math.imul(al3, bh5)
  mid += Math.imul(ah3, bl5)
  hi += Math.imul(ah3, bh5)
  lo += Math.imul(al2, bl6)
  mid += Math.imul(al2, bh6)
  mid += Math.imul(ah2, bl6)
  hi += Math.imul(ah2, bh6)
  lo += Math.imul(al1, bl7)
  mid += Math.imul(al1, bh7)
  mid += Math.imul(ah1, bl7)
  hi += Math.imul(ah1, bh7)
  lo += Math.imul(al0, bl8)
  mid += Math.imul(al0, bh8)
  mid += Math.imul(ah0, bl8)
  hi += Math.imul(ah0, bh8)
  var w8 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w8 >>> 26)
  w8 &= 0x3ffffff
  /* k = 9 */
  lo = Math.imul(al9, bl0)
  mid = Math.imul(al9, bh0)
  mid += Math.imul(ah9, bl0)
  hi = Math.imul(ah9, bh0)
  lo += Math.imul(al8, bl1)
  mid += Math.imul(al8, bh1)
  mid += Math.imul(ah8, bl1)
  hi += Math.imul(ah8, bh1)
  lo += Math.imul(al7, bl2)
  mid += Math.imul(al7, bh2)
  mid += Math.imul(ah7, bl2)
  hi += Math.imul(ah7, bh2)
  lo += Math.imul(al6, bl3)
  mid += Math.imul(al6, bh3)
  mid += Math.imul(ah6, bl3)
  hi += Math.imul(ah6, bh3)
  lo += Math.imul(al5, bl4)
  mid += Math.imul(al5, bh4)
  mid += Math.imul(ah5, bl4)
  hi += Math.imul(ah5, bh4)
  lo += Math.imul(al4, bl5)
  mid += Math.imul(al4, bh5)
  mid += Math.imul(ah4, bl5)
  hi += Math.imul(ah4, bh5)
  lo += Math.imul(al3, bl6)
  mid += Math.imul(al3, bh6)
  mid += Math.imul(ah3, bl6)
  hi += Math.imul(ah3, bh6)
  lo += Math.imul(al2, bl7)
  mid += Math.imul(al2, bh7)
  mid += Math.imul(ah2, bl7)
  hi += Math.imul(ah2, bh7)
  lo += Math.imul(al1, bl8)
  mid += Math.imul(al1, bh8)
  mid += Math.imul(ah1, bl8)
  hi += Math.imul(ah1, bh8)
  lo += Math.imul(al0, bl9)
  mid += Math.imul(al0, bh9)
  mid += Math.imul(ah0, bl9)
  hi += Math.imul(ah0, bh9)
  var w9 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w9 >>> 26)
  w9 &= 0x3ffffff
  /* k = 10 */
  lo = Math.imul(al9, bl1)
  mid = Math.imul(al9, bh1)
  mid += Math.imul(ah9, bl1)
  hi = Math.imul(ah9, bh1)
  lo += Math.imul(al8, bl2)
  mid += Math.imul(al8, bh2)
  mid += Math.imul(ah8, bl2)
  hi += Math.imul(ah8, bh2)
  lo += Math.imul(al7, bl3)
  mid += Math.imul(al7, bh3)
  mid += Math.imul(ah7, bl3)
  hi += Math.imul(ah7, bh3)
  lo += Math.imul(al6, bl4)
  mid += Math.imul(al6, bh4)
  mid += Math.imul(ah6, bl4)
  hi += Math.imul(ah6, bh4)
  lo += Math.imul(al5, bl5)
  mid += Math.imul(al5, bh5)
  mid += Math.imul(ah5, bl5)
  hi += Math.imul(ah5, bh5)
  lo += Math.imul(al4, bl6)
  mid += Math.imul(al4, bh6)
  mid += Math.imul(ah4, bl6)
  hi += Math.imul(ah4, bh6)
  lo += Math.imul(al3, bl7)
  mid += Math.imul(al3, bh7)
  mid += Math.imul(ah3, bl7)
  hi += Math.imul(ah3, bh7)
  lo += Math.imul(al2, bl8)
  mid += Math.imul(al2, bh8)
  mid += Math.imul(ah2, bl8)
  hi += Math.imul(ah2, bh8)
  lo += Math.imul(al1, bl9)
  mid += Math.imul(al1, bh9)
  mid += Math.imul(ah1, bl9)
  hi += Math.imul(ah1, bh9)
  var w10 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w10 >>> 26)
  w10 &= 0x3ffffff
  /* k = 11 */
  lo = Math.imul(al9, bl2)
  mid = Math.imul(al9, bh2)
  mid += Math.imul(ah9, bl2)
  hi = Math.imul(ah9, bh2)
  lo += Math.imul(al8, bl3)
  mid += Math.imul(al8, bh3)
  mid += Math.imul(ah8, bl3)
  hi += Math.imul(ah8, bh3)
  lo += Math.imul(al7, bl4)
  mid += Math.imul(al7, bh4)
  mid += Math.imul(ah7, bl4)
  hi += Math.imul(ah7, bh4)
  lo += Math.imul(al6, bl5)
  mid += Math.imul(al6, bh5)
  mid += Math.imul(ah6, bl5)
  hi += Math.imul(ah6, bh5)
  lo += Math.imul(al5, bl6)
  mid += Math.imul(al5, bh6)
  mid += Math.imul(ah5, bl6)
  hi += Math.imul(ah5, bh6)
  lo += Math.imul(al4, bl7)
  mid += Math.imul(al4, bh7)
  mid += Math.imul(ah4, bl7)
  hi += Math.imul(ah4, bh7)
  lo += Math.imul(al3, bl8)
  mid += Math.imul(al3, bh8)
  mid += Math.imul(ah3, bl8)
  hi += Math.imul(ah3, bh8)
  lo += Math.imul(al2, bl9)
  mid += Math.imul(al2, bh9)
  mid += Math.imul(ah2, bl9)
  hi += Math.imul(ah2, bh9)
  var w11 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w11 >>> 26)
  w11 &= 0x3ffffff
  /* k = 12 */
  lo = Math.imul(al9, bl3)
  mid = Math.imul(al9, bh3)
  mid += Math.imul(ah9, bl3)
  hi = Math.imul(ah9, bh3)
  lo += Math.imul(al8, bl4)
  mid += Math.imul(al8, bh4)
  mid += Math.imul(ah8, bl4)
  hi += Math.imul(ah8, bh4)
  lo += Math.imul(al7, bl5)
  mid += Math.imul(al7, bh5)
  mid += Math.imul(ah7, bl5)
  hi += Math.imul(ah7, bh5)
  lo += Math.imul(al6, bl6)
  mid += Math.imul(al6, bh6)
  mid += Math.imul(ah6, bl6)
  hi += Math.imul(ah6, bh6)
  lo += Math.imul(al5, bl7)
  mid += Math.imul(al5, bh7)
  mid += Math.imul(ah5, bl7)
  hi += Math.imul(ah5, bh7)
  lo += Math.imul(al4, bl8)
  mid += Math.imul(al4, bh8)
  mid += Math.imul(ah4, bl8)
  hi += Math.imul(ah4, bh8)
  lo += Math.imul(al3, bl9)
  mid += Math.imul(al3, bh9)
  mid += Math.imul(ah3, bl9)
  hi += Math.imul(ah3, bh9)
  var w12 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w12 >>> 26)
  w12 &= 0x3ffffff
  /* k = 13 */
  lo = Math.imul(al9, bl4)
  mid = Math.imul(al9, bh4)
  mid += Math.imul(ah9, bl4)
  hi = Math.imul(ah9, bh4)
  lo += Math.imul(al8, bl5)
  mid += Math.imul(al8, bh5)
  mid += Math.imul(ah8, bl5)
  hi += Math.imul(ah8, bh5)
  lo += Math.imul(al7, bl6)
  mid += Math.imul(al7, bh6)
  mid += Math.imul(ah7, bl6)
  hi += Math.imul(ah7, bh6)
  lo += Math.imul(al6, bl7)
  mid += Math.imul(al6, bh7)
  mid += Math.imul(ah6, bl7)
  hi += Math.imul(ah6, bh7)
  lo += Math.imul(al5, bl8)
  mid += Math.imul(al5, bh8)
  mid += Math.imul(ah5, bl8)
  hi += Math.imul(ah5, bh8)
  lo += Math.imul(al4, bl9)
  mid += Math.imul(al4, bh9)
  mid += Math.imul(ah4, bl9)
  hi += Math.imul(ah4, bh9)
  var w13 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w13 >>> 26)
  w13 &= 0x3ffffff
  /* k = 14 */
  lo = Math.imul(al9, bl5)
  mid = Math.imul(al9, bh5)
  mid += Math.imul(ah9, bl5)
  hi = Math.imul(ah9, bh5)
  lo += Math.imul(al8, bl6)
  mid += Math.imul(al8, bh6)
  mid += Math.imul(ah8, bl6)
  hi += Math.imul(ah8, bh6)
  lo += Math.imul(al7, bl7)
  mid += Math.imul(al7, bh7)
  mid += Math.imul(ah7, bl7)
  hi += Math.imul(ah7, bh7)
  lo += Math.imul(al6, bl8)
  mid += Math.imul(al6, bh8)
  mid += Math.imul(ah6, bl8)
  hi += Math.imul(ah6, bh8)
  lo += Math.imul(al5, bl9)
  mid += Math.imul(al5, bh9)
  mid += Math.imul(ah5, bl9)
  hi += Math.imul(ah5, bh9)
  var w14 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w14 >>> 26)
  w14 &= 0x3ffffff
  /* k = 15 */
  lo = Math.imul(al9, bl6)
  mid = Math.imul(al9, bh6)
  mid += Math.imul(ah9, bl6)
  hi = Math.imul(ah9, bh6)
  lo += Math.imul(al8, bl7)
  mid += Math.imul(al8, bh7)
  mid += Math.imul(ah8, bl7)
  hi += Math.imul(ah8, bh7)
  lo += Math.imul(al7, bl8)
  mid += Math.imul(al7, bh8)
  mid += Math.imul(ah7, bl8)
  hi += Math.imul(ah7, bh8)
  lo += Math.imul(al6, bl9)
  mid += Math.imul(al6, bh9)
  mid += Math.imul(ah6, bl9)
  hi += Math.imul(ah6, bh9)
  var w15 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w15 >>> 26)
  w15 &= 0x3ffffff
  /* k = 16 */
  lo = Math.imul(al9, bl7)
  mid = Math.imul(al9, bh7)
  mid += Math.imul(ah9, bl7)
  hi = Math.imul(ah9, bh7)
  lo += Math.imul(al8, bl8)
  mid += Math.imul(al8, bh8)
  mid += Math.imul(ah8, bl8)
  hi += Math.imul(ah8, bh8)
  lo += Math.imul(al7, bl9)
  mid += Math.imul(al7, bh9)
  mid += Math.imul(ah7, bl9)
  hi += Math.imul(ah7, bh9)
  var w16 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w16 >>> 26)
  w16 &= 0x3ffffff
  /* k = 17 */
  lo = Math.imul(al9, bl8)
  mid = Math.imul(al9, bh8)
  mid += Math.imul(ah9, bl8)
  hi = Math.imul(ah9, bh8)
  lo += Math.imul(al8, bl9)
  mid += Math.imul(al8, bh9)
  mid += Math.imul(ah8, bl9)
  hi += Math.imul(ah8, bh9)
  var w17 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w17 >>> 26)
  w17 &= 0x3ffffff
  /* k = 18 */
  lo = Math.imul(al9, bl9)
  mid = Math.imul(al9, bh9)
  mid += Math.imul(ah9, bl9)
  hi = Math.imul(ah9, bh9)
  var w18 = c + lo + ((mid & 0x1fff) << 13)
  c = hi + (mid >>> 13) + (w18 >>> 26)
  w18 &= 0x3ffffff
  o[0] = w0
  o[1] = w1
  o[2] = w2
  o[3] = w3
  o[4] = w4
  o[5] = w5
  o[6] = w6
  o[7] = w7
  o[8] = w8
  o[9] = w9
  o[10] = w10
  o[11] = w11
  o[12] = w12
  o[13] = w13
  o[14] = w14
  o[15] = w15
  o[16] = w16
  o[17] = w17
  o[18] = w18
  if (c !== 0) {
    o[19] = c
    out.length++
  }
  return out
}

//# sourceMappingURL=node_modules/secp256k1/lib/js/bn/optimized.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/secp256k1/lib/js/bn/optimized.js",}],
[1622, {}, function (require, module, exports) {
module.exports={
  "sha1": {
    "securityStrength": 128,
    "outlen": 160,
    "seedlen": 440
  },
  "sha224": {
    "securityStrength": 192,
    "outlen": 224,
    "seedlen": 440
  },
  "sha256": {
    "securityStrength": 256,
    "outlen": 256,
    "seedlen": 440
  },
  "sha384": {
    "securityStrength": 256,
    "outlen": 384,
    "seedlen": 888
  },
  "sha512": {
    "securityStrength": 256,
    "outlen": 512,
    "seedlen": 888
  }
}

//# sourceMappingURL=node_modules/drbg.js/lib/hash-info.json
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/drbg.js/lib/hash-info.json",}],
[2746, {"./forge":2731,"./random":2747,"./util":2753}, function (require, module, exports) {
/**
 * Javascript implementation of PKCS#1 PSS signature padding.
 *
 * @author Stefan Siegl
 *
 * Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
 */
var forge = require('./forge');
require('./random');
require('./util');

// shortcut for PSS API
var pss = module.exports = forge.pss = forge.pss || {};

/**
 * Creates a PSS signature scheme object.
 *
 * There are several ways to provide a salt for encoding:
 *
 * 1. Specify the saltLength only and the built-in PRNG will generate it.
 * 2. Specify the saltLength and a custom PRNG with 'getBytesSync' defined that
 *   will be used.
 * 3. Specify the salt itself as a forge.util.ByteBuffer.
 *
 * @param options the options to use:
 *          md the message digest object to use, a forge md instance.
 *          mgf the mask generation function to use, a forge mgf instance.
 *          [saltLength] the length of the salt in octets.
 *          [prng] the pseudo-random number generator to use to produce a salt.
 *          [salt] the salt to use when encoding.
 *
 * @return a signature scheme object.
 */
pss.create = function(options) {
  // backwards compatibility w/legacy args: hash, mgf, sLen
  if(arguments.length === 3) {
    options = {
      md: arguments[0],
      mgf: arguments[1],
      saltLength: arguments[2]
    };
  }

  var hash = options.md;
  var mgf = options.mgf;
  var hLen = hash.digestLength;

  var salt_ = options.salt || null;
  if(typeof salt_ === 'string') {
    // assume binary-encoded string
    salt_ = forge.util.createBuffer(salt_);
  }

  var sLen;
  if('saltLength' in options) {
    sLen = options.saltLength;
  } else if(salt_ !== null) {
    sLen = salt_.length();
  } else {
    throw new Error('Salt length not specified or specific salt not given.');
  }

  if(salt_ !== null && salt_.length() !== sLen) {
    throw new Error('Given salt length does not match length of given salt.');
  }

  var prng = options.prng || forge.random;

  var pssobj = {};

  /**
   * Encodes a PSS signature.
   *
   * This function implements EMSA-PSS-ENCODE as per RFC 3447, section 9.1.1.
   *
   * @param md the message digest object with the hash to sign.
   * @param modsBits the length of the RSA modulus in bits.
   *
   * @return the encoded message as a binary-encoded string of length
   *           ceil((modBits - 1) / 8).
   */
  pssobj.encode = function(md, modBits) {
    var i;
    var emBits = modBits - 1;
    var emLen = Math.ceil(emBits / 8);

    /* 2. Let mHash = Hash(M), an octet string of length hLen. */
    var mHash = md.digest().getBytes();

    /* 3. If emLen < hLen + sLen + 2, output "encoding error" and stop. */
    if(emLen < hLen + sLen + 2) {
      throw new Error('Message is too long to encrypt.');
    }

    /* 4. Generate a random octet string salt of length sLen; if sLen = 0,
     *    then salt is the empty string. */
    var salt;
    if(salt_ === null) {
      salt = prng.getBytesSync(sLen);
    } else {
      salt = salt_.bytes();
    }

    /* 5. Let M' = (0x)00 00 00 00 00 00 00 00 || mHash || salt; */
    var m_ = new forge.util.ByteBuffer();
    m_.fillWithByte(0, 8);
    m_.putBytes(mHash);
    m_.putBytes(salt);

    /* 6. Let H = Hash(M'), an octet string of length hLen. */
    hash.start();
    hash.update(m_.getBytes());
    var h = hash.digest().getBytes();

    /* 7. Generate an octet string PS consisting of emLen - sLen - hLen - 2
     *    zero octets.  The length of PS may be 0. */
    var ps = new forge.util.ByteBuffer();
    ps.fillWithByte(0, emLen - sLen - hLen - 2);

    /* 8. Let DB = PS || 0x01 || salt; DB is an octet string of length
     *    emLen - hLen - 1. */
    ps.putByte(0x01);
    ps.putBytes(salt);
    var db = ps.getBytes();

    /* 9. Let dbMask = MGF(H, emLen - hLen - 1). */
    var maskLen = emLen - hLen - 1;
    var dbMask = mgf.generate(h, maskLen);

    /* 10. Let maskedDB = DB \xor dbMask. */
    var maskedDB = '';
    for(i = 0; i < maskLen; i++) {
      maskedDB += String.fromCharCode(db.charCodeAt(i) ^ dbMask.charCodeAt(i));
    }

    /* 11. Set the leftmost 8emLen - emBits bits of the leftmost octet in
     *     maskedDB to zero. */
    var mask = (0xFF00 >> (8 * emLen - emBits)) & 0xFF;
    maskedDB = String.fromCharCode(maskedDB.charCodeAt(0) & ~mask) +
      maskedDB.substr(1);

    /* 12. Let EM = maskedDB || H || 0xbc.
     * 13. Output EM. */
    return maskedDB + h + String.fromCharCode(0xbc);
  };

  /**
   * Verifies a PSS signature.
   *
   * This function implements EMSA-PSS-VERIFY as per RFC 3447, section 9.1.2.
   *
   * @param mHash the message digest hash, as a binary-encoded string, to
   *         compare against the signature.
   * @param em the encoded message, as a binary-encoded string
   *          (RSA decryption result).
   * @param modsBits the length of the RSA modulus in bits.
   *
   * @return true if the signature was verified, false if not.
   */
  pssobj.verify = function(mHash, em, modBits) {
    var i;
    var emBits = modBits - 1;
    var emLen = Math.ceil(emBits / 8);

    /* c. Convert the message representative m to an encoded message EM
     *    of length emLen = ceil((modBits - 1) / 8) octets, where modBits
     *    is the length in bits of the RSA modulus n */
    em = em.substr(-emLen);

    /* 3. If emLen < hLen + sLen + 2, output "inconsistent" and stop. */
    if(emLen < hLen + sLen + 2) {
      throw new Error('Inconsistent parameters to PSS signature verification.');
    }

    /* 4. If the rightmost octet of EM does not have hexadecimal value
     *    0xbc, output "inconsistent" and stop. */
    if(em.charCodeAt(emLen - 1) !== 0xbc) {
      throw new Error('Encoded message does not end in 0xBC.');
    }

    /* 5. Let maskedDB be the leftmost emLen - hLen - 1 octets of EM, and
     *    let H be the next hLen octets. */
    var maskLen = emLen - hLen - 1;
    var maskedDB = em.substr(0, maskLen);
    var h = em.substr(maskLen, hLen);

    /* 6. If the leftmost 8emLen - emBits bits of the leftmost octet in
     *    maskedDB are not all equal to zero, output "inconsistent" and stop. */
    var mask = (0xFF00 >> (8 * emLen - emBits)) & 0xFF;
    if((maskedDB.charCodeAt(0) & mask) !== 0) {
      throw new Error('Bits beyond keysize not zero as expected.');
    }

    /* 7. Let dbMask = MGF(H, emLen - hLen - 1). */
    var dbMask = mgf.generate(h, maskLen);

    /* 8. Let DB = maskedDB \xor dbMask. */
    var db = '';
    for(i = 0; i < maskLen; i++) {
      db += String.fromCharCode(maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i));
    }

    /* 9. Set the leftmost 8emLen - emBits bits of the leftmost octet
     * in DB to zero. */
    db = String.fromCharCode(db.charCodeAt(0) & ~mask) + db.substr(1);

    /* 10. If the emLen - hLen - sLen - 2 leftmost octets of DB are not zero
     * or if the octet at position emLen - hLen - sLen - 1 (the leftmost
     * position is "position 1") does not have hexadecimal value 0x01,
     * output "inconsistent" and stop. */
    var checkLen = emLen - hLen - sLen - 2;
    for(i = 0; i < checkLen; i++) {
      if(db.charCodeAt(i) !== 0x00) {
        throw new Error('Leftmost octets not zero as expected');
      }
    }

    if(db.charCodeAt(checkLen) !== 0x01) {
      throw new Error('Inconsistent PSS signature, 0x01 marker not found');
    }

    /* 11. Let salt be the last sLen octets of DB. */
    var salt = db.substr(-sLen);

    /* 12.  Let M' = (0x)00 00 00 00 00 00 00 00 || mHash || salt */
    var m_ = new forge.util.ByteBuffer();
    m_.fillWithByte(0, 8);
    m_.putBytes(mHash);
    m_.putBytes(salt);

    /* 13. Let H' = Hash(M'), an octet string of length hLen. */
    hash.start();
    hash.update(m_.getBytes());
    var h_ = hash.digest().getBytes();

    /* 14. If H = H', output "consistent." Otherwise, output "inconsistent." */
    return h === h_;
  };

  return pssobj;
};

//# sourceMappingURL=node_modules/node-forge/lib/pss.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/node-forge/lib/pss.js",}],
[2735, {"./forge":2731,"./mgf1":2736}, function (require, module, exports) {
/**
 * Node.js module for Forge mask generation functions.
 *
 * @author Stefan Siegl
 *
 * Copyright 2012 Stefan Siegl <stesie@brokenpipe.de>
 */
var forge = require('./forge');
require('./mgf1');

module.exports = forge.mgf = forge.mgf || {};
forge.mgf.mgf1 = forge.mgf1;

//# sourceMappingURL=node_modules/node-forge/lib/mgf.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/node-forge/lib/mgf.js",}],
[1964, {"_process":2892,"buffer":1428}, function (require, module, exports) {
(function (process,Buffer){
'use strict'

exports.toCallback = (doWork) => {
  return function (input, callback) {
    let res
    try {
      res = doWork(input)
    } catch (err) {
      process.nextTick(callback, err)
      return
    }

    process.nextTick(callback, null, res)
  }
}

exports.toBuf = (doWork, other) => (input) => {
  let result = doWork(input, other)
  return Buffer.from(result, 'hex')
}

exports.fromString = (doWork, other) => (_input) => {
  const input = Buffer.isBuffer(_input) ? _input.toString() : _input
  return doWork(input, other)
}

exports.fromNumberTo32BitBuf = (doWork, other) => (input) => {
  let number = doWork(input, other)
  const bytes = new Array(4)

  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }

  return Buffer.from(bytes)
}

}).call(this,require('_process'),require("buffer").Buffer)

//# sourceMappingURL=node_modules/ipfs-bitswap/node_modules/multihashing-async/src/utils.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/ipfs-bitswap/node_modules/multihashing-async/src/utils.js",}],
[1959, {"_process":2892}, function (require, module, exports) {
(function (process,global){
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var INPUT_ERROR = 'input is invalid type';
  var FINALIZE_ERROR = 'finalize already called';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
  var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
  };

  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
  };

  var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
  };

  var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createMethod(bits, padding, type);
    }
    return method;
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
  };

  var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
      if (!n && !s) {
        return methods['shake' + bits].create(outputBits);
      } else {
        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
      }
    };
    method.update = function (message, outputBits, n, s) {
      return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
  };

  var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
      return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
  };

  var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name + '_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
      if (algorithm.name !== 'sha3') {
        var newMethodName = algorithm.name + bits[j];
        methodNames.push(newMethodName);
        methods[newMethodName] = methods[methodName];
      }
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
      bytes.unshift(o);
      x = x >> 8;
      o = x & 255;
      ++n;
    }
    if (right) {
      bytes.push(n);
    } else {
      bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
  };

  Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
      if (type === 'object') {
        if (str === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
          str = new Uint8Array(str);
        } else if (!Array.isArray(str)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
      bytes = length;
    } else {
      for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
          bytes += 1;
        } else if (code < 0x800) {
          bytes += 2;
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes += 3;
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
          bytes += 4;
        }
      }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
  };

  Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
      bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
  };

  Keccak.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      array[offset] = block & 0xFF;
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
  }

  Kmac.prototype = new Keccak();

  Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } else {
    for (i = 0; i < methodNames.length; ++i) {
      root[methodNames[i]] = methods[methodNames[i]];
    }
    if (AMD) {
      define(function () {
        return methods;
      });
    }
  }
})();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/ipfs-bitswap/node_modules/js-sha3/src/sha3.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/ipfs-bitswap/node_modules/js-sha3/src/sha3.js",}],
[1960, {"./utils":1964,"blakejs":1382,"buffer":1428}, function (require, module, exports) {
(function (Buffer){
'use strict'

const blake = require('blakejs')

const toCallback = require('./utils').toCallback

const minB = 0xb201
const minS = 0xb241

const blake2b = {
  init: blake.blake2bInit,
  update: blake.blake2bUpdate,
  digest: blake.blake2bFinal
}

const blake2s = {
  init: blake.blake2sInit,
  update: blake.blake2sUpdate,
  digest: blake.blake2sFinal
}

const makeB2Hash = (size, hf) => toCallback((buf) => {
  const ctx = hf.init(size, null)
  hf.update(ctx, buf)
  return Buffer.from(hf.digest(ctx))
})

module.exports = (table) => {
  for (let i = 0; i < 64; i++) {
    table[minB + i] = makeB2Hash(i + 1, blake2b)
  }
  for (let i = 0; i < 32; i++) {
    table[minS + i] = makeB2Hash(i + 1, blake2s)
  }
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/ipfs-bitswap/node_modules/multihashing-async/src/blake.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/ipfs-bitswap/node_modules/multihashing-async/src/blake.js",}],
[1961, {"buffer":1428,"nodeify":2755}, function (require, module, exports) {
(function (Buffer){
/* global self */

'use strict'

const nodeify = require('nodeify')

const webCrypto = getWebCrypto()

function getWebCrypto () {
  if (self.crypto) {
    return self.crypto.subtle || self.crypto.webkitSubtle
  }

  if (self.msCrypto) {
    return self.msCrypto.subtle
  }
}

function webCryptoHash (type) {
  if (!webCrypto) {
    throw new Error('Please use a browser with webcrypto support and ensure the code has been delivered securely via HTTPS/TLS and run within a Secure Context')
  }

  return (data, callback) => {
    const res = webCrypto.digest({ name: type }, data)

    if (typeof res.then !== 'function') { // IE11
      res.onerror = () => {
        callback(new Error(`hashing data using ${type}`))
      }
      res.oncomplete = (e) => {
        callback(null, e.target.result)
      }
      return
    }

    nodeify(
      res.then((raw) => Buffer.from(new Uint8Array(raw))),
      callback
    )
  }
}

function sha1 (buf, callback) {
  webCryptoHash('SHA-1')(buf, callback)
}

function sha2256 (buf, callback) {
  webCryptoHash('SHA-256')(buf, callback)
}

function sha2512 (buf, callback) {
  webCryptoHash('SHA-512')(buf, callback)
}

module.exports = {
  sha1: sha1,
  sha2256: sha2256,
  sha2512: sha2512
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/ipfs-bitswap/node_modules/multihashing-async/src/crypto-sha1-2-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/ipfs-bitswap/node_modules/multihashing-async/src/crypto-sha1-2-browser.js",}],
[2945, {"buffer":1428}, function (require, module, exports) {
(function (Buffer){

module.exports = function () {

  var buffers = [], length = 0

  //just used for debugging...
  function calcLength () {
    return buffers.reduce(function (a, b) {
      return a + b.length
    }, 0)
  }

  return {
    length: length,
    data: this,
    add: function (data) {
      if(!Buffer.isBuffer(data))
        throw new Error('data must be a buffer, was: ' + JSON.stringify(data))
      this.length = length = length + data.length
      buffers.push(data)
      return this
    },
    has: function (n) {
      if(null == n) return length > 0
      return length >= n
    },
    get: function (n) {
      var _length
      if(n == null || n === length) {
        length = 0
        var _buffers = buffers
        buffers = []
        if(_buffers.length == 1)
          return _buffers[0]
        else
          return Buffer.concat(_buffers)
      } else if (buffers.length > 1 && n <= (_length = buffers[0].length)) {
        var buf = buffers[0].slice(0, n)
        if(n === _length) {
          buffers.shift()
        }
        else {
          buffers[0] = buffers[0].slice(n, _length)
        }
        length -= n
        return buf
      }  else if(n < length) {
        var out = [], len = 0

        while((len + buffers[0].length) < n) {
          var b = buffers.shift()
          len += b.length
          out.push(b)
        }

        if(len < n) {
          out.push(buffers[0].slice(0, n - len))
          buffers[0] = buffers[0].slice(n - len, buffers[0].length)
          this.length = length = length - n
        }
        return Buffer.concat(out)
      }
      else
        throw new Error('could not get ' + n + ' bytes')
    }
  }

}






}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/pull-reader/state.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/pull-reader/state.js",}],
[2427, {"./crypto":2426,"buffer":1428,"multihashes":2698}, function (require, module, exports) {
(function (Buffer){
'use strict'

const multihash = require('multihashes')
const crypto = require('./crypto')

module.exports = Multihashing

/**
 * Hash the given `buf` using the algorithm specified
 * by `func`.
 *
 * @param {Buffer} buf - The value to hash.
 * @param {number|string} func - The algorithm to use.
 * @param {number} [length] - Optionally trim the result to this length.
 * @param {function(Error, Buffer)} callback
 * @returns {undefined}
 */
function Multihashing (buf, func, length, callback) {
  if (typeof length === 'function') {
    callback = length
    length = undefined
  }

  if (!callback) {
    throw new Error('Missing callback')
  }

  Multihashing.digest(buf, func, length, (err, digest) => {
    if (err) {
      return callback(err)
    }

    callback(null, multihash.encode(digest, func, length))
  })
}

/**
 * The `buffer` module for easy use in the browser.
 *
 * @type {Buffer}
 */
Multihashing.Buffer = Buffer // for browser things

/**
 * Expose multihash itself, to avoid silly double requires.
 */
Multihashing.multihash = multihash

/**
 * @param {Buffer} buf - The value to hash.
 * @param {number|string} func - The algorithm to use.
 * @param {number} [length] - Optionally trim the result to this length.
 * @param {function(Error, Buffer)} callback
 * @returns {undefined}
 */
Multihashing.digest = function (buf, func, length, callback) {
  if (typeof length === 'function') {
    callback = length
    length = undefined
  }

  if (!callback) {
    throw new Error('Missing callback')
  }

  let cb = callback
  if (length) {
    cb = (err, digest) => {
      if (err) {
        return callback(err)
      }

      callback(null, digest.slice(0, length))
    }
  }

  let hash
  try {
    hash = Multihashing.createHash(func)
  } catch (err) {
    return cb(err)
  }

  hash(buf, cb)
}

/**
 * @param {string|number} func
 *
 * @returns {function} - The to `func` corresponding hash function.
 */
Multihashing.createHash = function (func) {
  func = multihash.coerceCode(func)
  if (!Multihashing.functions[func]) {
    throw new Error('multihash function ' + func + ' not yet supported')
  }

  return Multihashing.functions[func]
}

/**
 * Mapping of multihash codes to their hashing functions.
 * @type {Object}
 */
Multihashing.functions = {
  // sha1
  0x11: crypto.sha1,
  // sha2-256
  0x12: crypto.sha2256,
  // sha2-512
  0x13: crypto.sha2512,
  // sha3-512
  0x14: crypto.sha3512,
  // sha3-384
  0x15: crypto.sha3384,
  // sha3-256
  0x16: crypto.sha3256,
  // sha3-224
  0x17: crypto.sha3224,
  // shake-128
  0x18: crypto.shake128,
  // shake-256
  0x19: crypto.shake256,
  // keccak-224
  0x1A: crypto.keccak224,
  // keccak-256
  0x1B: crypto.keccak256,
  // keccak-384
  0x1C: crypto.keccak384,
  // keccak-512
  0x1D: crypto.keccak512,
  // murmur3-128
  0x22: crypto.murmur3128,
  // murmur3-32
  0x23: crypto.murmur332,
  // dbl-sha2-256
  0x56: crypto.dblSha2256
}

// add blake functions
crypto.addBlake(Multihashing.functions)

Multihashing.validate = (data, hash, callback) => {
  let algo = multihash.decode(hash).name
  Multihashing(data, algo, (err, newHash) => {
    if (err) return callback(err)
    callback(err, Buffer.compare(hash, newHash) === 0)
  })
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-record/node_modules/multihashing-async/src/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-record/node_modules/multihashing-async/src/index.js",}],
[2985, {}, function (require, module, exports) {
module.exports = function(socket, callback) {
  var remove = socket && (socket.removeEventListener || socket.removeListener);

  function cleanup () {
    if (typeof remove == 'function') {
      remove.call(socket, 'open', handleOpen);
      remove.call(socket, 'error', handleErr);
    }
  }

  function handleOpen(evt) {
    cleanup(); callback();
  }

  function handleErr (evt) {
    cleanup(); callback(evt);
  }

  // if the socket is closing or closed, return end
  if (socket.readyState >= 2) {
    return callback(true);
  }

  // if open, trigger the callback
  if (socket.readyState === 1) {
    return callback();
  }

  socket.addEventListener('open', handleOpen);
  socket.addEventListener('error', handleErr);
};

//# sourceMappingURL=node_modules/pull-ws/ready.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/pull-ws/ready.js",}],
[2379, {"_process":2892,"buffer":1428}, function (require, module, exports) {
(function (process,Buffer){
'use strict'

exports.toCallback = (doWork) => {
  return function (input, callback) {
    let res
    try {
      res = doWork(input)
    } catch (err) {
      process.nextTick(callback, err)
      return
    }

    process.nextTick(callback, null, res)
  }
}

exports.toBuf = (doWork, other) => (input) => {
  let result = doWork(input, other)
  return Buffer.from(result, 'hex')
}

exports.fromString = (doWork, other) => (_input) => {
  const input = Buffer.isBuffer(_input) ? _input.toString() : _input
  return doWork(input, other)
}

exports.fromNumberTo32BitBuf = (doWork, other) => (input) => {
  let number = doWork(input, other)
  const bytes = new Array(4)

  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }

  return Buffer.from(bytes)
}

}).call(this,require('_process'),require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-kad-dht/node_modules/multihashing-async/src/utils.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/node_modules/multihashing-async/src/utils.js",}],
[2374, {"_process":2892}, function (require, module, exports) {
(function (process,global){
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var INPUT_ERROR = 'input is invalid type';
  var FINALIZE_ERROR = 'finalize already called';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
  var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
  };

  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
  };

  var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
  };

  var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createMethod(bits, padding, type);
    }
    return method;
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
  };

  var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
      if (!n && !s) {
        return methods['shake' + bits].create(outputBits);
      } else {
        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
      }
    };
    method.update = function (message, outputBits, n, s) {
      return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
  };

  var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
      return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
  };

  var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name + '_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
      if (algorithm.name !== 'sha3') {
        var newMethodName = algorithm.name + bits[j];
        methodNames.push(newMethodName);
        methods[newMethodName] = methods[methodName];
      }
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
      bytes.unshift(o);
      x = x >> 8;
      o = x & 255;
      ++n;
    }
    if (right) {
      bytes.push(n);
    } else {
      bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
  };

  Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
      if (type === 'object') {
        if (str === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
          str = new Uint8Array(str);
        } else if (!Array.isArray(str)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
      bytes = length;
    } else {
      for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
          bytes += 1;
        } else if (code < 0x800) {
          bytes += 2;
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes += 3;
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
          bytes += 4;
        }
      }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
  };

  Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
      bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
  };

  Keccak.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      array[offset] = block & 0xFF;
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
  }

  Kmac.prototype = new Keccak();

  Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } else {
    for (i = 0; i < methodNames.length; ++i) {
      root[methodNames[i]] = methods[methodNames[i]];
    }
    if (AMD) {
      define(function () {
        return methods;
      });
    }
  }
})();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/libp2p-kad-dht/node_modules/js-sha3/src/sha3.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/node_modules/js-sha3/src/sha3.js",}],
[2375, {"./utils":2379,"blakejs":1382,"buffer":1428}, function (require, module, exports) {
(function (Buffer){
'use strict'

const blake = require('blakejs')

const toCallback = require('./utils').toCallback

const minB = 0xb201
const minS = 0xb241

const blake2b = {
  init: blake.blake2bInit,
  update: blake.blake2bUpdate,
  digest: blake.blake2bFinal
}

const blake2s = {
  init: blake.blake2sInit,
  update: blake.blake2sUpdate,
  digest: blake.blake2sFinal
}

const makeB2Hash = (size, hf) => toCallback((buf) => {
  const ctx = hf.init(size, null)
  hf.update(ctx, buf)
  return Buffer.from(hf.digest(ctx))
})

module.exports = (table) => {
  for (let i = 0; i < 64; i++) {
    table[minB + i] = makeB2Hash(i + 1, blake2b)
  }
  for (let i = 0; i < 32; i++) {
    table[minS + i] = makeB2Hash(i + 1, blake2s)
  }
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-kad-dht/node_modules/multihashing-async/src/blake.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/node_modules/multihashing-async/src/blake.js",}],
[2376, {"buffer":1428,"nodeify":2755}, function (require, module, exports) {
(function (Buffer){
/* global self */

'use strict'

const nodeify = require('nodeify')

const webCrypto = getWebCrypto()

function getWebCrypto () {
  if (self.crypto) {
    return self.crypto.subtle || self.crypto.webkitSubtle
  }

  if (self.msCrypto) {
    return self.msCrypto.subtle
  }
}

function webCryptoHash (type) {
  if (!webCrypto) {
    throw new Error('Please use a browser with webcrypto support and ensure the code has been delivered securely via HTTPS/TLS and run within a Secure Context')
  }

  return (data, callback) => {
    const res = webCrypto.digest({ name: type }, data)

    if (typeof res.then !== 'function') { // IE11
      res.onerror = () => {
        callback(new Error(`hashing data using ${type}`))
      }
      res.oncomplete = (e) => {
        callback(null, e.target.result)
      }
      return
    }

    nodeify(
      res.then((raw) => Buffer.from(new Uint8Array(raw))),
      callback
    )
  }
}

function sha1 (buf, callback) {
  webCryptoHash('SHA-1')(buf, callback)
}

function sha2256 (buf, callback) {
  webCryptoHash('SHA-256')(buf, callback)
}

function sha2512 (buf, callback) {
  webCryptoHash('SHA-512')(buf, callback)
}

module.exports = {
  sha1: sha1,
  sha2256: sha2256,
  sha2512: sha2512
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-kad-dht/node_modules/multihashing-async/src/crypto-sha1-2-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/node_modules/multihashing-async/src/crypto-sha1-2-browser.js",}],
[2388, {"./utils":2406,"debug":1565,"heap":1920,"promisify-es6":2896,"xor-distance":3587}, function (require, module, exports) {
'use strict'

const Heap = require('heap')
const distance = require('xor-distance')
const debug = require('debug')
const promisify = require('promisify-es6')

const utils = require('./utils')

const log = debug('libp2p:dht:peer-queue')

/**
 * PeerQueue is a heap that sorts its entries (PeerIds) by their
 * xor distance to the inital provided key.
 */
class PeerQueue {
  /**
   * Create from a given peer id.
   *
   * @param {PeerId} id
   * @returns {Promise<PeerQueue>}
   */
  static async fromPeerId (id) {
    const key = await promisify(cb => utils.convertPeerId(id, cb))()
    return new PeerQueue(key)
  }

  /**
   * Create from a given buffer.
   *
   * @param {Buffer} keyBuffer
   * @returns {Promise<PeerQueue>}
   */
  static async fromKey (keyBuffer) {
    const key = await promisify(cb => utils.convertBuffer(keyBuffer, cb))()
    return new PeerQueue(key)
  }

  /**
   * Create a new PeerQueue.
   *
   * @param {Buffer} from - The sha2-256 encoded peer id
   */
  constructor (from) {
    log('create: %b', from)
    this.from = from
    this.heap = new Heap(utils.xorCompare)
  }

  /**
   * Add a new PeerId to the queue.
   *
   * @param {PeerId} id
   * @returns {Promise}
   */
  async enqueue (id) {
    log('enqueue %s', id.toB58String())
    const key = await promisify(cb => utils.convertPeerId(id, cb))()

    const el = {
      id: id,
      distance: distance(this.from, key)
    }

    this.heap.push(el)
  }

  /**
   * Returns the closest peer to the `from` peer.
   *
   * @returns {PeerId}
   */
  dequeue () {
    const el = this.heap.pop()
    log('dequeue %s', el.id.toB58String())
    return el.id
  }

  get length () {
    return this.heap.size()
  }
}

module.exports = PeerQueue

//# sourceMappingURL=node_modules/libp2p-kad-dht/src/peer-queue.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/src/peer-queue.js",}],
[2403, {"../../utils":2406}, function (require, module, exports) {
'use strict'

const utils = require('../../utils')

module.exports = (dht) => {
  const log = utils.logger(dht.peerInfo.id, 'rpc:ping')

  /**
   * Process `Ping` DHT messages.
   *
   * @param {PeerInfo} peer
   * @param {Message} msg
   * @param {function(Error, Message)} callback
   * @returns {undefined}
   */
  return function ping (peer, msg, callback) {
    log('from %s', peer.id.toB58String())
    callback(null, msg)
  }
}

//# sourceMappingURL=node_modules/libp2p-kad-dht/src/rpc/handlers/ping.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/src/rpc/handlers/ping.js",}],
[2404, {"../../utils":2406,"err-code":1657}, function (require, module, exports) {
'use strict'

const utils = require('../../utils')
const errcode = require('err-code')

module.exports = (dht) => {
  const log = utils.logger(dht.peerInfo.id, 'rpc:put-value')

  /**
   * Process `PutValue` DHT messages.
   *
   * @param {PeerInfo} peer
   * @param {Message} msg
   * @param {function(Error, Message)} callback
   * @returns {undefined}
   */
  return function putValue (peer, msg, callback) {
    const key = msg.key
    log('key: %b', key)

    const record = msg.record

    if (!record) {
      const errMsg = `Empty record from: ${peer.id.toB58String()}`

      log.error(errMsg)
      return callback(errcode(new Error(errMsg), 'ERR_EMPTY_RECORD'))
    }

    dht._verifyRecordLocally(record, (err) => {
      if (err) {
        log.error(err.message)
        return callback(err)
      }

      record.timeReceived = new Date()

      const key = utils.bufferToKey(record.key)

      dht.datastore.put(key, record.serialize(), (err) => {
        if (err) {
          return callback(err)
        }

        callback(null, msg)
      })
    })
  }
}

//# sourceMappingURL=node_modules/libp2p-kad-dht/src/rpc/handlers/put-value.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/src/rpc/handlers/put-value.js",}],
[2398, {"../../utils":2406,"cids":1446,"err-code":1657,"promise-to-callback":2894}, function (require, module, exports) {
'use strict'

const CID = require('cids')
const errcode = require('err-code')
const promiseToCallback = require('promise-to-callback')

const utils = require('../../utils')

module.exports = (dht) => {
  const log = utils.logger(dht.peerInfo.id, 'rpc:add-provider')
  /**
   * Process `AddProvider` DHT messages.
   *
   * @param {PeerInfo} peer
   * @param {Message} msg
   * @param {function(Error)} callback
   * @returns {undefined}
   */
  return function addProvider (peer, msg, callback) {
    log('start')

    if (!msg.key || msg.key.length === 0) {
      return callback(errcode(new Error('Missing key'), 'ERR_MISSING_KEY'))
    }

    let cid
    try {
      cid = new CID(msg.key)
    } catch (err) {
      const errMsg = `Invalid CID: ${err.message}`

      return callback(errcode(new Error(errMsg), 'ERR_INVALID_CID'))
    }

    let foundProvider = false
    msg.providerPeers.forEach((pi) => {
      // Ignore providers not from the originator
      if (!pi.id.isEqual(peer.id)) {
        log('invalid provider peer %s from %s', pi.id.toB58String(), peer.id.toB58String())
        return
      }

      if (pi.multiaddrs.size < 1) {
        log('no valid addresses for provider %s. Ignore', peer.id.toB58String())
        return
      }

      log('received provider %s for %s (addrs %s)', peer.id.toB58String(), cid.toBaseEncodedString(), pi.multiaddrs.toArray().map((m) => m.toString()))

      if (!dht._isSelf(pi.id)) {
        foundProvider = true
        dht.peerBook.put(pi)
        promiseToCallback(dht.providers.addProvider(cid, pi.id))(err => callback(err))
      }
    })

    // Previous versions of the JS DHT sent erroneous providers in the
    // `providerPeers` field. In order to accommodate older clients that have
    // this bug, we fall back to assuming the originator is the provider if
    // we can't find any valid providers in the payload.
    // https://github.com/libp2p/js-libp2p-kad-dht/pull/127
    // https://github.com/libp2p/js-libp2p-kad-dht/issues/128
    if (!foundProvider) {
      promiseToCallback(dht.providers.addProvider(cid, peer.id))(err => callback(err))
    }
  }
}

//# sourceMappingURL=node_modules/libp2p-kad-dht/src/rpc/handlers/add-provider.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/src/rpc/handlers/add-provider.js",}],
[2399, {"../../message":2384,"../../utils":2406,"async/waterfall":1173,"buffer":1428}, function (require, module, exports) {
(function (Buffer){
'use strict'

const waterfall = require('async/waterfall')

const Message = require('../../message')
const utils = require('../../utils')

module.exports = (dht) => {
  const log = utils.logger(dht.peerInfo.id, 'rpc:find-node')

  /**
   * Process `FindNode` DHT messages.
   *
   * @param {PeerInfo} peer
   * @param {Message} msg
   * @param {function(Error, Message)} callback
   * @returns {undefined}
   */
  return function findNode (peer, msg, callback) {
    log('start')

    waterfall([
      (cb) => {
        if (msg.key.equals(dht.peerInfo.id.id)) {
          return cb(null, [dht.peerInfo])
        }

        dht._betterPeersToQuery(msg, peer, cb)
      },
      (closer, cb) => {
        const response = new Message(msg.type, Buffer.alloc(0), msg.clusterLevel)

        if (closer.length > 0) {
          response.closerPeers = closer
        } else {
          log('handle FindNode %s: could not find anything', peer.id.toB58String())
        }

        cb(null, response)
      }
    ], callback)
  }
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-kad-dht/src/rpc/handlers/find-node.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/src/rpc/handlers/find-node.js",}],
[2401, {"../../message":2384,"../../utils":2406,"async/parallel":1162,"err-code":1657,"libp2p-record":2429}, function (require, module, exports) {
'use strict'

const parallel = require('async/parallel')
const Record = require('libp2p-record').Record

const errcode = require('err-code')

const Message = require('../../message')
const utils = require('../../utils')

module.exports = (dht) => {
  const log = utils.logger(dht.peerInfo.id, 'rpc:get-value')

  /**
   * Process `GetValue` DHT messages.
   *
   * @param {PeerInfo} peer
   * @param {Message} msg
   * @param {function(Error, Message)} callback
   * @returns {undefined}
   */
  return function getValue (peer, msg, callback) {
    const key = msg.key

    log('key: %b', key)

    if (!key || key.length === 0) {
      return callback(errcode(new Error('Invalid key'), 'ERR_INVALID_KEY'))
    }

    const response = new Message(Message.TYPES.GET_VALUE, key, msg.clusterLevel)

    if (utils.isPublicKeyKey(key)) {
      log('is public key')
      const id = utils.fromPublicKeyKey(key)
      let info

      if (dht._isSelf(id)) {
        info = dht.peerInfo
      } else if (dht.peerBook.has(id)) {
        info = dht.peerBook.get(id)
      }

      if (info && info.id.pubKey) {
        log('returning found public key')
        response.record = new Record(key, info.id.pubKey.bytes)
        return callback(null, response)
      }
    }

    parallel([
      (cb) => dht._checkLocalDatastore(key, cb),
      (cb) => dht._betterPeersToQuery(msg, peer, cb)
    ], (err, res) => {
      if (err) {
        return callback(err)
      }

      const record = res[0]
      const closer = res[1]

      if (record) {
        log('got record')
        response.record = record
      }

      if (closer.length > 0) {
        log('got closer %s', closer.length)
        response.closerPeers = closer
      }

      callback(null, response)
    })
  }
}

//# sourceMappingURL=node_modules/libp2p-kad-dht/src/rpc/handlers/get-value.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/src/rpc/handlers/get-value.js",}],
[2400, {"../../message":2384,"../../utils":2406,"async/parallel":1162,"cids":1446,"err-code":1657,"peer-info":2884,"promise-to-callback":2894}, function (require, module, exports) {
'use strict'

const CID = require('cids')
const parallel = require('async/parallel')
const PeerInfo = require('peer-info')
const promiseToCallback = require('promise-to-callback')
const errcode = require('err-code')

const Message = require('../../message')
const utils = require('../../utils')

module.exports = (dht) => {
  const log = utils.logger(dht.peerInfo.id, 'rpc:get-providers')

  /**
   * Process `GetProviders` DHT messages.
   *
   * @param {PeerInfo} peer
   * @param {Message} msg
   * @param {function(Error, Message)} callback
   * @returns {undefined}
   */
  return function getProviders (peer, msg, callback) {
    let cid
    try {
      cid = new CID(msg.key)
    } catch (err) {
      return callback(errcode(new Error(`Invalid CID: ${err.message}`), 'ERR_INVALID_CID'))
    }

    log('%s', cid.toBaseEncodedString())

    const dsKey = utils.bufferToKey(cid.buffer)

    parallel([
      (cb) => dht.datastore.has(dsKey, (err, exists) => {
        if (err) {
          log.error('Failed to check datastore existence', err)
          return cb(null, false)
        }

        cb(null, exists)
      }),
      (cb) => promiseToCallback(dht.providers.getProviders(cid))(cb),
      (cb) => dht._betterPeersToQuery(msg, peer, cb)
    ], (err, res) => {
      if (err) {
        return callback(err)
      }
      const has = res[0]
      const closer = res[2]
      const providers = res[1].map((p) => {
        if (dht.peerBook.has(p)) {
          return dht.peerBook.get(p)
        }

        return dht.peerBook.put(new PeerInfo(p))
      })

      if (has) {
        providers.push(dht.peerInfo)
      }

      const response = new Message(msg.type, msg.key, msg.clusterLevel)

      if (providers.length > 0) {
        response.providerPeers = providers
      }

      if (closer.length > 0) {
        response.closerPeers = closer
      }

      log('got %s providers %s closerPeers', providers.length, closer.length)

      callback(null, response)
    })
  }
}

//# sourceMappingURL=node_modules/libp2p-kad-dht/src/rpc/handlers/get-providers.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-kad-dht/src/rpc/handlers/get-providers.js",}],
[2443, {"./crypto":2442,"buffer":1428,"multihashes":2698}, function (require, module, exports) {
(function (Buffer){
'use strict'

const multihash = require('multihashes')
const crypto = require('./crypto')

module.exports = Multihashing

/**
 * Hash the given `buf` using the algorithm specified
 * by `func`.
 *
 * @param {Buffer} buf - The value to hash.
 * @param {number|string} func - The algorithm to use.
 * @param {number} [length] - Optionally trim the result to this length.
 * @param {function(Error, Buffer)} callback
 * @returns {undefined}
 */
function Multihashing (buf, func, length, callback) {
  if (typeof length === 'function') {
    callback = length
    length = undefined
  }

  if (!callback) {
    throw new Error('Missing callback')
  }

  Multihashing.digest(buf, func, length, (err, digest) => {
    if (err) {
      return callback(err)
    }

    callback(null, multihash.encode(digest, func, length))
  })
}

/**
 * The `buffer` module for easy use in the browser.
 *
 * @type {Buffer}
 */
Multihashing.Buffer = Buffer // for browser things

/**
 * Expose multihash itself, to avoid silly double requires.
 */
Multihashing.multihash = multihash

/**
 * @param {Buffer} buf - The value to hash.
 * @param {number|string} func - The algorithm to use.
 * @param {number} [length] - Optionally trim the result to this length.
 * @param {function(Error, Buffer)} callback
 * @returns {undefined}
 */
Multihashing.digest = function (buf, func, length, callback) {
  if (typeof length === 'function') {
    callback = length
    length = undefined
  }

  if (!callback) {
    throw new Error('Missing callback')
  }

  let cb = callback
  if (length) {
    cb = (err, digest) => {
      if (err) {
        return callback(err)
      }

      callback(null, digest.slice(0, length))
    }
  }

  let hash
  try {
    hash = Multihashing.createHash(func)
  } catch (err) {
    return cb(err)
  }

  hash(buf, cb)
}

/**
 * @param {string|number} func
 *
 * @returns {function} - The to `func` corresponding hash function.
 */
Multihashing.createHash = function (func) {
  func = multihash.coerceCode(func)
  if (!Multihashing.functions[func]) {
    throw new Error('multihash function ' + func + ' not yet supported')
  }

  return Multihashing.functions[func]
}

/**
 * Mapping of multihash codes to their hashing functions.
 * @type {Object}
 */
Multihashing.functions = {
  // sha1
  0x11: crypto.sha1,
  // sha2-256
  0x12: crypto.sha2256,
  // sha2-512
  0x13: crypto.sha2512,
  // sha3-512
  0x14: crypto.sha3512,
  // sha3-384
  0x15: crypto.sha3384,
  // sha3-256
  0x16: crypto.sha3256,
  // sha3-224
  0x17: crypto.sha3224,
  // shake-128
  0x18: crypto.shake128,
  // shake-256
  0x19: crypto.shake256,
  // keccak-224
  0x1A: crypto.keccak224,
  // keccak-256
  0x1B: crypto.keccak256,
  // keccak-384
  0x1C: crypto.keccak384,
  // keccak-512
  0x1D: crypto.keccak512,
  // murmur3-128
  0x22: crypto.murmur3128,
  // murmur3-32
  0x23: crypto.murmur332,
  // dbl-sha2-256
  0x56: crypto.dblSha2256
}

// add blake functions
crypto.addBlake(Multihashing.functions)

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-secio/node_modules/multihashing-async/src/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-secio/node_modules/multihashing-async/src/index.js",}],
[2451, {}, function (require, module, exports) {
'use strict'

module.exports = `message Propose {
  optional bytes rand = 1;
  optional bytes pubkey = 2;
  optional string exchanges = 3;
  optional string ciphers = 4;
  optional string hashes = 5;
}

message Exchange {
  optional bytes epubkey = 1;
  optional bytes signature = 2;
}`

//# sourceMappingURL=node_modules/libp2p-secio/src/handshake/secio.proto.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-secio/src/handshake/secio.proto.js",}],
[1518, {"events":1429}, function (require, module, exports) {
"use strict"

const EE = require("events").EventEmitter

function DataQueue() {
  const ee = new EE()
  let q = []
  let ed

  function unleak() {
    ee.removeAllListeners("err")
    ee.removeAllListeners("data")
  }

  return {
    append: data => {
      if (ed) return ed
      q.push(data)
      ee.emit("data")
    },
    prepend: data => { //better only call this before the get queue starts
      if (ed) return ed
      q.unshift(data)
    },
    error: e => {
      ed = e
      ee.emit("err", e)
    },
    get: cb => {
      unleak()
      if (ed) return cb(ed)
      if (q.length) return cb(null, q.shift())
      ee.once("err", e => {
        unleak()
        cb(e)
      })
      ee.once("data", () => {
        unleak()
        return cb(null, q.shift())
      })
    },
    height: () => q.length
  }
}
module.exports = DataQueue

//# sourceMappingURL=node_modules/data-queue/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/data-queue/index.js",}],
[3321, {"./common":3322,"_process":2892}, function (require, module, exports) {
(function (process){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};


}).call(this,require('_process'))

//# sourceMappingURL=node_modules/socket.io-pull-stream/node_modules/debug/src/browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socket.io-pull-stream/node_modules/debug/src/browser.js",}],
[3288, {}, function (require, module, exports) {
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;

//# sourceMappingURL=node_modules/simple-peer/node_modules/readable-stream/errors-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/readable-stream/errors-browser.js",}],
[3301, {"events":1429}, function (require, module, exports) {
module.exports = require('events').EventEmitter;

//# sourceMappingURL=node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/stream-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/stream-browser.js",}],
[3296, {"_process":2892}, function (require, module, exports) {
(function (process){
'use strict'; // undocumented cb() API, needed for core, not for public API

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
}).call(this,require('_process'))

//# sourceMappingURL=node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/destroy.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/destroy.js",}],
[3300, {"../../../errors":3288}, function (require, module, exports) {
'use strict';

var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

module.exports = {
  getHighWaterMark: getHighWaterMark
};
//# sourceMappingURL=node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/state.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/state.js",}],
[3298, {}, function (require, module, exports) {
module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};

//# sourceMappingURL=node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/from-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/from-browser.js",}],
[3295, {"buffer":1428,"util":1398}, function (require, module, exports) {
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('buffer'),
    Buffer = _require.Buffer;

var _require2 = require('util'),
    inspect = _require2.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}

module.exports =
/*#__PURE__*/
function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();
//# sourceMappingURL=node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/buffer_list.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/buffer_list.js",}],
[3294, {"./end-of-stream":3297,"_process":2892}, function (require, module, exports) {
(function (process){
'use strict';

var _Object$setPrototypeO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var finished = require('./end-of-stream');

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

module.exports = createReadableStreamAsyncIterator;
}).call(this,require('_process'))

//# sourceMappingURL=node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/async_iterator.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/readable-stream/lib/internal/streams/async_iterator.js",}],
[3304, {"safe-buffer":3303}, function (require, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
//# sourceMappingURL=node_modules/simple-peer/node_modules/string_decoder/lib/string_decoder.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/string_decoder/lib/string_decoder.js",}],
[1901, {}, function (require, module, exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

//# sourceMappingURL=node_modules/has-binary2/node_modules/isarray/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/has-binary2/node_modules/isarray/index.js",}],
[3313, {}, function (require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

//# sourceMappingURL=node_modules/socket.io-client/node_modules/ms/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socket.io-client/node_modules/ms/index.js",}],
[3318, {"ms":3320}, function (require, module, exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

//# sourceMappingURL=node_modules/socket.io-parser/node_modules/debug/src/debug.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socket.io-parser/node_modules/debug/src/debug.js",}],
[1654, {"./keys":1655,"./utf8":1656,"after":1074,"arraybuffer.slice":1077,"base64-arraybuffer":1345,"blob":1384,"has-binary2":1900}, function (require, module, exports) {
/**
 * Module dependencies.
 */

var keys = require('./keys');
var hasBinary = require('has-binary2');
var sliceBuffer = require('arraybuffer.slice');
var after = require('after');
var utf8 = require('./utf8');

var base64encoder;
if (typeof ArrayBuffer !== 'undefined') {
  base64encoder = require('base64-arraybuffer');
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = require('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    exports.encodePacket({ type: packet.type, data: fr.result }, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (typeof Blob !== 'undefined' && packet.data instanceof Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data === 'string') {
    if (data.charAt(0) === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '', n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || (length != (n = Number(length)))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var ret = callback(packet, i + n, l);
      if (false === ret) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] === 255) break;

      // 310 = char length of Number.MAX_VALUE
      if (msgLength.length > 310) {
        return callback(err, 0, 1);
      }

      msgLength += tailArray[i];
    }

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

//# sourceMappingURL=node_modules/engine.io-parser/lib/browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-parser/lib/browser.js",}],
[1643, {"./transport":1644,"./transports/index":1645,"component-emitter":1463,"debug":1651,"engine.io-parser":1654,"indexof":1946,"parseqs":2871,"parseuri":2872}, function (require, module, exports) {
/**
 * Module dependencies.
 */

var transports = require('./transports/index');
var Emitter = require('component-emitter');
var debug = require('debug')('engine.io-client:socket');
var index = require('indexof');
var parser = require('engine.io-parser');
var parseuri = require('parseuri');
var parseqs = require('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (typeof location !== 'undefined' && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (typeof location !== 'undefined' ? location.hostname : 'localhost');
  this.port = opts.port || (typeof location !== 'undefined' && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.withCredentials = false !== opts.withCredentials;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // detect ReactNative environment
  this.isReactNative = (typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative');

  // other options for Node.js or ReactNative client
  if (typeof self === 'undefined' || this.isReactNative) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = require('./transport');
Socket.transports = require('./transports/index');
Socket.parser = require('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    withCredentials: options.withCredentials || this.withCredentials,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void (0),
    isReactNative: this.isReactNative
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(JSON.parse(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

//# sourceMappingURL=node_modules/engine.io-client/lib/socket.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/socket.js",}],
[2419, {"./index":2417,"buffer":1428}, function (require, module, exports) {
(function (Buffer){
'use strict'

const { Message } = require('./index')
const SignPrefix = Buffer.from('libp2p-pubsub:')

module.exports.SignPrefix = SignPrefix

/**
 * Signs the provided message with the given `peerId`
 *
 * @param {PeerId} peerId
 * @param {Message} message
 * @param {function(Error, Message)} callback
 * @returns {void}
 */
module.exports.signMessage = function (peerId, message, callback) {
  // Get the message in bytes, and prepend with the pubsub prefix
  const bytes = Buffer.concat([
    SignPrefix,
    Message.encode(message)
  ])

  // Sign the bytes with the private key
  peerId.privKey.sign(bytes, (err, signature) => {
    if (err) return callback(err)

    callback(null, {
      ...message,
      signature: signature,
      key: peerId.pubKey.bytes
    })
  })
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-pubsub/src/message/sign.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-pubsub/src/message/sign.js",}],
[2422, {"../../is-buffer/index.js":2235,"bs58":1433,"libp2p-crypto":2352}, function (require, module, exports) {
(function (Buffer){
'use strict'

const crypto = require('libp2p-crypto')
const bs58 = require('bs58')

exports = module.exports

/**
 * Generatea random sequence number.
 *
 * @returns {Buffer}
 * @private
 */
exports.randomSeqno = () => {
  return crypto.randomBytes(20)
}

/**
 * Generate a message id, based on the `from` and `seqno`.
 *
 * @param {string} from
 * @param {Buffer} seqno
 * @returns {string}
 * @private
 */
exports.msgId = (from, seqno) => {
  return from + seqno.toString('hex')
}

/**
 * Check if any member of the first set is also a member
 * of the second set.
 *
 * @param {Set|Array} a
 * @param {Set|Array} b
 * @returns {boolean}
 * @private
 */
exports.anyMatch = (a, b) => {
  let bHas
  if (Array.isArray(b)) {
    bHas = (val) => b.indexOf(val) > -1
  } else {
    bHas = (val) => b.has(val)
  }

  for (let val of a) {
    if (bHas(val)) {
      return true
    }
  }

  return false
}

/**
 * Make everything an array.
 *
 * @param {any} maybeArray
 * @returns {Array}
 * @private
 */
exports.ensureArray = (maybeArray) => {
  if (!Array.isArray(maybeArray)) {
    return [maybeArray]
  }

  return maybeArray
}

exports.normalizeInRpcMessages = (messages) => {
  if (!messages) {
    return messages
  }
  return messages.map((msg) => {
    const m = Object.assign({}, msg)
    if (Buffer.isBuffer(msg.from)) {
      m.from = bs58.encode(msg.from)
    }
    return m
  })
}

exports.normalizeOutRpcMessage = (message) => {
  const m = Object.assign({}, message)
  if (typeof message.from === 'string' || message.from instanceof String) {
    m.from = bs58.decode(message.from)
  }
  return m
}

exports.normalizeOutRpcMessages = (messages) => {
  if (!messages) {
    return messages
  }
  return messages.map(exports.normalizeOutRpcMessage)
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})

//# sourceMappingURL=node_modules/libp2p-pubsub/src/utils.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-pubsub/src/utils.js",}],
[2421, {"./message":2417,"async/setImmediate":1167,"events":1429,"pull-length-prefixed":2931,"pull-pushable":2943,"pull-stream":2949}, function (require, module, exports) {
'use strict'

const lp = require('pull-length-prefixed')
const Pushable = require('pull-pushable')
const pull = require('pull-stream')
const setImmediate = require('async/setImmediate')
const EventEmitter = require('events')

const { RPC } = require('./message')

/**
 * The known state of a connected peer.
 */
class Peer extends EventEmitter {
  /**
   * @param {PeerInfo} info
   */
  constructor (info) {
    super()

    /**
     * @type {PeerInfo}
     */
    this.info = info
    /**
     * @type {Connection}
     */
    this.conn = null
    /**
     * @type {Set}
     */
    this.topics = new Set()
    /**
     * @type {Pushable}
     */
    this.stream = null

    this._references = 0
  }

  /**
   * Is the peer connected currently?
   *
   * @type {boolean}
   */
  get isConnected () {
    return Boolean(this.conn)
  }

  /**
   * Do we have a connection to write on?
   *
   * @type {boolean}
   */
  get isWritable () {
    return Boolean(this.stream)
  }

  /**
   * Send a message to this peer.
   * Throws if there is no `stream` to write to available.
   *
   * @param {Buffer} msg
   * @returns {undefined}
   */
  write (msg) {
    if (!this.isWritable) {
      const id = this.info.id.toB58String()
      throw new Error('No writable connection to ' + id)
    }

    this.stream.push(msg)
  }

  /**
   * Attach the peer to a connection and setup a write stream
   *
   * @param {Connection} conn
   * @returns {undefined}
   */
  attachConnection (conn) {
    this.conn = conn
    this.stream = new Pushable()

    pull(
      this.stream,
      lp.encode(),
      conn,
      pull.onEnd(() => {
        this.conn = null
        this.stream = null
        this.emit('close')
      })
    )

    this.emit('connection')
  }

  _sendRawSubscriptions (topics, subscribe) {
    if (topics.size === 0) {
      return
    }

    const subs = []
    topics.forEach((topic) => {
      subs.push({
        subscribe: subscribe,
        topicID: topic
      })
    })

    this.write(RPC.encode({
      subscriptions: subs
    }))
  }

  /**
   * Send the given subscriptions to this peer.
   * @param {Set|Array} topics
   * @returns {undefined}
   */
  sendSubscriptions (topics) {
    this._sendRawSubscriptions(topics, true)
  }

  /**
   * Send the given unsubscriptions to this peer.
   * @param {Set|Array} topics
   * @returns {undefined}
   */
  sendUnsubscriptions (topics) {
    this._sendRawSubscriptions(topics, false)
  }

  /**
   * Send messages to this peer.
   *
   * @param {Array<any>} msgs
   * @returns {undefined}
   */
  sendMessages (msgs) {
    this.write(RPC.encode({
      msgs: msgs
    }))
  }

  /**
   * Bulk process subscription updates.
   *
   * @param {Array} changes
   * @returns {undefined}
   */
  updateSubscriptions (changes) {
    changes.forEach((subopt) => {
      if (subopt.subscribe) {
        this.topics.add(subopt.topicID)
      } else {
        this.topics.delete(subopt.topicID)
      }
    })
  }

  /**
   * Closes the open connection to peer
   *
   * @param {Function} callback
   * @returns {undefined}
   */
  close (callback) {
    // Force removal of peer
    this._references = 1

    // End the pushable
    if (this.stream) {
      this.stream.end()
    }

    setImmediate(() => {
      this.conn = null
      this.stream = null
      this.emit('close')
      callback()
    })
  }
}

module.exports = Peer

//# sourceMappingURL=node_modules/libp2p-pubsub/src/peer.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-pubsub/src/peer.js",}],
[2417, {"./rpc.proto.js":2418,"./topic-descriptor.proto.js":2420,"protons":2912}, function (require, module, exports) {
'use strict'

const protons = require('protons')

const rpcProto = protons(require('./rpc.proto.js'))
const RPC = rpcProto.RPC
const topicDescriptorProto = protons(require('./topic-descriptor.proto.js'))

exports = module.exports
exports.rpc = rpcProto
exports.td = topicDescriptorProto
exports.RPC = RPC
exports.Message = RPC.Message
exports.SubOpts = RPC.SubOpts

//# sourceMappingURL=node_modules/libp2p-pubsub/src/message/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-pubsub/src/message/index.js",}],
[3385, {"lodash.throttle":2505}, function (require, module, exports) {
'use strict'

const throttle = require('lodash.throttle')
exports = module.exports = TimeCache

function TimeCache (options) {
  if (!(this instanceof TimeCache)) {
    return new TimeCache(options)
  }

  options = options || {}

  const validity = options.validity || 30 // seconds

  const entries = new Map()

  const sweep = throttle(() => {
    entries.forEach((entry, key) => {
      const v = entry.validity || validity
      const delta = getTimeElapsed(entry.timestamp)
      if (delta > v) {
        entries.delete(key)
      }
    })
  }, 200)

  this.put = (key, value, validity) => {
    if (!this.has(key)) {
      entries.set(key, {
        value: value,
        timestamp: new Date(),
        validity: validity
      })
    }

    sweep()
  }

  this.get = (key) => {
    if (entries.has(key)) {
      return entries.get(key).value
    } else {
      throw new Error('key does not exist')
    }
  }

  this.has = (key) => {
    return entries.has(key)
  }
}

function getTimeElapsed (prevTime) {
  const currentTime = new Date()
  const a = currentTime.getTime() - prevTime.getTime()

  return Math.floor(a / 1000)
}

//# sourceMappingURL=node_modules/time-cache/src/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/time-cache/src/index.js",}],
[2310, {"debug":2312,"events":1429}, function (require, module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global document */

var debug = require('debug')('latency-monitor:VisibilityChangeEmitter');

/**
 * Listen to page visibility change events (i.e. when the page is focused / blurred) by an event emitter.
 *
 * Warning: This does not work on all browsers, but should work on all modern browsers
 *
 * @example
 *
 *     const myVisibilityEmitter = new VisibilityChangeEmitter();
 *
 *     myVisibilityEmitter.on('visibilityChange', (pageInFocus) => {
 *        if ( pageInFocus ){
 *            // Page is in focus
 *            console.log('In focus');
 *        }
 *        else {
 *            // Page is blurred
 *            console.log('Out of focus');
 *        }
 *     });
 *     // To access the visibility state directly, call:
 *     console.log('Am I focused now? ' + myVisibilityEmitter.isVisible());
 *
 * @class VisibilityChangeEmitter
 */

var VisibilityChangeEmitter = function (_EventEmitter) {
    _inherits(VisibilityChangeEmitter, _EventEmitter);

    /**
     * Creates a VisibilityChangeEmitter
     */
    function VisibilityChangeEmitter() {
        _classCallCheck(this, VisibilityChangeEmitter);

        var _this = _possibleConstructorReturn(this, (VisibilityChangeEmitter.__proto__ || Object.getPrototypeOf(VisibilityChangeEmitter)).call(this));

        if (typeof document === 'undefined') {
            debug('This is not a browser, no "document" found. Stopping.');
            return _possibleConstructorReturn(_this);
        }
        _this._initializeVisibilityVarNames();
        _this._addVisibilityChangeListener();
        return _this;
    }

    /**
     * document.hidden and document.visibilityChange are the two variables we need to check for;
     * Since these variables are named differently in different browsers, this function sets
     * the appropriate name based on the browser being used. Once executed, tha actual names of
     * document.hidden and document.visibilityChange are found in this._hidden and this._visibilityChange
     * respectively
     * @private
     */


    _createClass(VisibilityChangeEmitter, [{
        key: '_initializeVisibilityVarNames',
        value: function _initializeVisibilityVarNames() {
            var hidden = void 0;
            var visibilityChange = void 0;
            if (typeof document.hidden !== 'undefined') {
                // Opera 12.10 and Firefox 18 and later support
                hidden = 'hidden';
                visibilityChange = 'visibilitychange';
            } else if (typeof document.mozHidden !== 'undefined') {
                hidden = 'mozHidden';
                visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.msHidden !== 'undefined') {
                hidden = 'msHidden';
                visibilityChange = 'msvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                hidden = 'webkitHidden';
                visibilityChange = 'webkitvisibilitychange';
            }
            this._hidden = hidden;
            this._visibilityChange = visibilityChange;
        }

        /**
         * Adds an event listener on the document that listens to changes in document.visibilityChange
         * (or whatever name by which the visibilityChange variable is known in the browser)
         * @private
         */

    }, {
        key: '_addVisibilityChangeListener',
        value: function _addVisibilityChangeListener() {
            if (typeof document.addEventListener === 'undefined' || typeof document[this._hidden] === 'undefined') {
                debug('Checking page visibility requires a browser that supports the Page Visibility API.');
            } else {
                // Handle page visibility change
                document.addEventListener(this._visibilityChange, this._handleVisibilityChange.bind(this), false);
            }
        }

        /**
         * The function returns ```true``` if the page is visible or ```false``` if the page is not visible and
         * ```undefined``` if the page visibility API is not supported by the browser.
         * @returns {Boolean|void} whether the page is now visible or not (undefined is unknown)
         */

    }, {
        key: 'isVisible',
        value: function isVisible() {
            if (this._hidden === undefined || document[this._hidden] === undefined) {
                return undefined;
            }

            return !document[this._hidden];
        }

        /**
         * The function that is called when document.visibilityChange has changed
         * It emits an event called visibilityChange and sends the value of document.hidden as a
         * parameter
         *
         * @private
         */

    }, {
        key: '_handleVisibilityChange',
        value: function _handleVisibilityChange() {
            var visible = !document[this._hidden];
            debug(visible ? 'Page Visible' : 'Page Hidden');
            // Emit the event
            this.emit('visibilityChange', visible);
        }
    }]);

    return VisibilityChangeEmitter;
}(_events2.default);

exports.default = VisibilityChangeEmitter;
//# sourceMappingURL=VisibilityChangeEmitter.js.map

//# sourceMappingURL=node_modules/latency-monitor/dist/VisibilityChangeEmitter.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/latency-monitor/dist/VisibilityChangeEmitter.js",}],
[2312, {"./debug":2313,"_process":2892}, function (require, module, exports) {
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))

//# sourceMappingURL=node_modules/latency-monitor/node_modules/debug/src/browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/latency-monitor/node_modules/debug/src/browser.js",}],
[2455, {}, function (require, module, exports) {
;(function (globalObject) {
  'use strict';

/*
 *      bignumber.js v8.1.1
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2019 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
    hasSymbol = typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol',

    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
   * Create and return a BigNumber constructor.
   */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


      // The default values below must be integers within the inclusive ranges stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default value).
      // UP         0 Away from zero.
      // DOWN       1 Towards zero.
      // CEIL       2 Towards +Infinity.
      // FLOOR      3 Towards -Infinity.
      // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324  (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type:  308  (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP        0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN      1 The remainder has the same sign as the dividend.
      //             This modulo mode is commonly known as 'truncated division' and is
      //             equivalent to (a % n) in JavaScript.
      // FLOOR     3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
      // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      //             The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                    // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat method.
      FORMAT = {
        prefix: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ',',
        decimalSeparator: '.',
        fractionGroupSize: 0,
        fractionGroupSeparator: '\xA0',      // non-breaking space
        suffix: ''
      },

      // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
      // '-', '.', whitespace, or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';


    //------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
     */
    function BigNumber(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor call without `new`.
      if (!(x instanceof BigNumber)) return new BigNumber(v, b);

      if (b == null) {

        if (v && v._isBigNumber === true) {
          x.s = v.s;

          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }

          return;
        }

        if ((isNum = typeof v == 'number') && v * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;

          // Fast path for integers, where n < 2147483648 (2**31).
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++);

            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }

            return;
          }

          str = String(v);
        } else {

          if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10) {
          x = new BigNumber(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        str = String(v);

        if (isNum = typeof v == 'number') {

          // Avoid potential interpretation of Infinity and NaN as base 44+ values.
          if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp, so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, String(v), isNum, b);
          }
        }

        // Prevent later check for length on converted number.
        isNum = false;
        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      if (str = str.slice(i, ++len)) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error
             (tooManyDigits + (x.s * v));
        }

         // Overflow?
        if ((e = e - i - 1) > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;  // i < 1

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *     prefix                 {string}
     *     groupSize              {number}
     *     secondaryGroupSize     {number}
     *     groupSeparator         {string}
     *     decimalSeparator       {string}
     *     fractionGroupSize      {number}
     *     fractionGroupSeparator {string}
     *     suffix                 {string}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if only one character,
            // or if it contains '+', '-', '.', whitespace, or a repeated character.
            if (typeof v == 'string' && !/^.$|[+-.\s]|(.).*\1/.test(v)) {
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
     *
     * v {any}
     *
     * '[BigNumber Error] Invalid BigNumber: {v}'
     */
    BigNumber.isBigNumber = function (v) {
      if (!v || v._isBigNumber !== true) return false;
      if (!BigNumber.DEBUG) return true;

      var i, n,
        c = v.c,
        e = v.e,
        s = v.s;

      out: if ({}.toString.call(c) == '[object Array]') {

        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

          // If the first element is zero, the BigNumber value must be zero.
          if (c[0] === 0) {
            if (e === 0 && c.length === 1) return true;
            break out;
          }

          // Calculate number of digits that c[0] should have, based on the exponent.
          i = (e + 1) % LOG_BASE;
          if (i < 1) i += LOG_BASE;

          // Calculate number of digits of c[0].
          //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
          if (String(c[0]).length == i) {

            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
            }

            // Last element cannot be zero, unless it is the only element.
            if (n !== 0) return true;
          }
        }

      // Infinity/NaN
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }

      throw Error
        (bignumberError + 'Invalid BigNumber: ' + v);
    };


    /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, P.lt);
    };


    /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, P.gt);
    };


    /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              //                                     11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    /*
     * Return a BigNumber whose value is the sum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.sum = function () {
      var i = 1,
        args = arguments,
        sum = new BigNumber(args[0]);
      for (; i < args.length;) sum = sum.plus(args[i++]);
      return sum;
    };


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // THe index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc represents
        // zero, then the result of the base conversion is zero or, if rounding up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current remainder.
              n = mathfloor(rem0 / yc0);

              //  Algorithm:
              //  product = divisor multiplied by trial digit (n).
              //  Compare product and remainder.
              //  If product is greater than remainder:
              //    Subtract divisor from product, decrement trial digit.
              //  Subtract product from remainder.
              //  If product was less than remainder at the last compare:
              //    Compare new remainder and divisor.
              //    If remainder is greater than divisor:
              //      Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant digits
        // specified is less than the number of digits necessary to represent the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    function maxOrMin(args, method) {
      var n,
        i = 1,
        m = new BigNumber(args[0]);

      for (; i < args.length; i++) {
        n = new BigNumber(args[i]);

        // If any number is NaN, return NaN.
        if (!n.s) {
          m = n;
          break;
        } else if (method.call(m, n)) {
          m = n;
        }
      }

      return m;
    }


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.s = null;
        }

        x.c = x.e = null;
      }
    })();


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
        // n is a base 1e14 number, the value of the element of array x.c containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = n / pows10[d - j - 1] % 10 | 0;
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    function valueOf(n) {
      var str,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + valueOf(n));
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be known.
        y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000]  [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        if (nIsNeg) n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
          }
        }

        if (i) {
          i = mathfloor(i / 2);
          if (i === 0) break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);

          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0) break;
            nIsOdd = i % 2;
          }
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */
    P.isNaN = function () {
      return !this.s;
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy    where  0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) t = yc, yc = xc, xc = t, b = a;

      // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+valueOf(x));

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '1e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was created.
      // This would cause a division by zero (x/t) and hence Infinity below, which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
              // result. If not, then there are further digits and m will be truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the format or FORMAT object (see BigNumber.set).
     *
     * The formatting object may contain some or all of the properties shown below.
     *
     * FORMAT = {
     *   prefix: '',
     *   groupSize: 3,
     *   secondaryGroupSize: 0,
     *   groupSeparator: ',',
     *   decimalSeparator: '.',
     *   fractionGroupSize: 0,
     *   fractionGroupSeparator: '\xA0',      // non-breaking space
     *   suffix: ''
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     * [format] {object} Formatting options. See FORMAT pbject above.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     * '[BigNumber Error] Argument not an object: {format}'
     */
    P.toFormat = function (dp, rm, format) {
      var str,
        x = this;

      if (format == null) {
        if (dp != null && rm && typeof rm == 'object') {
          format = rm;
          rm = null;
        } else if (dp && typeof dp == 'object') {
          format = dp;
          dp = rm = null;
        } else {
          format = FORMAT;
        }
      } else if (typeof format != 'object') {
        throw Error
          (bignumberError + 'Argument not an object: ' + format);
      }

      str = x.toFixed(dp, rm);

      if (x.c) {
        var i,
          arr = str.split('.'),
          g1 = +format.groupSize,
          g2 = +format.secondaryGroupSize,
          groupSeparator = format.groupSeparator || '',
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = x.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) i = g1, g1 = g2, g2 = i, len -= i;

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + (format.fractionGroupSeparator || ''))
          : fractionPart)
         : intPart;
      }

      return (format.prefix || '') + str + (format.suffix || '');
    };


    /*
     * Return an array of two BigNumbers representing the value of this BigNumber as a simple
     * fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to the specified
     * maximum denominator. If a maximum denominator is not specified, the denominator will be
     * the lowest value necessary to represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */
    P.toFraction = function (md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
        }
      }

      if (!xc) return new BigNumber(x);

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

      MAX_EXP = exp;

      return r;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P.toNumber = function () {
      return +valueOf(this);
    };


    /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {
        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(coeffToString(n.c), e)
           : toFixedPoint(coeffToString(n.c), e, '0');
        } else if (b === 10) {
          n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */
    P.valueOf = P.toJSON = function () {
      return valueOf(this);
    };


    P._isBigNumber = true;

    if (hasSymbol) {
      P[Symbol.toStringTag] = 'BigNumber';

      // Node.js v10.12.0+
      P[Symbol.for('nodejs.util.inspect.custom')] = P.valueOf;
    }

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS

  // These functions don't need access to variables,
  // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + String(n));
    }
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () { return BigNumber; });

  // Node.js and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = BigNumber;

  // Browser.
  } else {
    if (!globalObject) {
      globalObject = typeof self != 'undefined' && self ? self : window;
    }

    globalObject.BigNumber = BigNumber;
  }
})(this);

//# sourceMappingURL=node_modules/libp2p-switch/node_modules/bignumber.js/bignumber.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-switch/node_modules/bignumber.js/bignumber.js",}],
[3163, {"./time":3164}, function (require, module, exports) {
'use strict'

var getTime = require('./time')

function Retimer (callback, timeout, args) {
  var that = this

  this._started = getTime()
  this._rescheduled = 0
  this._scheduled = timeout
  this._args = args

  this._timer = setTimeout(timerWrapper, timeout)

  function timerWrapper () {
    if (that._rescheduled > 0) {
      that._scheduled = that._rescheduled - (getTime() - that._started)
      that._timer = setTimeout(timerWrapper, that._scheduled)
      that._rescheduled = 0
    } else {
      callback.apply(null, that._args)
    }
  }
}

Retimer.prototype.reschedule = function (timeout) {
  var now = getTime()
  if ((now + timeout) - (this._started + this._scheduled) < 0) {
    return false
  } else {
    this._started = now
    this._rescheduled = timeout
    return true
  }
}

Retimer.prototype.clear = function () {
  clearTimeout(this._timer)
}

function retimer () {
  if (typeof arguments[0] !== 'function') {
    throw new Error('callback needed')
  }

  if (typeof arguments[1] !== 'number') {
    throw new Error('timeout needed')
  }

  var args

  if (arguments.length > 0) {
    args = new Array(arguments.length - 2)

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 2]
    }
  }

  return new Retimer(arguments[0], arguments[1], args)
}

module.exports = retimer

//# sourceMappingURL=node_modules/retimer/retimer.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/retimer/retimer.js",}],
[2456, {"class-is":1448,"debug":1565,"events":1429}, function (require, module, exports) {
'use strict'

const EventEmitter = require('events').EventEmitter
const debug = require('debug')
const withIs = require('class-is')

class BaseConnection extends EventEmitter {
  constructor ({ _switch, name }) {
    super()

    this.switch = _switch
    this.ourPeerInfo = this.switch._peerInfo
    this.log = debug(`libp2p:conn:${name}`)
    this.log.error = debug(`libp2p:conn:${name}:error`)
  }

  /**
   * Puts the state into its disconnecting flow
   *
   * @param {Error} err Will be emitted if provided
   * @returns {void}
   */
  close (err) {
    if (this._state._state === 'DISCONNECTING') return
    this.log('closing connection to %s', this.theirB58Id)
    if (err && this._events.error) {
      this.emit('error', err)
    }
    this._state('disconnect')
  }

  emit (eventName, ...args) {
    if (eventName === 'error' && !this._events.error) {
      this.log.error(...args)
    } else {
      super.emit(eventName, ...args)
    }
  }

  /**
   * Gets the current state of the connection
   *
   * @returns {string} The current state of the connection
   */
  getState () {
    return this._state._state
  }

  /**
   * Puts the state into encrypting mode
   *
   * @returns {void}
   */
  encrypt () {
    this._state('encrypt')
  }

  /**
   * Puts the state into privatizing mode
   *
   * @returns {void}
   */
  protect () {
    this._state('privatize')
  }

  /**
   * Puts the state into muxing mode
   *
   * @returns {void}
   */
  upgrade () {
    this._state('upgrade')
  }

  /**
   * Event handler for disconnected.
   *
   * @fires BaseConnection#close
   * @returns {void}
   */
  _onDisconnected () {
    this.switch.connection.remove(this)
    this.log('disconnected from %s', this.theirB58Id)
    this.emit('close')
    this.removeAllListeners()
  }

  /**
   * Event handler for privatized
   *
   * @fires BaseConnection#private
   * @returns {void}
   */
  _onPrivatized () {
    this.emit('private', this.conn)
  }

  /**
   * Wraps this.conn with the Switch.protector for private connections
   *
   * @private
   * @fires ConnectionFSM#error
   * @returns {void}
   */
  _onPrivatizing () {
    if (!this.switch.protector) {
      return this._state('done')
    }

    this.conn = this.switch.protector.protect(this.conn, (err) => {
      if (err) {
        return this.close(err)
      }

      this.log('successfully privatized conn to %s', this.theirB58Id)
      this.conn.setPeerInfo(this.theirPeerInfo)
      this._state('done')
    })
  }
}

module.exports = withIs(BaseConnection, {
  className: 'BaseConnection',
  symbolName: 'libp2p-switch/BaseConnection'
})

//# sourceMappingURL=node_modules/libp2p-switch/src/connection/base.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-switch/src/connection/base.js",}],
[2463, {"../connection":2459,"../errors":2465,"async/nextTick":1161,"debug":1565,"once":2767}, function (require, module, exports) {
'use strict'

const ConnectionFSM = require('../connection')
const { DIAL_ABORTED, ERR_BLACKLISTED } = require('../errors')
const nextTick = require('async/nextTick')
const once = require('once')
const debug = require('debug')
const log = debug('libp2p:switch:dial')
log.error = debug('libp2p:switch:dial:error')

/**
 * Components required to execute a dial
 * @typedef {Object} DialRequest
 * @property {PeerInfo} peerInfo - The peer to dial to
 * @property {string} [protocol] - The protocol to create a stream for
 * @property {object} options
 * @property {boolean} options.useFSM - If `callback` should return a ConnectionFSM
 * @property {number} options.priority - The priority of the dial
 * @property {function(Error, Connection|ConnectionFSM)} callback
 */

/**
 * @typedef {Object} NewConnection
 * @property {ConnectionFSM} connectionFSM
 * @property {boolean} didCreate
 */

/**
 * Attempts to create a new connection or stream (when muxed),
 * via negotiation of the given `protocol`. If no `protocol` is
 * provided, no action will be taken and `callback` will be called
 * immediately with no error or values.
 *
 * @param {object} options
 * @param {string} options.protocol
 * @param {ConnectionFSM} options.connection
 * @param {function(Error, Connection)} options.callback
 * @returns {void}
 */
function createConnectionWithProtocol ({ protocol, connection, callback }) {
  if (!protocol) {
    return callback()
  }
  connection.shake(protocol, (err, conn) => {
    if (!conn) {
      return callback(err)
    }

    conn.setPeerInfo(connection.theirPeerInfo)
    callback(null, conn)
  })
}

/**
 * A convenience array wrapper for controlling
 * a per peer queue
 *
 * @returns {Queue}
 */
class Queue {
  /**
   * @constructor
   * @param {string} peerId
   * @param {Switch} _switch
   * @param {function(string)} onStopped Called when the queue stops
   */
  constructor (peerId, _switch, onStopped) {
    this.id = peerId
    this.switch = _switch
    this._queue = []
    this.blackListed = null
    this.blackListCount = 0
    this.isRunning = false
    this.onStopped = onStopped
  }
  get length () {
    return this._queue.length
  }

  /**
   * Adds the dial request to the queue. The queue is not automatically started
   * @param {string} protocol
   * @param {boolean} useFSM If callback should use a ConnectionFSM instead
   * @param {function(Error, Connection)} callback
   * @returns {void}
   */
  add (protocol, useFSM, callback) {
    if (!this.isDialAllowed()) {
      return nextTick(callback, ERR_BLACKLISTED())
    }
    this._queue.push({ protocol, useFSM, callback })
  }

  /**
   * Determines whether or not dialing is currently allowed
   * @returns {boolean}
   */
  isDialAllowed () {
    if (this.blackListed) {
      // If the blacklist ttl has passed, reset it
      if (Date.now() > this.blackListed) {
        this.blackListed = null
        return true
      }
      // Dial is not allowed
      return false
    }
    return true
  }

  /**
   * Starts the queue. If the queue was started `true` will be returned.
   * If the queue was already running `false` is returned.
   * @returns {boolean}
   */
  start () {
    if (!this.isRunning) {
      log('starting dial queue to %s', this.id)
      this.isRunning = true
      this._run()
      return true
    }
    return false
  }

  /**
   * Stops the queue
   */
  stop () {
    if (this.isRunning) {
      log('stopping dial queue to %s', this.id)
      this.isRunning = false
      this.onStopped(this.id)
    }
  }

  /**
   * Stops the queue and errors the callback for each dial request
   */
  abort () {
    while (this.length > 0) {
      let dial = this._queue.shift()
      dial.callback(DIAL_ABORTED())
    }
    this.stop()
  }

  /**
   * Marks the queue as blacklisted. The queue will be immediately aborted.
   * @returns {void}
   */
  blacklist () {
    this.blackListCount++

    if (this.blackListCount >= this.switch.dialer.BLACK_LIST_ATTEMPTS) {
      this.blackListed = Infinity
      return
    }

    let ttl = this.switch.dialer.BLACK_LIST_TTL * Math.pow(this.blackListCount, 3)
    const minTTL = ttl * 0.9
    const maxTTL = ttl * 1.1

    // Add a random jitter of 20% to the ttl
    ttl = Math.floor(Math.random() * (maxTTL - minTTL) + minTTL)

    this.blackListed = Date.now() + ttl
    this.abort()
  }

  /**
   * Attempts to find a muxed connection for the given peer. If one
   * isn't found, a new one will be created.
   *
   * Returns an array containing two items. The ConnectionFSM and wether
   * or not the ConnectionFSM was just created. The latter can be used
   * to determine dialing needs.
   *
   * @private
   * @param {PeerInfo} peerInfo
   * @returns {NewConnection}
   */
  _getOrCreateConnection (peerInfo) {
    let connectionFSM = this.switch.connection.getOne(this.id)
    let didCreate = false

    if (!connectionFSM) {
      connectionFSM = new ConnectionFSM({
        _switch: this.switch,
        peerInfo,
        muxer: null,
        conn: null
      })

      this.switch.connection.add(connectionFSM)

      // Add control events and start the dialer
      connectionFSM.once('connected', () => connectionFSM.protect())
      connectionFSM.once('private', () => connectionFSM.encrypt())
      connectionFSM.once('encrypted', () => connectionFSM.upgrade())

      didCreate = true
    }

    return { connectionFSM, didCreate }
  }

  /**
   * Executes the next dial in the queue for the given peer
   * @private
   * @returns {void}
   */
  _run () {
    // If we have no items in the queue or we're stopped, exit
    if (this.length < 1 || !this.isRunning) {
      log('stopping the queue for %s', this.id)
      return this.stop()
    }

    const next = once(() => {
      log('starting next dial to %s', this.id)
      this._run()
    })

    const peerInfo = this.switch._peerBook.get(this.id)
    let queuedDial = this._queue.shift()
    let { connectionFSM, didCreate } = this._getOrCreateConnection(peerInfo)

    // If the dial expects a ConnectionFSM, we can provide that back now
    if (queuedDial.useFSM) {
      nextTick(queuedDial.callback, null, connectionFSM)
    }

    // If we can handshake protocols, get a new stream and call run again
    if (['MUXED', 'CONNECTED'].includes(connectionFSM.getState())) {
      queuedDial.connection = connectionFSM
      createConnectionWithProtocol(queuedDial)
      next()
      return
    }

    // If we error, error the queued dial
    // In the future, it may be desired to error the other queued dials,
    // depending on the error.
    connectionFSM.once('error', (err) => {
      queuedDial.callback(err)
      // Dont blacklist peers we have identified and that we are connected to
      if (peerInfo.protocols.size > 0 && peerInfo.isConnected()) {
        return
      }
      this.blacklist()
    })

    connectionFSM.once('close', () => {
      next()
    })

    // If we're not muxed yet, add listeners
    connectionFSM.once('muxed', () => {
      this.blackListCount = 0 // reset blacklisting on good connections
      queuedDial.connection = connectionFSM
      createConnectionWithProtocol(queuedDial)
      next()
    })

    connectionFSM.once('unmuxed', () => {
      this.blackListCount = 0
      queuedDial.connection = connectionFSM
      createConnectionWithProtocol(queuedDial)
      next()
    })

    // If we have a new connection, start dialing
    if (didCreate) {
      connectionFSM.dial()
    }
  }
}

module.exports = Queue

//# sourceMappingURL=node_modules/libp2p-switch/src/dialer/queue.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-switch/src/dialer/queue.js",}],
[2469, {"async/queue":1163,"async/timeout":1171,"debug":1565,"interface-connection":1949,"once":2767,"pull-stream/pull":2950,"pull-stream/sources/empty":2960}, function (require, module, exports) {
'use strict'

const Connection = require('interface-connection').Connection
const pull = require('pull-stream/pull')
const empty = require('pull-stream/sources/empty')
const timeout = require('async/timeout')
const queue = require('async/queue')
const debug = require('debug')
const once = require('once')

const log = debug('libp2p:switch:dialer:queue')
log.error = debug('libp2p:switch:dialer:queue:error')

/**
 * Queue up the amount of dials to a given peer.
 */
class DialQueue {
  /**
   * Create a new dial queue.
   *
   * @param {number} limit
   * @param {number} dialTimeout
   */
  constructor (limit, dialTimeout) {
    this.dialTimeout = dialTimeout

    this.queue = queue((task, cb) => {
      this._doWork(task.transport, task.addr, task.token, cb)
    }, limit)
  }

  /**
   * The actual work done by the queue.
   *
   * @param {SwarmTransport} transport
   * @param {Multiaddr} addr
   * @param {CancelToken} token
   * @param {function(Error, Connection)} callback
   * @returns {void}
   * @private
   */
  _doWork (transport, addr, token, callback) {
    callback = once(callback)
    log('work:start')
    this._dialWithTimeout(transport, addr, (err, conn) => {
      if (err) {
        log.error(`${transport.constructor.name}:work`, err)
        return callback(err)
      }

      if (token.cancel) {
        log('work:cancel')
        // clean up already done dials
        pull(empty(), conn)
        // If we can close the connection, do it
        if (typeof conn.close === 'function') {
          return conn.close((_) => callback(null))
        }
        return callback(null)
      }

      // one is enough
      token.cancel = true

      log('work:success')

      const proxyConn = new Connection()
      proxyConn.setInnerConn(conn)
      callback(null, { multiaddr: addr, conn: conn })
    })
  }

  /**
   * Dial the given transport, timing out with the set timeout.
   *
   * @param {SwarmTransport} transport
   * @param {Multiaddr} addr
   * @param {function(Error, Connection)} callback
   * @returns {void}
   *
   * @private
   */
  _dialWithTimeout (transport, addr, callback) {
    timeout((cb) => {
      const conn = transport.dial(addr, (err) => {
        if (err) {
          return cb(err)
        }

        cb(null, conn)
      })
    }, this.dialTimeout)(callback)
  }

  /**
   * Add new work to the queue.
   *
   * @param {SwarmTransport} transport
   * @param {Multiaddr} addr
   * @param {CancelToken} token
   * @param {function(Error, Connection)} callback
   * @returns {void}
   */
  push (transport, addr, token, callback) {
    this.queue.push({ transport, addr, token }, callback)
  }
}

module.exports = DialQueue

//# sourceMappingURL=node_modules/libp2p-switch/src/limit-dialer/queue.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-switch/src/limit-dialer/queue.js",}],
[2706, {}, function (require, module, exports) {
'use strict'

exports = module.exports

exports.PROTOCOL_ID = '/multistream/1.0.0'

exports.errors = {
  MULTICODEC_NOT_SUPPORTED: 'ERR_MULTICODEC_NOT_SUPPORTED'
}

//# sourceMappingURL=node_modules/multistream-select/src/constants.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/constants.js",}],
[2711, {}, function (require, module, exports) {
'use strict'

/**
 * Match protocols exactly.
 *
 * @param {string} myProtocol
 * @param {string} senderProtocol
 * @param {function(Error, boolean)} callback
 * @returns {undefined}
 * @type {matchHandler}
 */
function matchExact (myProtocol, senderProtocol, callback) {
  const result = myProtocol === senderProtocol
  callback(null, result)
}

module.exports = matchExact

//# sourceMappingURL=node_modules/multistream-select/src/listener/match-exact.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/listener/match-exact.js",}],
[2712, {"semver":2705}, function (require, module, exports) {
'use strict'

const semver = require('semver')

/**
 * Match protocols using semver `~` matching.
 *
 * @param {string} myProtocol
 * @param {string} senderProtocol
 * @param {function(Error, boolean)} callback
 * @returns {undefined}
 * @type {matchHandler}
 */
function matchSemver (myProtocol, senderProtocol, callback) {
  const mps = myProtocol.split('/')
  const sps = senderProtocol.split('/')
  const myName = mps[1]
  const myVersion = mps[2]

  const senderName = sps[1]
  const senderVersion = sps[2]

  if (myName !== senderName) {
    return callback(null, false)
  }
  // does my protocol satisfy the sender?
  const valid = semver.satisfies(myVersion, '~' + senderVersion)

  callback(null, valid)
}

module.exports = matchSemver

//# sourceMappingURL=node_modules/multistream-select/src/listener/match-semver.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/listener/match-semver.js",}],
[2707, {"../select":2714,"../util":2715,"./../constants":2706,"interface-connection":1949,"once":2767,"pull-length-prefixed":2931,"pull-stream/pull":2950,"pull-stream/sinks/collect":2951,"pull-stream/throughs/map":2972,"pull-stream/throughs/take":2974,"varint":3472}, function (require, module, exports) {
'use strict'

const varint = require('varint')
const pull = require('pull-stream/pull')
const map = require('pull-stream/throughs/map')
const collect = require('pull-stream/sinks/collect')
const take = require('pull-stream/throughs/take')
const pullLP = require('pull-length-prefixed')
const Connection = require('interface-connection').Connection
const util = require('../util')
const select = require('../select')
const once = require('once')

const PROTOCOL_ID = require('./../constants').PROTOCOL_ID

/**
 *
 */
class Dialer {
  /**
   * Create a new Dialer.
   */
  constructor () {
    this.conn = null
    this.log = util.log.dialer()
  }

  /**
   * Perform the multistream handshake.
   *
   * @param {Connection} rawConn - The connection on which
   * to perform the handshake.
   * @param {function(Error)} callback - Called when the handshake completed.
   * @returns {undefined}
   */
  handle (rawConn, callback) {
    this.log('dialer handle conn')
    callback = once(callback)
    const s = select(PROTOCOL_ID, (err, conn) => {
      if (err) {
        return callback(err)
      }
      this.log('handshake success')

      this.conn = new Connection(conn, rawConn)

      callback()
    }, this.log)

    // Handle unexpected errors from pull, like 'already piped'
    try {
      pull(
        rawConn,
        s,
        rawConn
      )
    } catch (err) {
      this.log.error(err)
      callback(err)
    }
  }

  /**
   * Select a protocol
   *
   * @param {string} protocol - A string of the protocol that we want to handshake.
   * @param {function(Error, Connection)} callback - `err` is
   * an error object that gets passed if something wrong happ
   * end (e.g: if the protocol selected is not supported by
   * the other end) and conn is the connection handshaked
   * with the other end.
   *
   * @returns {undefined}
   */
  select (protocol, callback) {
    this.log('dialer select ' + protocol)
    callback = once(callback)
    if (!this.conn) {
      return callback(new Error('multistream handshake has not finalized yet'))
    }

    const s = select(protocol, (err, conn) => {
      if (err) {
        this.conn = new Connection(conn, this.conn)
        return callback(err)
      }
      callback(null, new Connection(conn, this.conn))
    }, this.log)

    pull(
      this.conn,
      s,
      this.conn
    )
  }

  /**
   * List all available protocols.
   *
   * @param {function(Error, Array<string>)} callback - If
   * something wrong happend `Error` exists, otherwise
   * `protocols` is a list of the supported
   * protocols on the other end.
   *
   * @returns {undefined}
   */
  ls (callback) {
    callback = once(callback)

    const lsStream = select('ls', (err, conn) => {
      if (err) {
        return callback(err)
      }

      pull(
        conn,
        pullLP.decode(),
        collectLs(conn),
        map(stringify),
        collect((err, list) => {
          if (err) {
            return callback(err)
          }
          callback(null, list.slice(1))
        })
      )
    }, this.log)

    pull(
      this.conn,
      lsStream,
      this.conn
    )
  }
}

function stringify (buf) {
  return buf.toString().slice(0, -1)
}

function collectLs (conn) {
  let first = true
  let counter = 0

  return take((msg) => {
    if (first) {
      varint.decode(msg)
      counter = varint.decode(msg, varint.decode.bytes)
      return true
    }

    return counter-- > 0
  })
}

module.exports = Dialer

//# sourceMappingURL=node_modules/multistream-select/src/dialer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/dialer/index.js",}],
[2709, {"../select":2714,"./../constants":2706,"./../util":2715,"./ls-handler":2710,"./match-exact":2711,"./select-handler":2713,"assert":1095,"interface-connection":1949,"pull-stream/pull":2950}, function (require, module, exports) {
'use strict'

const pull = require('pull-stream/pull')
const assert = require('assert')
const select = require('../select')
const selectHandler = require('./select-handler')
const lsHandler = require('./ls-handler')
const matchExact = require('./match-exact')

const util = require('./../util')
const Connection = require('interface-connection').Connection

const PROTOCOL_ID = require('./../constants').PROTOCOL_ID

/**
 * Listener
 */
class Listener {
  /**
   * Create a new Listener.
   */
  constructor () {
    this.handlers = {
      ls: {
        handlerFunc: (protocol, conn) => lsHandler(this, conn),
        matchFunc: matchExact

      }
    }
    this.log = util.log.listener()
  }

  /**
   * Perform the multistream handshake.
   *
   * @param {Connection} rawConn - The connection on which
   * to perform the handshake.
   * @param {function(Error)} callback - Called when the handshake completed.
   * @returns {undefined}
   */
  handle (rawConn, callback) {
    this.log('listener handle conn')

    const selectStream = select(PROTOCOL_ID, (err, conn) => {
      if (err) {
        return callback(err)
      }

      const shConn = new Connection(conn, rawConn)

      const sh = selectHandler(shConn, this.handlers, this.log)

      pull(
        shConn,
        sh,
        shConn
      )

      callback()
    }, this.log)

    pull(
      rawConn,
      selectStream,
      rawConn
    )
  }

  /**
   * Handle a given `protocol`.
   *
   * @param {string} protocol - A string identifying the protocol.
   * @param {function(string, Connection)} handlerFunc - Will be called if there is a handshake performed on `protocol`.
   * @param {matchHandler} [matchFunc=matchExact]
   * @returns {undefined}
   */
  addHandler (protocol, handlerFunc, matchFunc) {
    this.log('adding handler: ' + protocol)
    assert(typeof handlerFunc === 'function', 'handler must be a function')

    if (this.handlers[protocol]) {
      this.log('overwriting handler for ' + protocol)
    }

    if (!matchFunc) {
      matchFunc = matchExact
    }

    this.handlers[protocol] = {
      handlerFunc: handlerFunc,
      matchFunc: matchFunc
    }
  }

  /**
   * Receives a protocol and a callback and should
   * call `callback(err, result)` where `err` is if
   * there was a error on the matching function, and
   * `result` is a boolean that represents if a
   * match happened.
   *
   * @callback matchHandler
   * @param {string} myProtocol
   * @param {string} senderProtocol
   * @param {function(Error, boolean)} callback
   * @returns {undefined}
   */
}

module.exports = Listener

//# sourceMappingURL=node_modules/multistream-select/src/listener/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/listener/index.js",}],
[2373, {"protons":2912}, function (require, module, exports) {
'use strict'

const protons = require('protons')
const schema = `
message Identify {
  // protocolVersion determines compatibility between peers
  optional string protocolVersion = 5; // e.g. ipfs/1.0.0

  // agentVersion is like a UserAgent string in browsers, or client version in bittorrent
  // includes the client name and client.
  optional string agentVersion = 6; // e.g. go-ipfs/0.1.0

  // publicKey is this node's public key (which also gives its node.ID)
  // - may not need to be sent, as secure channel implies it has been sent.
  // - then again, if we change / disable secure channel, may still want it.
  optional bytes publicKey = 1;

  // listenAddrs are the multiaddrs the sender node listens for open connections on
  repeated bytes listenAddrs = 2;

  // oservedAddr is the multiaddr of the remote endpoint that the sender node perceives
  // this is useful information to convey to the other side, as it helps the remote endpoint
  // determine whether its connection to the local peer goes through NAT.
  optional bytes observedAddr = 4;

  repeated string protocols = 3;
}
`

module.exports = protons(schema).Identify

//# sourceMappingURL=node_modules/libp2p-identify/src/message.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-identify/src/message.js",}],
[2372, {"./message":2373,"buffer":1428,"pull-length-prefixed":2931,"pull-stream/pull":2950,"pull-stream/sources/values":2966}, function (require, module, exports) {
(function (Buffer){
'use strict'

const pull = require('pull-stream/pull')
const values = require('pull-stream/sources/values')
const lp = require('pull-length-prefixed')

const msg = require('./message')

module.exports = (conn, pInfoSelf) => {
  // send what I see from the other + my Info
  conn.getObservedAddrs((err, observedAddrs) => {
    if (err) { return }
    observedAddrs = observedAddrs[0]

    let publicKey = Buffer.alloc(0)
    if (pInfoSelf.id.pubKey) {
      publicKey = pInfoSelf.id.pubKey.bytes
    }

    const msgSend = msg.encode({
      protocolVersion: 'ipfs/0.1.0',
      agentVersion: 'na',
      publicKey: publicKey,
      listenAddrs: pInfoSelf.multiaddrs.toArray().map((ma) => ma.buffer),
      observedAddr: observedAddrs ? observedAddrs.buffer : Buffer.from(''),
      protocols: Array.from(pInfoSelf.protocols)
    })

    pull(
      values([msgSend]),
      lp.encode(),
      conn
    )
  })
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-identify/src/listener.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-identify/src/listener.js",}],
[2370, {"./message":2373,"multiaddr":2681,"peer-id":2883,"peer-info":2884,"pull-length-prefixed":2931,"pull-stream/pull":2950,"pull-stream/sinks/collect":2951,"pull-stream/throughs/take":2974}, function (require, module, exports) {
'use strict'
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const pull = require('pull-stream/pull')
const take = require('pull-stream/throughs/take')
const collect = require('pull-stream/sinks/collect')
const lp = require('pull-length-prefixed')

const msg = require('./message')

module.exports = (conn, expectedPeerInfo, callback) => {
  if (typeof expectedPeerInfo === 'function') {
    callback = expectedPeerInfo
    expectedPeerInfo = null
    console.warn('WARNING: no expected peer info was given, identify will not be able to verify peer integrity')
  }

  pull(
    conn,
    lp.decode(),
    take(1),
    collect((err, data) => {
      if (err) {
        return callback(err)
      }

      // connection got closed graciously
      if (data.length === 0) {
        return callback(new Error('conn was closed, did not receive data'))
      }

      const input = msg.decode(data[0])

      PeerId.createFromPubKey(input.publicKey, (err, id) => {
        if (err) {
          return callback(err)
        }

        const peerInfo = new PeerInfo(id)
        if (expectedPeerInfo && expectedPeerInfo.id.toB58String() !== id.toB58String()) {
          return callback(new Error('invalid peer'))
        }

        try {
          input.listenAddrs
            .map(multiaddr)
            .forEach((ma) => peerInfo.multiaddrs.add(ma))
        } catch (err) {
          return callback(err)
        }

        let observedAddr

        try {
          observedAddr = getObservedAddrs(input)
        } catch (err) {
          return callback(err)
        }

        // Copy the protocols
        peerInfo.protocols = new Set(input.protocols)

        callback(null, peerInfo, observedAddr)
      })
    })
  )
}

function getObservedAddrs (input) {
  if (!hasObservedAddr(input)) {
    return []
  }

  let addrs = input.observedAddr

  if (!Array.isArray(addrs)) {
    addrs = [addrs]
  }

  return addrs.map((oa) => multiaddr(oa))
}

function hasObservedAddr (input) {
  return input.observedAddr && input.observedAddr.length > 0
}

//# sourceMappingURL=node_modules/libp2p-identify/src/dialer.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-identify/src/dialer.js",}],
[2329, {"../protocol":2333,"multiaddr":2681,"peer-id":2883,"peer-info":2884}, function (require, module, exports) {
'use strict'

const multiaddr = require('multiaddr')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const proto = require('../protocol')

module.exports = function (swarm) {
  /**
   * Get b58 string from multiaddr or peerinfo
   *
   * @param {Multiaddr|PeerInfo} peer
   * @return {*}
   */
  function getB58String (peer) {
    let b58Id = null
    if (multiaddr.isMultiaddr(peer)) {
      const relayMa = multiaddr(peer)
      b58Id = relayMa.getPeerId()
    } else if (PeerInfo.isPeerInfo(peer)) {
      b58Id = peer.id.toB58String()
    }

    return b58Id
  }

  /**
   * Helper to make a peer info from a multiaddrs
   *
   * @param {Multiaddr|PeerInfo|PeerId} ma
   * @param {Swarm} swarm
   * @return {PeerInfo}
   * @private
   */
  // TODO: this is ripped off of libp2p, should probably be a generally available util function
  function peerInfoFromMa (peer) {
    let p
    // PeerInfo
    if (PeerInfo.isPeerInfo(peer)) {
      p = peer
      // Multiaddr instance (not string)
    } else if (multiaddr.isMultiaddr(peer)) {
      const peerIdB58Str = peer.getPeerId()
      try {
        p = swarm._peerBook.get(peerIdB58Str)
      } catch (err) {
        p = new PeerInfo(PeerId.createFromB58String(peerIdB58Str))
      }
      p.multiaddrs.add(peer)
      // PeerId
    } else if (PeerId.isPeerId(peer)) {
      const peerIdB58Str = peer.toB58String()
      p = swarm._peerBook.has(peerIdB58Str) ? swarm._peerBook.get(peerIdB58Str) : peer
    }

    return p
  }

  /**
   * Checks if peer has an existing connection
   *
   * @param {String} peerId
   * @param {Swarm} swarm
   * @return {Boolean}
   */
  function isPeerConnected (peerId) {
    return swarm.muxedConns[peerId] || swarm.conns[peerId]
  }

  /**
   * Write a response
   *
   * @param {StreamHandler} streamHandler
   * @param {CircuitRelay.Status} status
   * @param {Function} cb
   * @returns {*}
   */
  function writeResponse (streamHandler, status, cb) {
    cb = cb || (() => {})
    streamHandler.write(proto.CircuitRelay.encode({
      type: proto.CircuitRelay.Type.STATUS,
      code: status
    }))
    return cb()
  }

  /**
   * Validate incomming HOP/STOP message
   *
   * @param {CircuitRelay} msg
   * @param {StreamHandler} streamHandler
   * @param {CircuitRelay.Type} type
   * @returns {*}
   * @param {Function} cb
   */
  function validateAddrs (msg, streamHandler, type, cb) {
    try {
      msg.dstPeer.addrs.forEach((addr) => {
        return multiaddr(addr)
      })
    } catch (err) {
      writeResponse(streamHandler, type === proto.CircuitRelay.Type.HOP
        ? proto.CircuitRelay.Status.HOP_DST_MULTIADDR_INVALID
        : proto.CircuitRelay.Status.STOP_DST_MULTIADDR_INVALID)
      return cb(err)
    }

    try {
      msg.srcPeer.addrs.forEach((addr) => {
        return multiaddr(addr)
      })
    } catch (err) {
      writeResponse(streamHandler, type === proto.CircuitRelay.Type.HOP
        ? proto.CircuitRelay.Status.HOP_SRC_MULTIADDR_INVALID
        : proto.CircuitRelay.Status.STOP_SRC_MULTIADDR_INVALID)
      return cb(err)
    }

    return cb(null)
  }

  function peerIdFromId (id) {
    if (typeof id === 'string') {
      return PeerId.createFromB58String(id)
    }

    return PeerId.createFromBytes(id)
  }

  return {
    getB58String,
    peerInfoFromMa,
    isPeerConnected,
    validateAddrs,
    writeResponse,
    peerIdFromId
  }
}

//# sourceMappingURL=node_modules/libp2p-circuit/src/circuit/utils.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/circuit/utils.js",}],
[2325, {"../multicodec":2332,"../protocol":2333,"./stream-handler":2328,"./utils":2329,"async/setImmediate":1167,"async/waterfall":1173,"debug":1565,"interface-connection":1949,"multiaddr":2681,"once":2767,"peer-id":2883}, function (require, module, exports) {
'use strict'

const once = require('once')
const PeerId = require('peer-id')
const waterfall = require('async/waterfall')
const setImmediate = require('async/setImmediate')
const multiaddr = require('multiaddr')

const Connection = require('interface-connection').Connection

const utilsFactory = require('./utils')
const StreamHandler = require('./stream-handler')

const debug = require('debug')
const log = debug('libp2p:circuit:dialer')
log.err = debug('libp2p:circuit:error:dialer')

const multicodec = require('../multicodec')
const proto = require('../protocol')

class Dialer {
  /**
   * Creates an instance of Dialer.
   * @param {Swarm} swarm - the swarm
   * @param {any} options - config options
   *
   * @memberOf Dialer
   */
  constructor (swarm, options) {
    this.swarm = swarm
    this.relayPeers = new Map()
    this.relayConns = new Map()
    this.options = options
    this.utils = utilsFactory(swarm)
  }

  /**
   * Helper that returns a relay connection
   *
   * @param {*} relay
   * @param {*} callback
   * @returns {Function} - callback
   */
  _dialRelayHelper (relay, callback) {
    if (this.relayConns.has(relay.id.toB58String())) {
      return callback(null, this.relayConns.get(relay.id.toB58String()))
    }

    return this._dialRelay(relay, callback)
  }

  /**
   * Dial a peer over a relay
   *
   * @param {multiaddr} ma - the multiaddr of the peer to dial
   * @param {Function} cb - a callback called once dialed
   * @returns {Connection} - the connection
   *
   */
  dial (ma, cb) {
    cb = cb || (() => { })
    const strMa = ma.toString()
    if (!strMa.includes('/p2p-circuit')) {
      log.err('invalid circuit address')
      return cb(new Error('invalid circuit address'))
    }

    const addr = strMa.split('p2p-circuit') // extract relay address if any
    const relay = addr[0] === '/' ? null : multiaddr(addr[0])
    const peer = multiaddr(addr[1] || addr[0])

    const dstConn = new Connection()
    setImmediate(
      this._dialPeer.bind(this),
      peer,
      relay,
      (err, conn) => {
        if (err) {
          log.err(err)
          return cb(err)
        }

        dstConn.setInnerConn(conn)
        cb(null, dstConn)
      })

    return dstConn
  }

  /**
   * Does the peer support the HOP protocol
   *
   * @param {PeerInfo} peer
   * @param {Function} callback
   * @returns {void}
   */
  canHop (peer, callback) {
    callback = once(callback || (() => { }))

    this._dialRelayHelper(peer, (err, conn) => {
      if (err) {
        return callback(err)
      }

      const sh = new StreamHandler(conn)
      waterfall([
        (cb) => sh.write(proto.CircuitRelay.encode({
          type: proto.CircuitRelay.Type.CAN_HOP
        }), cb),
        (cb) => sh.read(cb)
      ], (err, msg) => {
        if (err) {
          return callback(err)
        }
        const response = proto.CircuitRelay.decode(msg)

        if (response.code !== proto.CircuitRelay.Status.SUCCESS) {
          const err = new Error(`HOP not supported, skipping - ${this.utils.getB58String(peer)}`)
          log(err)
          return callback(err)
        }

        log('HOP supported adding as relay - %s', this.utils.getB58String(peer))
        this.relayPeers.set(this.utils.getB58String(peer), peer)
        sh.close()
        callback()
      })
    })
  }

  /**
   * Dial the destination peer over a relay
   *
   * @param {multiaddr} dstMa
   * @param {Connection|PeerInfo} relay
   * @param {Function} cb
   * @return {Function|void}
   * @private
   */
  _dialPeer (dstMa, relay, cb) {
    if (typeof relay === 'function') {
      cb = relay
      relay = null
    }

    if (!cb) {
      cb = () => {}
    }

    dstMa = multiaddr(dstMa)
    // if no relay provided, dial on all available relays until one succeeds
    if (!relay) {
      const relays = Array.from(this.relayPeers.values())
      let next = (nextRelay) => {
        if (!nextRelay) {
          let err = `no relay peers were found or all relays failed to dial`
          log.err(err)
          return cb(err)
        }

        return this._negotiateRelay(
          nextRelay,
          dstMa,
          (err, conn) => {
            if (err) {
              log.err(err)
              return next(relays.shift())
            }
            cb(null, conn)
          })
      }
      next(relays.shift())
    } else {
      return this._negotiateRelay(
        relay,
        dstMa,
        (err, conn) => {
          if (err) {
            log.err('An error has occurred negotiating the relay connection', err)
            return cb(err)
          }

          return cb(null, conn)
        })
    }
  }

  /**
   * Negotiate the relay connection
   *
   * @param {Multiaddr|PeerInfo|Connection} relay - the Connection or PeerInfo of the relay
   * @param {multiaddr} dstMa - the multiaddr of the peer to relay the connection for
   * @param {Function} callback - a callback which gets the negotiated relay connection
   * @returns {void}
   * @private
   *
   * @memberOf Dialer
   */
  _negotiateRelay (relay, dstMa, callback) {
    dstMa = multiaddr(dstMa)
    relay = this.utils.peerInfoFromMa(relay)
    const srcMas = this.swarm._peerInfo.multiaddrs.toArray()
    this._dialRelayHelper(relay, (err, conn) => {
      if (err) {
        log.err(err)
        return callback(err)
      }
      let sh = new StreamHandler(conn)
      waterfall([
        (cb) => {
          log('negotiating relay for peer %s', dstMa.getPeerId())
          let dstPeerId
          try {
            dstPeerId = PeerId.createFromB58String(dstMa.getPeerId()).id
          } catch (err) {
            return cb(err)
          }
          sh.write(
            proto.CircuitRelay.encode({
              type: proto.CircuitRelay.Type.HOP,
              srcPeer: {
                id: this.swarm._peerInfo.id.id,
                addrs: srcMas.map((addr) => addr.buffer)
              },
              dstPeer: {
                id: dstPeerId,
                addrs: [dstMa.buffer]
              }
            }), cb)
        },
        (cb) => sh.read(cb)
      ], (err, msg) => {
        if (err) {
          return callback(err)
        }
        const message = proto.CircuitRelay.decode(msg)
        if (message.type !== proto.CircuitRelay.Type.STATUS) {
          return callback(new Error(`Got invalid message type - ` +
            `expected ${proto.CircuitRelay.Type.STATUS} got ${message.type}`))
        }

        if (message.code !== proto.CircuitRelay.Status.SUCCESS) {
          return callback(new Error(`Got ${message.code} error code trying to dial over relay`))
        }

        callback(null, new Connection(sh.rest()))
      })
    })
  }

  /**
   * Dial a relay peer by its PeerInfo
   *
   * @param {PeerInfo} peer - the PeerInfo of the relay peer
   * @param {Function} cb - a callback with the connection to the relay peer
   * @returns {void}
   * @private
   */
  _dialRelay (peer, cb) {
    cb = once(cb || (() => { }))

    this.swarm.dial(
      peer,
      multicodec.relay,
      once((err, conn) => {
        if (err) {
          log.err(err)
          return cb(err)
        }
        cb(null, conn)
      }))
  }
}

module.exports = Dialer

//# sourceMappingURL=node_modules/libp2p-circuit/src/circuit/dialer.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/circuit/dialer.js",}],
[2331, {"./circuit/hop":2326,"./circuit/stop":2327,"./circuit/stream-handler":2328,"./circuit/utils":2329,"./multicodec":2332,"./protocol":2333,"async/setImmediate":1167,"debug":1565,"events":1429,"mafmt":2663,"multiaddr":2681}, function (require, module, exports) {
'use strict'

const setImmediate = require('async/setImmediate')

const multicodec = require('./multicodec')
const EE = require('events').EventEmitter
const multiaddr = require('multiaddr')
const mafmt = require('mafmt')
const Stop = require('./circuit/stop')
const Hop = require('./circuit/hop')
const proto = require('./protocol')
const utilsFactory = require('./circuit/utils')

const StreamHandler = require('./circuit/stream-handler')

const debug = require('debug')

const log = debug('libp2p:circuit:listener')
log.err = debug('libp2p:circuit:error:listener')

module.exports = (swarm, options, connHandler) => {
  const listener = new EE()
  const utils = utilsFactory(swarm)

  listener.stopHandler = new Stop(swarm)
  listener.stopHandler.on('connection', (conn) => listener.emit('connection', conn))
  listener.hopHandler = new Hop(swarm, options.hop)

  /**
   * Add swarm handler and listen for incoming connections
   *
   * @param {Multiaddr} ma
   * @param {Function} callback
   * @return {void}
   */
  listener.listen = (ma, callback) => {
    callback = callback || (() => {})

    swarm.handle(multicodec.relay, (_, conn) => {
      const sh = new StreamHandler(conn)

      sh.read((err, msg) => {
        if (err) {
          log.err(err)
          return
        }

        let request = null
        try {
          request = proto.CircuitRelay.decode(msg)
        } catch (err) {
          return utils.writeResponse(
            sh,
            proto.CircuitRelay.Status.MALFORMED_MESSAGE)
        }

        switch (request.type) {
          case proto.CircuitRelay.Type.CAN_HOP:
          case proto.CircuitRelay.Type.HOP: {
            return listener.hopHandler.handle(request, sh)
          }

          case proto.CircuitRelay.Type.STOP: {
            return listener.stopHandler.handle(request, sh, connHandler)
          }

          default: {
            utils.writeResponse(
              sh,
              proto.CircuitRelay.Status.INVALID_MSG_TYPE)
            return sh.close()
          }
        }
      })
    })

    setImmediate(() => listener.emit('listen'))
    callback()
  }

  /**
   * Remove swarm listener
   *
   * @param {Function} cb
   * @return {void}
   */
  listener.close = (cb) => {
    swarm.unhandle(multicodec.relay)
    setImmediate(() => listener.emit('close'))
    cb()
  }

  /**
   * Get fixed up multiaddrs
   *
   * NOTE: This method will grab the peers multiaddrs and expand them such that:
   *
   * a) If it's an existing /p2p-circuit address for a specific relay i.e.
   *    `/ip4/0.0.0.0/tcp/0/ipfs/QmRelay/p2p-circuit` this method will expand the
   *    address to `/ip4/0.0.0.0/tcp/0/ipfs/QmRelay/p2p-circuit/ipfs/QmPeer` where
   *    `QmPeer` is this peers id
   * b) If it's not a /p2p-circuit address, it will encapsulate the address as a /p2p-circuit
   *    addr, such when dialing over a relay with this address, it will create the circuit using
   *    the encapsulated transport address. This is useful when for example, a peer should only
   *    be dialed over TCP rather than any other transport
   *
   * @param {Function} callback
   * @return {void}
   */
  listener.getAddrs = (callback) => {
    let addrs = swarm._peerInfo.multiaddrs.toArray()

    // get all the explicit relay addrs excluding self
    let p2pAddrs = addrs.filter((addr) => {
      return mafmt.Circuit.matches(addr) &&
        !addr.toString().includes(swarm._peerInfo.id.toB58String())
    })

    // use the explicit relays instead of any relay
    if (p2pAddrs.length) {
      addrs = p2pAddrs
    }

    let listenAddrs = []
    addrs.forEach((addr) => {
      const peerMa = `/p2p-circuit/ipfs/${swarm._peerInfo.id.toB58String()}`
      if (addr.toString() === peerMa) {
        listenAddrs.push(multiaddr(peerMa))
        return
      }

      if (!mafmt.Circuit.matches(addr)) {
        if (addr.getPeerId()) {
          // by default we're reachable over any relay
          listenAddrs.push(multiaddr(`/p2p-circuit`).encapsulate(addr))
        } else {
          const ma = `${addr}/ipfs/${swarm._peerInfo.id.toB58String()}`
          listenAddrs.push(multiaddr(`/p2p-circuit`).encapsulate(ma))
        }
      } else {
        listenAddrs.push(addr.encapsulate(`/ipfs/${swarm._peerInfo.id.toB58String()}`))
      }
    })

    callback(null, listenAddrs)
  }

  return listener
}

//# sourceMappingURL=node_modules/libp2p-circuit/src/listener.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/listener.js",}],
[1568, {"buffer":1428}, function (require, module, exports) {
(function (Buffer){
/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2018 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

function isSpecificValue(val) {
	return (
		val instanceof Buffer
		|| val instanceof Date
		|| val instanceof RegExp
	) ? true : false;
}

function cloneSpecificValue(val) {
	if (val instanceof Buffer) {
		var x = Buffer.alloc
			? Buffer.alloc(val.length)
			: new Buffer(val.length);
		val.copy(x);
		return x;
	} else if (val instanceof Date) {
		return new Date(val.getTime());
	} else if (val instanceof RegExp) {
		return new RegExp(val);
	} else {
		throw new Error('Unexpected situation');
	}
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
	var clone = [];
	arr.forEach(function (item, index) {
		if (typeof item === 'object' && item !== null) {
			if (Array.isArray(item)) {
				clone[index] = deepCloneArray(item);
			} else if (isSpecificValue(item)) {
				clone[index] = cloneSpecificValue(item);
			} else {
				clone[index] = deepExtend({}, item);
			}
		} else {
			clone[index] = item;
		}
	});
	return clone;
}

function safeGetProperty(object, property) {
	return property === '__proto__' ? undefined : object[property];
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = module.exports = function (/*obj_1, [obj_2], [obj_N]*/) {
	if (arguments.length < 1 || typeof arguments[0] !== 'object') {
		return false;
	}

	if (arguments.length < 2) {
		return arguments[0];
	}

	var target = arguments[0];

	// convert arguments to array and cut off target object
	var args = Array.prototype.slice.call(arguments, 1);

	var val, src, clone;

	args.forEach(function (obj) {
		// skip argument if isn't an object, is null, or is an array
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			return;
		}

		Object.keys(obj).forEach(function (key) {
			src = safeGetProperty(target, key); // source value
			val = safeGetProperty(obj, key); // new value

			// recursion prevention
			if (val === target) {
				return;

			/**
			 * if new value isn't object then just overwrite by new value
			 * instead of extending.
			 */
			} else if (typeof val !== 'object' || val === null) {
				target[key] = val;
				return;

			// just clone arrays (and recursive clone objects inside)
			} else if (Array.isArray(val)) {
				target[key] = deepCloneArray(val);
				return;

			// custom cloning and overwrite for specific objects
			} else if (isSpecificValue(val)) {
				target[key] = cloneSpecificValue(val);
				return;

			// overwrite by new value if source isn't object or array
			} else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
				target[key] = deepExtend({}, val);
				return;

			// source value and new value is objects both, extending...
			} else {
				target[key] = deepExtend(src, val);
				return;
			}
		});
	});

	return target;
};

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/deep-extend/lib/deep-extend.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/deep-extend/lib/deep-extend.js",}],
[1899, {"./bucket":1896}, function (require, module, exports) {
'use strict'

const Bucket = require('./bucket')

module.exports = function createHAMT (options) {
  return new Bucket(options)
}

module.exports.isBucket = Bucket.isBucket

//# sourceMappingURL=node_modules/hamt-sharding/src/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/hamt-sharding/src/index.js",}],
[1896, {"./consumable-hash":1898,"sparse-array":3339}, function (require, module, exports) {
'use strict'

const SparseArray = require('sparse-array')
const wrapHash = require('./consumable-hash')

const defaultOptions = {
  bits: 8
}

class Bucket {
  constructor (options, parent, posAtParent) {
    this._options = Object.assign({}, defaultOptions, options)
    this._popCount = 0
    this._parent = parent
    this._posAtParent = posAtParent

    if (!this._options.hashFn) {
      throw new Error('please define an options.hashFn')
    }

    // make sure we only wrap options.hashFn once in the whole tree
    if (!this._options.hash) {
      this._options.hash = wrapHash(this._options.hashFn)
    }
    this._children = new SparseArray()
  }

  static isBucket (o) {
    return o instanceof Bucket
  }

  async put (key, value) {
    const place = await this._findNewBucketAndPos(key)

    await place.bucket._putAt(place, key, value)
  }

  async get (key) {
    const child = await this._findChild(key)

    if (child) {
      return child.value
    }
  }

  async del (key) {
    const place = await this._findPlace(key)
    const child = place.bucket._at(place.pos)

    if (child && child.key === key) {
      place.bucket._delAt(place.pos)
    }
  }

  leafCount () {
    return this._children.compactArray().reduce((acc, child) => {
      if (child instanceof Bucket) {
        return acc + child.leafCount()
      }

      return acc + 1
    }, 0)
  }

  childrenCount () {
    return this._children.length
  }

  onlyChild () {
    return this._children.get(0)
  }

  * eachLeafSeries () {
    const children = this._children.compactArray()

    for (const child of children) {
      if (child instanceof Bucket) {
        for (const c2 of child.eachLeafSeries()) {
          yield c2
        }
      } else {
        yield child
      }
    }
  }

  serialize (map, reduce) {
    // serialize to a custom non-sparse representation
    return reduce(this._children.reduce((acc, child, index) => {
      if (child) {
        if (child instanceof Bucket) {
          acc.push(child.serialize(map, reduce))
        } else {
          acc.push(map(child, index))
        }
      }
      return acc
    }, []))
  }

  async asyncTransform (asyncMap, asyncReduce) {
    return asyncTransformBucket(this, asyncMap, asyncReduce)
  }

  toJSON () {
    return this.serialize(mapNode, reduceNodes)
  }

  prettyPrint () {
    return JSON.stringify(this.toJSON(), null, '  ')
  }

  tableSize () {
    return Math.pow(2, this._options.bits)
  }

  async _findChild (key) {
    const result = await this._findPlace(key)
    const child = result.bucket._at(result.pos)

    if (child && child.key === key) {
      return child
    }
  }

  async _findPlace (key) {
    const hashValue = this._options.hash(key)
    const index = await hashValue.take(this._options.bits)

    const child = this._children.get(index)

    if (child instanceof Bucket) {
      return child._findPlace(hashValue)
    }

    return {
      bucket: this,
      pos: index,
      hash: hashValue
    }
  }

  async _findNewBucketAndPos (key) {
    const place = await this._findPlace(key)
    const child = place.bucket._at(place.pos)

    if (child && child.key !== key) {
      // conflict

      const bucket = new Bucket(this._options, place.bucket, place.pos)
      place.bucket._putObjectAt(place.pos, bucket)

      // put the previous value
      const newPlace = await bucket._findPlace(child.hash)
      newPlace.bucket._putAt(newPlace, child.key, child.value)

      return bucket._findNewBucketAndPos(place.hash)
    }

    // no conflict, we found the place
    return place
  }

  _putAt (place, key, value) {
    this._putObjectAt(place.pos, {
      key: key,
      value: value,
      hash: place.hash
    })
  }

  _putObjectAt (pos, object) {
    if (!this._children.get(pos)) {
      this._popCount++
    }
    this._children.set(pos, object)
  }

  _delAt (pos) {
    if (this._children.get(pos)) {
      this._popCount--
    }
    this._children.unset(pos)
    this._level()
  }

  _level () {
    if (this._parent && this._popCount <= 1) {
      if (this._popCount === 1) {
        // remove myself from parent, replacing me with my only child
        const onlyChild = this._children.find(exists)

        if (!(onlyChild instanceof Bucket)) {
          const hash = onlyChild.hash
          hash.untake(this._options.bits)
          const place = {
            pos: this._posAtParent,
            hash: hash
          }
          this._parent._putAt(place, onlyChild.key, onlyChild.value)
        }
      } else {
        this._parent._delAt(this._posAtParent)
      }
    }
  }

  _at (index) {
    return this._children.get(index)
  }
}

function exists (o) {
  return Boolean(o)
}

function mapNode (node, index) {
  return node.key
}

function reduceNodes (nodes) {
  return nodes
}

async function asyncTransformBucket (bucket, asyncMap, asyncReduce) {
  const output = []

  for (const child of bucket._children.compactArray()) {
    if (child instanceof Bucket) {
      await asyncTransformBucket(child, asyncMap, asyncReduce)
    } else {
      const mappedChildren = await asyncMap(child)

      output.push({
        bitField: bucket._children.bitField(),
        children: mappedChildren
      })
    }

    return asyncReduce(output)
  }
}

module.exports = Bucket

//# sourceMappingURL=node_modules/hamt-sharding/src/bucket.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/hamt-sharding/src/bucket.js",}],
[2673, {}, function (require, module, exports) {

module.exports = {
  WORKER_REQUEST_READ_LOCK: 'lock:worker:request-read',
  WORKER_RELEASE_READ_LOCK: 'lock:worker:release-read',
  MASTER_GRANT_READ_LOCK: 'lock:master:grant-read',

  WORKER_REQUEST_WRITE_LOCK: 'lock:worker:request-write',
  WORKER_RELEASE_WRITE_LOCK: 'lock:worker:release-write',
  MASTER_GRANT_WRITE_LOCK: 'lock:master:grant-write'
}

//# sourceMappingURL=node_modules/mortice/lib/constants.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/mortice/lib/constants.js",}],
[3277, {"./lib/index":3281}, function (require, module, exports) {
'use strict';
module.exports = require('./lib/index');

//# sourceMappingURL=node_modules/shortid/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/index.js",}],
[2097, {"buffer":1428}, function (require, module, exports) {
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

//# sourceMappingURL=node_modules/ipfs-utils/node_modules/safe-buffer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/ipfs-utils/node_modules/safe-buffer/index.js",}],
[1097, {}, function (require, module, exports) {
'use strict'

async function * batch (source, size) {
  let things = []

  for await (const set of source) {
    things = things.concat(set)

    while (things.length >= size) {
      yield things.slice(0, size)

      things = things.slice(size)
    }
  }

  while (things.length) {
    yield things.slice(0, size)

    things = things.slice(size)
  }
}

module.exports = batch

//# sourceMappingURL=node_modules/async-iterator-batch/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/async-iterator-batch/index.js",}],
[1362, {"buffer":1428,"readable-stream":1377,"util":3459}, function (require, module, exports) {
(function (Buffer){
'use strict'
var DuplexStream = require('readable-stream').Duplex
  , util         = require('util')

function BufferList (callback) {
  if (!(this instanceof BufferList))
    return new BufferList(callback)

  this._bufs  = []
  this.length = 0

  if (typeof callback == 'function') {
    this._callback = callback

    var piper = function piper (err) {
      if (this._callback) {
        this._callback(err)
        this._callback = null
      }
    }.bind(this)

    this.on('pipe', function onPipe (src) {
      src.on('error', piper)
    })
    this.on('unpipe', function onUnpipe (src) {
      src.removeListener('error', piper)
    })
  } else {
    this.append(callback)
  }

  DuplexStream.call(this)
}


util.inherits(BufferList, DuplexStream)


BufferList.prototype._offset = function _offset (offset) {
  var tot = 0, i = 0, _t
  if (offset === 0) return [ 0, 0 ]
  for (; i < this._bufs.length; i++) {
    _t = tot + this._bufs[i].length
    if (offset < _t || i == this._bufs.length - 1) {
      return [ i, offset - tot ]
    }
    tot = _t
  }
}

BufferList.prototype._reverseOffset = function (blOffset) {
  var bufferId = blOffset[0]
  var offset = blOffset[1]
  for (var i = 0; i < bufferId; i++) {
    offset += this._bufs[i].length
  }
  return offset
}

BufferList.prototype.append = function append (buf) {
  var i = 0

  if (Buffer.isBuffer(buf)) {
    this._appendBuffer(buf)
  } else if (Array.isArray(buf)) {
    for (; i < buf.length; i++)
      this.append(buf[i])
  } else if (buf instanceof BufferList) {
    // unwrap argument into individual BufferLists
    for (; i < buf._bufs.length; i++)
      this.append(buf._bufs[i])
  } else if (buf != null) {
    // coerce number arguments to strings, since Buffer(number) does
    // uninitialized memory allocation
    if (typeof buf == 'number')
      buf = buf.toString()

    this._appendBuffer(Buffer.from(buf))
  }

  return this
}


BufferList.prototype._appendBuffer = function appendBuffer (buf) {
  this._bufs.push(buf)
  this.length += buf.length
}


BufferList.prototype._write = function _write (buf, encoding, callback) {
  this._appendBuffer(buf)

  if (typeof callback == 'function')
    callback()
}


BufferList.prototype._read = function _read (size) {
  if (!this.length)
    return this.push(null)

  size = Math.min(size, this.length)
  this.push(this.slice(0, size))
  this.consume(size)
}


BufferList.prototype.end = function end (chunk) {
  DuplexStream.prototype.end.call(this, chunk)

  if (this._callback) {
    this._callback(null, this.slice())
    this._callback = null
  }
}


BufferList.prototype.get = function get (index) {
  if (index > this.length || index < 0) {
    return undefined
  }
  var offset = this._offset(index)
  return this._bufs[offset[0]][offset[1]]
}


BufferList.prototype.slice = function slice (start, end) {
  if (typeof start == 'number' && start < 0)
    start += this.length
  if (typeof end == 'number' && end < 0)
    end += this.length
  return this.copy(null, 0, start, end)
}


BufferList.prototype.copy = function copy (dst, dstStart, srcStart, srcEnd) {
  if (typeof srcStart != 'number' || srcStart < 0)
    srcStart = 0
  if (typeof srcEnd != 'number' || srcEnd > this.length)
    srcEnd = this.length
  if (srcStart >= this.length)
    return dst || Buffer.alloc(0)
  if (srcEnd <= 0)
    return dst || Buffer.alloc(0)

  var copy   = !!dst
    , off    = this._offset(srcStart)
    , len    = srcEnd - srcStart
    , bytes  = len
    , bufoff = (copy && dstStart) || 0
    , start  = off[1]
    , l
    , i

  // copy/slice everything
  if (srcStart === 0 && srcEnd == this.length) {
    if (!copy) { // slice, but full concat if multiple buffers
      return this._bufs.length === 1
        ? this._bufs[0]
        : Buffer.concat(this._bufs, this.length)
    }

    // copy, need to copy individual buffers
    for (i = 0; i < this._bufs.length; i++) {
      this._bufs[i].copy(dst, bufoff)
      bufoff += this._bufs[i].length
    }

    return dst
  }

  // easy, cheap case where it's a subset of one of the buffers
  if (bytes <= this._bufs[off[0]].length - start) {
    return copy
      ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes)
      : this._bufs[off[0]].slice(start, start + bytes)
  }

  if (!copy) // a slice, we need something to copy in to
    dst = Buffer.allocUnsafe(len)

  for (i = off[0]; i < this._bufs.length; i++) {
    l = this._bufs[i].length - start

    if (bytes > l) {
      this._bufs[i].copy(dst, bufoff, start)
      bufoff += l
    } else {
      this._bufs[i].copy(dst, bufoff, start, start + bytes)
      bufoff += l
      break
    }

    bytes -= l

    if (start)
      start = 0
  }

  // safeguard so that we don't return uninitialized memory
  if (dst.length > bufoff) return dst.slice(0, bufoff)

  return dst
}

BufferList.prototype.shallowSlice = function shallowSlice (start, end) {
  start = start || 0
  end = typeof end !== 'number' ? this.length : end

  if (start < 0)
    start += this.length
  if (end < 0)
    end += this.length

  if (start === end) {
    return new BufferList()
  }
  var startOffset = this._offset(start)
    , endOffset = this._offset(end)
    , buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1)

  if (endOffset[1] == 0)
    buffers.pop()
  else
    buffers[buffers.length-1] = buffers[buffers.length-1].slice(0, endOffset[1])

  if (startOffset[1] != 0)
    buffers[0] = buffers[0].slice(startOffset[1])

  return new BufferList(buffers)
}

BufferList.prototype.toString = function toString (encoding, start, end) {
  return this.slice(start, end).toString(encoding)
}

BufferList.prototype.consume = function consume (bytes) {
  // first, normalize the argument, in accordance with how Buffer does it
  bytes = Math.trunc(bytes)
  // do nothing if not a positive number
  if (Number.isNaN(bytes) || bytes <= 0) return this

  while (this._bufs.length) {
    if (bytes >= this._bufs[0].length) {
      bytes -= this._bufs[0].length
      this.length -= this._bufs[0].length
      this._bufs.shift()
    } else {
      this._bufs[0] = this._bufs[0].slice(bytes)
      this.length -= bytes
      break
    }
  }
  return this
}


BufferList.prototype.duplicate = function duplicate () {
  var i = 0
    , copy = new BufferList()

  for (; i < this._bufs.length; i++)
    copy.append(this._bufs[i])

  return copy
}


BufferList.prototype._destroy = function _destroy (err, cb) {
  this._bufs.length = 0
  this.length = 0
  cb(err)
}


BufferList.prototype.indexOf = function (search, offset, encoding) {
  if (encoding === undefined && typeof offset === 'string') {
    encoding = offset
    offset = undefined
  }
  if (typeof search === 'function' || Array.isArray(search)) {
    throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.')
  } else if (typeof search === 'number') {
      search = Buffer.from([search])
  } else if (typeof search === 'string') {
    search = Buffer.from(search, encoding)
  } else if (search instanceof BufferList) {
    search = search.slice()
  } else if (!Buffer.isBuffer(search)) {
    search = Buffer.from(search)
  }

  offset = Number(offset || 0)
  if (isNaN(offset)) {
    offset = 0
  }

  if (offset < 0) {
    offset = this.length + offset
  }

  if (offset < 0) {
    offset = 0
  }

  if (search.length === 0) {
    return offset > this.length ? this.length : offset
  }

  var blOffset = this._offset(offset)
  var blIndex = blOffset[0] // index of which internal buffer we're working on
  var buffOffset = blOffset[1] // offset of the internal buffer we're working on

  // scan over each buffer
  for (blIndex; blIndex < this._bufs.length; blIndex++) {
    var buff = this._bufs[blIndex]
    while(buffOffset < buff.length) {
      var availableWindow = buff.length - buffOffset
      if (availableWindow >= search.length) {
        var nativeSearchResult = buff.indexOf(search, buffOffset)
        if (nativeSearchResult !== -1) {
          return this._reverseOffset([blIndex, nativeSearchResult])
        }
        buffOffset = buff.length - search.length + 1 // end of native search window
      } else {
        var revOffset = this._reverseOffset([blIndex, buffOffset])
        if (this._match(revOffset, search)) {
          return revOffset
        }
        buffOffset++
      }
    }
    buffOffset = 0
  }
  return -1
}

BufferList.prototype._match = function(offset, search) {
  if (this.length - offset < search.length) {
    return false
  }
  for (var searchOffset = 0; searchOffset < search.length ; searchOffset++) {
    if(this.get(offset + searchOffset) !== search[searchOffset]){
      return false
    }
  }
  return true
}


;(function () {
  var methods = {
      'readDoubleBE' : 8
    , 'readDoubleLE' : 8
    , 'readFloatBE'  : 4
    , 'readFloatLE'  : 4
    , 'readInt32BE'  : 4
    , 'readInt32LE'  : 4
    , 'readUInt32BE' : 4
    , 'readUInt32LE' : 4
    , 'readInt16BE'  : 2
    , 'readInt16LE'  : 2
    , 'readUInt16BE' : 2
    , 'readUInt16LE' : 2
    , 'readInt8'     : 1
    , 'readUInt8'    : 1
    , 'readIntBE'    : null
    , 'readIntLE'    : null
    , 'readUIntBE'   : null
    , 'readUIntLE'   : null
  }

  for (var m in methods) {
    (function (m) {
      if (methods[m] === null) {
        BufferList.prototype[m] = function (offset, byteLength) {
          return this.slice(offset, offset + byteLength)[m](0, byteLength)
        }
      }
      else {
        BufferList.prototype[m] = function (offset) {
          return this.slice(offset, offset + methods[m])[m](0)
        }
      }
    }(m))
  }
}())


module.exports = BufferList

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/bl/bl.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/bl.js",}],
[2998, {"../dist/rabin-wasm.node.js":2997,"./rabin":2999}, function (require, module, exports) {
const Rabin = require('./rabin')
const getRabin = require('../dist/rabin-wasm.node.js')

const create = async (bits, min, max, windowSize) => {
    const compiled = await getRabin()

    return new Rabin(bits, min, max, windowSize, compiled)
}

module.exports = {
    Rabin,
    create
}

//# sourceMappingURL=node_modules/rabin-wasm/src/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/rabin-wasm/src/index.js",}],
[1542, {}, function (require, module, exports) {
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;

//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/errors-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/errors-browser.js",}],
[1555, {"events":1429}, function (require, module, exports) {
module.exports = require('events').EventEmitter;

//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/stream-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/stream-browser.js",}],
[1554, {"../../../errors":1542}, function (require, module, exports) {
'use strict';

var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

module.exports = {
  getHighWaterMark: getHighWaterMark
};
//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/state.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/state.js",}],
[1550, {"_process":2892}, function (require, module, exports) {
(function (process){
'use strict'; // undocumented cb() API, needed for core, not for public API

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
}).call(this,require('_process'))

//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/destroy.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/destroy.js",}],
[1552, {}, function (require, module, exports) {
module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};

//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/from-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/from-browser.js",}],
[1549, {"buffer":1428,"util":1398}, function (require, module, exports) {
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('buffer'),
    Buffer = _require.Buffer;

var _require2 = require('util'),
    inspect = _require2.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}

module.exports =
/*#__PURE__*/
function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();
//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/buffer_list.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/buffer_list.js",}],
[1548, {"./end-of-stream":1551,"_process":2892}, function (require, module, exports) {
(function (process){
'use strict';

var _Object$setPrototypeO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var finished = require('./end-of-stream');

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

module.exports = createReadableStreamAsyncIterator;
}).call(this,require('_process'))

//# sourceMappingURL=node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/async_iterator.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/readable-stream/lib/internal/streams/async_iterator.js",}],
[1558, {"safe-buffer":1557}, function (require, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
//# sourceMappingURL=node_modules/datastore-level/node_modules/string_decoder/lib/string_decoder.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/string_decoder/lib/string_decoder.js",}],
[2736, {"./forge":2731,"./util":2753}, function (require, module, exports) {
/**
 * Javascript implementation of mask generation function MGF1.
 *
 * @author Stefan Siegl
 * @author Dave Longley
 *
 * Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
 * Copyright (c) 2014 Digital Bazaar, Inc.
 */
var forge = require('./forge');
require('./util');

forge.mgf = forge.mgf || {};
var mgf1 = module.exports = forge.mgf.mgf1 = forge.mgf1 = forge.mgf1 || {};

/**
 * Creates a MGF1 mask generation function object.
 *
 * @param md the message digest API to use (eg: forge.md.sha1.create()).
 *
 * @return a mask generation function object.
 */
mgf1.create = function(md) {
  var mgf = {
    /**
     * Generate mask of specified length.
     *
     * @param {String} seed The seed for mask generation.
     * @param maskLen Number of bytes to generate.
     * @return {String} The generated mask.
     */
    generate: function(seed, maskLen) {
      /* 2. Let T be the empty octet string. */
      var t = new forge.util.ByteBuffer();

      /* 3. For counter from 0 to ceil(maskLen / hLen), do the following: */
      var len = Math.ceil(maskLen / md.digestLength);
      for(var i = 0; i < len; i++) {
        /* a. Convert counter to an octet string C of length 4 octets */
        var c = new forge.util.ByteBuffer();
        c.putInt32(i);

        /* b. Concatenate the hash of the seed mgfSeed and C to the octet
         * string T: */
        md.start();
        md.update(seed + c.getBytes());
        t.putBuffer(md.digest());
      }

      /* Output the leading maskLen octets of T as the octet string mask. */
      t.truncate(t.length() - maskLen);
      return t.getBytes();
    }
  };

  return mgf;
};

//# sourceMappingURL=node_modules/node-forge/lib/mgf1.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/node-forge/lib/mgf1.js",}],
[2426, {"./blake":2424,"./crypto-sha1-2":2425,"./utils":2428,"buffer":1428,"js-sha3":2423,"murmurhash3js":2719}, function (require, module, exports) {
(function (Buffer){
'use strict'

const sha3 = require('js-sha3')
const murmur3 = require('murmurhash3js')

const utils = require('./utils')
const sha = require('./crypto-sha1-2')

const toCallback = utils.toCallback
const toBuf = utils.toBuf
const fromString = utils.fromString
const fromNumberTo32BitBuf = utils.fromNumberTo32BitBuf

const dblSha2256 = (buf, cb) => {
  sha.sha2256(buf, (err, firstHash) => {
    if (err) {
      cb(err)
    }
    sha.sha2256((Buffer.from(firstHash)), cb)
  })
}

module.exports = {
  sha1: sha.sha1,
  sha2256: sha.sha2256,
  sha2512: sha.sha2512,
  sha3512: toCallback(toBuf(sha3.sha3_512)),
  sha3384: toCallback(toBuf(sha3.sha3_384)),
  sha3256: toCallback(toBuf(sha3.sha3_256)),
  sha3224: toCallback(toBuf(sha3.sha3_224)),
  shake128: toCallback(toBuf(sha3.shake_128, 128)),
  shake256: toCallback(toBuf(sha3.shake_256, 256)),
  keccak224: toCallback(toBuf(sha3.keccak_224)),
  keccak256: toCallback(toBuf(sha3.keccak_256)),
  keccak384: toCallback(toBuf(sha3.keccak_384)),
  keccak512: toCallback(toBuf(sha3.keccak_512)),
  murmur3128: toCallback(toBuf(fromString(murmur3.x64.hash128))),
  murmur332: toCallback(fromNumberTo32BitBuf(fromString(murmur3.x86.hash32))),
  addBlake: require('./blake'),
  dblSha2256: dblSha2256
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-record/node_modules/multihashing-async/src/crypto.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-record/node_modules/multihashing-async/src/crypto.js",}],
[1920, {"./lib/heap":1921}, function (require, module, exports) {
module.exports = require('./lib/heap');

//# sourceMappingURL=node_modules/heap/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/heap/index.js",}],
[2442, {"./blake":2440,"./crypto-sha1-2":2441,"./utils":2444,"buffer":1428,"js-sha3":2439,"murmurhash3js":2719}, function (require, module, exports) {
(function (Buffer){
'use strict'

const sha3 = require('js-sha3')
const murmur3 = require('murmurhash3js')

const utils = require('./utils')
const sha = require('./crypto-sha1-2')

const toCallback = utils.toCallback
const toBuf = utils.toBuf
const fromString = utils.fromString
const fromNumberTo32BitBuf = utils.fromNumberTo32BitBuf

const dblSha2256 = (buf, cb) => {
  sha.sha2256(buf, (err, firstHash) => {
    if (err) {
      cb(err)
    }
    sha.sha2256((Buffer.from(firstHash)), cb)
  })
}

module.exports = {
  sha1: sha.sha1,
  sha2256: sha.sha2256,
  sha2512: sha.sha2512,
  sha3512: toCallback(toBuf(sha3.sha3_512)),
  sha3384: toCallback(toBuf(sha3.sha3_384)),
  sha3256: toCallback(toBuf(sha3.sha3_256)),
  sha3224: toCallback(toBuf(sha3.sha3_224)),
  shake128: toCallback(toBuf(sha3.shake_128, 128)),
  shake256: toCallback(toBuf(sha3.shake_256, 256)),
  keccak224: toCallback(toBuf(sha3.keccak_224)),
  keccak256: toCallback(toBuf(sha3.keccak_256)),
  keccak384: toCallback(toBuf(sha3.keccak_384)),
  keccak512: toCallback(toBuf(sha3.keccak_512)),
  murmur3128: toCallback(toBuf(fromString(murmur3.x64.hash128))),
  murmur332: toCallback(fromNumberTo32BitBuf(fromString(murmur3.x86.hash32))),
  addBlake: require('./blake'),
  dblSha2256: dblSha2256
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-secio/node_modules/multihashing-async/src/crypto.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-secio/node_modules/multihashing-async/src/crypto.js",}],
[3322, {"ms":2677}, function (require, module, exports) {
"use strict";

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = require('ms');
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;


//# sourceMappingURL=node_modules/socket.io-pull-stream/node_modules/debug/src/common.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socket.io-pull-stream/node_modules/debug/src/common.js",}],
[3303, {"buffer":1428}, function (require, module, exports) {
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

//# sourceMappingURL=node_modules/simple-peer/node_modules/safe-buffer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/simple-peer/node_modules/safe-buffer/index.js",}],
[3320, {}, function (require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

//# sourceMappingURL=node_modules/socket.io-parser/node_modules/ms/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/socket.io-parser/node_modules/ms/index.js",}],
[1655, {}, function (require, module, exports) {

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

//# sourceMappingURL=node_modules/engine.io-parser/lib/keys.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-parser/lib/keys.js",}],
[1656, {}, function (require, module, exports) {
/*! https://mths.be/utf8js v2.1.2 by @mathias */

var stringFromCharCode = String.fromCharCode;

// Taken from https://mths.be/punycode
function ucs2decode(string) {
	var output = [];
	var counter = 0;
	var length = string.length;
	var value;
	var extra;
	while (counter < length) {
		value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// high surrogate, and there is a next character
			extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // low surrogate
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// unmatched surrogate; only append this code unit, in case the next
				// code unit is the high surrogate of a surrogate pair
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

// Taken from https://mths.be/punycode
function ucs2encode(array) {
	var length = array.length;
	var index = -1;
	var value;
	var output = '';
	while (++index < length) {
		value = array[index];
		if (value > 0xFFFF) {
			value -= 0x10000;
			output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
			value = 0xDC00 | value & 0x3FF;
		}
		output += stringFromCharCode(value);
	}
	return output;
}

function checkScalarValue(codePoint, strict) {
	if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
		if (strict) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
		return false;
	}
	return true;
}
/*--------------------------------------------------------------------------*/

function createByte(codePoint, shift) {
	return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}

function encodeCodePoint(codePoint, strict) {
	if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
		return stringFromCharCode(codePoint);
	}
	var symbol = '';
	if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
		symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
	}
	else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
		if (!checkScalarValue(codePoint, strict)) {
			codePoint = 0xFFFD;
		}
		symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
		symbol += createByte(codePoint, 6);
	}
	else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
		symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
		symbol += createByte(codePoint, 12);
		symbol += createByte(codePoint, 6);
	}
	symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
	return symbol;
}

function utf8encode(string, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	var codePoints = ucs2decode(string);
	var length = codePoints.length;
	var index = -1;
	var codePoint;
	var byteString = '';
	while (++index < length) {
		codePoint = codePoints[index];
		byteString += encodeCodePoint(codePoint, strict);
	}
	return byteString;
}

/*--------------------------------------------------------------------------*/

function readContinuationByte() {
	if (byteIndex >= byteCount) {
		throw Error('Invalid byte index');
	}

	var continuationByte = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	if ((continuationByte & 0xC0) == 0x80) {
		return continuationByte & 0x3F;
	}

	// If we end up here, it’s not a continuation byte
	throw Error('Invalid continuation byte');
}

function decodeSymbol(strict) {
	var byte1;
	var byte2;
	var byte3;
	var byte4;
	var codePoint;

	if (byteIndex > byteCount) {
		throw Error('Invalid byte index');
	}

	if (byteIndex == byteCount) {
		return false;
	}

	// Read first byte
	byte1 = byteArray[byteIndex] & 0xFF;
	byteIndex++;

	// 1-byte sequence (no continuation bytes)
	if ((byte1 & 0x80) == 0) {
		return byte1;
	}

	// 2-byte sequence
	if ((byte1 & 0xE0) == 0xC0) {
		byte2 = readContinuationByte();
		codePoint = ((byte1 & 0x1F) << 6) | byte2;
		if (codePoint >= 0x80) {
			return codePoint;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 3-byte sequence (may include unpaired surrogates)
	if ((byte1 & 0xF0) == 0xE0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
		if (codePoint >= 0x0800) {
			return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
		} else {
			throw Error('Invalid continuation byte');
		}
	}

	// 4-byte sequence
	if ((byte1 & 0xF8) == 0xF0) {
		byte2 = readContinuationByte();
		byte3 = readContinuationByte();
		byte4 = readContinuationByte();
		codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
			(byte3 << 0x06) | byte4;
		if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
			return codePoint;
		}
	}

	throw Error('Invalid UTF-8 detected');
}

var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
	opts = opts || {};
	var strict = false !== opts.strict;

	byteArray = ucs2decode(byteString);
	byteCount = byteArray.length;
	byteIndex = 0;
	var codePoints = [];
	var tmp;
	while ((tmp = decodeSymbol(strict)) !== false) {
		codePoints.push(tmp);
	}
	return ucs2encode(codePoints);
}

module.exports = {
	version: '2.1.2',
	encode: utf8encode,
	decode: utf8decode
};

//# sourceMappingURL=node_modules/engine.io-parser/lib/utf8.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-parser/lib/utf8.js",}],
[1074, {}, function (require, module, exports) {
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

//# sourceMappingURL=node_modules/after/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/after/index.js",}],
[1384, {}, function (require, module, exports) {
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = typeof BlobBuilder !== 'undefined' ? BlobBuilder :
  typeof WebKitBlobBuilder !== 'undefined' ? WebKitBlobBuilder :
  typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder :
  typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : 
  false;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  return ary.map(function(chunk) {
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      return buf;
    }

    return chunk;
  });
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary).forEach(function(part) {
    bb.append(part);
  });

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  return new Blob(mapArrayBufferViews(ary), options || {});
};

if (typeof Blob !== 'undefined') {
  BlobBuilderConstructor.prototype = Blob.prototype;
  BlobConstructor.prototype = Blob.prototype;
}

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

//# sourceMappingURL=node_modules/blob/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/blob/index.js",}],
[1077, {}, function (require, module, exports) {
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

//# sourceMappingURL=node_modules/arraybuffer.slice/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/arraybuffer.slice/index.js",}],
[1345, {}, function (require, module, exports) {
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

//# sourceMappingURL=node_modules/base64-arraybuffer/lib/base64-arraybuffer.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/base64-arraybuffer/lib/base64-arraybuffer.js",}],
[1644, {"component-emitter":1463,"engine.io-parser":1654}, function (require, module, exports) {
/**
 * Module dependencies.
 */

var parser = require('engine.io-parser');
var Emitter = require('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;
  this.withCredentials = opts.withCredentials;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // results of ReactNative environment detection
  this.isReactNative = opts.isReactNative;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

//# sourceMappingURL=node_modules/engine.io-client/lib/transport.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/transport.js",}],
[1651, {"./debug":1652,"_process":2892}, function (require, module, exports) {
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))

//# sourceMappingURL=node_modules/engine.io-client/node_modules/debug/src/browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/node_modules/debug/src/browser.js",}],
[1645, {"./polling-jsonp":1646,"./polling-xhr":1647,"./websocket":1649,"xmlhttprequest-ssl":1650}, function (require, module, exports) {
/**
 * Module dependencies
 */

var XMLHttpRequest = require('xmlhttprequest-ssl');
var XHR = require('./polling-xhr');
var JSONP = require('./polling-jsonp');
var websocket = require('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

//# sourceMappingURL=node_modules/engine.io-client/lib/transports/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/transports/index.js",}],
[2418, {}, function (require, module, exports) {
'use strict'
module.exports = `
message RPC {
  repeated SubOpts subscriptions = 1;
  repeated Message msgs = 2;

  message SubOpts {
    optional bool subscribe = 1; // subscribe or unsubcribe
    optional string topicID = 2;
  }

  message Message {
    optional bytes from = 1;
    optional bytes data = 2;
    optional bytes seqno = 3;
    repeated string topicIDs = 4;
    optional bytes signature = 5;
    optional bytes key = 6;
  }
}`

//# sourceMappingURL=node_modules/libp2p-pubsub/src/message/rpc.proto.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-pubsub/src/message/rpc.proto.js",}],
[2420, {}, function (require, module, exports) {
'use strict'
module.exports = `
// topicCID = cid(merkledag_protobuf(topicDescriptor)); (not the topic.name)
message TopicDescriptor {
  optional string name = 1;
  optional AuthOpts auth = 2;
  optional EncOpts enc = 2;

  message AuthOpts {
    optional AuthMode mode = 1;
    repeated bytes keys = 2; // root keys to trust

    enum AuthMode {
      NONE = 0; // no authentication, anyone can publish
      KEY = 1; // only messages signed by keys in the topic descriptor are accepted
      WOT = 2; // web of trust, certificates can allow publisher set to grow
    }
  }

  message EncOpts {
    optional EncMode mode = 1;
    repeated bytes keyHashes = 2; // the hashes of the shared keys used (salted)

    enum EncMode {
      NONE = 0; // no encryption, anyone can read
      SHAREDKEY = 1; // messages are encrypted with shared key
      WOT = 2; // web of trust, certificates can allow publisher set to grow
    }
  }
}`

//# sourceMappingURL=node_modules/libp2p-pubsub/src/message/topic-descriptor.proto.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-pubsub/src/message/topic-descriptor.proto.js",}],
[2505, {}, function (require, module, exports) {
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/lodash.throttle/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash.throttle/index.js",}],
[2313, {"ms":2314}, function (require, module, exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

//# sourceMappingURL=node_modules/latency-monitor/node_modules/debug/src/debug.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/latency-monitor/node_modules/debug/src/debug.js",}],
[3164, {}, function (require, module, exports) {
'use strict'

module.exports = function getTime () {
  return Date.now()
}

//# sourceMappingURL=node_modules/retimer/time-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/retimer/time-browser.js",}],
[2705, {"_process":2892}, function (require, module, exports) {
(function (process){
exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var t = exports.tokens = {}
var R = 0

function tok (n) {
  t[n] = R++
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER')
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*'
tok('NUMERICIDENTIFIERLOOSE')
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER')
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION')
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')'

tok('MAINVERSIONLOOSE')
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER')
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                            '|' + src[t.NONNUMERICIDENTIFIER] + ')'

tok('PRERELEASEIDENTIFIERLOOSE')
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[t.NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE')
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))'

tok('PRERELEASELOOSE')
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER')
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD')
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
             '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL')
tok('FULLPLAIN')
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                  src[t.PRERELEASE] + '?' +
                  src[t.BUILD] + '?'

src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN')
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                  src[t.PRERELEASELOOSE] + '?' +
                  src[t.BUILD] + '?'

tok('LOOSE')
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$'

tok('GTLT')
src[t.GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE')
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
tok('XRANGEIDENTIFIER')
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*'

tok('XRANGEPLAIN')
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[t.PRERELEASE] + ')?' +
                   src[t.BUILD] + '?' +
                   ')?)?'

tok('XRANGEPLAINLOOSE')
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                        src[t.BUILD] + '?' +
                        ')?)?'

tok('XRANGE')
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$'
tok('XRANGELOOSE')
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE')
src[t.COERCE] = '(^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'
tok('COERCERTL')
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g')

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE')
src[t.LONETILDE] = '(?:~>?)'

tok('TILDETRIM')
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+'
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

tok('TILDE')
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$'
tok('TILDELOOSE')
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET')
src[t.LONECARET] = '(?:\\^)'

tok('CARETTRIM')
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+'
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g')
var caretTrimReplace = '$1^'

tok('CARET')
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$'
tok('CARETLOOSE')
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE')
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$'
tok('COMPARATOR')
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM')
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                      '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE')
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s*$'

tok('HYPHENRANGELOOSE')
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
tok('STAR')
src[t.STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  var i = 0
  do {
    var a = this.build[i]
    var b = other.build[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.compareBuild = compareBuild
function compareBuild (a, b, loose) {
  var versionA = new SemVer(a, loose)
  var versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1] !== undefined ? m[1] : ''
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY || version === ANY) {
    return true
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    if (this.value === '') {
      return true
    }
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true
    }
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[t.COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[t.CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return (
      isSatisfiable(thisComparators, options) &&
      range.set.some(function (rangeComparators) {
        return (
          isSatisfiable(rangeComparators, options) &&
          thisComparators.every(function (thisComparator) {
            return rangeComparators.every(function (rangeComparator) {
              return thisComparator.intersects(rangeComparator, options)
            })
          })
        )
      })
    )
  })
}

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable (comparators, options) {
  var result = true
  var remainingComparators = comparators.slice()
  var testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p + pr
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr +
        ' <' + M + '.' + (+m + 1) + '.0' + pr
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version, options) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  var match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next
    while ((next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
          next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(match[2] +
    '.' + (match[3] || '0') +
    '.' + (match[4] || '0'), options)
}

}).call(this,require('_process'))

//# sourceMappingURL=node_modules/multistream-select/node_modules/semver/semver.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/node_modules/semver/semver.js",}],
[2714, {"./constants":2706,"./util":2715,"buffer":1428,"err-code":1657,"pull-handshake":2928,"pull-length-prefixed":2931}, function (require, module, exports) {
(function (Buffer){
'use strict'

const handshake = require('pull-handshake')
const pullLP = require('pull-length-prefixed')
const util = require('./util')
const writeEncoded = util.writeEncoded

const errCode = require('err-code')
const { errors } = require('./constants')

function select (multicodec, callback, log) {
  const stream = handshake({
    timeout: 60 * 1000
  }, callback)

  const shake = stream.handshake

  log('writing multicodec: ' + multicodec)
  writeEncoded(shake, Buffer.from(multicodec + '\n'), callback)

  pullLP.decodeFromReader(shake, (err, data) => {
    if (err) {
      return callback(err)
    }
    const protocol = data.toString().slice(0, -1)

    if (protocol !== multicodec) {
      const err = errCode(new Error(`"${multicodec}" not supported`), errors.MULTICODEC_NOT_SUPPORTED)

      return callback(err, shake.rest())
    }

    log('received ack: ' + protocol)
    callback(null, shake.rest())
  })

  return stream
}

module.exports = select

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/multistream-select/src/select.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/select.js",}],
[2715, {"buffer":1428,"debug":1565,"pull-length-prefixed":2931,"pull-stream/pull":2950,"pull-stream/sinks/collect":2951,"pull-stream/sources/values":2966}, function (require, module, exports) {
(function (Buffer){
'use strict'

const pull = require('pull-stream/pull')
const values = require('pull-stream/sources/values')
const collect = require('pull-stream/sinks/collect')
const pullLP = require('pull-length-prefixed')
const debug = require('debug')

exports = module.exports

function randomId () {
  return ((~~(Math.random() * 1e9)).toString(36))
}

// prefixes a message with a varint
// TODO this is a pull-stream 'creep' (pull stream to add a byte?')
function encode (msg, callback) {
  pull(
    values(Buffer.isBuffer(msg) ? [msg] : [Buffer.from(msg)]),
    pullLP.encode(),
    collect((err, encoded) => {
      if (err) {
        return callback(err)
      }
      callback(null, encoded[0])
    })
  )
}

exports.writeEncoded = (writer, msg, callback) => {
  encode(msg, (err, msg) => {
    if (err) {
      return callback(err)
    }
    writer.write(msg)
  })
}

function createLogger (type) {
  const rId = randomId()

  function printer (logger) {
    return (msg) => {
      if (Array.isArray(msg)) {
        msg = msg.join(' ')
      }
      logger('(%s) %s', rId, msg)
    }
  }

  const log = printer(debug('mss:' + type))
  log.error = printer(debug('mss:' + type + ':error'))

  return log
}

exports.log = {}

exports.log.dialer = () => {
  return createLogger('dialer\t')
}
exports.log.listener = () => {
  return createLogger('listener\t')
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/multistream-select/src/util.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/util.js",}],
[2710, {"buffer":1428,"pull-length-prefixed":2931,"pull-stream/pull":2950,"pull-stream/sources/values":2966,"varint":3472}, function (require, module, exports) {
(function (Buffer){
'use strict'

const pull = require('pull-stream/pull')
const values = require('pull-stream/sources/values')
const pullLP = require('pull-length-prefixed')
const varint = require('varint')

function lsHandler (self, conn) {
  const protos = Object.keys(self.handlers).filter((key) => key !== 'ls')

  const nProtos = protos.length
  // total size of the list of protocols, including varint and newline
  const size = protos.reduce((size, proto) => {
    const p = Buffer.from(proto + '\n')
    const el = varint.encodingLength(p.length)
    return size + el
  }, 0)

  const buf = Buffer.concat([
    Buffer.from(varint.encode(nProtos)),
    Buffer.from(varint.encode(size)),
    Buffer.from('\n')
  ])

  const encodedProtos = protos.map((proto) => {
    return Buffer.from(proto + '\n')
  })

  pull(
    values([buf].concat(encodedProtos)),
    pullLP.encode(),
    conn
  )
}

module.exports = lsHandler

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/multistream-select/src/listener/ls-handler.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/listener/ls-handler.js",}],
[2713, {"../util.js":2715,"async/some":1168,"buffer":1428,"interface-connection":1949,"pull-handshake":2928,"pull-length-prefixed":2931}, function (require, module, exports) {
(function (Buffer){
'use strict'

const handshake = require('pull-handshake')
const lp = require('pull-length-prefixed')
const Connection = require('interface-connection').Connection
const writeEncoded = require('../util.js').writeEncoded
const some = require('async/some')

function selectHandler (rawConn, handlersMap, log) {
  const cb = (err) => {
    // incoming errors are irrelevant for the app
    log.error(err)
  }

  const stream = handshake({ timeout: 60 * 1000 }, cb)
  const shake = stream.handshake

  next()
  return stream

  function next () {
    lp.decodeFromReader(shake, (err, data) => {
      if (err) {
        return cb(err)
      }
      log('received:', data.toString())
      const protocol = data.toString().slice(0, -1)

      matcher(protocol, handlersMap, (err, result) => {
        if (err) {
          return cb(err)
        }
        const key = result

        if (key) {
          log('send ack back of: ' + protocol)
          writeEncoded(shake, data, cb)

          const conn = new Connection(shake.rest(), rawConn)
          handlersMap[key].handlerFunc(protocol, conn)
        } else {
          log('not supported protocol: ' + protocol)
          writeEncoded(shake, Buffer.from('na\n'))
          next()
        }
      })
    })
  }
}

function matcher (protocol, handlers, callback) {
  const supportedProtocols = Object.keys(handlers)
  let supportedProtocol = false

  some(supportedProtocols,
    (sp, cb) => {
      handlers[sp].matchFunc(sp, protocol, (err, result) => {
        if (err) {
          return cb(err)
        }
        if (result) {
          supportedProtocol = sp
        }
        cb()
      })
    },
    (err) => {
      if (err) {
        return callback(err)
      }
      callback(null, supportedProtocol)
    }
  )
}

module.exports = selectHandler

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/multistream-select/src/listener/select-handler.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/multistream-select/src/listener/select-handler.js",}],
[2333, {"protons":2912}, function (require, module, exports) {
'use strict'
const protobuf = require('protons')
module.exports = protobuf(`
message CircuitRelay {

  enum Status {
    SUCCESS                    = 100;
    HOP_SRC_ADDR_TOO_LONG      = 220;
    HOP_DST_ADDR_TOO_LONG      = 221;
    HOP_SRC_MULTIADDR_INVALID  = 250;
    HOP_DST_MULTIADDR_INVALID  = 251;
    HOP_NO_CONN_TO_DST         = 260;
    HOP_CANT_DIAL_DST          = 261;
    HOP_CANT_OPEN_DST_STREAM   = 262;
    HOP_CANT_SPEAK_RELAY       = 270;
    HOP_CANT_RELAY_TO_SELF     = 280;
    STOP_SRC_ADDR_TOO_LONG     = 320;
    STOP_DST_ADDR_TOO_LONG     = 321;
    STOP_SRC_MULTIADDR_INVALID = 350;
    STOP_DST_MULTIADDR_INVALID = 351;
    STOP_RELAY_REFUSED         = 390;
    MALFORMED_MESSAGE          = 400;
  }

  enum Type { // RPC identifier, either HOP, STOP or STATUS
    HOP = 1;
    STOP = 2;
    STATUS = 3;
    CAN_HOP = 4;
  }

  message Peer {
    required bytes id = 1;    // peer id
    repeated bytes addrs = 2; // peer's known addresses
  }

  optional Type type = 1;     // Type of the message

  optional Peer srcPeer = 2;  // srcPeer and dstPeer are used when Type is HOP or STATUS
  optional Peer dstPeer = 3;

  optional Status code = 4;   // Status code, used when Type is STATUS
}
`)

//# sourceMappingURL=node_modules/libp2p-circuit/src/protocol/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/protocol/index.js",}],
[2332, {}, function (require, module, exports) {
'use strict'

module.exports = {
  relay: '/libp2p/circuit/relay/0.1.0'
}

//# sourceMappingURL=node_modules/libp2p-circuit/src/multicodec.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/multicodec.js",}],
[2328, {"debug":1565,"pull-handshake":2928,"pull-length-prefixed":2931,"pull-stream/pull":2950,"pull-stream/sinks/collect":2951,"pull-stream/sources/empty":2960,"pull-stream/sources/values":2966}, function (require, module, exports) {
'use strict'

const values = require('pull-stream/sources/values')
const collect = require('pull-stream/sinks/collect')
const empty = require('pull-stream/sources/empty')
const pull = require('pull-stream/pull')
const lp = require('pull-length-prefixed')
const handshake = require('pull-handshake')

const debug = require('debug')
const log = debug('libp2p:circuit:stream-handler')
log.err = debug('libp2p:circuit:error:stream-handler')

class StreamHandler {
  /**
   * Create a stream handler for connection
   *
   * @param {Connection} conn - connection to read/write
   * @param {Function|undefined} cb - handshake callback called on error
   * @param {Number} timeout - handshake timeout
   * @param {Number} maxLength - max bytes length of message
   */
  constructor (conn, cb, timeout, maxLength) {
    this.conn = conn
    this.stream = null
    this.shake = null
    this.timeout = cb || 1000 * 60
    this.maxLength = maxLength || 4096

    if (typeof cb === 'function') {
      this.timeout = timeout || 1000 * 60
    }

    this.stream = handshake({ timeout: this.timeout }, cb)
    this.shake = this.stream.handshake

    pull(this.stream, conn, this.stream)
  }

  isValid () {
    return this.conn && this.shake && this.stream
  }

  /**
   * Read and decode message
   *
   * @param {Function} cb
   * @returns {void|Function}
   */
  read (cb) {
    if (!this.isValid()) {
      return cb(new Error(`handler is not in a valid state`))
    }

    lp.decodeFromReader(
      this.shake,
      { maxLength: this.maxLength },
      (err, msg) => {
        if (err) {
          log.err(err)
          // this.shake.abort(err)
          return cb(err)
        }

        return cb(null, msg)
      })
  }

  /**
   * Encode and write array of buffers
   *
   * @param {Buffer[]} msg
   * @param {Function} [cb]
   * @returns {Function}
   */
  write (msg, cb) {
    cb = cb || (() => {})

    if (!this.isValid()) {
      return cb(new Error(`handler is not in a valid state`))
    }

    pull(
      values([msg]),
      lp.encode(),
      collect((err, encoded) => {
        if (err) {
          log.err(err)
          this.shake.abort(err)
          return cb(err)
        }

        encoded.forEach((e) => this.shake.write(e))
        cb()
      })
    )
  }

  /**
   * Get the raw Connection
   *
   * @returns {null|Connection|*}
   */
  getRawConn () {
    return this.conn
  }

  /**
   * Return the handshake rest stream and invalidate handler
   *
   * @return {*|{source, sink}}
   */
  rest () {
    const rest = this.shake.rest()

    this.conn = null
    this.stream = null
    this.shake = null
    return rest
  }

  /**
   * Close the stream
   *
   * @returns {undefined}
   */
  close () {
    if (!this.isValid()) {
      return
    }

    // close stream
    pull(
      empty(),
      this.rest()
    )
  }
}

module.exports = StreamHandler

//# sourceMappingURL=node_modules/libp2p-circuit/src/circuit/stream-handler.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/circuit/stream-handler.js",}],
[2327, {"../protocol":2333,"./utils":2329,"async/series":1166,"async/setImmediate":1167,"debug":1565,"events":1429,"interface-connection":1949,"peer-info":2884}, function (require, module, exports) {
'use strict'

const setImmediate = require('async/setImmediate')

const EE = require('events').EventEmitter
const Connection = require('interface-connection').Connection
const utilsFactory = require('./utils')
const PeerInfo = require('peer-info')
const proto = require('../protocol').CircuitRelay
const series = require('async/series')

const debug = require('debug')

const log = debug('libp2p:circuit:stop')
log.err = debug('libp2p:circuit:error:stop')

class Stop extends EE {
  constructor (swarm) {
    super()
    this.swarm = swarm
    this.utils = utilsFactory(swarm)
  }

  /**
   * Handle the incoming STOP message
   *
   * @param {{}} msg  - the parsed protobuf message
   * @param {StreamHandler} sh  - the stream handler wrapped connection
   * @param {Function} callback  - callback
   * @returns {undefined}
   */
  handle (msg, sh, callback) {
    callback = callback || (() => {})

    series([
      (cb) => this.utils.validateAddrs(msg, sh, proto.Type.STOP, cb),
      (cb) => this.utils.writeResponse(sh, proto.Status.Success, cb)
    ], (err) => {
      if (err) {
        // we don't return the error here,
        // since multistream select don't expect one
        callback()
        return log(err)
      }

      const peerInfo = new PeerInfo(this.utils.peerIdFromId(msg.srcPeer.id))
      msg.srcPeer.addrs.forEach((addr) => peerInfo.multiaddrs.add(addr))
      const newConn = new Connection(sh.rest())
      newConn.setPeerInfo(peerInfo)
      setImmediate(() => this.emit('connection', newConn))
      callback(newConn)
    })
  }
}

module.exports = Stop

//# sourceMappingURL=node_modules/libp2p-circuit/src/circuit/stop.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/circuit/stop.js",}],
[2326, {"../protocol":2333,"./../multicodec":2332,"./stream-handler":2328,"./utils":2329,"async/series":1166,"async/setImmediate":1167,"async/waterfall":1173,"debug":1565,"events":1429,"multiaddr":2681,"once":2767,"peer-id":2883,"peer-info":2884,"pull-stream/pull":2950}, function (require, module, exports) {
'use strict'

const pull = require('pull-stream/pull')
const debug = require('debug')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const EE = require('events').EventEmitter
const once = require('once')
const utilsFactory = require('./utils')
const StreamHandler = require('./stream-handler')
const proto = require('../protocol').CircuitRelay
const multiaddr = require('multiaddr')
const series = require('async/series')
const waterfall = require('async/waterfall')
const setImmediate = require('async/setImmediate')

const multicodec = require('./../multicodec')

const log = debug('libp2p:circuit:relay')
log.err = debug('libp2p:circuit:error:relay')

class Hop extends EE {
  /**
   * Construct a Circuit object
   *
   * This class will handle incoming circuit connections and
   * either start a relay or hand the relayed connection to
   * the swarm
   *
   * @param {Swarm} swarm
   * @param {Object} options
   */
  constructor (swarm, options) {
    super()
    this.swarm = swarm
    this.peerInfo = this.swarm._peerInfo
    this.utils = utilsFactory(swarm)
    this.config = options || { active: false, enabled: false }
    this.active = this.config.active
  }

  /**
   * Handle the relay message
   *
   * @param {CircuitRelay} message
   * @param {StreamHandler} sh
   * @returns {*}
   */
  handle (message, sh) {
    if (!this.config.enabled) {
      this.utils.writeResponse(
        sh,
        proto.Status.HOP_CANT_SPEAK_RELAY)
      return sh.close()
    }

    // check if message is `CAN_HOP`
    if (message.type === proto.Type.CAN_HOP) {
      this.utils.writeResponse(
        sh,
        proto.Status.SUCCESS)
      return sh.close()
    }

    // This is a relay request - validate and create a circuit
    let srcPeerId = null
    let dstPeerId = null
    try {
      srcPeerId = PeerId.createFromBytes(message.srcPeer.id).toB58String()
      dstPeerId = PeerId.createFromBytes(message.dstPeer.id).toB58String()
    } catch (err) {
      log.err(err)

      if (!srcPeerId) {
        this.utils.writeResponse(
          sh,
          proto.Status.HOP_SRC_MULTIADDR_INVALID)
        return sh.close()
      }

      if (!dstPeerId) {
        this.utils.writeResponse(
          sh,
          proto.Status.HOP_DST_MULTIADDR_INVALID)
        return sh.close()
      }
    }

    if (srcPeerId === dstPeerId) {
      this.utils.writeResponse(
        sh,
        proto.Status.HOP_CANT_RELAY_TO_SELF)
      return sh.close()
    }

    if (!message.dstPeer.addrs.length) {
      // TODO: use encapsulate here
      const addr = multiaddr(`/p2p-circuit/ipfs/${dstPeerId}`).buffer
      message.dstPeer.addrs.push(addr)
    }

    log('trying to establish a circuit: %s <-> %s', srcPeerId, dstPeerId)
    const noPeer = () => {
      // log.err(err)
      this.utils.writeResponse(
        sh,
        proto.Status.HOP_NO_CONN_TO_DST)
      return sh.close()
    }

    const isConnected = (cb) => {
      let dstPeer
      try {
        dstPeer = this.swarm._peerBook.get(dstPeerId)
        if (!dstPeer.isConnected() && !this.active) {
          const err = new Error(`No Connection to peer ${dstPeerId}`)
          noPeer(err)
          return cb(err)
        }
      } catch (err) {
        if (!this.active) {
          noPeer(err)
          return cb(err)
        }
      }
      cb()
    }

    series([
      (cb) => this.utils.validateAddrs(message, sh, proto.Type.HOP, cb),
      (cb) => isConnected(cb),
      (cb) => this._circuit(sh, message, cb)
    ], (err) => {
      if (err) {
        log.err(err)
        sh.close()
        return setImmediate(() => this.emit('circuit:error', err))
      }
      setImmediate(() => this.emit('circuit:success'))
    })
  }

  /**
   * Connect to STOP
   *
   * @param {PeerInfo} peer
   * @param {StreamHandler} srcSh
   * @param {function} callback
   * @returns {void}
   */
  _connectToStop (peer, srcSh, callback) {
    this._dialPeer(peer, (err, dstConn) => {
      if (err) {
        this.utils.writeResponse(
          srcSh,
          proto.Status.HOP_CANT_DIAL_DST)
        log.err(err)
        return callback(err)
      }

      return this.utils.writeResponse(
        srcSh,
        proto.Status.SUCCESS,
        (err) => {
          if (err) {
            log.err(err)
            return callback(err)
          }
          return callback(null, dstConn)
        })
    })
  }

  /**
   * Negotiate STOP
   *
   * @param {StreamHandler} dstSh
   * @param {StreamHandler} srcSh
   * @param {CircuitRelay} message
   * @param {function} callback
   * @returns {void}
   */
  _negotiateStop (dstSh, srcSh, message, callback) {
    const stopMsg = Object.assign({}, message, {
      type: proto.Type.STOP // change the message type
    })
    dstSh.write(proto.encode(stopMsg),
      (err) => {
        if (err) {
          this.utils.writeResponse(
            srcSh,
            proto.Status.HOP_CANT_OPEN_DST_STREAM)
          log.err(err)
          return callback(err)
        }

        // read response from STOP
        dstSh.read((err, msg) => {
          if (err) {
            log.err(err)
            return callback(err)
          }

          const message = proto.decode(msg)
          if (message.code !== proto.Status.SUCCESS) {
            return callback(new Error(`Unable to create circuit!`))
          }

          return callback(null, msg)
        })
      })
  }

  /**
   * Attempt to make a circuit from A <-> R <-> B where R is this relay
   *
   * @param {StreamHandler} srcSh - the source stream handler
   * @param {CircuitRelay} message - the message with the src and dst entries
   * @param {Function} callback - callback to signal success or failure
   * @returns {void}
   * @private
   */
  _circuit (srcSh, message, callback) {
    let dstSh = null
    waterfall([
      (cb) => this._connectToStop(message.dstPeer, srcSh, cb),
      (_dstConn, cb) => {
        dstSh = new StreamHandler(_dstConn)
        this._negotiateStop(dstSh, srcSh, message, cb)
      }
    ], (err) => {
      if (err) {
        // close/end the source stream if there was an error
        if (srcSh) {
          srcSh.close()
        }

        if (dstSh) {
          dstSh.close()
        }
        return callback(err)
      }

      const src = srcSh.rest()
      const dst = dstSh.rest()

      const srcIdStr = PeerId.createFromBytes(message.srcPeer.id).toB58String()
      const dstIdStr = PeerId.createFromBytes(message.dstPeer.id).toB58String()

      // circuit the src and dst streams
      pull(
        src,
        dst,
        src
      )
      log('circuit %s <-> %s established', srcIdStr, dstIdStr)
      callback()
    })
  }

  /**
   * Dial the dest peer and create a circuit
   *
   * @param {Multiaddr} dstPeer
   * @param {Function} callback
   * @returns {void}
   * @private
   */
  _dialPeer (dstPeer, callback) {
    const peerInfo = new PeerInfo(PeerId.createFromBytes(dstPeer.id))
    dstPeer.addrs.forEach((a) => peerInfo.multiaddrs.add(a))
    this.swarm.dial(peerInfo, multicodec.relay, once((err, conn) => {
      if (err) {
        log.err(err)
        return callback(err)
      }

      callback(null, conn)
    }))
  }
}

module.exports = Hop

//# sourceMappingURL=node_modules/libp2p-circuit/src/circuit/hop.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-circuit/src/circuit/hop.js",}],
[1898, {"../../is-buffer/index.js":2235,"./consumable-buffer":1897}, function (require, module, exports) {
(function (Buffer){
'use strict'

const ConsumableBuffer = require('./consumable-buffer')

module.exports = function wrapHash (hashFn) {
  return function hashing (value) {
    if (value instanceof InfiniteHash) {
      // already a hash. return it
      return value
    } else {
      return new InfiniteHash(value, hashFn)
    }
  }
}

class InfiniteHash {
  constructor (value, hashFn) {
    if ((typeof value) !== 'string' && !Buffer.isBuffer(value)) {
      throw new Error('can only hash strings or buffers')
    }
    this._value = value
    this._hashFn = hashFn
    this._depth = -1
    this._availableBits = 0
    this._currentBufferIndex = 0
    this._buffers = []
  }

  async take (bits) {
    let pendingBits = bits

    while (this._availableBits < pendingBits) {
      await this._produceMoreBits()
    }

    let result = 0

    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex]
      const available = Math.min(hash.availableBits(), pendingBits)
      const took = hash.take(available)
      result = (result << available) + took
      pendingBits -= available
      this._availableBits -= available

      if (hash.availableBits() === 0) {
        this._currentBufferIndex++
      }
    }

    return result
  }

  untake (bits) {
    let pendingBits = bits

    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex]
      const availableForUntake = Math.min(hash.totalBits() - hash.availableBits(), pendingBits)
      hash.untake(availableForUntake)
      pendingBits -= availableForUntake
      this._availableBits += availableForUntake

      if (this._currentBufferIndex > 0 && hash.totalBits() === hash.availableBits()) {
        this._depth--
        this._currentBufferIndex--
      }
    }
  }

  async _produceMoreBits () {
    this._depth++

    const value = this._depth ? this._value + this._depth : this._value
    const hashValue = await this._hashFn(value)
    const buffer = new ConsumableBuffer(hashValue)

    this._buffers.push(buffer)
    this._availableBits += buffer.availableBits()
  }
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})

//# sourceMappingURL=node_modules/hamt-sharding/src/consumable-hash.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/hamt-sharding/src/consumable-hash.js",}],
[3339, {}, function (require, module, exports) {
'use strict'

// JS treats subjects of bitwise operators as SIGNED 32 bit numbers,
// which means the maximum amount of bits we can store inside each byte
// is 7..
const BITS_PER_BYTE = 7

module.exports = class SparseArray {
  constructor () {
    this._bitArrays = []
    this._data = []
    this._length = 0
    this._changedLength = false
    this._changedData = false
  }

  set (index, value) {
    let pos = this._internalPositionFor(index, false)
    if (value === undefined) {
      // unsetting
      if (pos !== -1) {
        // remove item from bit array and array itself
        this._unsetInternalPos(pos)
        this._unsetBit(index)
        this._changedLength = true
        this._changedData = true
      }
    } else {
      let needsSort = false
      if (pos === -1) {
        pos = this._data.length
        this._setBit(index)
        this._changedData = true
      } else {
        needsSort = true
      }
      this._setInternalPos(pos, index, value, needsSort)
      this._changedLength = true
    }
  }

  unset (index) {
    this.set(index, undefined)
  }

  get (index) {
    this._sortData()
    const pos = this._internalPositionFor(index, true)
    if (pos === -1) {
      return undefined
    }
    return this._data[pos][1]
  }

  push (value) {
    this.set(this.length, value)
    return this.length
  }

  get length () {
    this._sortData()
    if (this._changedLength) {
      const last = this._data[this._data.length - 1]
      this._length = last ? last[0] + 1 : 0
      this._changedLength = false
    }
    return this._length
  }

  forEach (iterator) {
    let i = 0
    while(i < this.length) {
      iterator(this.get(i), i, this)
      i++
    }
  }

  map (iterator) {
    let i = 0
    let mapped = new Array(this.length)
    while(i < this.length) {
      mapped[i] = iterator(this.get(i), i, this)
      i++
    }
    return mapped
  }

  reduce (reducer, initialValue) {
    let i = 0
    let acc = initialValue
    while(i < this.length) {
      const value = this.get(i)
      acc = reducer(acc, value, i)
      i++
    }
    return acc
  }

  find (finder) {
    let i = 0, found, last
    while ((i < this.length) && !found) {
      last = this.get(i)
      found = finder(last)
      i++
    }
    return found ? last : undefined
  }

  _internalPositionFor (index, noCreate) {
    const bytePos = this._bytePosFor(index, noCreate)
    if (bytePos >= this._bitArrays.length) {
      return -1
    }
    const byte = this._bitArrays[bytePos]
    const bitPos = index - bytePos * BITS_PER_BYTE
    const exists = (byte & (1 << bitPos)) > 0
    if (!exists) {
      return -1
    }
    const previousPopCount = this._bitArrays.slice(0, bytePos).reduce(popCountReduce, 0)

    const mask = ~(0xffffffff << (bitPos + 1))
    const bytePopCount = popCount(byte & mask)
    const arrayPos = previousPopCount + bytePopCount - 1
    return arrayPos
  }

  _bytePosFor (index, noCreate) {
    const bytePos = Math.floor(index / BITS_PER_BYTE)
    const targetLength = bytePos + 1
    while (!noCreate && this._bitArrays.length < targetLength) {
      this._bitArrays.push(0)
    }
    return bytePos
  }

  _setBit (index) {
    const bytePos = this._bytePosFor(index, false)
    this._bitArrays[bytePos] |= (1 << (index - (bytePos * BITS_PER_BYTE)))
  }

  _unsetBit(index) {
    const bytePos = this._bytePosFor(index, false)
    this._bitArrays[bytePos] &= ~(1 << (index - (bytePos * BITS_PER_BYTE)))
  }

  _setInternalPos(pos, index, value, needsSort) {
    const data =this._data
    const elem = [index, value]
    if (needsSort) {
      this._sortData()
      data[pos] = elem
    } else {
      // new element. just shove it into the array
      // but be nice about where we shove it
      // in order to make sorting it later easier
      if (data.length) {
        if (data[data.length - 1][0] >= index) {
          data.push(elem)
        } else if (data[0][0] <= index) {
          data.unshift(elem)
        } else {
          const randomIndex = Math.round(data.length / 2)
          this._data = data.slice(0, randomIndex).concat(elem).concat(data.slice(randomIndex))
        }
      } else {
        this._data.push(elem)
      }
      this._changedData = true
      this._changedLength = true
    }
  }

  _unsetInternalPos (pos) {
    this._data.splice(pos, 1)
  }

  _sortData () {
    if (this._changedData) {
      this._data.sort(sortInternal)
    }

    this._changedData = false
  }

  bitField () {
    const bytes = []
    let pendingBitsForResultingByte = 8
    let pendingBitsForNewByte = 0
    let resultingByte = 0
    let newByte
    const pending = this._bitArrays.slice()
    while (pending.length || pendingBitsForNewByte) {
      if (pendingBitsForNewByte === 0) {
        newByte = pending.shift()
        pendingBitsForNewByte = 7
      }

      const usingBits = Math.min(pendingBitsForNewByte, pendingBitsForResultingByte)
      const mask = ~(0b11111111 << usingBits)
      const masked = newByte & mask
      resultingByte |= masked << (8 - pendingBitsForResultingByte)
      newByte = newByte >>> usingBits
      pendingBitsForNewByte -= usingBits
      pendingBitsForResultingByte -= usingBits

      if (!pendingBitsForResultingByte || (!pendingBitsForNewByte && !pending.length)) {
        bytes.push(resultingByte)
        resultingByte = 0
        pendingBitsForResultingByte = 8
      }
    }

    // remove trailing zeroes
    for(var i = bytes.length - 1; i > 0; i--) {
      const value = bytes[i]
      if (value === 0) {
        bytes.pop()
      } else {
        break
      }
    }

    return bytes
  }

  compactArray () {
    this._sortData()
    return this._data.map(valueOnly)
  }
}

function popCountReduce (count, byte) {
  return count + popCount(byte)
}

function popCount(_v) {
  let v = _v
  v = v - ((v >> 1) & 0x55555555)                    // reuse input as temporary
  v = (v & 0x33333333) + ((v >> 2) & 0x33333333)     // temp
  return ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
}

function sortInternal (a, b) {
  return a[0] - b[0]
}

function valueOnly (elem) {
  return elem[1]
}
//# sourceMappingURL=node_modules/sparse-array/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/sparse-array/index.js",}],
[3281, {"./alphabet":3278,"./build":3279,"./is-valid":3282,"./util/cluster-worker-id":3285}, function (require, module, exports) {
'use strict';

var alphabet = require('./alphabet');
var build = require('./build');
var isValid = require('./is-valid');

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = require('./util/cluster-worker-id') || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;

//# sourceMappingURL=node_modules/shortid/lib/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/index.js",}],
[1377, {"./lib/_stream_duplex.js":1364,"./lib/_stream_passthrough.js":1365,"./lib/_stream_readable.js":1366,"./lib/_stream_transform.js":1367,"./lib/_stream_writable.js":1368,"./lib/internal/streams/end-of-stream.js":1372,"./lib/internal/streams/pipeline.js":1374}, function (require, module, exports) {
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
exports.finished = require('./lib/internal/streams/end-of-stream.js');
exports.pipeline = require('./lib/internal/streams/pipeline.js');

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/readable-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/readable-browser.js",}],
[2999, {}, function (require, module, exports) {
/**
 * Rabin fingerprinting
 *
 * @class Rabin
 */
class Rabin {
    /**
     * Creates an instance of Rabin.
     * @param {number} [bits=12]
     * @param {number} [min=8 * 1024]
     * @param {number} [max=32 * 1024]
     * @param { import("./../dist/rabin").default } asModule
     * @memberof Rabin
     */
    constructor(bits = 12, min = 8 * 1024, max = 32 * 1024, windowSize = 64, asModule) {
        this.bits = bits
        this.min = min
        this.max = max
        this.asModule = asModule
        this.rabin = new asModule.Rabin(bits, min, max, windowSize)
    }

    /**
     * Fingerprints the buffer
     *
     * @param {Uint8Array} buf
     * @returns {Array<number>}
     * @memberof Rabin
     */
    fingerprint(buf) {
        const lengths = new Int32Array(Math.ceil(buf.length/this.min))
        const lengthsPtr = this.asModule.newArray(lengths)
        const pointer = this.asModule.newArray(buf)

        // run finderprint
        this.rabin.fingerprint(pointer, lengthsPtr)

        const processed = this.asModule.getArray(Int32Array, lengthsPtr)

        //free memory
        this.asModule.freeArray(lengthsPtr)
        this.asModule.freeArray(pointer)

        // TODO: remove this. @see https://github.com/ipfs/js-ipfs/issues/2118#issuecomment-497722625
        // clean extra 0s in the array
        const cleanArr = []
        for (let i = 0; i < processed.length; i++) {
            if(processed[i] === 0) break
            cleanArr[i] = processed[i];
        }

        return cleanArr
    }
}

module.exports = Rabin
//# sourceMappingURL=node_modules/rabin-wasm/src/rabin.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/rabin-wasm/src/rabin.js",}],
[2997, {"assemblyscript/lib/loader":1094}, function (require, module, exports) {

const { instantiateStreaming } = require("assemblyscript/lib/loader");

loadWebAssembly.supported = typeof WebAssembly !== 'undefined'

function loadWebAssembly (imp = {}) {
  if (!loadWebAssembly.supported) return null
  
  var wasm = new Uint8Array([0,97,115,109,1,0,0,0,1,90,16,96,0,0,96,2,127,127,1,127,96,4,127,127,127,127,0,96,1,127,1,127,96,3,127,127,127,0,96,1,126,1,127,96,2,126,126,1,126,96,5,127,127,127,127,127,1,127,96,3,127,127,126,0,96,2,127,127,1,126,96,3,127,127,127,1,127,96,1,127,0,96,2,127,127,0,96,1,127,1,126,96,2,127,126,0,96,0,1,127,2,13,1,3,101,110,118,5,97,98,111,114,116,0,2,3,57,56,3,3,12,3,3,15,5,6,1,8,4,1,9,11,7,4,10,10,11,0,0,0,3,12,3,12,3,12,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,13,14,4,4,1,112,0,1,5,3,1,0,1,6,26,5,127,1,65,0,11,127,1,65,0,11,127,1,65,0,11,127,1,65,0,11,127,1,65,0,11,7,253,6,44,6,109,101,109,111,114,121,2,0,5,116,97,98,108,101,1,0,6,100,101,103,114,101,101,0,7,3,109,111,100,0,8,16,82,97,98,105,110,35,103,101,116,58,119,105,110,100,111,119,0,23,16,82,97,98,105,110,35,115,101,116,58,119,105,110,100,111,119,0,24,21,82,97,98,105,110,35,103,101,116,58,119,105,110,100,111,119,95,115,105,122,101,0,25,21,82,97,98,105,110,35,115,101,116,58,119,105,110,100,111,119,95,115,105,122,101,0,26,14,82,97,98,105,110,35,103,101,116,58,119,112,111,115,0,27,14,82,97,98,105,110,35,115,101,116,58,119,112,111,115,0,28,15,82,97,98,105,110,35,103,101,116,58,99,111,117,110,116,0,29,15,82,97,98,105,110,35,115,101,116,58,99,111,117,110,116,0,30,13,82,97,98,105,110,35,103,101,116,58,112,111,115,0,31,13,82,97,98,105,110,35,115,101,116,58,112,111,115,0,32,15,82,97,98,105,110,35,103,101,116,58,115,116,97,114,116,0,33,15,82,97,98,105,110,35,115,101,116,58,115,116,97,114,116,0,34,16,82,97,98,105,110,35,103,101,116,58,100,105,103,101,115,116,0,35,16,82,97,98,105,110,35,115,101,116,58,100,105,103,101,115,116,0,36,21,82,97,98,105,110,35,103,101,116,58,99,104,117,110,107,95,115,116,97,114,116,0,37,21,82,97,98,105,110,35,115,101,116,58,99,104,117,110,107,95,115,116,97,114,116,0,38,22,82,97,98,105,110,35,103,101,116,58,99,104,117,110,107,95,108,101,110,103,116,104,0,39,22,82,97,98,105,110,35,115,101,116,58,99,104,117,110,107,95,108,101,110,103,116,104,0,40,31,82,97,98,105,110,35,103,101,116,58,99,104,117,110,107,95,99,117,116,95,102,105,110,103,101,114,112,114,105,110,116,0,41,31,82,97,98,105,110,35,115,101,116,58,99,104,117,110,107,95,99,117,116,95,102,105,110,103,101,114,112,114,105,110,116,0,42,20,82,97,98,105,110,35,103,101,116,58,112,111,108,121,110,111,109,105,97,108,0,43,20,82,97,98,105,110,35,115,101,116,58,112,111,108,121,110,111,109,105,97,108,0,44,27,82,97,98,105,110,35,103,101,116,58,112,111,108,121,110,111,109,105,97,108,95,100,101,103,114,101,101,0,45,27,82,97,98,105,110,35,115,101,116,58,112,111,108,121,110,111,109,105,97,108,95,100,101,103,114,101,101,0,46,26,82,97,98,105,110,35,103,101,116,58,112,111,108,121,110,111,109,105,97,108,95,115,104,105,102,116,0,47,26,82,97,98,105,110,35,115,101,116,58,112,111,108,121,110,111,109,105,97,108,95,115,104,105,102,116,0,48,22,82,97,98,105,110,35,103,101,116,58,97,118,101,114,97,103,101,95,98,105,116,115,0,49,22,82,97,98,105,110,35,115,101,116,58,97,118,101,114,97,103,101,95,98,105,116,115,0,50,17,82,97,98,105,110,35,103,101,116,58,109,105,110,115,105,122,101,0,51,17,82,97,98,105,110,35,115,101,116,58,109,105,110,115,105,122,101,0,52,17,82,97,98,105,110,35,103,101,116,58,109,97,120,115,105,122,101,0,53,17,82,97,98,105,110,35,115,101,116,58,109,97,120,115,105,122,101,0,54,14,82,97,98,105,110,35,103,101,116,58,109,97,115,107,0,55,14,82,97,98,105,110,35,115,101,116,58,109,97,115,107,0,56,17,82,97,98,105,110,35,99,111,110,115,116,114,117,99,116,111,114,0,15,17,82,97,98,105,110,35,102,105,110,103,101,114,112,114,105,110,116,0,16,14,109,101,109,111,114,121,46,99,111,109,112,97,114,101,0,18,15,109,101,109,111,114,121,46,97,108,108,111,99,97,116,101,0,4,11,109,101,109,111,114,121,46,102,114,101,101,0,19,12,109,101,109,111,114,121,46,114,101,115,101,116,0,20,8,1,21,9,7,1,0,65,0,11,1,22,10,188,30,56,104,1,3,127,32,0,65,128,128,128,128,4,75,4,64,0,11,35,1,34,1,32,0,65,1,32,0,65,1,75,27,106,65,7,106,65,120,113,34,0,63,0,34,2,65,16,116,75,4,64,32,2,32,0,32,1,107,65,255,255,3,106,65,128,128,124,113,65,16,118,34,3,32,2,32,3,74,27,64,0,65,0,72,4,64,32,3,64,0,65,0,72,4,64,0,11,11,11,32,0,36,1,32,1,11,51,1,1,127,32,0,65,248,255,255,255,3,75,4,64,65,0,65,200,0,65,26,65,2,16,0,0,11,65,1,65,32,32,0,65,7,106,103,107,116,16,1,34,1,32,0,54,2,0,32,1,11,145,3,1,1,127,32,1,69,4,64,15,11,32,0,65,0,58,0,0,32,0,32,1,106,65,1,107,65,0,58,0,0,32,1,65,2,77,4,64,15,11,32,0,65,1,106,65,0,58,0,0,32,0,65,2,106,65,0,58,0,0,32,0,32,1,106,34,2,65,2,107,65,0,58,0,0,32,2,65,3,107,65,0,58,0,0,32,1,65,6,77,4,64,15,11,32,0,65,3,106,65,0,58,0,0,32,0,32,1,106,65,4,107,65,0,58,0,0,32,1,65,8,77,4,64,15,11,65,0,32,0,107,65,3,113,34,2,32,0,106,34,0,65,0,54,2,0,32,1,32,2,107,65,124,113,34,1,32,0,106,65,4,107,65,0,54,2,0,32,1,65,8,77,4,64,15,11,32,0,65,4,106,65,0,54,2,0,32,0,65,8,106,65,0,54,2,0,32,0,32,1,106,34,2,65,12,107,65,0,54,2,0,32,2,65,8,107,65,0,54,2,0,32,1,65,24,77,4,64,15,11,32,0,65,12,106,65,0,54,2,0,32,0,65,16,106,65,0,54,2,0,32,0,65,20,106,65,0,54,2,0,32,0,65,24,106,65,0,54,2,0,32,0,32,1,106,34,2,65,28,107,65,0,54,2,0,32,2,65,24,107,65,0,54,2,0,32,2,65,20,107,65,0,54,2,0,32,2,65,16,107,65,0,54,2,0,32,0,65,4,113,65,24,106,34,2,32,0,106,33,0,32,1,32,2,107,33,1,3,64,32,1,65,32,79,4,64,32,0,66,0,55,3,0,32,0,65,8,106,66,0,55,3,0,32,0,65,16,106,66,0,55,3,0,32,0,65,24,106,66,0,55,3,0,32,1,65,32,107,33,1,32,0,65,32,106,33,0,12,1,11,11,11,6,0,32,0,16,1,11,76,1,1,127,65,128,16,16,2,34,1,65,8,106,65,128,16,16,3,32,0,69,4,64,65,12,16,1,33,0,11,32,0,65,0,54,2,0,32,0,65,0,54,2,4,32,0,65,0,54,2,8,32,0,32,1,54,2,0,32,0,65,0,54,2,4,32,0,65,128,16,54,2,8,32,0,11,8,0,65,12,16,1,16,5,11,70,2,1,127,1,126,66,128,128,128,128,128,128,128,128,128,127,33,2,3,64,2,64,32,1,65,192,0,78,13,0,32,0,32,2,131,66,0,86,4,64,65,63,32,1,107,15,5,32,2,66,1,136,33,2,32,1,65,1,106,33,1,12,2,11,0,11,11,65,127,11,175,2,2,1,127,2,126,3,64,2,127,66,128,128,128,128,128,128,128,128,128,127,33,3,65,0,33,2,3,64,2,64,32,2,65,192,0,78,13,0,65,63,32,2,107,32,0,32,3,131,66,0,86,13,2,26,32,3,66,1,136,33,3,32,2,65,1,106,33,2,12,1,11,11,65,127,11,2,127,32,1,33,4,66,128,128,128,128,128,128,128,128,128,127,33,3,65,0,33,2,3,64,2,64,32,2,65,192,0,78,13,0,65,63,32,2,107,32,3,32,4,131,66,0,86,13,2,26,32,3,66,1,136,33,3,32,2,65,1,106,33,2,12,1,11,11,65,127,11,78,4,64,32,1,2,127,66,128,128,128,128,128,128,128,128,128,127,33,3,65,0,33,2,3,64,2,64,32,2,65,192,0,78,13,0,65,63,32,2,107,32,0,32,3,131,66,0,86,13,2,26,32,3,66,1,136,33,3,32,2,65,1,106,33,2,12,1,11,11,65,127,11,2,127,66,128,128,128,128,128,128,128,128,128,127,33,3,65,0,33,2,3,64,2,64,32,2,65,192,0,78,13,0,65,63,32,2,107,32,1,32,3,131,66,0,86,13,2,26,32,3,66,1,136,33,3,32,2,65,1,106,33,2,12,1,11,11,65,127,11,107,172,134,32,0,133,33,0,12,1,11,11,32,0,11,96,1,1,127,32,1,65,248,255,255,255,3,75,4,64,65,0,65,8,65,23,65,34,16,0,0,11,32,1,16,2,34,2,65,8,106,32,1,16,3,32,0,69,4,64,65,12,16,1,33,0,11,32,0,65,0,54,2,0,32,0,65,0,54,2,4,32,0,65,0,54,2,8,32,0,32,2,54,2,0,32,0,65,0,54,2,4,32,0,32,1,54,2,8,32,0,11,49,0,32,1,32,0,40,2,8,65,3,118,79,4,64,65,0,65,8,65,50,65,63,16,0,0,11,32,0,40,2,4,32,0,40,2,0,32,1,65,3,116,106,106,32,2,55,3,8,11,43,0,32,1,32,0,40,2,8,79,4,64,65,0,65,8,65,50,65,63,16,0,0,11,32,0,40,2,4,32,1,32,0,40,2,0,106,106,32,2,58,0,8,11,41,0,32,1,32,0,40,2,8,79,4,64,65,0,65,8,65,39,65,63,16,0,0,11,32,0,40,2,4,32,1,32,0,40,2,0,106,106,45,0,8,11,47,0,32,1,32,0,40,2,8,65,3,118,79,4,64,65,0,65,8,65,39,65,63,16,0,0,11,32,0,40,2,4,32,0,40,2,0,32,1,65,3,116,106,106,41,3,8,11,166,10,2,3,127,5,126,35,2,69,4,64,3,64,32,2,65,128,2,72,4,64,32,2,65,255,1,113,173,33,4,32,0,41,3,72,33,6,3,64,2,127,32,4,33,5,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,5,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,2,127,32,6,33,7,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,7,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,78,4,64,32,6,2,127,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,5,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,2,127,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,6,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,107,172,134,32,5,133,33,4,12,1,11,11,65,0,33,1,3,64,32,1,32,0,40,2,4,65,1,107,72,4,64,32,5,66,8,134,33,4,32,0,41,3,72,33,6,3,64,2,127,32,4,33,5,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,3,3,64,32,3,65,192,0,72,4,64,65,63,32,3,107,32,4,32,5,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,3,65,1,106,33,3,12,1,11,11,65,127,11,2,127,32,6,33,7,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,3,3,64,32,3,65,192,0,72,4,64,65,63,32,3,107,32,4,32,7,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,3,65,1,106,33,3,12,1,11,11,65,127,11,78,4,64,32,6,2,127,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,3,3,64,32,3,65,192,0,72,4,64,65,63,32,3,107,32,4,32,5,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,3,65,1,106,33,3,12,1,11,11,65,127,11,2,127,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,3,3,64,32,3,65,192,0,72,4,64,65,63,32,3,107,32,4,32,6,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,3,65,1,106,33,3,12,1,11,11,65,127,11,107,172,134,32,5,133,33,4,12,1,11,11,32,1,65,1,106,33,1,12,1,11,11,35,4,32,2,32,5,16,10,32,2,65,1,106,33,2,12,1,11,11,2,127,32,0,41,3,72,33,4,66,128,128,128,128,128,128,128,128,128,127,33,5,65,0,33,2,3,64,32,2,65,192,0,72,4,64,65,63,32,2,107,32,4,32,5,131,66,0,86,13,2,26,32,5,66,1,136,33,5,32,2,65,1,106,33,2,12,1,11,11,65,127,11,172,33,8,65,0,33,2,3,64,32,2,65,128,2,72,4,64,35,3,33,3,32,2,172,32,8,134,33,5,32,0,41,3,72,33,6,3,64,2,127,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,5,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,2,127,32,6,33,7,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,7,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,78,4,64,32,6,2,127,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,5,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,2,127,66,128,128,128,128,128,128,128,128,128,127,33,4,65,0,33,1,3,64,32,1,65,192,0,72,4,64,65,63,32,1,107,32,4,32,6,131,66,0,86,13,2,26,32,4,66,1,136,33,4,32,1,65,1,106,33,1,12,1,11,11,65,127,11,107,172,134,32,5,133,33,5,12,1,11,11,32,3,32,2,32,2,172,32,8,134,32,5,132,16,10,32,2,65,1,106,33,2,12,1,11,11,65,1,36,2,11,32,0,66,0,55,3,24,32,0,66,0,55,3,32,65,0,33,2,3,64,32,2,32,0,40,2,4,72,4,64,32,0,40,2,0,32,2,65,0,16,11,32,2,65,1,106,33,2,12,1,11,11,32,0,66,0,55,3,40,32,0,65,0,54,2,8,32,0,66,0,55,3,16,32,0,66,0,55,3,40,32,0,40,2,0,32,0,40,2,8,16,12,33,1,32,0,40,2,0,32,0,40,2,8,65,1,16,11,32,0,32,0,41,3,40,35,4,32,1,65,255,1,113,16,13,133,55,3,40,32,0,32,0,40,2,8,65,1,106,32,0,40,2,4,111,54,2,8,32,0,41,3,40,32,0,41,3,88,136,167,33,1,32,0,32,0,41,3,40,66,8,134,55,3,40,32,0,32,0,41,3,40,66,1,132,55,3,40,32,0,32,0,41,3,40,35,3,32,1,65,255,1,113,16,13,133,55,3,40,11,234,1,0,32,0,69,4,64,65,128,1,16,1,33,0,11,32,0,65,0,54,2,0,32,0,65,0,54,2,4,32,0,65,0,54,2,8,32,0,66,0,55,3,16,32,0,66,0,55,3,24,32,0,66,0,55,3,32,32,0,66,0,55,3,40,32,0,66,0,55,3,48,32,0,66,0,55,3,56,32,0,66,0,55,3,64,32,0,66,0,55,3,72,32,0,66,0,55,3,80,32,0,66,0,55,3,88,32,0,66,0,55,3,96,32,0,66,0,55,3,104,32,0,66,0,55,3,112,32,0,66,0,55,3,120,32,0,32,1,173,55,3,96,32,0,32,2,173,55,3,104,32,0,32,3,173,55,3,112,32,0,65,12,16,1,32,4,16,9,54,2,0,32,0,32,4,54,2,4,32,0,66,1,32,0,41,3,96,134,66,1,125,55,3,120,32,0,66,243,130,183,218,216,230,232,30,55,3,72,32,0,66,53,55,3,80,32,0,32,0,41,3,80,66,8,125,55,3,88,32,0,16,14,32,0,11,206,4,1,5,127,32,1,40,2,8,33,4,32,1,40,2,0,65,8,106,33,5,3,64,2,127,65,0,33,3,3,64,32,3,32,4,72,4,64,32,3,32,5,106,45,0,0,33,1,32,0,40,2,0,32,0,40,2,8,16,12,33,6,32,0,40,2,0,32,0,40,2,8,32,1,16,11,32,0,32,0,41,3,40,35,4,32,6,65,255,1,113,16,13,133,55,3,40,32,0,32,0,40,2,8,65,1,106,32,0,40,2,4,111,54,2,8,32,0,41,3,40,32,0,41,3,88,136,167,33,6,32,0,32,0,41,3,40,66,8,134,55,3,40,32,0,32,0,41,3,40,32,1,173,132,55,3,40,32,0,32,0,41,3,40,35,3,32,6,65,255,1,113,16,13,133,55,3,40,32,0,32,0,41,3,16,66,1,124,55,3,16,32,0,32,0,41,3,24,66,1,124,55,3,24,2,127,32,0,41,3,16,32,0,41,3,104,90,34,1,4,64,32,0,41,3,40,32,0,41,3,120,131,66,0,81,33,1,11,32,1,69,11,4,127,32,0,41,3,16,32,0,41,3,112,90,5,32,1,11,4,64,32,0,32,0,41,3,32,55,3,48,32,0,32,0,41,3,16,55,3,56,32,0,32,0,41,3,40,55,3,64,65,0,33,1,3,64,32,1,32,0,40,2,4,72,4,64,32,0,40,2,0,32,1,65,0,16,11,32,1,65,1,106,33,1,12,1,11,11,32,0,66,0,55,3,40,32,0,65,0,54,2,8,32,0,66,0,55,3,16,32,0,66,0,55,3,40,32,0,40,2,0,32,0,40,2,8,16,12,33,1,32,0,40,2,0,32,0,40,2,8,65,1,16,11,32,0,32,0,41,3,40,35,4,32,1,65,255,1,113,16,13,133,55,3,40,32,0,32,0,40,2,8,65,1,106,32,0,40,2,4,111,54,2,8,32,0,41,3,40,32,0,41,3,88,136,167,33,1,32,0,32,0,41,3,40,66,8,134,55,3,40,32,0,32,0,41,3,40,66,1,132,55,3,40,32,0,32,0,41,3,40,35,3,32,1,65,255,1,113,16,13,133,55,3,40,32,3,65,1,106,12,3,5,32,3,65,1,106,33,3,12,2,11,0,11,11,65,127,11,34,1,65,0,78,4,64,32,4,32,1,107,33,4,32,1,32,5,106,33,5,32,7,34,1,65,1,106,33,7,32,2,40,2,4,32,2,40,2,0,32,1,65,2,116,106,106,32,0,41,3,56,62,2,8,32,2,40,2,4,32,2,40,2,0,32,1,65,2,116,106,106,40,2,8,26,12,1,11,11,11,88,1,1,127,32,0,32,1,70,4,64,65,0,15,11,3,64,32,2,65,0,71,34,3,4,64,32,0,45,0,0,32,1,45,0,0,70,33,3,11,32,3,4,64,32,2,65,1,107,33,2,32,0,65,1,106,33,0,32,1,65,1,106,33,1,12,1,11,11,32,2,4,127,32,0,45,0,0,32,1,45,0,0,107,5,65,0,11,11,10,0,32,0,32,1,32,2,16,17,11,3,0,1,11,6,0,35,0,36,1,11,19,0,65,136,1,36,0,35,0,36,1,16,6,36,3,16,6,36,4,11,3,0,1,11,7,0,32,0,40,2,0,11,9,0,32,0,32,1,54,2,0,11,7,0,32,0,40,2,4,11,9,0,32,0,32,1,54,2,4,11,7,0,32,0,40,2,8,11,9,0,32,0,32,1,54,2,8,11,7,0,32,0,41,3,16,11,9,0,32,0,32,1,55,3,16,11,7,0,32,0,41,3,24,11,9,0,32,0,32,1,55,3,24,11,7,0,32,0,41,3,32,11,9,0,32,0,32,1,55,3,32,11,7,0,32,0,41,3,40,11,9,0,32,0,32,1,55,3,40,11,7,0,32,0,41,3,48,11,9,0,32,0,32,1,55,3,48,11,7,0,32,0,41,3,56,11,9,0,32,0,32,1,55,3,56,11,7,0,32,0,41,3,64,11,9,0,32,0,32,1,55,3,64,11,7,0,32,0,41,3,72,11,9,0,32,0,32,1,55,3,72,11,7,0,32,0,41,3,80,11,9,0,32,0,32,1,55,3,80,11,7,0,32,0,41,3,88,11,9,0,32,0,32,1,55,3,88,11,7,0,32,0,41,3,96,11,9,0,32,0,32,1,55,3,96,11,7,0,32,0,41,3,104,11,9,0,32,0,32,1,55,3,104,11,7,0,32,0,41,3,112,11,9,0,32,0,32,1,55,3,112,11,7,0,32,0,41,3,120,11,9,0,32,0,32,1,55,3,120,11,11,128,1,2,0,65,8,11,57,27,0,0,0,126,0,108,0,105,0,98,0,47,0,105,0,110,0,116,0,101,0,114,0,110,0,97,0,108,0,47,0,116,0,121,0,112,0,101,0,100,0,97,0,114,0,114,0,97,0,121,0,46,0,116,0,115,0,65,200,0,11,59,28,0,0,0,126,0,108,0,105,0,98,0,47,0,105,0,110,0,116,0,101,0,114,0,110,0,97,0,108,0,47,0,97,0,114,0,114,0,97,0,121,0,98,0,117,0,102,0,102,0,101,0,114,0,46,0,116,0,115,0,32,16,115,111,117,114,99,101,77,97,112,112,105,110,103,85,82,76,14,114,97,98,105,110,46,119,97,115,109,46,109,97,112])
  // make it work async because browsers throw when a wasm module is bigger than 4kb and load sync
  return instantiateStreaming(new Response(new Blob([wasm], {type: 'application/wasm'})), imp)
}
module.exports = loadWebAssembly

//# sourceMappingURL=node_modules/rabin-wasm/dist/rabin-wasm.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/rabin-wasm/dist/rabin-wasm.js",}],
[1557, {"buffer":1428}, function (require, module, exports) {
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

//# sourceMappingURL=node_modules/datastore-level/node_modules/safe-buffer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/datastore-level/node_modules/safe-buffer/index.js",}],
[2428, {"_process":2892,"buffer":1428}, function (require, module, exports) {
(function (process,Buffer){
'use strict'

exports.toCallback = (doWork) => {
  return function (input, callback) {
    let res
    try {
      res = doWork(input)
    } catch (err) {
      process.nextTick(callback, err)
      return
    }

    process.nextTick(callback, null, res)
  }
}

exports.toBuf = (doWork, other) => (input) => {
  let result = doWork(input, other)
  return Buffer.from(result, 'hex')
}

exports.fromString = (doWork, other) => (_input) => {
  const input = Buffer.isBuffer(_input) ? _input.toString() : _input
  return doWork(input, other)
}

exports.fromNumberTo32BitBuf = (doWork, other) => (input) => {
  let number = doWork(input, other)
  const bytes = new Array(4)

  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }

  return Buffer.from(bytes)
}

}).call(this,require('_process'),require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-record/node_modules/multihashing-async/src/utils.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-record/node_modules/multihashing-async/src/utils.js",}],
[2423, {"_process":2892}, function (require, module, exports) {
(function (process,global){
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var INPUT_ERROR = 'input is invalid type';
  var FINALIZE_ERROR = 'finalize already called';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
  var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
  };

  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
  };

  var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
  };

  var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createMethod(bits, padding, type);
    }
    return method;
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
  };

  var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
      if (!n && !s) {
        return methods['shake' + bits].create(outputBits);
      } else {
        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
      }
    };
    method.update = function (message, outputBits, n, s) {
      return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
  };

  var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
      return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
  };

  var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name + '_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
      if (algorithm.name !== 'sha3') {
        var newMethodName = algorithm.name + bits[j];
        methodNames.push(newMethodName);
        methods[newMethodName] = methods[methodName];
      }
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
      bytes.unshift(o);
      x = x >> 8;
      o = x & 255;
      ++n;
    }
    if (right) {
      bytes.push(n);
    } else {
      bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
  };

  Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
      if (type === 'object') {
        if (str === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
          str = new Uint8Array(str);
        } else if (!Array.isArray(str)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
      bytes = length;
    } else {
      for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
          bytes += 1;
        } else if (code < 0x800) {
          bytes += 2;
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes += 3;
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
          bytes += 4;
        }
      }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
  };

  Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
      bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
  };

  Keccak.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      array[offset] = block & 0xFF;
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
  }

  Kmac.prototype = new Keccak();

  Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } else {
    for (i = 0; i < methodNames.length; ++i) {
      root[methodNames[i]] = methods[methodNames[i]];
    }
    if (AMD) {
      define(function () {
        return methods;
      });
    }
  }
})();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/libp2p-record/node_modules/js-sha3/src/sha3.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-record/node_modules/js-sha3/src/sha3.js",}],
[2424, {"./utils":2428,"blakejs":1382,"buffer":1428}, function (require, module, exports) {
(function (Buffer){
'use strict'

const blake = require('blakejs')

const toCallback = require('./utils').toCallback

const minB = 0xb201
const minS = 0xb241

const blake2b = {
  init: blake.blake2bInit,
  update: blake.blake2bUpdate,
  digest: blake.blake2bFinal
}

const blake2s = {
  init: blake.blake2sInit,
  update: blake.blake2sUpdate,
  digest: blake.blake2sFinal
}

const makeB2Hash = (size, hf) => toCallback((buf) => {
  const ctx = hf.init(size, null)
  hf.update(ctx, buf)
  return Buffer.from(hf.digest(ctx))
})

module.exports = (table) => {
  for (let i = 0; i < 64; i++) {
    table[minB + i] = makeB2Hash(i + 1, blake2b)
  }
  for (let i = 0; i < 32; i++) {
    table[minS + i] = makeB2Hash(i + 1, blake2s)
  }
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-record/node_modules/multihashing-async/src/blake.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-record/node_modules/multihashing-async/src/blake.js",}],
[2425, {"buffer":1428,"nodeify":2755}, function (require, module, exports) {
(function (Buffer){
/* global self */

'use strict'

const nodeify = require('nodeify')

const webCrypto = getWebCrypto()

function getWebCrypto () {
  if (self.crypto) {
    return self.crypto.subtle || self.crypto.webkitSubtle
  }

  if (self.msCrypto) {
    return self.msCrypto.subtle
  }
}

function webCryptoHash (type) {
  if (!webCrypto) {
    throw new Error('Please use a browser with webcrypto support and ensure the code has been delivered securely via HTTPS/TLS and run within a Secure Context')
  }

  return (data, callback) => {
    const res = webCrypto.digest({ name: type }, data)

    if (typeof res.then !== 'function') { // IE11
      res.onerror = () => {
        callback(new Error(`hashing data using ${type}`))
      }
      res.oncomplete = (e) => {
        callback(null, e.target.result)
      }
      return
    }

    nodeify(
      res.then((raw) => Buffer.from(new Uint8Array(raw))),
      callback
    )
  }
}

function sha1 (buf, callback) {
  webCryptoHash('SHA-1')(buf, callback)
}

function sha2256 (buf, callback) {
  webCryptoHash('SHA-256')(buf, callback)
}

function sha2512 (buf, callback) {
  webCryptoHash('SHA-512')(buf, callback)
}

module.exports = {
  sha1: sha1,
  sha2256: sha2256,
  sha2512: sha2512
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-record/node_modules/multihashing-async/src/crypto-sha1-2-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-record/node_modules/multihashing-async/src/crypto-sha1-2-browser.js",}],
[1921, {}, function (require, module, exports) {
// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);

//# sourceMappingURL=node_modules/heap/lib/heap.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/heap/lib/heap.js",}],
[2444, {"_process":2892,"buffer":1428}, function (require, module, exports) {
(function (process,Buffer){
'use strict'

exports.toCallback = (doWork) => {
  return function (input, callback) {
    let res
    try {
      res = doWork(input)
    } catch (err) {
      process.nextTick(callback, err)
      return
    }

    process.nextTick(callback, null, res)
  }
}

exports.toBuf = (doWork, other) => (input) => {
  let result = doWork(input, other)
  return Buffer.from(result, 'hex')
}

exports.fromString = (doWork, other) => (_input) => {
  const input = Buffer.isBuffer(_input) ? _input.toString() : _input
  return doWork(input, other)
}

exports.fromNumberTo32BitBuf = (doWork, other) => (input) => {
  let number = doWork(input, other)
  const bytes = new Array(4)

  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 0xff
    number = number >> 8
  }

  return Buffer.from(bytes)
}

}).call(this,require('_process'),require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-secio/node_modules/multihashing-async/src/utils.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-secio/node_modules/multihashing-async/src/utils.js",}],
[2439, {"_process":2892}, function (require, module, exports) {
(function (process,global){
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var INPUT_ERROR = 'input is invalid type';
  var FINALIZE_ERROR = 'finalize already called';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
  var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
  };

  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
  };

  var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
  };

  var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createMethod(bits, padding, type);
    }
    return method;
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
  };

  var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
      if (!n && !s) {
        return methods['shake' + bits].create(outputBits);
      } else {
        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
      }
    };
    method.update = function (message, outputBits, n, s) {
      return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
  };

  var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
      return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
  };

  var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name + '_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
      if (algorithm.name !== 'sha3') {
        var newMethodName = algorithm.name + bits[j];
        methodNames.push(newMethodName);
        methods[newMethodName] = methods[methodName];
      }
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
      bytes.unshift(o);
      x = x >> 8;
      o = x & 255;
      ++n;
    }
    if (right) {
      bytes.push(n);
    } else {
      bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
  };

  Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
      if (type === 'object') {
        if (str === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
          str = new Uint8Array(str);
        } else if (!Array.isArray(str)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
      bytes = length;
    } else {
      for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
          bytes += 1;
        } else if (code < 0x800) {
          bytes += 2;
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes += 3;
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
          bytes += 4;
        }
      }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
  };

  Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
      bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
  };

  Keccak.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      array[offset] = block & 0xFF;
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
  }

  Kmac.prototype = new Keccak();

  Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } else {
    for (i = 0; i < methodNames.length; ++i) {
      root[methodNames[i]] = methods[methodNames[i]];
    }
    if (AMD) {
      define(function () {
        return methods;
      });
    }
  }
})();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/libp2p-secio/node_modules/js-sha3/src/sha3.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-secio/node_modules/js-sha3/src/sha3.js",}],
[2440, {"./utils":2444,"blakejs":1382,"buffer":1428}, function (require, module, exports) {
(function (Buffer){
'use strict'

const blake = require('blakejs')

const toCallback = require('./utils').toCallback

const minB = 0xb201
const minS = 0xb241

const blake2b = {
  init: blake.blake2bInit,
  update: blake.blake2bUpdate,
  digest: blake.blake2bFinal
}

const blake2s = {
  init: blake.blake2sInit,
  update: blake.blake2sUpdate,
  digest: blake.blake2sFinal
}

const makeB2Hash = (size, hf) => toCallback((buf) => {
  const ctx = hf.init(size, null)
  hf.update(ctx, buf)
  return Buffer.from(hf.digest(ctx))
})

module.exports = (table) => {
  for (let i = 0; i < 64; i++) {
    table[minB + i] = makeB2Hash(i + 1, blake2b)
  }
  for (let i = 0; i < 32; i++) {
    table[minS + i] = makeB2Hash(i + 1, blake2s)
  }
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-secio/node_modules/multihashing-async/src/blake.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-secio/node_modules/multihashing-async/src/blake.js",}],
[2441, {"buffer":1428,"nodeify":2755}, function (require, module, exports) {
(function (Buffer){
/* global self */

'use strict'

const nodeify = require('nodeify')

const webCrypto = getWebCrypto()

function getWebCrypto () {
  if (self.crypto) {
    return self.crypto.subtle || self.crypto.webkitSubtle
  }

  if (self.msCrypto) {
    return self.msCrypto.subtle
  }
}

function webCryptoHash (type) {
  if (!webCrypto) {
    throw new Error('Please use a browser with webcrypto support and ensure the code has been delivered securely via HTTPS/TLS and run within a Secure Context')
  }

  return (data, callback) => {
    const res = webCrypto.digest({ name: type }, data)

    if (typeof res.then !== 'function') { // IE11
      res.onerror = () => {
        callback(new Error(`hashing data using ${type}`))
      }
      res.oncomplete = (e) => {
        callback(null, e.target.result)
      }
      return
    }

    nodeify(
      res.then((raw) => Buffer.from(new Uint8Array(raw))),
      callback
    )
  }
}

function sha1 (buf, callback) {
  webCryptoHash('SHA-1')(buf, callback)
}

function sha2256 (buf, callback) {
  webCryptoHash('SHA-256')(buf, callback)
}

function sha2512 (buf, callback) {
  webCryptoHash('SHA-512')(buf, callback)
}

module.exports = {
  sha1: sha1,
  sha2256: sha2256,
  sha2512: sha2512
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/libp2p-secio/node_modules/multihashing-async/src/crypto-sha1-2-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/libp2p-secio/node_modules/multihashing-async/src/crypto-sha1-2-browser.js",}],
[1652, {"ms":1653}, function (require, module, exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

//# sourceMappingURL=node_modules/engine.io-client/node_modules/debug/src/debug.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/node_modules/debug/src/debug.js",}],
[1650, {"./globalThis":1641,"has-cors":1902}, function (require, module, exports) {
// browser shim for xmlhttprequest module

var hasCORS = require('has-cors');
var globalThis = require('./globalThis');

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new globalThis[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) { }
  }
};

//# sourceMappingURL=node_modules/engine.io-client/lib/xmlhttprequest.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/xmlhttprequest.js",}],
[1646, {"../globalThis":1641,"./polling":1648,"component-inherit":1464}, function (require, module, exports) {
/**
 * Module requirements.
 */

var Polling = require('./polling');
var inherit = require('component-inherit');
var globalThis = require('../globalThis');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    callbacks = globalThis.___eio = (globalThis.___eio || []);
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (typeof addEventListener === 'function') {
    addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

//# sourceMappingURL=node_modules/engine.io-client/lib/transports/polling-jsonp.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/transports/polling-jsonp.js",}],
[1649, {"../transport":1644,"buffer":1428,"component-inherit":1464,"debug":1651,"engine.io-parser":1654,"parseqs":2871,"ws":1398,"yeast":3589}, function (require, module, exports) {
(function (Buffer){
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parser = require('engine.io-parser');
var parseqs = require('parseqs');
var inherit = require('component-inherit');
var yeast = require('yeast');
var debug = require('debug')('engine.io-client:websocket');

var BrowserWebSocket, NodeWebSocket;

if (typeof WebSocket !== 'undefined') {
  BrowserWebSocket = WebSocket;
} else if (typeof self !== 'undefined') {
  BrowserWebSocket = self.WebSocket || self.MozWebSocket;
}

if (typeof window === 'undefined') {
  try {
    NodeWebSocket = require('ws');
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocketImpl = BrowserWebSocket || NodeWebSocket;

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocketImpl = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;

  var opts = {};

  if (!this.isReactNative) {
    opts.agent = this.agent;
    opts.perMessageDeflate = this.perMessageDeflate;

    // SSL options for Node.js client
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;
  }

  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws =
      this.usingBrowserWebSocket && !this.isReactNative
        ? protocols
          ? new WebSocketImpl(uri, protocols)
          : new WebSocketImpl(uri)
        : new WebSocketImpl(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocketImpl && !('__initialize' in WebSocketImpl && this.name === WS.prototype.name);
};

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/engine.io-client/lib/transports/websocket.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/transports/websocket.js",}],
[1647, {"../globalThis":1641,"./polling":1648,"component-emitter":1463,"component-inherit":1464,"debug":1651,"xmlhttprequest-ssl":1650}, function (require, module, exports) {
/* global attachEvent */

/**
 * Module requirements.
 */

var XMLHttpRequest = require('xmlhttprequest-ssl');
var Polling = require('./polling');
var Emitter = require('component-emitter');
var inherit = require('component-inherit');
var debug = require('debug')('engine.io-client:polling-xhr');
var globalThis = require('../globalThis');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (typeof location !== 'undefined') {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = (typeof location !== 'undefined' && opts.hostname !== location.hostname) ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;
  opts.withCredentials = this.withCredentials;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.withCredentials = opts.withCredentials;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = this.withCredentials;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          try {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (self.supportsBinary && contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
              xhr.responseType = 'arraybuffer';
            }
          } catch (e) {}
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(typeof xhr.status === 'number' ? xhr.status : 0);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (typeof document !== 'undefined') {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (typeof document !== 'undefined') {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream' || contentType === 'application/octet-stream; charset=UTF-8') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return typeof XDomainRequest !== 'undefined' && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (typeof document !== 'undefined') {
  if (typeof attachEvent === 'function') {
    attachEvent('onunload', unloadHandler);
  } else if (typeof addEventListener === 'function') {
    var terminationEvent = 'onpagehide' in globalThis ? 'pagehide' : 'unload';
    addEventListener(terminationEvent, unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

//# sourceMappingURL=node_modules/engine.io-client/lib/transports/polling-xhr.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/transports/polling-xhr.js",}],
[2314, {}, function (require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

//# sourceMappingURL=node_modules/latency-monitor/node_modules/ms/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/latency-monitor/node_modules/ms/index.js",}],
[1168, {"./internal/createTester":1137,"./internal/doParallel":1139,"lodash/identity":2631}, function (require, module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createTester = require('./internal/createTester');

var _createTester2 = _interopRequireDefault(_createTester);

var _doParallel = require('./internal/doParallel');

var _doParallel2 = _interopRequireDefault(_doParallel);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns `true` if at least one element in the `coll` satisfies an async test.
 * If any iteratee call returns `true`, the main `callback` is immediately
 * called.
 *
 * @name some
 * @static
 * @memberOf module:Collections
 * @method
 * @alias any
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
 * in the collections in parallel.
 * The iteratee should complete with a boolean `result` value.
 * Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @example
 *
 * async.some(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then at least one of the files exists
 * });
 */
exports.default = (0, _doParallel2.default)((0, _createTester2.default)(Boolean, _identity2.default));
module.exports = exports['default'];
//# sourceMappingURL=node_modules/async/some.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/async/some.js",}],
[1897, {}, function (require, module, exports) {
'use strict'

const START_MASKS = [
  0b11111111,
  0b11111110,
  0b11111100,
  0b11111000,
  0b11110000,
  0b11100000,
  0b11000000,
  0b10000000
]

const STOP_MASKS = [
  0b00000001,
  0b00000011,
  0b00000111,
  0b00001111,
  0b00011111,
  0b00111111,
  0b01111111,
  0b11111111
]

module.exports = class ConsumableBuffer {
  constructor (value) {
    this._value = value
    this._currentBytePos = value.length - 1
    this._currentBitPos = 7
  }

  availableBits () {
    return this._currentBitPos + 1 + this._currentBytePos * 8
  }

  totalBits () {
    return this._value.length * 8
  }

  take (bits) {
    let pendingBits = bits
    let result = 0
    while (pendingBits && this._haveBits()) {
      const byte = this._value[this._currentBytePos]
      const availableBits = this._currentBitPos + 1
      const taking = Math.min(availableBits, pendingBits)
      const value = byteBitsToInt(byte, availableBits - taking, taking)
      result = (result << taking) + value

      pendingBits -= taking

      this._currentBitPos -= taking
      if (this._currentBitPos < 0) {
        this._currentBitPos = 7
        this._currentBytePos--
      }
    }

    return result
  }

  untake (bits) {
    this._currentBitPos += bits
    while (this._currentBitPos > 7) {
      this._currentBitPos -= 8
      this._currentBytePos += 1
    }
  }

  _haveBits () {
    return this._currentBytePos >= 0
  }
}

function byteBitsToInt (byte, start, length) {
  const mask = maskFor(start, length)
  return (byte & mask) >>> start
}

function maskFor (start, length) {
  return START_MASKS[start] & STOP_MASKS[Math.min(length + start - 1, 7)]
}

//# sourceMappingURL=node_modules/hamt-sharding/src/consumable-buffer.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/hamt-sharding/src/consumable-buffer.js",}],
[3285, {}, function (require, module, exports) {
'use strict';

module.exports = 0;

//# sourceMappingURL=node_modules/shortid/lib/util/cluster-worker-id-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/util/cluster-worker-id-browser.js",}],
[3282, {"./alphabet":3278}, function (require, module, exports) {
'use strict';
var alphabet = require('./alphabet');

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

module.exports = isShortId;

//# sourceMappingURL=node_modules/shortid/lib/is-valid.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/is-valid.js",}],
[3278, {"./random/random-from-seed":3284}, function (require, module, exports) {
'use strict';

var randomFromSeed = require('./random/random-from-seed');

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

module.exports = {
    get: get,
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

//# sourceMappingURL=node_modules/shortid/lib/alphabet.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/alphabet.js",}],
[3279, {"./alphabet":3278,"./generate":3280}, function (require, module, exports) {
'use strict';

var generate = require('./generate');
var alphabet = require('./alphabet');

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate(version);
    str = str + generate(clusterWorkerId);
    if (counter > 0) {
        str = str + generate(counter);
    }
    str = str + generate(seconds);
    return str;
}

module.exports = build;

//# sourceMappingURL=node_modules/shortid/lib/build.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/build.js",}],
[1372, {"../../../errors":1363}, function (require, module, exports) {
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop() {}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

module.exports = eos;
//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/end-of-stream.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/end-of-stream.js",}],
[1374, {"../../../errors":1363,"./end-of-stream":1372}, function (require, module, exports) {
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes = require('../../../errors').codes,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = require('./end-of-stream');
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

module.exports = pipeline;
//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/pipeline.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/pipeline.js",}],
[1367, {"../errors":1363,"./_stream_duplex":1364,"inherits":1947}, function (require, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';

module.exports = Transform;

var _require$codes = require('../errors').codes,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;

var Duplex = require('./_stream_duplex');

require('inherits')(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}
//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/_stream_transform.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/_stream_transform.js",}],
[1365, {"./_stream_transform":1367,"inherits":1947}, function (require, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

require('inherits')(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/_stream_passthrough.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/_stream_passthrough.js",}],
[1368, {"../errors":1363,"./_stream_duplex":1364,"./internal/streams/destroy":1371,"./internal/streams/state":1375,"./internal/streams/stream":1376,"_process":2892,"buffer":1428,"inherits":1947,"util-deprecate":3456}, function (require, module, exports) {
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';

module.exports = Writable;
/* <replacement> */

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/

var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

var errorOrDestroy = destroyImpl.errorOrDestroy;

require('inherits')(Writable, Stream);

function nop() {}

function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

  this.autoDestroy = !!options.autoDestroy; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex'); // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      errorOrDestroy(stream, err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');

      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;

        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/_stream_writable.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/_stream_writable.js",}],
[1364, {"./_stream_readable":1366,"./_stream_writable":1368,"_process":2892,"inherits":1947}, function (require, module, exports) {
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
'use strict';
/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


module.exports = Duplex;

var Readable = require('./_stream_readable');

var Writable = require('./_stream_writable');

require('inherits')(Duplex, Readable);

{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  process.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});
}).call(this,require('_process'))

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/_stream_duplex.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/_stream_duplex.js",}],
[1366, {"../errors":1363,"./_stream_duplex":1364,"./internal/streams/async_iterator":1369,"./internal/streams/buffer_list":1370,"./internal/streams/destroy":1371,"./internal/streams/from":1373,"./internal/streams/state":1375,"./internal/streams/stream":1376,"_process":2892,"buffer":1428,"events":1429,"inherits":1947,"string_decoder/":1379,"util":1398}, function (require, module, exports) {
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

module.exports = Readable;
/*<replacement>*/

var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = require('events').EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*<replacement>*/


var debugUtil = require('util');

var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = require('./internal/streams/buffer_list');

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


var StringDecoder;
var createReadableStreamAsyncIterator;
var from;

require('inherits')(Readable, Stream);

var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
    ;
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = require('./internal/streams/from');
    }

    return from(Readable, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/_stream_readable.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/_stream_readable.js",}],
[1094, {}, function (require, module, exports) {
"use strict";

const hasBigInt64 = typeof BigUint64Array !== "undefined";
const thisPtr = Symbol();

/** Gets a string from an U32 and an U16 view on a memory. */
function getStringImpl(U32, U16, ptr) {
  var dataLength = U32[ptr >>> 2];
  var dataOffset = (ptr + 4) >>> 1;
  var dataRemain = dataLength;
  var parts = [];
  const chunkSize = 1024;
  while (dataRemain > chunkSize) {
    let last = U16[dataOffset + chunkSize - 1];
    let size = last >= 0xD800 && last < 0xDC00 ? chunkSize - 1 : chunkSize;
    let part = U16.subarray(dataOffset, dataOffset += size);
    parts.push(String.fromCharCode.apply(String, part));
    dataRemain -= size;
  }
  return parts.join("") + String.fromCharCode.apply(String, U16.subarray(dataOffset, dataOffset + dataRemain));
}

/** Prepares the base module prior to instantiation. */
function preInstantiate(imports) {
  var baseModule = {};

  function getString(memory, ptr) {
    if (!memory) return "<yet unknown>";
    var buffer = memory.buffer;
    return getStringImpl(new Uint32Array(buffer), new Uint16Array(buffer), ptr);
  }

  // add common imports used by stdlib for convenience
  var env = (imports.env = imports.env || {});
  env.abort = env.abort || function abort(mesg, file, line, colm) {
    var memory = baseModule.memory || env.memory; // prefer exported, otherwise try imported
    throw Error("abort: " + getString(memory, mesg) + " at " + getString(memory, file) + ":" + line + ":" + colm);
  }
  env.trace = env.trace || function trace(mesg, n) {
    var memory = baseModule.memory || env.memory;
    console.log("trace: " + getString(memory, mesg) + (n ? " " : "") + Array.prototype.slice.call(arguments, 2, 2 + n).join(", "));
  }
  imports.Math = imports.Math || Math;
  imports.Date = imports.Date || Date;

  return baseModule;
}

/** Prepares the final module once instantiation is complete. */
function postInstantiate(baseModule, instance) {
  var rawExports = instance.exports;
  var memory = rawExports.memory;
  var memory_allocate = rawExports["memory.allocate"];
  var memory_fill = rawExports["memory.fill"];
  var memory_free = rawExports["memory.free"];
  var table = rawExports.table;
  var setargc = rawExports._setargc || function() {};

  // Provide views for all sorts of basic values
  var buffer, I8, U8, I16, U16, I32, U32, F32, F64, I64, U64;

  /** Updates memory views if memory has grown meanwhile. */
  function checkMem() {
    // see: https://github.com/WebAssembly/design/issues/1210
    if (buffer !== memory.buffer) {
      buffer = memory.buffer;
      I8  = new Int8Array(buffer);
      U8  = new Uint8Array(buffer);
      I16 = new Int16Array(buffer);
      U16 = new Uint16Array(buffer);
      I32 = new Int32Array(buffer);
      U32 = new Uint32Array(buffer);
      if (hasBigInt64) {
        I64 = new BigInt64Array(buffer);
        U64 = new BigUint64Array(buffer);
      }
      F32 = new Float32Array(buffer);
      F64 = new Float64Array(buffer);
    }
  }
  checkMem();

  /** Allocates a new string in the module's memory and returns its pointer. */
  function newString(str) {
    var dataLength = str.length;
    var ptr = memory_allocate(4 + (dataLength << 1));
    var dataOffset = (4 + ptr) >>> 1;
    checkMem();
    U32[ptr >>> 2] = dataLength;
    for (let i = 0; i < dataLength; ++i) U16[dataOffset + i] = str.charCodeAt(i);
    return ptr;
  }

  baseModule.newString = newString;

  /** Gets a string from the module's memory by its pointer. */
  function getString(ptr) {
    checkMem();
    return getStringImpl(U32, U16, ptr);
  }

  baseModule.getString = getString;

  function computeBufferSize(byteLength) {
    const HEADER_SIZE = 8;
    return 1 << (32 - Math.clz32(byteLength + HEADER_SIZE - 1));
  }

  /** Creates a new typed array in the module's memory and returns its pointer. */
  function newArray(view, length, unsafe) {
    var ctor = view.constructor;
    if (ctor === Function) { // TypedArray constructor created in memory
      ctor = view;
      view = null;
    } else { // TypedArray instance copied into memory
      if (length === undefined) length = view.length;
    }
    var elementSize = ctor.BYTES_PER_ELEMENT;
    if (!elementSize) throw Error("not a typed array");
    var byteLength = elementSize * length;
    var ptr = memory_allocate(12); // TypedArray header
    var buf = memory_allocate(computeBufferSize(byteLength)); // ArrayBuffer
    checkMem();
    U32[ ptr      >>> 2] = buf;        // .buffer
    U32[(ptr + 4) >>> 2] = 0;          // .byteOffset
    U32[(ptr + 8) >>> 2] = byteLength; // .byteLength
    U32[ buf      >>> 2] = byteLength; // .byteLength
    U32[(buf + 4) >>> 2] = 0;          // 0
    if (view) {
      new ctor(buffer, buf + 8, length).set(view);
      if (view.length < length && !unsafe) {
        let setLength = elementSize * view.length;
        memory_fill(buf + 8 + setLength, 0, byteLength - setLength);
      }
    } else if (!unsafe) {
      memory_fill(buf + 8, 0, byteLength);
    }
    return ptr;
  }

  baseModule.newArray = newArray;

  /** Gets a view on a typed array in the module's memory by its pointer. */
  function getArray(ctor, ptr) {
    var elementSize = ctor.BYTES_PER_ELEMENT;
    if (!elementSize) throw Error("not a typed array");
    checkMem();
    var buf        = U32[ ptr      >>> 2];
    var byteOffset = U32[(ptr + 4) >>> 2];
    var byteLength = U32[(ptr + 8) >>> 2];
    return new ctor(buffer, buf + 8 + byteOffset, (byteLength - byteOffset) / elementSize);
  }

  baseModule.getArray = getArray;

  /** Frees a typed array in the module's memory. Must not be accessed anymore afterwards. */
  function freeArray(ptr) {
    checkMem();
    var buf = U32[ptr >>> 2];
    memory_free(buf);
    memory_free(ptr);
  }

  baseModule.freeArray = freeArray;

  /**
   * Creates a new function in the module's table and returns its pointer. Note that only actual
   * WebAssembly functions, i.e. as exported by the module, are supported.
   */
  function newFunction(fn) {
    if (typeof fn.original === "function") fn = fn.original;
    var index = table.length;
    table.grow(1);
    table.set(index, fn);
    return index;
  }

  baseModule.newFunction = newFunction;

  /** Gets a function by its pointer. */
  function getFunction(ptr) {
    return wrapFunction(table.get(ptr), setargc);
  }

  baseModule.getFunction = getFunction;

  // Pull basic exports to baseModule so code in preInstantiate can use them
  baseModule.memory = baseModule.memory || memory;
  baseModule.table = baseModule.table || table;

  // Demangle exports and provide the usual utility on the prototype
  return demangle(rawExports, Object.defineProperties(baseModule, {
    I8: { get: function() { checkMem(); return I8; } },
    U8: { get: function() { checkMem(); return U8; } },
    I16: { get: function() { checkMem(); return I16; } },
    U16: { get: function() { checkMem(); return U16; } },
    I32: { get: function() { checkMem(); return I32; } },
    U32: { get: function() { checkMem(); return U32; } },
    I64: { get: function() { checkMem(); return I64; } },
    U64: { get: function() { checkMem(); return U64; } },
    F32: { get: function() { checkMem(); return F32; } },
    F64: { get: function() { checkMem(); return F64; } }
  }));
}

/** Wraps a WebAssembly function while also taking care of variable arguments. */
function wrapFunction(fn, setargc) {
  var wrap = (...args) => {
    setargc(args.length);
    return fn(...args);
  }
  // adding a function to the table with `newFunction` is limited to actual WebAssembly functions,
  // hence we can't use the wrapper and instead need to provide a reference to the original
  wrap.original = fn;
  return wrap;
}

/** Instantiates an AssemblyScript module using the specified imports. */
function instantiate(module, imports) {
  return postInstantiate(
    preInstantiate(imports || (imports = {})),
    new WebAssembly.Instance(module, imports)
  );
}

exports.instantiate = instantiate;

/** Instantiates an AssemblyScript module from a buffer using the specified imports. */
function instantiateBuffer(buffer, imports) {
  return instantiate(new WebAssembly.Module(buffer), imports);
}

exports.instantiateBuffer = instantiateBuffer;

/** Instantiates an AssemblyScript module from a response using the specified imports. */
async function instantiateStreaming(response, imports) {
  return postInstantiate(
    preInstantiate(imports || (imports = {})),
    (await WebAssembly.instantiateStreaming(response, imports)).instance
  );
}

exports.instantiateStreaming = instantiateStreaming;

/** Demangles an AssemblyScript module's exports to a friendly object structure. */
function demangle(exports, baseModule) {
  var module = baseModule ? Object.create(baseModule) : {};
  var setargc = exports._setargc || function() {};
  function hasOwnProperty(elem, prop) {
    return Object.prototype.hasOwnProperty.call(elem, prop);
  }
  for (let internalName in exports) {
    if (!hasOwnProperty(exports, internalName)) continue;
    let elem = exports[internalName];
    let parts = internalName.split(".");
    let curr = module;
    while (parts.length > 1) {
      let part = parts.shift();
      if (!hasOwnProperty(curr, part)) curr[part] = {};
      curr = curr[part];
    }
    let name = parts[0];
    let hash = name.indexOf("#");
    if (hash >= 0) {
      let className = name.substring(0, hash);
      let classElem = curr[className];
      if (typeof classElem === "undefined" || !classElem.prototype) {
        let ctor = function(...args) {
          return ctor.wrap(ctor.prototype.constructor(0, ...args));
        };
        ctor.prototype = {};
        ctor.wrap = function(thisValue) {
          return Object.create(ctor.prototype, { [thisPtr]: { value: thisValue, writable: false } });
        };
        if (classElem) Object.getOwnPropertyNames(classElem).forEach(name =>
          Object.defineProperty(ctor, name, Object.getOwnPropertyDescriptor(classElem, name))
        );
        curr[className] = ctor;
      }
      name = name.substring(hash + 1);
      curr = curr[className].prototype;
      if (/^(get|set):/.test(name)) {
        if (!hasOwnProperty(curr, name = name.substring(4))) {
          let getter = exports[internalName.replace("set:", "get:")];
          let setter = exports[internalName.replace("get:", "set:")];
          Object.defineProperty(curr, name, {
            get: function() { return getter(this[thisPtr]); },
            set: function(value) { setter(this[thisPtr], value); },
            enumerable: true
          });
        }
      } else {
        if (name === 'constructor') {
          curr[name] = wrapFunction(elem, setargc);
        } else { // for methods
          Object.defineProperty(curr, name, {
            value: function (...args) {
              setargc(args.length);
              return elem(this[thisPtr], ...args);
            }
          });
        }
      }
    } else {
      if (/^(get|set):/.test(name)) {
        if (!hasOwnProperty(curr, name = name.substring(4))) {
          Object.defineProperty(curr, name, {
            get: exports[internalName.replace("set:", "get:")],
            set: exports[internalName.replace("get:", "set:")],
            enumerable: true
          });
        }
      } else if (typeof elem === "function") {
        curr[name] = wrapFunction(elem, setargc);
      } else {
        curr[name] = elem;
      }
    }
  }

  return module;
}

exports.demangle = demangle;

//# sourceMappingURL=node_modules/assemblyscript/lib/loader/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/assemblyscript/lib/loader/index.js",}],
[1653, {}, function (require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

//# sourceMappingURL=node_modules/engine.io-client/node_modules/ms/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/node_modules/ms/index.js",}],
[1641, {}, function (require, module, exports) {
module.exports = (function () {
  if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')(); // eslint-disable-line no-new-func
  }
})();

//# sourceMappingURL=node_modules/engine.io-client/lib/globalThis.browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/globalThis.browser.js",}],
[1902, {}, function (require, module, exports) {

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

//# sourceMappingURL=node_modules/has-cors/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/has-cors/index.js",}],
[1648, {"../transport":1644,"component-inherit":1464,"debug":1651,"engine.io-parser":1654,"parseqs":2871,"xmlhttprequest-ssl":1650,"yeast":3589}, function (require, module, exports) {
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parseqs = require('parseqs');
var parser = require('engine.io-parser');
var inherit = require('component-inherit');
var yeast = require('yeast');
var debug = require('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = require('xmlhttprequest-ssl');
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState && packet.type === 'open') {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

//# sourceMappingURL=node_modules/engine.io-client/lib/transports/polling.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/engine.io-client/lib/transports/polling.js",}],
[1464, {}, function (require, module, exports) {

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
//# sourceMappingURL=node_modules/component-inherit/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/component-inherit/index.js",}],
[3589, {}, function (require, module, exports) {
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

//# sourceMappingURL=node_modules/yeast/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/yeast/index.js",}],
[3284, {}, function (require, module, exports) {
'use strict';

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};

//# sourceMappingURL=node_modules/shortid/lib/random/random-from-seed.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/random/random-from-seed.js",}],
[3280, {"./alphabet":3278,"./random/random-byte":3283,"nanoid/format":2721}, function (require, module, exports) {
'use strict';

var alphabet = require('./alphabet');
var random = require('./random/random-byte');
var format = require('nanoid/format');

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(random, alphabet.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = generate;

//# sourceMappingURL=node_modules/shortid/lib/generate.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/generate.js",}],
[1363, {}, function (require, module, exports) {
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/errors-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/errors-browser.js",}],
[1371, {"_process":2892}, function (require, module, exports) {
(function (process){
'use strict'; // undocumented cb() API, needed for core, not for public API

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
}).call(this,require('_process'))

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/destroy.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/destroy.js",}],
[1376, {"events":1429}, function (require, module, exports) {
module.exports = require('events').EventEmitter;

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/stream-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/stream-browser.js",}],
[1375, {"../../../errors":1363}, function (require, module, exports) {
'use strict';

var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

module.exports = {
  getHighWaterMark: getHighWaterMark
};
//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/state.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/state.js",}],
[1373, {}, function (require, module, exports) {
module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/from-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/from-browser.js",}],
[1370, {"buffer":1428,"util":1398}, function (require, module, exports) {
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('buffer'),
    Buffer = _require.Buffer;

var _require2 = require('util'),
    inspect = _require2.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}

module.exports =
/*#__PURE__*/
function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();
//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/buffer_list.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/buffer_list.js",}],
[1369, {"./end-of-stream":1372,"_process":2892}, function (require, module, exports) {
(function (process){
'use strict';

var _Object$setPrototypeO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var finished = require('./end-of-stream');

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

module.exports = createReadableStreamAsyncIterator;
}).call(this,require('_process'))

//# sourceMappingURL=node_modules/bl/node_modules/readable-stream/lib/internal/streams/async_iterator.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/readable-stream/lib/internal/streams/async_iterator.js",}],
[1379, {"safe-buffer":1378}, function (require, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
//# sourceMappingURL=node_modules/bl/node_modules/string_decoder/lib/string_decoder.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/string_decoder/lib/string_decoder.js",}],
[3283, {}, function (require, module, exports) {
'use strict';

var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
    randomByte = function(size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
    };
} else {
    randomByte = function(size) {
        return crypto.getRandomValues(new Uint8Array(size));
    };
}

module.exports = randomByte;

//# sourceMappingURL=node_modules/shortid/lib/random/random-byte-browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/shortid/lib/random/random-byte-browser.js",}],
[2721, {}, function (require, module, exports) {
// This file replaces `format.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

module.exports = function (random, alphabet, size) {
  // We can’t use bytes bigger than the alphabet. To make bytes values closer
  // to the alphabet, we apply bitmask on them. We look for the closest
  // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
  // 30 symbols in the alphabet, we will take 31 (00011111).
  // We do not use faster Math.clz32, because it is not available in browsers.
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
  // which is bigger than the alphabet). As a result, we will need more bytes,
  // than ID size, because we will refuse bytes bigger than the alphabet.

  // Every hardware random generator call is costly,
  // because we need to wait for entropy collection. This is why often it will
  // be faster to ask for few extra bytes in advance, to avoid additional calls.

  // Here we calculate how many random bytes should we call in advance.
  // It depends on ID length, mask / alphabet size and magic number 1.6
  // (which was selected according benchmarks).

  // -~f => Math.ceil(f) if n is float number
  // -~i => i + 1 if n is integer number
  var step = -~(1.6 * mask * size / alphabet.length)
  var id = ''

  while (true) {
    var bytes = random(step)
    // Compact alternative for `for (var i = 0; i < step; i++)`
    var i = step
    while (i--) {
      // If random byte is bigger than alphabet even after bitmask,
      // we refuse it by `|| ''`.
      id += alphabet[bytes[i] & mask] || ''
      // More compact than `id.length + 1 === size`
      if (id.length === +size) return id
    }
  }
}

//# sourceMappingURL=node_modules/nanoid/format.browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/nanoid/format.browser.js",}],
[1378, {"buffer":1428}, function (require, module, exports) {
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

//# sourceMappingURL=node_modules/bl/node_modules/safe-buffer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/bl/node_modules/safe-buffer/index.js",}],
[4, {"../../shared/constants/app":3591,"../../shared/constants/time":3598,"./first-time-state":37,"./lib/createStreamSink":46,"./lib/ens-ipfs/setup":53,"./lib/get-first-preferred-lang-code":55,"./lib/getObjStructure":56,"./lib/local-store":57,"./lib/migrator":60,"./lib/network-store":61,"./lib/notification-manager":63,"./metamask-controller":79,"./migrations":144,"./platforms/extension":145,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/obs-store":981,"@sentry/browser":997,"_process":2892,"debounce-stream":1562,"end-of-stream":1640,"extension-port-stream":1867,"extensionizer":1869,"loglevel":2657,"pump":2991}, function (require, module, exports) {
(function (process,global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _endOfStream = _interopRequireDefault(require("end-of-stream"));

var _pump = _interopRequireDefault(require("pump"));

var _debounceStream = _interopRequireDefault(require("debounce-stream"));

var _loglevel = _interopRequireDefault(require("loglevel"));

var _extensionizer = _interopRequireDefault(require("extensionizer"));

var _obsStore = require("@metamask/obs-store");

var _extensionPortStream = _interopRequireDefault(require("extension-port-stream"));

var _browser = require("@sentry/browser");

var _app = require("../../shared/constants/app");

var _time = require("../../shared/constants/time");

var _migrations = _interopRequireDefault(require("./migrations"));

var _migrator = _interopRequireDefault(require("./lib/migrator"));

var _extension = _interopRequireDefault(require("./platforms/extension"));

var _localStore = _interopRequireDefault(require("./lib/local-store"));

var _networkStore = _interopRequireDefault(require("./lib/network-store"));

var _createStreamSink = _interopRequireDefault(require("./lib/createStreamSink"));

var _notificationManager = _interopRequireDefault(require("./lib/notification-manager"));

var _metamaskController = _interopRequireWildcard(require("./metamask-controller"));

var _firstTimeState = _interopRequireDefault(require("./first-time-state"));

var _getFirstPreferredLangCode = _interopRequireDefault(require("./lib/get-first-preferred-lang-code"));

var _getObjStructure = _interopRequireDefault(require("./lib/getObjStructure"));

var _setup = _interopRequireDefault(require("./lib/ens-ipfs/setup"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* eslint-enable import/first */
const {
  sentry
} = global;

const firstTimeState = _objectSpread({}, _firstTimeState.default);

_loglevel.default.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'info');

const platform = new _extension.default();
const notificationManager = new _notificationManager.default();
global.METAMASK_NOTIFIER = notificationManager;
let popupIsOpen = false;
let notificationIsOpen = false;
let uiIsTriggering = false;
const openMetamaskTabsIDs = {};
const requestAccountTabIds = {}; // state persistence

const inTest = false === 'true';
const localStore = inTest ? new _networkStore.default() : new _localStore.default();
let versionedData;

if (inTest || process.env.METAMASK_DEBUG) {
  global.metamaskGetState = localStore.get.bind(localStore);
} // initialization flow


initialize().catch(_loglevel.default.error);
/**
 * @typedef {import('../../shared/constants/transaction').TransactionMeta} TransactionMeta
 */

/**
 * The data emitted from the MetaMaskController.store EventEmitter, also used to initialize the MetaMaskController. Available in UI on React state as state.metamask.
 * @typedef MetaMaskState
 * @property {boolean} isInitialized - Whether the first vault has been created.
 * @property {boolean} isUnlocked - Whether the vault is currently decrypted and accounts are available for selection.
 * @property {boolean} isAccountMenuOpen - Represents whether the main account selection UI is currently displayed.
 * @property {Object} identities - An object matching lower-case hex addresses to Identity objects with "address" and "name" (nickname) keys.
 * @property {Object} unapprovedTxs - An object mapping transaction hashes to unapproved transactions.
 * @property {Array} frequentRpcList - A list of frequently used RPCs, including custom user-provided ones.
 * @property {Array} addressBook - A list of previously sent to addresses.
 * @property {Object} contractExchangeRates - Info about current token prices.
 * @property {Array} tokens - Tokens held by the current user, including their balances.
 * @property {Object} send - TODO: Document
 * @property {boolean} useBlockie - Indicates preferred user identicon format. True for blockie, false for Jazzicon.
 * @property {Object} featureFlags - An object for optional feature flags.
 * @property {boolean} welcomeScreen - True if welcome screen should be shown.
 * @property {string} currentLocale - A locale string matching the user's preferred display language.
 * @property {Object} provider - The current selected network provider.
 * @property {string} provider.rpcUrl - The address for the RPC API, if using an RPC API.
 * @property {string} provider.type - An identifier for the type of network selected, allows MetaMask to use custom provider strategies for known networks.
 * @property {string} network - A stringified number of the current network ID.
 * @property {Object} accounts - An object mapping lower-case hex addresses to objects with "balance" and "address" keys, both storing hex string values.
 * @property {hex} currentBlockGasLimit - The most recently seen block gas limit, in a lower case hex prefixed string.
 * @property {TransactionMeta[]} currentNetworkTxList - An array of transactions associated with the currently selected network.
 * @property {Object} unapprovedMsgs - An object of messages pending approval, mapping a unique ID to the options.
 * @property {number} unapprovedMsgCount - The number of messages in unapprovedMsgs.
 * @property {Object} unapprovedPersonalMsgs - An object of messages pending approval, mapping a unique ID to the options.
 * @property {number} unapprovedPersonalMsgCount - The number of messages in unapprovedPersonalMsgs.
 * @property {Object} unapprovedEncryptionPublicKeyMsgs - An object of messages pending approval, mapping a unique ID to the options.
 * @property {number} unapprovedEncryptionPublicKeyMsgCount - The number of messages in EncryptionPublicKeyMsgs.
 * @property {Object} unapprovedDecryptMsgs - An object of messages pending approval, mapping a unique ID to the options.
 * @property {number} unapprovedDecryptMsgCount - The number of messages in unapprovedDecryptMsgs.
 * @property {Object} unapprovedTypedMsgs - An object of messages pending approval, mapping a unique ID to the options.
 * @property {number} unapprovedTypedMsgCount - The number of messages in unapprovedTypedMsgs.
 * @property {number} pendingApprovalCount - The number of pending request in the approval controller.
 * @property {string[]} keyringTypes - An array of unique keyring identifying strings, representing available strategies for creating accounts.
 * @property {Keyring[]} keyrings - An array of keyring descriptions, summarizing the accounts that are available for use, and what keyrings they belong to.
 * @property {string} selectedAddress - A lower case hex string of the currently selected address.
 * @property {string} currentCurrency - A string identifying the user's preferred display currency, for use in showing conversion rates.
 * @property {number} conversionRate - A number representing the current exchange rate from the user's preferred currency to Ether.
 * @property {number} conversionDate - A unix epoch date (ms) for the time the current conversion rate was last retrieved.
 * @property {boolean} forgottenPassword - Returns true if the user has initiated the password recovery screen, is recovering from seed phrase.
 */

/**
 * @typedef VersionedData
 * @property {MetaMaskState} data - The data emitted from MetaMask controller, or used to initialize it.
 * @property {Number} version - The latest migration version that has been run.
 */

/**
 * Initializes the MetaMask controller, and sets up all platform configuration.
 * @returns {Promise} Setup complete.
 */

async function initialize() {
  const initState = await loadStateFromPersistence();
  const initLangCode = await (0, _getFirstPreferredLangCode.default)();
  await setupController(initState, initLangCode);

  _loglevel.default.info('MetaMask initialization complete.');
} //
// State and Persistence
//

/**
 * Loads any stored data, prioritizing the latest storage strategy.
 * Migrates that data schema in case it was last loaded on an older version.
 * @returns {Promise<MetaMaskState>} Last data emitted from previous instance of MetaMask.
 */


async function loadStateFromPersistence() {
  // migrations
  const migrator = new _migrator.default({
    migrations: _migrations.default
  });
  migrator.on('error', console.warn); // read from disk
  // first from preferred, async API:

  versionedData = (await localStore.get()) || migrator.generateInitialState(firstTimeState); // check if somehow state is empty
  // this should never happen but new error reporting suggests that it has
  // for a small number of users
  // https://github.com/metamask/metamask-extension/issues/3919

  if (versionedData && !versionedData.data) {
    // unable to recover, clear state
    versionedData = migrator.generateInitialState(firstTimeState);
    sentry.captureMessage('MetaMask - Empty vault found - unable to recover');
  } // report migration errors to sentry


  migrator.on('error', err => {
    // get vault structure without secrets
    const vaultStructure = (0, _getObjStructure.default)(versionedData);
    sentry.captureException(err, {
      // "extra" key is required by Sentry
      extra: {
        vaultStructure
      }
    });
  }); // migrate data

  versionedData = await migrator.migrateData(versionedData);

  if (!versionedData) {
    throw new Error('MetaMask - migrator returned undefined');
  } // write to disk


  if (localStore.isSupported) {
    localStore.set(versionedData);
  } else {
    // throw in setTimeout so as to not block boot
    setTimeout(() => {
      throw new Error('MetaMask - Localstore not supported');
    });
  } // return just the data


  return versionedData.data;
}
/**
 * Initializes the MetaMask Controller with any initial state and default language.
 * Configures platform-specific error reporting strategy.
 * Streams emitted state updates to platform-specific storage strategy.
 * Creates platform listeners for new Dapps/Contexts, and sets up their data connections to the controller.
 *
 * @param {Object} initState - The initial state to start the controller with, matches the state that is emitted from the controller.
 * @param {string} initLangCode - The region code for the language preferred by the current user.
 * @returns {Promise} After setup is complete.
 */


function setupController(initState, initLangCode) {
  //
  // MetaMask Controller
  //
  const controller = new _metamaskController.default({
    infuraProjectId: "2427b11710884a1c9b13d8836cc9d77c",
    // User confirmation callbacks:
    showUserConfirmation: triggerUi,
    openPopup,
    // initial state
    initState,
    // initial locale code
    initLangCode,
    // platform specific api
    platform,
    extension: _extensionizer.default,
    getRequestAccountTabIds: () => {
      return requestAccountTabIds;
    },
    getOpenMetamaskTabsIds: () => {
      return openMetamaskTabsIDs;
    }
  });
  (0, _setup.default)({
    getCurrentChainId: controller.networkController.getCurrentChainId.bind(controller.networkController),
    getIpfsGateway: controller.preferencesController.getIpfsGateway.bind(controller.preferencesController),
    provider: controller.provider
  }); // setup state persistence

  (0, _pump.default)((0, _obsStore.storeAsStream)(controller.store), (0, _debounceStream.default)(1000), (0, _obsStore.storeTransformStream)(versionifyData), (0, _createStreamSink.default)(persistData), error => {
    _loglevel.default.error('MetaMask - Persistence pipeline failed', error);
  });
  /**
   * Assigns the given state to the versioned object (with metadata), and returns that.
   * @param {Object} state - The state object as emitted by the MetaMaskController.
   * @returns {VersionedData} The state object wrapped in an object that includes a metadata key.
   */

  function versionifyData(state) {
    versionedData.data = state;
    return versionedData;
  }

  let dataPersistenceFailing = false;

  async function persistData(state) {
    if (!state) {
      throw new Error('MetaMask - updated state is missing');
    }

    if (!state.data) {
      throw new Error('MetaMask - updated state does not have data');
    }

    if (localStore.isSupported) {
      try {
        await localStore.set(state);

        if (dataPersistenceFailing) {
          dataPersistenceFailing = false;
        }
      } catch (err) {
        // log error so we dont break the pipeline
        if (!dataPersistenceFailing) {
          dataPersistenceFailing = true;
          (0, _browser.captureException)(err);
        }

        _loglevel.default.error('error setting state in local store:', err);
      }
    }
  } //
  // connect to other contexts
  //


  _extensionizer.default.runtime.onConnect.addListener(connectRemote);

  _extensionizer.default.runtime.onConnectExternal.addListener(connectExternal);

  const metamaskInternalProcessHash = {
    [_app.ENVIRONMENT_TYPE_POPUP]: true,
    [_app.ENVIRONMENT_TYPE_NOTIFICATION]: true,
    [_app.ENVIRONMENT_TYPE_FULLSCREEN]: true
  };
  const metamaskBlockedPorts = ['trezor-connect'];

  const isClientOpenStatus = () => {
    return popupIsOpen || Boolean(Object.keys(openMetamaskTabsIDs).length) || notificationIsOpen;
  };

  const onCloseEnvironmentInstances = (isClientOpen, environmentType) => {
    // if all instances of metamask are closed we call a method on the controller to stop gasFeeController polling
    if (isClientOpen === false) {
      controller.onClientClosed(); // otherwise we want to only remove the polling tokens for the environment type that has closed
    } else {
      // in the case of fullscreen environment a user might have multiple tabs open so we don't want to disconnect all of
      // its corresponding polling tokens unless all tabs are closed.
      if (environmentType === _app.ENVIRONMENT_TYPE_FULLSCREEN && Boolean(Object.keys(openMetamaskTabsIDs).length)) {
        return;
      }

      controller.onEnvironmentTypeClosed(environmentType);
    }
  };
  /**
   * A runtime.Port object, as provided by the browser:
   * @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/Port
   * @typedef Port
   * @type Object
   */

  /**
   * Connects a Port to the MetaMask controller via a multiplexed duplex stream.
   * This method identifies trusted (MetaMask) interfaces, and connects them differently from untrusted (web pages).
   * @param {Port} remotePort - The port provided by a new context.
   */


  function connectRemote(remotePort) {
    const processName = remotePort.name;
    const isMetaMaskInternalProcess = metamaskInternalProcessHash[processName];

    if (metamaskBlockedPorts.includes(remotePort.name)) {
      return;
    }

    if (isMetaMaskInternalProcess) {
      const portStream = new _extensionPortStream.default(remotePort); // communication with popup

      controller.isClientOpen = true;
      controller.setupTrustedCommunication(portStream, remotePort.sender);

      if (processName === _app.ENVIRONMENT_TYPE_POPUP) {
        popupIsOpen = true;
        (0, _endOfStream.default)(portStream, () => {
          popupIsOpen = false;
          const isClientOpen = isClientOpenStatus();
          controller.isClientOpen = isClientOpen;
          onCloseEnvironmentInstances(isClientOpen, _app.ENVIRONMENT_TYPE_POPUP);
        });
      }

      if (processName === _app.ENVIRONMENT_TYPE_NOTIFICATION) {
        notificationIsOpen = true;
        (0, _endOfStream.default)(portStream, () => {
          notificationIsOpen = false;
          const isClientOpen = isClientOpenStatus();
          controller.isClientOpen = isClientOpen;
          onCloseEnvironmentInstances(isClientOpen, _app.ENVIRONMENT_TYPE_NOTIFICATION);
        });
      }

      if (processName === _app.ENVIRONMENT_TYPE_FULLSCREEN) {
        const tabId = remotePort.sender.tab.id;
        openMetamaskTabsIDs[tabId] = true;
        (0, _endOfStream.default)(portStream, () => {
          delete openMetamaskTabsIDs[tabId];
          const isClientOpen = isClientOpenStatus();
          controller.isClientOpen = isClientOpen;
          onCloseEnvironmentInstances(isClientOpen, _app.ENVIRONMENT_TYPE_FULLSCREEN);
        });
      }
    } else {
      if (remotePort.sender && remotePort.sender.tab && remotePort.sender.url) {
        const tabId = remotePort.sender.tab.id;
        const url = new URL(remotePort.sender.url);
        const {
          origin
        } = url;
        remotePort.onMessage.addListener(msg => {
          if (msg.data && msg.data.method === 'eth_requestAccounts') {
            requestAccountTabIds[origin] = tabId;
          }
        });
      }

      connectExternal(remotePort);
    }
  } // communication with page or other extension


  function connectExternal(remotePort) {
    const portStream = new _extensionPortStream.default(remotePort);
    controller.setupUntrustedCommunication(portStream, remotePort.sender);
  } //
  // User Interface setup
  //


  updateBadge();
  controller.txController.on(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge);
  controller.messageManager.on(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge);
  controller.personalMessageManager.on(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge);
  controller.decryptMessageManager.on(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge);
  controller.encryptionPublicKeyManager.on(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge);
  controller.typedMessageManager.on(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge);
  controller.appStateController.on(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE, updateBadge);
  controller.controllerMessenger.subscribe(_metamaskController.METAMASK_CONTROLLER_EVENTS.APPROVAL_STATE_CHANGE, updateBadge);
  /**
   * Updates the Web Extension's "badge" number, on the little fox in the toolbar.
   * The number reflects the current number of pending transactions or message signatures needing user approval.
   */

  function updateBadge() {
    let label = '';
    const unapprovedTxCount = controller.txController.getUnapprovedTxCount();
    const {
      unapprovedMsgCount
    } = controller.messageManager;
    const {
      unapprovedPersonalMsgCount
    } = controller.personalMessageManager;
    const {
      unapprovedDecryptMsgCount
    } = controller.decryptMessageManager;
    const {
      unapprovedEncryptionPublicKeyMsgCount
    } = controller.encryptionPublicKeyManager;
    const {
      unapprovedTypedMessagesCount
    } = controller.typedMessageManager;
    const pendingApprovalCount = controller.approvalController.getTotalApprovalCount();
    const waitingForUnlockCount = controller.appStateController.waitingForUnlock.length;
    const count = unapprovedTxCount + unapprovedMsgCount + unapprovedPersonalMsgCount + unapprovedDecryptMsgCount + unapprovedEncryptionPublicKeyMsgCount + unapprovedTypedMessagesCount + pendingApprovalCount + waitingForUnlockCount;

    if (count) {
      label = String(count);
    }

    _extensionizer.default.browserAction.setBadgeText({
      text: label
    });

    _extensionizer.default.browserAction.setBadgeBackgroundColor({
      color: '#037DD6'
    });
  }

  return Promise.resolve();
} //
// Etc...
//

/**
 * Opens the browser popup for user confirmation
 */


async function triggerUi() {
  const tabs = await platform.getActiveTabs();
  const currentlyActiveMetamaskTab = Boolean(tabs.find(tab => openMetamaskTabsIDs[tab.id])); // Vivaldi is not closing port connection on popup close, so popupIsOpen does not work correctly
  // To be reviewed in the future if this behaviour is fixed - also the way we determine isVivaldi variable might change at some point

  const isVivaldi = tabs.length > 0 && tabs[0].extData && tabs[0].extData.indexOf('vivaldi_tab') > -1;

  if (!uiIsTriggering && (isVivaldi || !popupIsOpen) && !currentlyActiveMetamaskTab) {
    uiIsTriggering = true;

    try {
      await notificationManager.showPopup();
    } finally {
      uiIsTriggering = false;
    }
  }
}
/**
 * Opens the browser popup for user confirmation of watchAsset
 * then it waits until user interact with the UI
 */


async function openPopup() {
  await triggerUi();
  await new Promise(resolve => {
    const interval = setInterval(() => {
      if (!notificationIsOpen) {
        clearInterval(interval);
        resolve();
      }
    }, _time.SECOND);
  });
} // On first install, open a new tab with MetaMask


_extensionizer.default.runtime.onInstalled.addListener(({
  reason
}) => {
  if (reason === 'install' && !(process.env.METAMASK_DEBUG || false)) {
    platform.openExtensionInBrowser();
  }
});


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=app/scripts/background.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/background.js",}]],[4],{})


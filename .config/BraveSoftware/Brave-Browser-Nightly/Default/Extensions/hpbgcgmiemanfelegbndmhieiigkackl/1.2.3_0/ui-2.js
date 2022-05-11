LavaPack.loadBundle([
[2920, {}, function (require, module, exports) {
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.PubNub=t():e.PubNub=t()}(window,function(){return r={},i.m=n=[function(e,t,n){"use strict";e.exports={}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={PNTimeOperation:"PNTimeOperation",PNHistoryOperation:"PNHistoryOperation",PNDeleteMessagesOperation:"PNDeleteMessagesOperation",PNFetchMessagesOperation:"PNFetchMessagesOperation",PNMessageCounts:"PNMessageCountsOperation",PNSubscribeOperation:"PNSubscribeOperation",PNUnsubscribeOperation:"PNUnsubscribeOperation",PNPublishOperation:"PNPublishOperation",PNSignalOperation:"PNSignalOperation",PNAddMessageActionOperation:"PNAddActionOperation",PNRemoveMessageActionOperation:"PNRemoveMessageActionOperation",PNGetMessageActionsOperation:"PNGetMessageActionsOperation",PNCreateUserOperation:"PNCreateUserOperation",PNUpdateUserOperation:"PNUpdateUserOperation",PNDeleteUserOperation:"PNDeleteUserOperation",PNGetUserOperation:"PNGetUsersOperation",PNGetUsersOperation:"PNGetUsersOperation",PNCreateSpaceOperation:"PNCreateSpaceOperation",PNUpdateSpaceOperation:"PNUpdateSpaceOperation",PNDeleteSpaceOperation:"PNDeleteSpaceOperation",PNGetSpaceOperation:"PNGetSpacesOperation",PNGetSpacesOperation:"PNGetSpacesOperation",PNGetMembersOperation:"PNGetMembersOperation",PNUpdateMembersOperation:"PNUpdateMembersOperation",PNGetMembershipsOperation:"PNGetMembershipsOperation",PNUpdateMembershipsOperation:"PNUpdateMembershipsOperation",PNPushNotificationEnabledChannelsOperation:"PNPushNotificationEnabledChannelsOperation",PNRemoveAllPushNotificationsOperation:"PNRemoveAllPushNotificationsOperation",PNWhereNowOperation:"PNWhereNowOperation",PNSetStateOperation:"PNSetStateOperation",PNHereNowOperation:"PNHereNowOperation",PNGetStateOperation:"PNGetStateOperation",PNHeartbeatOperation:"PNHeartbeatOperation",PNChannelGroupsOperation:"PNChannelGroupsOperation",PNRemoveGroupOperation:"PNRemoveGroupOperation",PNChannelsForGroupOperation:"PNChannelsForGroupOperation",PNAddChannelsToGroupOperation:"PNAddChannelsToGroupOperation",PNRemoveChannelsFromGroupOperation:"PNRemoveChannelsFromGroupOperation",PNAccessManagerGrant:"PNAccessManagerGrant",PNAccessManagerGrantToken:"PNAccessManagerGrantToken",PNAccessManagerAudit:"PNAccessManagerAudit"},e.exports=t.default},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/[!~*'()]/g,function(e){return"%".concat(e.charCodeAt(0).toString(16).toUpperCase())})}function i(e){return function(e){var t=[];return Object.keys(e).forEach(function(e){return t.push(e)}),t}(e).sort()}e.exports={signPamFromParams:function(t){return i(t).map(function(e){return"".concat(e,"=").concat(r(t[e]))}).join("&")},endsWith:function(e,t){return-1!==e.indexOf(t,this.length-t.length)},createPromise:function(){var n,r;return{promise:new Promise(function(e,t){n=e,r=t}),reject:r,fulfill:n}},encodeString:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,i=(r=n(5))&&r.__esModule?r:{default:r};n(0);function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a,u,c,f=(a=l,(u=[{key:"getAuthKey",value:function(){return this.authKey}},{key:"setAuthKey",value:function(e){return this.authKey=e,this}},{key:"setCipherKey",value:function(e){return this.cipherKey=e,this}},{key:"getUUID",value:function(){return this.UUID}},{key:"setUUID",value:function(e){return this._db&&this._db.set&&this._db.set("".concat(this.subscribeKey,"uuid"),e),this.UUID=e,this}},{key:"getFilterExpression",value:function(){return this.filterExpression}},{key:"setFilterExpression",value:function(e){return this.filterExpression=e,this}},{key:"getPresenceTimeout",value:function(){return this._presenceTimeout}},{key:"setPresenceTimeout",value:function(e){return 20<=e?this._presenceTimeout=e:(this._presenceTimeout=20,console.log("WARNING: Presence timeout is less than the minimum. Using minimum value: ",this._presenceTimeout)),this.setHeartbeatInterval(this._presenceTimeout/2-1),this}},{key:"setProxy",value:function(e){this.proxy=e}},{key:"getHeartbeatInterval",value:function(){return this._heartbeatInterval}},{key:"setHeartbeatInterval",value:function(e){return this._heartbeatInterval=e,this}},{key:"getSubscribeTimeout",value:function(){return this._subscribeRequestTimeout}},{key:"setSubscribeTimeout",value:function(e){return this._subscribeRequestTimeout=e,this}},{key:"getTransactionTimeout",value:function(){return this._transactionalRequestTimeout}},{key:"setTransactionTimeout",value:function(e){return this._transactionalRequestTimeout=e,this}},{key:"isSendBeaconEnabled",value:function(){return this._useSendBeacon}},{key:"setSendBeaconConfig",value:function(e){return this._useSendBeacon=e,this}},{key:"getVersion",value:function(){return"4.27.3"}},{key:"_addPnsdkSuffix",value:function(e,t){this._PNSDKSuffix[e]=t}},{key:"_getPnsdkSuffix",value:function(n){var r=this;return Object.keys(this._PNSDKSuffix).reduce(function(e,t){return e+n+r._PNSDKSuffix[t]},"")}},{key:"_decideUUID",value:function(e){return e||(this._db&&this._db.get&&this._db.get("".concat(this.subscribeKey,"uuid"))?this._db.get("".concat(this.subscribeKey,"uuid")):"pn-".concat(i.default.createUUID()))}}])&&o(a.prototype,u),void(c&&o(a,c)),l);function l(e){var t=e.setup,n=e.db;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),s(this,"_db",void 0),s(this,"subscribeKey",void 0),s(this,"publishKey",void 0),s(this,"secretKey",void 0),s(this,"cipherKey",void 0),s(this,"authKey",void 0),s(this,"UUID",void 0),s(this,"proxy",void 0),s(this,"instanceId",void 0),s(this,"sdkName",void 0),s(this,"sdkFamily",void 0),s(this,"partnerId",void 0),s(this,"filterExpression",void 0),s(this,"suppressLeaveEvents",void 0),s(this,"secure",void 0),s(this,"origin",void 0),s(this,"logVerbosity",void 0),s(this,"useInstanceId",void 0),s(this,"useRequestId",void 0),s(this,"keepAlive",void 0),s(this,"keepAliveSettings",void 0),s(this,"autoNetworkDetection",void 0),s(this,"announceSuccessfulHeartbeats",void 0),s(this,"announceFailedHeartbeats",void 0),s(this,"_presenceTimeout",void 0),s(this,"_heartbeatInterval",void 0),s(this,"_subscribeRequestTimeout",void 0),s(this,"_transactionalRequestTimeout",void 0),s(this,"_useSendBeacon",void 0),s(this,"_PNSDKSuffix",void 0),s(this,"requestMessageCountThreshold",void 0),s(this,"restore",void 0),s(this,"dedupeOnSubscribe",void 0),s(this,"maximumCacheSize",void 0),s(this,"customEncrypt",void 0),s(this,"customDecrypt",void 0),this._PNSDKSuffix={},this._db=n,this.instanceId="pn-".concat(i.default.createUUID()),this.secretKey=t.secretKey||t.secret_key,this.subscribeKey=t.subscribeKey||t.subscribe_key,this.publishKey=t.publishKey||t.publish_key,this.sdkName=t.sdkName,this.sdkFamily=t.sdkFamily,this.partnerId=t.partnerId,this.setAuthKey(t.authKey),this.setCipherKey(t.cipherKey),this.setFilterExpression(t.filterExpression),this.origin=t.origin||"ps.pndsn.com",this.secure=t.ssl||!1,this.restore=t.restore||!1,this.proxy=t.proxy,this.keepAlive=t.keepAlive,this.keepAliveSettings=t.keepAliveSettings,this.autoNetworkDetection=t.autoNetworkDetection||!1,this.dedupeOnSubscribe=t.dedupeOnSubscribe||!1,this.maximumCacheSize=t.maximumCacheSize||100,this.customEncrypt=t.customEncrypt,this.customDecrypt=t.customDecrypt,"undefined"!=typeof location&&"https:"===location.protocol&&(this.secure=!0),this.logVerbosity=t.logVerbosity||!1,this.suppressLeaveEvents=t.suppressLeaveEvents||!1,this.announceFailedHeartbeats=t.announceFailedHeartbeats||!0,this.announceSuccessfulHeartbeats=t.announceSuccessfulHeartbeats||!1,this.useInstanceId=t.useInstanceId||!1,this.useRequestId=t.useRequestId||!1,this.requestMessageCountThreshold=t.requestMessageCountThreshold,this.setTransactionTimeout(t.transactionalRequestTimeout||15e3),this.setSubscribeTimeout(t.subscribeRequestTimeout||31e4),this.setSendBeaconConfig(t.useSendBeacon||!0),t.presenceTimeout?this.setPresenceTimeout(t.presenceTimeout):this._presenceTimeout=300,null!=t.heartbeatInterval&&this.setHeartbeatInterval(t.heartbeatInterval),this.setUUID(this._decideUUID(t.uuid))}t.default=f,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={PNNetworkUpCategory:"PNNetworkUpCategory",PNNetworkDownCategory:"PNNetworkDownCategory",PNNetworkIssuesCategory:"PNNetworkIssuesCategory",PNTimeoutCategory:"PNTimeoutCategory",PNBadRequestCategory:"PNBadRequestCategory",PNAccessDeniedCategory:"PNAccessDeniedCategory",PNUnknownCategory:"PNUnknownCategory",PNReconnectedCategory:"PNReconnectedCategory",PNConnectedCategory:"PNConnectedCategory",PNRequestMessageCountExceededCategory:"PNRequestMessageCountExceededCategory"},e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,i=(r=n(13))&&r.__esModule?r:{default:r};var o={createUUID:function(){return i.default.uuid?i.default.uuid():(0,i.default)()}};t.default=o,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;r(n(3));var u=r(n(14));function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,c,f=(s=l,(a=[{key:"HMACSHA256",value:function(e){return u.default.HmacSHA256(e,this._config.secretKey).toString(u.default.enc.Base64)}},{key:"SHA256",value:function(e){return u.default.SHA256(e).toString(u.default.enc.Hex)}},{key:"_parseOptions",value:function(e){var t=e||{};return t.hasOwnProperty("encryptKey")||(t.encryptKey=this._defaultOptions.encryptKey),t.hasOwnProperty("keyEncoding")||(t.keyEncoding=this._defaultOptions.keyEncoding),t.hasOwnProperty("keyLength")||(t.keyLength=this._defaultOptions.keyLength),t.hasOwnProperty("mode")||(t.mode=this._defaultOptions.mode),-1===this._allowedKeyEncodings.indexOf(t.keyEncoding.toLowerCase())&&(t.keyEncoding=this._defaultOptions.keyEncoding),-1===this._allowedKeyLengths.indexOf(parseInt(t.keyLength,10))&&(t.keyLength=this._defaultOptions.keyLength),-1===this._allowedModes.indexOf(t.mode.toLowerCase())&&(t.mode=this._defaultOptions.mode),t}},{key:"_decodeKey",value:function(e,t){return"base64"===t.keyEncoding?u.default.enc.Base64.parse(e):"hex"===t.keyEncoding?u.default.enc.Hex.parse(e):e}},{key:"_getPaddedKey",value:function(e,t){return e=this._decodeKey(e,t),t.encryptKey?u.default.enc.Utf8.parse(this.SHA256(e).slice(0,32)):e}},{key:"_getMode",value:function(e){return"ecb"===e.mode?u.default.mode.ECB:u.default.mode.CBC}},{key:"_getIV",value:function(e){return"cbc"===e.mode?u.default.enc.Utf8.parse(this._iv):null}},{key:"encrypt",value:function(e,t,n){return this._config.customEncrypt?this._config.customEncrypt(e):this.pnEncrypt(e,t,n)}},{key:"decrypt",value:function(e,t,n){return this._config.customDecrypt?this._config.customDecrypt(e):this.pnDecrypt(e,t,n)}},{key:"pnEncrypt",value:function(e,t,n){if(!t&&!this._config.cipherKey)return e;n=this._parseOptions(n);var r=this._getIV(n),i=this._getMode(n),o=this._getPaddedKey(t||this._config.cipherKey,n);return u.default.AES.encrypt(e,o,{iv:r,mode:i}).ciphertext.toString(u.default.enc.Base64)||e}},{key:"pnDecrypt",value:function(e,t,n){if(!t&&!this._config.cipherKey)return e;n=this._parseOptions(n);var r=this._getIV(n),i=this._getMode(n),o=this._getPaddedKey(t||this._config.cipherKey,n);try{var s=u.default.enc.Base64.parse(e),a=u.default.AES.decrypt({ciphertext:s},o,{iv:r,mode:i}).toString(u.default.enc.Utf8);return JSON.parse(a)}catch(e){return null}}}])&&i(s.prototype,a),void(c&&i(s,c)),l);function l(e){var t=e.config;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),o(this,"_config",void 0),o(this,"_iv",void 0),o(this,"_allowedKeyEncodings",void 0),o(this,"_allowedKeyLengths",void 0),o(this,"_allowedModes",void 0),o(this,"_defaultOptions",void 0),this._config=t,this._iv="0123456789012345",this._allowedKeyEncodings=["hex","utf8","base64","binary"],this._allowedKeyLengths=[128,256],this._allowedModes=["ecb","cbc"],this._defaultOptions={encryptKey:!0,keyEncoding:"utf8",keyLength:256,mode:"cbc"}}t.default=f,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;n(0);var r,i=(r=n(4))&&r.__esModule?r:{default:r};function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var s,a,u,c=(s=f,(a=[{key:"addListener",value:function(e){this._listeners.push(e)}},{key:"removeListener",value:function(t){var n=[];this._listeners.forEach(function(e){e!==t&&n.push(e)}),this._listeners=n}},{key:"removeAllListeners",value:function(){this._listeners=[]}},{key:"announcePresence",value:function(t){this._listeners.forEach(function(e){e.presence&&e.presence(t)})}},{key:"announceStatus",value:function(t){this._listeners.forEach(function(e){e.status&&e.status(t)})}},{key:"announceMessage",value:function(t){this._listeners.forEach(function(e){e.message&&e.message(t)})}},{key:"announceSignal",value:function(t){this._listeners.forEach(function(e){e.signal&&e.signal(t)})}},{key:"announceMessageAction",value:function(t){this._listeners.forEach(function(e){e.messageAction&&e.messageAction(t)})}},{key:"announceUser",value:function(t){this._listeners.forEach(function(e){e.user&&e.user(t)})}},{key:"announceSpace",value:function(t){this._listeners.forEach(function(e){e.space&&e.space(t)})}},{key:"announceMembership",value:function(t){this._listeners.forEach(function(e){e.membership&&e.membership(t)})}},{key:"announceNetworkUp",value:function(){var e={};e.category=i.default.PNNetworkUpCategory,this.announceStatus(e)}},{key:"announceNetworkDown",value:function(){var e={};e.category=i.default.PNNetworkDownCategory,this.announceStatus(e)}}])&&o(s.prototype,a),void(u&&o(s,u)),f);function f(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),function(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(this,"_listeners",void 0),this._listeners=[]}t.default=c,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNTimeOperation},t.getURL=function(){return"/time/0"},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.prepareParams=function(){return{}},t.isAuthSupported=function(){return!1},t.handleResponse=function(e,t){return{timetoken:t[0]}},t.validateParams=function(){};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,I,D){"use strict";(function(e){var r=D(71),o=D(72),s=D(73);function n(){return l.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function a(e,t){if(n()<t)throw new RangeError("Invalid typed array length");return l.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t)).__proto__=l.prototype:(null===e&&(e=new l(t)),e.length=t),e}function l(e,t,n){if(!(l.TYPED_ARRAY_SUPPORT||this instanceof l))return new l(e,t,n);if("number"!=typeof e)return i(this,e,t,n);if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return c(this,e)}function i(e,t,n,r){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?function(e,t,n,r){if(t.byteLength,n<0||t.byteLength<n)throw new RangeError("'offset' is out of bounds");if(t.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");t=void 0===n&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,n):new Uint8Array(t,n,r);l.TYPED_ARRAY_SUPPORT?(e=t).__proto__=l.prototype:e=f(e,t);return e}(e,t,n,r):"string"==typeof t?function(e,t,n){"string"==typeof n&&""!==n||(n="utf8");if(!l.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|p(t,n),i=(e=a(e,r)).write(t,n);i!==r&&(e=e.slice(0,i));return e}(e,t,n):function(e,t){if(l.isBuffer(t)){var n=0|h(t.length);return 0===(e=a(e,n)).length||t.copy(e,0,0,n),e}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return"number"!=typeof t.length||function(e){return e!=e}(t.length)?a(e,0):f(e,t);if("Buffer"===t.type&&s(t.data))return f(e,t.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(e,t)}function u(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function c(e,t){if(u(t),e=a(e,t<0?0:0|h(t)),!l.TYPED_ARRAY_SUPPORT)for(var n=0;n<t;++n)e[n]=0;return e}function f(e,t){var n=t.length<0?0:0|h(t.length);e=a(e,n);for(var r=0;r<n;r+=1)e[r]=255&t[r];return e}function h(e){if(e>=n())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+n().toString(16)+" bytes");return 0|e}function p(e,t){if(l.isBuffer(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var n=e.length;if(0===n)return 0;for(var r=!1;;)switch(t){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return x(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return U(e).length;default:if(r)return x(e).length;t=(""+t).toLowerCase(),r=!0}}function d(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function g(e,t,n,r,i){if(0===e.length)return-1;if("string"==typeof n?(r=n,n=0):2147483647<n?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,isNaN(n)&&(n=i?0:e.length-1),n<0&&(n=e.length+n),n>=e.length){if(i)return-1;n=e.length-1}else if(n<0){if(!i)return-1;n=0}if("string"==typeof t&&(t=l.from(t,r)),l.isBuffer(t))return 0===t.length?-1:y(e,t,n,r,i);if("number"==typeof t)return t&=255,l.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(e,t,n):Uint8Array.prototype.lastIndexOf.call(e,t,n):y(e,[t],n,r,i);throw new TypeError("val must be string, number or Buffer")}function y(e,t,n,r,i){var o,s=1,a=e.length,u=t.length;if(void 0!==r&&("ucs2"===(r=String(r).toLowerCase())||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(e.length<2||t.length<2)return-1;a/=s=2,u/=2,n/=2}function c(e,t){return 1===s?e[t]:e.readUInt16BE(t*s)}if(i){var f=-1;for(o=n;o<a;o++)if(c(e,o)===c(t,-1===f?0:o-f)){if(-1===f&&(f=o),o-f+1===u)return f*s}else-1!==f&&(o-=o-f),f=-1}else for(a<n+u&&(n=a-u),o=n;0<=o;o--){for(var l=!0,h=0;h<u;h++)if(c(e,o+h)!==c(t,h)){l=!1;break}if(l)return o}return-1}function v(e,t,n,r){n=Number(n)||0;var i=e.length-n;r?i<(r=Number(r))&&(r=i):r=i;var o=t.length;if(o%2!=0)throw new TypeError("Invalid hex string");o/2<r&&(r=o/2);for(var s=0;s<r;++s){var a=parseInt(t.substr(2*s,2),16);if(isNaN(a))return s;e[n+s]=a}return s}function b(e,t,n,r){return B(function(e){for(var t=[],n=0;n<e.length;++n)t.push(255&e.charCodeAt(n));return t}(t),e,n,r)}function m(e,t,n){return 0===t&&n===e.length?r.fromByteArray(e):r.fromByteArray(e.slice(t,n))}function _(e,t,n){n=Math.min(e.length,n);for(var r=[],i=t;i<n;){var o,s,a,u,c=e[i],f=null,l=239<c?4:223<c?3:191<c?2:1;if(i+l<=n)switch(l){case 1:c<128&&(f=c);break;case 2:128==(192&(o=e[i+1]))&&127<(u=(31&c)<<6|63&o)&&(f=u);break;case 3:o=e[i+1],s=e[i+2],128==(192&o)&&128==(192&s)&&2047<(u=(15&c)<<12|(63&o)<<6|63&s)&&(u<55296||57343<u)&&(f=u);break;case 4:o=e[i+1],s=e[i+2],a=e[i+3],128==(192&o)&&128==(192&s)&&128==(192&a)&&65535<(u=(15&c)<<18|(63&o)<<12|(63&s)<<6|63&a)&&u<1114112&&(f=u)}null===f?(f=65533,l=1):65535<f&&(f-=65536,r.push(f>>>10&1023|55296),f=56320|1023&f),r.push(f),i+=l}return function(e){var t=e.length;if(t<=k)return String.fromCharCode.apply(String,e);var n="",r=0;for(;r<t;)n+=String.fromCharCode.apply(String,e.slice(r,r+=k));return n}(r)}I.Buffer=l,I.SlowBuffer=function(e){+e!=e&&(e=0);return l.alloc(+e)},I.INSPECT_MAX_BYTES=50,l.TYPED_ARRAY_SUPPORT=void 0!==e.TYPED_ARRAY_SUPPORT?e.TYPED_ARRAY_SUPPORT:function(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(e){return!1}}(),I.kMaxLength=n(),l.poolSize=8192,l._augment=function(e){return e.__proto__=l.prototype,e},l.from=function(e,t,n){return i(null,e,t,n)},l.TYPED_ARRAY_SUPPORT&&(l.prototype.__proto__=Uint8Array.prototype,l.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&l[Symbol.species]===l&&Object.defineProperty(l,Symbol.species,{value:null,configurable:!0})),l.alloc=function(e,t,n){return function(e,t,n,r){return u(t),t<=0?a(e,t):void 0!==n?"string"==typeof r?a(e,t).fill(n,r):a(e,t).fill(n):a(e,t)}(null,e,t,n)},l.allocUnsafe=function(e){return c(null,e)},l.allocUnsafeSlow=function(e){return c(null,e)},l.isBuffer=function(e){return!(null==e||!e._isBuffer)},l.compare=function(e,t){if(!l.isBuffer(e)||!l.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var n=e.length,r=t.length,i=0,o=Math.min(n,r);i<o;++i)if(e[i]!==t[i]){n=e[i],r=t[i];break}return n<r?-1:r<n?1:0},l.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},l.concat=function(e,t){if(!s(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return l.alloc(0);var n;if(void 0===t)for(n=t=0;n<e.length;++n)t+=e[n].length;var r=l.allocUnsafe(t),i=0;for(n=0;n<e.length;++n){var o=e[n];if(!l.isBuffer(o))throw new TypeError('"list" argument must be an Array of Buffers');o.copy(r,i),i+=o.length}return r},l.byteLength=p,l.prototype._isBuffer=!0,l.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)d(this,t,t+1);return this},l.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)d(this,t,t+3),d(this,t+1,t+2);return this},l.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)d(this,t,t+7),d(this,t+1,t+6),d(this,t+2,t+5),d(this,t+3,t+4);return this},l.prototype.toString=function(){var e=0|this.length;return 0==e?"":0===arguments.length?_(this,0,e):function(e,t,n){var r=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if((n>>>=0)<=(t>>>=0))return"";for(e=e||"utf8";;)switch(e){case"hex":return T(this,t,n);case"utf8":case"utf-8":return _(this,t,n);case"ascii":return P(this,t,n);case"latin1":case"binary":return w(this,t,n);case"base64":return m(this,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return O(this,t,n);default:if(r)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),r=!0}}.apply(this,arguments)},l.prototype.equals=function(e){if(!l.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===l.compare(this,e)},l.prototype.inspect=function(){var e="",t=I.INSPECT_MAX_BYTES;return 0<this.length&&(e=this.toString("hex",0,t).match(/.{2}/g).join(" "),this.length>t&&(e+=" ... ")),"<Buffer "+e+">"},l.prototype.compare=function(e,t,n,r,i){if(!l.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===n&&(n=e?e.length:0),void 0===r&&(r=0),void 0===i&&(i=this.length),t<0||n>e.length||r<0||i>this.length)throw new RangeError("out of range index");if(i<=r&&n<=t)return 0;if(i<=r)return-1;if(n<=t)return 1;if(this===e)return 0;for(var o=(i>>>=0)-(r>>>=0),s=(n>>>=0)-(t>>>=0),a=Math.min(o,s),u=this.slice(r,i),c=e.slice(t,n),f=0;f<a;++f)if(u[f]!==c[f]){o=u[f],s=c[f];break}return o<s?-1:s<o?1:0},l.prototype.includes=function(e,t,n){return-1!==this.indexOf(e,t,n)},l.prototype.indexOf=function(e,t,n){return g(this,e,t,n,!0)},l.prototype.lastIndexOf=function(e,t,n){return g(this,e,t,n,!1)},l.prototype.write=function(e,t,n,r){if(void 0===t)r="utf8",n=this.length,t=0;else if(void 0===n&&"string"==typeof t)r=t,n=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t|=0,isFinite(n)?(n|=0,void 0===r&&(r="utf8")):(r=n,n=void 0)}var i=this.length-t;if((void 0===n||i<n)&&(n=i),0<e.length&&(n<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");r=r||"utf8";for(var o,s,a,u,c,f,l,h,p,d=!1;;)switch(r){case"hex":return v(this,e,t,n);case"utf8":case"utf-8":return h=t,p=n,B(x(e,(l=this).length-h),l,h,p);case"ascii":return b(this,e,t,n);case"latin1":case"binary":return b(this,e,t,n);case"base64":return u=this,c=t,f=n,B(U(e),u,c,f);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return s=t,a=n,B(function(e,t){for(var n,r,i,o=[],s=0;s<e.length&&!((t-=2)<0);++s)n=e.charCodeAt(s),r=n>>8,i=n%256,o.push(i),o.push(r);return o}(e,(o=this).length-s),o,s,a);default:if(d)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),d=!0}},l.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var k=4096;function P(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(127&e[i]);return r}function w(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(e[i]);return r}function T(e,t,n){var r=e.length;(!t||t<0)&&(t=0),(!n||n<0||r<n)&&(n=r);for(var i="",o=t;o<n;++o)i+=N(e[o]);return i}function O(e,t,n){for(var r=e.slice(t,n),i="",o=0;o<r.length;o+=2)i+=String.fromCharCode(r[o]+256*r[o+1]);return i}function S(e,t,n){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(n<e+t)throw new RangeError("Trying to access beyond buffer length")}function M(e,t,n,r,i,o){if(!l.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(i<t||t<o)throw new RangeError('"value" argument is out of bounds');if(n+r>e.length)throw new RangeError("Index out of range")}function E(e,t,n,r){t<0&&(t=65535+t+1);for(var i=0,o=Math.min(e.length-n,2);i<o;++i)e[n+i]=(t&255<<8*(r?i:1-i))>>>8*(r?i:1-i)}function A(e,t,n,r){t<0&&(t=4294967295+t+1);for(var i=0,o=Math.min(e.length-n,4);i<o;++i)e[n+i]=t>>>8*(r?i:3-i)&255}function C(e,t,n,r){if(n+r>e.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function R(e,t,n,r,i){return i||C(e,0,n,4),o.write(e,t,n,r,23,4),n+4}function j(e,t,n,r,i){return i||C(e,0,n,8),o.write(e,t,n,r,52,8),n+8}l.prototype.slice=function(e,t){var n,r=this.length;if((e=~~e)<0?(e+=r)<0&&(e=0):r<e&&(e=r),(t=void 0===t?r:~~t)<0?(t+=r)<0&&(t=0):r<t&&(t=r),t<e&&(t=e),l.TYPED_ARRAY_SUPPORT)(n=this.subarray(e,t)).__proto__=l.prototype;else{var i=t-e;n=new l(i,void 0);for(var o=0;o<i;++o)n[o]=this[o+e]}return n},l.prototype.readUIntLE=function(e,t,n){e|=0,t|=0,n||S(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return r},l.prototype.readUIntBE=function(e,t,n){e|=0,t|=0,n||S(e,t,this.length);for(var r=this[e+--t],i=1;0<t&&(i*=256);)r+=this[e+--t]*i;return r},l.prototype.readUInt8=function(e,t){return t||S(e,1,this.length),this[e]},l.prototype.readUInt16LE=function(e,t){return t||S(e,2,this.length),this[e]|this[e+1]<<8},l.prototype.readUInt16BE=function(e,t){return t||S(e,2,this.length),this[e]<<8|this[e+1]},l.prototype.readUInt32LE=function(e,t){return t||S(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},l.prototype.readUInt32BE=function(e,t){return t||S(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},l.prototype.readIntLE=function(e,t,n){e|=0,t|=0,n||S(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return(i*=128)<=r&&(r-=Math.pow(2,8*t)),r},l.prototype.readIntBE=function(e,t,n){e|=0,t|=0,n||S(e,t,this.length);for(var r=t,i=1,o=this[e+--r];0<r&&(i*=256);)o+=this[e+--r]*i;return(i*=128)<=o&&(o-=Math.pow(2,8*t)),o},l.prototype.readInt8=function(e,t){return t||S(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},l.prototype.readInt16LE=function(e,t){t||S(e,2,this.length);var n=this[e]|this[e+1]<<8;return 32768&n?4294901760|n:n},l.prototype.readInt16BE=function(e,t){t||S(e,2,this.length);var n=this[e+1]|this[e]<<8;return 32768&n?4294901760|n:n},l.prototype.readInt32LE=function(e,t){return t||S(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},l.prototype.readInt32BE=function(e,t){return t||S(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},l.prototype.readFloatLE=function(e,t){return t||S(e,4,this.length),o.read(this,e,!0,23,4)},l.prototype.readFloatBE=function(e,t){return t||S(e,4,this.length),o.read(this,e,!1,23,4)},l.prototype.readDoubleLE=function(e,t){return t||S(e,8,this.length),o.read(this,e,!0,52,8)},l.prototype.readDoubleBE=function(e,t){return t||S(e,8,this.length),o.read(this,e,!1,52,8)},l.prototype.writeUIntLE=function(e,t,n,r){e=+e,t|=0,n|=0,r||M(this,e,t,n,Math.pow(2,8*n)-1,0);var i=1,o=0;for(this[t]=255&e;++o<n&&(i*=256);)this[t+o]=e/i&255;return t+n},l.prototype.writeUIntBE=function(e,t,n,r){e=+e,t|=0,n|=0,r||M(this,e,t,n,Math.pow(2,8*n)-1,0);var i=n-1,o=1;for(this[t+i]=255&e;0<=--i&&(o*=256);)this[t+i]=e/o&255;return t+n},l.prototype.writeUInt8=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,1,255,0),l.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},l.prototype.writeUInt16LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,65535,0),l.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):E(this,e,t,!0),t+2},l.prototype.writeUInt16BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,65535,0),l.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):E(this,e,t,!1),t+2},l.prototype.writeUInt32LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,4294967295,0),l.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):A(this,e,t,!0),t+4},l.prototype.writeUInt32BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,4294967295,0),l.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):A(this,e,t,!1),t+4},l.prototype.writeIntLE=function(e,t,n,r){if(e=+e,t|=0,!r){var i=Math.pow(2,8*n-1);M(this,e,t,n,i-1,-i)}var o=0,s=1,a=0;for(this[t]=255&e;++o<n&&(s*=256);)e<0&&0===a&&0!==this[t+o-1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+n},l.prototype.writeIntBE=function(e,t,n,r){if(e=+e,t|=0,!r){var i=Math.pow(2,8*n-1);M(this,e,t,n,i-1,-i)}var o=n-1,s=1,a=0;for(this[t+o]=255&e;0<=--o&&(s*=256);)e<0&&0===a&&0!==this[t+o+1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+n},l.prototype.writeInt8=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,1,127,-128),l.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},l.prototype.writeInt16LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,32767,-32768),l.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):E(this,e,t,!0),t+2},l.prototype.writeInt16BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,32767,-32768),l.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):E(this,e,t,!1),t+2},l.prototype.writeInt32LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,2147483647,-2147483648),l.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):A(this,e,t,!0),t+4},l.prototype.writeInt32BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),l.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):A(this,e,t,!1),t+4},l.prototype.writeFloatLE=function(e,t,n){return R(this,e,t,!0,n)},l.prototype.writeFloatBE=function(e,t,n){return R(this,e,t,!1,n)},l.prototype.writeDoubleLE=function(e,t,n){return j(this,e,t,!0,n)},l.prototype.writeDoubleBE=function(e,t,n){return j(this,e,t,!1,n)},l.prototype.copy=function(e,t,n,r){if(n=n||0,r||0===r||(r=this.length),t>=e.length&&(t=e.length),t=t||0,0<r&&r<n&&(r=n),r===n)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-t<r-n&&(r=e.length-t+n);var i,o=r-n;if(this===e&&n<t&&t<r)for(i=o-1;0<=i;--i)e[i+t]=this[i+n];else if(o<1e3||!l.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)e[i+t]=this[i+n];else Uint8Array.prototype.set.call(e,this.subarray(n,n+o),t);return o},l.prototype.fill=function(e,t,n,r){if("string"==typeof e){if("string"==typeof t?(r=t,t=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===e.length){var i=e.charCodeAt(0);i<256&&(e=i)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!l.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<n)throw new RangeError("Out of range index");if(n<=t)return this;var o;if(t>>>=0,n=void 0===n?this.length:n>>>0,"number"==typeof(e=e||0))for(o=t;o<n;++o)this[o]=e;else{var s=l.isBuffer(e)?e:x(new l(e,r).toString()),a=s.length;for(o=0;o<n-t;++o)this[o+t]=s[o%a]}return this};var t=/[^+\/0-9A-Za-z-_]/g;function N(e){return e<16?"0"+e.toString(16):e.toString(16)}function x(e,t){var n;t=t||1/0;for(var r=e.length,i=null,o=[],s=0;s<r;++s){if(55295<(n=e.charCodeAt(s))&&n<57344){if(!i){if(56319<n){-1<(t-=3)&&o.push(239,191,189);continue}if(s+1===r){-1<(t-=3)&&o.push(239,191,189);continue}i=n;continue}if(n<56320){-1<(t-=3)&&o.push(239,191,189),i=n;continue}n=65536+(i-55296<<10|n-56320)}else i&&-1<(t-=3)&&o.push(239,191,189);if(i=null,n<128){if((t-=1)<0)break;o.push(n)}else if(n<2048){if((t-=2)<0)break;o.push(n>>6|192,63&n|128)}else if(n<65536){if((t-=3)<0)break;o.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return o}function U(e){return r.toByteArray(function(e){if((e=function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}(e).replace(t,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function B(e,t,n,r){for(var i=0;i<r&&!(i+n>=t.length||i>=e.length);++i)t[i+n]=e[i];return i}}).call(this,D(70))},function(e,t,n){"use strict";e.exports=function(e){return null!==e&&"object"==typeof e}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=u(n(12)),i=u(n(67)),o=u(n(68)),s=u(n(69)),a=n(75);n(0);function u(e){return e&&e.__esModule?e:{default:e}}function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function l(e){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e){if(!navigator||!navigator.sendBeacon)return!1;navigator.sendBeacon(e)}var d=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(g,r.default),g);function g(e){var t;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,g);var n=e.listenToBrowserNetworkEvents,r=void 0===n||n;return e.db=o.default,e.cbor=new s.default,e.sdkFamily="Web",e.networking=new i.default({del:a.del,get:a.get,post:a.post,patch:a.patch,sendBeacon:p}),t=f(this,l(g).call(this,e)),r&&(window.addEventListener("offline",function(){t.networkDownDetected()}),window.addEventListener("online",function(){t.networkUpDetected()})),t}t.default=d,e.exports=t.default},function(e,t,n){"use strict";function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var y=f(n(3)),v=f(n(6)),b=f(n(15)),r=f(n(18)),m=f(n(7)),_=f(n(19)),k=f(n(20)),P=c(n(21)),w=c(n(22)),T=c(n(23)),O=c(n(24)),S=c(n(25)),M=c(n(26)),E=c(n(27)),A=c(n(28)),C=c(n(29)),R=c(n(30)),j=c(n(31)),N=c(n(32)),x=c(n(33)),U=c(n(34)),B=c(n(35)),I=c(n(36)),D=c(n(37)),K=c(n(38)),L=c(n(39)),F=c(n(40)),G=c(n(41)),H=c(n(42)),q=c(n(43)),z=c(n(44)),Y=c(n(45)),$=c(n(46)),W=c(n(47)),J=c(n(48)),X=c(n(49)),V=c(n(50)),Q=c(n(51)),Z=c(n(52)),ee=c(n(53)),te=c(n(54)),ne=c(n(55)),re=c(n(56)),ie=c(n(57)),oe=c(n(58)),se=c(n(59)),ae=c(n(60)),ue=c(n(61)),ce=c(n(62)),fe=c(n(63)),le=c(n(64)),he=c(n(65)),pe=c(n(8)),de=c(n(66)),i=f(n(1)),o=f(n(4)),a=(n(0),f(n(5)));function u(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return u=function(){return e},e}function c(e){if(e&&e.__esModule)return e;if(null===e||"object"!==s(e)&&"function"!=typeof e)return{default:e};var t=u();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var o=r?Object.getOwnPropertyDescriptor(e,i):null;o&&(o.get||o.set)?Object.defineProperty(n,i,o):n[i]=e[i]}return n.default=e,t&&t.set(e,n),n}function f(e){return e&&e.__esModule?e:{default:e}}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ge(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var h,p,d,g=(h=ye,d=[{key:"notificationPayload",value:function(e,t){return new r.default(e,t)}},{key:"generateUUID",value:function(){return a.default.createUUID()}}],(p=[{key:"getVersion",value:function(){return this._config.getVersion()}},{key:"_addPnsdkSuffix",value:function(e,t){this._config._addPnsdkSuffix(e,t)}},{key:"networkDownDetected",value:function(){this._listenerManager.announceNetworkDown(),this._config.restore?this.disconnect():this.destroy(!0)}},{key:"networkUpDetected",value:function(){this._listenerManager.announceNetworkUp(),this.reconnect()}}])&&l(h.prototype,p),void(d&&l(h,d)),ye);function ye(e){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,ye),ge(this,"_config",void 0),ge(this,"_listenerManager",void 0),ge(this,"_tokenManager",void 0),ge(this,"time",void 0),ge(this,"publish",void 0),ge(this,"fire",void 0),ge(this,"history",void 0),ge(this,"deleteMessages",void 0),ge(this,"messageCounts",void 0),ge(this,"fetchMessages",void 0),ge(this,"channelGroups",void 0),ge(this,"push",void 0),ge(this,"hereNow",void 0),ge(this,"whereNow",void 0),ge(this,"getState",void 0),ge(this,"setState",void 0),ge(this,"grant",void 0),ge(this,"grantToken",void 0),ge(this,"audit",void 0),ge(this,"subscribe",void 0),ge(this,"signal",void 0),ge(this,"presence",void 0),ge(this,"unsubscribe",void 0),ge(this,"unsubscribeAll",void 0),ge(this,"addMessageAction",void 0),ge(this,"removeMessageAction",void 0),ge(this,"getMessageActions",void 0),ge(this,"createUser",void 0),ge(this,"updateUser",void 0),ge(this,"deleteUser",void 0),ge(this,"getUser",void 0),ge(this,"getUsers",void 0),ge(this,"createSpace",void 0),ge(this,"updateSpace",void 0),ge(this,"deleteSpace",void 0),ge(this,"getSpaces",void 0),ge(this,"getSpace",void 0),ge(this,"getMembers",void 0),ge(this,"addMembers",void 0),ge(this,"updateMembers",void 0),ge(this,"removeMembers",void 0),ge(this,"getMemberships",void 0),ge(this,"joinSpaces",void 0),ge(this,"updateMemberships",void 0),ge(this,"leaveSpaces",void 0),ge(this,"disconnect",void 0),ge(this,"reconnect",void 0),ge(this,"destroy",void 0),ge(this,"stop",void 0),ge(this,"getSubscribedChannels",void 0),ge(this,"getSubscribedChannelGroups",void 0),ge(this,"addListener",void 0),ge(this,"removeListener",void 0),ge(this,"removeAllListeners",void 0),ge(this,"parseToken",void 0),ge(this,"setToken",void 0),ge(this,"setTokens",void 0),ge(this,"getToken",void 0),ge(this,"getTokens",void 0),ge(this,"clearTokens",void 0),ge(this,"getAuthKey",void 0),ge(this,"setAuthKey",void 0),ge(this,"setCipherKey",void 0),ge(this,"setUUID",void 0),ge(this,"getUUID",void 0),ge(this,"getFilterExpression",void 0),ge(this,"setFilterExpression",void 0),ge(this,"setHeartbeatInterval",void 0),ge(this,"setProxy",void 0),ge(this,"encrypt",void 0),ge(this,"decrypt",void 0);var t=e.db,r=e.networking,i=e.cbor,o=this._config=new y.default({setup:e,db:t}),s=new v.default({config:o});r.init(o);var a=this._tokenManager=new _.default(o,i),u={config:o,networking:r,crypto:s,tokenManager:a},c=k.default.bind(this,u,pe),f=k.default.bind(this,u,R),l=k.default.bind(this,u,N),h=k.default.bind(this,u,U),p=k.default.bind(this,u,de),d=this._listenerManager=new m.default,g=new b.default({timeEndpoint:c,leaveEndpoint:f,heartbeatEndpoint:l,setStateEndpoint:h,subscribeEndpoint:p,crypto:u.crypto,config:u.config,listenerManager:d});this.addListener=d.addListener.bind(d),this.removeListener=d.removeListener.bind(d),this.removeAllListeners=d.removeAllListeners.bind(d),this.parseToken=a.parseToken.bind(a),this.setToken=a.setToken.bind(a),this.setTokens=a.setTokens.bind(a),this.getToken=a.getToken.bind(a),this.getTokens=a.getTokens.bind(a),this.clearTokens=a.clearTokens.bind(a),this.channelGroups={listGroups:k.default.bind(this,u,O),listChannels:k.default.bind(this,u,S),addChannels:k.default.bind(this,u,P),removeChannels:k.default.bind(this,u,w),deleteGroup:k.default.bind(this,u,T)},this.push={addChannels:k.default.bind(this,u,M),removeChannels:k.default.bind(this,u,E),deleteDevice:k.default.bind(this,u,C),listChannels:k.default.bind(this,u,A)},this.hereNow=k.default.bind(this,u,B),this.whereNow=k.default.bind(this,u,j),this.getState=k.default.bind(this,u,x),this.setState=g.adaptStateChange.bind(g),this.grant=k.default.bind(this,u,oe),this.grantToken=k.default.bind(this,u,se),this.audit=k.default.bind(this,u,ie),this.publish=k.default.bind(this,u,ae),this.fire=function(e,t){return e.replicate=!1,e.storeInHistory=!1,n.publish(e,t)},this.signal=k.default.bind(this,u,ue),this.history=k.default.bind(this,u,ce),this.deleteMessages=k.default.bind(this,u,fe),this.messageCounts=k.default.bind(this,u,le),this.fetchMessages=k.default.bind(this,u,he),this.addMessageAction=k.default.bind(this,u,I),this.removeMessageAction=k.default.bind(this,u,D),this.getMessageActions=k.default.bind(this,u,K),this.createUser=k.default.bind(this,u,L),this.updateUser=k.default.bind(this,u,F),this.deleteUser=k.default.bind(this,u,G),this.getUser=k.default.bind(this,u,H),this.getUsers=k.default.bind(this,u,q),this.createSpace=k.default.bind(this,u,z),this.updateSpace=k.default.bind(this,u,Y),this.deleteSpace=k.default.bind(this,u,$),this.getSpaces=k.default.bind(this,u,W),this.getSpace=k.default.bind(this,u,J),this.addMembers=k.default.bind(this,u,V),this.updateMembers=k.default.bind(this,u,Q),this.removeMembers=k.default.bind(this,u,Z),this.getMembers=k.default.bind(this,u,X),this.getMemberships=k.default.bind(this,u,ee),this.joinSpaces=k.default.bind(this,u,ne),this.updateMemberships=k.default.bind(this,u,te),this.leaveSpaces=k.default.bind(this,u,re),this.time=c,this.subscribe=g.adaptSubscribeChange.bind(g),this.presence=g.adaptPresenceChange.bind(g),this.unsubscribe=g.adaptUnsubscribeChange.bind(g),this.disconnect=g.disconnect.bind(g),this.reconnect=g.reconnect.bind(g),this.destroy=function(e){g.unsubscribeAll(e),g.disconnect()},this.stop=this.destroy,this.unsubscribeAll=g.unsubscribeAll.bind(g),this.getSubscribedChannels=g.getSubscribedChannels.bind(g),this.getSubscribedChannelGroups=g.getSubscribedChannelGroups.bind(g),this.encrypt=s.encrypt.bind(s),this.decrypt=s.decrypt.bind(s),this.getAuthKey=u.config.getAuthKey.bind(u.config),this.setAuthKey=u.config.setAuthKey.bind(u.config),this.setCipherKey=u.config.setCipherKey.bind(u.config),this.getUUID=u.config.getUUID.bind(u.config),this.setUUID=u.config.setUUID.bind(u.config),this.getFilterExpression=u.config.getFilterExpression.bind(u.config),this.setFilterExpression=u.config.setFilterExpression.bind(u.config),this.setHeartbeatInterval=u.config.setHeartbeatInterval.bind(u.config),r.hasModule("proxy")&&(this.setProxy=function(e){u.config.setProxy(e),n.reconnect()})}ge(t.default=g,"OPERATIONS",i.default),ge(g,"CATEGORIES",o.default),e.exports=t.default},function(e,t,n){var r,i,o;i=[t],void 0===(o="function"==typeof(r=function(e){var r={3:/^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,4:/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,5:/^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,all:/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i};function t(){var e,t,n="";for(e=0;e<32;e++)t=16*Math.random()|0,8!==e&&12!==e&&16!==e&&20!==e||(n+="-"),n+=(12===e?4:16===e?3&t|8:t).toString(16);return n}function n(e,t){var n=r[t||"all"];return n&&n.test(e)||!1}t.isUUID=n,t.VERSION="0.1.0",e.uuid=t,e.isUUID=n})?r.apply(t,i):r)||(e.exports=o)},function(e,t,n){"use strict";var r,c,i,u,o,s,a,f,l,h,E=E||function(a){function n(){}var e={},t=e.lib={},r=t.Base={extend:function(e){n.prototype=this;var t=new n;return e&&t.mixIn(e),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),(t.init.prototype=t).$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},u=t.WordArray=r.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=null!=t?t:4*e.length},toString:function(e){return(e||o).stringify(this)},concat:function(e){var t=this.words,n=e.words,r=this.sigBytes;if(e=e.sigBytes,this.clamp(),r%4)for(var i=0;i<e;i++)t[r+i>>>2]|=(n[i>>>2]>>>24-i%4*8&255)<<24-(r+i)%4*8;else if(65535<n.length)for(i=0;i<e;i+=4)t[r+i>>>2]=n[i>>>2];else t.push.apply(t,n);return this.sigBytes+=e,this},clamp:function(){var e=this.words,t=this.sigBytes;e[t>>>2]&=4294967295<<32-t%4*8,e.length=a.ceil(t/4)},clone:function(){var e=r.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],n=0;n<e;n+=4)t.push(4294967296*a.random()|0);return new u.init(t,e)}}),i=e.enc={},o=i.Hex={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],r=0;r<e;r++){var i=t[r>>>2]>>>24-r%4*8&255;n.push((i>>>4).toString(16)),n.push((15&i).toString(16))}return n.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r+=2)n[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new u.init(n,t/2)}},s=i.Latin1={stringify:function(e){var t=e.words;e=e.sigBytes;for(var n=[],r=0;r<e;r++)n.push(String.fromCharCode(t[r>>>2]>>>24-r%4*8&255));return n.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new u.init(n,t)}},c=i.Utf8={stringify:function(e){try{return decodeURIComponent(escape(s.stringify(e)))}catch(e){throw Error("Malformed UTF-8 data")}},parse:function(e){return s.parse(unescape(encodeURIComponent(e)))}},f=t.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new u.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=c.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(e){var t=this._data,n=t.words,r=t.sigBytes,i=this.blockSize,o=r/(4*i);if(e=(o=e?a.ceil(o):a.max((0|o)-this._minBufferSize,0))*i,r=a.min(4*e,r),e){for(var s=0;s<e;s+=i)this._doProcessBlock(n,s);s=n.splice(0,e),t.sigBytes-=r}return new u.init(s,r)},clone:function(){var e=r.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});t.Hasher=f.extend({cfg:r.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){f.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(n){return function(e,t){return new n.init(t).finalize(e)}},_createHmacHelper:function(n){return function(e,t){return new l.HMAC.init(n,t).finalize(e)}}});var l=e.algo={};return e}(Math);!function(i){for(var e=E,t=(r=e.lib).WordArray,n=r.Hasher,r=e.algo,o=[],d=[],s=function(e){return 4294967296*(e-(0|e))|0},a=2,u=0;u<64;){var c;e:{c=a;for(var f=i.sqrt(c),l=2;l<=f;l++)if(!(c%l)){c=!1;break e}c=!0}c&&(u<8&&(o[u]=s(i.pow(a,.5))),d[u]=s(i.pow(a,1/3)),u++),a++}var g=[];r=r.SHA256=n.extend({_doReset:function(){this._hash=new t.init(o.slice(0))},_doProcessBlock:function(e,t){for(var n=this._hash.words,r=n[0],i=n[1],o=n[2],s=n[3],a=n[4],u=n[5],c=n[6],f=n[7],l=0;l<64;l++){if(l<16)g[l]=0|e[t+l];else{var h=g[l-15],p=g[l-2];g[l]=((h<<25|h>>>7)^(h<<14|h>>>18)^h>>>3)+g[l-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+g[l-16]}h=f+((a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25))+(a&u^~a&c)+d[l]+g[l],p=((r<<30|r>>>2)^(r<<19|r>>>13)^(r<<10|r>>>22))+(r&i^r&o^i&o),f=c,c=u,u=a,a=s+h|0,s=o,o=i,i=r,r=h+p|0}n[0]=n[0]+r|0,n[1]=n[1]+i|0,n[2]=n[2]+o|0,n[3]=n[3]+s|0,n[4]=n[4]+a|0,n[5]=n[5]+u|0,n[6]=n[6]+c|0,n[7]=n[7]+f|0},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,r=8*e.sigBytes;return t[r>>>5]|=128<<24-r%32,t[14+(64+r>>>9<<4)]=i.floor(n/4294967296),t[15+(64+r>>>9<<4)]=n,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=n.clone.call(this);return e._hash=this._hash.clone(),e}});e.SHA256=n._createHelper(r),e.HmacSHA256=n._createHmacHelper(r)}(Math),c=(r=E).enc.Utf8,r.algo.HMAC=r.lib.Base.extend({init:function(e,t){e=this._hasher=new e.init,"string"==typeof t&&(t=c.parse(t));var n=e.blockSize,r=4*n;t.sigBytes>r&&(t=e.finalize(t)),t.clamp();for(var i=this._oKey=t.clone(),o=this._iKey=t.clone(),s=i.words,a=o.words,u=0;u<n;u++)s[u]^=1549556828,a[u]^=909522486;i.sigBytes=o.sigBytes=r,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher;return e=t.finalize(e),t.reset(),t.finalize(this._oKey.clone().concat(e))}}),u=(i=E).lib.WordArray,i.enc.Base64={stringify:function(e){var t=e.words,n=e.sigBytes,r=this._map;e.clamp(),e=[];for(var i=0;i<n;i+=3)for(var o=(t[i>>>2]>>>24-i%4*8&255)<<16|(t[i+1>>>2]>>>24-(i+1)%4*8&255)<<8|t[i+2>>>2]>>>24-(i+2)%4*8&255,s=0;s<4&&i+.75*s<n;s++)e.push(r.charAt(o>>>6*(3-s)&63));if(t=r.charAt(64))for(;e.length%4;)e.push(t);return e.join("")},parse:function(e){var t=e.length,n=this._map;!(r=n.charAt(64))||-1!=(r=e.indexOf(r))&&(t=r);for(var r=[],i=0,o=0;o<t;o++)if(o%4){var s=n.indexOf(e.charAt(o-1))<<o%4*2,a=n.indexOf(e.charAt(o))>>>6-o%4*2;r[i>>>2]|=(s|a)<<24-i%4*8,i++}return u.create(r,i)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},function(o){function w(e,t,n,r,i,o,s){return((e=e+(t&n|~t&r)+i+s)<<o|e>>>32-o)+t}function T(e,t,n,r,i,o,s){return((e=e+(t&r|n&~r)+i+s)<<o|e>>>32-o)+t}function O(e,t,n,r,i,o,s){return((e=e+(t^n^r)+i+s)<<o|e>>>32-o)+t}function S(e,t,n,r,i,o,s){return((e=e+(n^(t|~r))+i+s)<<o|e>>>32-o)+t}for(var e=E,t=(r=e.lib).WordArray,n=r.Hasher,r=e.algo,M=[],i=0;i<64;i++)M[i]=4294967296*o.abs(o.sin(i+1))|0;r=r.MD5=n.extend({_doReset:function(){this._hash=new t.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,t){for(var n=0;n<16;n++){var r=e[s=t+n];e[s]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8)}n=this._hash.words;var i,o,s=e[t+0],a=(r=e[t+1],e[t+2]),u=e[t+3],c=e[t+4],f=e[t+5],l=e[t+6],h=e[t+7],p=e[t+8],d=e[t+9],g=e[t+10],y=e[t+11],v=e[t+12],b=e[t+13],m=e[t+14],_=e[t+15],k=n[0],P=S(P=S(P=S(P=S(P=O(P=O(P=O(P=O(P=T(P=T(P=T(P=T(P=w(P=w(P=w(P=w(P=n[1],o=w(o=n[2],i=w(i=n[3],k=w(k,P,o,i,s,7,M[0]),P,o,r,12,M[1]),k,P,a,17,M[2]),i,k,u,22,M[3]),o=w(o,i=w(i,k=w(k,P,o,i,c,7,M[4]),P,o,f,12,M[5]),k,P,l,17,M[6]),i,k,h,22,M[7]),o=w(o,i=w(i,k=w(k,P,o,i,p,7,M[8]),P,o,d,12,M[9]),k,P,g,17,M[10]),i,k,y,22,M[11]),o=w(o,i=w(i,k=w(k,P,o,i,v,7,M[12]),P,o,b,12,M[13]),k,P,m,17,M[14]),i,k,_,22,M[15]),o=T(o,i=T(i,k=T(k,P,o,i,r,5,M[16]),P,o,l,9,M[17]),k,P,y,14,M[18]),i,k,s,20,M[19]),o=T(o,i=T(i,k=T(k,P,o,i,f,5,M[20]),P,o,g,9,M[21]),k,P,_,14,M[22]),i,k,c,20,M[23]),o=T(o,i=T(i,k=T(k,P,o,i,d,5,M[24]),P,o,m,9,M[25]),k,P,u,14,M[26]),i,k,p,20,M[27]),o=T(o,i=T(i,k=T(k,P,o,i,b,5,M[28]),P,o,a,9,M[29]),k,P,h,14,M[30]),i,k,v,20,M[31]),o=O(o,i=O(i,k=O(k,P,o,i,f,4,M[32]),P,o,p,11,M[33]),k,P,y,16,M[34]),i,k,m,23,M[35]),o=O(o,i=O(i,k=O(k,P,o,i,r,4,M[36]),P,o,c,11,M[37]),k,P,h,16,M[38]),i,k,g,23,M[39]),o=O(o,i=O(i,k=O(k,P,o,i,b,4,M[40]),P,o,s,11,M[41]),k,P,u,16,M[42]),i,k,l,23,M[43]),o=O(o,i=O(i,k=O(k,P,o,i,d,4,M[44]),P,o,v,11,M[45]),k,P,_,16,M[46]),i,k,a,23,M[47]),o=S(o,i=S(i,k=S(k,P,o,i,s,6,M[48]),P,o,h,10,M[49]),k,P,m,15,M[50]),i,k,f,21,M[51]),o=S(o,i=S(i,k=S(k,P,o,i,v,6,M[52]),P,o,u,10,M[53]),k,P,g,15,M[54]),i,k,r,21,M[55]),o=S(o,i=S(i,k=S(k,P,o,i,p,6,M[56]),P,o,_,10,M[57]),k,P,l,15,M[58]),i,k,b,21,M[59]),o=S(o,i=S(i,k=S(k,P,o,i,c,6,M[60]),P,o,y,10,M[61]),k,P,a,15,M[62]),i,k,d,21,M[63]);n[0]=n[0]+k|0,n[1]=n[1]+P|0,n[2]=n[2]+o|0,n[3]=n[3]+i|0},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,r=8*e.sigBytes;t[r>>>5]|=128<<24-r%32;var i=o.floor(n/4294967296);for(t[15+(r+64>>>9<<4)]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),t[14+(r+64>>>9<<4)]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),e.sigBytes=4*(t.length+1),this._process(),t=(e=this._hash).words,n=0;n<4;n++)r=t[n],t[n]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8);return e},clone:function(){var e=n.clone.call(this);return e._hash=this._hash.clone(),e}}),e.MD5=n._createHelper(r),e.HmacMD5=n._createHmacHelper(r)}(Math),a=(o=(s=E).lib).Base,f=o.WordArray,l=(o=s.algo).EvpKDF=a.extend({cfg:a.extend({keySize:4,hasher:o.MD5,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,t){for(var n=(s=this.cfg).hasher.create(),r=f.create(),i=r.words,o=s.keySize,s=s.iterations;i.length<o;){a&&n.update(a);var a=n.update(e).finalize(t);n.reset();for(var u=1;u<s;u++)a=n.finalize(a),n.reset();r.concat(a)}return r.sigBytes=4*o,r}}),s.EvpKDF=function(e,t,n){return l.create(n).compute(e,t)},E.lib.Cipher||function(){var e=(h=E).lib,t=e.Base,s=e.WordArray,n=e.BufferedBlockAlgorithm,r=h.enc.Base64,i=h.algo.EvpKDF,o=e.Cipher=n.extend({cfg:t.extend(),createEncryptor:function(e,t){return this.create(this._ENC_XFORM_MODE,e,t)},createDecryptor:function(e,t){return this.create(this._DEC_XFORM_MODE,e,t)},init:function(e,t,n){this.cfg=this.cfg.extend(n),this._xformMode=e,this._key=t,this.reset()},reset:function(){n.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){return e&&this._append(e),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(r){return{encrypt:function(e,t,n){return("string"==typeof t?p:l).encrypt(r,e,t,n)},decrypt:function(e,t,n){return("string"==typeof t?p:l).decrypt(r,e,t,n)}}}});e.StreamCipher=o.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});function a(e,t,n){var r=this._iv;r?this._iv=void 0:r=this._prevBlock;for(var i=0;i<n;i++)e[t+i]^=r[i]}var u=h.mode={},c=(e.BlockCipherMode=t.extend({createEncryptor:function(e,t){return this.Encryptor.create(e,t)},createDecryptor:function(e,t){return this.Decryptor.create(e,t)},init:function(e,t){this._cipher=e,this._iv=t}})).extend();c.Encryptor=c.extend({processBlock:function(e,t){var n=this._cipher,r=n.blockSize;a.call(this,e,t,r),n.encryptBlock(e,t),this._prevBlock=e.slice(t,t+r)}}),c.Decryptor=c.extend({processBlock:function(e,t){var n=this._cipher,r=n.blockSize,i=e.slice(t,t+r);n.decryptBlock(e,t),a.call(this,e,t,r),this._prevBlock=i}}),u=u.CBC=c,c=(h.pad={}).Pkcs7={pad:function(e,t){for(var n,r=(n=(n=4*t)-e.sigBytes%n)<<24|n<<16|n<<8|n,i=[],o=0;o<n;o+=4)i.push(r);n=s.create(i,n),e.concat(n)},unpad:function(e){e.sigBytes-=255&e.words[e.sigBytes-1>>>2]}},e.BlockCipher=o.extend({cfg:o.cfg.extend({mode:u,padding:c}),reset:function(){o.reset.call(this);var e=(t=this.cfg).iv,t=t.mode;if(this._xformMode==this._ENC_XFORM_MODE)var n=t.createEncryptor;else n=t.createDecryptor,this._minBufferSize=1;this._mode=n.call(t,this,e&&e.words)},_doProcessBlock:function(e,t){this._mode.processBlock(e,t)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var t=this._process(!0)}else t=this._process(!0),e.unpad(t);return t},blockSize:4});var f=e.CipherParams=t.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}}),l=(u=(h.format={}).OpenSSL={stringify:function(e){var t=e.ciphertext;return((e=e.salt)?s.create([1398893684,1701076831]).concat(e).concat(t):t).toString(r)},parse:function(e){var t=(e=r.parse(e)).words;if(1398893684==t[0]&&1701076831==t[1]){var n=s.create(t.slice(2,4));t.splice(0,4),e.sigBytes-=16}return f.create({ciphertext:e,salt:n})}},e.SerializableCipher=t.extend({cfg:t.extend({format:u}),encrypt:function(e,t,n,r){r=this.cfg.extend(r);var i=e.createEncryptor(n,r);return t=i.finalize(t),i=i.cfg,f.create({ciphertext:t,key:n,iv:i.iv,algorithm:e,mode:i.mode,padding:i.padding,blockSize:e.blockSize,formatter:r.format})},decrypt:function(e,t,n,r){return r=this.cfg.extend(r),t=this._parse(t,r.format),e.createDecryptor(n,r).finalize(t.ciphertext)},_parse:function(e,t){return"string"==typeof e?t.parse(e,this):e}})),h=(h.kdf={}).OpenSSL={execute:function(e,t,n,r){return r=r||s.random(8),e=i.create({keySize:t+n}).compute(e,r),n=s.create(e.words.slice(t),4*n),e.sigBytes=4*t,f.create({key:e,iv:n,salt:r})}},p=e.PasswordBasedCipher=l.extend({cfg:l.cfg.extend({kdf:h}),encrypt:function(e,t,n,r){return n=(r=this.cfg.extend(r)).kdf.execute(n,e.keySize,e.ivSize),r.iv=n.iv,(e=l.encrypt.call(this,e,t,n.key,r)).mixIn(n),e},decrypt:function(e,t,n,r){return r=this.cfg.extend(r),t=this._parse(t,r.format),n=r.kdf.execute(n,e.keySize,e.ivSize,t.salt),r.iv=n.iv,l.decrypt.call(this,e,t,n.key,r)}})}(),function(){for(var e=E,t=e.lib.BlockCipher,n=e.algo,s=[],r=[],i=[],o=[],a=[],u=[],c=[],f=[],l=[],h=[],p=[],d=0;d<256;d++)p[d]=d<128?d<<1:d<<1^283;var g=0,y=0;for(d=0;d<256;d++){var v=(v=y^y<<1^y<<2^y<<3^y<<4)>>>8^255&v^99;s[g]=v;var b=p[r[v]=g],m=p[b],_=p[m],k=257*p[v]^16843008*v;i[g]=k<<24|k>>>8,o[g]=k<<16|k>>>16,a[g]=k<<8|k>>>24,u[g]=k,k=16843009*_^65537*m^257*b^16843008*g,c[v]=k<<24|k>>>8,f[v]=k<<16|k>>>16,l[v]=k<<8|k>>>24,h[v]=k,g?(g=b^p[p[p[_^b]]],y^=p[p[y]]):g=y=1}var P=[0,1,2,4,8,16,32,64,128,27,54];n=n.AES=t.extend({_doReset:function(){for(var e=(n=this._key).words,t=n.sigBytes/4,n=4*((this._nRounds=t+6)+1),r=this._keySchedule=[],i=0;i<n;i++)if(i<t)r[i]=e[i];else{var o=r[i-1];i%t?6<t&&4==i%t&&(o=s[o>>>24]<<24|s[o>>>16&255]<<16|s[o>>>8&255]<<8|s[255&o]):(o=s[(o=o<<8|o>>>24)>>>24]<<24|s[o>>>16&255]<<16|s[o>>>8&255]<<8|s[255&o],o^=P[i/t|0]<<24),r[i]=r[i-t]^o}for(e=this._invKeySchedule=[],t=0;t<n;t++)i=n-t,o=t%4?r[i]:r[i-4],e[t]=t<4||i<=4?o:c[s[o>>>24]]^f[s[o>>>16&255]]^l[s[o>>>8&255]]^h[s[255&o]]},encryptBlock:function(e,t){this._doCryptBlock(e,t,this._keySchedule,i,o,a,u,s)},decryptBlock:function(e,t){var n=e[t+1];e[t+1]=e[t+3],e[t+3]=n,this._doCryptBlock(e,t,this._invKeySchedule,c,f,l,h,r),n=e[t+1],e[t+1]=e[t+3],e[t+3]=n},_doCryptBlock:function(e,t,n,r,i,o,s,a){for(var u=this._nRounds,c=e[t]^n[0],f=e[t+1]^n[1],l=e[t+2]^n[2],h=e[t+3]^n[3],p=4,d=1;d<u;d++){var g=r[c>>>24]^i[f>>>16&255]^o[l>>>8&255]^s[255&h]^n[p++],y=r[f>>>24]^i[l>>>16&255]^o[h>>>8&255]^s[255&c]^n[p++],v=r[l>>>24]^i[h>>>16&255]^o[c>>>8&255]^s[255&f]^n[p++];h=r[h>>>24]^i[c>>>16&255]^o[f>>>8&255]^s[255&l]^n[p++],c=g,f=y,l=v}g=(a[c>>>24]<<24|a[f>>>16&255]<<16|a[l>>>8&255]<<8|a[255&h])^n[p++],y=(a[f>>>24]<<24|a[l>>>16&255]<<16|a[h>>>8&255]<<8|a[255&c])^n[p++],v=(a[l>>>24]<<24|a[h>>>16&255]<<16|a[c>>>8&255]<<8|a[255&f])^n[p++],h=(a[h>>>24]<<24|a[c>>>16&255]<<16|a[f>>>8&255]<<8|a[255&l])^n[p++],e[t]=g,e[t+1]=y,e[t+2]=v,e[t+3]=h},keySize:8});e.AES=t._createHelper(n)}(),E.mode.ECB=((h=E.lib.BlockCipherMode.extend()).Encryptor=h.extend({processBlock:function(e,t){this._cipher.encryptBlock(e,t)}}),h.Decryptor=h.extend({processBlock:function(e,t){this._cipher.decryptBlock(e,t)}}),h),e.exports=E},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;r(n(6)),r(n(3)),r(n(7));var c=r(n(16)),f=r(n(17)),l=r(n(2)),a=(n(0),r(n(4)));function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o,s,u,p=(o=d,(s=[{key:"adaptStateChange",value:function(e,t){var n=this,r=e.state,i=e.channels,o=void 0===i?[]:i,s=e.channelGroups,a=void 0===s?[]:s;return o.forEach(function(e){e in n._channels&&(n._channels[e].state=r)}),a.forEach(function(e){e in n._channelGroups&&(n._channelGroups[e].state=r)}),this._setStateEndpoint({state:r,channels:o,channelGroups:a},t)}},{key:"adaptPresenceChange",value:function(e){var t=this,n=e.connected,r=e.channels,i=void 0===r?[]:r,o=e.channelGroups,s=void 0===o?[]:o;n?(i.forEach(function(e){t._heartbeatChannels[e]={state:{}}}),s.forEach(function(e){t._heartbeatChannelGroups[e]={state:{}}})):(i.forEach(function(e){e in t._heartbeatChannels&&delete t._heartbeatChannels[e]}),s.forEach(function(e){e in t._heartbeatChannelGroups&&delete t._heartbeatChannelGroups[e]}),!1===this._config.suppressLeaveEvents&&this._leaveEndpoint({channels:i,channelGroups:s},function(e){t._listenerManager.announceStatus(e)})),this.reconnect()}},{key:"adaptSubscribeChange",value:function(e){var t=this,n=e.timetoken,r=e.channels,i=void 0===r?[]:r,o=e.channelGroups,s=void 0===o?[]:o,a=e.withPresence,u=void 0!==a&&a,c=e.withHeartbeats,f=void 0!==c&&c;this._config.subscribeKey&&""!==this._config.subscribeKey?(n&&(this._lastTimetoken=this._currentTimetoken,this._currentTimetoken=n),"0"!==this._currentTimetoken&&0!==this._currentTimetoken&&(this._storedTimetoken=this._currentTimetoken,this._currentTimetoken=0),i.forEach(function(e){t._channels[e]={state:{}},u&&(t._presenceChannels[e]={}),(f||t._config.getHeartbeatInterval())&&(t._heartbeatChannels[e]={}),t._pendingChannelSubscriptions.push(e)}),s.forEach(function(e){t._channelGroups[e]={state:{}},u&&(t._presenceChannelGroups[e]={}),(f||t._config.getHeartbeatInterval())&&(t._heartbeatChannelGroups[e]={}),t._pendingChannelGroupSubscriptions.push(e)}),this._subscriptionStatusAnnounced=!1,this.reconnect()):console&&console.log&&console.log("subscribe key missing; aborting subscribe")}},{key:"adaptUnsubscribeChange",value:function(e,t){var n=this,r=e.channels,i=void 0===r?[]:r,o=e.channelGroups,s=void 0===o?[]:o,a=[],u=[];i.forEach(function(e){e in n._channels&&(delete n._channels[e],a.push(e),e in n._heartbeatChannels&&delete n._heartbeatChannels[e]),e in n._presenceChannels&&(delete n._presenceChannels[e],a.push(e))}),s.forEach(function(e){e in n._channelGroups&&(delete n._channelGroups[e],u.push(e),e in n._heartbeatChannelGroups&&delete n._heartbeatChannelGroups[e]),e in n._presenceChannelGroups&&(delete n._channelGroups[e],u.push(e))}),0===a.length&&0===u.length||(!1!==this._config.suppressLeaveEvents||t||this._leaveEndpoint({channels:a,channelGroups:u},function(e){e.affectedChannels=a,e.affectedChannelGroups=u,e.currentTimetoken=n._currentTimetoken,e.lastTimetoken=n._lastTimetoken,n._listenerManager.announceStatus(e)}),0===Object.keys(this._channels).length&&0===Object.keys(this._presenceChannels).length&&0===Object.keys(this._channelGroups).length&&0===Object.keys(this._presenceChannelGroups).length&&(this._lastTimetoken=0,this._currentTimetoken=0,this._storedTimetoken=null,this._region=null,this._reconnectionManager.stopPolling()),this.reconnect())}},{key:"unsubscribeAll",value:function(e){this.adaptUnsubscribeChange({channels:this.getSubscribedChannels(),channelGroups:this.getSubscribedChannelGroups()},e)}},{key:"getHeartbeatChannels",value:function(){return Object.keys(this._heartbeatChannels)}},{key:"getHeartbeatChannelGroups",value:function(){return Object.keys(this._heartbeatChannelGroups)}},{key:"getSubscribedChannels",value:function(){return Object.keys(this._channels)}},{key:"getSubscribedChannelGroups",value:function(){return Object.keys(this._channelGroups)}},{key:"reconnect",value:function(){this._startSubscribeLoop(),this._registerHeartbeatTimer()}},{key:"disconnect",value:function(){this._stopSubscribeLoop(),this._stopHeartbeatTimer(),this._reconnectionManager.stopPolling()}},{key:"_registerHeartbeatTimer",value:function(){this._stopHeartbeatTimer(),0!==this._config.getHeartbeatInterval()&&(this._performHeartbeatLoop(),this._heartbeatTimer=setInterval(this._performHeartbeatLoop.bind(this),1e3*this._config.getHeartbeatInterval()))}},{key:"_stopHeartbeatTimer",value:function(){this._heartbeatTimer&&(clearInterval(this._heartbeatTimer),this._heartbeatTimer=null)}},{key:"_performHeartbeatLoop",value:function(){var n=this,e=this.getHeartbeatChannels(),t=this.getHeartbeatChannelGroups(),r={};0===e.length&&0===t.length||(this.getSubscribedChannels().forEach(function(e){var t=n._channels[e].state;Object.keys(t).length&&(r[e]=t)}),this.getSubscribedChannelGroups().forEach(function(e){var t=n._channelGroups[e].state;Object.keys(t).length&&(r[e]=t)}),this._heartbeatEndpoint({channels:e,channelGroups:t,state:r},function(e){e.error&&n._config.announceFailedHeartbeats&&n._listenerManager.announceStatus(e),e.error&&n._config.autoNetworkDetection&&n._isOnline&&(n._isOnline=!1,n.disconnect(),n._listenerManager.announceNetworkDown(),n.reconnect()),!e.error&&n._config.announceSuccessfulHeartbeats&&n._listenerManager.announceStatus(e)}.bind(this)))}},{key:"_startSubscribeLoop",value:function(){var n=this;this._stopSubscribeLoop();var r={},i=[],o=[];if(Object.keys(this._channels).forEach(function(e){var t=n._channels[e].state;Object.keys(t).length&&(r[e]=t),i.push(e)}),Object.keys(this._presenceChannels).forEach(function(e){i.push("".concat(e,"-pnpres"))}),Object.keys(this._channelGroups).forEach(function(e){var t=n._channelGroups[e].state;Object.keys(t).length&&(r[e]=t),o.push(e)}),Object.keys(this._presenceChannelGroups).forEach(function(e){o.push("".concat(e,"-pnpres"))}),0!==i.length||0!==o.length){var e={channels:i,channelGroups:o,state:r,timetoken:this._currentTimetoken,filterExpression:this._config.filterExpression,region:this._region};this._subscribeCall=this._subscribeEndpoint(e,this._processSubscribeResponse.bind(this))}}},{key:"_processSubscribeResponse",value:function(t,e){var c=this;if(t.error)t.category===a.default.PNTimeoutCategory?this._startSubscribeLoop():(t.category===a.default.PNNetworkIssuesCategory?(this.disconnect(),t.error&&this._config.autoNetworkDetection&&this._isOnline&&(this._isOnline=!1,this._listenerManager.announceNetworkDown()),this._reconnectionManager.onReconnection(function(){c._config.autoNetworkDetection&&!c._isOnline&&(c._isOnline=!0,c._listenerManager.announceNetworkUp()),c.reconnect(),c._subscriptionStatusAnnounced=!0;var e={category:a.default.PNReconnectedCategory,operation:t.operation,lastTimetoken:c._lastTimetoken,currentTimetoken:c._currentTimetoken};c._listenerManager.announceStatus(e)}),this._reconnectionManager.startPolling()):t.category===a.default.PNBadRequestCategory&&this._stopHeartbeatTimer(),this._listenerManager.announceStatus(t));else{if(this._storedTimetoken?(this._currentTimetoken=this._storedTimetoken,this._storedTimetoken=null):(this._lastTimetoken=this._currentTimetoken,this._currentTimetoken=e.metadata.timetoken),!this._subscriptionStatusAnnounced){var n={};n.category=a.default.PNConnectedCategory,n.operation=t.operation,n.affectedChannels=this._pendingChannelSubscriptions,n.subscribedChannels=this.getSubscribedChannels(),n.affectedChannelGroups=this._pendingChannelGroupSubscriptions,n.lastTimetoken=this._lastTimetoken,n.currentTimetoken=this._currentTimetoken,this._subscriptionStatusAnnounced=!0,this._listenerManager.announceStatus(n),this._pendingChannelSubscriptions=[],this._pendingChannelGroupSubscriptions=[]}var r=e.messages||[],i=this._config,o=i.requestMessageCountThreshold,f=i.dedupeOnSubscribe;if(o&&r.length>=o){var s={};s.category=a.default.PNRequestMessageCountExceededCategory,s.operation=t.operation,this._listenerManager.announceStatus(s)}r.forEach(function(e){var t=e.channel,n=e.subscriptionMatch,r=e.publishMetaData;if(t===n&&(n=null),f){if(c._dedupingManager.isDuplicate(e))return;c._dedupingManager.addEntry(e)}if(l.default.endsWith(e.channel,"-pnpres")){var i={channel:null,subscription:null};i.actualChannel=null!=n?t:null,i.subscribedChannel=null!=n?n:t,t&&(i.channel=t.substring(0,t.lastIndexOf("-pnpres"))),n&&(i.subscription=n.substring(0,n.lastIndexOf("-pnpres"))),i.action=e.payload.action,i.state=e.payload.data,i.timetoken=r.publishTimetoken,i.occupancy=e.payload.occupancy,i.uuid=e.payload.uuid,i.timestamp=e.payload.timestamp,e.payload.join&&(i.join=e.payload.join),e.payload.leave&&(i.leave=e.payload.leave),e.payload.timeout&&(i.timeout=e.payload.timeout),c._listenerManager.announcePresence(i)}else if(1===e.messageType){var o={channel:null,subscription:null};o.channel=t,o.subscription=n,o.timetoken=r.publishTimetoken,o.publisher=e.issuingClientId,e.userMetadata&&(o.userMetadata=e.userMetadata),o.message=e.payload,c._listenerManager.announceSignal(o)}else if(2===e.messageType){var s={channel:null,subscription:null};s.channel=t,s.subscription=n,s.timetoken=r.publishTimetoken,s.publisher=e.issuingClientId,e.userMetadata&&(s.userMetadata=e.userMetadata),s.message={event:e.payload.event,type:e.payload.type,data:e.payload.data},"user"===e.payload.type?c._listenerManager.announceUser(s):"space"===e.payload.type?c._listenerManager.announceSpace(s):"membership"===e.payload.type&&c._listenerManager.announceMembership(s)}else if(3===e.messageType){var a={};a.channel=t,a.subscription=n,a.timetoken=r.publishTimetoken,a.publisher=e.issuingClientId,a.data={messageTimetoken:e.payload.data.messageTimetoken,actionTimetoken:e.payload.data.actionTimetoken,type:e.payload.data.type,uuid:e.issuingClientId,value:e.payload.data.value},a.event=e.payload.event,c._listenerManager.announceMessageAction(a)}else{var u={channel:null,subscription:null};u.actualChannel=null!=n?t:null,u.subscribedChannel=null!=n?n:t,u.channel=t,u.subscription=n,u.timetoken=r.publishTimetoken,u.publisher=e.issuingClientId,e.userMetadata&&(u.userMetadata=e.userMetadata),c._config.cipherKey?u.message=c._crypto.decrypt(e.payload):u.message=e.payload,c._listenerManager.announceMessage(u)}}),this._region=e.metadata.region,this._startSubscribeLoop()}}},{key:"_stopSubscribeLoop",value:function(){this._subscribeCall&&("function"==typeof this._subscribeCall.abort&&this._subscribeCall.abort(),this._subscribeCall=null)}}])&&i(o.prototype,s),void(u&&i(o,u)),d);function d(e){var t=e.subscribeEndpoint,n=e.leaveEndpoint,r=e.heartbeatEndpoint,i=e.setStateEndpoint,o=e.timeEndpoint,s=e.config,a=e.crypto,u=e.listenerManager;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,d),h(this,"_crypto",void 0),h(this,"_config",void 0),h(this,"_listenerManager",void 0),h(this,"_reconnectionManager",void 0),h(this,"_leaveEndpoint",void 0),h(this,"_heartbeatEndpoint",void 0),h(this,"_setStateEndpoint",void 0),h(this,"_subscribeEndpoint",void 0),h(this,"_channels",void 0),h(this,"_presenceChannels",void 0),h(this,"_heartbeatChannels",void 0),h(this,"_heartbeatChannelGroups",void 0),h(this,"_channelGroups",void 0),h(this,"_presenceChannelGroups",void 0),h(this,"_currentTimetoken",void 0),h(this,"_lastTimetoken",void 0),h(this,"_storedTimetoken",void 0),h(this,"_region",void 0),h(this,"_subscribeCall",void 0),h(this,"_heartbeatTimer",void 0),h(this,"_subscriptionStatusAnnounced",void 0),h(this,"_autoNetworkDetection",void 0),h(this,"_isOnline",void 0),h(this,"_pendingChannelSubscriptions",void 0),h(this,"_pendingChannelGroupSubscriptions",void 0),h(this,"_dedupingManager",void 0),this._listenerManager=u,this._config=s,this._leaveEndpoint=n,this._heartbeatEndpoint=r,this._setStateEndpoint=i,this._subscribeEndpoint=t,this._crypto=a,this._channels={},this._presenceChannels={},this._heartbeatChannels={},this._heartbeatChannelGroups={},this._channelGroups={},this._presenceChannelGroups={},this._pendingChannelSubscriptions=[],this._pendingChannelGroupSubscriptions=[],this._currentTimetoken=0,this._lastTimetoken=0,this._storedTimetoken=null,this._subscriptionStatusAnnounced=!1,this._isOnline=!0,this._reconnectionManager=new c.default({timeEndpoint:o}),this._dedupingManager=new f.default({config:s})}t.default=p,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r;(r=n(8))&&r.__esModule,n(0);function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,u,c=(s=f,(a=[{key:"onReconnection",value:function(e){this._reconnectionCallback=e}},{key:"startPolling",value:function(){this._timeTimer=setInterval(this._performTimeLoop.bind(this),3e3)}},{key:"stopPolling",value:function(){clearInterval(this._timeTimer)}},{key:"_performTimeLoop",value:function(){var t=this;this._timeEndpoint(function(e){e.error||(clearInterval(t._timeTimer),t._reconnectionCallback())})}}])&&i(s.prototype,a),void(u&&i(s,u)),f);function f(e){var t=e.timeEndpoint;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),o(this,"_reconnectionCallback",void 0),o(this,"_timeEndpoint",void 0),o(this,"_timeTimer",void 0),this._timeEndpoint=t}t.default=c,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r;(r=n(3))&&r.__esModule,n(0);function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s,a,u,c=(s=f,(a=[{key:"getKey",value:function(e){var t=function(e){var t=0;if(0===e.length)return t;for(var n=0;n<e.length;n+=1)t=(t<<5)-t+e.charCodeAt(n),t&=t;return t}(JSON.stringify(e.payload)).toString(),n=e.publishMetaData.publishTimetoken;return"".concat(n,"-").concat(t)}},{key:"isDuplicate",value:function(e){return this.hashHistory.includes(this.getKey(e))}},{key:"addEntry",value:function(e){this.hashHistory.length>=this._config.maximumCacheSize&&this.hashHistory.shift(),this.hashHistory.push(this.getKey(e))}},{key:"clearHistory",value:function(){this.hashHistory=[]}}])&&i(s.prototype,a),void(u&&i(s,u)),f);function f(e){var t=e.config;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),o(this,"_config",void 0),o(this,"hashHistory",void 0),this.hashHistory=[],this._config=t}t.default=c,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.FCMNotificationPayload=t.MPNSNotificationPayload=t.APNSNotificationPayload=void 0;n(0);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],0<=t.indexOf(n)||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],0<=t.indexOf(n)||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function s(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach(function(e){g(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function a(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?c(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function c(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function d(e,t,n){return t&&p(e.prototype,t),n&&p(e,n),e}function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var y=(d(v,[{key:"payload",get:function(){return this._payload}},{key:"title",set:function(e){this._title=e}},{key:"subtitle",set:function(e){this._subtitle=e}},{key:"body",set:function(e){this._body=e}},{key:"badge",set:function(e){this._badge=e}},{key:"sound",set:function(e){this._sound=e}}]),d(v,[{key:"_setDefaultPayloadStructure",value:function(){}},{key:"toObject",value:function(){return{}}}]),v);function v(e,t,n){h(this,v),g(this,"_subtitle",void 0),g(this,"_payload",void 0),g(this,"_badge",void 0),g(this,"_sound",void 0),g(this,"_title",void 0),g(this,"_body",void 0),this._payload=e,this._setDefaultPayloadStructure(),this.title=t,this.body=n}var b=(f(m,y),d(m,[{key:"_setDefaultPayloadStructure",value:function(){this._payload.aps={alert:{}}}},{key:"toObject",value:function(){var t=this,e=s({},this._payload),n=e.aps,r=n.alert;if(this._isSilent&&(n["content-available"]=1),"apns2"===this._apnsPushType){if(!this._configurations||!this._configurations.length)throw new ReferenceError("APNS2 configuration is missing");var i=[];this._configurations.forEach(function(e){i.push(t._objectFromAPNS2Configuration(e))}),i.length&&(e.pn_push=i)}return r&&Object.keys(r).length||delete n.alert,this._isSilent&&(delete n.alert,delete n.badge,delete n.sound,r={}),this._isSilent||Object.keys(r).length?e:null}},{key:"_objectFromAPNS2Configuration",value:function(e){var t=this;if(!e.targets||!e.targets.length)throw new ReferenceError("At least one APNS2 target should be provided");var n=[];e.targets.forEach(function(e){n.push(t._objectFromAPNSTarget(e))});var r=e.collapseId,i=e.expirationDate,o={auth_method:"token",targets:n,version:"v2"};return r&&r.length&&(o.collapse_id=r),i&&(o.expiration=i.toISOString()),o}},{key:"_objectFromAPNSTarget",value:function(e){if(!e.topic||!e.topic.length)throw new TypeError("Target 'topic' undefined.");var t=e.topic,n=e.environment,r=void 0===n?"development":n,i=e.excludedDevices,o=void 0===i?[]:i,s={topic:t,environment:r};return o.length&&(s.excluded_devices=o),s}},{key:"configurations",set:function(e){e&&e.length&&(this._configurations=e)}},{key:"notification",get:function(){return this._payload.aps}},{key:"title",get:function(){return this._title},set:function(e){e&&e.length&&(this._payload.aps.alert.title=e,this._title=e)}},{key:"subtitle",get:function(){return this._subtitle},set:function(e){e&&e.length&&(this._payload.aps.alert.subtitle=e,this._subtitle=e)}},{key:"body",get:function(){return this._body},set:function(e){e&&e.length&&(this._payload.aps.alert.body=e,this._body=e)}},{key:"badge",get:function(){return this._badge},set:function(e){null!=e&&(this._payload.aps.badge=e,this._badge=e)}},{key:"sound",get:function(){return this._sound},set:function(e){e&&e.length&&(this._payload.aps.sound=e,this._sound=e)}},{key:"silent",set:function(e){this._isSilent=e}}]),m);function m(){var e,t;h(this,m);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return g(c(t=a(this,(e=u(m)).call.apply(e,[this].concat(r)))),"_configurations",void 0),g(c(t),"_apnsPushType",void 0),g(c(t),"_isSilent",void 0),t}t.APNSNotificationPayload=b;var _=(f(k,y),d(k,[{key:"toObject",value:function(){return Object.keys(this._payload).length?s({},this._payload):null}},{key:"backContent",get:function(){return this._backContent},set:function(e){e&&e.length&&(this._payload.back_content=e,this._backContent=e)}},{key:"backTitle",get:function(){return this._backTitle},set:function(e){e&&e.length&&(this._payload.back_title=e,this._backTitle=e)}},{key:"count",get:function(){return this._count},set:function(e){null!=e&&(this._payload.count=e,this._count=e)}},{key:"title",get:function(){return this._title},set:function(e){e&&e.length&&(this._payload.title=e,this._title=e)}},{key:"type",get:function(){return this._type},set:function(e){e&&e.length&&(this._payload.type=e,this._type=e)}},{key:"subtitle",get:function(){return this.backTitle},set:function(e){this.backTitle=e}},{key:"body",get:function(){return this.backContent},set:function(e){this.backContent=e}},{key:"badge",get:function(){return this.count},set:function(e){this.count=e}}]),k);function k(){var e,t;h(this,k);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return g(c(t=a(this,(e=u(k)).call.apply(e,[this].concat(r)))),"_backContent",void 0),g(c(t),"_backTitle",void 0),g(c(t),"_count",void 0),g(c(t),"_type",void 0),t}t.MPNSNotificationPayload=_;var P=(f(w,y),d(w,[{key:"_setDefaultPayloadStructure",value:function(){this._payload.notification={},this._payload.data={}}},{key:"toObject",value:function(){var e=s({},this._payload.data),t=null,n={};if(2<Object.keys(this._payload).length){var r=this._payload;r.notification,r.data,e=s({},e,{},i(r,["notification","data"]))}return this._isSilent?e.notification=this._payload.notification:t=this._payload.notification,Object.keys(e).length&&(n.data=e),t&&Object.keys(t).length&&(n.notification=t),Object.keys(n).length?n:null}},{key:"notification",get:function(){return this._payload.notification}},{key:"data",get:function(){return this._payload.data}},{key:"title",get:function(){return this._title},set:function(e){e&&e.length&&(this._payload.notification.title=e,this._title=e)}},{key:"body",get:function(){return this._body},set:function(e){e&&e.length&&(this._payload.notification.body=e,this._body=e)}},{key:"sound",get:function(){return this._sound},set:function(e){e&&e.length&&(this._payload.notification.sound=e,this._sound=e)}},{key:"icon",get:function(){return this._icon},set:function(e){e&&e.length&&(this._payload.notification.icon=e,this._icon=e)}},{key:"tag",get:function(){return this._tag},set:function(e){e&&e.length&&(this._payload.notification.tag=e,this._tag=e)}},{key:"silent",set:function(e){this._isSilent=e}}]),w);function w(){var e,t;h(this,w);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return g(c(t=a(this,(e=u(w)).call.apply(e,[this].concat(r)))),"_isSilent",void 0),g(c(t),"_icon",void 0),g(c(t),"_tag",void 0),t}function T(e,t){h(this,T),g(this,"_payload",void 0),g(this,"_debugging",void 0),g(this,"_subtitle",void 0),g(this,"_badge",void 0),g(this,"_sound",void 0),g(this,"_title",void 0),g(this,"_body",void 0),g(this,"apns",void 0),g(this,"mpns",void 0),g(this,"fcm",void 0),this._payload={apns:{},mpns:{},fcm:{}},this._title=e,this._body=t,this.apns=new b(this._payload.apns,e,t),this.mpns=new _(this._payload.mpns,e,t),this.fcm=new P(this._payload.fcm,e,t)}t.FCMNotificationPayload=P;var O=(d(T,[{key:"debugging",set:function(e){this._debugging=e}},{key:"title",get:function(){return this._title}},{key:"body",get:function(){return this._body}},{key:"subtitle",get:function(){return this._subtitle},set:function(e){this._subtitle=e,this.apns.subtitle=e,this.mpns.subtitle=e,this.fcm.subtitle=e}},{key:"badge",get:function(){return this._badge},set:function(e){this._badge=e,this.apns.badge=e,this.mpns.badge=e,this.fcm.badge=e}},{key:"sound",get:function(){return this._sound},set:function(e){this._sound=e,this.apns.sound=e,this.mpns.sound=e,this.fcm.sound=e}}]),d(T,[{key:"buildPayload",value:function(e){var t={};if(e.includes("apns")||e.includes("apns2")){this.apns._apnsPushType=e.includes("apns")?"apns":"apns2";var n=this.apns.toObject();n&&Object.keys(n).length&&(t.pn_apns=n)}if(e.includes("mpns")){var r=this.mpns.toObject();r&&Object.keys(r).length&&(t.pn_mpns=r)}if(e.includes("fcm")){var i=this.fcm.toObject();i&&Object.keys(i).length&&(t.pn_gcm=i)}return Object.keys(t).length&&this._debugging&&(t.pn_debug=!0),t}}]),T);t.default=O},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r;(r=n(3))&&r.__esModule,n(0);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a,u,c,f=(a=l,(u=[{key:"_initializeTokens",value:function(){this._userTokens={},this._spaceTokens={},this._userToken=void 0,this._spaceToken=void 0}},{key:"_setToken",value:function(t){var n=this,e=this.parseToken(t);e&&e.resources&&(e.resources.users&&Object.keys(e.resources.users).forEach(function(e){n._userTokens[e]=t}),e.resources.spaces&&Object.keys(e.resources.spaces).forEach(function(e){n._spaceTokens[e]=t})),e&&e.patterns&&(e.patterns.users&&0<Object.keys(e.patterns.users).length&&(this._userToken=t),e.patterns.spaces&&0<Object.keys(e.patterns.spaces).length&&(this._spaceToken=t))}},{key:"setToken",value:function(e){e&&0<e.length&&this._setToken(e)}},{key:"setTokens",value:function(e){var t=this;e&&e.length&&"object"===i(e)&&e.forEach(function(e){t.setToken(e)})}},{key:"getTokens",value:function(e){var t=this,n={users:{},spaces:{}};return e?(e.user&&(n.user=this._userToken),e.space&&(n.space=this._spaceToken),e.users&&e.users.forEach(function(e){n.users[e]=t._userTokens[e]}),e.space&&e.spaces.forEach(function(e){n.spaces[e]=t._spaceTokens[e]})):(this._userToken&&(n.user=this._userToken),this._spaceToken&&(n.space=this._spaceToken),Object.keys(this._userTokens).forEach(function(e){n.users[e]=t._userTokens[e]}),Object.keys(this._spaceTokens).forEach(function(e){n.spaces[e]=t._spaceTokens[e]})),n}},{key:"getToken",value:function(e,t){var n;return t?"user"===e?n=this._userTokens[t]:"space"===e&&(n=this._spaceTokens[t]):"user"===e?n=this._userToken:"space"===e&&(n=this._spaceToken),n}},{key:"extractPermissions",value:function(e){var t={create:!1,read:!1,write:!1,manage:!1,delete:!1};return 16==(16&e)&&(t.create=!0),8==(8&e)&&(t.delete=!0),4==(4&e)&&(t.manage=!0),2==(2&e)&&(t.write=!0),1==(1&e)&&(t.read=!0),t}},{key:"parseToken",value:function(e){var t=this,n=this._cbor.decodeToken(e);if(void 0!==n){var r=Object.keys(n.res.usr),i=Object.keys(n.res.spc),o=Object.keys(n.pat.usr),s=Object.keys(n.pat.spc),a={version:n.v,timestamp:n.t,ttl:n.ttl},u=0<r.length,c=0<i.length;(u||c)&&(a.resources={},u&&(a.resources.users={},r.forEach(function(e){a.resources.users[e]=t.extractPermissions(n.res.usr[e])})),c&&(a.resources.spaces={},i.forEach(function(e){a.resources.spaces[e]=t.extractPermissions(n.res.spc[e])})));var f=0<o.length,l=0<s.length;return(f||l)&&(a.patterns={},f&&(a.patterns.users={},o.forEach(function(e){a.patterns.users[e]=t.extractPermissions(n.pat.usr[e])})),l&&(a.patterns.spaces={},s.forEach(function(e){a.patterns.spaces[e]=t.extractPermissions(n.pat.spc[e])}))),0<Object.keys(n.meta).length&&(a.meta=n.meta),a.signature=n.sig,a}}},{key:"clearTokens",value:function(){this._initializeTokens()}}])&&o(a.prototype,u),void(c&&o(a,c)),l);function l(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),s(this,"_config",void 0),s(this,"_cbor",void 0),s(this,"_userTokens",void 0),s(this,"_spaceTokens",void 0),s(this,"_userToken",void 0),s(this,"_spaceToken",void 0),this._config=e,this._cbor=t,this._initializeTokens()}t.default=f,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(r,i){var e=r.networking,t=r.config,o=null,s=null,a={};o=i.getOperation()===b.default.PNTimeOperation||i.getOperation()===b.default.PNChannelGroupsOperation?arguments.length<=2?void 0:arguments[2]:(a=arguments.length<=2?void 0:arguments[2],arguments.length<=3?void 0:arguments[3]);"undefined"==typeof Promise||o||(s=v.default.createPromise());var n=i.validateParams(r,a);if(n)return o?o(_(n)):s?(s.reject(new m("Validation failed, check status for details",_(n))),s.promise):void 0;var u,c=i.prepareParams(r,a),f=function(e,t,n){return e.usePost&&e.usePost(t,n)?e.postURL(t,n):e.usePatch&&e.usePatch(t,n)?e.patchURL(t,n):e.getURL(t,n)}(i,r,a),l={url:f,operation:i.getOperation(),timeout:i.getRequestTimeout(r),headers:i.getRequestHeaders?i.getRequestHeaders():{}};c.uuid=t.UUID,c.pnsdk=function(e){if(e.sdkName)return e.sdkName;var t="PubNub-JS-".concat(e.sdkFamily);e.partnerId&&(t+="-".concat(e.partnerId));t+="/".concat(e.getVersion());var n=e._getPnsdkSuffix(" ");0<n.length&&(t+=n);return t}(t),t.useInstanceId&&(c.instanceid=t.instanceId);t.useRequestId&&(c.requestid=y.default.createUUID());if(i.isAuthSupported()){var h=function(e,t,n){var r;e.getAuthToken&&(r=e.getAuthToken(t,n));return r}(i,r,a)||t.getAuthKey();h&&(c.auth=h)}t.secretKey&&function(e,t,n,r,i){var o=e.config,s=e.crypto,a=k(e,i,r);n.timestamp=Math.floor((new Date).getTime()/1e3);var u="".concat(a,"\n").concat(o.publishKey,"\n").concat(t,"\n").concat(v.default.signPamFromParams(n),"\n");if("POST"===a){var c=i.postPayload(e,r);u+="string"==typeof c?c:JSON.stringify(c)}else if("PATCH"===a){var f=i.patchPayload(e,r);u+="string"==typeof f?f:JSON.stringify(f)}var l="v2.".concat(s.HMACSHA256(u));l=(l=(l=l.replace(/\+/g,"-")).replace(/\//g,"_")).replace(/=+$/,""),n.signature=l}(r,f,c,a,i);function p(e,t){if(e.error)o?o(e):s&&s.reject(new m("PubNub call failed, check status for details",e));else{var n=i.handleResponse(r,t,a);o?o(e,n):s&&s.fulfill(n)}}if("POST"===k(r,i,a)){var d=i.postPayload(r,a);u=e.POST(c,d,l,p)}else if("PATCH"===k(r,i,a)){var g=i.patchPayload(r,a);u=e.PATCH(c,g,l,p)}else u="DELETE"===k(r,i,a)?e.DELETE(c,l,p):e.GET(c,l,p);if(i.getOperation()===b.default.PNSubscribeOperation)return u;if(s)return s.promise};var y=r(n(5)),v=(n(0),r(n(2))),b=(r(n(3)),r(n(1)));function r(e){return e&&e.__esModule?e:{default:e}}function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function s(e){var n="function"==typeof Map?new Map:void 0;return(s=function(e){if(null===e||!function(e){return-1!==Function.toString.call(e).indexOf("[native code]")}(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(e))return n.get(e);n.set(e,t)}function t(){return a(e,arguments,c(this).constructor)}return t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),u(t,e)})(e)}function a(e,t,n){return(a=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var i=new(Function.bind.apply(e,r));return n&&u(i,n.prototype),i}).apply(null,arguments)}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var m=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(f,s(Error)),f);function f(e,t){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),(n=o(this,c(f).call(this,e))).name=n.constructor.name,n.status=t,n.message=e,n}function _(e){return function(e,t){return e.type=t,e.error=!0,e}({message:e},"validationError")}function k(e,t,n){return t.usePost&&t.usePost(e,n)?"POST":t.usePatch&&t.usePatch(e,n)?"PATCH":t.useDelete&&t.useDelete(e,n)?"DELETE":"GET"}e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNAddChannelsToGroupOperation},t.validateParams=function(e,t){var n=t.channels,r=t.channelGroup,i=e.config;if(!r)return"Missing Channel Group";if(!n||0===n.length)return"Missing Channels";if(!i.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.channelGroup,r=e.config;return"/v1/channel-registration/sub-key/".concat(r.subscribeKey,"/channel-group/").concat(i.default.encodeString(n))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.channels;return{add:(void 0===n?[]:n).join(",")}},t.handleResponse=function(){return{}};n(0);var r=o(n(1)),i=o(n(2));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNRemoveChannelsFromGroupOperation},t.validateParams=function(e,t){var n=t.channels,r=t.channelGroup,i=e.config;if(!r)return"Missing Channel Group";if(!n||0===n.length)return"Missing Channels";if(!i.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.channelGroup,r=e.config;return"/v1/channel-registration/sub-key/".concat(r.subscribeKey,"/channel-group/").concat(i.default.encodeString(n))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.channels;return{remove:(void 0===n?[]:n).join(",")}},t.handleResponse=function(){return{}};n(0);var r=o(n(1)),i=o(n(2));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNRemoveGroupOperation},t.validateParams=function(e,t){var n=t.channelGroup,r=e.config;if(!n)return"Missing Channel Group";if(!r.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.channelGroup,r=e.config;return"/v1/channel-registration/sub-key/".concat(r.subscribeKey,"/channel-group/").concat(i.default.encodeString(n),"/remove")},t.isAuthSupported=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.prepareParams=function(){return{}},t.handleResponse=function(){return{}};n(0);var r=o(n(1)),i=o(n(2));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNChannelGroupsOperation},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e){var t=e.config;return"/v1/channel-registration/sub-key/".concat(t.subscribeKey,"/channel-group")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(){return{}},t.handleResponse=function(e,t){return{groups:t.payload.groups}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNChannelsForGroupOperation},t.validateParams=function(e,t){var n=t.channelGroup,r=e.config;if(!n)return"Missing Channel Group";if(!r.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.channelGroup,r=e.config;return"/v1/channel-registration/sub-key/".concat(r.subscribeKey,"/channel-group/").concat(i.default.encodeString(n))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(){return{}},t.handleResponse=function(e,t){return{channels:t.payload.channels}};n(0);var r=o(n(1)),i=o(n(2));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNPushNotificationEnabledChannelsOperation},t.validateParams=function(e,t){var n=t.device,r=t.pushGateway,i=t.channels,o=t.topic,s=e.config;if(!n)return"Missing Device ID (device)";if(!r)return"Missing GW Type (pushGateway: gcm, apns or apns2)";if("apns2"===r&&!o)return"Missing APNS2 topic";if(!i||0===i.length)return"Missing Channels";if(!s.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.device,r=t.pushGateway,i=e.config;return"apns2"!==r?"/v1/push/sub-key/".concat(i.subscribeKey,"/devices/").concat(n):"/v2/push/sub-key/".concat(i.subscribeKey,"/devices-apns2/").concat(n)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.pushGateway,r=t.channels,i=void 0===r?[]:r,o=t.environment,s=void 0===o?"development":o,a=t.topic,u={type:n,add:i.join(",")};"apns2"===n&&delete(u=Object.assign({},u,{environment:s,topic:a})).type;return u},t.handleResponse=function(){return{}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNPushNotificationEnabledChannelsOperation},t.validateParams=function(e,t){var n=t.device,r=t.pushGateway,i=t.channels,o=t.topic,s=e.config;if(!n)return"Missing Device ID (device)";if(!r)return"Missing GW Type (pushGateway: gcm, apns or apns2)";if("apns2"===r&&!o)return"Missing APNS2 topic";if(!i||0===i.length)return"Missing Channels";if(!s.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.device,r=t.pushGateway,i=e.config;return"apns2"!==r?"/v1/push/sub-key/".concat(i.subscribeKey,"/devices/").concat(n):"/v2/push/sub-key/".concat(i.subscribeKey,"/devices-apns2/").concat(n)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.pushGateway,r=t.channels,i=void 0===r?[]:r,o=t.environment,s=void 0===o?"development":o,a=t.topic,u={type:n,remove:i.join(",")};"apns2"===n&&delete(u=Object.assign({},u,{environment:s,topic:a})).type;return u},t.handleResponse=function(){return{}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNPushNotificationEnabledChannelsOperation},t.validateParams=function(e,t){var n=t.device,r=t.pushGateway,i=t.topic,o=e.config;if(!n)return"Missing Device ID (device)";if(!r)return"Missing GW Type (pushGateway: gcm, apns or apns2)";if("apns2"===r&&!i)return"Missing APNS2 topic";if(!o.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.device,r=t.pushGateway,i=e.config;return"apns2"!==r?"/v1/push/sub-key/".concat(i.subscribeKey,"/devices/").concat(n):"/v2/push/sub-key/".concat(i.subscribeKey,"/devices-apns2/").concat(n)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.pushGateway,r=t.environment,i=void 0===r?"development":r,o=t.topic,s={type:n};"apns2"===n&&delete(s=Object.assign({},s,{environment:i,topic:o})).type;return s},t.handleResponse=function(e,t){return{channels:t}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNRemoveAllPushNotificationsOperation},t.validateParams=function(e,t){var n=t.device,r=t.pushGateway,i=t.topic,o=e.config;if(!n)return"Missing Device ID (device)";if(!r)return"Missing GW Type (pushGateway: gcm, apns or apns2)";if("apns2"===r&&!i)return"Missing APNS2 topic";if(!o.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.device,r=t.pushGateway,i=e.config;return"apns2"!==r?"/v1/push/sub-key/".concat(i.subscribeKey,"/devices/").concat(n,"/remove"):"/v2/push/sub-key/".concat(i.subscribeKey,"/devices-apns2/").concat(n,"/remove")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.pushGateway,r=t.environment,i=void 0===r?"development":r,o=t.topic,s={type:n};"apns2"===n&&delete(s=Object.assign({},s,{environment:i,topic:o})).type;return s},t.handleResponse=function(){return{}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNUnsubscribeOperation},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=e.config,r=t.channels,i=void 0===r?[]:r,o=0<i.length?i.join(","):",";return"/v2/presence/sub-key/".concat(n.subscribeKey,"/channel/").concat(s.default.encodeString(o),"/leave")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.channelGroups,r=void 0===n?[]:n,i={};0<r.length&&(i["channel-group"]=r.join(","));return i},t.handleResponse=function(){return{}};n(0);var r=i(n(1)),s=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNWhereNowOperation},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=e.config,r=t.uuid,i=void 0===r?n.UUID:r;return"/v2/presence/sub-key/".concat(n.subscribeKey,"/uuid/").concat(i)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(){return{}},t.handleResponse=function(e,t){return t.payload?{channels:t.payload.channels}:{channels:[]}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNHeartbeatOperation},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=e.config,r=t.channels,i=void 0===r?[]:r,o=0<i.length?i.join(","):",";return"/v2/presence/sub-key/".concat(n.subscribeKey,"/channel/").concat(s.default.encodeString(o),"/heartbeat")},t.isAuthSupported=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.prepareParams=function(e,t){var n=t.channelGroups,r=void 0===n?[]:n,i=t.state,o=void 0===i?{}:i,s=e.config,a={};0<r.length&&(a["channel-group"]=r.join(","));return a.state=JSON.stringify(o),a.heartbeat=s.getPresenceTimeout(),a},t.handleResponse=function(){return{}};n(0);var r=i(n(1)),s=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNGetStateOperation},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=e.config,r=t.uuid,i=void 0===r?n.UUID:r,o=t.channels,s=void 0===o?[]:o,a=0<s.length?s.join(","):",";return"/v2/presence/sub-key/".concat(n.subscribeKey,"/channel/").concat(u.default.encodeString(a),"/uuid/").concat(i)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.channelGroups,r=void 0===n?[]:n,i={};0<r.length&&(i["channel-group"]=r.join(","));return i},t.handleResponse=function(e,t,n){var r=n.channels,i=void 0===r?[]:r,o=n.channelGroups,s=void 0===o?[]:o,a={};1===i.length&&0===s.length?a[i[0]]=t.payload:a=t.payload;return{channels:a}};n(0);var r=i(n(1)),u=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNSetStateOperation},t.validateParams=function(e,t){var n=e.config,r=t.state,i=t.channels,o=void 0===i?[]:i,s=t.channelGroups,a=void 0===s?[]:s;if(!r)return"Missing State";if(!n.subscribeKey)return"Missing Subscribe Key";if(0===o.length&&0===a.length)return"Please provide a list of channels and/or channel-groups"},t.getURL=function(e,t){var n=e.config,r=t.channels,i=void 0===r?[]:r,o=0<i.length?i.join(","):",";return"/v2/presence/sub-key/".concat(n.subscribeKey,"/channel/").concat(s.default.encodeString(o),"/uuid/").concat(n.UUID,"/data")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.state,r=t.channelGroups,i=void 0===r?[]:r,o={};o.state=JSON.stringify(n),0<i.length&&(o["channel-group"]=i.join(","));return o},t.handleResponse=function(e,t){return{state:t.payload}};n(0);var r=i(n(1)),s=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNHereNowOperation},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=e.config,r=t.channels,i=void 0===r?[]:r,o=t.channelGroups,s=void 0===o?[]:o,a="/v2/presence/sub-key/".concat(n.subscribeKey);if(0<i.length||0<s.length){var u=0<i.length?i.join(","):",";a+="/channel/".concat(c.default.encodeString(u))}return a},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.channelGroups,r=void 0===n?[]:n,i=t.includeUUIDs,o=void 0===i||i,s=t.includeState,a=void 0!==s&&s,u={};o||(u.disable_uuids=1);a&&(u.state=1);0<r.length&&(u["channel-group"]=r.join(","));return u},t.handleResponse=function(e,i,t){var n,r=t.channels,o=void 0===r?[]:r,s=t.channelGroups,a=void 0===s?[]:s,u=t.includeUUIDs,c=void 0===u||u,f=t.includeState,l=void 0!==f&&f;n=1<o.length||0<a.length||0===a.length&&0===o.length?function(){var r={};return r.totalChannels=i.payload.total_channels,r.totalOccupancy=i.payload.total_occupancy,r.channels={},Object.keys(i.payload.channels).forEach(function(e){var t=i.payload.channels[e],n=[];return r.channels[e]={occupants:n,name:e,occupancy:t.occupancy},c&&t.uuids.forEach(function(e){l?n.push({state:e.state,uuid:e.uuid}):n.push({state:null,uuid:e})}),r}),r}():function(){var e={},t=[];return e.totalChannels=1,e.totalOccupancy=i.occupancy,e.channels={},e.channels[o[0]]={occupants:t,name:o[0],occupancy:i.occupancy},c&&i.uuids&&i.uuids.forEach(function(e){l?t.push({state:e.state,uuid:e.uuid}):t.push({state:null,uuid:e})}),e}();return n};n(0);var r=i(n(1)),c=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNAddMessageActionOperation},t.validateParams=function(e,t){var n=e.config,r=t.action,i=t.channel;if(!t.messageTimetoken)return"Missing message timetoken";if(!n.subscribeKey)return"Missing Subscribe Key";if(!i)return"Missing message channel";if(!r)return"Missing Action";if(!r.value)return"Missing Action.value";if(!r.type)return"Missing Action.type";if(15<r.type.length)return"Action.type value exceed maximum length of 15"},t.usePost=function(){return!0},t.postURL=function(e,t){var n=e.config,r=t.channel,i=t.messageTimetoken;return"/v1/message-actions/".concat(n.subscribeKey,"/channel/").concat(r,"/message/").concat(i)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.getRequestHeaders=function(){return{"Content-Type":"application/json"}},t.isAuthSupported=function(){return!0},t.prepareParams=function(){return{}},t.postPayload=function(e,t){return t.action},t.handleResponse=function(e,t){return{data:t.data}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNRemoveMessageActionOperation},t.validateParams=function(e,t){var n=e.config,r=t.channel,i=t.actionTimetoken;if(!t.messageTimetoken)return"Missing message timetoken";if(!i)return"Missing action timetoken";if(!n.subscribeKey)return"Missing Subscribe Key";if(!r)return"Missing message channel"},t.useDelete=function(){return!0},t.getURL=function(e,t){var n=e.config,r=t.channel,i=t.actionTimetoken,o=t.messageTimetoken;return"/v1/message-actions/".concat(n.subscribeKey,"/channel/").concat(r,"/message/").concat(o,"/action/").concat(i)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(){return{}},t.handleResponse=function(e,t){return{data:t.data}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNGetMessageActionsOperation},t.validateParams=function(e,t){var n=e.config,r=t.channel;if(!n.subscribeKey)return"Missing Subscribe Key";if(!r)return"Missing message channel"},t.getURL=function(e,t){var n=e.config,r=t.channel;return"/v1/message-actions/".concat(n.subscribeKey,"/channel/").concat(r)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.limit,r=t.start,i=t.end,o={};n&&(o.limit=n);r&&(o.start=r);i&&(o.end=i);return o},t.handleResponse=function(e,t){var n={data:t.data,start:null,end:null};n.data.length&&(n.end=n.data[n.data.length-1].actionTimetoken,n.start=n.data[0].actionTimetoken);return n};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNCreateUserOperation},t.validateParams=function(e,t){var n=e.config,r=t.id,i=t.name,o=t.custom;if(!r)return"Missing User.id";if(!i)return"Missing User.name";if(!n.subscribeKey)return"Missing Subscribe Key";if(o&&!Object.values(o).every(function(e){return"string"==typeof e||"number"==typeof e||"boolean"==typeof e}))return"Invalid custom type, only string, number and boolean values are allowed."},t.usePost=function(){return!0},t.getURL=function(e){var t=e.config;return"/v1/objects/".concat(t.subscribeKey,"/users")},t.postURL=function(e){var t=e.config;return"/v1/objects/".concat(t.subscribeKey,"/users")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t.id)||e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r={};n?void 0===n.customFields&&(n.customFields=!0):n={customFields:!0};if(n){var i=[];n.customFields&&i.push("custom");var o=i.join(",");0<o.length&&(r.include=o)}return r},t.postPayload=function(e,t){return function(e,t){return t}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateUserOperation},t.validateParams=function(e,t){var n=e.config,r=t.id,i=t.name,o=t.custom;if(!r)return"Missing User.id";if(!i)return"Missing User.name";if(!n.subscribeKey)return"Missing Subscribe Key";if(o&&!Object.values(o).every(function(e){return"string"==typeof e||"number"==typeof e||"boolean"==typeof e}))return"Invalid custom type, only string, number and boolean values are allowed."},t.usePatch=function(){return!0},t.getURL=function(e,t){var n=e.config,r=t.id;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(r)},t.patchURL=function(e,t){var n=e.config,r=t.id;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(r)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t.id)||e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r={};n?void 0===n.customFields&&(n.customFields=!0):n={customFields:!0};if(n){var i=[];n.customFields&&i.push("custom");var o=i.join(",");0<o.length&&(r.include=o)}return r},t.patchPayload=function(e,t){return function(e,t){return t}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNDeleteUserOperation},t.validateParams=function(e,t){var n=e.config;if(!t)return"Missing UserId";if(!n.subscribeKey)return"Missing Subscribe Key"},t.useDelete=function(){return!0},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t)||e.tokenManager.getToken("user")},t.prepareParams=function(){return{}},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNGetUserOperation},t.validateParams=function(e,t){if(!t.userId)return"Missing userId"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t.userId)||e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r={};n?void 0===n.customFields&&(n.customFields=!0):n={customFields:!0};if(n){var i=[];n.customFields&&i.push("custom");var o=i.join(",");0<o.length&&(r.include=o)}return r},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNGetUsersOperation},t.validateParams=function(){},t.getURL=function(e){var t=e.config;return"/v1/objects/".concat(t.subscribeKey,"/users")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e){return e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNCreateSpaceOperation},t.validateParams=function(e,t){var n=e.config,r=t.id,i=t.name,o=t.custom;if(!r)return"Missing Space.id";if(!i)return"Missing Space.name";if(!n.subscribeKey)return"Missing Subscribe Key";if(o&&!Object.values(o).every(function(e){return"string"==typeof e||"number"==typeof e||"boolean"==typeof e}))return"Invalid custom type, only string, number and boolean values are allowed."},t.usePost=function(){return!0},t.getURL=function(e){var t=e.config;return"/v1/objects/".concat(t.subscribeKey,"/spaces")},t.postURL=function(e){var t=e.config;return"/v1/objects/".concat(t.subscribeKey,"/spaces")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t.id)||e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r={};n?void 0===n.customFields&&(n.customFields=!0):n={customFields:!0};if(n){var i=[];n.customFields&&i.push("custom");var o=i.join(",");0<o.length&&(r.include=o)}return r},t.postPayload=function(e,t){return function(e,t){return t}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateSpaceOperation},t.validateParams=function(e,t){var n=e.config,r=t.id,i=t.name,o=t.custom;if(!r)return"Missing Space.id";if(!i)return"Missing Space.name";if(!n.subscribeKey)return"Missing Subscribe Key";if(o&&!Object.values(o).every(function(e){return"string"==typeof e||"number"==typeof e||"boolean"==typeof e}))return"Invalid custom type, only string, number and boolean values are allowed."},t.usePatch=function(){return!0},t.getURL=function(e,t){var n=e.config,r=t.id;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(r)},t.patchURL=function(e,t){var n=e.config,r=t.id;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(r)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t.id)||e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r={};n?void 0===n.customFields&&(n.customFields=!0):n={customFields:!0};if(n){var i=[];n.customFields&&i.push("custom");var o=i.join(",");0<o.length&&(r.include=o)}return r},t.patchPayload=function(e,t){return function(e,t){return t}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNDeleteSpaceOperation},t.validateParams=function(e,t){var n=e.config;if(!t)return"Missing SpaceId";if(!n.subscribeKey)return"Missing Subscribe Key"},t.useDelete=function(){return!0},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t)||e.tokenManager.getToken("space")},t.prepareParams=function(){return{}},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNGetSpacesOperation},t.validateParams=function(){},t.getURL=function(e){var t=e.config;return"/v1/objects/".concat(t.subscribeKey,"/spaces")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e){return e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNGetSpaceOperation},t.validateParams=function(e,t){if(!t.spaceId)return"Missing spaceId"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t.spaceId)||e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r={};n?void 0===n.customFields&&(n.customFields=!0):n={customFields:!0};if(n){var i=[];n.customFields&&i.push("custom");var o=i.join(",");0<o.length&&(r.include=o)}return r},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNGetMembersOperation},t.validateParams=function(e,t){if(!t.spaceId)return"Missing spaceId"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId,"/users")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t.spaceId)||e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.userFields&&s.push("user"),n.customUserFields&&s.push("user.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateMembersOperation},t.validateParams=function(e,t){var n=t.spaceId,r=t.users;if(!n)return"Missing spaceId";if(!r)return"Missing users"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId,"/users")},t.patchURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId,"/users")},t.usePatch=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t.spaceId)||e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.spaceFields&&s.push("space"),n.customSpaceFields&&s.push("space.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.patchPayload=function(e,t){return function(e,t){var n=t.users,r={};n&&0<n.length&&(r.add=[],n.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),r.add.push(t)}));return r}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateMembersOperation},t.validateParams=function(e,t){var n=t.spaceId,r=t.users;if(!n)return"Missing spaceId";if(!r)return"Missing users"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId,"/users")},t.patchURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId,"/users")},t.usePatch=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t.spaceId)||e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.spaceFields&&s.push("space"),n.customSpaceFields&&s.push("space.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.patchPayload=function(e,t){return function(e,t){var n=t.addMembers,r=t.updateMembers,i=t.removeMembers,o=t.users,s={};n&&0<n.length&&(s.add=[],n.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),s.add.push(t)}));r&&0<r.length&&(s.update=[],r.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),s.update.push(t)}));o&&0<o.length&&(s.update=s.update||[],o.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),s.update.push(t)}));i&&0<i.length&&(s.remove=[],i.forEach(function(e){s.remove.push({id:e})}));return s}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateMembersOperation},t.validateParams=function(e,t){var n=t.spaceId,r=t.users;if(!n)return"Missing spaceId";if(!r)return"Missing users"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId,"/users")},t.patchURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/spaces/").concat(t.spaceId,"/users")},t.usePatch=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("space",t.spaceId)||e.tokenManager.getToken("space")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.spaceFields&&s.push("space"),n.customSpaceFields&&s.push("space.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.patchPayload=function(e,t){return function(e,t){var n=t.users,r={};n&&0<n.length&&(r.remove=[],n.forEach(function(e){r.remove.push({id:e})}));return r}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNGetMembershipsOperation},t.validateParams=function(e,t){if(!t.userId)return"Missing userId"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId,"/spaces")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t.userId)||e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.spaceFields&&s.push("space"),n.customSpaceFields&&s.push("space.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateMembershipsOperation},t.validateParams=function(e,t){var n=t.userId,r=t.spaces;if(!n)return"Missing userId";if(!r)return"Missing spaces"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId,"/spaces")},t.patchURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId,"/spaces")},t.usePatch=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t.userId)||e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.spaceFields&&s.push("space"),n.customSpaceFields&&s.push("space.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.patchPayload=function(e,t){return function(e,t){var n=t.addMemberships,r=t.updateMemberships,i=t.removeMemberships,o=t.spaces,s={};n&&0<n.length&&(s.add=[],n.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),s.add.push(t)}));r&&0<r.length&&(s.update=[],r.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),s.update.push(t)}));o&&0<o.length&&(s.update=s.update||[],o.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),s.update.push(t)}));i&&0<i.length&&(s.remove=[],i.forEach(function(e){s.remove.push({id:e})}));return s}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateMembershipsOperation},t.validateParams=function(e,t){var n=t.userId,r=t.spaces;if(!n)return"Missing userId";if(!r)return"Missing spaces"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId,"/spaces")},t.patchURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId,"/spaces")},t.usePatch=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t.userId)||e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.spaceFields&&s.push("space"),n.customSpaceFields&&s.push("space.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.patchPayload=function(e,t){return function(e,t){var n=t.spaces,r={};n&&0<n.length&&(r.add=[],n.forEach(function(e){var t={id:e.id};e.custom&&(t.custom=e.custom),r.add.push(t)}));return r}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNUpdateMembershipsOperation},t.validateParams=function(e,t){var n=t.userId,r=t.spaces;if(!n)return"Missing userId";if(!r)return"Missing spaces"},t.getURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId,"/spaces")},t.patchURL=function(e,t){var n=e.config;return"/v1/objects/".concat(n.subscribeKey,"/users/").concat(t.userId,"/spaces")},t.usePatch=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.getAuthToken=function(e,t){return e.tokenManager.getToken("user",t.userId)||e.tokenManager.getToken("user")},t.prepareParams=function(e,t){var n=t.include,r=t.limit,i=t.page,o={};r&&(o.limit=r);if(n){var s=[];n.totalCount&&(o.count=!0),n.customFields&&s.push("custom"),n.spaceFields&&s.push("space"),n.customSpaceFields&&s.push("space.custom");var a=s.join(",");0<a.length&&(o.include=a)}i&&(i.next&&(o.start=i.next),i.prev&&(o.end=i.prev));return o},t.patchPayload=function(e,t){return function(e,t){var n=t.spaces,r={};n&&0<n.length&&(r.remove=[],n.forEach(function(e){r.remove.push({id:e})}));return r}(0,t)},t.handleResponse=function(e,t){return t};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNAccessManagerAudit},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e){var t=e.config;return"/v2/auth/audit/sub-key/".concat(t.subscribeKey)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!1},t.prepareParams=function(e,t){var n=t.channel,r=t.channelGroup,i=t.authKeys,o=void 0===i?[]:i,s={};n&&(s.channel=n);r&&(s["channel-group"]=r);0<o.length&&(s.auth=o.join(","));return s},t.handleResponse=function(e,t){return t.payload};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNAccessManagerGrant},t.validateParams=function(e){var t=e.config;if(!t.subscribeKey)return"Missing Subscribe Key";if(!t.publishKey)return"Missing Publish Key";if(!t.secretKey)return"Missing Secret Key"},t.getURL=function(e){var t=e.config;return"/v2/auth/grant/sub-key/".concat(t.subscribeKey)},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!1},t.prepareParams=function(e,t){var n=t.channels,r=void 0===n?[]:n,i=t.channelGroups,o=void 0===i?[]:i,s=t.ttl,a=t.read,u=void 0!==a&&a,c=t.write,f=void 0!==c&&c,l=t.manage,h=void 0!==l&&l,p=t.authKeys,d=void 0===p?[]:p,g={};g.r=u?"1":"0",g.w=f?"1":"0",g.m=h?"1":"0",0<r.length&&(g.channel=r.join(","));0<o.length&&(g["channel-group"]=o.join(","));0<d.length&&(g.auth=d.join(","));!s&&0!==s||(g.ttl=s);return g},t.handleResponse=function(){return{}};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return i.default.PNAccessManagerGrantToken},t.extractPermissions=l,t.validateParams=function(e,t){var n=e.config;if(!n.subscribeKey)return"Missing Subscribe Key";if(!n.publishKey)return"Missing Publish Key";if(!n.secretKey)return"Missing Secret Key";if(!t.resources&&!t.patterns)return"Missing either Resources or Patterns.";if(t.resources&&(!t.resources.users||0===Object.keys(t.resources.users).length)&&(!t.resources.spaces||0===Object.keys(t.resources.spaces).length)||t.patterns&&(!t.patterns.users||0===Object.keys(t.patterns.users).length)&&(!t.patterns.spaces||0===Object.keys(t.patterns.spaces).length))return"Missing values for either Resources or Patterns."},t.postURL=function(e){var t=e.config;return"/v3/pam/".concat(t.subscribeKey,"/grant")},t.usePost=function(){return!0},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!1},t.prepareParams=function(){return{}},t.postPayload=function(e,t){return function(e,t){var n=t.ttl,r=t.resources,i=t.patterns,o=t.meta,s={ttl:0,permissions:{resources:{channels:{},groups:{},users:{},spaces:{}},patterns:{channels:{},groups:{},users:{},spaces:{}},meta:{}}};if(r){var a=r.users,u=r.spaces;a&&Object.keys(a).forEach(function(e){s.permissions.resources.users[e]=l(a[e])}),u&&Object.keys(u).forEach(function(e){s.permissions.resources.spaces[e]=l(u[e])})}if(i){var c=i.users,f=i.spaces;c&&Object.keys(c).forEach(function(e){s.permissions.patterns.users[e]=l(c[e])}),f&&Object.keys(f).forEach(function(e){s.permissions.patterns.spaces[e]=l(f[e])})}!n&&0!==n||(s.ttl=n);o&&(s.permissions.meta=o);return s}(0,t)},t.handleResponse=function(e,t){return t.data.token};n(0);var r,i=(r=n(1))&&r.__esModule?r:{default:r};function l(e){var t=0;return e.create&&(t|=16),e.delete&&(t|=8),e.manage&&(t|=4),e.write&&(t|=2),e.read&&(t|=1),t}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNPublishOperation},t.validateParams=function(e,t){var n=e.config,r=t.message;if(!t.channel)return"Missing Channel";if(!r)return"Missing Message";if(!n.subscribeKey)return"Missing Subscribe Key"},t.usePost=function(e,t){var n=t.sendByPost;return void 0!==n&&n},t.getURL=function(e,t){var n=e.config,r=t.channel,i=t.message,o=a(e,i);return"/publish/".concat(n.publishKey,"/").concat(n.subscribeKey,"/0/").concat(s.default.encodeString(r),"/0/").concat(s.default.encodeString(o))},t.postURL=function(e,t){var n=e.config,r=t.channel;return"/publish/".concat(n.publishKey,"/").concat(n.subscribeKey,"/0/").concat(s.default.encodeString(r),"/0")},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.postPayload=function(e,t){var n=t.message;return a(e,n)},t.prepareParams=function(e,t){var n=t.meta,r=t.replicate,i=void 0===r||r,o=t.storeInHistory,s=t.ttl,a={};null!=o&&(a.store=o?"1":"0");s&&(a.ttl=s);!1===i&&(a.norep="true");n&&"object"===u(n)&&(a.meta=JSON.stringify(n));return a},t.handleResponse=function(e,t){return{timetoken:t[2]}};n(0);var r=i(n(1)),s=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,t){var n=e.crypto,r=e.config,i=JSON.stringify(t);return r.cipherKey&&(i=n.encrypt(i),i=JSON.stringify(i)),i}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNSignalOperation},t.validateParams=function(e,t){var n=e.config,r=t.message;if(!t.channel)return"Missing Channel";if(!r)return"Missing Message";if(!n.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=e.config,r=t.channel,i=t.message,o=function(e,t){return JSON.stringify(t)}(0,i);return"/signal/".concat(n.publishKey,"/").concat(n.subscribeKey,"/0/").concat(s.default.encodeString(r),"/0/").concat(s.default.encodeString(o))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(){return{}},t.handleResponse=function(e,t){return{timetoken:t[2]}};n(0);var r=i(n(1)),s=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNHistoryOperation},t.validateParams=function(e,t){var n=t.channel,r=e.config;if(!n)return"Missing channel";if(!r.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.channel,r=e.config;return"/v2/history/sub-key/".concat(r.subscribeKey,"/channel/").concat(i.default.encodeString(n))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.start,r=t.end,i=t.reverse,o=t.count,s=void 0===o?100:o,a=t.stringifiedTimeToken,u=void 0!==a&&a,c=t.includeMeta,f=void 0!==c&&c,l={include_token:"true"};l.count=s,n&&(l.start=n);r&&(l.end=r);u&&(l.string_message_token="true");null!=i&&(l.reverse=i.toString());f&&(l.include_meta="true");return l},t.handleResponse=function(n,e){var r={messages:[],startTimeToken:e[1],endTimeToken:e[2]};Array.isArray(e[0])&&e[0].forEach(function(e){var t={timetoken:e.timetoken,entry:function(e,t){var n=e.config,r=e.crypto;if(!n.cipherKey)return t;try{return r.decrypt(t)}catch(e){return t}}(n,e.message)};e.meta&&(t.meta=e.meta),r.messages.push(t)});return r};n(0);var r=o(n(1)),i=o(n(2));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNDeleteMessagesOperation},t.validateParams=function(e,t){var n=t.channel,r=e.config;if(!n)return"Missing channel";if(!r.subscribeKey)return"Missing Subscribe Key"},t.useDelete=function(){return!0},t.getURL=function(e,t){var n=t.channel,r=e.config;return"/v3/history/sub-key/".concat(r.subscribeKey,"/channel/").concat(i.default.encodeString(n))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.start,r=t.end,i={};n&&(i.start=n);r&&(i.end=r);return i},t.handleResponse=function(e,t){return t.payload};n(0);var r=o(n(1)),i=o(n(2));function o(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNMessageCounts},t.validateParams=function(e,t){var n=t.channels,r=t.timetoken,i=t.channelTimetokens,o=e.config;if(!n)return"Missing channel";if(r&&i)return"timetoken and channelTimetokens are incompatible together";if(r&&i&&1<i.length&&n.length!==i.length)return"Length of channelTimetokens and channels do not match";if(!o.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=t.channels,r=e.config,i=n.join(",");return"/v3/history/sub-key/".concat(r.subscribeKey,"/message-counts/").concat(o.default.encodeString(i))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.timetoken,r=t.channelTimetokens,i={};if(r&&1===r.length){var o=function(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var n=[],r=!0,i=!1,o=void 0;try{for(var s,a=e[Symbol.iterator]();!(r=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{r||null==a.return||a.return()}finally{if(i)throw o}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(r,1)[0];i.timetoken=o}else r?i.channelsTimetoken=r.join(","):n&&(i.timetoken=n);return i},t.handleResponse=function(e,t){return{channels:t.channels}};var r=i(n(1)),o=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNFetchMessagesOperation},t.validateParams=function(e,t){var n=t.channels,r=t.includeMessageActions,i=void 0!==r&&r,o=e.config;if(!n||0===n.length)return"Missing channels";if(!o.subscribeKey)return"Missing Subscribe Key";if(i&&1<n.length)throw new TypeError("History can return actions data for a single channel only. Either pass a single channel or disable the includeMessageActions flag.")},t.getURL=function(e,t){var n=t.channels,r=void 0===n?[]:n,i=t.includeMessageActions,o=void 0!==i&&i,s=e.config,a=o?"history-with-actions":"history",u=0<r.length?r.join(","):",";return"/v3/".concat(a,"/sub-key/").concat(s.subscribeKey,"/channel/").concat(c.default.encodeString(u))},t.getRequestTimeout=function(e){return e.config.getTransactionTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=t.start,r=t.end,i=t.count,o=t.stringifiedTimeToken,s=void 0!==o&&o,a=t.includeMeta,u=void 0!==a&&a,c={};i&&(c.max=i);n&&(c.start=n);r&&(c.end=r);s&&(c.string_message_token="true");u&&(c.include_meta="true");return c},t.handleResponse=function(r,e){var i={channels:{}};return Object.keys(e.channels||{}).forEach(function(n){i.channels[n]=[],(e.channels[n]||[]).forEach(function(e){var t={};t.channel=n,t.timetoken=e.timetoken,t.message=function(e,t){var n=e.config,r=e.crypto;if(!n.cipherKey)return t;try{return r.decrypt(t)}catch(e){return t}}(r,e.message),e.actions&&(t.actions=e.actions,t.data=e.actions),e.meta&&(t.meta=e.meta),i.channels[n].push(t)})}),i};n(0);var r=i(n(1)),c=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getOperation=function(){return r.default.PNSubscribeOperation},t.validateParams=function(e){if(!e.config.subscribeKey)return"Missing Subscribe Key"},t.getURL=function(e,t){var n=e.config,r=t.channels,i=void 0===r?[]:r,o=0<i.length?i.join(","):",";return"/v2/subscribe/".concat(n.subscribeKey,"/").concat(s.default.encodeString(o),"/0")},t.getRequestTimeout=function(e){return e.config.getSubscribeTimeout()},t.isAuthSupported=function(){return!0},t.prepareParams=function(e,t){var n=e.config,r=t.state,i=t.channelGroups,o=void 0===i?[]:i,s=t.timetoken,a=t.filterExpression,u=t.region,c={heartbeat:n.getPresenceTimeout()};0<o.length&&(c["channel-group"]=o.join(","));a&&0<a.length&&(c["filter-expr"]=a);Object.keys(r).length&&(c.state=JSON.stringify(r));s&&(c.tt=s);u&&(c.tr=u);return c},t.handleResponse=function(e,t){var r=[];t.m.forEach(function(e){var t={publishTimetoken:e.p.t,region:e.p.r},n={shard:parseInt(e.a,10),subscriptionMatch:e.b,channel:e.c,messageType:e.e,payload:e.d,flags:e.f,issuingClientId:e.i,subscribeKey:e.k,originationTimetoken:e.o,userMetadata:e.u,publishMetaData:t};r.push(n)});var n={timetoken:t.t.t,region:t.t.r};return{messages:r,metadata:n}};n(0);var r=i(n(1)),s=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;i(n(3));var r=i(n(4));n(0);function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a,u,c,f=(a=l,(u=[{key:"init",value:function(e){this._config=e,this._maxSubDomain=20,this._currentSubDomain=Math.floor(Math.random()*this._maxSubDomain),this._providedFQDN=(this._config.secure?"https://":"http://")+this._config.origin,this._coreParams={},this.shiftStandardOrigin()}},{key:"nextOrigin",value:function(){return this._providedFQDN.match(/ps\.pndsn\.com$/i)?(this._currentSubDomain=this._currentSubDomain+1,this._currentSubDomain>=this._maxSubDomain&&(this._currentSubDomain=1),e=this._currentSubDomain.toString(),this._providedFQDN.replace("ps.pndsn.com","ps".concat(e,".pndsn.com"))):this._providedFQDN;var e}},{key:"hasModule",value:function(e){return e in this._modules}},{key:"shiftStandardOrigin",value:function(){return this._standardOrigin=this.nextOrigin(),this._standardOrigin}},{key:"getStandardOrigin",value:function(){return this._standardOrigin}},{key:"POST",value:function(e,t,n,r){return this._modules.post(e,t,n,r)}},{key:"PATCH",value:function(e,t,n,r){return this._modules.patch(e,t,n,r)}},{key:"GET",value:function(e,t,n){return this._modules.get(e,t,n)}},{key:"DELETE",value:function(e,t,n){return this._modules.del(e,t,n)}},{key:"_detectErrorCategory",value:function(e){if("ENOTFOUND"===e.code)return r.default.PNNetworkIssuesCategory;if("ECONNREFUSED"===e.code)return r.default.PNNetworkIssuesCategory;if("ECONNRESET"===e.code)return r.default.PNNetworkIssuesCategory;if("EAI_AGAIN"===e.code)return r.default.PNNetworkIssuesCategory;if(0===e.status||e.hasOwnProperty("status")&&void 0===e.status)return r.default.PNNetworkIssuesCategory;if(e.timeout)return r.default.PNTimeoutCategory;if("ETIMEDOUT"===e.code)return r.default.PNNetworkIssuesCategory;if(e.response){if(e.response.badRequest)return r.default.PNBadRequestCategory;if(e.response.forbidden)return r.default.PNAccessDeniedCategory}return r.default.PNUnknownCategory}}])&&o(a.prototype,u),void(c&&o(a,c)),l);function l(t){var n=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),s(this,"_modules",void 0),s(this,"_config",void 0),s(this,"_maxSubDomain",void 0),s(this,"_currentSubDomain",void 0),s(this,"_standardOrigin",void 0),s(this,"_subscribeOrigin",void 0),s(this,"_providedFQDN",void 0),s(this,"_requestTimeout",void 0),s(this,"_coreParams",void 0),this._modules={},Object.keys(t).forEach(function(e){n._modules[e]=t[e].bind(n)})}t.default=f,e.exports=t.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r={get:function(e){try{return localStorage.getItem(e)}catch(e){return null}},set:function(e,t){try{return localStorage.setItem(e,t)}catch(e){return null}}};t.default=r,e.exports=t.default},function(f,l,h){"use strict";(function(i){Object.defineProperty(l,"__esModule",{value:!0}),l.default=void 0;var e,o=(e=h(74))&&e.__esModule?e:{default:e};function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var n,r,a,u=(n=c,(r=[{key:"decodeToken",value:function(e){var t="";e.length%4==3?t="=":e.length%4==2&&(t="==");var n=e.replace("-","+").replace("_","/")+t,r=o.default.decode(new i.from(n,"base64"));if("object"===s(r))return r}}])&&t(n.prototype,r),void(a&&t(n,a)),c);function c(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c)}l.default=u,f.exports=l.default}).call(this,h(9).Buffer)},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";t.byteLength=function(e){var t=l(e),n=t[0],r=t[1];return 3*(n+r)/4-r},t.toByteArray=function(e){var t,n,r=l(e),i=r[0],o=r[1],s=new f(function(e,t,n){return 3*(t+n)/4-n}(0,i,o)),a=0,u=0<o?i-4:i;for(n=0;n<u;n+=4)t=c[e.charCodeAt(n)]<<18|c[e.charCodeAt(n+1)]<<12|c[e.charCodeAt(n+2)]<<6|c[e.charCodeAt(n+3)],s[a++]=t>>16&255,s[a++]=t>>8&255,s[a++]=255&t;2===o&&(t=c[e.charCodeAt(n)]<<2|c[e.charCodeAt(n+1)]>>4,s[a++]=255&t);1===o&&(t=c[e.charCodeAt(n)]<<10|c[e.charCodeAt(n+1)]<<4|c[e.charCodeAt(n+2)]>>2,s[a++]=t>>8&255,s[a++]=255&t);return s},t.fromByteArray=function(e){for(var t,n=e.length,r=n%3,i=[],o=0,s=n-r;o<s;o+=16383)i.push(u(e,o,s<o+16383?s:o+16383));1==r?(t=e[n-1],i.push(a[t>>2]+a[t<<4&63]+"==")):2==r&&(t=(e[n-2]<<8)+e[n-1],i.push(a[t>>10]+a[t>>4&63]+a[t<<2&63]+"="));return i.join("")};for(var a=[],c=[],f="undefined"!=typeof Uint8Array?Uint8Array:Array,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,o=r.length;i<o;++i)a[i]=r[i],c[r.charCodeAt(i)]=i;function l(e){var t=e.length;if(0<t%4)throw new Error("Invalid string. Length must be a multiple of 4");var n=e.indexOf("=");return-1===n&&(n=t),[n,n===t?0:4-n%4]}function u(e,t,n){for(var r,i,o=[],s=t;s<n;s+=3)r=(e[s]<<16&16711680)+(e[s+1]<<8&65280)+(255&e[s+2]),o.push(a[(i=r)>>18&63]+a[i>>12&63]+a[i>>6&63]+a[63&i]);return o.join("")}c["-".charCodeAt(0)]=62,c["_".charCodeAt(0)]=63},function(e,t){t.read=function(e,t,n,r,i){var o,s,a=8*i-r-1,u=(1<<a)-1,c=u>>1,f=-7,l=n?i-1:0,h=n?-1:1,p=e[t+l];for(l+=h,o=p&(1<<-f)-1,p>>=-f,f+=a;0<f;o=256*o+e[t+l],l+=h,f-=8);for(s=o&(1<<-f)-1,o>>=-f,f+=r;0<f;s=256*s+e[t+l],l+=h,f-=8);if(0===o)o=1-c;else{if(o===u)return s?NaN:1/0*(p?-1:1);s+=Math.pow(2,r),o-=c}return(p?-1:1)*s*Math.pow(2,o-r)},t.write=function(e,t,n,r,i,o){var s,a,u,c=8*o-i-1,f=(1<<c)-1,l=f>>1,h=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=r?0:o-1,d=r?1:-1,g=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(a=isNaN(t)?1:0,s=f):(s=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-s))<1&&(s--,u*=2),2<=(t+=1<=s+l?h/u:h*Math.pow(2,1-l))*u&&(s++,u/=2),f<=s+l?(a=0,s=f):1<=s+l?(a=(t*u-1)*Math.pow(2,i),s+=l):(a=t*Math.pow(2,l-1)*Math.pow(2,i),s=0));8<=i;e[n+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,c+=i;0<c;e[n+p]=255&s,p+=d,s/=256,c-=8);e[n+p-d]|=128*g}},function(e,t){var n={}.toString;e.exports=Array.isArray||function(e){return"[object Array]"==n.call(e)}},function(r,i,e){(function(b){var e,t,n;t=[],void 0===(n="function"==typeof(e=function(){var e=function(){function o(e){this.$hex=e}o.prototype={length:function(){return this.$hex.length/2},toString:function(e){if(!e||"hex"===e||16===e)return this.$hex;if("utf-8"===e){for(var t="",n=0;n<this.$hex.length;n+=2)t+="%"+this.$hex.substring(n,n+2);return decodeURIComponent(t)}if("latin"!==e)throw new Error("Unrecognised format: "+e);for(var t=[],n=0;n<this.$hex.length;n+=2)t.push(parseInt(this.$hex.substring(n,n+2),16));return String.fromCharCode.apply(String,t)}},o.fromLatinString=function(e){for(var t="",n=0;n<e.length;n++){var r=e.charCodeAt(n).toString(16);1===r.length&&(r="0"+r),t+=r}return new o(t)},o.fromUtf8String=function(e){for(var t=encodeURIComponent(e),n="",r=0;r<t.length;r++)if("%"===t.charAt(r))n+=t.substring(r+1,r+3),r+=2;else{var i=t.charCodeAt(r).toString(16);i.length<2&&(i="0"+i),n+=i}return new o(n)};var s=[],f={},r=function(e){return function(){throw new Error(e+" not implemented")}};function e(){}function t(){}function l(e,t){var n=e.value;return n<24?n:24==n?t.readByte():25==n?t.readUint16():26==n?t.readUint32():27==n?t.readUint64():31==n?null:void r("Additional info: "+n)()}function a(e,t,n){var r=e<<5;t<24?n.writeByte(r|t):t<256?(n.writeByte(24|r),n.writeByte(t)):t<65536?(n.writeByte(25|r),n.writeUint16(t)):t<4294967296?(n.writeByte(26|r),n.writeUint32(t)):(n.writeByte(27|r),n.writeUint64(t))}e.prototype={peekByte:r("peekByte"),readByte:r("readByte"),readChunk:r("readChunk"),readFloat16:function(){var e=this.readUint16(),t=(32767&e)>>10,n=1023&e,r=32768&e;if(31==t)return 0==n?r?-1/0:1/0:NaN;var i=t?Math.pow(2,t-25)*(1024+n):Math.pow(2,-24)*n;return r?-i:i},readFloat32:function(){var e=this.readUint32(),t=(2147483647&e)>>23,n=8388607&e,r=2147483648&e;if(255==t)return 0==n?r?-1/0:1/0:NaN;var i=t?Math.pow(2,t-23-127)*(8388608+n):Math.pow(2,-149)*n;return r?-i:i},readFloat64:function(){var e=this.readUint32(),t=this.readUint32(),n=e>>20&2047,r=4294967296*(1048575&e)+t,i=2147483648&e;if(2047==n)return 0===r?i?-1/0:1/0:NaN;var o=n?Math.pow(2,n-52-1023)*(4503599627370496+r):Math.pow(2,-1074)*r;return i?-o:o},readUint16:function(){return 256*this.readByte()+this.readByte()},readUint32:function(){return 65536*this.readUint16()+this.readUint16()},readUint64:function(){return 4294967296*this.readUint32()+this.readUint32()}},t.prototype={writeByte:r("writeByte"),result:r("result"),writeFloat16:r("writeFloat16"),writeFloat32:r("writeFloat32"),writeFloat64:r("writeFloat64"),writeUint16:function(e){this.writeByte(e>>8&255),this.writeByte(255&e)},writeUint32:function(e){this.writeUint16(e>>16&65535),this.writeUint16(65535&e)},writeUint64:function(e){if(9007199254740992<=e||e<=-9007199254740992)throw new Error("Cannot encode Uint64 of: "+e+" magnitude to big (floating point errors)");this.writeUint32(Math.floor(e/4294967296)),this.writeUint32(e%4294967296)},writeString:r("writeString"),canWriteBinary:function(e){return!1},writeBinary:r("writeChunk")};var h=new Error;function p(e){var t=function(e){var t=e.readByte();return{type:t>>5,value:31&t}}(e);switch(t.type){case 0:return l(t,e);case 1:return-1-l(t,e);case 2:return e.readChunk(l(t,e));case 3:var n=e.readChunk(l(t,e));return n.toString("utf-8");case 4:case 5:var r=l(t,e),i=[];if(null!==r){5===t.type&&(r*=2);for(var o=0;o<r;o++)i[o]=p(e)}else for(var s;(s=p(e))!==h;)i.push(s);if(5!==t.type)return i;for(var a={},o=0;o<i.length;o+=2)a[i[o]]=i[o+1];return a;case 6:var u=l(t,e),c=f[u],i=p(e);return c?c(i):i;case 7:if(25===t.value)return e.readFloat16();if(26===t.value)return e.readFloat32();if(27===t.value)return e.readFloat64();switch(l(t,e)){case 20:return!1;case 21:return!0;case 22:return null;case 23:return;case null:return h;default:throw new Error("Unknown fixed value: "+t.value)}default:throw new Error("Unsupported header: "+JSON.stringify(t))}throw new Error("not implemented yet")}function u(e,t){for(var n=0;n<s.length;n++){var r=s[n].fn(e);if(void 0!==r)return a(6,s[n].tag,t),u(r,t)}if(e&&"function"==typeof e.toCBOR&&(e=e.toCBOR()),!1===e)a(7,20,t);else if(!0===e)a(7,21,t);else if(null===e)a(7,22,t);else if(void 0===e)a(7,23,t);else if("number"==typeof e)Math.floor(e)===e&&e<9007199254740992&&-9007199254740992<e?e<0?a(1,-1-e,t):a(0,e,t):(function(e,t,n){n.writeByte(e<<5|t)}(7,27,t),t.writeFloat64(e));else if("string"==typeof e)t.writeString(e,function(e){a(3,e,t)});else if(t.canWriteBinary(e))t.writeBinary(e,function(e){a(2,e,t)});else{if("object"!=typeof e)throw new Error("CBOR encoding not supported: "+e);if(g.config.useToJSON&&"function"==typeof e.toJSON&&(e=e.toJSON()),Array.isArray(e)){a(4,e.length,t);for(var n=0;n<e.length;n++)u(e[n],t)}else{var i=Object.keys(e);a(5,i.length,t);for(var n=0;n<i.length;n++)u(i[n],t),u(e[i[n]],t)}}}var c=[],d=[],g={config:{useToJSON:!0},addWriter:function(t,n){"string"==typeof t?d.push(function(e){if(t===e)return n(e)}):d.push(t)},addReader:function(n,r){"string"==typeof n?c.push(function(e,t){if(n===t)return r(e,t)}):c.push(n)},encode:function(e,t){for(var n=0;n<d.length;n++){var r=d[n],i=r(t);if(i)return u(e,i),i.result()}throw new Error("Unsupported output format: "+t)},decode:function(e,t){for(var n=0;n<c.length;n++){var r=c[n],i=r(e,t);if(i)return p(i)}throw new Error("Unsupported input format: "+t)},addSemanticEncode:function(e,t){if("number"!=typeof e||e%1!=0||e<0)throw new Error("Tag must be a positive integer");return s.push({tag:e,fn:t}),this},addSemanticDecode:function(e,t){if("number"!=typeof e||e%1!=0||e<0)throw new Error("Tag must be a positive integer");return f[e]=t,this},Reader:e,Writer:t};function i(e){this.buffer=e,this.pos=0}function n(e){this.byteLength=0,this.defaultBufferLength=16384,this.latestBuffer=b.alloc(this.defaultBufferLength),this.latestBufferOffset=0,this.completeBuffers=[],this.stringFormat=e}function y(e){this.hex=e,this.pos=0}function v(e){this.$hex="",this.finalFormat=e||"hex"}return(i.prototype=Object.create(e.prototype)).peekByte=function(){return this.buffer[this.pos]},i.prototype.readByte=function(){return this.buffer[this.pos++]},i.prototype.readUint16=function(){var e=this.buffer.readUInt16BE(this.pos);return this.pos+=2,e},i.prototype.readUint32=function(){var e=this.buffer.readUInt32BE(this.pos);return this.pos+=4,e},i.prototype.readFloat32=function(){var e=this.buffer.readFloatBE(this.pos);return this.pos+=4,e},i.prototype.readFloat64=function(){var e=this.buffer.readDoubleBE(this.pos);return this.pos+=8,e},i.prototype.readChunk=function(e){var t=b.alloc(e);return this.buffer.copy(t,0,this.pos,this.pos+=e),t},(n.prototype=Object.create(t.prototype)).writeByte=function(e){this.latestBuffer[this.latestBufferOffset++]=e,this.latestBufferOffset>=this.latestBuffer.length&&(this.completeBuffers.push(this.latestBuffer),this.latestBuffer=b.alloc(this.defaultBufferLength),this.latestBufferOffset=0),this.byteLength++},n.prototype.writeFloat32=function(e){var t=b.alloc(4);t.writeFloatBE(e,0),this.writeBuffer(t)},n.prototype.writeFloat64=function(e){var t=b.alloc(8);t.writeDoubleBE(e,0),this.writeBuffer(t)},n.prototype.writeString=function(e,t){var n=b.from(e,"utf-8");t(n.length),this.writeBuffer(n)},n.prototype.canWriteBinary=function(e){return e instanceof b},n.prototype.writeBinary=function(e,t){t(e.length),this.writeBuffer(e)},n.prototype.writeBuffer=function(e){if(!(e instanceof b))throw new TypeError("BufferWriter only accepts Buffers");this.latestBufferOffset?this.latestBuffer.length-this.latestBufferOffset>=e.length?(e.copy(this.latestBuffer,this.latestBufferOffset),this.latestBufferOffset+=e.length,this.latestBufferOffset>=this.latestBuffer.length&&(this.completeBuffers.push(this.latestBuffer),this.latestBuffer=b.alloc(this.defaultBufferLength),this.latestBufferOffset=0)):(this.completeBuffers.push(this.latestBuffer.slice(0,this.latestBufferOffset)),this.completeBuffers.push(e),this.latestBuffer=b.alloc(this.defaultBufferLength),this.latestBufferOffset=0):this.completeBuffers.push(e),this.byteLength+=e.length},n.prototype.result=function(){for(var e=b.alloc(this.byteLength),t=0,n=0;n<this.completeBuffers.length;n++){var r=this.completeBuffers[n];r.copy(e,t,0,r.length),t+=r.length}return this.latestBufferOffset&&this.latestBuffer.copy(e,t,0,this.latestBufferOffset),this.stringFormat?e.toString(this.stringFormat):e},"function"==typeof b&&(g.addReader(function(e,t){if(e instanceof b)return new i(e);if("hex"===t||"base64"===t){var n=b.from(e,t);return new i(n)}}),g.addWriter(function(e){return e&&"buffer"!==e?"hex"===e||"base64"===e?new n(e):void 0:new n})),(y.prototype=Object.create(e.prototype)).peekByte=function(){var e=this.hex.substring(this.pos,2);return parseInt(e,16)},y.prototype.readByte=function(){var e=this.hex.substring(this.pos,this.pos+2);return this.pos+=2,parseInt(e,16)},y.prototype.readChunk=function(e){var t=this.hex.substring(this.pos,this.pos+2*e);return this.pos+=2*e,"function"==typeof b?b.from(t,"hex"):new o(t)},(v.prototype=Object.create(t.prototype)).writeByte=function(e){if(e<0||255<e)throw new Error("Byte value out of range: "+e);var t=e.toString(16);1==t.length&&(t="0"+t),this.$hex+=t},v.prototype.canWriteBinary=function(e){return e instanceof o||"function"==typeof b&&e instanceof b},v.prototype.writeBinary=function(e,t){if(e instanceof o)t(e.length()),this.$hex+=e.$hex;else{if(!("function"==typeof b&&e instanceof b))throw new TypeError("HexWriter only accepts BinaryHex or Buffers");t(e.length),this.$hex+=e.toString("hex")}},v.prototype.result=function(){return"buffer"===this.finalFormat&&"function"==typeof b?b.from(this.$hex,"hex"):new o(this.$hex).toString(this.finalFormat)},v.prototype.writeString=function(e,t){var n=o.fromUtf8String(e);t(n.length()),this.$hex+=n.$hex},g.addReader(function(e,t){return e instanceof o||e.$hex?new y(e.$hex):"hex"===t?new y(e):void 0}),g.addWriter(function(e){if("hex"===e)return new v}),g}();return e.addSemanticEncode(0,function(e){if(e instanceof Date)return e.toISOString()}).addSemanticDecode(0,function(e){return new Date(e)}).addSemanticDecode(1,function(e){return new Date(e)}),e})?e.apply(i,t):e)||(r.exports=n)}).call(this,e(9).Buffer)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.get=function(e,t,n){var r=o.default.get(this.getStandardOrigin()+t.url).set(t.headers).query(e);return s.call(this,r,t,n)},t.post=function(e,t,n,r){var i=o.default.post(this.getStandardOrigin()+n.url).query(e).set(n.headers).send(t);return s.call(this,i,n,r)},t.patch=function(e,t,n,r){var i=o.default.patch(this.getStandardOrigin()+n.url).query(e).set(n.headers).send(t);return s.call(this,i,n,r)},t.del=function(e,t,n){var r=o.default.delete(this.getStandardOrigin()+t.url).set(t.headers).query(e);return s.call(this,r,t,n)};var r,o=(r=n(76))&&r.__esModule?r:{default:r};n(0);function a(r){var i=(new Date).getTime(),e=(new Date).toISOString(),o=console&&console.log?console:window&&window.console&&window.console.log?window.console:console;o.log("<<<<<"),o.log("[".concat(e,"]"),"\n",r.url,"\n",r.qs),o.log("-----"),r.on("response",function(e){var t=(new Date).getTime()-i,n=(new Date).toISOString();o.log(">>>>>>"),o.log("[".concat(n," / ").concat(t,"]"),"\n",r.url,"\n",r.qs,"\n",e.text),o.log("-----")})}function s(e,i,o){var s=this;return this._config.logVerbosity&&(e=e.use(a)),this._config.proxy&&this._modules.proxy&&(e=this._modules.proxy.call(this,e)),this._config.keepAlive&&this._modules.keepAlive&&(e=this._modules.keepAlive(e)),e.timeout(i.timeout).end(function(t,n){var e,r={};if(r.error=null!==t,r.operation=i.operation,n&&n.status&&(r.statusCode=n.status),t){if(t.response&&t.response.text&&!s._config.logVerbosity)try{r.errorData=JSON.parse(t.response.text)}catch(e){r.errorData=t}else r.errorData=t;return r.category=s._detectErrorCategory(t),o(r,null)}try{e=JSON.parse(n.text)}catch(e){return r.errorData=n,r.error=!0,o(r,null)}return e.error&&1===e.error&&e.status&&e.message&&e.service?(r.errorData=e,r.statusCode=e.status,r.error=!0,r.category=s._detectErrorCategory(r),o(r,null)):(e.error&&e.error.message&&(r.errorData=e.error),o(r,e))})}},function(e,n,t){var r;r="undefined"!=typeof window?window:"undefined"!=typeof self?self:(console.warn("Using browser-only version of superagent in non-browser environment"),this);var i=t(77),o=t(78),s=t(10),a=t(79),u=t(81);function c(){}var f=n=e.exports=function(e,t){return"function"==typeof t?new n.Request("GET",e).end(t):1==arguments.length?new n.Request("GET",e):new n.Request(e,t)};n.Request=v,f.getXHR=function(){if(!(!r.XMLHttpRequest||r.location&&"file:"==r.location.protocol&&r.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}throw Error("Browser-only version of superagent could not find XHR")};var l="".trim?function(e){return e.trim()}:function(e){return e.replace(/(^\s*|\s*$)/g,"")};function h(e){if(!s(e))return e;var t=[];for(var n in e)p(t,n,e[n]);return t.join("&")}function p(t,n,e){if(null!=e)if(Array.isArray(e))e.forEach(function(e){p(t,n,e)});else if(s(e))for(var r in e)p(t,n+"["+r+"]",e[r]);else t.push(encodeURIComponent(n)+"="+encodeURIComponent(e));else null===e&&t.push(encodeURIComponent(n))}function d(e){for(var t,n,r={},i=e.split("&"),o=0,s=i.length;o<s;++o)-1==(n=(t=i[o]).indexOf("="))?r[decodeURIComponent(t)]="":r[decodeURIComponent(t.slice(0,n))]=decodeURIComponent(t.slice(n+1));return r}function g(e){return/[\/+]json($|[^-\w])/.test(e)}function y(e){this.req=e,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||void 0===this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;var t=this.xhr.status;1223===t&&(t=204),this._setStatusProperties(t),this.header=this.headers=function(e){for(var t,n,r,i,o=e.split(/\r?\n/),s={},a=0,u=o.length;a<u;++a)-1!==(t=(n=o[a]).indexOf(":"))&&(r=n.slice(0,t).toLowerCase(),i=l(n.slice(t+1)),s[r]=i);return s}(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&e._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null}function v(e,t){var r=this;this._query=this._query||[],this.method=e,this.url=t,this.header={},this._header={},this.on("end",function(){var t,n=null,e=null;try{e=new y(r)}catch(e){return(n=new Error("Parser is unable to parse the response")).parse=!0,n.original=e,r.xhr?(n.rawResponse=void 0===r.xhr.responseType?r.xhr.responseText:r.xhr.response,n.status=r.xhr.status?r.xhr.status:null,n.statusCode=n.status):(n.rawResponse=null,n.status=null),r.callback(n)}r.emit("response",e);try{r._isResponseOK(e)||(t=new Error(e.statusText||"Unsuccessful HTTP response"))}catch(e){t=e}t?(t.original=n,t.response=e,t.status=e.status,r.callback(t,e)):r.callback(null,e)})}function b(e,t,n){var r=f("DELETE",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r}f.serializeObject=h,f.parseString=d,f.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},f.serialize={"application/x-www-form-urlencoded":h,"application/json":JSON.stringify},f.parse={"application/x-www-form-urlencoded":d,"application/json":JSON.parse},a(y.prototype),y.prototype._parseBody=function(e){var t=f.parse[this.type];return this.req._parser?this.req._parser(this,e):(!t&&g(this.type)&&(t=f.parse["application/json"]),t&&e&&(e.length||e instanceof Object)?t(e):null)},y.prototype.toError=function(){var e=this.req,t=e.method,n=e.url,r="cannot "+t+" "+n+" ("+this.status+")",i=new Error(r);return i.status=this.status,i.method=t,i.url=n,i},f.Response=y,i(v.prototype),o(v.prototype),v.prototype.type=function(e){return this.set("Content-Type",f.types[e]||e),this},v.prototype.accept=function(e){return this.set("Accept",f.types[e]||e),this},v.prototype.auth=function(e,t,n){1===arguments.length&&(t=""),"object"==typeof t&&null!==t&&(n=t,t=""),n=n||{type:"function"==typeof btoa?"basic":"auto"};return this._auth(e,t,n,function(e){if("function"==typeof btoa)return btoa(e);throw new Error("Cannot use basic auth, btoa is not a function")})},v.prototype.query=function(e){return"string"!=typeof e&&(e=h(e)),e&&this._query.push(e),this},v.prototype.attach=function(e,t,n){if(t){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(e,t,n||t.name)}return this},v.prototype._getFormData=function(){return this._formData||(this._formData=new r.FormData),this._formData},v.prototype.callback=function(e,t){if(this._shouldRetry(e,t))return this._retry();var n=this._callback;this.clearTimeout(),e&&(this._maxRetries&&(e.retries=this._retries-1),this.emit("error",e)),n(e,t)},v.prototype.crossDomainError=function(){var e=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");e.crossDomain=!0,e.status=this.status,e.method=this.method,e.url=this.url,this.callback(e)},v.prototype.buffer=v.prototype.ca=v.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},v.prototype.pipe=v.prototype.write=function(){throw Error("Streaming is not supported in browser version of superagent")},v.prototype._isHost=function(e){return e&&"object"==typeof e&&!Array.isArray(e)&&"[object Object]"!==Object.prototype.toString.call(e)},v.prototype.end=function(e){return this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=e||c,this._finalizeQueryString(),this._end()},v.prototype._end=function(){var n=this,r=this.xhr=f.getXHR(),e=this._formData||this._data;this._setTimeouts(),r.onreadystatechange=function(){var e=r.readyState;if(2<=e&&n._responseTimeoutTimer&&clearTimeout(n._responseTimeoutTimer),4==e){var t;try{t=r.status}catch(e){t=0}if(!t){if(n.timedout||n._aborted)return;return n.crossDomainError()}n.emit("end")}};function t(e,t){0<t.total&&(t.percent=t.loaded/t.total*100),t.direction=e,n.emit("progress",t)}if(this.hasListeners("progress"))try{r.onprogress=t.bind(null,"download"),r.upload&&(r.upload.onprogress=t.bind(null,"upload"))}catch(e){}try{this.username&&this.password?r.open(this.method,this.url,!0,this.username,this.password):r.open(this.method,this.url,!0)}catch(e){return this.callback(e)}if(this._withCredentials&&(r.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof e&&!this._isHost(e)){var i=this._header["content-type"],o=this._serializer||f.serialize[i?i.split(";")[0]:""];!o&&g(i)&&(o=f.serialize["application/json"]),o&&(e=o(e))}for(var s in this.header)null!=this.header[s]&&this.header.hasOwnProperty(s)&&r.setRequestHeader(s,this.header[s]);return this._responseType&&(r.responseType=this._responseType),this.emit("request",this),r.send(void 0!==e?e:null),this},f.agent=function(){return new u},["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(function(r){u.prototype[r.toLowerCase()]=function(e,t){var n=new f.Request(r,e);return this._setDefaults(n),t&&n.end(t),n}}),u.prototype.del=u.prototype.delete,f.get=function(e,t,n){var r=f("GET",e);return"function"==typeof t&&(n=t,t=null),t&&r.query(t),n&&r.end(n),r},f.head=function(e,t,n){var r=f("HEAD",e);return"function"==typeof t&&(n=t,t=null),t&&r.query(t),n&&r.end(n),r},f.options=function(e,t,n){var r=f("OPTIONS",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r},f.del=b,f.delete=b,f.patch=function(e,t,n){var r=f("PATCH",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r},f.post=function(e,t,n){var r=f("POST",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r},f.put=function(e,t,n){var r=f("PUT",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r}},function(e,t,n){function r(e){if(e)return function(e){for(var t in r.prototype)e[t]=r.prototype[t];return e}(e)}(e.exports=r).prototype.on=r.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this},r.prototype.once=function(e,t){function n(){this.off(e,n),t.apply(this,arguments)}return n.fn=t,this.on(e,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n,r=this._callbacks["$"+e];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+e],this;for(var i=0;i<r.length;i++)if((n=r[i])===t||n.fn===t){r.splice(i,1);break}return 0===r.length&&delete this._callbacks["$"+e],this},r.prototype.emit=function(e){this._callbacks=this._callbacks||{};for(var t=new Array(arguments.length-1),n=this._callbacks["$"+e],r=1;r<arguments.length;r++)t[r-1]=arguments[r];if(n){r=0;for(var i=(n=n.slice(0)).length;r<i;++r)n[r].apply(this,t)}return this},r.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]},r.prototype.hasListeners=function(e){return!!this.listeners(e).length}},function(e,t,n){"use strict";var i=n(10);function r(e){if(e)return function(e){for(var t in r.prototype)e[t]=r.prototype[t];return e}(e)}(e.exports=r).prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},r.prototype.parse=function(e){return this._parser=e,this},r.prototype.responseType=function(e){return this._responseType=e,this},r.prototype.serialize=function(e){return this._serializer=e,this},r.prototype.timeout=function(e){if(!e||"object"!=typeof e)return this._timeout=e,this._responseTimeout=0,this;for(var t in e)switch(t){case"deadline":this._timeout=e.deadline;break;case"response":this._responseTimeout=e.response;break;default:console.warn("Unknown timeout option",t)}return this},r.prototype.retry=function(e,t){return 0!==arguments.length&&!0!==e||(e=1),e<=0&&(e=0),this._maxRetries=e,this._retries=0,this._retryCallback=t,this};var o=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];r.prototype._shouldRetry=function(e,t){if(!this._maxRetries||this._retries++>=this._maxRetries)return!1;if(this._retryCallback)try{var n=this._retryCallback(e,t);if(!0===n)return!0;if(!1===n)return!1}catch(e){console.error(e)}if(t&&t.status&&500<=t.status&&501!=t.status)return!0;if(e){if(e.code&&~o.indexOf(e.code))return!0;if(e.timeout&&"ECONNABORTED"==e.code)return!0;if(e.crossDomain)return!0}return!1},r.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},r.prototype.then=function(e,t){if(!this._fullfilledPromise){var i=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise(function(n,r){i.end(function(e,t){e?r(e):n(t)})})}return this._fullfilledPromise.then(e,t)},r.prototype.catch=function(e){return this.then(void 0,e)},r.prototype.use=function(e){return e(this),this},r.prototype.ok=function(e){if("function"!=typeof e)throw Error("Callback required");return this._okCallback=e,this},r.prototype._isResponseOK=function(e){return!!e&&(this._okCallback?this._okCallback(e):200<=e.status&&e.status<300)},r.prototype.getHeader=r.prototype.get=function(e){return this._header[e.toLowerCase()]},r.prototype.set=function(e,t){if(i(e)){for(var n in e)this.set(n,e[n]);return this}return this._header[e.toLowerCase()]=t,this.header[e]=t,this},r.prototype.unset=function(e){return delete this._header[e.toLowerCase()],delete this.header[e],this},r.prototype.field=function(e,t){if(null==e)throw new Error(".field(name, val) name can not be empty");if(this._data&&console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"),i(e)){for(var n in e)this.field(n,e[n]);return this}if(Array.isArray(t)){for(var r in t)this.field(e,t[r]);return this}if(null==t)throw new Error(".field(name, val) val can not be empty");return"boolean"==typeof t&&(t=""+t),this._getFormData().append(e,t),this},r.prototype.abort=function(){return this._aborted||(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort")),this},r.prototype._auth=function(e,t,n,r){switch(n.type){case"basic":this.set("Authorization","Basic "+r(e+":"+t));break;case"auto":this.username=e,this.password=t;break;case"bearer":this.set("Authorization","Bearer "+e)}return this},r.prototype.withCredentials=function(e){return null==e&&(e=!0),this._withCredentials=e,this},r.prototype.redirects=function(e){return this._maxRedirects=e,this},r.prototype.maxResponseSize=function(e){if("number"!=typeof e)throw TypeError("Invalid argument");return this._maxResponseSize=e,this},r.prototype.toJSON=function(){return{method:this.method,url:this.url,data:this._data,headers:this._header}},r.prototype.send=function(e){var t=i(e),n=this._header["content-type"];if(this._formData&&console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"),t&&!this._data)Array.isArray(e)?this._data=[]:this._isHost(e)||(this._data={});else if(e&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(t&&i(this._data))for(var r in e)this._data[r]=e[r];else"string"==typeof e?(n||this.type("form"),n=this._header["content-type"],this._data="application/x-www-form-urlencoded"==n?this._data?this._data+"&"+e:e:(this._data||"")+e):this._data=e;return!t||this._isHost(e)||n||this.type("json"),this},r.prototype.sortQuery=function(e){return this._sort=void 0===e||e,this},r.prototype._finalizeQueryString=function(){var e=this._query.join("&");if(e&&(this.url+=(0<=this.url.indexOf("?")?"&":"?")+e),this._query.length=0,this._sort){var t=this.url.indexOf("?");if(0<=t){var n=this.url.substring(t+1).split("&");"function"==typeof this._sort?n.sort(this._sort):n.sort(),this.url=this.url.substring(0,t)+"?"+n.join("&")}}},r.prototype._appendQueryString=function(){console.trace("Unsupported")},r.prototype._timeoutError=function(e,t,n){if(!this._aborted){var r=new Error(e+t+"ms exceeded");r.timeout=t,r.code="ECONNABORTED",r.errno=n,this.timedout=!0,this.abort(),this.callback(r)}},r.prototype._setTimeouts=function(){var e=this;this._timeout&&!this._timer&&(this._timer=setTimeout(function(){e._timeoutError("Timeout of ",e._timeout,"ETIME")},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(function(){e._timeoutError("Response timeout of ",e._responseTimeout,"ETIMEDOUT")},this._responseTimeout))}},function(e,t,n){"use strict";var i=n(80);function r(e){if(e)return function(e){for(var t in r.prototype)e[t]=r.prototype[t];return e}(e)}(e.exports=r).prototype.get=function(e){return this.header[e.toLowerCase()]},r.prototype._setHeaderProperties=function(e){var t=e["content-type"]||"";this.type=i.type(t);var n=i.params(t);for(var r in n)this[r]=n[r];this.links={};try{e.link&&(this.links=i.parseLinks(e.link))}catch(e){}},r.prototype._setStatusProperties=function(e){var t=e/100|0;this.status=this.statusCode=e,this.statusType=t,this.info=1==t,this.ok=2==t,this.redirect=3==t,this.clientError=4==t,this.serverError=5==t,this.error=(4==t||5==t)&&this.toError(),this.created=201==e,this.accepted=202==e,this.noContent=204==e,this.badRequest=400==e,this.unauthorized=401==e,this.notAcceptable=406==e,this.forbidden=403==e,this.notFound=404==e,this.unprocessableEntity=422==e}},function(e,t,n){"use strict";t.type=function(e){return e.split(/ *; */).shift()},t.params=function(e){return e.split(/ *; */).reduce(function(e,t){var n=t.split(/ *= */),r=n.shift(),i=n.shift();return r&&i&&(e[r]=i),e},{})},t.parseLinks=function(e){return e.split(/ *, */).reduce(function(e,t){var n=t.split(/ *; */),r=n[0].slice(1,-1);return e[n[1].split(/ *= */)[1].slice(1,-1)]=r,e},{})},t.cleanHeader=function(e,t){return delete e["content-type"],delete e["content-length"],delete e["transfer-encoding"],delete e.host,t&&(delete e.authorization,delete e.cookie),e}},function(e,t){function n(){this._defaults=[]}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(function(e){n.prototype[e]=function(){return this._defaults.push({fn:e,arguments:arguments}),this}}),n.prototype._setDefaults=function(t){this._defaults.forEach(function(e){t[e.fn].apply(t,e.arguments)})},e.exports=n}],i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=11);function i(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}var n,r});
//# sourceMappingURL=node_modules/pubnub/dist/web/pubnub.min.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/pubnub/dist/web/pubnub.min.js",}],
[3895, {"./identicon.container":3894,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _identicon.default;
  }
});

var _identicon = _interopRequireDefault(require("./identicon.container"));

//# sourceMappingURL=ui/components/ui/identicon/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/identicon/index.js",}],
[3955, {"./token-balance":3956,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _tokenBalance.default;
  }
});

var _tokenBalance = _interopRequireDefault(require("./token-balance"));

//# sourceMappingURL=ui/components/ui/token-balance/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/token-balance/index.js",}],
[4023, {"../../shared/constants/time":3598,"./useTimeout":4039,"@babel/runtime/helpers/interopRequireDefault":186,"copy-to-clipboard":1467,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCopyToClipboard = useCopyToClipboard;

var _react = require("react");

var _copyToClipboard = _interopRequireDefault(require("copy-to-clipboard"));

var _time = require("../../shared/constants/time");

var _useTimeout = require("./useTimeout");

/**
 * useCopyToClipboard
 *
 * @param {number} [delay=3000] - delay in ms
 *
 * @return {[boolean, Function]}
 */
const DEFAULT_DELAY = _time.SECOND * 3;

function useCopyToClipboard(delay = DEFAULT_DELAY) {
  const [copied, setCopied] = (0, _react.useState)(false);
  const startTimeout = (0, _useTimeout.useTimeout)(() => setCopied(false), delay, false);
  const handleCopy = (0, _react.useCallback)(text => {
    setCopied(true);
    startTimeout();
    (0, _copyToClipboard.default)(text);
  }, [startTimeout]);
  return [copied, handleCopy];
}

//# sourceMappingURL=ui/hooks/useCopyToClipboard.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useCopyToClipboard.js",}],
[3880, {"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

const Copy = ({
  className,
  size,
  color
}) => /*#__PURE__*/_react.default.createElement("svg", {
  className: className,
  width: size,
  height: size,
  viewBox: "0 0 11 11",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/_react.default.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z",
  fill: color
}));

Copy.defaultProps = {
  className: undefined
};
Copy.propTypes = {
  className: _propTypes.default.string,
  size: _propTypes.default.number.isRequired,
  color: _propTypes.default.string.isRequired
};
var _default = Copy;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/icon/copy-icon.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/icon/copy-icon.component.js",}],
[3944, {"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

const Spinner = ({
  className = '',
  color = '#000000'
}) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `spinner ${className}`
  }, /*#__PURE__*/_react.default.createElement("svg", {
    className: "lds-spinner",
    width: "100%",
    height: "100%",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "xMidYMid",
    style: {
      background: 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(0 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.9166666666666666s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(30 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.8333333333333334s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(60 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.75s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(90 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.6666666666666666s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(120 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.5833333333333334s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(150 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.5s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(180 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.4166666666666667s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(210 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.3333333333333333s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(240 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.25s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(270 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.16666666666666666s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(300 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "-0.08333333333333333s",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "rotate(330 50 50)"
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: 45,
    y: 0,
    rx: 0,
    ry: 0,
    width: 10,
    height: 30,
    fill: color
  }, /*#__PURE__*/_react.default.createElement("animate", {
    attributeName: "opacity",
    values: "1;0",
    dur: "1s",
    begin: "0s",
    repeatCount: "indefinite"
  })))));
};

Spinner.propTypes = {
  className: _propTypes.default.string,
  color: _propTypes.default.string
};
var _default = Spinner;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/spinner/spinner.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/spinner/spinner.component.js",}],
[3760, {"./network-display":3761,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _networkDisplay.default;
  }
});

var _networkDisplay = _interopRequireDefault(require("./network-display"));

//# sourceMappingURL=ui/components/app/network-display/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/network-display/index.js",}],
[3915, {"./metafox-logo.component":3916,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _metafoxLogo.default;
  }
});

var _metafoxLogo = _interopRequireDefault(require("./metafox-logo.component"));

//# sourceMappingURL=ui/components/ui/metafox-logo/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/metafox-logo/index.js",}],
[4115, {"../../components/ui/button":3842,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

class NewAccountCreateForm extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      newAccountName: '',
      defaultAccountName: this.context.t('newAccountNumberName', [this.props.newAccountNumber])
    });
  }

  render() {
    const {
      newAccountName,
      defaultAccountName
    } = this.state;
    const {
      history,
      createAccount,
      mostRecentOverviewPage
    } = this.props;

    const createClick = _ => {
      createAccount(newAccountName || defaultAccountName).then(() => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Add New Account',
            name: 'Added New Account'
          }
        });
        history.push(mostRecentOverviewPage);
      }).catch(e => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Add New Account',
            name: 'Error'
          },
          customVariables: {
            errorMessage: e.message
          }
        });
      });
    };

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-create-form"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-create-form__input-label"
    }, this.context.t('accountName')), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("input", {
      className: "new-account-create-form__input",
      value: newAccountName,
      placeholder: defaultAccountName,
      onChange: event => this.setState({
        newAccountName: event.target.value
      }),
      autoFocus: true
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-create-form__buttons"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "new-account-create-form__button",
      onClick: () => history.push(mostRecentOverviewPage)
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      large: true,
      className: "new-account-create-form__button",
      onClick: createClick
    }, this.context.t('create')))));
  }

}

exports.default = NewAccountCreateForm;
(0, _defineProperty2.default)(NewAccountCreateForm, "defaultProps", {
  newAccountNumber: 0
});
NewAccountCreateForm.propTypes = {
  createAccount: _propTypes.default.func,
  newAccountNumber: _propTypes.default.number,
  history: _propTypes.default.object,
  mostRecentOverviewPage: _propTypes.default.string.isRequired
};
NewAccountCreateForm.contextTypes = {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
};

//# sourceMappingURL=ui/pages/create-account/new-account.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/new-account.component.js",}],
[4112, {"../../../components/ui/button":3842,"../../../ducks/history/history":3982,"../../../selectors":4326,"../../../store/actions":4331,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099,"react-simple-file-input":3109,"redux":3144}, function (require, module, exports) {
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

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactSimpleFileInput = _interopRequireDefault(require("react-simple-file-input"));

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _selectors = require("../../../selectors");

var _button = _interopRequireDefault(require("../../../components/ui/button"));

var _history = require("../../../ducks/history/history");

const HELP_LINK = 'https://metamask.zendesk.com/hc/en-us/articles/360015489331-Importing-an-Account';

class JsonImportSubview extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      fileContents: '',
      isEmpty: true
    });
    (0, _defineProperty2.default)(this, "inputRef", /*#__PURE__*/_react.default.createRef());
  }

  render() {
    const {
      error,
      history,
      mostRecentOverviewPage
    } = this.props;
    const enabled = !this.state.isEmpty && this.state.fileContents !== '';
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form__json"
    }, /*#__PURE__*/_react.default.createElement("p", null, this.context.t('usedByClients')), /*#__PURE__*/_react.default.createElement("a", {
      className: "warning",
      href: HELP_LINK,
      target: "_blank",
      rel: "noopener noreferrer"
    }, this.context.t('fileImportFail')), /*#__PURE__*/_react.default.createElement(_reactSimpleFileInput.default, {
      readAs: "text",
      onLoad: this.onLoad.bind(this),
      style: {
        padding: '20px 0px 12px 15%',
        fontSize: '15px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }
    }), /*#__PURE__*/_react.default.createElement("input", {
      className: "new-account-import-form__input-password",
      type: "password",
      placeholder: this.context.t('enterPassword'),
      id: "json-password-box",
      onKeyPress: this.createKeyringOnEnter.bind(this),
      onChange: () => this.checkInputEmpty(),
      ref: this.inputRef
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-create-form__buttons"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "new-account-create-form__button",
      onClick: () => history.push(mostRecentOverviewPage)
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      large: true,
      className: "new-account-create-form__button",
      onClick: () => this.createNewKeychain(),
      disabled: !enabled
    }, this.context.t('import'))), error ? /*#__PURE__*/_react.default.createElement("span", {
      className: "error"
    }, error) : null);
  }

  onLoad(event) {
    this.setState({
      fileContents: event.target.result
    });
  }

  createKeyringOnEnter(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createNewKeychain();
    }
  }

  createNewKeychain() {
    const {
      firstAddress,
      displayWarning,
      history,
      importNewJsonAccount,
      mostRecentOverviewPage,
      setSelectedAddress
    } = this.props;
    const {
      fileContents
    } = this.state;
    const {
      t
    } = this.context;

    if (!fileContents) {
      const message = t('needImportFile');
      displayWarning(message);
      return;
    }

    const password = this.inputRef.current.value;
    importNewJsonAccount([fileContents, password]).then(({
      selectedAddress
    }) => {
      if (selectedAddress) {
        history.push(mostRecentOverviewPage);
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Import Account',
            name: 'Imported Account with JSON'
          }
        });
        displayWarning(null);
      } else {
        displayWarning(t('importAccountError'));
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Import Account',
            name: 'Error importing JSON'
          }
        });
        setSelectedAddress(firstAddress);
      }
    }).catch(err => err && displayWarning(err.message || err));
  }

  checkInputEmpty() {
    const password = this.inputRef.current.value;
    let isEmpty = true;

    if (password !== '') {
      isEmpty = false;
    }

    this.setState({
      isEmpty
    });
  }

}

JsonImportSubview.propTypes = {
  error: _propTypes.default.string,
  displayWarning: _propTypes.default.func,
  firstAddress: _propTypes.default.string,
  importNewJsonAccount: _propTypes.default.func,
  history: _propTypes.default.object,
  setSelectedAddress: _propTypes.default.func,
  mostRecentOverviewPage: _propTypes.default.string.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys((0, _selectors.getMetaMaskAccounts)(state))[0],
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    displayWarning: warning => dispatch(actions.displayWarning(warning)),
    importNewJsonAccount: options => dispatch(actions.importNewAccount('JSON File', options)),
    setSelectedAddress: address => dispatch(actions.setSelectedAddress(address))
  };
};

JsonImportSubview.contextTypes = {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(JsonImportSubview);

exports.default = _default;

//# sourceMappingURL=ui/pages/create-account/import-account/json.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/import-account/json.js",}],
[4113, {"../../../components/ui/button":3842,"../../../ducks/history/history":3982,"../../../selectors":4326,"../../../store/actions":4331,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _redux = require("redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _selectors = require("../../../selectors");

var _button = _interopRequireDefault(require("../../../components/ui/button"));

var _history = require("../../../ducks/history/history");

class PrivateKeyImportView extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "inputRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)(this, "state", {
      isEmpty: true
    });
    (0, _defineProperty2.default)(this, "createKeyringOnEnter", event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.createNewKeychain();
      }
    });
  }

  createNewKeychain() {
    const privateKey = this.inputRef.current.value;
    const {
      importNewAccount,
      history,
      displayWarning,
      mostRecentOverviewPage,
      setSelectedAddress,
      firstAddress
    } = this.props;
    const {
      t
    } = this.context;
    importNewAccount('Private Key', [privateKey]).then(({
      selectedAddress
    }) => {
      if (selectedAddress) {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Import Account',
            name: 'Imported Account with Private Key'
          }
        });
        history.push(mostRecentOverviewPage);
        displayWarning(null);
      } else {
        displayWarning(t('importAccountError'));
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Import Account',
            name: 'Error importing with Private Key'
          }
        });
        setSelectedAddress(firstAddress);
      }
    }).catch(err => err && displayWarning(err.message || err));
  }

  checkInputEmpty() {
    const privateKey = this.inputRef.current.value;
    let isEmpty = true;

    if (privateKey !== '') {
      isEmpty = false;
    }

    this.setState({
      isEmpty
    });
  }

  render() {
    const {
      error,
      displayWarning
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form__private-key"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "new-account-create-form__instruction"
    }, this.context.t('pastePrivateKey')), /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form__private-key-password-container"
    }, /*#__PURE__*/_react.default.createElement("input", {
      className: "new-account-import-form__input-password",
      type: "password",
      id: "private-key-box",
      onKeyPress: e => this.createKeyringOnEnter(e),
      onChange: () => this.checkInputEmpty(),
      ref: this.inputRef,
      autoFocus: true
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-import-form__buttons"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "new-account-create-form__button",
      onClick: () => {
        const {
          history,
          mostRecentOverviewPage
        } = this.props;
        displayWarning(null);
        history.push(mostRecentOverviewPage);
      }
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      large: true,
      className: "new-account-create-form__button",
      onClick: () => this.createNewKeychain(),
      disabled: this.state.isEmpty
    }, this.context.t('import'))), error ? /*#__PURE__*/_react.default.createElement("span", {
      className: "error"
    }, error) : null);
  }

}

(0, _defineProperty2.default)(PrivateKeyImportView, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(PrivateKeyImportView, "propTypes", {
  importNewAccount: _propTypes.default.func.isRequired,
  history: _propTypes.default.object.isRequired,
  displayWarning: _propTypes.default.func.isRequired,
  setSelectedAddress: _propTypes.default.func.isRequired,
  firstAddress: _propTypes.default.string.isRequired,
  error: _propTypes.default.node,
  mostRecentOverviewPage: _propTypes.default.string.isRequired
});

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(PrivateKeyImportView);

exports.default = _default;

function mapStateToProps(state) {
  return {
    error: state.appState.warning,
    firstAddress: Object.keys((0, _selectors.getMetaMaskAccounts)(state))[0],
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    importNewAccount: (strategy, [privateKey]) => {
      return dispatch(actions.importNewAccount(strategy, [privateKey]));
    },
    displayWarning: message => dispatch(actions.displayWarning(message || null)),
    setSelectedAddress: address => dispatch(actions.setSelectedAddress(address))
  };
}

//# sourceMappingURL=ui/pages/create-account/import-account/private-key.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/import-account/private-key.js",}],
[3862, {"./dropdown":3861,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _dropdown.default;
  }
});

var _dropdown = _interopRequireDefault(require("./dropdown"));

//# sourceMappingURL=ui/components/ui/dropdown/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/dropdown/index.js",}],
[4109, {"../../../components/ui/button":3842,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _button = _interopRequireDefault(require("../../../components/ui/button"));

class SelectHardware extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      selectedDevice: null
    });
    (0, _defineProperty2.default)(this, "connect", () => {
      if (this.state.selectedDevice) {
        this.props.connectToHardwareWallet(this.state.selectedDevice);
      }

      return null;
    });
  }

  renderConnectToTrezorButton() {
    return /*#__PURE__*/_react.default.createElement("button", {
      className: (0, _classnames.default)('hw-connect__btn', {
        selected: this.state.selectedDevice === 'trezor'
      }),
      onClick: _ => this.setState({
        selectedDevice: 'trezor'
      })
    }, /*#__PURE__*/_react.default.createElement("img", {
      className: "hw-connect__btn__img",
      src: "images/trezor-logo.svg",
      alt: "Trezor"
    }));
  }

  renderConnectToLedgerButton() {
    return /*#__PURE__*/_react.default.createElement("button", {
      className: (0, _classnames.default)('hw-connect__btn', {
        selected: this.state.selectedDevice === 'ledger'
      }),
      onClick: _ => this.setState({
        selectedDevice: 'ledger'
      })
    }, /*#__PURE__*/_react.default.createElement("img", {
      className: "hw-connect__btn__img",
      src: "images/ledger-logo.svg",
      alt: "Ledger"
    }));
  }

  renderButtons() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-connect__btn-wrapper"
    }, this.renderConnectToLedgerButton(), this.renderConnectToTrezorButton()));
  }

  renderContinueButton() {
    return /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "primary",
      large: true,
      className: "hw-connect__connect-btn",
      onClick: this.connect,
      disabled: !this.state.selectedDevice
    }, this.context.t('continue'));
  }

  renderUnsupportedBrowser() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-external-account-form unsupported-browser"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-connect"
    }, /*#__PURE__*/_react.default.createElement("h3", {
      className: "hw-connect__title"
    }, this.context.t('browserNotSupported')), /*#__PURE__*/_react.default.createElement("p", {
      className: "hw-connect__msg"
    }, this.context.t('chromeRequiredForHardwareWallets'))), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "primary",
      large: true,
      onClick: () => global.platform.openTab({
        url: 'https://google.com/chrome'
      })
    }, this.context.t('downloadGoogleChrome')));
  }

  renderHeader() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-connect__header"
    }, /*#__PURE__*/_react.default.createElement("h3", {
      className: "hw-connect__header__title"
    }, this.context.t('hardwareWallets')), /*#__PURE__*/_react.default.createElement("p", {
      className: "hw-connect__header__msg"
    }, this.context.t('hardwareWalletsMsg')));
  }

  renderTutorialsteps() {
    switch (this.state.selectedDevice) {
      case 'ledger':
        return this.renderLedgerTutorialSteps();

      case 'trezor':
        return this.renderTrezorTutorialSteps();

      default:
        return '';
    }
  }

  renderLedgerTutorialSteps() {
    const steps = [];

    if (this.props.useLedgerLive) {
      steps.push({
        title: this.context.t('step1LedgerWallet'),
        message: this.context.t('step1LedgerWalletMsg', [/*#__PURE__*/_react.default.createElement("a", {
          className: "hw-connect__msg-link",
          href: "https://www.ledger.com/ledger-live",
          rel: "noopener noreferrer",
          target: "_blank",
          key: "ledger-live-app-link"
        }, this.context.t('ledgerLiveApp'))])
      });
    }

    steps.push({
      asset: 'plug-in-wallet',
      dimensions: {
        width: '225px',
        height: '75px'
      },
      title: this.context.t('step2LedgerWallet'),
      message: this.context.t('step2LedgerWalletMsg')
    });
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-tutorial"
    }, steps.map((step, index) => /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-connect",
      key: index
    }, /*#__PURE__*/_react.default.createElement("h3", {
      className: "hw-connect__title"
    }, step.title), /*#__PURE__*/_react.default.createElement("p", {
      className: "hw-connect__msg"
    }, step.message), step.asset && /*#__PURE__*/_react.default.createElement("img", (0, _extends2.default)({
      className: "hw-connect__step-asset",
      src: `images/${step.asset}.svg`
    }, step.dimensions, {
      alt: ""
    })))));
  }

  renderTrezorTutorialSteps() {
    const steps = [{
      asset: 'plug-in-wallet',
      dimensions: {
        width: '225px',
        height: '75px'
      },
      title: this.context.t('step1TrezorWallet'),
      message: this.context.t('step1TrezorWalletMsg')
    }];
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-tutorial"
    }, steps.map((step, index) => /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-connect",
      key: index
    }, /*#__PURE__*/_react.default.createElement("h3", {
      className: "hw-connect__title"
    }, step.title), /*#__PURE__*/_react.default.createElement("p", {
      className: "hw-connect__msg"
    }, step.message), step.asset && /*#__PURE__*/_react.default.createElement("img", (0, _extends2.default)({
      className: "hw-connect__step-asset",
      src: `images/${step.asset}.svg`
    }, step.dimensions, {
      alt: ""
    })))));
  }

  renderConnectScreen() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-external-account-form"
    }, this.renderHeader(), this.renderButtons(), this.state.selectedDevice && this.renderTutorialsteps(), this.renderContinueButton());
  }

  render() {
    if (this.props.browserSupported) {
      return this.renderConnectScreen();
    }

    return this.renderUnsupportedBrowser();
  }

}

exports.default = SelectHardware;
(0, _defineProperty2.default)(SelectHardware, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(SelectHardware, "propTypes", {
  connectToHardwareWallet: _propTypes.default.func.isRequired,
  browserSupported: _propTypes.default.bool.isRequired,
  useLedgerLive: _propTypes.default.bool.isRequired
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/create-account/connect-hardware/select-hardware.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/connect-hardware/select-hardware.js",}],
[4107, {"../../../components/ui/button":3842,"../../../components/ui/check-box":3846,"../../../components/ui/dropdown":3862,"../../../components/ui/popover":3925,"../../../helpers/utils/util":4020,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/etherscan-link":966,"prop-types":2900,"react":3121}, function (require, module, exports) {
(function (global){
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

var _etherscanLink = require("@metamask/etherscan-link");

var _button = _interopRequireDefault(require("../../../components/ui/button"));

var _checkBox = _interopRequireDefault(require("../../../components/ui/check-box"));

var _dropdown = _interopRequireDefault(require("../../../components/ui/dropdown"));

var _popover = _interopRequireDefault(require("../../../components/ui/popover"));

var _util = require("../../../helpers/utils/util");

class AccountList extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      showPopover: false,
      pathValue: null
    });
    (0, _defineProperty2.default)(this, "goToNextPage", () => {
      // If we have < 5 accounts, it's restricted by BIP-44
      if (this.props.accounts.length === 5) {
        this.props.getPage(this.props.device, 1, this.props.selectedPath);
      } else {
        this.props.onAccountRestriction();
      }
    });
    (0, _defineProperty2.default)(this, "goToPreviousPage", () => {
      this.props.getPage(this.props.device, -1, this.props.selectedPath);
    });
  }

  setPath(pathValue) {
    this.setState({
      pathValue
    });
  }

  renderHdPathSelector() {
    const {
      selectedPath,
      hdPaths
    } = this.props;
    const {
      pathValue
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h3", {
      className: "hw-connect__hdPath__title"
    }, this.context.t('selectHdPath')), /*#__PURE__*/_react.default.createElement("p", {
      className: "hw-connect__msg"
    }, this.context.t('selectPathHelp')), /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-connect__hdPath"
    }, /*#__PURE__*/_react.default.createElement(_dropdown.default, {
      className: "hw-connect__hdPath__select",
      options: hdPaths,
      selectedOption: pathValue || selectedPath,
      onChange: value => {
        this.setPath(value);
      }
    })));
  }

  capitalizeDevice(device) {
    return device.slice(0, 1).toUpperCase() + device.slice(1);
  }

  renderHeader() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-connect"
    }, /*#__PURE__*/_react.default.createElement("h3", {
      className: "hw-connect__unlock-title"
    }, this.context.t('selectAnAccount')), /*#__PURE__*/_react.default.createElement("h3", {
      className: "hw-connect__hdPath__title"
    }, this.context.t('selectAnAccount')), /*#__PURE__*/_react.default.createElement("p", {
      className: "hw-connect__msg"
    }, this.context.t('selectAnAccountHelp'), this.context.t('selectAnAccountHelpDirections', [/*#__PURE__*/_react.default.createElement("button", {
      className: "hw-connect__msg-link",
      onClick: () => this.setState({
        showPopover: true
      }),
      key: "account-help"
    }, this.context.t('hardwareWalletSupportLinkConversion'))])));
  }

  renderAccounts() {
    const {
      accounts,
      connectedAccounts,
      rpcPrefs,
      chainId
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-account-list"
    }, accounts.map((account, idx) => {
      const accountAlreadyConnected = connectedAccounts.includes(account.address.toLowerCase());
      const value = account.index;
      const checked = this.props.selectedAccounts.includes(account.index) || accountAlreadyConnected;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "hw-account-list__item",
        key: account.address,
        title: accountAlreadyConnected ? this.context.t('selectAnAccountAlreadyConnected') : ''
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "hw-account-list__item__checkbox"
      }, /*#__PURE__*/_react.default.createElement(_checkBox.default, {
        id: `address-${idx}`,
        checked: checked,
        disabled: accountAlreadyConnected,
        onClick: () => {
          this.props.onAccountChange(value);
        }
      }), /*#__PURE__*/_react.default.createElement("label", {
        className: "hw-account-list__item__label",
        htmlFor: `address-${idx}`
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "hw-account-list__item__index"
      }, account.index + 1), `${account.address.slice(0, 4)}...${account.address.slice(-4)}`, /*#__PURE__*/_react.default.createElement("span", {
        className: "hw-account-list__item__balance"
      }, `${account.balance}`))), /*#__PURE__*/_react.default.createElement("a", {
        className: "hw-account-list__item__link",
        onClick: () => {
          const accountLink = (0, _etherscanLink.getAccountLink)(account.address, chainId, rpcPrefs);
          this.context.trackEvent({
            category: 'Account',
            event: 'Clicked Block Explorer Link',
            properties: {
              actions: 'Hardware Connect',
              link_type: 'Account Tracker',
              block_explorer_domain: (0, _util.getURLHostName)(accountLink)
            }
          });
          global.platform.openTab({
            url: accountLink
          });
        },
        target: "_blank",
        rel: "noopener noreferrer",
        title: this.context.t('etherscanView')
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: "images/popout.svg",
        alt: ""
      })));
    }));
  }

  renderPagination() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-list-pagination"
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "hw-list-pagination__button",
      onClick: this.goToPreviousPage
    }, `< ${this.context.t('prev')}`), /*#__PURE__*/_react.default.createElement("button", {
      className: "hw-list-pagination__button",
      onClick: this.goToNextPage
    }, `${this.context.t('next')} >`));
  }

  renderButtons() {
    const disabled = this.props.selectedAccounts.length === 0;
    const buttonProps = {};

    if (disabled) {
      buttonProps.disabled = true;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-external-account-form__buttons"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "new-external-account-form__button",
      onClick: this.props.onCancel.bind(this)
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "primary",
      large: true,
      className: "new-external-account-form__button unlock",
      disabled: disabled,
      onClick: this.props.onUnlockAccounts.bind(this, this.props.device, this.props.selectedPath)
    }, this.context.t('unlock')));
  }

  renderForgetDevice() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hw-forget-device-container"
    }, /*#__PURE__*/_react.default.createElement("a", {
      onClick: this.props.onForgetDevice.bind(this, this.props.device)
    }, this.context.t('forgetDevice')));
  }

  renderSelectPathPopover() {
    const {
      pathValue
    } = this.state;
    const {
      onPathChange
    } = this.props;

    const footer = /*#__PURE__*/_react.default.createElement("div", {
      className: "switch-ledger-path-popover__footer"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      onClick: () => this.setState({
        showPopover: false
      }),
      type: "secondary"
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      onClick: () => {
        onPathChange(pathValue);
        this.setState({
          showPopover: false
        });
      },
      type: "primary"
    }, this.context.t('save')));

    return /*#__PURE__*/_react.default.createElement(_popover.default, {
      title: this.context.t('switchLedgerPaths'),
      subtitle: this.context.t('switchLedgerPathsText'),
      contentClassName: "switch-ledger-path-popover__content",
      footer: footer
    }, this.renderHdPathSelector());
  }

  render() {
    const {
      showPopover
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-external-account-form account-list"
    }, this.renderHeader(), this.renderAccounts(), this.renderPagination(), this.renderButtons(), this.renderForgetDevice(), showPopover && this.renderSelectPathPopover());
  }

}

AccountList.propTypes = {
  onPathChange: _propTypes.default.func.isRequired,
  selectedPath: _propTypes.default.string.isRequired,
  device: _propTypes.default.string.isRequired,
  accounts: _propTypes.default.array.isRequired,
  connectedAccounts: _propTypes.default.array.isRequired,
  onAccountChange: _propTypes.default.func.isRequired,
  onForgetDevice: _propTypes.default.func.isRequired,
  getPage: _propTypes.default.func.isRequired,
  chainId: _propTypes.default.string,
  rpcPrefs: _propTypes.default.object,
  selectedAccounts: _propTypes.default.array.isRequired,
  onUnlockAccounts: _propTypes.default.func,
  onCancel: _propTypes.default.func,
  onAccountRestriction: _propTypes.default.func,
  hdPaths: _propTypes.default.array.isRequired
};
AccountList.contextTypes = {
  t: _propTypes.default.func,
  trackEvent: _propTypes.default.func
};
var _default = AccountList;
exports.default = _default;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/create-account/connect-hardware/account-list.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/create-account/connect-hardware/account-list.js",}],
[3847, {"../../../helpers/constants/design-system":3992,"../typography":3964,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"lodash":2646,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Chip;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = require("lodash");

var _typography = _interopRequireDefault(require("../typography"));

var _designSystem = require("../../../helpers/constants/design-system");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Chip({
  className,
  children,
  borderColor = _designSystem.COLORS.UI1,
  label,
  labelProps = {},
  leftIcon,
  rightIcon,
  onClick
}) {
  const onKeyPress = event => {
    if (event.key === 'Enter' && onClick) {
      onClick(event);
    }
  };

  const isInteractive = typeof onClick === 'function';
  return /*#__PURE__*/_react.default.createElement("div", {
    onClick: onClick,
    onKeyPress: onKeyPress,
    className: (0, _classnames.default)(className, 'chip', {
      'chip--with-left-icon': Boolean(leftIcon),
      'chip--with-right-icon': Boolean(rightIcon),
      [`chip--${borderColor}`]: true
    }),
    role: isInteractive ? 'button' : undefined,
    tabIndex: isInteractive ? 0 : undefined
  }, leftIcon && /*#__PURE__*/_react.default.createElement("div", {
    className: "chip__left-icon"
  }, leftIcon), children !== null && children !== void 0 ? children : /*#__PURE__*/_react.default.createElement(_typography.default, (0, _extends2.default)({
    className: "chip__label",
    variant: _designSystem.TYPOGRAPHY.H6,
    tag: "span",
    color: _designSystem.COLORS.UI4
  }, labelProps), label), rightIcon && /*#__PURE__*/_react.default.createElement("div", {
    className: "chip__right-icon"
  }, rightIcon));
}

Chip.propTypes = {
  borderColor: _propTypes.default.oneOf(Object.values(_designSystem.COLORS)),
  label: _propTypes.default.string,
  children: _propTypes.default.node,
  labelProps: _propTypes.default.shape(_objectSpread({}, (0, _lodash.omit)(_typography.default.propTypes, ['children', 'className']))),
  leftIcon: _propTypes.default.node,
  rightIcon: _propTypes.default.node,
  className: _propTypes.default.string,
  onClick: _propTypes.default.func,
  inputValue: _propTypes.default.string,
  setInputValue: _propTypes.default.func
};

//# sourceMappingURL=ui/components/ui/chip/chip.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/chip/chip.js",}],
[3837, {"../../../helpers/constants/design-system":3992,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Box;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _designSystem = require("../../../helpers/constants/design-system");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const ValidSize = _propTypes.default.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

const ArrayOfValidSizes = _propTypes.default.arrayOf(ValidSize);

const MultipleSizes = _propTypes.default.oneOfType([ValidSize, ArrayOfValidSizes]);

function generateSizeClasses(baseClass, type, main, top, right, bottom, left) {
  const arr = Array.isArray(main) ? main : [];
  const singleDigit = Array.isArray(main) ? undefined : main;

  if (Array.isArray(main) && ![2, 3, 4].includes(main.length)) {
    throw new Error(`Expected prop ${type} to have length between 2 and 4, received ${main.length}`);
  }

  const isHorizontalAndVertical = arr.length === 2;
  const isTopHorizontalAndBottom = arr.length === 3;
  const isAllFour = arr.length === 4;
  const hasAtLeastTwo = arr.length >= 2;
  const hasAtLeastThree = arr.length >= 3;
  return {
    [`${baseClass}--${type}-${singleDigit}`]: singleDigit !== undefined,
    [`${baseClass}--${type}-top-${top}`]: typeof top === 'number',
    [`${baseClass}--${type}-right-${right}`]: typeof right === 'number',
    [`${baseClass}--${type}-bottom-${bottom}`]: typeof bottom === 'number',
    [`${baseClass}--${type}-left-${left}`]: typeof left === 'number',
    // As long as an array of length >= 2 has been provided, the first number
    // will always be for the top value.
    [`${baseClass}--${type}-top-${arr === null || arr === void 0 ? void 0 : arr[0]}`]: hasAtLeastTwo,
    // As long as an array of length >= 2 has been provided, the second number
    // will always be for the right value.
    [`${baseClass}--${type}-right-${arr === null || arr === void 0 ? void 0 : arr[1]}`]: hasAtLeastTwo,
    // If an array has 2 values, the first number is the bottom value. If
    // instead if has 3 or more values, the third number will be the bottom.
    [`${baseClass}--${type}-bottom-${arr === null || arr === void 0 ? void 0 : arr[2]}`]: hasAtLeastThree,
    [`${baseClass}--${type}-bottom-${arr === null || arr === void 0 ? void 0 : arr[0]}`]: isHorizontalAndVertical,
    // If an array has 2 or 3 values, the second number will be the left value
    [`${baseClass}--${type}-left-${arr === null || arr === void 0 ? void 0 : arr[1]}`]: isHorizontalAndVertical || isTopHorizontalAndBottom,
    // If an array has 4 values, the fourth number is the left value
    [`${baseClass}--${type}-left-${arr === null || arr === void 0 ? void 0 : arr[3]}`]: isAllFour
  };
}

function Box({
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  borderColor,
  borderWidth,
  borderRadius,
  borderStyle,
  alignItems,
  justifyContent,
  textAlign,
  display,
  width,
  height,
  children,
  className
}) {
  const boxClassName = (0, _classnames.default)('box', className, _objectSpread(_objectSpread(_objectSpread({
    // ---Borders---
    // if borderWidth or borderColor is supplied w/o style, default to solid
    'box--border-style-solid': !borderStyle && (Boolean(borderWidth) || Boolean(borderColor)),
    // if borderColor supplied w/o width, default to 1
    'box--border-size-1': !borderWidth && Boolean(borderColor),
    [`box--border-color-${borderColor}`]: Boolean(borderColor),
    [`box--rounded-${borderRadius}`]: Boolean(borderRadius),
    [`box--border-style-${borderStyle}`]: Boolean(borderStyle),
    [`box--border-size-${borderWidth}`]: Boolean(borderWidth)
  }, generateSizeClasses('box', 'margin', margin, marginTop, marginRight, marginBottom, marginLeft)), generateSizeClasses('box', 'padding', padding, paddingTop, paddingRight, paddingBottom, paddingLeft)), {}, {
    // ---Flex/Grid alignment---
    // if justifyContent or alignItems supplied w/o display, default to flex
    'box--display-flex': !display && (Boolean(justifyContent) || Boolean(alignItems)),
    [`box--justify-content-${justifyContent}`]: Boolean(justifyContent),
    [`box--align-items-${alignItems}`]: Boolean(alignItems),
    // text align
    [`box--text-align-${textAlign}`]: Boolean(textAlign),
    // display
    [`box--display-${display}`]: Boolean(display),
    // width & height
    [`box--width-${width}`]: Boolean(width),
    [`box--height-${height}`]: Boolean(height)
  })); // Apply Box styles to any other component using function pattern

  if (typeof children === 'function') {
    return children(boxClassName);
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: boxClassName
  }, children);
}

Box.propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),
  margin: MultipleSizes,
  marginTop: ValidSize,
  marginBottom: ValidSize,
  marginRight: ValidSize,
  marginLeft: ValidSize,
  padding: MultipleSizes,
  paddingTop: ValidSize,
  paddingBottom: ValidSize,
  paddingRight: ValidSize,
  paddingLeft: ValidSize,
  borderColor: _propTypes.default.oneOf(Object.values(_designSystem.COLORS)),
  borderWidth: _propTypes.default.number,
  borderRadius: _propTypes.default.oneOf(Object.values(_designSystem.SIZES)),
  borderStyle: _propTypes.default.oneOf(Object.values(_designSystem.BORDER_STYLE)),
  alignItems: _propTypes.default.oneOf(Object.values(_designSystem.ALIGN_ITEMS)),
  justifyContent: _propTypes.default.oneOf(Object.values(_designSystem.JUSTIFY_CONTENT)),
  textAlign: _propTypes.default.oneOf(Object.values(_designSystem.TEXT_ALIGN)),
  display: _propTypes.default.oneOf(Object.values(_designSystem.DISPLAY)),
  width: _propTypes.default.oneOf(Object.values(_designSystem.BLOCK_SIZES)),
  height: _propTypes.default.oneOf(Object.values(_designSystem.BLOCK_SIZES)),
  className: _propTypes.default.string
};

//# sourceMappingURL=ui/components/ui/box/box.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/box/box.js",}],
[3904, {"./loading-indicator":3905,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _loadingIndicator.default;
  }
});

var _loadingIndicator = _interopRequireDefault(require("./loading-indicator"));

//# sourceMappingURL=ui/components/ui/loading-indicator/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/loading-indicator/index.js",}],
[3843, {"../../../../shared/constants/time":3598,"../../../helpers/constants/design-system":3992,"../icon/info-icon-inverted.component":3881,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Callout;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _infoIconInverted = _interopRequireDefault(require("../icon/info-icon-inverted.component"));

var _designSystem = require("../../../helpers/constants/design-system");

var _time = require("../../../../shared/constants/time");

function Callout({
  severity,
  children,
  dismiss,
  isFirst,
  isLast,
  isMultiple
}) {
  const [removed, setRemoved] = (0, _react.useState)(false);
  const calloutClassName = (0, _classnames.default)('callout', `callout--${severity}`, {
    'callout--dismissed': removed === true,
    'callout--multiple': isMultiple === true,
    'callout--dismissible': Boolean(dismiss),
    'callout--first': isFirst === true || isMultiple !== true,
    'callout--last': isLast === true || isMultiple !== true
  }); // Clicking the close button will set removed state, which will trigger this
  // effect to refire due to changing dependencies. When that happens, after a
  // half of a second we fire the dismiss method from the parent. The
  // consuming component is responsible for modifying state and then removing
  // the element from the DOM.

  (0, _react.useEffect)(() => {
    if (removed) {
      setTimeout(() => {
        dismiss();
      }, _time.MILLISECOND * 500);
    }
  }, [removed, dismiss]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: calloutClassName
  }, /*#__PURE__*/_react.default.createElement(_infoIconInverted.default, {
    severity: severity
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "callout__content"
  }, children), dismiss && /*#__PURE__*/_react.default.createElement("i", {
    onClick: () => {
      setRemoved(true);
    },
    onKeyUp: event => {
      if (event.key === 'Enter') {
        setRemoved(true);
      }
    },
    role: "button",
    tabIndex: 0,
    className: "fas fa-times callout__close-button"
  }));
}

Callout.propTypes = {
  severity: _propTypes.default.oneOf(Object.values(_designSystem.SEVERITIES)).isRequired,
  children: _propTypes.default.node.isRequired,
  dismiss: _propTypes.default.func,
  isFirst: _propTypes.default.bool,
  isLast: _propTypes.default.bool,
  isMultiple: _propTypes.default.bool
};

//# sourceMappingURL=ui/components/ui/callout/callout.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/callout/callout.js",}],
[4094, {"../../../../components/ui/button":3842,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ConfirmationFooter;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _button = _interopRequireDefault(require("../../../../components/ui/button"));

function ConfirmationFooter({
  onApprove,
  onCancel,
  approveText,
  cancelText,
  alerts
}) {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "confirmation-footer"
  }, alerts, /*#__PURE__*/_react.default.createElement("div", {
    className: "confirmation-footer__actions"
  }, /*#__PURE__*/_react.default.createElement(_button.default, {
    rounded: true,
    type: "secondary",
    onClick: onCancel
  }, cancelText), /*#__PURE__*/_react.default.createElement(_button.default, {
    rounded: true,
    type: "primary",
    onClick: onApprove
  }, approveText)));
}

ConfirmationFooter.propTypes = {
  alerts: _propTypes.default.node,
  onApprove: _propTypes.default.func.isRequired,
  onCancel: _propTypes.default.func.isRequired,
  approveText: _propTypes.default.string.isRequired,
  cancelText: _propTypes.default.string.isRequired
};

//# sourceMappingURL=ui/pages/confirmation/components/confirmation-footer/confirmation-footer.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirmation/components/confirmation-footer/confirmation-footer.js",}],
[3940, {"../icon-border":3874,"../icon-with-fallback":3878,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SiteIcon;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _iconBorder = _interopRequireDefault(require("../icon-border"));

var _iconWithFallback = _interopRequireDefault(require("../icon-with-fallback"));

function SiteIcon({
  icon,
  name,
  size
}) {
  const iconSize = Math.floor(size * 0.75);
  return /*#__PURE__*/_react.default.createElement(_iconBorder.default, {
    size: size
  }, /*#__PURE__*/_react.default.createElement(_iconWithFallback.default, {
    icon: icon,
    name: name,
    size: iconSize
  }));
}

SiteIcon.propTypes = {
  icon: _propTypes.default.string,
  name: _propTypes.default.string,
  size: _propTypes.default.number.isRequired
};
SiteIcon.defaultProps = {
  icon: undefined,
  name: undefined
};

//# sourceMappingURL=ui/components/ui/site-icon/site-icon.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/site-icon/site-icon.js",}],
[3696, {"./safe-component-list":3697,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"lodash":2646,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SectionShape = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _safeComponentList = require("./safe-component-list");

function getElement(section) {
  const {
    element
  } = section;
  const Element = _safeComponentList.safeComponentList[element];

  if (!Element) {
    throw new Error(`${element} is not in the safe component list for MetaMask template renderer`);
  }

  return Element;
}

const MetaMaskTemplateRenderer = ({
  sections
}) => {
  if (!sections) {
    // If sections is null eject early by returning null
    return null;
  } else if (typeof sections === 'string') {
    // React can render strings directly, so return the string
    return sections;
  } else if (sections && typeof sections === 'object' && !Array.isArray(sections)) {
    // If dealing with a single entry, then render a single object without key
    const Element = getElement(sections);
    return /*#__PURE__*/_react.default.createElement(Element, sections.props, typeof sections.children === 'object' ? /*#__PURE__*/_react.default.createElement(MetaMaskTemplateRenderer, {
      sections: sections.children
    }) : sections === null || sections === void 0 ? void 0 : sections.children);
  } // The last case is dealing with an array of objects


  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, sections.reduce((allChildren, child) => {
    if (typeof child === 'string') {
      // React can render strings directly, so push them into the accumulator
      allChildren.push(child);
    } else {
      // If the entry in array is not a string, then it must be a Section.
      // Sections are handled by the main function, but must
      // be provided a key when a part of an array.
      if (!child.key) {
        throw new Error('When using array syntax in MetaMask Template Language, you must specify a key for each child of the array');
      }

      if (typeof (child === null || child === void 0 ? void 0 : child.children) === 'object') {
        // If this child has its own children, check if children is an
        // object, and in that case use recursion to render.
        allChildren.push( /*#__PURE__*/_react.default.createElement(MetaMaskTemplateRenderer, {
          sections: child,
          key: child.key
        }));
      } else {
        // Otherwise render the element.
        const Element = getElement(child);
        allChildren.push( /*#__PURE__*/_react.default.createElement(Element, (0, _extends2.default)({
          key: child.key
        }, child.props), child === null || child === void 0 ? void 0 : child.children));
      }
    }

    return allChildren;
  }, []));
};

const SectionShape = {
  props: _propTypes.default.object,
  element: _propTypes.default.oneOf(Object.keys(_safeComponentList.safeComponentList)).isRequired,
  key: _propTypes.default.string
};
exports.SectionShape = SectionShape;

const ValidChildren = _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.shape(SectionShape), _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape(SectionShape), _propTypes.default.string]))]);

SectionShape.children = ValidChildren;
MetaMaskTemplateRenderer.propTypes = {
  sections: ValidChildren
};

var _default = /*#__PURE__*/(0, _react.memo)(MetaMaskTemplateRenderer, (prevProps, nextProps) => {
  return (0, _lodash.isEqual)(prevProps.sections, nextProps.sections);
});

exports.default = _default;

//# sourceMappingURL=ui/components/app/metamask-template-renderer/metamask-template-renderer.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/metamask-template-renderer/metamask-template-renderer.js",}],
[4050, {"./asset-breadcrumb":4049,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _assetBreadcrumb = _interopRequireDefault(require("./asset-breadcrumb"));

const AssetNavigation = ({
  accountName,
  assetName,
  onBack,
  optionsButton
}) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "asset-navigation"
  }, /*#__PURE__*/_react.default.createElement(_assetBreadcrumb.default, {
    accountName: accountName,
    assetName: assetName,
    onBack: onBack
  }), optionsButton);
};

AssetNavigation.propTypes = {
  accountName: _propTypes.default.string.isRequired,
  assetName: _propTypes.default.string.isRequired,
  onBack: _propTypes.default.func.isRequired,
  optionsButton: _propTypes.default.element
};
AssetNavigation.defaultProps = {
  optionsButton: undefined
};
var _default = AssetNavigation;
exports.default = _default;

//# sourceMappingURL=ui/pages/asset/components/asset-navigation.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/asset/components/asset-navigation.js",}],
[4051, {"../../../components/ui/menu":3912,"../../../contexts/i18n":3970,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _i18n = require("../../../contexts/i18n");

var _menu = require("../../../components/ui/menu");

const AssetOptions = ({
  onRemove,
  onClickBlockExplorer,
  onViewAccountDetails,
  tokenSymbol,
  isNativeAsset,
  isEthNetwork
}) => {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const [assetOptionsButtonElement, setAssetOptionsButtonElement] = (0, _react.useState)(null);
  const [assetOptionsOpen, setAssetOptionsOpen] = (0, _react.useState)(false);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    className: "fas fa-ellipsis-v asset-options__button",
    "data-testid": "asset-options__button",
    onClick: () => setAssetOptionsOpen(true),
    ref: setAssetOptionsButtonElement,
    title: t('assetOptions')
  }), assetOptionsOpen ? /*#__PURE__*/_react.default.createElement(_menu.Menu, {
    anchorElement: assetOptionsButtonElement,
    onHide: () => setAssetOptionsOpen(false)
  }, /*#__PURE__*/_react.default.createElement(_menu.MenuItem, {
    iconClassName: "fas fa-qrcode",
    "data-testid": "asset-options__account-details",
    onClick: () => {
      setAssetOptionsOpen(false);
      onViewAccountDetails();
    }
  }, t('accountDetails')), isNativeAsset ? null : /*#__PURE__*/_react.default.createElement(_menu.MenuItem, {
    iconClassName: "fas fa-trash-alt asset-options__icon",
    "data-testid": "asset-options__hide",
    onClick: () => {
      setAssetOptionsOpen(false);
      onRemove();
    }
  }, t('hideTokenSymbol', [tokenSymbol]))) : null);
};

AssetOptions.propTypes = {
  isEthNetwork: _propTypes.default.bool,
  isNativeAsset: _propTypes.default.bool,
  onRemove: _propTypes.default.func.isRequired,
  onClickBlockExplorer: _propTypes.default.func.isRequired,
  onViewAccountDetails: _propTypes.default.func.isRequired,
  tokenSymbol: _propTypes.default.string
};
var _default = AssetOptions;
exports.default = _default;

//# sourceMappingURL=ui/pages/asset/components/asset-options.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/asset/components/asset-options.js",}],
[3816, {"./transaction-list.component":3817,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _transactionList.default;
  }
});

var _transactionList = _interopRequireDefault(require("./transaction-list.component"));

//# sourceMappingURL=ui/components/app/transaction-list/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/transaction-list/index.js",}],
[3829, {"./eth-overview":3828,"./token-overview":3830,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "EthOverview", {
  enumerable: true,
  get: function () {
    return _ethOverview.default;
  }
});
Object.defineProperty(exports, "TokenOverview", {
  enumerable: true,
  get: function () {
    return _tokenOverview.default;
  }
});

var _ethOverview = _interopRequireDefault(require("./eth-overview"));

var _tokenOverview = _interopRequireDefault(require("./token-overview"));

//# sourceMappingURL=ui/components/app/wallet-overview/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/wallet-overview/index.js",}],
[4187, {"./permissions-redirect.component":4188,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _permissionsRedirect.default;
  }
});

var _permissionsRedirect = _interopRequireDefault(require("./permissions-redirect.component"));

//# sourceMappingURL=ui/pages/permissions-connect/redirect/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/permissions-connect/redirect/index.js",}],
[4183, {"./choose-account.component":4182,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _chooseAccount.default;
  }
});

var _chooseAccount = _interopRequireDefault(require("./choose-account.component"));

//# sourceMappingURL=ui/pages/permissions-connect/choose-account/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/permissions-connect/choose-account/index.js",}],
[3762, {"./permission-page-container-content":3763,"./permission-page-container.container":3766,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _permissionPageContainer.default;
  }
});
Object.defineProperty(exports, "PermissionPageContainerContent", {
  enumerable: true,
  get: function () {
    return _permissionPageContainerContent.default;
  }
});

var _permissionPageContainer = _interopRequireDefault(require("./permission-page-container.container"));

var _permissionPageContainerContent = _interopRequireDefault(require("./permission-page-container-content"));

//# sourceMappingURL=ui/components/app/permission-page-container/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/permission-page-container/index.js",}],
[3113, {"./CSSTransitionGroupChild":3114,"./TransitionGroup":3115,"./utils/PropTypes":3118,"prop-types":2900,"react":3121}, function (require, module, exports) {
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TransitionGroup = require('./TransitionGroup');

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransitionGroupChild = require('./CSSTransitionGroupChild');

var _CSSTransitionGroupChild2 = _interopRequireDefault(_CSSTransitionGroupChild);

var _PropTypes = require('./utils/PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  transitionName: _PropTypes.nameShape.isRequired,

  transitionAppear: _propTypes2.default.bool,
  transitionEnter: _propTypes2.default.bool,
  transitionLeave: _propTypes2.default.bool,
  transitionAppearTimeout: (0, _PropTypes.transitionTimeout)('Appear'),
  transitionEnterTimeout: (0, _PropTypes.transitionTimeout)('Enter'),
  transitionLeaveTimeout: (0, _PropTypes.transitionTimeout)('Leave')
};

var defaultProps = {
  transitionAppear: false,
  transitionEnter: true,
  transitionLeave: true
};

var CSSTransitionGroup = function (_React$Component) {
  _inherits(CSSTransitionGroup, _React$Component);

  function CSSTransitionGroup() {
    var _temp, _this, _ret;

    _classCallCheck(this, CSSTransitionGroup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this._wrapChild = function (child) {
      return _react2.default.createElement(_CSSTransitionGroupChild2.default, {
        name: _this.props.transitionName,
        appear: _this.props.transitionAppear,
        enter: _this.props.transitionEnter,
        leave: _this.props.transitionLeave,
        appearTimeout: _this.props.transitionAppearTimeout,
        enterTimeout: _this.props.transitionEnterTimeout,
        leaveTimeout: _this.props.transitionLeaveTimeout
      }, child);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // We need to provide this childFactory so that
  // ReactCSSTransitionGroupChild can receive updates to name, enter, and
  // leave while it is leaving.


  CSSTransitionGroup.prototype.render = function render() {
    return _react2.default.createElement(_TransitionGroup2.default, _extends({}, this.props, { childFactory: this._wrapChild }));
  };

  return CSSTransitionGroup;
}(_react2.default.Component);

CSSTransitionGroup.displayName = 'CSSTransitionGroup';


CSSTransitionGroup.propTypes = "production" !== "production" ? propTypes : {};
CSSTransitionGroup.defaultProps = defaultProps;

exports.default = CSSTransitionGroup;
module.exports = exports['default'];
//# sourceMappingURL=node_modules/react-transition-group/CSSTransitionGroup.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-transition-group/CSSTransitionGroup.js",}],
[3945, {"./tab":3946,"./tabs.component":3948,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Tabs", {
  enumerable: true,
  get: function () {
    return _tabs.default;
  }
});
Object.defineProperty(exports, "Tab", {
  enumerable: true,
  get: function () {
    return _tab.default;
  }
});

var _tabs = _interopRequireDefault(require("./tabs.component"));

var _tab = _interopRequireDefault(require("./tab"));

//# sourceMappingURL=ui/components/ui/tabs/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/tabs/index.js",}],
[3835, {"../info-tooltip":3896,"../info-tooltip/info-tooltip-icon":3897,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ActionableMessage;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _infoTooltip = _interopRequireDefault(require("../info-tooltip"));

var _infoTooltipIcon = _interopRequireDefault(require("../info-tooltip/info-tooltip-icon"));

const CLASSNAME_WARNING = 'actionable-message--warning';
const CLASSNAME_DANGER = 'actionable-message--danger';
const CLASSNAME_WITH_RIGHT_BUTTON = 'actionable-message--with-right-button';
const typeHash = {
  warning: CLASSNAME_WARNING,
  danger: CLASSNAME_DANGER
};

function ActionableMessage({
  message = '',
  primaryAction = null,
  secondaryAction = null,
  className = '',
  infoTooltipText = '',
  withRightButton = false,
  type = false,
  useIcon = false,
  iconFillColor = ''
}) {
  const actionableMessageClassName = (0, _classnames.default)('actionable-message', typeHash[type], withRightButton ? CLASSNAME_WITH_RIGHT_BUTTON : null, className, {
    'actionable-message--with-icon': useIcon
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: actionableMessageClassName
  }, useIcon && /*#__PURE__*/_react.default.createElement(_infoTooltipIcon.default, {
    fillColor: iconFillColor
  }), infoTooltipText && /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
    position: "left",
    contentText: infoTooltipText,
    wrapperClassName: "actionable-message__info-tooltip-wrapper"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "actionable-message__message"
  }, message), (primaryAction || secondaryAction) && /*#__PURE__*/_react.default.createElement("div", {
    className: "actionable-message__actions"
  }, primaryAction && /*#__PURE__*/_react.default.createElement("button", {
    className: (0, _classnames.default)('actionable-message__action', 'actionable-message__action--primary'),
    onClick: primaryAction.onClick
  }, primaryAction.label), secondaryAction && /*#__PURE__*/_react.default.createElement("button", {
    className: (0, _classnames.default)('actionable-message__action', 'actionable-message__action--secondary'),
    onClick: secondaryAction.onClick
  }, secondaryAction.label)));
}

ActionableMessage.propTypes = {
  message: _propTypes.default.node.isRequired,
  primaryAction: _propTypes.default.shape({
    label: _propTypes.default.string,
    onClick: _propTypes.default.func
  }),
  secondaryAction: _propTypes.default.shape({
    label: _propTypes.default.string,
    onClick: _propTypes.default.func
  }),
  className: _propTypes.default.string,
  type: _propTypes.default.string,
  withRightButton: _propTypes.default.bool,
  infoTooltipText: _propTypes.default.string,
  useIcon: _propTypes.default.bool,
  iconFillColor: _propTypes.default.string
};

//# sourceMappingURL=ui/components/ui/actionable-message/actionable-message.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/actionable-message/actionable-message.js",}],
[4171, {"./token-search.component":4172,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokenSearch = _interopRequireDefault(require("./token-search.component"));

var _default = _tokenSearch.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/import-token/token-search/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/import-token/token-search/index.js",}],
[3964, {"./typography":3965,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _typography.default;
  }
});

var _typography = _interopRequireDefault(require("./typography"));

//# sourceMappingURL=ui/components/ui/typography/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/typography/index.js",}],
[3918, {"./page-container-footer":3920,"./page-container-header":3922,"./page-container.component":3924,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PageContainerHeader", {
  enumerable: true,
  get: function () {
    return _pageContainerHeader.default;
  }
});
Object.defineProperty(exports, "PageContainerFooter", {
  enumerable: true,
  get: function () {
    return _pageContainerFooter.default;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _pageContainer.default;
  }
});

var _pageContainerHeader = _interopRequireDefault(require("./page-container-header"));

var _pageContainerFooter = _interopRequireDefault(require("./page-container-footer"));

var _pageContainer = _interopRequireDefault(require("./page-container.component"));

//# sourceMappingURL=ui/components/ui/page-container/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/page-container/index.js",}],
[4166, {"./token-list.container":4170,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokenList = _interopRequireDefault(require("./token-list.container"));

var _default = _tokenList.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/import-token/token-list/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/import-token/token-list/index.js",}],
[3620, {"../../../../ducks/alerts":3974,"../../../../ducks/alerts/invalid-custom-network":3975,"../../../../helpers/constants/routes":3995,"../../../../hooks/useI18nContext":4030,"../../../ui/button":3842,"../../../ui/popover":3925,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _alerts = require("../../../../ducks/alerts");

var _invalidCustomNetwork = require("../../../../ducks/alerts/invalid-custom-network");

var _popover = _interopRequireDefault(require("../../../ui/popover"));

var _button = _interopRequireDefault(require("../../../ui/button"));

var _useI18nContext = require("../../../../hooks/useI18nContext");

var _routes = require("../../../../helpers/constants/routes");

const {
  ERROR,
  LOADING
} = _alerts.ALERT_STATE;

const InvalidCustomNetworkAlert = ({
  history
}) => {
  const t = (0, _useI18nContext.useI18nContext)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const alertState = (0, _reactRedux.useSelector)(_invalidCustomNetwork.getAlertState);
  const networkName = (0, _reactRedux.useSelector)(_invalidCustomNetwork.getNetworkName);

  const onClose = () => dispatch((0, _invalidCustomNetwork.dismissAlert)());

  const footer = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, alertState === ERROR ? /*#__PURE__*/_react.default.createElement("div", {
    className: "invalid-custom-network-alert__error"
  }, t('failureMessage')) : null, /*#__PURE__*/_react.default.createElement("div", {
    className: "invalid-custom-network-alert__footer-row"
  }, /*#__PURE__*/_react.default.createElement(_button.default, {
    disabled: alertState === LOADING,
    onClick: onClose,
    type: "secondary",
    className: "invalid-custom-network-alert__footer-row-button"
  }, t('dismiss')), /*#__PURE__*/_react.default.createElement(_button.default, {
    disabled: alertState === LOADING,
    onClick: async () => {
      await onClose();
      history.push(_routes.NETWORKS_ROUTE);
    },
    type: "primary",
    className: "invalid-custom-network-alert__footer-row-button"
  }, t('settings'))));

  return /*#__PURE__*/_react.default.createElement(_popover.default, {
    title: t('invalidCustomNetworkAlertTitle'),
    onClose: onClose,
    contentClassName: "invalid-custom-network-alert__content",
    footerClassName: "invalid-custom-network-alert__footer",
    footer: footer
  }, /*#__PURE__*/_react.default.createElement("p", null, t('invalidCustomNetworkAlertContent1', [networkName])), /*#__PURE__*/_react.default.createElement("p", null, t('invalidCustomNetworkAlertContent2')), /*#__PURE__*/_react.default.createElement("p", null, t('invalidCustomNetworkAlertContent3', [/*#__PURE__*/_react.default.createElement("span", {
    key: "invalidCustomNetworkAlertContentLink",
    className: "invalid-custom-network-alert__content-link",
    onClick: () => global.platform.openTab({
      url: 'https://chainid.network'
    })
  }, "chainId.network")])));
};

InvalidCustomNetworkAlert.propTypes = {
  history: _propTypes.default.object.isRequired
};
var _default = InvalidCustomNetworkAlert;
exports.default = _default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/components/app/alerts/invalid-custom-network-alert/invalid-custom-network-alert.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/alerts/invalid-custom-network-alert/invalid-custom-network-alert.js",}],
[3622, {"../../../../ducks/alerts":3974,"../../../../ducks/alerts/unconnected-account":3976,"../../../../helpers/utils/util":4020,"../../../../hooks/useI18nContext":4030,"../../../../selectors":4326,"../../../ui/button":3842,"../../../ui/check-box":3846,"../../../ui/popover":3925,"../../../ui/tooltip":3960,"../../connected-accounts-list":3652,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _alerts = require("../../../../ducks/alerts");

var _unconnectedAccount = require("../../../../ducks/alerts/unconnected-account");

var _selectors = require("../../../../selectors");

var _util = require("../../../../helpers/utils/util");

var _popover = _interopRequireDefault(require("../../../ui/popover"));

var _button = _interopRequireDefault(require("../../../ui/button"));

var _checkBox = _interopRequireDefault(require("../../../ui/check-box"));

var _tooltip = _interopRequireDefault(require("../../../ui/tooltip"));

var _connectedAccountsList = _interopRequireDefault(require("../../connected-accounts-list"));

var _useI18nContext = require("../../../../hooks/useI18nContext");

const {
  ERROR,
  LOADING
} = _alerts.ALERT_STATE;

const UnconnectedAccountAlert = () => {
  const t = (0, _useI18nContext.useI18nContext)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const alertState = (0, _reactRedux.useSelector)(_unconnectedAccount.getAlertState);
  const connectedAccounts = (0, _reactRedux.useSelector)(_selectors.getOrderedConnectedAccountsForActiveTab);
  const origin = (0, _reactRedux.useSelector)(_selectors.getOriginOfCurrentTab);
  const selectedIdentity = (0, _reactRedux.useSelector)(_selectors.getSelectedIdentity);
  const selectedAddress = (0, _reactRedux.useSelector)(_selectors.getSelectedAddress);
  const [dontShowThisAgain, setDontShowThisAgain] = (0, _react.useState)(false);

  const onClose = async () => {
    return dontShowThisAgain ? await dispatch((0, _unconnectedAccount.dismissAndDisableAlert)()) : dispatch((0, _unconnectedAccount.dismissAlert)());
  };

  const footer = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, alertState === ERROR ? /*#__PURE__*/_react.default.createElement("div", {
    className: "unconnected-account-alert__error"
  }, t('failureMessage')) : null, /*#__PURE__*/_react.default.createElement("div", {
    className: "unconnected-account-alert__footer-row"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "unconnected-account-alert__checkbox-wrapper"
  }, /*#__PURE__*/_react.default.createElement(_checkBox.default, {
    id: "unconnectedAccount_dontShowThisAgain",
    checked: dontShowThisAgain,
    className: "unconnected-account-alert__checkbox",
    onClick: () => setDontShowThisAgain(checked => !checked)
  }), /*#__PURE__*/_react.default.createElement("label", {
    className: "unconnected-account-alert__checkbox-label",
    htmlFor: "unconnectedAccount_dontShowThisAgain"
  }, t('dontShowThisAgain'), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
    position: "top",
    title: t('alertDisableTooltip'),
    wrapperClassName: "unconnected-account-alert__checkbox-label-tooltip"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-info-circle"
  })))), /*#__PURE__*/_react.default.createElement(_button.default, {
    disabled: alertState === LOADING,
    onClick: onClose,
    type: "primary",
    rounded: true,
    className: "unconnected-account-alert__dismiss-button"
  }, t('dismiss'))));

  return /*#__PURE__*/_react.default.createElement(_popover.default, {
    title: (0, _util.isExtensionUrl)(origin) ? t('currentExtension') : (0, _util.getURLHost)(origin),
    subtitle: t('currentAccountNotConnected'),
    onClose: onClose,
    className: "unconnected-account-alert",
    contentClassName: "unconnected-account-alert__content",
    footerClassName: "unconnected-account-alert__footer",
    footer: footer
  }, /*#__PURE__*/_react.default.createElement(_connectedAccountsList.default, {
    accountToConnect: selectedIdentity,
    connectAccount: () => dispatch((0, _unconnectedAccount.connectAccount)(selectedAddress)),
    connectedAccounts: connectedAccounts,
    selectedAddress: selectedAddress,
    setSelectedAddress: address => dispatch((0, _unconnectedAccount.switchToAccount)(address)),
    shouldRenderListOptions: false
  }));
};

var _default = UnconnectedAccountAlert;
exports.default = _default;

//# sourceMappingURL=ui/components/app/alerts/unconnected-account-alert/unconnected-account-alert.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/alerts/unconnected-account-alert/unconnected-account-alert.js",}],
[4250, {"./info-tab.component":4251,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _infoTab.default;
  }
});

var _infoTab = _interopRequireDefault(require("./info-tab.component"));

//# sourceMappingURL=ui/pages/settings/info-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/info-tab/index.js",}],
[3789, {"./tab-bar":3790,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _tabBar.default;
  }
});

var _tabBar = _interopRequireDefault(require("./tab-bar"));

//# sourceMappingURL=ui/components/app/tab-bar/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/tab-bar/index.js",}],
[4261, {"./settings-tab.container":4263,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _settingsTab.default;
  }
});

var _settingsTab = _interopRequireDefault(require("./settings-tab.container"));

//# sourceMappingURL=ui/pages/settings/settings-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/settings-tab/index.js",}],
[4231, {"./advanced-tab.container":4230,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _advancedTab.default;
  }
});

var _advancedTab = _interopRequireDefault(require("./advanced-tab.container"));

//# sourceMappingURL=ui/pages/settings/advanced-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/advanced-tab/index.js",}],
[4258, {"./security-tab.container":4260,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _securityTab.default;
  }
});

var _securityTab = _interopRequireDefault(require("./security-tab.container"));

//# sourceMappingURL=ui/pages/settings/security-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/security-tab/index.js",}],
[4248, {"./experimental-tab.container":4247,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _experimentalTab.default;
  }
});

var _experimentalTab = _interopRequireDefault(require("./experimental-tab.container"));

//# sourceMappingURL=ui/pages/settings/experimental-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/experimental-tab/index.js",}],
[4233, {"./alerts-tab":4232,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _alertsTab.default;
  }
});

var _alertsTab = _interopRequireDefault(require("./alerts-tab"));

//# sourceMappingURL=ui/pages/settings/alerts-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/alerts-tab/index.js",}],
[4252, {"./networks-tab.container":4257,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _networksTab.default;
  }
});

var _networksTab = _interopRequireDefault(require("./networks-tab.container"));

//# sourceMappingURL=ui/pages/settings/networks-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/networks-tab/index.js",}],
[4242, {"./contact-list-tab.container":4238,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _contactListTab.default;
  }
});

var _contactListTab = _interopRequireDefault(require("./contact-list-tab.container"));

//# sourceMappingURL=ui/pages/settings/contact-list-tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/contact-list-tab/index.js",}],
[3927, {"./pulse-loader":3928,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _pulseLoader.default;
  }
});

var _pulseLoader = _interopRequireDefault(require("./pulse-loader"));

//# sourceMappingURL=ui/components/ui/pulse-loader/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/pulse-loader/index.js",}],
[4311, {"./swaps-footer":4312,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _swapsFooter.default;
  }
});

var _swapsFooter = _interopRequireDefault(require("./swaps-footer"));

//# sourceMappingURL=ui/pages/swaps/swaps-footer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/swaps-footer/index.js",}],
[4268, {"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SwapStepIcon;

var _react = _interopRequireDefault(require("react"));

function SwapStepIcon({
  stepNumber = 1
}) {
  switch (stepNumber) {
    case 1:
      return /*#__PURE__*/_react.default.createElement("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 14 14",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/_react.default.createElement("circle", {
        cx: "7",
        cy: "7",
        r: "6.25",
        stroke: "#037DD6",
        strokeWidth: "1.5"
      }), /*#__PURE__*/_react.default.createElement("path", {
        d: "M6.50983 5.192H5.27783L6.14183 4H7.71783V9.68H6.50983V5.192Z",
        fill: "#037DD6"
      }));

    case 2:
      return /*#__PURE__*/_react.default.createElement("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 14 14",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/_react.default.createElement("circle", {
        cx: "7",
        cy: "7",
        r: "6.25",
        stroke: "#037DD6",
        strokeWidth: "1.5"
      }), /*#__PURE__*/_react.default.createElement("path", {
        d: "M8.92 9.776H5V9.368C5 9.048 5.056 8.77067 5.168 8.536C5.28 8.296 5.42133 8.08533 5.592 7.904C5.768 7.71733 5.96267 7.54933 6.176 7.4C6.39467 7.25067 6.608 7.10133 6.816 6.952C6.928 6.872 7.03467 6.78933 7.136 6.704C7.24267 6.61867 7.33333 6.53067 7.408 6.44C7.488 6.34933 7.552 6.256 7.6 6.16C7.648 6.064 7.672 5.96533 7.672 5.864C7.672 5.67733 7.616 5.52 7.504 5.392C7.39733 5.25867 7.22933 5.192 7 5.192C6.88267 5.192 6.776 5.21333 6.68 5.256C6.584 5.29333 6.50133 5.344 6.432 5.408C6.368 5.472 6.31733 5.54667 6.28 5.632C6.248 5.71733 6.232 5.808 6.232 5.904H5.024C5.024 5.62667 5.07467 5.37067 5.176 5.136C5.27733 4.90133 5.41867 4.70133 5.6 4.536C5.78133 4.36533 5.99467 4.23467 6.24 4.144C6.48533 4.048 6.752 4 7.04 4C7.28 4 7.50933 4.03733 7.728 4.112C7.952 4.18667 8.14933 4.29867 8.32 4.448C8.49067 4.59733 8.62667 4.784 8.728 5.008C8.82933 5.22667 8.88 5.48267 8.88 5.776C8.88 6.032 8.85067 6.25867 8.792 6.456C8.73333 6.648 8.65067 6.824 8.544 6.984C8.44267 7.13867 8.32 7.28 8.176 7.408C8.032 7.536 7.87733 7.66133 7.712 7.784C7.64267 7.832 7.55733 7.888 7.456 7.952C7.36 8.016 7.26133 8.08267 7.16 8.152C7.064 8.22133 6.97333 8.29333 6.888 8.368C6.80267 8.44267 6.74133 8.51467 6.704 8.584H8.92V9.776Z",
        fill: "#037DD6"
      }));

    default:
      return undefined;
    // Don't return any SVG if a step number is not supported.
  }
}

//# sourceMappingURL=ui/pages/swaps/awaiting-signatures/swap-step-icon.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-signatures/swap-step-icon.js",}],
[3910, {"./mascot.component":3911,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _mascot.default;
  }
});

var _mascot = _interopRequireDefault(require("./mascot.component"));

//# sourceMappingURL=ui/components/ui/mascot/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/mascot/index.js",}],
[4291, {"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BackgroundAnimation;

var _react = _interopRequireDefault(require("react"));

function BackgroundAnimation() {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__background-1"
  }, /*#__PURE__*/_react.default.createElement("svg", {
    width: "193",
    height: "190",
    viewBox: "0 0 193 190",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M153.753 53.876C153.595 53.9493 153.419 54.0161 153.25 54.0651C151.081 54.7451 148.777 53.538 148.086 51.3768C147.763 50.3298 147.851 49.2109 148.361 48.2363C148.87 47.2618 149.732 46.5374 150.78 46.2144C151.828 45.8913 152.948 45.9781 153.923 46.4865C154.898 46.9949 155.622 47.8557 155.944 48.9027C156.567 50.918 155.592 53.0243 153.753 53.876ZM150.817 47.5708C150.245 47.8359 149.782 48.2721 149.495 48.8334C149.144 49.5127 149.073 50.2843 149.303 51.0047C149.774 52.4998 151.375 53.3384 152.877 52.8787C154.374 52.4069 155.215 50.8063 154.756 49.3056C154.526 48.5852 154.027 47.9888 153.36 47.6334C152.68 47.2836 151.908 47.213 151.187 47.4437C151.049 47.4636 150.927 47.52 150.817 47.5708Z",
    fill: "#86E29B"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M18.3624 73.9241C18.3015 73.9523 18.2407 73.9805 18.1798 74.0087C17.0495 74.4733 15.8073 74.4728 14.6751 74.0078C12.3517 73.0461 11.2387 70.3567 12.2031 68.0341C13.1676 65.7115 15.8598 64.5971 18.1833 65.5589C19.3155 66.0239 20.1951 66.9013 20.6591 68.0304C21.123 69.1595 21.1215 70.4008 20.6552 71.5326C20.2207 72.6053 19.4093 73.4391 18.3624 73.9241ZM15.0433 66.7921C14.3129 67.1305 13.713 67.7186 13.3766 68.5243C12.6776 70.207 13.4834 72.1377 15.1666 72.8348C15.9849 73.1647 16.8786 73.1789 17.6933 72.831C18.5136 72.4952 19.1388 71.8659 19.4818 71.0424C19.8126 70.2245 19.8276 69.3313 19.4801 68.5175C19.1448 67.6981 18.5155 67.0739 17.6917 66.7319C16.8144 66.3703 15.8589 66.4142 15.0433 66.7921Z",
    fill: "#FFB0EB"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M116.617 37.3839C117.397 37.0226 117.736 36.0982 117.375 35.3192C117.015 34.5402 116.09 34.2016 115.31 34.5629C114.53 34.9243 114.19 35.8487 114.551 36.6277C114.912 37.4067 115.837 37.7453 116.617 37.3839Z",
    fill: "url(#paint0_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M55.1317 91.7213C55.9116 91.36 56.2512 90.4356 55.8903 89.6566C55.5294 88.8776 54.6046 88.539 53.8247 88.9003C53.0448 89.2617 52.7052 90.1861 53.0661 90.9651C53.427 91.7441 54.3518 92.0827 55.1317 91.7213Z",
    fill: "url(#paint1_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M31.9932 126.235C32.7731 125.874 33.1127 124.95 32.7518 124.171C32.3909 123.392 31.4661 123.053 30.6863 123.414C29.9064 123.776 29.5667 124.7 29.9277 125.479C30.2886 126.258 31.2134 126.597 31.9932 126.235Z",
    fill: "url(#paint2_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M119.43 132.589C120.21 132.228 120.55 131.304 120.189 130.525C119.828 129.746 118.903 129.407 118.123 129.768C117.344 130.13 117.004 131.054 117.365 131.833C117.726 132.612 118.651 132.951 119.43 132.589Z",
    fill: "url(#paint3_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M44.7469 47.3835C46.0108 46.7979 46.5612 45.2997 45.9763 44.0372C45.3914 42.7747 43.8926 42.2259 42.6286 42.8115C41.3647 43.3971 40.8143 44.8953 41.3992 46.1578C41.9841 47.4203 43.4829 47.9691 44.7469 47.3835Z",
    fill: "url(#paint4_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M105.107 90.7857C106.371 90.2001 106.922 88.702 106.337 87.4394C105.752 86.1769 104.253 85.6282 102.989 86.2137C101.725 86.7993 101.175 88.2975 101.76 89.56C102.344 90.8226 103.843 91.3713 105.107 90.7857Z",
    fill: "url(#paint5_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M95.5179 172.376C96.7818 171.791 97.3322 170.293 96.7473 169.03C96.1624 167.767 94.6636 167.219 93.3996 167.804C92.1357 168.39 91.5853 169.888 92.1702 171.151C92.7551 172.413 94.2539 172.962 95.5179 172.376Z",
    fill: "url(#paint6_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M165.098 102.367C166.362 101.781 166.912 100.283 166.327 99.0205C165.742 97.758 164.244 97.2092 162.98 97.7948C161.716 98.3804 161.165 99.8786 161.75 101.141C162.335 102.404 163.834 102.952 165.098 102.367Z",
    fill: "url(#paint7_linear)"
  }), /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint0_linear",
    x1: "114.554",
    y1: "36.6326",
    x2: "117.379",
    y2: "35.3237",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint1_linear",
    x1: "53.0688",
    y1: "90.97",
    x2: "55.8937",
    y2: "89.6611",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint2_linear",
    x1: "29.9283",
    y1: "125.483",
    x2: "32.7532",
    y2: "124.174",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint3_linear",
    x1: "117.365",
    y1: "131.837",
    x2: "120.19",
    y2: "130.528",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint4_linear",
    x1: "41.4394",
    y1: "46.2402",
    x2: "45.947",
    y2: "43.9537",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint5_linear",
    x1: "101.8",
    y1: "89.6425",
    x2: "106.307",
    y2: "87.356",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint6_linear",
    x1: "92.2104",
    y1: "171.233",
    x2: "96.718",
    y2: "168.947",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint7_linear",
    x1: "161.79",
    y1: "101.224",
    x2: "166.298",
    y2: "98.937",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#75C3FC"
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    className: "loading-swaps-quotes__background-2"
  }, /*#__PURE__*/_react.default.createElement("svg", {
    width: "195",
    height: "205",
    viewBox: "0 0 195 205",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M29.84 121.982C30.0408 121.969 30.245 122.01 30.4258 122.106L46.4233 130.275C46.8125 130.478 47.0536 130.893 47.0402 131.324C47.0143 131.768 46.7423 132.148 46.3356 132.308L24.5484 140.937C24.1417 141.097 23.6789 141.005 23.3642 140.702C23.0495 140.4 22.9398 139.937 23.0753 139.525L28.8651 122.727C28.9671 122.426 29.2065 122.169 29.5086 122.056C29.614 122.023 29.7194 121.989 29.84 121.982ZM43.1981 131.148L30.5607 124.689L25.9884 137.96L43.1981 131.148Z",
    fill: "#75C4FD"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M168.214 54.3381C168.442 54.3238 168.674 54.3764 168.869 54.485C169.217 54.6781 169.44 55.0266 169.465 55.4145L170.59 68.4358C170.631 68.8763 170.416 69.3061 170.041 69.5444C169.666 69.7827 169.182 69.7862 168.805 69.5681L156.14 62.2246C155.763 62.0065 155.535 61.5911 155.548 61.1472C155.56 60.7033 155.818 60.3112 156.209 60.1122L167.75 54.4343C167.908 54.3841 168.067 54.3473 168.214 54.3381ZM168.027 66.3674L167.248 57.3661L159.267 61.2902L168.027 66.3674Z",
    fill: "#FFB0EB"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M88.6283 16.6885C88.8694 16.6734 89.1154 16.7385 89.3255 16.873L100.21 24.1133C100.561 24.3464 100.762 24.7635 100.708 25.1832C100.653 25.6028 100.381 25.969 99.9864 26.1146L86.3391 31.4276C85.9449 31.5731 85.5106 31.5064 85.1842 31.2314C84.8712 30.9556 84.7239 30.5352 84.8192 30.1264L87.5815 17.5731C87.666 17.2053 87.9162 16.9076 88.2702 16.7646C88.3882 16.7169 88.5078 16.696 88.6283 16.6885ZM97.1342 24.7894L89.4471 19.6718L87.5021 28.5349L97.1342 24.7894Z",
    fill: "url(#paint0_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M117.145 183.156C116.944 183.289 116.698 183.356 116.449 183.344L103.402 182.517C102.982 182.49 102.6 182.229 102.437 181.839C102.274 181.448 102.327 180.995 102.596 180.671L111.758 169.247C112.027 168.923 112.436 168.764 112.856 168.839C113.265 168.921 113.603 169.212 113.725 169.614L117.609 181.866C117.72 182.227 117.652 182.61 117.417 182.911C117.339 183.011 117.246 183.089 117.145 183.156ZM105.728 180.393L114.944 180.981L112.197 172.333L105.728 180.393Z",
    fill: "url(#paint1_linear)"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M38.0816 74.0208C38.1217 74.0183 38.1485 74.0166 38.1887 74.0141C42.3831 73.805 45.9744 77.0577 46.1831 81.2474C46.3919 85.4371 43.1484 89.0241 38.9407 89.234C34.7463 89.4431 31.1549 86.1904 30.9462 82.0007C30.7391 77.8377 33.9307 74.2809 38.0816 74.0208ZM38.9104 87.2486C41.9767 87.0565 44.3523 84.4236 44.1997 81.3448C44.0455 78.2393 41.3949 75.8407 38.2859 75.9952C35.1761 76.1364 32.7753 78.7977 32.9296 81.9033C33.0838 85.0088 35.7344 87.4073 38.8434 87.2528C38.8568 87.252 38.8836 87.2503 38.9104 87.2486Z",
    fill: "#86E29B"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M162.178 97.8401C162.218 97.8376 162.245 97.8359 162.285 97.8334C166.48 97.6243 170.071 100.877 170.28 105.067C170.489 109.256 167.245 112.843 163.037 113.053C158.843 113.262 155.252 110.01 155.043 105.82C154.836 101.657 158.027 98.1002 162.178 97.8401ZM163.007 111.068C166.073 110.876 168.449 108.243 168.296 105.164C168.142 102.059 165.492 99.6601 162.383 99.8146C159.273 99.9557 156.872 102.617 157.026 105.723C157.181 108.828 159.831 111.227 162.94 111.072C162.953 111.071 162.98 111.07 163.007 111.068Z",
    fill: "#86E29B"
  }), /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint0_linear",
    x1: "100.609",
    y1: "23.2611",
    x2: "84.4152",
    y2: "24.2757",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#FFE466"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#FFAFEA"
  })), /*#__PURE__*/_react.default.createElement("linearGradient", {
    id: "paint1_linear",
    x1: "103.812",
    y1: "183.939",
    x2: "116.959",
    y2: "174.66",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#75C3FC"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "0.0928503",
    stopColor: "#81C2F6"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    offset: "1",
    stopColor: "#F0B8BD"
  }))))));
}


//# sourceMappingURL=ui/pages/swaps/loading-swaps-quotes/background-animation.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/loading-swaps-quotes/background-animation.js",}],
[4273, {"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SwapSuccessIcon;

var _react = _interopRequireDefault(require("react"));

function SwapSuccessIcon() {
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: "38",
    height: "38",
    viewBox: "0 0 38 38",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M34.1429 19C34.1429 23.0161 32.5474 26.8678 29.7076 29.7076C26.8678 32.5474 23.0161 34.1428 19 34.1428C14.9839 34.1428 11.1322 32.5474 8.29238 29.7076C5.45254 26.8678 3.85714 23.0161 3.85714 19C3.85714 14.9838 5.45254 11.1322 8.29238 8.29237C11.1322 5.45253 14.9839 3.85713 19 3.85713C20.4386 3.85713 21.8393 4.06534 23.1643 4.44391L26.1361 1.47213C23.9404 0.563554 21.5364 0.0714111 19 0.0714111C16.5143 0.0714111 14.0529 0.561013 11.7563 1.51226C9.45983 2.46351 7.37316 3.85778 5.61548 5.61546C2.06568 9.16526 0.0714264 13.9798 0.0714264 19C0.0714264 24.0201 2.06568 28.8347 5.61548 32.3845C7.37316 34.1422 9.45983 35.5364 11.7563 36.4877C14.0529 37.4389 16.5143 37.9286 19 37.9286C24.0202 37.9286 28.8347 35.9343 32.3845 32.3845C35.9343 28.8347 37.9286 24.0201 37.9286 19H34.1429ZM11.2582 15.3657L8.58928 18.0536L17.1071 26.5714L36.0357 7.64284L33.3668 4.95498L17.1071 21.2146L11.2582 15.3657Z",
    fill: "#28A745"
  }));
}

//# sourceMappingURL=ui/pages/swaps/awaiting-swap/swap-success-icon.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-swap/swap-success-icon.js",}],
[4271, {"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = QuotesTimeoutIcon;

var _react = _interopRequireDefault(require("react"));

function QuotesTimeoutIcon() {
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: "44",
    height: "44",
    viewBox: "0 0 44 44",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M22 0C9.96768 0 0.178406 9.78928 0.178406 21.8216C0.178406 33.8539 9.96768 43.6432 22 43.6432C34.0323 43.6432 43.8216 33.8539 43.8216 21.8216C43.8216 9.78929 34.0323 0 22 0ZM22 3.27324C32.2633 3.27324 40.5484 11.5583 40.5484 21.8216C40.5484 32.0849 32.2633 40.3699 22 40.3699C11.7367 40.3699 3.45164 32.0849 3.45164 21.8216C3.45164 11.5583 11.7367 3.27324 22 3.27324ZM22 6.00094C21.0961 6.00094 20.3634 6.73371 20.3634 7.63756V21.8216C20.3634 22.4269 20.6932 22.9534 21.1817 23.2366L32.5187 29.783C33.3014 30.235 34.3001 29.9692 34.752 29.1864C35.2039 28.4036 34.938 27.405 34.1553 26.953L23.6366 20.8839V7.63756C23.6366 6.73371 22.9039 6.00094 22 6.00094Z",
    fill: "#037DD6"
  }));
}

//# sourceMappingURL=ui/pages/swaps/awaiting-swap/quotes-timeout-icon.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-swap/quotes-timeout-icon.js",}],
[4272, {"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SwapFailureIcon;

var _react = _interopRequireDefault(require("react"));

function SwapFailureIcon() {
  return /*#__PURE__*/_react.default.createElement("svg", {
    width: "45",
    height: "39",
    viewBox: "0 0 45 39",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M22.203 0.424438L0.285706 38.2816H44.1203L22.203 0.424438ZM22.203 8.39436L37.2064 34.2966H7.19961L22.203 8.39436ZM20.2105 16.3643V24.3342H24.1955V16.3643H20.2105ZM20.2105 28.3192V32.3041H24.1955V28.3192",
    fill: "#D73A49"
  }));
}

//# sourceMappingURL=ui/pages/swaps/awaiting-swap/swap-failure-icon.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-swap/swap-failure-icon.js",}],
[4274, {"./view-on-ether-scan-link":4275,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _viewOnEtherScanLink.default;
  }
});

var _viewOnEtherScanLink = _interopRequireDefault(require("./view-on-ether-scan-link"));

//# sourceMappingURL=ui/pages/swaps/awaiting-swap/view-on-ether-scan-link/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-swap/view-on-ether-scan-link/index.js",}],
[4034, {"react":3121}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePrevious = usePrevious;

var _react = require("react");

function usePrevious(value) {
  const ref = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

//# sourceMappingURL=ui/hooks/usePrevious.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/usePrevious.js",}],
[4043, {"../../shared/constants/time":3598,"../helpers/utils/util":4020,"../selectors":4326,"./useEqualityCheck":4026,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/eth-token-tracker":945,"react":3121,"react-redux":3088}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTokenTracker = useTokenTracker;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

var _ethTokenTracker = _interopRequireDefault(require("@metamask/eth-token-tracker"));

var _reactRedux = require("react-redux");

var _selectors = require("../selectors");

var _time = require("../../shared/constants/time");

var _util = require("../helpers/utils/util");

var _useEqualityCheck = require("./useEqualityCheck");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function useTokenTracker(tokens, includeFailedTokens = false, hideZeroBalanceTokens = false, address = '') {
  const getAddress = () => address;

  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const userAddress = (0, _reactRedux.useSelector)(address ? getAddress : _selectors.getSelectedAddress);
  const [loading, setLoading] = (0, _react.useState)(() => (tokens === null || tokens === void 0 ? void 0 : tokens.length) >= 0);
  const [tokensWithBalances, setTokensWithBalances] = (0, _react.useState)([]);
  const [error, setError] = (0, _react.useState)(null);
  const tokenTracker = (0, _react.useRef)(null);
  const memoizedTokens = (0, _useEqualityCheck.useEqualityCheck)(tokens);
  const updateBalances = (0, _react.useCallback)(tokenWithBalances => {
    const matchingTokens = hideZeroBalanceTokens ? tokenWithBalances.filter(token => Number(token.balance) > 0) : tokenWithBalances; // TODO: improve this pattern for adding this field when we improve support for
    // EIP721 tokens.

    const matchingTokensWithIsERC721Flag = matchingTokens.map(token => {
      const additionalTokenData = memoizedTokens.find(t => (0, _util.isEqualCaseInsensitive)(t.address, token.address));
      return _objectSpread(_objectSpread({}, token), {}, {
        isERC721: additionalTokenData === null || additionalTokenData === void 0 ? void 0 : additionalTokenData.isERC721,
        image: additionalTokenData === null || additionalTokenData === void 0 ? void 0 : additionalTokenData.image
      });
    });
    setTokensWithBalances(matchingTokensWithIsERC721Flag);
    setLoading(false);
    setError(null);
  }, [hideZeroBalanceTokens, memoizedTokens]);
  const showError = (0, _react.useCallback)(err => {
    setError(err);
    setLoading(false);
  }, []);
  const teardownTracker = (0, _react.useCallback)(() => {
    if (tokenTracker.current) {
      tokenTracker.current.stop();
      tokenTracker.current.removeAllListeners('update');
      tokenTracker.current.removeAllListeners('error');
      tokenTracker.current = null;
    }
  }, []);
  const buildTracker = (0, _react.useCallback)((address, tokenList) => {
    // clear out previous tracker, if it exists.
    teardownTracker();
    tokenTracker.current = new _ethTokenTracker.default({
      userAddress: address,
      provider: global.ethereumProvider,
      tokens: tokenList,
      includeFailedTokens,
      pollingInterval: _time.SECOND * 8
    });
    tokenTracker.current.on('update', updateBalances);
    tokenTracker.current.on('error', showError);
    tokenTracker.current.updateBalances();
  }, [updateBalances, includeFailedTokens, showError, teardownTracker]); // Effect to remove the tracker when the component is removed from DOM
  // Do not overload this effect with additional dependencies. teardownTracker
  // is the only dependency here, which itself has no dependencies and will
  // never update. The lack of dependencies that change is what confirms
  // that this effect only runs on mount/unmount

  (0, _react.useEffect)(() => {
    return teardownTracker;
  }, [teardownTracker]); // Effect to set loading state and initialize tracker when values change

  (0, _react.useEffect)(() => {
    // This effect will only run initially and when:
    // 1. chainId is updated,
    // 2. userAddress is changed,
    // 3. token list is updated and not equal to previous list
    // in any of these scenarios, we should indicate to the user that their token
    // values are in the process of updating by setting loading state.
    setLoading(true);

    if (!userAddress || chainId === undefined || !global.ethereumProvider) {
      // If we do not have enough information to build a TokenTracker, we exit early
      // When the values above change, the effect will be restarted. We also teardown
      // tracker because inevitably this effect will run again momentarily.
      teardownTracker();
      return;
    }

    if (memoizedTokens.length === 0) {
      // sets loading state to false and token list to empty
      updateBalances([]);
    }

    buildTracker(userAddress, memoizedTokens);
  }, [userAddress, teardownTracker, chainId, memoizedTokens, updateBalances, buildTracker]);
  return {
    loading,
    tokensWithBalances,
    error
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/hooks/useTokenTracker.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useTokenTracker.js",}],
[4027, {"../ducks/metamask/metamask":3985,"../helpers/utils/confirm-tx.util":4008,"../helpers/utils/conversions.util":4009,"../selectors":4326,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEthFiatAmount = useEthFiatAmount;

var _react = require("react");

var _reactRedux = require("react-redux");

var _selectors = require("../selectors");

var _conversions = require("../helpers/utils/conversions.util");

var _confirmTx = require("../helpers/utils/confirm-tx.util");

var _metamask = require("../ducks/metamask/metamask");

/**
 * Get an Eth amount converted to fiat and formatted for display
 *
 * @param {string} [tokenAmount] - The eth amount to convert
 * @param {Object} [overrides] - A configuration object that allows the called to explicitly
 *                              ensure fiat is shown even if the property is not set in state.
 * @param {boolean} [overrides.showFiat] - If truthy, ensures the fiat value is shown even if the showFiat value from state is falsey
 * @param {boolean} hideCurrencySymbol Indicates whether the returned formatted amount should include the trailing currency symbol
 * @return {string} - The formatted token amount in the user's chosen fiat currency
 */
function useEthFiatAmount(ethAmount, overrides = {}, hideCurrencySymbol) {
  var _overrides$showFiat;

  const conversionRate = (0, _reactRedux.useSelector)(_metamask.getConversionRate);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  const userPrefersShownFiat = (0, _reactRedux.useSelector)(_selectors.getShouldShowFiat);
  const showFiat = (_overrides$showFiat = overrides.showFiat) !== null && _overrides$showFiat !== void 0 ? _overrides$showFiat : userPrefersShownFiat;
  const formattedFiat = (0, _react.useMemo)(() => (0, _conversions.decEthToConvertedCurrency)(ethAmount, currentCurrency, conversionRate), [conversionRate, currentCurrency, ethAmount]);

  if (!showFiat || currentCurrency.toUpperCase() === 'ETH' || conversionRate <= 0 || ethAmount === undefined) {
    return undefined;
  }

  return hideCurrencySymbol ? (0, _confirmTx.formatCurrency)(formattedFiat, currentCurrency) : `${(0, _confirmTx.formatCurrency)(formattedFiat, currentCurrency)} ${currentCurrency.toUpperCase()}`;
}

//# sourceMappingURL=ui/hooks/useEthFiatAmount.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useEthFiatAmount.js",}],
[4061, {"../../../shared/constants/transaction":3599,"../../helpers/utils/conversions.util":4009,"../../helpers/utils/token-util":4017,"../../helpers/utils/transactions.util":4018}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomTxParamsData = getCustomTxParamsData;

var _transaction = require("../../../shared/constants/transaction");

var _conversions = require("../../helpers/utils/conversions.util");

var _tokenUtil = require("../../helpers/utils/token-util");

var _transactions = require("../../helpers/utils/transactions.util");

function getCustomTxParamsData(data, {
  customPermissionAmount,
  decimals
}) {
  const tokenData = (0, _transactions.getTokenData)(data);

  if (!tokenData) {
    throw new Error('Invalid data');
  } else if (tokenData.name !== _transaction.TRANSACTION_TYPES.TOKEN_METHOD_APPROVE) {
    throw new Error(`Invalid data; should be 'approve' method, but instead is '${tokenData.name}'`);
  }

  let spender = (0, _tokenUtil.getTokenAddressParam)(tokenData);

  if (spender.startsWith('0x')) {
    spender = spender.substring(2);
  }

  const [signature, tokenValue] = data.split(spender);

  if (!signature || !tokenValue) {
    throw new Error('Invalid data');
  } else if (tokenValue.length !== 64) {
    throw new Error('Invalid token value; should be exactly 64 hex digits long (u256)');
  }

  let customPermissionValue = (0, _conversions.decimalToHex)((0, _tokenUtil.calcTokenValue)(customPermissionAmount, decimals));

  if (customPermissionValue.length > 64) {
    throw new Error('Custom value is larger than u256');
  }

  customPermissionValue = customPermissionValue.padStart(tokenValue.length, '0');
  const customTxParamsData = `${signature}${spender}${customPermissionValue}`;
  return customTxParamsData;
}

//# sourceMappingURL=ui/pages/confirm-approve/confirm-approve.util.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-approve/confirm-approve.util.js",}],
[4029, {"../../shared/constants/gas":3592,"../../shared/modules/conversion.utils":3601,"../../shared/modules/gas.utils":3603,"../helpers/constants/common":3990,"../helpers/constants/gas":3994,"../helpers/utils/conversions.util":4009,"../helpers/utils/util":4020,"../selectors":4326,"./useCurrencyDisplay":4024,"./useGasFeeEstimates":4028,"./useUserPreferencedCurrency":4046,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"ethereumjs-util":1810,"lodash":2646,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGasFeeInputs = useGasFeeInputs;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ethereumjsUtil = require("ethereumjs-util");

var _react = require("react");

var _reactRedux = require("react-redux");

var _lodash = require("lodash");

var _gas = require("../../shared/constants/gas");

var _conversion = require("../../shared/modules/conversion.utils");

var _gas2 = require("../../shared/modules/gas.utils");

var _common = require("../helpers/constants/common");

var _selectors = require("../selectors");

var _conversions = require("../helpers/utils/conversions.util");

var _util = require("../helpers/utils/util");

var _gas3 = require("../helpers/constants/gas");

var _useCurrencyDisplay = require("./useCurrencyDisplay");

var _useGasFeeEstimates = require("./useGasFeeEstimates");

var _useUserPreferencedCurrency = require("./useUserPreferencedCurrency");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const HIGH_FEE_WARNING_MULTIPLIER = 1.5;
/**
 * Opaque string type representing a decimal (base 10) number in GWEI
 * @typedef {`${number}`} DecGweiString
 */

/**
 * String value representing the active estimate level to use
 * @typedef {'low' | 'medium' | 'high'} EstimateLevel
 */

/**
 * Pulls out gasPrice estimate from either of the two gasPrice estimation
 * sources, based on the gasEstimateType and current estimateToUse.
 * @param {{import(
 *   '@metamask/controllers'
 * ).GasFeeState['gasFeeEstimates']}} gasFeeEstimates - estimates returned from
 *  the controller
 * @param {import(
 *  './useGasFeeEstimates'
 * ).GasEstimates} gasEstimateType - type of estimate returned from controller
 * @param {EstimateLevel} estimateToUse - current estimate level to use
 * @returns {[DecGweiString]} - gasPrice estimate to use or null
 */

function getGasPriceEstimate(gasFeeEstimates, gasEstimateType, estimateToUse) {
  if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.LEGACY) {
    var _gasFeeEstimates$esti;

    return (_gasFeeEstimates$esti = gasFeeEstimates === null || gasFeeEstimates === void 0 ? void 0 : gasFeeEstimates[estimateToUse]) !== null && _gasFeeEstimates$esti !== void 0 ? _gasFeeEstimates$esti : '0';
  } else if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.ETH_GASPRICE) {
    var _gasFeeEstimates$gasP;

    return (_gasFeeEstimates$gasP = gasFeeEstimates === null || gasFeeEstimates === void 0 ? void 0 : gasFeeEstimates.gasPrice) !== null && _gasFeeEstimates$gasP !== void 0 ? _gasFeeEstimates$gasP : '0';
  }

  return '0';
}
/**
 * Pulls out gas fee estimate from the estimates returned from controller,
 * based on the gasEstimateType and current estimateToUse.
 * @param {'maxFeePerGas' | 'maxPriorityFeePerGas'} field - field to select
 * @param {{import(
 *   '@metamask/controllers'
 * ).GasFeeState['gasFeeEstimates']}} gasFeeEstimates - estimates returned from
 *  the controller
 * @param {import(
 *  './useGasFeeEstimates'
 * ).GasEstimates} gasEstimateType - type of estimate returned from controller
 * @param {EstimateLevel} estimateToUse - current estimate level to use
 * @returns {[DecGweiString]} - gas fee estimate to use or null
 */


function getGasFeeEstimate(field, gasFeeEstimates, gasEstimateType, estimateToUse, fallback = '0') {
  if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.FEE_MARKET) {
    var _gasFeeEstimates$esti2, _gasFeeEstimates$esti3;

    return (_gasFeeEstimates$esti2 = gasFeeEstimates === null || gasFeeEstimates === void 0 ? void 0 : (_gasFeeEstimates$esti3 = gasFeeEstimates[estimateToUse]) === null || _gasFeeEstimates$esti3 === void 0 ? void 0 : _gasFeeEstimates$esti3[field]) !== null && _gasFeeEstimates$esti2 !== void 0 ? _gasFeeEstimates$esti2 : String(fallback);
  }

  return String(fallback);
}
/**
 * @typedef {Object} GasFeeInputReturnType
 * @property {DecGweiString} [maxFeePerGas] - the maxFeePerGas input value.
 * @property {string} [maxFeePerGasFiat] - the maxFeePerGas converted to the
 *  user's preferred currency.
 * @property {(DecGweiString) => void} setMaxFeePerGas - state setter method to
 *  update the maxFeePerGas.
 * @property {DecGweiString} [maxPriorityFeePerGas] - the maxPriorityFeePerGas
 *  input value.
 * @property {string} [maxPriorityFeePerGasFiat] - the maxPriorityFeePerGas
 *  converted to the user's preferred currency.
 * @property {(DecGweiString) => void} setMaxPriorityFeePerGas - state setter
 *  method to update the maxPriorityFeePerGas.
 * @property {DecGweiString} [gasPrice] - the gasPrice input value.
 * @property {(DecGweiString) => void} setGasPrice - state setter method to
 *  update the gasPrice.
 * @property {DecGweiString} gasLimit - the gasLimit input value.
 * @property {(DecGweiString) => void} setGasLimit - state setter method to
 *  update the gasLimit.
 * @property {EstimateLevel} [estimateToUse] - the estimate level currently
 *  selected. This will be null if the user has ejected from using the
 *  estimates.
 * @property {([EstimateLevel]) => void} setEstimateToUse - Setter method for
 *  choosing which EstimateLevel to use.
 * @property {string} [estimatedMinimumFiat] - The amount estimated to be paid
 *  based on current network conditions. Expressed in user's preferred
 *  currency.
 * @property {string} [estimatedMaximumFiat] - the maximum amount estimated to be
 *  paid if current network transaction volume increases. Expressed in user's
 *  preferred currency.
 * @property {string} [estimatedMaximumNative] - the maximum amount estimated to
 *  be paid if the current network transaction volume increases. Expressed in
 *  the network's native currency.
 */

/**
 * Uses gasFeeEstimates and state to keep track of user gas fee inputs.
 * Will update the gas fee state when estimates update if the user has not yet
 * modified the fields.
 * @param {EstimateLevel} defaultEstimateToUse - which estimate
 *  level to default the 'estimateToUse' state variable to.
 * @returns {GasFeeInputReturnType & import(
 *  './useGasFeeEstimates'
 * ).GasEstimates} - gas fee input state and the GasFeeEstimates object
 */


function useGasFeeInputs(defaultEstimateToUse = 'medium', transaction, minimumGasLimit = '0x5208', editGasMode) {
  var _transaction$txParams, _transaction$txParams2, _transaction$txParams3, _transaction$txParams4, _transaction$txParams5, _transaction$txParams6, _transaction$txParams7, _transaction$txParams8, _transaction$txParams9, _transaction$txParams10, _gasFeeEstimates$low, _gasFeeEstimates$low2, _transaction$txParams11;

  const {
    balance: ethBalance
  } = (0, _reactRedux.useSelector)(_selectors.getSelectedAccount);
  const networkAndAccountSupports1559 = (0, _reactRedux.useSelector)(_selectors.checkNetworkAndAccountSupports1559); // We need to know whether to show fiat conversions or not, so that we can
  // default our fiat values to empty strings if showing fiat is not wanted or
  // possible.

  const showFiat = (0, _reactRedux.useSelector)(_selectors.getShouldShowFiat); // We need to know the current network's currency and its decimal precision
  // to calculate the amount to display to the user.

  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals
  } = (0, _useUserPreferencedCurrency.useUserPreferencedCurrency)(_common.PRIMARY); // For calculating the value of gas fees in the user's preferred currency we
  // first have to know what that currency is and its decimal precision

  const {
    currency: fiatCurrency,
    numberOfDecimals: fiatNumberOfDecimals
  } = (0, _useUserPreferencedCurrency.useUserPreferencedCurrency)(_common.SECONDARY); // We need the gas estimates from the GasFeeController in the background.
  // Calling this hooks initiates polling for new gas estimates and returns the
  // current estimate.

  const {
    gasEstimateType,
    gasFeeEstimates,
    isGasEstimatesLoading,
    estimatedGasFeeTimeBounds
  } = (0, _useGasFeeEstimates.useGasFeeEstimates)();
  const [initialMaxFeePerGas] = (0, _react.useState)(networkAndAccountSupports1559 && !(transaction !== null && transaction !== void 0 && (_transaction$txParams = transaction.txParams) !== null && _transaction$txParams !== void 0 && _transaction$txParams.maxFeePerGas) ? Number((0, _conversions.hexWEIToDecGWEI)(transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams2 = transaction.txParams) === null || _transaction$txParams2 === void 0 ? void 0 : _transaction$txParams2.gasPrice)) : Number((0, _conversions.hexWEIToDecGWEI)(transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams3 = transaction.txParams) === null || _transaction$txParams3 === void 0 ? void 0 : _transaction$txParams3.maxFeePerGas)));
  const [initialMaxPriorityFeePerGas] = (0, _react.useState)(networkAndAccountSupports1559 && !(transaction !== null && transaction !== void 0 && (_transaction$txParams4 = transaction.txParams) !== null && _transaction$txParams4 !== void 0 && _transaction$txParams4.maxPriorityFeePerGas) ? initialMaxFeePerGas : Number((0, _conversions.hexWEIToDecGWEI)(transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams5 = transaction.txParams) === null || _transaction$txParams5 === void 0 ? void 0 : _transaction$txParams5.maxPriorityFeePerGas)));
  const [initialGasPrice] = (0, _react.useState)(Number((0, _conversions.hexWEIToDecGWEI)(transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams6 = transaction.txParams) === null || _transaction$txParams6 === void 0 ? void 0 : _transaction$txParams6.gasPrice)));
  const [initialMatchingEstimateLevel] = (0, _react.useState)((transaction === null || transaction === void 0 ? void 0 : transaction.userFeeLevel) || null);
  const initialFeeParamsAreCustom = initialMatchingEstimateLevel === 'custom' || initialMatchingEstimateLevel === null; // This hook keeps track of a few pieces of transitional state. It is
  // transitional because it is only used to modify a transaction in the
  // metamask (background) state tree.

  const [maxFeePerGas, setMaxFeePerGas] = (0, _react.useState)(initialMaxFeePerGas && initialFeeParamsAreCustom ? initialMaxFeePerGas : null);
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = (0, _react.useState)(initialMaxPriorityFeePerGas && initialFeeParamsAreCustom ? initialMaxPriorityFeePerGas : null);
  const [gasPriceHasBeenManuallySet, setGasPriceHasBeenManuallySet] = (0, _react.useState)(initialMatchingEstimateLevel === 'custom');
  const [gasPrice, setGasPrice] = (0, _react.useState)(initialGasPrice && initialFeeParamsAreCustom ? initialGasPrice : null);
  const [gasLimit, setGasLimit] = (0, _react.useState)(Number((0, _conversions.hexToDecimal)((_transaction$txParams7 = transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams8 = transaction.txParams) === null || _transaction$txParams8 === void 0 ? void 0 : _transaction$txParams8.gas) !== null && _transaction$txParams7 !== void 0 ? _transaction$txParams7 : '0x0')));
  const userPrefersAdvancedGas = (0, _reactRedux.useSelector)(_selectors.getAdvancedInlineGasShown);
  const dontDefaultToAnEstimateLevel = userPrefersAdvancedGas && (transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams9 = transaction.txParams) === null || _transaction$txParams9 === void 0 ? void 0 : _transaction$txParams9.maxPriorityFeePerGas) && (transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams10 = transaction.txParams) === null || _transaction$txParams10 === void 0 ? void 0 : _transaction$txParams10.maxFeePerGas);
  const initialEstimateToUse = transaction ? initialMatchingEstimateLevel : defaultEstimateToUse;
  const [estimateToUse, setInternalEstimateToUse] = (0, _react.useState)(dontDefaultToAnEstimateLevel ? null : initialEstimateToUse); // We specify whether to use the estimate value by checking if the state
  // value has been set. The state value is only set by user input and is wiped
  // when the user selects an estimate. Default here is '0' to avoid bignumber
  // errors in later calculations for nullish values.

  const maxFeePerGasToUse = maxFeePerGas !== null && maxFeePerGas !== void 0 ? maxFeePerGas : getGasFeeEstimate('suggestedMaxFeePerGas', gasFeeEstimates, gasEstimateType, estimateToUse, initialMaxFeePerGas);
  const maxPriorityFeePerGasToUse = maxPriorityFeePerGas !== null && maxPriorityFeePerGas !== void 0 ? maxPriorityFeePerGas : getGasFeeEstimate('suggestedMaxPriorityFeePerGas', gasFeeEstimates, gasEstimateType, estimateToUse, initialMaxPriorityFeePerGas);
  const [initialGasPriceEstimates] = (0, _react.useState)(gasFeeEstimates);
  const gasPriceEstimatesHaveNotChanged = (0, _lodash.isEqual)(initialGasPriceEstimates, gasFeeEstimates);
  const gasPriceToUse = gasPrice !== null && (gasPriceHasBeenManuallySet || gasPriceEstimatesHaveNotChanged) ? gasPrice : getGasPriceEstimate(gasFeeEstimates, gasEstimateType, estimateToUse || defaultEstimateToUse); // We have two helper methods that take an object that can have either
  // gasPrice OR the EIP-1559 fields on it, plus gasLimit. This object is
  // conditionally set to the appropriate fields to compute the minimum
  // and maximum cost of a transaction given the current estimates or selected
  // gas fees.

  const gasSettings = {
    gasLimit: (0, _conversions.decimalToHex)(gasLimit)
  };

  if (networkAndAccountSupports1559) {
    var _gasFeeEstimates$esti4;

    gasSettings.maxFeePerGas = maxFeePerGasToUse ? (0, _conversions.decGWEIToHexWEI)(maxFeePerGasToUse) : (0, _conversions.decGWEIToHexWEI)(gasPriceToUse || '0');
    gasSettings.maxPriorityFeePerGas = maxPriorityFeePerGasToUse ? (0, _conversions.decGWEIToHexWEI)(maxPriorityFeePerGasToUse) : gasSettings.maxFeePerGas;
    gasSettings.baseFeePerGas = (0, _conversions.decGWEIToHexWEI)((_gasFeeEstimates$esti4 = gasFeeEstimates.estimatedBaseFee) !== null && _gasFeeEstimates$esti4 !== void 0 ? _gasFeeEstimates$esti4 : '0');
  } else if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.NONE) {
    gasSettings.gasPrice = '0x0';
  } else {
    gasSettings.gasPrice = (0, _conversions.decGWEIToHexWEI)(gasPriceToUse);
  } // The maximum amount this transaction will cost


  const maximumCostInHexWei = (0, _gas2.getMaximumGasTotalInHexWei)(gasSettings); // If in swaps, we want to calculate the minimum gas fee differently than the max

  const minGasSettings = {};

  if (editGasMode === _gas.EDIT_GAS_MODES.SWAPS) {
    minGasSettings.gasLimit = (0, _conversions.decimalToHex)(minimumGasLimit);
  } // The minimum amount this transaction will cost's


  const minimumCostInHexWei = (0, _gas2.getMinimumGasTotalInHexWei)(_objectSpread(_objectSpread({}, gasSettings), minGasSettings)); // We need to display the estimated fiat currency impact of the
  // maxPriorityFeePerGas field to the user. This hook calculates that amount.

  const [, {
    value: maxPriorityFeePerGasFiat
  }] = (0, _useCurrencyDisplay.useCurrencyDisplay)((0, _ethereumjsUtil.addHexPrefix)((0, _conversion.multiplyCurrencies)(maxPriorityFeePerGasToUse, gasLimit, {
    toNumericBase: 'hex',
    fromDenomination: 'GWEI',
    toDenomination: 'WEI',
    multiplicandBase: 10,
    multiplierBase: 10
  })), {
    numberOfDecimals: fiatNumberOfDecimals,
    currency: fiatCurrency
  }); // We need to display thee estimated fiat currency impact of the maxFeePerGas
  // field to the user. This hook calculates that amount. This also works for
  // the gasPrice amount because in legacy transactions cost is always gasPrice
  // * gasLimit.

  const [, {
    value: maxFeePerGasFiat
  }] = (0, _useCurrencyDisplay.useCurrencyDisplay)(maximumCostInHexWei, {
    numberOfDecimals: fiatNumberOfDecimals,
    currency: fiatCurrency
  }); // We need to display the total amount of native currency will be expended
  // given the selected gas fees.

  const [estimatedMaximumNative] = (0, _useCurrencyDisplay.useCurrencyDisplay)(maximumCostInHexWei, {
    numberOfDecimals: primaryNumberOfDecimals,
    currency: primaryCurrency
  });
  const [estimatedMinimumNative] = (0, _useCurrencyDisplay.useCurrencyDisplay)(minimumCostInHexWei, {
    numberOfDecimals: primaryNumberOfDecimals,
    currency: primaryCurrency
  }); // We also need to display our closest estimate of the low end of estimation
  // in fiat.

  const [, {
    value: estimatedMinimumFiat
  }] = (0, _useCurrencyDisplay.useCurrencyDisplay)(minimumCostInHexWei, {
    numberOfDecimals: fiatNumberOfDecimals,
    currency: fiatCurrency
  });
  let estimatesUnavailableWarning = null; // Separating errors from warnings so we can know which value problems
  // are blocking or simply useful information for the users

  const gasErrors = {};
  const gasWarnings = {};
  const gasLimitTooLow = (0, _conversion.conversionLessThan)({
    value: gasLimit,
    fromNumericBase: 'dec'
  }, {
    value: minimumGasLimit || _gas.GAS_LIMITS.SIMPLE,
    fromNumericBase: 'hex'
  });

  if (gasLimitTooLow) {
    gasErrors.gasLimit = _gas3.GAS_FORM_ERRORS.GAS_LIMIT_OUT_OF_BOUNDS;
  } // This ensures these are applied when the api fails to return a fee market type
  // It is okay if these errors get overwritten below, as those overwrites can only
  // happen when the estimate api is live.


  if (networkAndAccountSupports1559) {
    if ((0, _util.bnLessThanEqualTo)(maxPriorityFeePerGasToUse, 0)) {
      gasErrors.maxPriorityFee = _gas3.GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM;
    } else if ((0, _util.bnGreaterThan)(maxPriorityFeePerGasToUse, maxFeePerGasToUse)) {
      gasErrors.maxFee = _gas3.GAS_FORM_ERRORS.MAX_FEE_IMBALANCE;
    }
  }

  switch (gasEstimateType) {
    case _gas.GAS_ESTIMATE_TYPES.FEE_MARKET:
      if ((0, _util.bnLessThanEqualTo)(maxPriorityFeePerGasToUse, 0)) {
        gasErrors.maxPriorityFee = _gas3.GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM;
      } else if (!isGasEstimatesLoading && (0, _util.bnLessThan)(maxPriorityFeePerGasToUse, gasFeeEstimates === null || gasFeeEstimates === void 0 ? void 0 : (_gasFeeEstimates$low = gasFeeEstimates.low) === null || _gasFeeEstimates$low === void 0 ? void 0 : _gasFeeEstimates$low.suggestedMaxPriorityFeePerGas)) {
        gasWarnings.maxPriorityFee = _gas3.GAS_FORM_ERRORS.MAX_PRIORITY_FEE_TOO_LOW;
      } else if ((0, _util.bnGreaterThan)(maxPriorityFeePerGasToUse, maxFeePerGasToUse)) {
        gasErrors.maxFee = _gas3.GAS_FORM_ERRORS.MAX_FEE_IMBALANCE;
      } else if (gasFeeEstimates !== null && gasFeeEstimates !== void 0 && gasFeeEstimates.high && (0, _util.bnGreaterThan)(maxPriorityFeePerGasToUse, gasFeeEstimates.high.suggestedMaxPriorityFeePerGas * HIGH_FEE_WARNING_MULTIPLIER)) {
        gasWarnings.maxPriorityFee = _gas3.GAS_FORM_ERRORS.MAX_PRIORITY_FEE_HIGH_WARNING;
      }

      if (!isGasEstimatesLoading && (0, _util.bnLessThan)(maxFeePerGasToUse, gasFeeEstimates === null || gasFeeEstimates === void 0 ? void 0 : (_gasFeeEstimates$low2 = gasFeeEstimates.low) === null || _gasFeeEstimates$low2 === void 0 ? void 0 : _gasFeeEstimates$low2.suggestedMaxFeePerGas)) {
        gasWarnings.maxFee = _gas3.GAS_FORM_ERRORS.MAX_FEE_TOO_LOW;
      } else if (gasFeeEstimates !== null && gasFeeEstimates !== void 0 && gasFeeEstimates.high && (0, _util.bnGreaterThan)(maxFeePerGasToUse, gasFeeEstimates.high.suggestedMaxFeePerGas * HIGH_FEE_WARNING_MULTIPLIER)) {
        gasWarnings.maxFee = _gas3.GAS_FORM_ERRORS.MAX_FEE_HIGH_WARNING;
      }

      break;

    case _gas.GAS_ESTIMATE_TYPES.LEGACY:
    case _gas.GAS_ESTIMATE_TYPES.ETH_GASPRICE:
    case _gas.GAS_ESTIMATE_TYPES.NONE:
      if (networkAndAccountSupports1559) {
        estimatesUnavailableWarning = true;
      }

      break;

    default:
      break;
  } // Determine if we have any errors which should block submission


  const hasBlockingGasErrors = Boolean(Object.keys(gasErrors).length); // Now that we've determined errors that block submission, we can pool the warnings
  // and errors into one object for easier use within the UI.  This object should have
  // no effect on whether or not the user can submit the form

  const errorsAndWarnings = _objectSpread(_objectSpread({}, gasWarnings), gasErrors);

  const minimumTxCostInHexWei = (0, _conversions.addHexes)(minimumCostInHexWei, (transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams11 = transaction.txParams) === null || _transaction$txParams11 === void 0 ? void 0 : _transaction$txParams11.value) || '0x0');
  const balanceError = (0, _conversion.conversionGreaterThan)({
    value: minimumTxCostInHexWei,
    fromNumericBase: 'hex'
  }, {
    value: ethBalance,
    fromNumericBase: 'hex'
  });
  const handleGasLimitOutOfBoundError = (0, _react.useCallback)(() => {
    if (gasErrors.gasLimit === _gas3.GAS_FORM_ERRORS.GAS_LIMIT_OUT_OF_BOUNDS) {
      var _transaction$txParams12;

      const transactionGasLimitDec = (0, _conversions.hexToDecimal)(transaction === null || transaction === void 0 ? void 0 : (_transaction$txParams12 = transaction.txParams) === null || _transaction$txParams12 === void 0 ? void 0 : _transaction$txParams12.gas);
      const minimumGasLimitDec = (0, _conversions.hexToDecimal)(minimumGasLimit);
      setGasLimit(transactionGasLimitDec > minimumGasLimitDec ? transactionGasLimitDec : minimumGasLimitDec);
    }
  }, [minimumGasLimit, gasErrors.gasLimit, transaction]); // When a user selects an estimate level, it will wipe out what they have
  // previously put in the inputs. This returns the inputs to the estimated
  // values at the level specified.

  const setEstimateToUse = estimateLevel => {
    setInternalEstimateToUse(estimateLevel);
    handleGasLimitOutOfBoundError();
    setMaxFeePerGas(null);
    setMaxPriorityFeePerGas(null);
    setGasPrice(null);
    setGasPriceHasBeenManuallySet(false);
  };

  return {
    maxFeePerGas: maxFeePerGasToUse,
    maxFeePerGasFiat: showFiat ? maxFeePerGasFiat : '',
    setMaxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGasToUse,
    maxPriorityFeePerGasFiat: showFiat ? maxPriorityFeePerGasFiat : '',
    setMaxPriorityFeePerGas,
    gasPrice: gasPriceToUse,
    setGasPrice,
    gasLimit,
    setGasLimit,
    estimateToUse,
    setEstimateToUse,
    estimatedMinimumFiat: showFiat ? estimatedMinimumFiat : '',
    estimatedMaximumFiat: showFiat ? maxFeePerGasFiat : '',
    estimatedMaximumNative,
    estimatedMinimumNative,
    isGasEstimatesLoading,
    gasFeeEstimates,
    gasEstimateType,
    estimatedGasFeeTimeBounds,
    gasErrors: errorsAndWarnings,
    hasGasErrors: hasBlockingGasErrors,
    gasWarnings,
    onManualChange: () => {
      setInternalEstimateToUse('custom');
      handleGasLimitOutOfBoundError(); // Restore existing values

      setGasPrice(gasPriceToUse);
      setGasLimit(gasLimit);
      setMaxFeePerGas(maxFeePerGasToUse);
      setMaxPriorityFeePerGas(maxPriorityFeePerGasToUse);
      setGasPriceHasBeenManuallySet(true);
    },
    balanceError,
    estimatesUnavailableWarning,
    estimatedBaseFee: gasSettings.baseFeePerGas
  };
}

//# sourceMappingURL=ui/hooks/useGasFeeInputs.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useGasFeeInputs.js",}],
[4279, {"./countdown-timer":4278,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _countdownTimer.default;
  }
});

var _countdownTimer = _interopRequireDefault(require("./countdown-timer"));

//# sourceMappingURL=ui/pages/swaps/countdown-timer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/countdown-timer/index.js",}],
[4287, {"./fee-card":4286,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _feeCard.default;
  }
});

var _feeCard = _interopRequireDefault(require("./fee-card"));

//# sourceMappingURL=ui/pages/swaps/fee-card/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/fee-card/index.js",}],
[4318, {"../../../components/ui/actionable-message/actionable-message":3835,"../../../components/ui/box":3838,"../../../components/ui/tooltip":3960,"../../../contexts/i18n":3970,"../../../helpers/constants/design-system":3992,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ViewQuotePriceDifference;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../../contexts/i18n");

var _actionableMessage = _interopRequireDefault(require("../../../components/ui/actionable-message/actionable-message"));

var _tooltip = _interopRequireDefault(require("../../../components/ui/tooltip"));

var _box = _interopRequireDefault(require("../../../components/ui/box"));

var _designSystem = require("../../../helpers/constants/design-system");

function ViewQuotePriceDifference(props) {
  const {
    usedQuote,
    sourceTokenValue,
    destinationTokenValue,
    onAcknowledgementClick,
    acknowledged,
    priceSlippageFromSource,
    priceSlippageFromDestination,
    priceDifferencePercentage,
    priceSlippageUnknownFiatValue
  } = props;
  const t = (0, _react.useContext)(_i18n.I18nContext);
  let priceDifferenceTitle = '';
  let priceDifferenceMessage = '';
  let priceDifferenceClass = '';
  let priceDifferenceAcknowledgementText = '';

  if (priceSlippageUnknownFiatValue) {
    // A calculation error signals we cannot determine dollar value
    priceDifferenceTitle = t('swapPriceUnavailableTitle');
    priceDifferenceMessage = t('swapPriceUnavailableDescription');
    priceDifferenceClass = 'high';
    priceDifferenceAcknowledgementText = t('tooltipApproveButton');
  } else {
    priceDifferenceTitle = t('swapPriceDifferenceTitle', [priceDifferencePercentage]);
    priceDifferenceMessage = t('swapPriceDifference', [sourceTokenValue, // Number of source token to swap
    usedQuote.sourceTokenInfo.symbol, // Source token symbol
    priceSlippageFromSource, // Source tokens total value
    destinationTokenValue, // Number of destination tokens in return
    usedQuote.destinationTokenInfo.symbol, // Destination token symbol,
    priceSlippageFromDestination // Destination tokens total value
    ]);
    priceDifferenceClass = usedQuote.priceSlippage.bucket;
    priceDifferenceAcknowledgementText = t('tooltipApproveButton');
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('view-quote__price-difference-warning-wrapper', priceDifferenceClass)
  }, /*#__PURE__*/_react.default.createElement(_actionableMessage.default, {
    message: /*#__PURE__*/_react.default.createElement("div", {
      className: "view-quote__price-difference-warning-contents"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "view-quote__price-difference-warning-contents-text"
    }, /*#__PURE__*/_react.default.createElement(_box.default, {
      display: _designSystem.DISPLAY.FLEX,
      justifyContent: _designSystem.JUSTIFY_CONTENT.SPACE_BETWEEN,
      paddingBottom: 2
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "view-quote__price-difference-warning-contents-title"
    }, priceDifferenceTitle), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      position: "bottom",
      theme: "white",
      title: t('swapPriceImpactTooltip')
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-info-circle"
    }))), priceDifferenceMessage, !acknowledged && /*#__PURE__*/_react.default.createElement("div", {
      className: "view-quote__price-difference-warning-contents-actions"
    }, /*#__PURE__*/_react.default.createElement("button", {
      onClick: () => {
        onAcknowledgementClick();
      }
    }, priceDifferenceAcknowledgementText))))
  }));
}

ViewQuotePriceDifference.propTypes = {
  usedQuote: _propTypes.default.object,
  sourceTokenValue: _propTypes.default.string,
  destinationTokenValue: _propTypes.default.string,
  onAcknowledgementClick: _propTypes.default.func,
  acknowledged: _propTypes.default.bool,
  priceSlippageFromSource: _propTypes.default.string,
  priceSlippageFromDestination: _propTypes.default.string,
  priceDifferencePercentage: _propTypes.default.number,
  priceSlippageUnknownFiatValue: _propTypes.default.bool
};

//# sourceMappingURL=ui/pages/swaps/view-quote/view-quote-price-difference.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/view-quote/view-quote-price-difference.js",}],
[4294, {"./main-quote-summary":4295,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _mainQuoteSummary.default;
  }
});

var _mainQuoteSummary = _interopRequireDefault(require("./main-quote-summary"));

//# sourceMappingURL=ui/pages/swaps/main-quote-summary/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/main-quote-summary/index.js",}],
[4302, {"./select-quote-popover":4306,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _selectQuotePopover.default;
  }
});

var _selectQuotePopover = _interopRequireDefault(require("./select-quote-popover"));

//# sourceMappingURL=ui/pages/swaps/select-quote-popover/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/select-quote-popover/index.js",}],
[3668, {"../../../../shared/constants/gas":3592,"../../../../shared/modules/transaction.utils":3609,"../../../contexts/i18n":3970,"../../../ducks/app/app":3977,"../../../helpers/utils/conversions.util":4009,"../../../hooks/useGasFeeInputs":4029,"../../../hooks/useIncrementedGasFees":4031,"../../../selectors":4326,"../../../store/actions":4331,"../../ui/button":3842,"../../ui/loading-heartbeat":3903,"../../ui/popover":3925,"../edit-gas-display":3667,"../edit-gas-display-education":3665,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EditGasPopover;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _useGasFeeInputs = require("../../../hooks/useGasFeeInputs");

var _app = require("../../../ducks/app/app");

var _transaction = require("../../../../shared/modules/transaction.utils");

var _gas = require("../../../../shared/constants/gas");

var _conversions = require("../../../helpers/utils/conversions.util");

var _popover = _interopRequireDefault(require("../../ui/popover"));

var _button = _interopRequireDefault(require("../../ui/button"));

var _editGasDisplay = _interopRequireDefault(require("../edit-gas-display"));

var _editGasDisplayEducation = _interopRequireDefault(require("../edit-gas-display-education"));

var _i18n = require("../../../contexts/i18n");

var _actions = require("../../../store/actions");

var _loadingHeartbeat = _interopRequireDefault(require("../../ui/loading-heartbeat"));

var _selectors = require("../../../selectors");

var _useIncrementedGasFees = require("../../../hooks/useIncrementedGasFees");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function EditGasPopover({
  popoverTitle = '',
  confirmButtonText = '',
  editGasDisplayProps = {},
  defaultEstimateToUse = 'medium',
  transaction,
  mode,
  onClose,
  minimumGasLimit = _gas.GAS_LIMITS.SIMPLE
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const dispatch = (0, _reactRedux.useDispatch)();
  const networkAndAccountSupport1559 = (0, _reactRedux.useSelector)(_selectors.checkNetworkAndAccountSupports1559);
  const gasLoadingAnimationIsShowing = (0, _reactRedux.useSelector)(_app.getGasLoadingAnimationIsShowing);
  const showEducationButton = (mode === _gas.EDIT_GAS_MODES.MODIFY_IN_PLACE || mode === _gas.EDIT_GAS_MODES.SWAPS) && networkAndAccountSupport1559;
  const [showEducationContent, setShowEducationContent] = (0, _react.useState)(false);
  const [warning] = (0, _react.useState)(null);
  const [dappSuggestedGasFeeAcknowledged, setDappSuggestedGasFeeAcknowledged] = (0, _react.useState)(false);
  const minimumGasLimitDec = (0, _conversions.hexToDecimal)(minimumGasLimit);
  const updatedCustomGasSettings = (0, _useIncrementedGasFees.useIncrementedGasFees)(transaction);
  let updatedTransaction = transaction;

  if (mode === _gas.EDIT_GAS_MODES.SPEED_UP || mode === _gas.EDIT_GAS_MODES.CANCEL) {
    updatedTransaction = _objectSpread(_objectSpread({}, transaction), {}, {
      userFeeLevel: 'custom',
      txParams: _objectSpread(_objectSpread({}, transaction.txParams), updatedCustomGasSettings)
    });
  }

  const {
    maxPriorityFeePerGas,
    setMaxPriorityFeePerGas,
    maxPriorityFeePerGasFiat,
    maxFeePerGas,
    setMaxFeePerGas,
    maxFeePerGasFiat,
    estimatedMaximumNative,
    estimatedMinimumNative,
    isGasEstimatesLoading,
    gasEstimateType,
    gasPrice,
    setGasPrice,
    gasLimit,
    setGasLimit,
    estimateToUse,
    setEstimateToUse,
    estimatedMinimumFiat,
    estimatedMaximumFiat,
    hasGasErrors,
    gasErrors,
    gasWarnings,
    onManualChange,
    balanceError,
    estimatesUnavailableWarning,
    estimatedBaseFee
  } = (0, _useGasFeeInputs.useGasFeeInputs)(defaultEstimateToUse, updatedTransaction, minimumGasLimit, mode);
  const txParamsHaveBeenCustomized = estimateToUse === 'custom' || (0, _transaction.txParamsAreDappSuggested)(updatedTransaction);
  /**
   * Temporary placeholder, this should be managed by the parent component but
   * we will be extracting this component from the hard to maintain modal
   * component. For now this is just to be able to appropriately close
   * the modal in testing
   */

  const closePopover = (0, _react.useCallback)(() => {
    if (onClose) {
      onClose();
    } else {
      dispatch((0, _actions.hideModal)());
    }
  }, [onClose, dispatch]);
  const onSubmit = (0, _react.useCallback)(() => {
    var _ref;

    if (!updatedTransaction || !mode) {
      closePopover();
    }

    const newGasSettings = networkAndAccountSupport1559 ? {
      gas: (0, _conversions.decimalToHex)(gasLimit),
      gasLimit: (0, _conversions.decimalToHex)(gasLimit),
      maxFeePerGas: (0, _conversions.decGWEIToHexWEI)(maxFeePerGas !== null && maxFeePerGas !== void 0 ? maxFeePerGas : gasPrice),
      maxPriorityFeePerGas: (0, _conversions.decGWEIToHexWEI)((_ref = maxPriorityFeePerGas !== null && maxPriorityFeePerGas !== void 0 ? maxPriorityFeePerGas : maxFeePerGas) !== null && _ref !== void 0 ? _ref : gasPrice)
    } : {
      gas: (0, _conversions.decimalToHex)(gasLimit),
      gasLimit: (0, _conversions.decimalToHex)(gasLimit),
      gasPrice: (0, _conversions.decGWEIToHexWEI)(gasPrice)
    };

    const cleanTransactionParams = _objectSpread({}, updatedTransaction.txParams);

    if (networkAndAccountSupport1559) {
      delete cleanTransactionParams.gasPrice;
    }

    const updatedTxMeta = _objectSpread(_objectSpread({}, updatedTransaction), {}, {
      userFeeLevel: estimateToUse || 'custom',
      txParams: _objectSpread(_objectSpread({}, cleanTransactionParams), newGasSettings)
    });

    switch (mode) {
      case _gas.EDIT_GAS_MODES.CANCEL:
        dispatch((0, _actions.createCancelTransaction)(updatedTransaction.id, newGasSettings, {
          estimatedBaseFee
        }));
        break;

      case _gas.EDIT_GAS_MODES.SPEED_UP:
        dispatch((0, _actions.createSpeedUpTransaction)(updatedTransaction.id, newGasSettings, {
          estimatedBaseFee
        }));
        break;

      case _gas.EDIT_GAS_MODES.MODIFY_IN_PLACE:
        dispatch((0, _actions.updateTransaction)(updatedTxMeta));
        break;

      case _gas.EDIT_GAS_MODES.SWAPS:
        // This popover component should only be used for the "FEE_MARKET" type in Swaps.
        if (networkAndAccountSupport1559) {
          dispatch((0, _actions.updateSwapsUserFeeLevel)(estimateToUse || 'custom'));
          dispatch((0, _actions.updateCustomSwapsEIP1559GasParams)(newGasSettings));
        }

        break;

      default:
        break;
    }

    closePopover();
  }, [updatedTransaction, mode, dispatch, closePopover, gasLimit, gasPrice, maxFeePerGas, maxPriorityFeePerGas, networkAndAccountSupport1559, estimateToUse, estimatedBaseFee]);
  let title = t('editGasTitle');

  if (popoverTitle) {
    title = popoverTitle;
  } else if (showEducationContent) {
    title = t('editGasEducationModalTitle');
  } else if (mode === _gas.EDIT_GAS_MODES.SPEED_UP) {
    title = t('speedUpPopoverTitle');
  } else if (mode === _gas.EDIT_GAS_MODES.CANCEL) {
    title = t('cancelPopoverTitle');
  }

  const footerButtonText = confirmButtonText || t('save');
  return /*#__PURE__*/_react.default.createElement(_popover.default, {
    title: title,
    onClose: closePopover,
    className: "edit-gas-popover__wrapper",
    onBack: showEducationContent ? () => setShowEducationContent(false) : undefined,
    footer: showEducationContent ? null : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "primary",
      onClick: onSubmit,
      disabled: hasGasErrors || balanceError || (isGasEstimatesLoading || gasLoadingAnimationIsShowing) && !txParamsHaveBeenCustomized
    }, footerButtonText))
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '0 20px 20px 20px',
      position: 'relative'
    }
  }, showEducationContent ? /*#__PURE__*/_react.default.createElement(_editGasDisplayEducation.default, null) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, false === 'true' ? null : /*#__PURE__*/_react.default.createElement(_loadingHeartbeat.default, null), /*#__PURE__*/_react.default.createElement(_editGasDisplay.default, (0, _extends2.default)({
    showEducationButton: showEducationButton,
    warning: warning,
    dappSuggestedGasFeeAcknowledged: dappSuggestedGasFeeAcknowledged,
    setDappSuggestedGasFeeAcknowledged: setDappSuggestedGasFeeAcknowledged,
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    setMaxPriorityFeePerGas: setMaxPriorityFeePerGas,
    maxPriorityFeePerGasFiat: maxPriorityFeePerGasFiat,
    maxFeePerGas: maxFeePerGas,
    setMaxFeePerGas: setMaxFeePerGas,
    maxFeePerGasFiat: maxFeePerGasFiat,
    estimatedMaximumNative: estimatedMaximumNative,
    estimatedMinimumNative: estimatedMinimumNative,
    isGasEstimatesLoading: isGasEstimatesLoading,
    gasEstimateType: gasEstimateType,
    gasPrice: gasPrice,
    setGasPrice: setGasPrice,
    gasLimit: gasLimit,
    setGasLimit: setGasLimit,
    estimateToUse: estimateToUse,
    setEstimateToUse: setEstimateToUse,
    estimatedMinimumFiat: estimatedMinimumFiat,
    estimatedMaximumFiat: estimatedMaximumFiat,
    onEducationClick: () => setShowEducationContent(true),
    mode: mode,
    transaction: updatedTransaction,
    gasErrors: gasErrors,
    gasWarnings: gasWarnings,
    onManualChange: onManualChange,
    minimumGasLimit: minimumGasLimitDec,
    balanceError: balanceError,
    estimatesUnavailableWarning: estimatesUnavailableWarning,
    hasGasErrors: hasGasErrors,
    txParamsHaveBeenCustomized: txParamsHaveBeenCustomized
  }, editGasDisplayProps)))));
}

EditGasPopover.propTypes = {
  popoverTitle: _propTypes.default.string,
  editGasDisplayProps: _propTypes.default.object,
  confirmButtonText: _propTypes.default.string,
  onClose: _propTypes.default.func,
  transaction: _propTypes.default.object,
  mode: _propTypes.default.oneOf(Object.values(_gas.EDIT_GAS_MODES)),
  defaultEstimateToUse: _propTypes.default.string,
  minimumGasLimit: _propTypes.default.string
};

//# sourceMappingURL=ui/components/app/edit-gas-popover/edit-gas-popover.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/edit-gas-popover/edit-gas-popover.component.js",}],
[4042, {"../ducks/metamask/metamask":3985,"../helpers/utils/token-util":4017,"../selectors":4326,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTokenFiatAmount = useTokenFiatAmount;

var _react = require("react");

var _reactRedux = require("react-redux");

var _selectors = require("../selectors");

var _tokenUtil = require("../helpers/utils/token-util");

var _metamask = require("../ducks/metamask/metamask");

/**
 * Get the token balance converted to fiat and formatted for display
 *
 * @param {string} [tokenAddress] - The token address
 * @param {string} [tokenAmount] - The token balance
 * @param {string} [tokenSymbol] - The token symbol
 * @param {Object} [overrides] - A configuration object that allows the caller to explicitly pass an exchange rate or
 *                              ensure fiat is shown even if the property is not set in state.
 * @param {number} [overrides.exchangeRate] -  An exhchange rate to use instead of the one selected from state
 * @param {boolean} [overrides.showFiat] - If truthy, ensures the fiat value is shown even if the showFiat value from state is falsey
 * @param {boolean} hideCurrencySymbol Indicates whether the returned formatted amount should include the trailing currency symbol
 * @return {string} - The formatted token amount in the user's chosen fiat currency
 */
function useTokenFiatAmount(tokenAddress, tokenAmount, tokenSymbol, overrides = {}, hideCurrencySymbol) {
  var _overrides$showFiat, _overrides$exchangeRa;

  const contractExchangeRates = (0, _reactRedux.useSelector)(_selectors.getTokenExchangeRates);
  const conversionRate = (0, _reactRedux.useSelector)(_metamask.getConversionRate);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  const userPrefersShownFiat = (0, _reactRedux.useSelector)(_selectors.getShouldShowFiat);
  const showFiat = (_overrides$showFiat = overrides.showFiat) !== null && _overrides$showFiat !== void 0 ? _overrides$showFiat : userPrefersShownFiat;
  const tokenExchangeRate = (_overrides$exchangeRa = overrides.exchangeRate) !== null && _overrides$exchangeRa !== void 0 ? _overrides$exchangeRa : contractExchangeRates[tokenAddress];
  const formattedFiat = (0, _react.useMemo)(() => (0, _tokenUtil.getTokenFiatAmount)(tokenExchangeRate, conversionRate, currentCurrency, tokenAmount, tokenSymbol, true, hideCurrencySymbol), [tokenExchangeRate, conversionRate, currentCurrency, tokenAmount, tokenSymbol, hideCurrencySymbol]);

  if (!showFiat || currentCurrency.toUpperCase() === tokenSymbol) {
    return undefined;
  }

  return formattedFiat;
}

//# sourceMappingURL=ui/hooks/useTokenFiatAmount.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useTokenFiatAmount.js",}],
[4044, {"../../shared/modules/swaps.utils":3608,"../ducks/metamask/metamask":3985,"../ducks/swaps/swaps":3988,"../helpers/utils/token-util":4017,"../selectors":4326,"./useEqualityCheck":4026,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/contract-metadata":857,"bignumber.js":1351,"lodash":2646,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRenderableTokenData = getRenderableTokenData;
exports.useTokensToSearch = useTokensToSearch;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

var _reactRedux = require("react-redux");

var _contractMetadata = _interopRequireDefault(require("@metamask/contract-metadata"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _lodash = require("lodash");

var _tokenUtil = require("../helpers/utils/token-util");

var _selectors = require("../selectors");

var _metamask = require("../ducks/metamask/metamask");

var _swaps = require("../ducks/swaps/swaps");

var _swaps2 = require("../../shared/modules/swaps.utils");

var _useEqualityCheck = require("./useEqualityCheck");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const shuffledContractMap = (0, _lodash.shuffle)(Object.entries(_contractMetadata.default).map(([address, tokenData]) => _objectSpread(_objectSpread({}, tokenData), {}, {
  address: address.toLowerCase()
})).filter(tokenData => Boolean(tokenData.erc20)));

function getRenderableTokenData(token, contractExchangeRates, conversionRate, currentCurrency, chainId, tokenList, useTokenDetection) {
  var _tokenList$tokenAddre, _tokenList$tokenAddre2;

  const {
    symbol,
    name,
    address,
    iconUrl,
    string,
    balance,
    decimals
  } = token; // token from dynamic api list is fetched when useTokenDetection is true
  // And since the token.address from allTokens is checksumaddress
  // token Address have to be changed to lowercase when we are using dynamic list

  const tokenAddress = useTokenDetection ? address === null || address === void 0 ? void 0 : address.toLowerCase() : address;
  const formattedFiat = (0, _tokenUtil.getTokenFiatAmount)((0, _swaps2.isSwapsDefaultTokenSymbol)(symbol, chainId) ? 1 : contractExchangeRates[address], conversionRate, currentCurrency, string, symbol, true) || '';
  const rawFiat = (0, _tokenUtil.getTokenFiatAmount)((0, _swaps2.isSwapsDefaultTokenSymbol)(symbol, chainId) ? 1 : contractExchangeRates[address], conversionRate, currentCurrency, string, symbol, false) || '';
  const usedIconUrl = iconUrl || tokenList[tokenAddress] && `images/contract/${tokenList[tokenAddress].iconUrl}` || (token === null || token === void 0 ? void 0 : token.image);
  return _objectSpread(_objectSpread({}, token), {}, {
    primaryLabel: symbol,
    secondaryLabel: name || ((_tokenList$tokenAddre = tokenList[tokenAddress]) === null || _tokenList$tokenAddre === void 0 ? void 0 : _tokenList$tokenAddre.name),
    rightPrimaryLabel: string && `${new _bignumber.default(string).round(6).toString()} ${symbol}`,
    rightSecondaryLabel: formattedFiat,
    iconUrl: usedIconUrl,
    identiconAddress: usedIconUrl ? null : address,
    balance,
    decimals,
    name: name || ((_tokenList$tokenAddre2 = tokenList[tokenAddress]) === null || _tokenList$tokenAddre2 === void 0 ? void 0 : _tokenList$tokenAddre2.name),
    rawFiat
  });
}

function useTokensToSearch({
  usersTokens = [],
  topTokens = {},
  shuffledTokensList
}) {
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const tokenConversionRates = (0, _reactRedux.useSelector)(_selectors.getTokenExchangeRates, _lodash.isEqual);
  const conversionRate = (0, _reactRedux.useSelector)(_metamask.getConversionRate);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  const defaultSwapsToken = (0, _reactRedux.useSelector)(_selectors.getSwapsDefaultToken);
  const tokenList = (0, _reactRedux.useSelector)(_selectors.getTokenList);
  const useTokenDetection = (0, _reactRedux.useSelector)(_selectors.getUseTokenDetection); // token from dynamic api list is fetched when useTokenDetection is true

  const shuffledTokenList = useTokenDetection ? shuffledTokensList : shuffledContractMap;
  const memoizedTopTokens = (0, _useEqualityCheck.useEqualityCheck)(topTokens);
  const memoizedUsersToken = (0, _useEqualityCheck.useEqualityCheck)(usersTokens);
  const defaultToken = getRenderableTokenData(defaultSwapsToken, tokenConversionRates, conversionRate, currentCurrency, chainId, tokenList, useTokenDetection);
  const memoizedDefaultToken = (0, _useEqualityCheck.useEqualityCheck)(defaultToken);
  const swapsTokens = (0, _reactRedux.useSelector)(_swaps.getSwapsTokens) || [];
  const tokensToSearch = swapsTokens.length ? swapsTokens : [memoizedDefaultToken, ...shuffledTokenList.filter(token => token.symbol !== memoizedDefaultToken.symbol)];
  const memoizedTokensToSearch = (0, _useEqualityCheck.useEqualityCheck)(tokensToSearch);
  return (0, _react.useMemo)(() => {
    const usersTokensAddressMap = memoizedUsersToken.reduce((acc, token) => _objectSpread(_objectSpread({}, acc), {}, {
      [token.address.toLowerCase()]: token
    }), {});
    const tokensToSearchBuckets = {
      owned: [],
      top: [],
      others: []
    };
    const memoizedSwapsAndUserTokensWithoutDuplicities = (0, _lodash.uniqBy)([...memoizedTokensToSearch, ...memoizedUsersToken], token => token.address.toLowerCase());
    memoizedSwapsAndUserTokensWithoutDuplicities.forEach(token => {
      const renderableDataToken = getRenderableTokenData(_objectSpread(_objectSpread({}, usersTokensAddressMap[token.address.toLowerCase()]), token), tokenConversionRates, conversionRate, currentCurrency, chainId, tokenList, useTokenDetection);

      if ((0, _swaps2.isSwapsDefaultTokenSymbol)(renderableDataToken.symbol, chainId) || usersTokensAddressMap[token.address.toLowerCase()]) {
        tokensToSearchBuckets.owned.push(renderableDataToken);
      } else if (memoizedTopTokens[token.address.toLowerCase()]) {
        tokensToSearchBuckets.top[memoizedTopTokens[token.address.toLowerCase()].index] = renderableDataToken;
      } else {
        tokensToSearchBuckets.others.push(renderableDataToken);
      }
    });
    tokensToSearchBuckets.owned = tokensToSearchBuckets.owned.sort(({
      rawFiat
    }, {
      rawFiat: secondRawFiat
    }) => {
      return new _bignumber.default(rawFiat || 0).gt(secondRawFiat || 0) ? -1 : 1;
    });
    tokensToSearchBuckets.top = tokensToSearchBuckets.top.filter(Boolean);
    return [...tokensToSearchBuckets.owned, ...tokensToSearchBuckets.top, ...tokensToSearchBuckets.others];
  }, [memoizedTokensToSearch, memoizedUsersToken, tokenConversionRates, conversionRate, currentCurrency, memoizedTopTokens, chainId, tokenList, useTokenDetection]);
}

//# sourceMappingURL=ui/hooks/useTokensToSearch.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useTokensToSearch.js",}],
[3896, {"./info-tooltip":3898,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _infoTooltip.default;
  }
});

var _infoTooltip = _interopRequireDefault(require("./info-tooltip"));

//# sourceMappingURL=ui/components/ui/info-tooltip/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/info-tooltip/index.js",}],
[4281, {"./dropdown-input-pair":4280,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _dropdownInputPair.default;
  }
});

var _dropdownInputPair = _interopRequireDefault(require("./dropdown-input-pair"));

//# sourceMappingURL=ui/pages/swaps/dropdown-input-pair/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/dropdown-input-pair/index.js",}],
[4309, {"./slippage-buttons":4310,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _slippageButtons.default;
  }
});

var _slippageButtons = _interopRequireDefault(require("./slippage-buttons"));

//# sourceMappingURL=ui/pages/swaps/slippage-buttons/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/slippage-buttons/index.js",}],
[4283, {"./dropdown-search-list":4282,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _dropdownSearchList.default;
  }
});

var _dropdownSearchList = _interopRequireDefault(require("./dropdown-search-list"));

//# sourceMappingURL=ui/pages/swaps/dropdown-search-list/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/dropdown-search-list/index.js",}],
[3739, {"../../../../store/actions":4331,"../../../ui/button":3842,"../../../ui/identicon":3895,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
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

var actions = _interopRequireWildcard(require("../../../../store/actions"));

var _identicon = _interopRequireDefault(require("../../../ui/identicon"));

var _button = _interopRequireDefault(require("../../../ui/button"));

function mapStateToProps(state) {
  return {
    token: state.appState.modal.modalState.props.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => dispatch(actions.hideModal()),
    hideToken: address => {
      dispatch(actions.removeToken(address)).then(() => {
        dispatch(actions.hideModal());
      });
    }
  };
}

class HideTokenConfirmationModal extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {});
  }

  render() {
    const {
      token,
      hideToken,
      hideModal
    } = this.props;
    const {
      symbol,
      address,
      image
    } = token;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "hide-token-confirmation"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "hide-token-confirmation__container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "hide-token-confirmation__title"
    }, this.context.t('hideTokenPrompt')), /*#__PURE__*/_react.default.createElement(_identicon.default, {
      className: "hide-token-confirmation__identicon",
      diameter: 45,
      address: address,
      image: image
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "hide-token-confirmation__symbol"
    }, symbol), /*#__PURE__*/_react.default.createElement("div", {
      className: "hide-token-confirmation__copy"
    }, this.context.t('readdToken')), /*#__PURE__*/_react.default.createElement("div", {
      className: "hide-token-confirmation__buttons"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      className: "hide-token-confirmation__button",
      "data-testid": "hide-token-confirmation__cancel",
      onClick: () => hideModal()
    }, this.context.t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      className: "hide-token-confirmation__button",
      "data-testid": "hide-token-confirmation__hide",
      onClick: () => hideToken(address)
    }, this.context.t('hide')))));
  }

}

(0, _defineProperty2.default)(HideTokenConfirmationModal, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(HideTokenConfirmationModal, "propTypes", {
  hideToken: _propTypes.default.func.isRequired,
  hideModal: _propTypes.default.func.isRequired,
  token: _propTypes.default.shape({
    symbol: _propTypes.default.string,
    address: _propTypes.default.string,
    image: _propTypes.default.string
  })
});

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(HideTokenConfirmationModal);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/hide-token-confirmation-modal/hide-token-confirmation-modal.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/hide-token-confirmation-modal/hide-token-confirmation-modal.js",}],
[3730, {"../../../../selectors/selectors":4328,"../../../../store/actions":4331,"./deposit-ether-modal.component":3729,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../../../store/actions");

var _selectors = require("../../../../selectors/selectors");

var _depositEtherModal = _interopRequireDefault(require("./deposit-ether-modal.component"));

function mapStateToProps(state) {
  return {
    chainId: (0, _selectors.getCurrentChainId)(state),
    isTestnet: (0, _selectors.getIsTestnet)(state),
    isMainnet: (0, _selectors.getIsMainnet)(state),
    address: (0, _selectors.getSelectedAddress)(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toWyre: address => {
      dispatch((0, _actions.buyEth)({
        service: 'wyre',
        address
      }));
    },
    toTransak: address => {
      dispatch((0, _actions.buyEth)({
        service: 'transak',
        address
      }));
    },
    hideModal: () => {
      dispatch((0, _actions.hideModal)());
    },
    hideWarning: () => {
      dispatch((0, _actions.hideWarning)());
    },
    showAccountDetailModal: () => {
      dispatch((0, _actions.showModal)({
        name: 'ACCOUNT_DETAILS'
      }));
    },
    toFaucet: chainId => dispatch((0, _actions.buyEth)({
      chainId
    }))
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_depositEtherModal.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/deposit-ether-modal/deposit-ether-modal.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/deposit-ether-modal/deposit-ether-modal.container.js",}],
[3751, {"../../../../store/actions":4331,"./qr-scanner.component":3750,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../../../store/actions");

var _qrScanner = _interopRequireDefault(require("./qr-scanner.component"));

const mapDispatchToProps = dispatch => {
  return {
    hideModal: () => dispatch((0, _actions.hideModal)()),
    qrCodeDetected: data => dispatch((0, _actions.qrCodeDetected)(data))
  };
};

var _default = (0, _reactRedux.connect)(null, mapDispatchToProps)(_qrScanner.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/qr-scanner/qr-scanner.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/qr-scanner/qr-scanner.container.js",}],
[3722, {"../../../../helpers/higher-order-components/with-modal-props":4004,"../../../../selectors":4326,"../../../../store/actions":4331,"./confirm-remove-account.component":3721,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _selectors = require("../../../../selectors");

var _actions = require("../../../../store/actions");

var _confirmRemoveAccount = _interopRequireDefault(require("./confirm-remove-account.component"));

const mapStateToProps = state => {
  return {
    chainId: (0, _selectors.getCurrentChainId)(state),
    rpcPrefs: (0, _selectors.getRpcPrefsForCurrentProvider)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeAccount: address => dispatch((0, _actions.removeAccount)(address))
  };
};

var _default = (0, _redux.compose)(_withModalProps.default, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_confirmRemoveAccount.default);

exports.default = _default;


//# sourceMappingURL=ui/components/app/modals/confirm-remove-account/confirm-remove-account.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-remove-account/confirm-remove-account.container.js",}],
[3754, {"../../../../helpers/higher-order-components/with-modal-props":4004,"./reject-transactions.component":3753,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _rejectTransactions = _interopRequireDefault(require("./reject-transactions.component"));

const mapStateToProps = (_, ownProps) => {
  const {
    unapprovedTxCount
  } = ownProps;
  return {
    unapprovedTxCount
  };
};

var _default = (0, _redux.compose)(_withModalProps.default, (0, _reactRedux.connect)(mapStateToProps))(_rejectTransactions.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/reject-transactions/reject-transactions.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/reject-transactions/reject-transactions.container.js",}],
[3744, {"../../../../helpers/higher-order-components/with-modal-props":4004,"../../../../store/actions":4331,"./metametrics-opt-in-modal.component":3743,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _actions = require("../../../../store/actions");

var _metametricsOptInModal = _interopRequireDefault(require("./metametrics-opt-in-modal.component"));

const mapStateToProps = (_, ownProps) => {
  const {
    unapprovedTxCount
  } = ownProps;
  return {
    unapprovedTxCount
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setParticipateInMetaMetrics: val => dispatch((0, _actions.setParticipateInMetaMetrics)(val))
  };
};

var _default = (0, _redux.compose)(_withModalProps.default, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_metametricsOptInModal.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/metametrics-opt-in-modal/metametrics-opt-in-modal.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/metametrics-opt-in-modal/metametrics-opt-in-modal.container.js",}],
[3748, {"../../../../store/actions":4331,"./new-account-modal.component":3747,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var actions = _interopRequireWildcard(require("../../../../store/actions"));

var _newAccountModal = _interopRequireDefault(require("./new-account-modal.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function mapStateToProps(state) {
  return _objectSpread({}, state.appState.modal.modalState.props || {});
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => dispatch(actions.hideModal()),
    createAccount: newAccountName => {
      return dispatch(actions.addNewAccount()).then(newAccountAddress => {
        if (newAccountName) {
          dispatch(actions.setAccountLabel(newAccountAddress, newAccountName));
        }

        return newAccountAddress;
      });
    }
  };
}

function mergeProps(stateProps, dispatchProps) {
  const {
    onCreateNewAccount
  } = stateProps;
  const {
    createAccount
  } = dispatchProps;
  return _objectSpread(_objectSpread(_objectSpread({}, stateProps), dispatchProps), {}, {
    onSave: newAccountName => {
      return createAccount(newAccountName).then(newAccountAddress => onCreateNewAccount(newAccountAddress));
    }
  });
}

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(_newAccountModal.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/new-account-modal/new-account-modal.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/new-account-modal/new-account-modal.container.js",}],
[3725, {"../../../../helpers/higher-order-components/with-modal-props":4004,"../../../../store/actions":4331,"./confirm-reset-account.component":3724,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _actions = require("../../../../store/actions");

var _confirmResetAccount = _interopRequireDefault(require("./confirm-reset-account.component"));

const mapDispatchToProps = dispatch => {
  return {
    resetAccount: () => dispatch((0, _actions.resetAccount)())
  };
};

var _default = (0, _redux.compose)(_withModalProps.default, (0, _reactRedux.connect)(null, mapDispatchToProps))(_confirmResetAccount.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/confirm-reset-account/confirm-reset-account.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-reset-account/confirm-reset-account.container.js",}],
[3719, {"../../../../helpers/higher-order-components/with-modal-props":4004,"../../../../store/actions":4331,"./confirm-delete-network.component":3718,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _actions = require("../../../../store/actions");

var _confirmDeleteNetwork = _interopRequireDefault(require("./confirm-delete-network.component"));

const mapDispatchToProps = dispatch => {
  return {
    delRpcTarget: target => dispatch((0, _actions.delRpcTarget)(target))
  };
};

var _default = (0, _redux.compose)(_withModalProps.default, (0, _reactRedux.connect)(null, mapDispatchToProps))(_confirmDeleteNetwork.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/confirm-delete-network/confirm-delete-network.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-delete-network/confirm-delete-network.container.js",}],
[3757, {"../../../../helpers/higher-order-components/with-modal-props":4004,"./transaction-confirmed.component":3756,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _transactionConfirmed = _interopRequireDefault(require("./transaction-confirmed.component"));

var _default = (0, _withModalProps.default)(_transactionConfirmed.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/transaction-confirmed/transaction-confirmed.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/transaction-confirmed/transaction-confirmed.container.js",}],
[3711, {"../../../../store/actions":4331,"./add-to-addressbook-modal.component":3710,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var actions = _interopRequireWildcard(require("../../../../store/actions"));

var _addToAddressbookModal = _interopRequireDefault(require("./add-to-addressbook-modal.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function mapStateToProps(state) {
  return _objectSpread({}, state.appState.modal.modalState.props || {});
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => dispatch(actions.hideModal()),
    addToAddressBook: (recipient, nickname) => dispatch(actions.addToAddressBook(recipient, nickname))
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_addToAddressbookModal.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/add-to-addressbook-modal/add-to-addressbook-modal.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/add-to-addressbook-modal/add-to-addressbook-modal.container.js",}],
[3733, {"../../../../helpers/higher-order-components/with-modal-props":4004,"../../../../selectors":4326,"./edit-approval-permission.component":3732,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _selectors = require("../../../../selectors");

var _editApprovalPermission = _interopRequireDefault(require("./edit-approval-permission.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const mapStateToProps = state => {
  const modalStateProps = state.appState.modal.modalState.props || {};
  return _objectSpread({
    selectedIdentity: (0, _selectors.getSelectedIdentity)(state)
  }, modalStateProps);
};

var _default = (0, _redux.compose)(_withModalProps.default, (0, _reactRedux.connect)(mapStateToProps))(_editApprovalPermission.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/edit-approval-permission/edit-approval-permission.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/edit-approval-permission/edit-approval-permission.container.js",}],
[3705, {"../../../../selectors":4326,"../../../../store/actions":4331,"./account-details-modal.component":3704,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../../../store/actions");

var _selectors = require("../../../../selectors");

var _accountDetailsModal = _interopRequireDefault(require("./account-details-modal.component"));

const mapStateToProps = state => {
  return {
    chainId: (0, _selectors.getCurrentChainId)(state),
    selectedIdentity: (0, _selectors.getSelectedIdentity)(state),
    keyrings: state.metamask.keyrings,
    rpcPrefs: (0, _selectors.getRpcPrefsForCurrentProvider)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showExportPrivateKeyModal: () => dispatch((0, _actions.showModal)({
      name: 'EXPORT_PRIVATE_KEY'
    })),
    setAccountLabel: (address, label) => dispatch((0, _actions.setAccountLabel)(address, label))
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_accountDetailsModal.default);

exports.default = _default;


//# sourceMappingURL=ui/components/app/modals/account-details-modal/account-details-modal.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/account-details-modal/account-details-modal.container.js",}],
[3727, {"../../../../helpers/constants/design-system":3992,"../../../../helpers/higher-order-components/with-modal-props":4004,"../../../../hooks/useI18nContext":4030,"../../../ui/box":3838,"../../../ui/button":3842,"../../../ui/text-field":3951,"../../../ui/typography":3964,"../../modal":3700,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _modal = _interopRequireDefault(require("../../modal"));

var _textField = _interopRequireDefault(require("../../../ui/text-field"));

var _button = _interopRequireDefault(require("../../../ui/button"));

var _typography = _interopRequireDefault(require("../../../ui/typography"));

var _designSystem = require("../../../../helpers/constants/design-system");

var _box = _interopRequireDefault(require("../../../ui/box"));

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _useI18nContext = require("../../../../hooks/useI18nContext");

const CustomizeNonce = ({
  hideModal,
  customNonceValue,
  nextNonce,
  updateCustomNonce,
  getNextNonce
}) => {
  const [customNonce, setCustomNonce] = (0, _react.useState)('');
  const t = (0, _useI18nContext.useI18nContext)();
  return /*#__PURE__*/_react.default.createElement(_modal.default, {
    onSubmit: () => {
      if (customNonce === '') {
        updateCustomNonce(customNonceValue);
      } else {
        updateCustomNonce(customNonce);
      }

      getNextNonce();
      hideModal();
    },
    submitText: t('save'),
    submitType: "primary",
    onCancel: () => hideModal(),
    cancelText: t('cancel'),
    cancelType: "secondary",
    rounded: true,
    contentClass: "customize-nonce-modal-content",
    containerClass: "customize-nonce-modal-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "customize-nonce-modal"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "customize-nonce-modal__main-header"
  }, /*#__PURE__*/_react.default.createElement(_typography.default, {
    className: "customize-nonce-modal__main-title",
    variant: _designSystem.TYPOGRAPHY.H4,
    fontWeight: _designSystem.FONT_WEIGHT.BOLD
  }, t('editNonceField')), /*#__PURE__*/_react.default.createElement("button", {
    className: "fas fa-times customize-nonce-modal__close",
    title: t('close'),
    onClick: hideModal
  })), /*#__PURE__*/_react.default.createElement(_box.default, {
    marginTop: 2,
    display: _designSystem.DISPLAY.INLINE_FLEX,
    alignItems: _designSystem.ALIGN_ITEMS.CENTER
  }, /*#__PURE__*/_react.default.createElement(_typography.default, {
    variant: _designSystem.TYPOGRAPHY.H6,
    fontWeight: _designSystem.FONT_WEIGHT.NORMAL
  }, t('editNonceMessage'), /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "link",
    className: "customize-nonce-modal__link",
    rel: "noopener noreferrer",
    target: "_blank",
    href: "https://metamask.zendesk.com/hc/en-us/articles/360015489251"
  }, t('learnMore')))), /*#__PURE__*/_react.default.createElement(_box.default, {
    marginTop: 3
  }, /*#__PURE__*/_react.default.createElement(_box.default, {
    alignItems: _designSystem.ALIGN_ITEMS.CENTER,
    display: _designSystem.DISPLAY.FLEX
  }, /*#__PURE__*/_react.default.createElement(_typography.default, {
    variant: _designSystem.TYPOGRAPHY.H6,
    fontWeight: _designSystem.FONT_WEIGHT.BOLD,
    boxProps: {
      width: _designSystem.BLOCK_SIZES.FIVE_SIXTHS
    }
  }, t('editNonceField')), /*#__PURE__*/_react.default.createElement(_box.default, {
    width: _designSystem.BLOCK_SIZES.ONE_SIXTH
  }, /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "link",
    className: "customize-nonce-modal__reset",
    onClick: () => {
      setCustomNonce(nextNonce);
    }
  }, t('reset')))), /*#__PURE__*/_react.default.createElement("div", {
    className: "customize-nonce-modal__input"
  }, /*#__PURE__*/_react.default.createElement(_textField.default, {
    type: "number",
    min: "0",
    placeholder: customNonceValue || typeof nextNonce === 'number' && nextNonce.toString(),
    onChange: e => {
      setCustomNonce(e.target.value);
    },
    fullWidth: true,
    margin: "dense",
    value: customNonce,
    id: "custom-nonce-id"
  })))));
};

CustomizeNonce.propTypes = {
  hideModal: _propTypes.default.func.isRequired,
  customNonceValue: _propTypes.default.string,
  nextNonce: _propTypes.default.number,
  updateCustomNonce: _propTypes.default.func,
  getNextNonce: _propTypes.default.func
};

var _default = (0, _withModalProps.default)(CustomizeNonce);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/customize-nonce/customize-nonce.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/customize-nonce/customize-nonce.component.js",}],
[3736, {"../../../../selectors":4326,"../../../../store/actions":4331,"./export-private-key-modal.component":3735,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../../../store/actions");

var _selectors = require("../../../../selectors");

var _exportPrivateKeyModal = _interopRequireDefault(require("./export-private-key-modal.component"));

function mapStateToPropsFactory() {
  let selectedIdentity = null;
  return function mapStateToProps(state) {
    // We should **not** change the identity displayed here even if it changes from underneath us.
    // If we do, we will be showing the user one private key and a **different** address and name.
    // Note that the selected identity **will** change from underneath us when we unlock the keyring
    // which is the expected behavior that we are side-stepping.
    selectedIdentity = selectedIdentity || (0, _selectors.getSelectedIdentity)(state);
    return {
      warning: state.appState.warning,
      privateKey: state.appState.accountDetail.privateKey,
      selectedIdentity,
      previousModalState: state.appState.modal.previousModalState.name
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    exportAccount: (password, address) => {
      return dispatch((0, _actions.exportAccount)(password, address)).then(res => {
        dispatch((0, _actions.hideWarning)());
        return res;
      });
    },
    showAccountDetailModal: () => dispatch((0, _actions.showModal)({
      name: 'ACCOUNT_DETAILS'
    })),
    hideModal: () => dispatch((0, _actions.hideModal)()),
    hideWarning: () => dispatch((0, _actions.hideWarning)()),
    clearAccountDetails: () => dispatch((0, _actions.clearAccountDetails)())
  };
}

var _default = (0, _reactRedux.connect)(mapStateToPropsFactory, mapDispatchToProps)(_exportPrivateKeyModal.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/export-private-key-modal/export-private-key-modal.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/export-private-key-modal/export-private-key-modal.container.js",}],
[3716, {"../../../../helpers/higher-order-components/with-modal-props":4004,"../../../../store/actions":4331,"./cancel-transaction.component":3715,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"react-redux":3088,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _withModalProps = _interopRequireDefault(require("../../../../helpers/higher-order-components/with-modal-props"));

var _actions = require("../../../../store/actions");

var _cancelTransaction = _interopRequireDefault(require("./cancel-transaction.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const mapStateToProps = (state, ownProps) => {
  const {
    metamask
  } = state;
  const {
    transactionId,
    originalGasPrice,
    newGasFee,
    customGasSettings
  } = ownProps;
  const {
    currentNetworkTxList
  } = metamask;
  const transaction = currentNetworkTxList.find(({
    id
  }) => id === transactionId);
  const transactionStatus = transaction ? transaction.status : '';
  return {
    transactionId,
    transactionStatus,
    originalGasPrice,
    customGasSettings,
    newGasFee
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createCancelTransaction: (txId, customGasSettings) => {
      return dispatch((0, _actions.createCancelTransaction)(txId, customGasSettings));
    },
    showTransactionConfirmedModal: () => dispatch((0, _actions.showModal)({
      name: 'TRANSACTION_CONFIRMED'
    }))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    transactionId,
    customGasSettings
  } = stateProps,
        restStateProps = (0, _objectWithoutProperties2.default)(stateProps, ["transactionId", "customGasSettings"]); // eslint-disable-next-line no-shadow

  const {
    createCancelTransaction
  } = dispatchProps,
        restDispatchProps = (0, _objectWithoutProperties2.default)(dispatchProps, ["createCancelTransaction"]);
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, restStateProps), restDispatchProps), ownProps), {}, {
    createCancelTransaction: () => createCancelTransaction(transactionId, customGasSettings)
  });
};

var _default = (0, _redux.compose)(_withModalProps.default, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps))(_cancelTransaction.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/modals/cancel-transaction/cancel-transaction.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/cancel-transaction/cancel-transaction.container.js",}],
[3678, {"../../../../../app/scripts/lib/util":78,"../../../../../shared/constants/gas":3592,"../../../../../shared/constants/transaction":3599,"../../../../ducks/gas/gas.duck":3981,"../../../../ducks/metamask/metamask":3985,"../../../../ducks/send":3986,"../../../../helpers/utils/conversions.util":4009,"../../../../helpers/utils/formatters":4011,"../../../../pages/send/send.constants":4226,"../../../../pages/send/send.utils":4228,"../../../../selectors":4326,"../../../../store/actions":4331,"./gas-modal-page-container.component":3677,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var _util = require("../../../../../app/scripts/lib/util");

var _actions = require("../../../../store/actions");

var _gas = require("../../../../ducks/gas/gas.duck");

var _send = require("../../../../ducks/send");

var _selectors = require("../../../../selectors");

var _conversions = require("../../../../helpers/utils/conversions.util");

var _formatters = require("../../../../helpers/utils/formatters");

var _send2 = require("../../../../pages/send/send.utils");

var _send3 = require("../../../../pages/send/send.constants");

var _transaction = require("../../../../../shared/constants/transaction");

var _gas2 = require("../../../../../shared/constants/gas");

var _metamask = require("../../../../ducks/metamask/metamask");

var _gasModalPageContainer = _interopRequireDefault(require("./gas-modal-page-container.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const mapStateToProps = (state, ownProps) => {
  var _ownProps$transaction, _ownProps$transaction2;

  const gasLimit = (0, _send.getGasLimit)(state);
  const gasPrice = (0, _send.getGasPrice)(state);
  const amount = (0, _send.getSendAmount)(state);
  const {
    currentNetworkTxList
  } = state.metamask;
  const {
    modalState: {
      props: modalProps
    } = {}
  } = state.appState.modal || {};
  const {
    txData = {}
  } = modalProps || {};
  const {
    transaction = {},
    onSubmit
  } = ownProps;
  const selectedTransaction = currentNetworkTxList.find(({
    id
  }) => id === (transaction.id || txData.id));
  const buttonDataLoading = (0, _selectors.getBasicGasEstimateLoadingStatus)(state);
  const asset = (0, _send.getSendAsset)(state); // a "default" txParams is used during the send flow, since the transaction doesn't exist yet in that case

  const txParams = selectedTransaction !== null && selectedTransaction !== void 0 && selectedTransaction.txParams ? selectedTransaction.txParams : {
    gas: gasLimit || _gas2.GAS_LIMITS.SIMPLE,
    gasPrice: gasPrice || (0, _selectors.getAveragePriceEstimateInHexWEI)(state, true),
    value: asset.type === _send.ASSET_TYPES.TOKEN ? '0x0' : amount
  };
  const {
    gasPrice: currentGasPrice,
    gas: currentGasLimit
  } = txParams;
  const value = ((_ownProps$transaction = ownProps.transaction) === null || _ownProps$transaction === void 0 ? void 0 : (_ownProps$transaction2 = _ownProps$transaction.txParams) === null || _ownProps$transaction2 === void 0 ? void 0 : _ownProps$transaction2.value) || txParams.value;
  const customModalGasPriceInHex = (0, _selectors.getCustomGasPrice)(state) || currentGasPrice;

  const customModalGasLimitInHex = (0, _selectors.getCustomGasLimit)(state) || currentGasLimit || _gas2.GAS_LIMITS.SIMPLE;

  const customGasTotal = (0, _send2.calcGasTotal)(customModalGasLimitInHex, customModalGasPriceInHex);
  const gasButtonInfo = (0, _selectors.getRenderableBasicEstimateData)(state, customModalGasLimitInHex);
  const currentCurrency = (0, _selectors.getCurrentCurrency)(state);
  const conversionRate = (0, _selectors.conversionRateSelector)(state);
  const newTotalFiat = (0, _conversions.sumHexWEIsToRenderableFiat)([value, customGasTotal], currentCurrency, conversionRate);
  const {
    hideBasic
  } = state.appState.modal.modalState.props;
  const customGasPrice = calcCustomGasPrice(customModalGasPriceInHex);
  const maxModeOn = (0, _send.getSendMaxModeState)(state);
  const balance = (0, _selectors.getCurrentEthBalance)(state);
  const isMainnet = (0, _selectors.getIsMainnet)(state);
  const isTestnet = (0, _selectors.getIsTestnet)(state);
  const showFiat = (0, _selectors.getShouldShowFiat)(state);
  const newTotalEth = maxModeOn && asset.type === _send.ASSET_TYPES.NATIVE ? sumHexWEIsToRenderableEth([balance, '0x0']) : sumHexWEIsToRenderableEth([value, customGasTotal]);
  const sendAmount = maxModeOn && asset.type === _send.ASSET_TYPES.NATIVE ? subtractHexWEIsFromRenderableEth(balance, customGasTotal) : sumHexWEIsToRenderableEth([value, '0x0']);
  const insufficientBalance = maxModeOn ? false : !(0, _send2.isBalanceSufficient)({
    amount: value,
    gasTotal: customGasTotal,
    balance,
    conversionRate
  });
  const isGasEstimate = (0, _selectors.getIsGasEstimatesFetched)(state);
  const customNetworkEstimateWasFetched = (0, _selectors.getIsCustomNetworkGasPriceFetched)(state);
  let customPriceIsSafe = true;

  if ((isMainnet || false) && isGasEstimate) {
    customPriceIsSafe = (0, _selectors.isCustomPriceSafe)(state);
  } else if (!(isMainnet || false || isTestnet) && customNetworkEstimateWasFetched) {
    customPriceIsSafe = (0, _selectors.isCustomPriceSafeForCustomNetwork)(state);
  }

  return {
    hideBasic,
    isConfirm: isConfirm(state),
    customModalGasPriceInHex,
    customModalGasLimitInHex,
    customGasPrice,
    customGasLimit: calcCustomGasLimit(customModalGasLimitInHex),
    customGasTotal,
    newTotalFiat,
    customPriceIsSafe,
    customPriceIsExcessive: (0, _selectors.isCustomPriceExcessive)(state),
    maxModeOn,
    gasPriceButtonGroupProps: {
      buttonDataLoading,
      defaultActiveButtonIndex: (0, _selectors.getDefaultActiveButtonIndex)(gasButtonInfo, customModalGasPriceInHex),
      gasButtonInfo
    },
    infoRowProps: {
      originalTotalFiat: (0, _conversions.sumHexWEIsToRenderableFiat)([value, customGasTotal], currentCurrency, conversionRate),
      originalTotalEth: sumHexWEIsToRenderableEth([value, customGasTotal]),
      newTotalFiat: showFiat ? newTotalFiat : '',
      newTotalEth,
      transactionFee: sumHexWEIsToRenderableEth(['0x0', customGasTotal]),
      sendAmount
    },
    transaction: txData || transaction,
    isSpeedUp: transaction.status === _transaction.TRANSACTION_STATUSES.SUBMITTED,
    isRetry: transaction.status === _transaction.TRANSACTION_STATUSES.FAILED,
    txId: transaction.id,
    insufficientBalance,
    isMainnet,
    balance,
    conversionRate,
    value,
    onSubmit
  };
};

const mapDispatchToProps = dispatch => {
  const updateCustomGasPrice = newPrice => dispatch((0, _gas.setCustomGasPrice)((0, _util.addHexPrefix)(newPrice)));

  return {
    cancelAndClose: () => {
      dispatch((0, _gas.resetCustomData)());
      dispatch((0, _actions.hideModal)());
    },
    hideModal: () => dispatch((0, _actions.hideModal)()),
    useCustomGas: () => dispatch((0, _send.useCustomGas)()),
    updateTransactionGasFees: gasFees => {
      dispatch((0, _metamask.updateTransactionGasFees)(_objectSpread(_objectSpread({}, gasFees), {}, {
        expectHexWei: true
      })));
    },
    updateCustomGasPrice,
    updateCustomGasLimit: newLimit => dispatch((0, _gas.setCustomGasLimit)((0, _util.addHexPrefix)(newLimit))),
    setGasData: (newLimit, newPrice) => {
      dispatch((0, _send.updateGasLimit)(newLimit));
      dispatch((0, _send.updateGasPrice)(newPrice));
    },
    createRetryTransaction: (txId, customGasSettings) => {
      return dispatch((0, _actions.createRetryTransaction)(txId, customGasSettings));
    },
    createSpeedUpTransaction: (txId, customGasSettings) => {
      return dispatch((0, _actions.createSpeedUpTransaction)(txId, customGasSettings));
    }
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    gasPriceButtonGroupProps,
    // eslint-disable-next-line no-shadow
    isConfirm,
    txId,
    isSpeedUp,
    isRetry,
    insufficientBalance,
    customGasPrice,
    customGasLimit,
    transaction
  } = stateProps;
  const {
    useCustomGas: dispatchUseCustomGas,
    setGasData: dispatchSetGasData,
    createSpeedUpTransaction: dispatchCreateSpeedUpTransaction,
    createRetryTransaction: dispatchCreateRetryTransaction,
    updateTransactionGasFees: dispatchUpdateTransactionGasFees,
    cancelAndClose: dispatchCancelAndClose,
    hideModal: dispatchHideModal
  } = dispatchProps,
        otherDispatchProps = (0, _objectWithoutProperties2.default)(dispatchProps, ["useCustomGas", "setGasData", "createSpeedUpTransaction", "createRetryTransaction", "updateTransactionGasFees", "cancelAndClose", "hideModal"]);
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, stateProps), otherDispatchProps), ownProps), {}, {
    onSubmit: (gasLimit, gasPrice) => {
      if (ownProps.onSubmit) {
        dispatchCancelAndClose();
        ownProps.onSubmit({
          gasLimit,
          gasPrice
        });
        return;
      }

      if (isConfirm) {
        dispatchUpdateTransactionGasFees({
          gasLimit,
          gasPrice,
          transaction,
          isModal: true
        });
        dispatchHideModal();
        dispatchCancelAndClose();
      } else if (isSpeedUp) {
        dispatchCreateSpeedUpTransaction(txId, {
          gasPrice,
          gasLimit
        });
        dispatchCancelAndClose();
      } else if (isRetry) {
        dispatchCreateRetryTransaction(txId, {
          gasPrice,
          gasLimit
        });
        dispatchCancelAndClose();
      } else {
        dispatchSetGasData(gasLimit, gasPrice);
        dispatchUseCustomGas();
        dispatchCancelAndClose();
      }
    },
    gasPriceButtonGroupProps: _objectSpread(_objectSpread({}, gasPriceButtonGroupProps), {}, {
      handleGasPriceSelection: ({
        gasPrice
      }) => otherDispatchProps.updateCustomGasPrice(gasPrice)
    }),
    cancelAndClose: () => {
      dispatchCancelAndClose();
    },
    disableSave: insufficientBalance || isSpeedUp && customGasPrice === 0 || customGasLimit < Number(_send3.MIN_GAS_LIMIT_DEC)
  });
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(_gasModalPageContainer.default);

exports.default = _default;

function isConfirm(state) {
  return Boolean(Object.keys(state.confirmTransaction.txData).length);
}

function calcCustomGasPrice(customGasPriceInHex) {
  return Number((0, _conversions.hexWEIToDecGWEI)(customGasPriceInHex));
}

function calcCustomGasLimit(customGasLimitInHex) {
  return parseInt(customGasLimitInHex, 16);
}

function sumHexWEIsToRenderableEth(hexWEIs) {
  const hexWEIsSum = hexWEIs.filter(Boolean).reduce(_conversions.addHexes);
  return (0, _formatters.formatETHFee)((0, _conversions.getValueFromWeiHex)({
    value: hexWEIsSum,
    toCurrency: 'ETH',
    numberOfDecimals: 6
  }));
}

function subtractHexWEIsFromRenderableEth(aHexWEI, bHexWEI) {
  return (0, _formatters.formatETHFee)((0, _conversions.subtractHexWEIsToDec)(aHexWEI, bHexWEI));
}

//# sourceMappingURL=ui/components/app/gas-customization/gas-modal-page-container/gas-modal-page-container.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/gas-customization/gas-modal-page-container/gas-modal-page-container.container.js",}],
[4315, {"../../../ducks/metamask/metamask":3985,"../../../ducks/swaps/swaps":3988,"../../../helpers/utils/conversions.util":4009,"../../../helpers/utils/formatters":4011,"../../../selectors":4326,"../../../store/actions":4331,"../../send/send.utils":4228,"./swaps-gas-customization-modal.component":4314,"@babel/runtime/helpers/interopRequireDefault":186,"bignumber.js":1351,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _metamask = require("../../../ducks/metamask/metamask");

var _swaps = require("../../../ducks/swaps/swaps");

var _conversions = require("../../../helpers/utils/conversions.util");

var _formatters = require("../../../helpers/utils/formatters");

var _send = require("../../send/send.utils");

var _swapsGasCustomizationModal = _interopRequireDefault(require("./swaps-gas-customization-modal.component"));

const mapStateToProps = state => {
  const currentCurrency = (0, _selectors.getCurrentCurrency)(state);
  const conversionRate = (0, _selectors.conversionRateSelector)(state);
  const nativeCurrencySymbol = (0, _metamask.getNativeCurrency)(state);
  const {
    symbol: swapsDefaultCurrencySymbol
  } = (0, _selectors.getSwapsDefaultToken)(state);
  const usedCurrencySymbol = nativeCurrencySymbol || swapsDefaultCurrencySymbol;
  const {
    modalState: {
      props: modalProps
    } = {}
  } = state.appState.modal || {};
  const {
    value,
    customGasLimitMessage = '',
    customTotalSupplement = '',
    extraInfoRow = null,
    initialGasPrice,
    initialGasLimit,
    minimumGasLimit
  } = modalProps;
  const buttonDataLoading = (0, _swaps.swapGasPriceEstimateIsLoading)(state);
  const swapsCustomizationModalPrice = (0, _swaps.getSwapsCustomizationModalPrice)(state);
  const swapsCustomizationModalLimit = (0, _swaps.getSwapsCustomizationModalLimit)(state);
  const customGasPrice = swapsCustomizationModalPrice || initialGasPrice;
  const customGasLimit = swapsCustomizationModalLimit || initialGasLimit;
  const customGasTotal = (0, _send.calcGasTotal)(customGasLimit, customGasPrice);
  const gasEstimates = (0, _swaps.getSwapGasPriceEstimateData)(state);
  const gasEstimatesInNewFormat = {
    low: gasEstimates.safeLow,
    medium: gasEstimates.average,
    high: gasEstimates.fast
  };
  const {
    averageEstimateData,
    fastEstimateData
  } = (0, _selectors.getRenderableGasButtonData)(gasEstimatesInNewFormat, customGasLimit, true, conversionRate, currentCurrency, usedCurrencySymbol);
  const gasButtonInfo = [averageEstimateData, fastEstimateData];
  const newTotalFiat = (0, _conversions.sumHexWEIsToRenderableFiat)([value, customGasTotal, customTotalSupplement], currentCurrency, conversionRate);
  const balance = (0, _selectors.getCurrentEthBalance)(state);
  const newTotalEth = sumHexWEIsToRenderableEth([value, customGasTotal, customTotalSupplement], usedCurrencySymbol);
  const sendAmount = sumHexWEIsToRenderableEth([value, '0x0'], usedCurrencySymbol);
  const insufficientBalance = !(0, _send.isBalanceSufficient)({
    amount: value,
    gasTotal: customGasTotal,
    balance,
    conversionRate
  });
  const customGasLimitTooLow = new _bignumber.default(customGasLimit, 16).lt(minimumGasLimit, 10);
  return {
    customGasPrice,
    customGasLimit,
    showCustomPriceTooLowWarning: (0, _swaps.shouldShowCustomPriceTooLowWarning)(state),
    gasPriceButtonGroupProps: {
      buttonDataLoading,
      defaultActiveButtonIndex: (0, _selectors.getDefaultActiveButtonIndex)(gasButtonInfo, customGasPrice),
      gasButtonInfo
    },
    infoRowProps: {
      originalTotalFiat: (0, _conversions.sumHexWEIsToRenderableFiat)([value, customGasTotal, customTotalSupplement], currentCurrency, conversionRate),
      originalTotalEth: sumHexWEIsToRenderableEth([value, customGasTotal, customTotalSupplement], usedCurrencySymbol),
      newTotalFiat,
      newTotalEth,
      transactionFee: sumHexWEIsToRenderableEth(['0x0', customGasTotal], usedCurrencySymbol),
      sendAmount,
      extraInfoRow
    },
    gasEstimateLoadingHasFailed: (0, _swaps.swapGasEstimateLoadingHasFailed)(state),
    insufficientBalance,
    customGasLimitMessage,
    customTotalSupplement,
    usdConversionRate: (0, _selectors.getUSDConversionRate)(state),
    disableSave: insufficientBalance || customGasLimitTooLow,
    minimumGasLimit
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cancelAndClose: () => {
      dispatch((0, _swaps.swapCustomGasModalClosed)());
      dispatch((0, _actions.hideModal)());
    },
    onSubmit: async (gasLimit, gasPrice) => {
      await dispatch((0, _actions.customSwapsGasParamsUpdated)(gasLimit, gasPrice));
      dispatch((0, _swaps.swapCustomGasModalClosed)());
      dispatch((0, _actions.hideModal)());
    },
    setSwapsCustomizationModalPrice: newPrice => {
      dispatch((0, _swaps.swapCustomGasModalPriceEdited)(newPrice));
    },
    setSwapsCustomizationModalLimit: newLimit => {
      dispatch((0, _swaps.swapCustomGasModalLimitEdited)(newLimit));
    }
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_swapsGasCustomizationModal.default);

exports.default = _default;

function sumHexWEIsToRenderableEth(hexWEIs, currencySymbol = 'ETH') {
  const hexWEIsSum = hexWEIs.filter(Boolean).reduce(_conversions.addHexes);
  return (0, _formatters.formatETHFee)((0, _conversions.getValueFromWeiHex)({
    value: hexWEIsSum,
    fromCurrency: currencySymbol,
    toCurrency: currencySymbol,
    numberOfDecimals: 6
  }), currencySymbol);
}

//# sourceMappingURL=ui/pages/swaps/swaps-gas-customization-modal/swaps-gas-customization-modal.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/swaps-gas-customization-modal/swaps-gas-customization-modal.container.js",}],
[4132, {"./first-time-flow-switch.container":4131,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _firstTimeFlowSwitch.default;
  }
});

var _firstTimeFlowSwitch = _interopRequireDefault(require("./first-time-flow-switch.container"));

//# sourceMappingURL=ui/pages/first-time-flow/first-time-flow-switch/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/first-time-flow-switch/index.js",}],
[4136, {"./metametrics-opt-in.container":4138,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _metametricsOptIn.default;
  }
});

var _metametricsOptIn = _interopRequireDefault(require("./metametrics-opt-in.container"));

//# sourceMappingURL=ui/pages/first-time-flow/metametrics-opt-in/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/metametrics-opt-in/index.js",}],
[4151, {"./select-action.container":4153,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _selectAction.default;
  }
});

var _selectAction = _interopRequireDefault(require("./select-action.container"));

//# sourceMappingURL=ui/pages/first-time-flow/select-action/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/select-action/index.js",}],
[4155, {"./welcome.container":4158,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _welcome.default;
  }
});

var _welcome = _interopRequireDefault(require("./welcome.container"));

//# sourceMappingURL=ui/pages/first-time-flow/welcome/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/welcome/index.js",}],
[4129, {"./end-of-flow.container":4128,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _endOfFlow.default;
  }
});

var _endOfFlow = _interopRequireDefault(require("./end-of-flow.container"));

//# sourceMappingURL=ui/pages/first-time-flow/end-of-flow/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/end-of-flow/index.js",}],
[4124, {"./create-password.container":4120,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _createPassword.default;
  }
});

var _createPassword = _interopRequireDefault(require("./create-password.container"));

//# sourceMappingURL=ui/pages/first-time-flow/create-password/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/create-password/index.js",}],
[4144, {"./seed-phrase.component":4150,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _seedPhrase.default;
  }
});

var _seedPhrase = _interopRequireDefault(require("./seed-phrase.component"));

//# sourceMappingURL=ui/pages/first-time-flow/seed-phrase/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/seed-phrase/index.js",}],
[1881, {}, function (require, module, exports) {
/*!
 * Fuse.js v3.6.1 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Fuse",[],t):"object"==typeof exports?exports.Fuse=t():e.Fuse=t()}(this,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var i=r(1),a=r(7),s=a.get,c=(a.deepValue,a.isArray),h=function(){function e(t,r){var n=r.location,o=void 0===n?0:n,i=r.distance,a=void 0===i?100:i,c=r.threshold,h=void 0===c?.6:c,l=r.maxPatternLength,u=void 0===l?32:l,f=r.caseSensitive,v=void 0!==f&&f,p=r.tokenSeparator,d=void 0===p?/ +/g:p,g=r.findAllMatches,y=void 0!==g&&g,m=r.minMatchCharLength,k=void 0===m?1:m,b=r.id,S=void 0===b?null:b,x=r.keys,M=void 0===x?[]:x,_=r.shouldSort,w=void 0===_||_,L=r.getFn,A=void 0===L?s:L,O=r.sortFn,C=void 0===O?function(e,t){return e.score-t.score}:O,j=r.tokenize,P=void 0!==j&&j,I=r.matchAllTokens,F=void 0!==I&&I,T=r.includeMatches,N=void 0!==T&&T,z=r.includeScore,E=void 0!==z&&z,W=r.verbose,K=void 0!==W&&W;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:a,threshold:h,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:d,findAllMatches:y,minMatchCharLength:k,id:S,keys:M,includeMatches:N,includeScore:E,shouldSort:w,getFn:A,sortFn:C,verbose:K,tokenize:P,matchAllTokens:F},this.setCollection(t),this._processKeys(M)}var t,r,a;return t=e,(r=[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"_processKeys",value:function(e){if(this._keyWeights={},this._keyNames=[],e.length&&"string"==typeof e[0])for(var t=0,r=e.length;t<r;t+=1){var n=e[t];this._keyWeights[n]=1,this._keyNames.push(n)}else{for(var o=null,i=null,a=0,s=0,c=e.length;s<c;s+=1){var h=e[s];if(!h.hasOwnProperty("name"))throw new Error('Missing "name" property in key object');var l=h.name;if(this._keyNames.push(l),!h.hasOwnProperty("weight"))throw new Error('Missing "weight" property in key object');var u=h.weight;if(u<0||u>1)throw new Error('"weight" property in key must bein the range of [0, 1)');i=null==i?u:Math.max(i,u),o=null==o?u:Math.min(o,u),this._keyWeights[l]=u,a+=u}if(a>1)throw new Error("Total of weights cannot exceed 1")}}},{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{limit:!1};this._log('---------\nSearch pattern: "'.concat(e,'"'));var r=this._prepareSearchers(e),n=r.tokenSearchers,o=r.fullSearcher,i=this._search(n,o);return this._computeScore(i),this.options.shouldSort&&this._sort(i),t.limit&&"number"==typeof t.limit&&(i=i.slice(0,t.limit)),this._format(i)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var r=e.split(this.options.tokenSeparator),n=0,o=r.length;n<o;n+=1)t.push(new i(r[n],this.options));return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}},{key:"_search",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0,r=this.list,n={},o=[];if("string"==typeof r[0]){for(var i=0,a=r.length;i<a;i+=1)this._analyze({key:"",value:r[i],record:i,index:i},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t});return o}for(var s=0,c=r.length;s<c;s+=1)for(var h=r[s],l=0,u=this._keyNames.length;l<u;l+=1){var f=this._keyNames[l];this._analyze({key:f,value:this.options.getFn(h,f),record:h,index:s},{resultMap:n,results:o,tokenSearchers:e,fullSearcher:t})}return o}},{key:"_analyze",value:function(e,t){var r=this,n=e.key,o=e.arrayIndex,i=void 0===o?-1:o,a=e.value,s=e.record,h=e.index,l=t.tokenSearchers,u=void 0===l?[]:l,f=t.fullSearcher,v=t.resultMap,p=void 0===v?{}:v,d=t.results,g=void 0===d?[]:d;!function e(t,o,i,a){if(null!=o)if("string"==typeof o){var s=!1,h=-1,l=0;r._log("\nKey: ".concat(""===n?"--":n));var v=f.search(o);if(r._log('Full text: "'.concat(o,'", score: ').concat(v.score)),r.options.tokenize){for(var d=o.split(r.options.tokenSeparator),y=d.length,m=[],k=0,b=u.length;k<b;k+=1){var S=u[k];r._log('\nPattern: "'.concat(S.pattern,'"'));for(var x=!1,M=0;M<y;M+=1){var _=d[M],w=S.search(_),L={};w.isMatch?(L[_]=w.score,s=!0,x=!0,m.push(w.score)):(L[_]=1,r.options.matchAllTokens||m.push(1)),r._log('Token: "'.concat(_,'", score: ').concat(L[_]))}x&&(l+=1)}h=m[0];for(var A=m.length,O=1;O<A;O+=1)h+=m[O];h/=A,r._log("Token score average:",h)}var C=v.score;h>-1&&(C=(C+h)/2),r._log("Score average:",C);var j=!r.options.tokenize||!r.options.matchAllTokens||l>=u.length;if(r._log("\nCheck Matches: ".concat(j)),(s||v.isMatch)&&j){var P={key:n,arrayIndex:t,value:o,score:C};r.options.includeMatches&&(P.matchedIndices=v.matchedIndices);var I=p[a];I?I.output.push(P):(p[a]={item:i,output:[P]},g.push(p[a]))}}else if(c(o))for(var F=0,T=o.length;F<T;F+=1)e(F,o[F],i,a)}(i,a,s,h)}},{key:"_computeScore",value:function(e){this._log("\n\nComputing score:\n");for(var t=this._keyWeights,r=!!Object.keys(t).length,n=0,o=e.length;n<o;n+=1){for(var i=e[n],a=i.output,s=a.length,c=1,h=0;h<s;h+=1){var l=a[h],u=l.key,f=r?t[u]:1,v=0===l.score&&t&&t[u]>0?Number.EPSILON:l.score;c*=Math.pow(v,f)}i.score=c,this._log(i)}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];if(this.options.verbose){var r=[];this._log("\n\nOutput:\n\n",JSON.stringify(e,function(e,t){if("object"===n(t)&&null!==t){if(-1!==r.indexOf(t))return;r.push(t)}return t},2)),r=null}var o=[];this.options.includeMatches&&o.push(function(e,t){var r=e.output;t.matches=[];for(var n=0,o=r.length;n<o;n+=1){var i=r[n];if(0!==i.matchedIndices.length){var a={indices:i.matchedIndices,value:i.value};i.key&&(a.key=i.key),i.hasOwnProperty("arrayIndex")&&i.arrayIndex>-1&&(a.arrayIndex=i.arrayIndex),t.matches.push(a)}}}),this.options.includeScore&&o.push(function(e,t){t.score=e.score});for(var i=0,a=e.length;i<a;i+=1){var s=e[i];if(this.options.id&&(s.item=this.options.getFn(s.item,this.options.id)[0]),o.length){for(var c={item:s.item},h=0,l=o.length;h<l;h+=1)o[h](s,c);t.push(c)}else t.push(s.item)}return t}},{key:"_log",value:function(){var e;this.options.verbose&&(e=console).log.apply(e,arguments)}}])&&o(t.prototype,r),a&&o(t,a),e}();e.exports=h},function(e,t,r){function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var o=r(2),i=r(3),a=r(6),s=function(){function e(t,r){var n=r.location,o=void 0===n?0:n,i=r.distance,s=void 0===i?100:i,c=r.threshold,h=void 0===c?.6:c,l=r.maxPatternLength,u=void 0===l?32:l,f=r.isCaseSensitive,v=void 0!==f&&f,p=r.tokenSeparator,d=void 0===p?/ +/g:p,g=r.findAllMatches,y=void 0!==g&&g,m=r.minMatchCharLength,k=void 0===m?1:m,b=r.includeMatches,S=void 0!==b&&b;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:s,threshold:h,maxPatternLength:u,isCaseSensitive:v,tokenSeparator:d,findAllMatches:y,includeMatches:S,minMatchCharLength:k},this.pattern=v?t:t.toLowerCase(),this.pattern.length<=u&&(this.patternAlphabet=a(this.pattern))}var t,r,s;return t=e,(r=[{key:"search",value:function(e){var t=this.options,r=t.isCaseSensitive,n=t.includeMatches;if(r||(e=e.toLowerCase()),this.pattern===e){var a={isMatch:!0,score:0};return n&&(a.matchedIndices=[[0,e.length-1]]),a}var s=this.options,c=s.maxPatternLength,h=s.tokenSeparator;if(this.pattern.length>c)return o(e,this.pattern,h);var l=this.options,u=l.location,f=l.distance,v=l.threshold,p=l.findAllMatches,d=l.minMatchCharLength;return i(e,this.pattern,this.patternAlphabet,{location:u,distance:f,threshold:v,findAllMatches:p,minMatchCharLength:d,includeMatches:n})}}])&&n(t.prototype,r),s&&n(t,s),e}();e.exports=s},function(e,t){var r=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;e.exports=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,o=new RegExp(t.replace(r,"\\$&").replace(n,"|")),i=e.match(o),a=!!i,s=[];if(a)for(var c=0,h=i.length;c<h;c+=1){var l=i[c];s.push([e.indexOf(l),l.length-1])}return{score:a?.5:1,isMatch:a,matchedIndices:s}}},function(e,t,r){var n=r(4),o=r(5);e.exports=function(e,t,r,i){for(var a=i.location,s=void 0===a?0:a,c=i.distance,h=void 0===c?100:c,l=i.threshold,u=void 0===l?.6:l,f=i.findAllMatches,v=void 0!==f&&f,p=i.minMatchCharLength,d=void 0===p?1:p,g=i.includeMatches,y=void 0!==g&&g,m=s,k=e.length,b=u,S=e.indexOf(t,m),x=t.length,M=[],_=0;_<k;_+=1)M[_]=0;if(-1!==S){var w=n(t,{errors:0,currentLocation:S,expectedLocation:m,distance:h});if(b=Math.min(w,b),-1!==(S=e.lastIndexOf(t,m+x))){var L=n(t,{errors:0,currentLocation:S,expectedLocation:m,distance:h});b=Math.min(L,b)}}S=-1;for(var A=[],O=1,C=x+k,j=1<<(x<=31?x-1:30),P=0;P<x;P+=1){for(var I=0,F=C;I<F;){n(t,{errors:P,currentLocation:m+F,expectedLocation:m,distance:h})<=b?I=F:C=F,F=Math.floor((C-I)/2+I)}C=F;var T=Math.max(1,m-F+1),N=v?k:Math.min(m+F,k)+x,z=Array(N+2);z[N+1]=(1<<P)-1;for(var E=N;E>=T;E-=1){var W=E-1,K=r[e.charAt(W)];if(K&&(M[W]=1),z[E]=(z[E+1]<<1|1)&K,0!==P&&(z[E]|=(A[E+1]|A[E])<<1|1|A[E+1]),z[E]&j&&(O=n(t,{errors:P,currentLocation:W,expectedLocation:m,distance:h}))<=b){if(b=O,(S=W)<=m)break;T=Math.max(1,2*m-S)}}if(n(t,{errors:P+1,currentLocation:m,expectedLocation:m,distance:h})>b)break;A=z}var $={isMatch:S>=0,score:0===O?.001:O};return y&&($.matchedIndices=o(M,d)),$}},function(e,t){e.exports=function(e,t){var r=t.errors,n=void 0===r?0:r,o=t.currentLocation,i=void 0===o?0:o,a=t.expectedLocation,s=void 0===a?0:a,c=t.distance,h=void 0===c?100:c,l=n/e.length,u=Math.abs(s-i);return h?l+u/h:u?1:l}},function(e,t){e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=[],n=-1,o=-1,i=0,a=e.length;i<a;i+=1){var s=e[i];s&&-1===n?n=i:s||-1===n||((o=i-1)-n+1>=t&&r.push([n,o]),n=-1)}return e[i-1]&&i-n>=t&&r.push([n,i-1]),r}},function(e,t){e.exports=function(e){for(var t={},r=e.length,n=0;n<r;n+=1)t[e.charAt(n)]=0;for(var o=0;o<r;o+=1)t[e.charAt(o)]|=1<<r-o-1;return t}},function(e,t){var r=function(e){return Array.isArray?Array.isArray(e):"[object Array]"===Object.prototype.toString.call(e)},n=function(e){return null==e?"":function(e){if("string"==typeof e)return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t}(e)},o=function(e){return"string"==typeof e},i=function(e){return"number"==typeof e};e.exports={get:function(e,t){var a=[];return function e(t,s){if(s){var c=s.indexOf("."),h=s,l=null;-1!==c&&(h=s.slice(0,c),l=s.slice(c+1));var u=t[h];if(null!=u)if(l||!o(u)&&!i(u))if(r(u))for(var f=0,v=u.length;f<v;f+=1)e(u[f],l);else l&&e(u,l);else a.push(n(u))}else a.push(t)}(e,t),a},isArray:r,isString:o,isNum:i,toString:n}}])});
//# sourceMappingURL=node_modules/fuse.js/dist/fuse.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/fuse.js/dist/fuse.js",}],
[3934, {"./search-icon.component":3935,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _searchIcon.default;
  }
});

var _searchIcon = _interopRequireDefault(require("./search-icon.component"));

//# sourceMappingURL=ui/components/ui/search-icon/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/search-icon/index.js",}],
[3820, {"./user-preferenced-currency-display.component":3821,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _userPreferencedCurrencyDisplay.default;
  }
});

var _userPreferencedCurrencyDisplay = _interopRequireDefault(require("./user-preferenced-currency-display.component"));

//# sourceMappingURL=ui/components/app/user-preferenced-currency-display/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/user-preferenced-currency-display/index.js",}],
[554, {"./InputAdornment":553,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _InputAdornment.default;
  }
});

var _InputAdornment = _interopRequireDefault(require("./InputAdornment"));
//# sourceMappingURL=node_modules/@material-ui/core/InputAdornment/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/InputAdornment/index.js",}],
[679, {"./TextField":678,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _TextField.default;
  }
});

var _TextField = _interopRequireDefault(require("./TextField"));
//# sourceMappingURL=node_modules/@material-ui/core/TextField/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/TextField/index.js",}],
[754, {"./colorManipulator":743,"./createMuiStrictModeTheme":746,"./createMuiTheme":747,"./createStyles":750,"./makeStyles":755,"./responsiveFontSizes":756,"./styled":759,"./transitions":760,"./useTheme":761,"./withStyles":762,"./withTheme":763,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/styles":809}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createMuiTheme: true,
  unstable_createMuiStrictModeTheme: true,
  createStyles: true,
  makeStyles: true,
  responsiveFontSizes: true,
  styled: true,
  useTheme: true,
  withStyles: true,
  withTheme: true,
  createGenerateClassName: true,
  jssPreset: true,
  ServerStyleSheets: true,
  StylesProvider: true,
  MuiThemeProvider: true,
  ThemeProvider: true
};
Object.defineProperty(exports, "createMuiTheme", {
  enumerable: true,
  get: function get() {
    return _createMuiTheme.default;
  }
});
Object.defineProperty(exports, "unstable_createMuiStrictModeTheme", {
  enumerable: true,
  get: function get() {
    return _createMuiStrictModeTheme.default;
  }
});
Object.defineProperty(exports, "createStyles", {
  enumerable: true,
  get: function get() {
    return _createStyles.default;
  }
});
Object.defineProperty(exports, "makeStyles", {
  enumerable: true,
  get: function get() {
    return _makeStyles.default;
  }
});
Object.defineProperty(exports, "responsiveFontSizes", {
  enumerable: true,
  get: function get() {
    return _responsiveFontSizes.default;
  }
});
Object.defineProperty(exports, "styled", {
  enumerable: true,
  get: function get() {
    return _styled.default;
  }
});
Object.defineProperty(exports, "useTheme", {
  enumerable: true,
  get: function get() {
    return _useTheme.default;
  }
});
Object.defineProperty(exports, "withStyles", {
  enumerable: true,
  get: function get() {
    return _withStyles.default;
  }
});
Object.defineProperty(exports, "withTheme", {
  enumerable: true,
  get: function get() {
    return _withTheme.default;
  }
});
Object.defineProperty(exports, "createGenerateClassName", {
  enumerable: true,
  get: function get() {
    return _styles.createGenerateClassName;
  }
});
Object.defineProperty(exports, "jssPreset", {
  enumerable: true,
  get: function get() {
    return _styles.jssPreset;
  }
});
Object.defineProperty(exports, "ServerStyleSheets", {
  enumerable: true,
  get: function get() {
    return _styles.ServerStyleSheets;
  }
});
Object.defineProperty(exports, "StylesProvider", {
  enumerable: true,
  get: function get() {
    return _styles.StylesProvider;
  }
});
Object.defineProperty(exports, "MuiThemeProvider", {
  enumerable: true,
  get: function get() {
    return _styles.ThemeProvider;
  }
});
Object.defineProperty(exports, "ThemeProvider", {
  enumerable: true,
  get: function get() {
    return _styles.ThemeProvider;
  }
});

var _colorManipulator = require("./colorManipulator");

Object.keys(_colorManipulator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _colorManipulator[key];
    }
  });
});

var _createMuiTheme = _interopRequireDefault(require("./createMuiTheme"));

var _createMuiStrictModeTheme = _interopRequireDefault(require("./createMuiStrictModeTheme"));

var _createStyles = _interopRequireDefault(require("./createStyles"));

var _makeStyles = _interopRequireDefault(require("./makeStyles"));

var _responsiveFontSizes = _interopRequireDefault(require("./responsiveFontSizes"));

var _styled = _interopRequireDefault(require("./styled"));

var _transitions = require("./transitions");

Object.keys(_transitions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _transitions[key];
    }
  });
});

var _useTheme = _interopRequireDefault(require("./useTheme"));

var _withStyles = _interopRequireDefault(require("./withStyles"));

var _withTheme = _interopRequireDefault(require("./withTheme"));

var _styles = require("@material-ui/styles");
//# sourceMappingURL=node_modules/@material-ui/core/styles/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/index.js",}],
[4225, {"../../../components/ui/page-container/page-container-header":3922,"../../../ducks/history/history":3982,"../../../ducks/send":3986,"../../../hooks/useI18nContext":4030,"@babel/runtime/helpers/interopRequireDefault":186,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SendHeader;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _reactRedux = require("react-redux");

var _pageContainerHeader = _interopRequireDefault(require("../../../components/ui/page-container/page-container-header"));

var _history = require("../../../ducks/history/history");

var _useI18nContext = require("../../../hooks/useI18nContext");

var _send = require("../../../ducks/send");

function SendHeader() {
  const history = (0, _reactRouterDom.useHistory)();
  const mostRecentOverviewPage = (0, _reactRedux.useSelector)(_history.getMostRecentOverviewPage);
  const dispatch = (0, _reactRedux.useDispatch)();
  const stage = (0, _reactRedux.useSelector)(_send.getSendStage);
  const asset = (0, _reactRedux.useSelector)(_send.getSendAsset);
  const t = (0, _useI18nContext.useI18nContext)();

  const onClose = () => {
    dispatch((0, _send.resetSendState)());
    history.push(mostRecentOverviewPage);
  };

  let title = asset.type === _send.ASSET_TYPES.NATIVE ? t('send') : t('sendTokens');

  if (stage === _send.SEND_STAGES.ADD_RECIPIENT || stage === _send.SEND_STAGES.INACTIVE) {
    title = t('sendTo');
  } else if (stage === _send.SEND_STAGES.EDIT) {
    title = t('edit');
  }

  return /*#__PURE__*/_react.default.createElement(_pageContainerHeader.default, {
    className: "send__header",
    onClose: onClose,
    title: title,
    headerCloseText: stage === _send.SEND_STAGES.EDIT ? t('cancelEdit') : t('cancel')
  });
}

//# sourceMappingURL=ui/pages/send/send-header/send-header.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-header/send-header.component.js",}],
[4223, {"../../../../app/scripts/lib/util":78,"../../../ducks/history/history":3982,"../../../ducks/metamask/metamask":3985,"../../../ducks/send":3986,"../../../selectors":4326,"../../../store/actions":4331,"./send-footer.component":4222,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _send = require("../../../ducks/send");

var _history = require("../../../ducks/history/history");

var _util = require("../../../../app/scripts/lib/util");

var _metamask = require("../../../ducks/metamask/metamask");

var _sendFooter = _interopRequireDefault(require("./send-footer.component"));

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_sendFooter.default);

exports.default = _default;

function addressIsNew(toAccounts, newAddress) {
  const newAddressNormalized = newAddress.toLowerCase();
  const foundMatching = toAccounts.some(({
    address
  }) => address.toLowerCase() === newAddressNormalized);
  return !foundMatching;
}

function mapStateToProps(state) {
  const gasButtonInfo = (0, _selectors.getRenderableEstimateDataForSmallButtonsFromGWEI)(state);
  const gasPrice = (0, _send.getGasPrice)(state);
  const activeButtonIndex = (0, _selectors.getDefaultActiveButtonIndex)(gasButtonInfo, gasPrice);
  const gasEstimateType = activeButtonIndex >= 0 ? gasButtonInfo[activeButtonIndex].gasEstimateType : 'custom';
  return {
    disabled: (0, _send.isSendFormInvalid)(state),
    to: (0, _send.getSendTo)(state),
    toAccounts: (0, _metamask.getSendToAccounts)(state),
    sendStage: (0, _send.getSendStage)(state),
    sendErrors: (0, _send.getSendErrors)(state),
    draftTransactionID: (0, _send.getDraftTransactionID)(state),
    gasEstimateType,
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetSendState: () => dispatch((0, _send.resetSendState)()),
    cancelTx: t => dispatch((0, _actions.cancelTx)(t)),
    sign: () => dispatch((0, _send.signTransaction)()),
    addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
      const hexPrefixedAddress = (0, _util.addHexPrefix)(newAddress);

      if (addressIsNew(toAccounts, hexPrefixedAddress)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch((0, _actions.addToAddressBook)(hexPrefixedAddress, nickname));
      }
    }
  };
}

//# sourceMappingURL=ui/pages/send/send-footer/send-footer.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-footer/send-footer.container.js",}],
[4196, {"../../../../ducks/ens":3979,"./ens-input.component":4195,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _reactRedux = require("react-redux");

var _ens = require("../../../../ducks/ens");

var _ensInput = _interopRequireDefault(require("./ens-input.component"));

function mapDispatchToProps(dispatch) {
  return {
    lookupEnsName: (0, _lodash.debounce)(ensName => dispatch((0, _ens.lookupEnsName)(ensName)), 150),
    initializeEnsSlice: () => dispatch((0, _ens.initializeEnsSlice)()),
    resetEnsResolution: (0, _lodash.debounce)(() => dispatch((0, _ens.resetEnsResolution)()), 300)
  };
}

var _default = (0, _reactRedux.connect)(null, mapDispatchToProps)(_ensInput.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/send/send-content/add-recipient/ens-input.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/add-recipient/ens-input.container.js",}],
[4194, {"../../../../ducks/ens":3979,"../../../../ducks/send":3986,"../../../../selectors":4326,"./add-recipient.component":4193,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _selectors = require("../../../../selectors");

var _send = require("../../../../ducks/send");

var _ens = require("../../../../ducks/ens");

var _addRecipient = _interopRequireDefault(require("./add-recipient.component"));

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_addRecipient.default);

exports.default = _default;

function mapStateToProps(state) {
  const ensResolution = (0, _ens.getEnsResolution)(state);
  let addressBookEntryName = '';

  if (ensResolution) {
    const addressBookEntry = (0, _selectors.getAddressBookEntry)(state, ensResolution) || {};
    addressBookEntryName = addressBookEntry.name;
  }

  const addressBook = (0, _selectors.getAddressBook)(state);
  const ownedAccounts = (0, _selectors.accountsWithSendEtherInfoSelector)(state).sort((a, b) => a.name.localeCompare(b.name));
  return {
    addressBook,
    addressBookEntryName,
    contacts: addressBook.filter(({
      name
    }) => Boolean(name)),
    ensResolution,
    ensError: (0, _ens.getEnsError)(state),
    ensWarning: (0, _ens.getEnsWarning)(state),
    nonContacts: addressBook.filter(({
      name
    }) => !name),
    ownedAccounts,
    isUsingMyAccountsForRecipientSearch: (0, _send.getIsUsingMyAccountForRecipientSearch)(state),
    userInput: (0, _send.getRecipientUserInput)(state),
    recipient: (0, _send.getRecipient)(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateRecipient: ({
      address,
      nickname
    }) => dispatch((0, _send.updateRecipient)({
      address,
      nickname
    })),
    updateRecipientUserInput: newInput => dispatch((0, _send.updateRecipientUserInput)(newInput)),
    useMyAccountsForRecipientSearch: () => dispatch((0, _send.useMyAccountsForRecipientSearch)()),
    useContactListForRecipientSearch: () => dispatch((0, _send.useContactListForRecipientSearch)())
  };
}

//# sourceMappingURL=ui/pages/send/send-content/add-recipient/add-recipient.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/add-recipient/add-recipient.container.js",}],
[4209, {"../../../ducks/send":3986,"../../../selectors":4326,"../../../store/actions":4331,"./send-content.component":4208,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@babel/runtime/helpers/objectWithoutProperties":195,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _reactRedux = require("react-redux");

var _selectors = require("../../../selectors");

var _send = require("../../../ducks/send");

var actions = _interopRequireWildcard(require("../../../store/actions"));

var _sendContent = _interopRequireDefault(require("./send-content.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function mapStateToProps(state) {
  const ownedAccounts = (0, _selectors.accountsWithSendEtherInfoSelector)(state);
  const to = (0, _send.getSendTo)(state);
  return {
    isAssetSendable: (0, _send.getIsAssetSendable)(state),
    isOwnedAccount: Boolean(ownedAccounts.find(({
      address
    }) => address.toLowerCase() === to.toLowerCase())),
    contact: (0, _selectors.getAddressBookEntry)(state, to),
    isEthGasPrice: (0, _selectors.getIsEthGasPriceFetched)(state),
    noGasPrice: (0, _selectors.getNoGasPriceFetched)(state),
    to,
    networkAndAccountSupports1559: (0, _selectors.checkNetworkAndAccountSupports1559)(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showAddToAddressBookModal: recipient => dispatch(actions.showModal({
      name: 'ADD_TO_ADDRESSBOOK',
      recipient
    }))
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const {
    to
  } = stateProps,
        restStateProps = (0, _objectWithoutProperties2.default)(stateProps, ["to"]);
  return _objectSpread(_objectSpread(_objectSpread({}, ownProps), restStateProps), {}, {
    showAddToAddressBookModal: () => dispatchProps.showAddToAddressBookModal(to)
  });
}

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(_sendContent.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/send/send-content/send-content.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/send-content.container.js",}],
[4159, {"../../hooks/useI18nContext":4030,"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _useI18nContext = require("../../hooks/useI18nContext");

const BetaHomeFooter = () => {
  const t = (0, _useI18nContext.useI18nContext)();
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("a", {
    href: "https://discord.gg/RCBhq6b6gA",
    target: "_blank",
    rel: "noopener noreferrer"
  }, t('needHelpSubmitTicket')), ' ', "|", ' ', /*#__PURE__*/_react.default.createElement("a", {
    href: "https://community.metamask.io/c/metamask-beta/30",
    target: "_blank",
    rel: "noopener noreferrer"
  }, t('needHelpFeedback')));
};

var _default = BetaHomeFooter;
exports.default = _default;

//# sourceMappingURL=ui/pages/home/beta-home-footer.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/home/beta-home-footer.component.js",}],
[3758, {"./multiple-notifications.component":3759,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _multipleNotifications.default;
  }
});

var _multipleNotifications = _interopRequireDefault(require("./multiple-notifications.component"));

//# sourceMappingURL=ui/components/app/multiple-notifications/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/multiple-notifications/index.js",}],
[3685, {"./home-notification.component":3684,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _homeNotification.default;
  }
});

var _homeNotification = _interopRequireDefault(require("./home-notification.component"));

//# sourceMappingURL=ui/components/app/home-notification/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/home-notification/index.js",}],
[3925, {"./popover.component":3926,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _popover = _interopRequireDefault(require("./popover.component"));

var _default = _popover.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/popover/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/popover/index.js",}],
[3771, {"./recovery-phrase-reminder":3772,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _recoveryPhraseReminder.default;
  }
});

var _recoveryPhraseReminder = _interopRequireDefault(require("./recovery-phrase-reminder"));

//# sourceMappingURL=ui/components/app/recovery-phrase-reminder/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/recovery-phrase-reminder/index.js",}],
[3832, {"./whats-new-popup":3833,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _whatsNewPopup.default;
  }
});

var _whatsNewPopup = _interopRequireDefault(require("./whats-new-popup"));

//# sourceMappingURL=ui/components/app/whats-new-popup/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/whats-new-popup/index.js",}],
[4106, {"./connected-sites.container":4105,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _connectedSites.default;
  }
});

var _connectedSites = _interopRequireDefault(require("./connected-sites.container"));

//# sourceMappingURL=ui/pages/connected-sites/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/connected-sites/index.js",}],
[4103, {"./connected-accounts.container":4102,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _connectedAccounts.default;
  }
});

var _connectedAccounts = _interopRequireDefault(require("./connected-accounts.container"));

//# sourceMappingURL=ui/pages/connected-accounts/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/connected-accounts/index.js",}],
[3692, {"./menu-bar":3693,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _menuBar.default;
  }
});

var _menuBar = _interopRequireDefault(require("./menu-bar"));

//# sourceMappingURL=ui/components/app/menu-bar/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/menu-bar/index.js",}],
[3629, {"./asset-list":3628,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _assetList.default;
  }
});

var _assetList = _interopRequireDefault(require("./asset-list"));

//# sourceMappingURL=ui/components/app/asset-list/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/asset-list/index.js",}],
[4083, {"./confirm-token-transaction-base.component":4081,"./confirm-token-transaction-base.container":4082,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmTokenTransactionBase.default;
  }
});
Object.defineProperty(exports, "ConfirmTokenTransactionBase", {
  enumerable: true,
  get: function () {
    return _confirmTokenTransactionBase2.default;
  }
});

var _confirmTokenTransactionBase = _interopRequireDefault(require("./confirm-token-transaction-base.container"));

var _confirmTokenTransactionBase2 = _interopRequireDefault(require("./confirm-token-transaction-base.component"));

//# sourceMappingURL=ui/pages/confirm-token-transaction-base/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-token-transaction-base/index.js",}],
[4077, {"./confirm-send-ether.container":4076,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmSendEther.default;
  }
});

var _confirmSendEther = _interopRequireDefault(require("./confirm-send-ether.container"));

//# sourceMappingURL=ui/pages/confirm-send-ether/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-send-ether/index.js",}],
[4080, {"./confirm-send-token.container":4079,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmSendToken.default;
  }
});

var _confirmSendToken = _interopRequireDefault(require("./confirm-send-token.container"));

//# sourceMappingURL=ui/pages/confirm-send-token/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-send-token/index.js",}],
[4089, {"./confirm-transaction-switch.container":4088,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _confirmTransactionSwitch = _interopRequireDefault(require("./confirm-transaction-switch.container"));

var _default = _confirmTransactionSwitch.default;
exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-transaction-switch/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-transaction-switch/index.js",}],
[4068, {"./confirm-deploy-contract.container":4067,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmDeployContract.default;
  }
});

var _confirmDeployContract = _interopRequireDefault(require("./confirm-deploy-contract.container"));

//# sourceMappingURL=ui/pages/confirm-deploy-contract/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-deploy-contract/index.js",}],
[4065, {"./confirm-decrypt-message.container":4064,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmDecryptMessage.default;
  }
});

var _confirmDecryptMessage = _interopRequireDefault(require("./confirm-decrypt-message.container"));

//# sourceMappingURL=ui/pages/confirm-decrypt-message/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-decrypt-message/index.js",}],
[4062, {"./confirm-approve":4060,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmApprove.default;
  }
});

var _confirmApprove = _interopRequireDefault(require("./confirm-approve"));

//# sourceMappingURL=ui/pages/confirm-approve/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-approve/index.js",}],
[4071, {"./confirm-encryption-public-key.container":4070,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmEncryptionPublicKey.default;
  }
});

var _confirmEncryptionPublicKey = _interopRequireDefault(require("./confirm-encryption-public-key.container"));

//# sourceMappingURL=ui/pages/confirm-encryption-public-key/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-encryption-public-key/index.js",}],
[4086, {"./confirm-transaction-base.container":4085,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _confirmTransactionBase.default;
  }
});

var _confirmTransactionBase = _interopRequireDefault(require("./confirm-transaction-base.container"));

//# sourceMappingURL=ui/pages/confirm-transaction-base/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-transaction-base/index.js",}],
[4090, {"../../../shared/constants/app":3591,"../../../shared/constants/transaction":3599,"../../components/app/signature-request":3779,"../../components/app/signature-request-original":3776,"../../components/ui/loading-screen":3906,"../../ducks/history/history":3982,"../../ducks/send":3986,"../../helpers/utils/tx-helper":4019,"../../store/actions":4331,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"loglevel":2657,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
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

var _loglevel = _interopRequireDefault(require("loglevel"));

var actions = _interopRequireWildcard(require("../../store/actions"));

var _txHelper = _interopRequireDefault(require("../../helpers/utils/tx-helper"));

var _signatureRequest = _interopRequireDefault(require("../../components/app/signature-request"));

var _signatureRequestOriginal = _interopRequireDefault(require("../../components/app/signature-request-original"));

var _loadingScreen = _interopRequireDefault(require("../../components/ui/loading-screen"));

var _history = require("../../ducks/history/history");

var _app = require("../../../shared/constants/app");

var _transaction = require("../../../shared/constants/transaction");

var _send = require("../../ducks/send");

function mapStateToProps(state) {
  const {
    metamask,
    appState
  } = state;
  const {
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount
  } = metamask;
  const {
    txId
  } = appState;
  return {
    identities: state.metamask.identities,
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    unapprovedTxs: state.metamask.unapprovedTxs,
    unapprovedMsgs: state.metamask.unapprovedMsgs,
    unapprovedPersonalMsgs: state.metamask.unapprovedPersonalMsgs,
    unapprovedTypedMessages: state.metamask.unapprovedTypedMessages,
    index: txId,
    warning: state.appState.warning,
    network: state.metamask.network,
    chainId: state.metamask.provider.chainId,
    currentCurrency: state.metamask.currentCurrency,
    blockGasLimit: state.metamask.currentBlockGasLimit,
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
    sendTo: (0, _send.getSendTo)(state),
    currentNetworkTxList: state.metamask.currentNetworkTxList
  };
}

class ConfirmTxScreen extends _react.Component {
  getUnapprovedMessagesTotal() {
    const {
      unapprovedMsgCount = 0,
      unapprovedPersonalMsgCount = 0,
      unapprovedTypedMessagesCount = 0
    } = this.props;
    return unapprovedTypedMessagesCount + unapprovedMsgCount + unapprovedPersonalMsgCount;
  }

  getTxData() {
    const {
      network,
      index,
      unapprovedTxs,
      unapprovedMsgs,
      unapprovedPersonalMsgs,
      unapprovedTypedMessages,
      match: {
        params: {
          id: transactionId
        } = {}
      },
      chainId
    } = this.props;
    const unconfTxList = (0, _txHelper.default)(unapprovedTxs, unapprovedMsgs, unapprovedPersonalMsgs, unapprovedTypedMessages, network, chainId);

    _loglevel.default.info(`rendering a combined ${unconfTxList.length} unconf msgs & txs`);

    return transactionId ? unconfTxList.find(({
      id
    }) => `${id}` === transactionId) : unconfTxList[index];
  }

  signatureSelect(type, version) {
    // Temporarily direct only v3 and v4 requests to new code.
    if (type === _app.MESSAGE_TYPE.ETH_SIGN_TYPED_DATA && (version === 'V3' || version === 'V4')) {
      return _signatureRequest.default;
    }

    return _signatureRequestOriginal.default;
  }

  signMessage(msgData, event) {
    _loglevel.default.info('conf-tx.js: signing message');

    const params = msgData.msgParams;
    params.metamaskId = msgData.id;
    this.stopPropagation(event);
    return this.props.dispatch(actions.signMsg(params));
  }

  stopPropagation(event) {
    if (event !== null && event !== void 0 && event.stopPropagation) {
      event.stopPropagation();
    }
  }

  signPersonalMessage(msgData, event) {
    _loglevel.default.info('conf-tx.js: signing personal message');

    const params = msgData.msgParams;
    params.metamaskId = msgData.id;
    this.stopPropagation(event);
    return this.props.dispatch(actions.signPersonalMsg(params));
  }

  signTypedMessage(msgData, event) {
    _loglevel.default.info('conf-tx.js: signing typed message');

    const params = msgData.msgParams;
    params.metamaskId = msgData.id;
    this.stopPropagation(event);
    return this.props.dispatch(actions.signTypedMsg(params));
  }

  cancelMessage(msgData, event) {
    _loglevel.default.info('canceling message');

    this.stopPropagation(event);
    return this.props.dispatch(actions.cancelMsg(msgData));
  }

  cancelPersonalMessage(msgData, event) {
    _loglevel.default.info('canceling personal message');

    this.stopPropagation(event);
    return this.props.dispatch(actions.cancelPersonalMsg(msgData));
  }

  cancelTypedMessage(msgData, event) {
    _loglevel.default.info('canceling typed message');

    this.stopPropagation(event);
    return this.props.dispatch(actions.cancelTypedMsg(msgData));
  }

  componentDidMount() {
    const {
      unapprovedTxs = {},
      history,
      mostRecentOverviewPage,
      network,
      chainId,
      sendTo
    } = this.props;
    const unconfTxList = (0, _txHelper.default)(unapprovedTxs, {}, {}, {}, network, chainId);

    if (unconfTxList.length === 0 && !sendTo && this.getUnapprovedMessagesTotal() === 0) {
      history.push(mostRecentOverviewPage);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      unapprovedTxs = {},
      network,
      chainId,
      currentNetworkTxList,
      sendTo,
      history,
      match: {
        params: {
          id: transactionId
        } = {}
      },
      mostRecentOverviewPage
    } = this.props;
    let prevTx;

    if (transactionId) {
      prevTx = currentNetworkTxList.find(({
        id
      }) => `${id}` === transactionId);
    } else {
      const {
        index: prevIndex,
        unapprovedTxs: prevUnapprovedTxs
      } = prevProps;
      const prevUnconfTxList = (0, _txHelper.default)(prevUnapprovedTxs, {}, {}, {}, network, chainId);
      const prevTxData = prevUnconfTxList[prevIndex] || {};
      prevTx = currentNetworkTxList.find(({
        id
      }) => id === prevTxData.id) || {};
    }

    const unconfTxList = (0, _txHelper.default)(unapprovedTxs, {}, {}, {}, network, chainId);

    if (prevTx && prevTx.status === _transaction.TRANSACTION_STATUSES.DROPPED) {
      this.props.dispatch(actions.showModal({
        name: 'TRANSACTION_CONFIRMED',
        onSubmit: () => history.push(mostRecentOverviewPage)
      }));
      return;
    }

    if (unconfTxList.length === 0 && !sendTo && this.getUnapprovedMessagesTotal() === 0) {
      this.props.history.push(mostRecentOverviewPage);
    }
  }

  render() {
    const {
      currentCurrency,
      blockGasLimit
    } = this.props;
    const txData = this.getTxData() || {};
    const {
      msgParams,
      type,
      msgParams: {
        version
      }
    } = txData;

    _loglevel.default.debug('msgParams detected, rendering pending msg');

    if (!msgParams) {
      return /*#__PURE__*/_react.default.createElement(_loadingScreen.default, null);
    }

    const SigComponent = this.signatureSelect(type, version);
    return /*#__PURE__*/_react.default.createElement(SigComponent, {
      txData: txData,
      key: txData.id,
      identities: this.props.identities,
      currentCurrency: currentCurrency,
      blockGasLimit: blockGasLimit,
      signMessage: this.signMessage.bind(this, txData),
      signPersonalMessage: this.signPersonalMessage.bind(this, txData),
      signTypedMessage: this.signTypedMessage.bind(this, txData),
      cancelMessage: this.cancelMessage.bind(this, txData),
      cancelPersonalMessage: this.cancelPersonalMessage.bind(this, txData),
      cancelTypedMessage: this.cancelTypedMessage.bind(this, txData)
    });
  }

}

(0, _defineProperty2.default)(ConfirmTxScreen, "propTypes", {
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  unapprovedMsgCount: _propTypes.default.number,
  unapprovedPersonalMsgCount: _propTypes.default.number,
  unapprovedTypedMessagesCount: _propTypes.default.number,
  network: _propTypes.default.string,
  chainId: _propTypes.default.string,
  index: _propTypes.default.number,
  unapprovedTxs: _propTypes.default.object,
  unapprovedMsgs: _propTypes.default.object,
  unapprovedPersonalMsgs: _propTypes.default.object,
  unapprovedTypedMessages: _propTypes.default.object,
  match: _propTypes.default.shape({
    params: _propTypes.default.shape({
      id: _propTypes.default.string
    })
  }),
  currentNetworkTxList: _propTypes.default.array,
  currentCurrency: _propTypes.default.string,
  blockGasLimit: _propTypes.default.string,
  history: _propTypes.default.object,
  identities: _propTypes.default.object,
  dispatch: _propTypes.default.func.isRequired,
  sendTo: _propTypes.default.string
});

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps))(ConfirmTxScreen);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-transaction/conf-tx.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-transaction/conf-tx.js",}],
[3383, {}, function (require, module, exports) {
/* jshint browser: true */

(function () {

// The properties that we copy into a mirrored div.
// Note that some browsers, such as Firefox,
// do not concatenate properties, i.e. padding-top, bottom etc. -> padding,
// so we have to do every single property specifically.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
  if(!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  var debug = options && options.debug || false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if ( el ) { el.parentNode.removeChild(el); }
  }

  // mirrored div
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle? getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9

  // default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (element.nodeName !== 'INPUT')
    style.wordWrap = 'break-word';  // only for textarea-s

  // position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // transfer the element's properties to the div
  properties.forEach(function (prop) {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (element.nodeName === 'INPUT')
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // for inputs, just '.' would be enough, but why bother?
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = getCaretCoordinates;
} else if(isBrowser){
  window.getCaretCoordinates = getCaretCoordinates;
}

}());

//# sourceMappingURL=node_modules/textarea-caret/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/textarea-caret/index.js",}],
[3949, {"./text-field-white.component":3950,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _textFieldWhite = _interopRequireDefault(require("./text-field-white.component"));

var _default = _textFieldWhite.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/text-field-white/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/text-field-white/index.js",}],
[458, {"./Button":457,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _Button.default;
  }
});

var _Button = _interopRequireDefault(require("./Button"));
//# sourceMappingURL=node_modules/@material-ui/core/Button/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/Button/index.js",}],
[2518, {}, function (require, module, exports) {
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

//# sourceMappingURL=node_modules/lodash/_apply.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_apply.js",}],
[2616, {}, function (require, module, exports) {
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

//# sourceMappingURL=node_modules/lodash/_shortOut.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_shortOut.js",}],
[2553, {"./_defineProperty":2565,"./constant":2626,"./identity":2631}, function (require, module, exports) {
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

//# sourceMappingURL=node_modules/lodash/_baseSetToString.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseSetToString.js",}],
[2612, {}, function (require, module, exports) {
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

//# sourceMappingURL=node_modules/lodash/_setCacheAdd.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_setCacheAdd.js",}],
[2613, {}, function (require, module, exports) {
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

//# sourceMappingURL=node_modules/lodash/_setCacheHas.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_setCacheHas.js",}],
[2512, {"./_getNative":2573,"./_root":2611}, function (require, module, exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

//# sourceMappingURL=node_modules/lodash/_Set.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_Set.js",}],
[2514, {"./_ListCache":2508,"./_stackClear":2617,"./_stackDelete":2618,"./_stackGet":2619,"./_stackHas":2620,"./_stackSet":2621}, function (require, module, exports) {
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

//# sourceMappingURL=node_modules/lodash/_Stack.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_Stack.js",}],
[2541, {"./_Stack":2514,"./_equalArrays":2566,"./_equalByTag":2567,"./_equalObjects":2568,"./_getTag":2577,"./isArray":2634,"./isBuffer":2637,"./isTypedArray":2644}, function (require, module, exports) {
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

//# sourceMappingURL=node_modules/lodash/_baseIsEqualDeep.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseIsEqualDeep.js",}],
[2536, {}, function (require, module, exports) {
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

//# sourceMappingURL=node_modules/lodash/_baseHasIn.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_baseHasIn.js",}],
[2579, {"./_castPath":2561,"./_isIndex":2586,"./_toKey":2624,"./isArguments":2633,"./isArray":2634,"./isLength":2639}, function (require, module, exports) {
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

//# sourceMappingURL=node_modules/lodash/_hasPath.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/lodash/_hasPath.js",}],
[3894, {"./identicon.component":3893,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _identicon = _interopRequireDefault(require("./identicon.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      useBlockie,
      useTokenDetection,
      tokenList
    }
  } = state;
  return {
    useBlockie,
    useTokenDetection,
    tokenList
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_identicon.default);

exports.default = _default;

//# sourceMappingURL=ui/components/ui/identicon/identicon.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/identicon/identicon.container.js",}],
[3956, {"../../../hooks/useTokenTracker":4043,"../currency-display":3854,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TokenBalance;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _currencyDisplay = _interopRequireDefault(require("../currency-display"));

var _useTokenTracker = require("../../../hooks/useTokenTracker");

function TokenBalance({
  className,
  token
}) {
  const {
    tokensWithBalances
  } = (0, _useTokenTracker.useTokenTracker)([token]);
  const {
    string,
    symbol
  } = tokensWithBalances[0] || {};
  return /*#__PURE__*/_react.default.createElement(_currencyDisplay.default, {
    className: className,
    displayValue: string || '',
    suffix: symbol || ''
  });
}

TokenBalance.propTypes = {
  className: _propTypes.default.string,
  token: _propTypes.default.shape({
    address: _propTypes.default.string.isRequired,
    decimals: _propTypes.default.number,
    symbol: _propTypes.default.string
  }).isRequired
};
TokenBalance.defaultProps = {
  className: undefined
};

//# sourceMappingURL=ui/components/ui/token-balance/token-balance.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/token-balance/token-balance.js",}],
[4039, {"react":3121}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTimeout = useTimeout;

var _react = require("react");

/**
 * useTimeout
 *
 * @param {Function} cb - callback function inside setTimeout
 * @param {number} delay - delay in ms
 * @param {boolean} [immediate] - determines whether the timeout is invoked immediately
 *
 * @return {Function|undefined}
 */
function useTimeout(cb, delay, immediate = true) {
  const saveCb = (0, _react.useRef)();
  const [timeoutId, setTimeoutId] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    saveCb.current = cb;
  }, [cb]);
  (0, _react.useEffect)(() => {
    if (timeoutId !== 'start') {
      return undefined;
    }

    const id = setTimeout(() => {
      saveCb.current();
    }, delay);
    setTimeoutId(id);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay, timeoutId]);
  const startTimeout = (0, _react.useCallback)(() => {
    clearTimeout(timeoutId);
    setTimeoutId('start');
  }, [timeoutId]);

  if (immediate) {
    startTimeout();
  }

  return startTimeout;
}

//# sourceMappingURL=ui/hooks/useTimeout.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useTimeout.js",}],
[3916, {"../../../helpers/utils/build-types":4006,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _classnames = _interopRequireDefault(require("classnames"));

var _buildTypes = require("../../../helpers/utils/build-types");

class MetaFoxLogo extends _react.PureComponent {
  render() {
    const {
      onClick,
      unsetIconHeight,
      useDark
    } = this.props;
    const iconProps = unsetIconHeight ? {} : {
      height: 42,
      width: 42
    };
    return /*#__PURE__*/_react.default.createElement("div", {
      onClick: onClick,
      className: (0, _classnames.default)('app-header__logo-container', {
        'app-header__logo-container--clickable': Boolean(onClick)
      })
    }, /*#__PURE__*/_react.default.createElement("img", {
      height: "30",
      src: "./images/logo/monsta-logo.png",
      className: (0, _classnames.default)('app-header__metafox-logo', 'app-header__metafox-logo--horizontal'),
      alt: ""
    }), /*#__PURE__*/_react.default.createElement("img", (0, _extends2.default)({}, iconProps, {
      src: "./images/logo/monsta-logo.png",
      className: (0, _classnames.default)('app-header__metafox-logo', 'app-header__metafox-logo--icon'),
      alt: ""
    })));
  }

}

exports.default = MetaFoxLogo;
(0, _defineProperty2.default)(MetaFoxLogo, "propTypes", {
  onClick: _propTypes.default.func,
  unsetIconHeight: _propTypes.default.bool,
  useDark: _propTypes.default.bool
});
(0, _defineProperty2.default)(MetaFoxLogo, "defaultProps", {
  onClick: undefined,
  useDark: false
});

//# sourceMappingURL=ui/components/ui/metafox-logo/metafox-logo.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/metafox-logo/metafox-logo.component.js",}],
[3109, {"prop-types":2900,"react":3121}, function (require, module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var INPUT_FIELD_REF = 'inputField';

var READ_METHOD_ALIASES = {
  buffer: 'readAsArrayBuffer',
  binary: 'readAsBinaryString',
  dataUrl: 'readAsDataURL',
  text: 'readAsText'
};

var SUPPORTED_EVENTS = ['onLoadStart', 'onLoadEnd', 'onLoad', 'onAbort', 'onError'];

var UNSUPPORTED_BY_INPUT = {
  readAs: true,
  abortIf: true,
  cancelIf: true,
  onCancel: true
};

var FileInput = function (_Component) {
  _inherits(FileInput, _Component);

  function FileInput(props, context) {
    _classCallCheck(this, FileInput);

    var _this = _possibleConstructorReturn(this, (FileInput.__proto__ || Object.getPrototypeOf(FileInput)).call(this, props, context));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(FileInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {

      if (window && !window.File || !window.FileReader) {
        console.warn('Browser does not appear to support API react-simple-file-input relies upon');
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      var _this2 = this;

      var _props = this.props,
          readAs = _props.readAs,
          cancelIf = _props.cancelIf,
          onCancel = _props.onCancel,
          onProgress = _props.onProgress,
          abortIf = _props.abortIf,
          onChange = _props.onChange,
          multiple = _props.multiple;
      var files = event.target.files;


      if (onChange) {
        if (multiple) {
          onChange(files);
        } else {
          onChange(files[0]);
        }
      }

      if (readAs) {
        var _loop = function _loop(i) {
          var file = files[i];

          if (cancelIf && cancelIf(file)) {
            if (onCancel) {
              onCancel(file);
            }

            return {
              v: void 0
            };
          }

          var fileReader = new window.FileReader();

          var _loop2 = function _loop2(_i) {
            var handlerName = SUPPORTED_EVENTS[_i];

            if (_this2.props[handlerName]) {
              fileReader[handlerName.toLowerCase()] = function (fileReadEvent) {
                _this2.props[handlerName](fileReadEvent, file);
              };
            }
          };

          for (var _i = 0; _i < SUPPORTED_EVENTS.length; _i++) {
            _loop2(_i);
          }

          if (typeof abortIf !== 'undefined') {
            fileReader.onprogress = function (event) {

              if (abortIf(event, file)) {
                fileReader.abort();
              } else if (onProgress) {
                onProgress(event, file);
              }
            };
          } else if (onProgress) {
            fileReader.onprogress = onProgress;
          }

          fileReader[READ_METHOD_ALIASES[readAs]](file);
        };

        for (var i = 0; i < files.length; i++) {
          var _ret = _loop(i);

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var inputProps = {};

      for (var property in this.props) {
        if (this.props.hasOwnProperty(property) && !UNSUPPORTED_BY_INPUT[property]) {
          inputProps[property] = this.props[property];
        }
      }

      return _react2.default.createElement('input', _extends({}, inputProps, {
        type: 'file',
        ref: INPUT_FIELD_REF,
        onChange: this.handleChange
      }));
    }
  }]);

  return FileInput;
}(_react.Component);

FileInput.propTypes = {
  id: _propTypes2.default.string,
  className: _propTypes2.default.string,

  multiple: _propTypes2.default.bool,

  readAs: _propTypes2.default.oneOf(Object.keys(READ_METHOD_ALIASES)),

  onLoadStart: _propTypes2.default.func,
  onLoadEnd: _propTypes2.default.func,
  onLoad: _propTypes2.default.func,
  onAbort: _propTypes2.default.func,
  onCancel: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  onProgress: _propTypes2.default.func,

  cancelIf: _propTypes2.default.func,
  abortIf: _propTypes2.default.func
};

exports.default = FileInput;
//# sourceMappingURL=node_modules/react-simple-file-input/lib/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-simple-file-input/lib/index.js",}],
[3861, {"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

const Dropdown = ({
  className,
  disabled,
  onChange,
  options,
  selectedOption,
  style,
  title
}) => {
  const _onChange = (0, _react.useCallback)(event => {
    event.preventDefault();
    event.stopPropagation();
    onChange(event.target.value);
  }, [onChange]);

  return /*#__PURE__*/_react.default.createElement("select", {
    className: (0, _classnames.default)('dropdown', className),
    disabled: disabled,
    title: title,
    onChange: _onChange,
    style: style,
    value: selectedOption
  }, options.map(option => {
    return /*#__PURE__*/_react.default.createElement("option", {
      key: option.value,
      value: option.value
    }, option.name || option.value);
  }));
};

Dropdown.propTypes = {
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  title: _propTypes.default.string,
  onChange: _propTypes.default.func.isRequired,
  options: _propTypes.default.arrayOf(_propTypes.default.exact({
    name: _propTypes.default.string,
    value: _propTypes.default.string.isRequired
  })).isRequired,
  selectedOption: _propTypes.default.string,
  style: _propTypes.default.object
};
Dropdown.defaultProps = {
  className: undefined,
  disabled: false,
  title: undefined,
  selectedOption: null,
  style: undefined
};
var _default = Dropdown;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/dropdown/dropdown.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/dropdown/dropdown.js",}],
[3846, {"./check-box.component":3845,"@babel/runtime/helpers/interopRequireWildcard":187}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _checkBox.default;
  }
});
Object.defineProperty(exports, "CHECKED", {
  enumerable: true,
  get: function () {
    return _checkBox.CHECKED;
  }
});
Object.defineProperty(exports, "INDETERMINATE", {
  enumerable: true,
  get: function () {
    return _checkBox.INDETERMINATE;
  }
});
Object.defineProperty(exports, "UNCHECKED", {
  enumerable: true,
  get: function () {
    return _checkBox.UNCHECKED;
  }
});

var _checkBox = _interopRequireWildcard(require("./check-box.component"));

//# sourceMappingURL=ui/components/ui/check-box/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/check-box/index.js",}],
[3905, {"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LoadingIndicator;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function LoadingIndicator({
  alt,
  title,
  isLoading,
  children = null
}) {
  return isLoading ? /*#__PURE__*/_react.default.createElement("span", {
    className: "loading-indicator"
  }, /*#__PURE__*/_react.default.createElement("img", {
    className: "loading-indicator__spinner",
    alt: alt,
    title: title,
    src: "images/loading.svg"
  })) : children;
}

LoadingIndicator.propTypes = {
  isLoading: _propTypes.default.bool.isRequired,
  alt: _propTypes.default.string.isRequired,
  title: _propTypes.default.string.isRequired,
  children: _propTypes.default.node
};

//# sourceMappingURL=ui/components/ui/loading-indicator/loading-indicator.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/loading-indicator/loading-indicator.js",}],
[3881, {"../../../helpers/constants/design-system":3992,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = InfoIconInverted;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _designSystem = require("../../../helpers/constants/design-system");

function InfoIconInverted({
  severity
}) {
  const className = (0, _classnames.default)('info-icon', {
    'info-icon--success': severity === _designSystem.SEVERITIES.SUCCESS,
    'info-icon--warning': severity === _designSystem.SEVERITIES.WARNING,
    'info-icon--danger': severity === _designSystem.SEVERITIES.DANGER,
    'info-icon--info': severity === _designSystem.SEVERITIES.INFO
  });
  return /*#__PURE__*/_react.default.createElement("svg", {
    className: className,
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M15.75 8C15.75 3.75 12.25 0.25 8 0.25C3.71875 0.25 0.25 3.75 0.25 8C0.25 12.2812 3.71875 15.75 8 15.75C12.25 15.75 15.75 12.2812 15.75 8ZM8 9.5625C8.78125 9.5625 9.4375 10.2188 9.4375 11C9.4375 11.8125 8.78125 12.4375 8 12.4375C7.1875 12.4375 6.5625 11.8125 6.5625 11C6.5625 10.2188 7.1875 9.5625 8 9.5625ZM6.625 4.40625C6.59375 4.1875 6.78125 4 7 4H8.96875C9.1875 4 9.375 4.1875 9.34375 4.40625L9.125 8.65625C9.09375 8.875 8.9375 9 8.75 9H7.21875C7.03125 9 6.875 8.875 6.84375 8.65625L6.625 4.40625Z"
  }));
}

InfoIconInverted.propTypes = {
  severity: _propTypes.default.oneOf(Object.values(_designSystem.SEVERITIES))
};

//# sourceMappingURL=ui/components/ui/icon/info-icon-inverted.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/icon/info-icon-inverted.component.js",}],
[3874, {"./icon-border":3873,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _iconBorder.default;
  }
});

var _iconBorder = _interopRequireDefault(require("./icon-border"));

//# sourceMappingURL=ui/components/ui/icon-border/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/icon-border/index.js",}],
[3878, {"./icon-with-fallback.component":3877,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _iconWithFallback.default;
  }
});

var _iconWithFallback = _interopRequireDefault(require("./icon-with-fallback.component"));

//# sourceMappingURL=ui/components/ui/icon-with-fallback/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/icon-with-fallback/index.js",}],
[3697, {"../../ui/box":3838,"../../ui/button":3842,"../../ui/chip":3848,"../../ui/definition-list":3859,"../../ui/popover":3925,"../../ui/truncated-definition-list":3962,"../../ui/typography":3964,"../metamask-translation":3698,"../network-display":3760,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeComponentList = void 0;

var _button = _interopRequireDefault(require("../../ui/button"));

var _chip = _interopRequireDefault(require("../../ui/chip"));

var _definitionList = _interopRequireDefault(require("../../ui/definition-list"));

var _truncatedDefinitionList = _interopRequireDefault(require("../../ui/truncated-definition-list"));

var _popover = _interopRequireDefault(require("../../ui/popover"));

var _typography = _interopRequireDefault(require("../../ui/typography"));

var _box = _interopRequireDefault(require("../../ui/box"));

var _metamaskTranslation = _interopRequireDefault(require("../metamask-translation"));

var _networkDisplay = _interopRequireDefault(require("../network-display"));

const safeComponentList = {
  MetaMaskTranslation: _metamaskTranslation.default,
  a: 'a',
  b: 'b',
  p: 'p',
  div: 'div',
  span: 'span',
  Typography: _typography.default,
  Chip: _chip.default,
  DefinitionList: _definitionList.default,
  TruncatedDefinitionList: _truncatedDefinitionList.default,
  Button: _button.default,
  Popover: _popover.default,
  Box: _box.default,
  NetworkDisplay: _networkDisplay.default
};
exports.safeComponentList = safeComponentList;

//# sourceMappingURL=ui/components/app/metamask-template-renderer/safe-component-list.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/metamask-template-renderer/safe-component-list.js",}],
[4049, {"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

const AssetBreadcrumb = ({
  accountName,
  assetName,
  onBack
}) => {
  return /*#__PURE__*/_react.default.createElement("button", {
    className: "asset-breadcrumb",
    onClick: onBack
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fas fa-chevron-left asset-breadcrumb__chevron",
    "data-testid": "asset__back"
  }), /*#__PURE__*/_react.default.createElement("span", null, accountName), "\xA0/\xA0", /*#__PURE__*/_react.default.createElement("span", {
    className: "asset-breadcrumb__asset"
  }, assetName));
};

AssetBreadcrumb.propTypes = {
  accountName: _propTypes.default.string.isRequired,
  assetName: _propTypes.default.string.isRequired,
  onBack: _propTypes.default.func.isRequired
};
var _default = AssetBreadcrumb;
exports.default = _default;

//# sourceMappingURL=ui/pages/asset/components/asset-breadcrumb.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/asset/components/asset-breadcrumb.js",}],
[3912, {"./menu":3914,"./menu-item":3913,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Menu", {
  enumerable: true,
  get: function () {
    return _menu.default;
  }
});
Object.defineProperty(exports, "MenuItem", {
  enumerable: true,
  get: function () {
    return _menuItem.default;
  }
});

var _menu = _interopRequireDefault(require("./menu"));

var _menuItem = _interopRequireDefault(require("./menu-item"));

//# sourceMappingURL=ui/components/ui/menu/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/menu/index.js",}],
[3817, {"../../../../shared/constants/swaps":3597,"../../../../shared/constants/transaction":3599,"../../../helpers/constants/transactions":3996,"../../../helpers/utils/util":4020,"../../../hooks/useI18nContext":4030,"../../../selectors":4326,"../../../selectors/transactions":4329,"../../ui/button":3842,"../transaction-list-item":3814,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TransactionList;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _transactions = require("../../../selectors/transactions");

var _selectors = require("../../../selectors");

var _useI18nContext = require("../../../hooks/useI18nContext");

var _transactionListItem = _interopRequireDefault(require("../transaction-list-item"));

var _button = _interopRequireDefault(require("../../ui/button"));

var _transactions2 = require("../../../helpers/constants/transactions");

var _swaps = require("../../../../shared/constants/swaps");

var _transaction = require("../../../../shared/constants/transaction");

var _util = require("../../../helpers/utils/util");

const PAGE_INCREMENT = 10; // When we are on a token page, we only want to show transactions that involve that token.
// In the case of token transfers or approvals, these will be transactions sent to the
// token contract. In the case of swaps, these will be transactions sent to the swaps contract
// and which have the token address in the transaction data.
//
// getTransactionGroupRecipientAddressFilter is used to determine whether a transaction matches
// either of those criteria

const getTransactionGroupRecipientAddressFilter = (recipientAddress, chainId) => {
  return ({
    initialTransaction: {
      txParams
    }
  }) => {
    return (0, _util.isEqualCaseInsensitive)(txParams === null || txParams === void 0 ? void 0 : txParams.to, recipientAddress) || (txParams === null || txParams === void 0 ? void 0 : txParams.to) === _swaps.SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[chainId] && txParams.data.match(recipientAddress.slice(2));
  };
};

const tokenTransactionFilter = ({
  initialTransaction: {
    type,
    destinationTokenSymbol,
    sourceTokenSymbol
  }
}) => {
  if (_transactions2.TOKEN_CATEGORY_HASH[type]) {
    return false;
  } else if (type === _transaction.TRANSACTION_TYPES.SWAP) {
    return destinationTokenSymbol === 'ETH' || sourceTokenSymbol === 'ETH';
  }

  return true;
};

const getFilteredTransactionGroups = (transactionGroups, hideTokenTransactions, tokenAddress, chainId) => {
  if (hideTokenTransactions) {
    return transactionGroups.filter(tokenTransactionFilter);
  } else if (tokenAddress) {
    return transactionGroups.filter(getTransactionGroupRecipientAddressFilter(tokenAddress, chainId));
  }

  return transactionGroups;
};

function TransactionList({
  hideTokenTransactions,
  tokenAddress
}) {
  const [limit, setLimit] = (0, _react.useState)(PAGE_INCREMENT);
  const t = (0, _useI18nContext.useI18nContext)();
  const unfilteredPendingTransactions = (0, _reactRedux.useSelector)(_transactions.nonceSortedPendingTransactionsSelector);
  const unfilteredCompletedTransactions = (0, _reactRedux.useSelector)(_transactions.nonceSortedCompletedTransactionsSelector);
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const pendingTransactions = (0, _react.useMemo)(() => getFilteredTransactionGroups(unfilteredPendingTransactions, hideTokenTransactions, tokenAddress, chainId), [hideTokenTransactions, tokenAddress, unfilteredPendingTransactions, chainId]);
  const completedTransactions = (0, _react.useMemo)(() => getFilteredTransactionGroups(unfilteredCompletedTransactions, hideTokenTransactions, tokenAddress, chainId), [hideTokenTransactions, tokenAddress, unfilteredCompletedTransactions, chainId]);
  const viewMore = (0, _react.useCallback)(() => setLimit(prev => prev + PAGE_INCREMENT), []);
  const pendingLength = pendingTransactions.length;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list__transactions"
  }, pendingLength > 0 && /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list__pending-transactions"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list__header"
  }, `${t('queue')} (${pendingTransactions.length})`), pendingTransactions.map((transactionGroup, index) => /*#__PURE__*/_react.default.createElement(_transactionListItem.default, {
    isEarliestNonce: index === 0,
    transactionGroup: transactionGroup,
    key: `${transactionGroup.nonce}:${index}`
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list__completed-transactions"
  }, pendingLength > 0 ? /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list__header"
  }, t('history')) : null, completedTransactions.length > 0 ? completedTransactions.slice(0, limit).map((transactionGroup, index) => /*#__PURE__*/_react.default.createElement(_transactionListItem.default, {
    transactionGroup: transactionGroup,
    key: `${transactionGroup.nonce}:${limit + index - 10}`
  })) : /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list__empty"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "transaction-list__empty-text"
  }, t('noTransactions'))), completedTransactions.length > limit && /*#__PURE__*/_react.default.createElement(_button.default, {
    className: "transaction-list__view-more",
    type: "secondary",
    rounded: true,
    onClick: viewMore
  }, t('viewMore')))));
}

TransactionList.propTypes = {
  hideTokenTransactions: _propTypes.default.bool,
  tokenAddress: _propTypes.default.string
};
TransactionList.defaultProps = {
  hideTokenTransactions: false,
  tokenAddress: undefined
};

//# sourceMappingURL=ui/components/app/transaction-list/transaction-list.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/transaction-list/transaction-list.component.js",}],
[3828, {"../../../contexts/i18n":3970,"../../../ducks/metamask/metamask":3985,"../../../ducks/send":3986,"../../../helpers/constants/common":3990,"../../../helpers/constants/routes":3995,"../../../hooks/useMetricEvent":4032,"../../../hooks/useTokenTracker":4043,"../../../selectors":4326,"../../../selectors/selectors":4328,"../../ui/icon-button":3876,"../../ui/icon/overview-send-icon.component":3884,"../../ui/identicon":3895,"../../ui/tooltip":3960,"../user-preferenced-currency-display":3820,"./wallet-overview":3831,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/controllers":878,"classnames":1449,"lodash":2646,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _classnames = _interopRequireDefault(require("classnames"));

var _reactRouterDom = require("react-router-dom");

var _lodash = require("lodash");

var _controllers = require("@metamask/controllers");

var _identicon = _interopRequireDefault(require("../../ui/identicon"));

var _i18n = require("../../../contexts/i18n");

var _routes = require("../../../helpers/constants/routes");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _tooltip = _interopRequireDefault(require("../../ui/tooltip"));

var _userPreferencedCurrencyDisplay = _interopRequireDefault(require("../user-preferenced-currency-display"));

var _common = require("../../../helpers/constants/common");

var _selectors = require("../../../selectors/selectors");

var _overviewSendIcon = _interopRequireDefault(require("../../ui/icon/overview-send-icon.component"));

var _iconButton = _interopRequireDefault(require("../../ui/icon-button"));

var _metamask = require("../../../ducks/metamask/metamask");

var _useTokenTracker = require("../../../hooks/useTokenTracker");

var _selectors2 = require("../../../selectors");

var _send = require("../../../ducks/send");

var _walletOverview = _interopRequireDefault(require("./wallet-overview"));

const EthOverview = ({
  className
}) => {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const dispatch = (0, _reactRedux.useDispatch)();
  const shouldHideZeroBalanceTokens = (0, _reactRedux.useSelector)(_selectors2.getShouldHideZeroBalanceTokens);
  const sendEvent = (0, _useMetricEvent.useMetricEvent)({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Send: Eth'
    }
  });
  const history = (0, _reactRouterDom.useHistory)();
  const balanceIsCached = (0, _reactRedux.useSelector)(_selectors.isBalanceCached);
  const showFiat = (0, _reactRedux.useSelector)(_selectors.getShouldShowFiat);
  const selectedAccount = (0, _reactRedux.useSelector)(_selectors.getSelectedAccount);
  const {
    balance
  } = selectedAccount;
  const primaryTokenImage = (0, _reactRedux.useSelector)(_selectors.getNativeCurrencyImage);
  const tokens = (0, _reactRedux.useSelector)(_metamask.getTokens, _lodash.isEqual);
  const {
    loading,
    tokensWithBalances
  } = (0, _useTokenTracker.useTokenTracker)(tokens, true, shouldHideZeroBalanceTokens);
  const sendTokenEvent = (0, _useMetricEvent.useMetricEvent)({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Send: Token'
    }
  });
  return /*#__PURE__*/_react.default.createElement(_walletOverview.default, {
    balance: /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      position: "top",
      title: t('balanceOutdated'),
      disabled: !balanceIsCached
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "eth-overview__balance"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "eth-overview__primary-container"
    }, /*#__PURE__*/_react.default.createElement(_userPreferencedCurrencyDisplay.default, {
      className: (0, _classnames.default)('eth-overview__primary-balance', {
        'eth-overview__cached-balance': balanceIsCached
      }),
      "data-testid": "eth-overview__primary-currency",
      displayValue: tokensWithBalances && tokensWithBalances[0] ? parseFloat(tokensWithBalances[0].string).toFixed(4) : '0',
      type: _common.PRIMARY,
      ethNumberOfDecimals: 4,
      hideTitle: true
    }), balanceIsCached ? /*#__PURE__*/_react.default.createElement("span", {
      className: "eth-overview__cached-star"
    }, "*") : null))),
    buttons: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_iconButton.default, {
      className: "token-overview__button",
      onClick: () => {
        sendTokenEvent();
        dispatch((0, _send.updateSendAsset)({
          type: _send.ASSET_TYPES.TOKEN,
          details: tokens[0]
        })).then(() => {
          history.push(_routes.SEND_ROUTE);
        });
      },
      Icon: _overviewSendIcon.default,
      label: t('send'),
      "data-testid": "eth-overview-send"
    })),
    className: className,
    icon: /*#__PURE__*/_react.default.createElement(_identicon.default, {
      diameter: 32,
      image: primaryTokenImage,
      imageBorder: true
    })
  });
};

EthOverview.propTypes = {
  className: _propTypes.default.string
};
EthOverview.defaultProps = {
  className: undefined
};
var _default = EthOverview;
exports.default = _default;

//# sourceMappingURL=ui/components/app/wallet-overview/eth-overview.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/wallet-overview/eth-overview.js",}],
[3830, {"../../../contexts/i18n":3970,"../../../ducks/send":3986,"../../../ducks/swaps/swaps":3988,"../../../helpers/constants/routes":3995,"../../../hooks/useMetricEvent":4032,"../../../hooks/useTokenFiatAmount":4042,"../../../hooks/useTokenTracker":4043,"../../../selectors/selectors":4328,"../../ui/currency-display":3854,"../../ui/icon-button":3876,"../../ui/icon/overview-send-icon.component":3884,"../../ui/icon/swap-icon.component":3890,"../../ui/identicon":3895,"../../ui/tooltip":3960,"./wallet-overview":3831,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _identicon = _interopRequireDefault(require("../../ui/identicon"));

var _tooltip = _interopRequireDefault(require("../../ui/tooltip"));

var _currencyDisplay = _interopRequireDefault(require("../../ui/currency-display"));

var _i18n = require("../../../contexts/i18n");

var _routes = require("../../../helpers/constants/routes");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _useTokenTracker = require("../../../hooks/useTokenTracker");

var _useTokenFiatAmount = require("../../../hooks/useTokenFiatAmount");

var _send = require("../../../ducks/send");

var _swaps = require("../../../ducks/swaps/swaps");

var _selectors = require("../../../selectors/selectors");

var _swapIcon = _interopRequireDefault(require("../../ui/icon/swap-icon.component"));

var _overviewSendIcon = _interopRequireDefault(require("../../ui/icon/overview-send-icon.component"));

var _iconButton = _interopRequireDefault(require("../../ui/icon-button"));

var _walletOverview = _interopRequireDefault(require("./wallet-overview"));

const TokenOverview = ({
  className,
  token
}) => {
  var _tokensWithBalances$, _tokensWithBalances$2;

  const dispatch = (0, _reactRedux.useDispatch)();
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const sendTokenEvent = (0, _useMetricEvent.useMetricEvent)({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Send: Token'
    }
  });
  const history = (0, _reactRouterDom.useHistory)();
  const keyring = (0, _reactRedux.useSelector)(_selectors.getCurrentKeyring);
  const usingHardwareWallet = keyring.type.search('Hardware') !== -1;
  const {
    tokensWithBalances
  } = (0, _useTokenTracker.useTokenTracker)([token]);
  const balanceToRender = (_tokensWithBalances$ = tokensWithBalances[0]) === null || _tokensWithBalances$ === void 0 ? void 0 : _tokensWithBalances$.string;
  const balance = (_tokensWithBalances$2 = tokensWithBalances[0]) === null || _tokensWithBalances$2 === void 0 ? void 0 : _tokensWithBalances$2.balance;
  const formattedFiatBalance = (0, _useTokenFiatAmount.useTokenFiatAmount)(token.address, balanceToRender, token.symbol);
  const isSwapsChain = (0, _reactRedux.useSelector)(_selectors.getIsSwapsChain);
  const enteredSwapsEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Swaps Opened',
    properties: {
      source: 'Token View',
      active_currency: token.symbol
    },
    category: 'swaps'
  });
  return /*#__PURE__*/_react.default.createElement(_walletOverview.default, {
    balance: /*#__PURE__*/_react.default.createElement("div", {
      className: "token-overview__balance"
    }, /*#__PURE__*/_react.default.createElement(_currencyDisplay.default, {
      className: "token-overview__primary-balance",
      displayValue: balanceToRender,
      suffix: token.symbol
    }), formattedFiatBalance ? /*#__PURE__*/_react.default.createElement(_currencyDisplay.default, {
      className: "token-overview__secondary-balance",
      displayValue: formattedFiatBalance,
      hideLabel: true
    }) : null),
    buttons: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_iconButton.default, {
      className: "token-overview__button",
      onClick: () => {
        sendTokenEvent();
        dispatch((0, _send.updateSendAsset)({
          type: _send.ASSET_TYPES.TOKEN,
          details: token
        })).then(() => {
          history.push(_routes.SEND_ROUTE);
        });
      },
      Icon: _overviewSendIcon.default,
      label: t('send'),
      "data-testid": "eth-overview-send",
      disabled: token.isERC721
    })),
    className: className,
    icon: /*#__PURE__*/_react.default.createElement(_identicon.default, {
      diameter: 32,
      address: token.address,
      image: token.image
    })
  });
};

TokenOverview.propTypes = {
  className: _propTypes.default.string,
  token: _propTypes.default.shape({
    address: _propTypes.default.string.isRequired,
    decimals: _propTypes.default.number,
    symbol: _propTypes.default.string,
    image: _propTypes.default.string,
    isERC721: _propTypes.default.bool
  }).isRequired
};
TokenOverview.defaultProps = {
  className: undefined
};
var _default = TokenOverview;
exports.default = _default;

//# sourceMappingURL=ui/components/app/wallet-overview/token-overview.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/wallet-overview/token-overview.js",}],
[4188, {"../../../components/ui/site-icon":3939,"../../../contexts/i18n":3970,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PermissionsRedirect;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _siteIcon = _interopRequireDefault(require("../../../components/ui/site-icon"));

var _i18n = require("../../../contexts/i18n");

function PermissionsRedirect({
  domainMetadata
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "permissions-redirect"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "permissions-redirect__result"
  }, t('connecting'), /*#__PURE__*/_react.default.createElement("div", {
    className: "permissions-redirect__icons"
  }, /*#__PURE__*/_react.default.createElement(_siteIcon.default, {
    icon: domainMetadata.icon,
    name: domainMetadata.name,
    size: 64
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "permissions-redirect__center-icon"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "permissions-redirect__check"
  }), renderBrokenLine()), /*#__PURE__*/_react.default.createElement(_siteIcon.default, {
    icon: "/images/logo/monsta-logo.png",
    size: 64
  }))));

  function renderBrokenLine() {
    return /*#__PURE__*/_react.default.createElement("svg", {
      width: "131",
      height: "2",
      viewBox: "0 0 131 2",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/_react.default.createElement("path", {
      d: "M0 1H134",
      stroke: "#CDD1E4",
      strokeLinejoin: "round",
      strokeDasharray: "8 7"
    }));
  }
}

PermissionsRedirect.propTypes = {
  domainMetadata: _propTypes.default.shape({
    extensionId: _propTypes.default.string,
    icon: _propTypes.default.string,
    host: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    origin: _propTypes.default.string.isRequired
  })
};

//# sourceMappingURL=ui/pages/permissions-connect/redirect/permissions-redirect.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/permissions-connect/redirect/permissions-redirect.component.js",}],
[4182, {"../../../components/app/permissions-connect-footer":3767,"../../../components/app/permissions-connect-header":3769,"../../../components/app/user-preferenced-currency-display":3820,"../../../components/ui/button":3842,"../../../components/ui/check-box":3846,"../../../components/ui/identicon":3895,"../../../components/ui/tooltip":3960,"../../../helpers/constants/common":3990,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _classnames = _interopRequireDefault(require("classnames"));

var _identicon = _interopRequireDefault(require("../../../components/ui/identicon"));

var _button = _interopRequireDefault(require("../../../components/ui/button"));

var _checkBox = _interopRequireWildcard(require("../../../components/ui/check-box"));

var _tooltip = _interopRequireDefault(require("../../../components/ui/tooltip"));

var _common = require("../../../helpers/constants/common");

var _userPreferencedCurrencyDisplay = _interopRequireDefault(require("../../../components/app/user-preferenced-currency-display"));

var _permissionsConnectHeader = _interopRequireDefault(require("../../../components/app/permissions-connect-header"));

var _permissionsConnectFooter = _interopRequireDefault(require("../../../components/app/permissions-connect-footer"));

class ChooseAccount extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      selectedAccounts: this.props.selectedAccountAddresses
    });
    (0, _defineProperty2.default)(this, "renderAccountsList", () => {
      const {
        accounts,
        nativeCurrency,
        addressLastConnectedMap
      } = this.props;
      const {
        selectedAccounts
      } = this.state;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "permissions-connect-choose-account__accounts-list"
      }, accounts.map((account, index) => {
        const {
          address,
          addressLabel,
          balance
        } = account;
        return /*#__PURE__*/_react.default.createElement("div", {
          key: `permissions-connect-choose-account-${index}`,
          onClick: () => this.handleAccountClick(address),
          className: "permissions-connect-choose-account__account"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "permissions-connect-choose-account__account-info-wrapper"
        }, /*#__PURE__*/_react.default.createElement(_checkBox.default, {
          className: "permissions-connect-choose-account__list-check-box",
          checked: selectedAccounts.has(address)
        }), /*#__PURE__*/_react.default.createElement(_identicon.default, {
          diameter: 34,
          address: address
        }), /*#__PURE__*/_react.default.createElement("div", {
          className: "permissions-connect-choose-account__account__info"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "permissions-connect-choose-account__account__label"
        }, addressLabel), /*#__PURE__*/_react.default.createElement(_userPreferencedCurrencyDisplay.default, {
          className: "permissions-connect-choose-account__account__balance",
          type: _common.PRIMARY,
          value: balance,
          style: {
            color: '#6A737D'
          },
          suffix: nativeCurrency
        }))), addressLastConnectedMap[address] ? /*#__PURE__*/_react.default.createElement(_tooltip.default, {
          title: `${this.context.t('lastConnected')} ${addressLastConnectedMap[address]}`
        }, /*#__PURE__*/_react.default.createElement("i", {
          className: "fa fa-info-circle"
        })) : null);
      }));
    });
  }

  handleAccountClick(address) {
    const {
      selectedAccounts
    } = this.state;
    const newSelectedAccounts = new Set(selectedAccounts);

    if (newSelectedAccounts.has(address)) {
      newSelectedAccounts.delete(address);
    } else {
      newSelectedAccounts.add(address);
    }

    this.setState({
      selectedAccounts: newSelectedAccounts
    });
  }

  selectAll() {
    const {
      accounts
    } = this.props;
    const newSelectedAccounts = new Set(accounts.map(account => account.address));
    this.setState({
      selectedAccounts: newSelectedAccounts
    });
  }

  deselectAll() {
    this.setState({
      selectedAccounts: new Set()
    });
  }

  allAreSelected() {
    const {
      accounts
    } = this.props;
    const {
      selectedAccounts
    } = this.state;
    return accounts.every(({
      address
    }) => selectedAccounts.has(address));
  }

  renderAccountsListHeader() {
    const {
      t
    } = this.context;
    const {
      selectNewAccountViaModal,
      accounts
    } = this.props;
    const {
      selectedAccounts
    } = this.state;
    let checked;

    if (this.allAreSelected()) {
      checked = _checkBox.CHECKED;
    } else if (selectedAccounts.size === 0) {
      checked = _checkBox.UNCHECKED;
    } else {
      checked = _checkBox.INDETERMINATE;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)({
        'permissions-connect-choose-account__accounts-list-header--one-item': accounts.length === 1,
        'permissions-connect-choose-account__accounts-list-header--two-items': accounts.length > 1
      })
    }, accounts.length > 1 ? /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect-choose-account__select-all"
    }, /*#__PURE__*/_react.default.createElement(_checkBox.default, {
      className: "permissions-connect-choose-account__header-check-box",
      checked: checked,
      onClick: () => this.allAreSelected() ? this.deselectAll() : this.selectAll()
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect-choose-account__text-grey"
    }, this.context.t('selectAll')), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
      position: "bottom",
      html: /*#__PURE__*/_react.default.createElement("div", {
        style: {
          width: 200,
          padding: 4
        }
      }, t('selectingAllWillAllow'))
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-info-circle"
    }))) : null, /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect-choose-account__text-blue",
      onClick: () => selectNewAccountViaModal(this.handleAccountClick.bind(this))
    }, this.context.t('newAccount')));
  }

  render() {
    const {
      selectAccounts,
      permissionsRequestId,
      cancelPermissionsRequest,
      targetDomainMetadata,
      accounts
    } = this.props;
    const {
      selectedAccounts
    } = this.state;
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect-choose-account"
    }, /*#__PURE__*/_react.default.createElement(_permissionsConnectHeader.default, {
      icon: targetDomainMetadata.icon,
      iconName: targetDomainMetadata.name,
      headerTitle: t('connectWithMetaMask'),
      headerText: accounts.length > 0 ? t('selectAccounts') : t('connectAccountOrCreate'),
      siteOrigin: targetDomainMetadata.origin
    }), this.renderAccountsListHeader(), this.renderAccountsList(), /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect-choose-account__footer-container"
    }, /*#__PURE__*/_react.default.createElement(_permissionsConnectFooter.default, null), /*#__PURE__*/_react.default.createElement("div", {
      className: "permissions-connect-choose-account__bottom-buttons"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      onClick: () => cancelPermissionsRequest(permissionsRequestId),
      type: "default"
    }, t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      onClick: () => selectAccounts(selectedAccounts),
      type: "primary",
      disabled: selectedAccounts.size === 0
    }, t('next')))));
  }

}

exports.default = ChooseAccount;
(0, _defineProperty2.default)(ChooseAccount, "propTypes", {
  accounts: _propTypes.default.arrayOf(_propTypes.default.shape({
    address: _propTypes.default.string,
    addressLabel: _propTypes.default.string,
    lastConnectedDate: _propTypes.default.string,
    balance: _propTypes.default.string
  })).isRequired,
  selectAccounts: _propTypes.default.func.isRequired,
  selectNewAccountViaModal: _propTypes.default.func.isRequired,
  nativeCurrency: _propTypes.default.string.isRequired,
  addressLastConnectedMap: _propTypes.default.object,
  cancelPermissionsRequest: _propTypes.default.func.isRequired,
  permissionsRequestId: _propTypes.default.string.isRequired,
  selectedAccountAddresses: _propTypes.default.object.isRequired,
  targetDomainMetadata: _propTypes.default.shape({
    extensionId: _propTypes.default.string,
    icon: _propTypes.default.string,
    host: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    origin: _propTypes.default.string.isRequired
  })
});
(0, _defineProperty2.default)(ChooseAccount, "defaultProps", {
  addressLastConnectedMap: {}
});
(0, _defineProperty2.default)(ChooseAccount, "contextTypes", {
  t: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/permissions-connect/choose-account/choose-account.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/permissions-connect/choose-account/choose-account.component.js",}],
[3766, {"../../../selectors":4326,"./permission-page-container.component":3765,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _selectors = require("../../../selectors");

var _permissionPageContainer = _interopRequireDefault(require("./permission-page-container.component"));

const mapStateToProps = (state, ownProps) => {
  const {
    selectedIdentities
  } = ownProps;
  const allIdentities = (0, _selectors.getMetaMaskIdentities)(state);
  const allIdentitiesSelected = Object.keys(selectedIdentities).length === Object.keys(allIdentities).length && selectedIdentities.length > 1;
  return {
    allIdentitiesSelected
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_permissionPageContainer.default);

exports.default = _default;

//# sourceMappingURL=ui/components/app/permission-page-container/permission-page-container.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/permission-page-container/permission-page-container.container.js",}],
[3763, {"./permission-page-container-content.component":3764,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _permissionPageContainerContent.default;
  }
});

var _permissionPageContainerContent = _interopRequireDefault(require("./permission-page-container-content.component"));

//# sourceMappingURL=ui/components/app/permission-page-container/permission-page-container-content/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/permission-page-container/permission-page-container-content/index.js",}],
[3118, {"prop-types":2900,"react":3121}, function (require, module, exports) {
'use strict';

exports.__esModule = true;
exports.nameShape = undefined;
exports.transitionTimeout = transitionTimeout;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transitionTimeout(transitionType) {
  var timeoutPropName = 'transition' + transitionType + 'Timeout';
  var enabledPropName = 'transition' + transitionType;

  return function (props) {
    // If the transition is enabled
    if (props[enabledPropName]) {
      // If no timeout duration is provided
      if (props[timeoutPropName] == null) {
        return new Error(timeoutPropName + ' wasn\'t supplied to CSSTransitionGroup: ' + 'this can cause unreliable animations and won\'t be supported in ' + 'a future version of React. See ' + 'https://fb.me/react-animation-transition-group-timeout for more ' + 'information.');

        // If the duration isn't a number
      } else if (typeof props[timeoutPropName] !== 'number') {
        return new Error(timeoutPropName + ' must be a number (in milliseconds)');
      }
    }

    return null;
  };
}

var nameShape = exports.nameShape = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.shape({
  enter: _propTypes2.default.string,
  leave: _propTypes2.default.string,
  active: _propTypes2.default.string
}), _propTypes2.default.shape({
  enter: _propTypes2.default.string,
  enterActive: _propTypes2.default.string,
  leave: _propTypes2.default.string,
  leaveActive: _propTypes2.default.string,
  appear: _propTypes2.default.string,
  appearActive: _propTypes2.default.string
})]);
//# sourceMappingURL=node_modules/react-transition-group/utils/PropTypes.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-transition-group/utils/PropTypes.js",}],
[3115, {"./utils/ChildMapping":3117,"chain-function":1443,"prop-types":2900,"react":3121,"warning":3116}, function (require, module, exports) {
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chainFunction = require('chain-function');

var _chainFunction2 = _interopRequireDefault(_chainFunction);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _ChildMapping = require('./utils/ChildMapping');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  component: _propTypes2.default.any,
  childFactory: _propTypes2.default.func,
  children: _propTypes2.default.node
};

var defaultProps = {
  component: 'span',
  childFactory: function childFactory(child) {
    return child;
  }
};

var TransitionGroup = function (_React$Component) {
  _inherits(TransitionGroup, _React$Component);

  function TransitionGroup(props, context) {
    _classCallCheck(this, TransitionGroup);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.performAppear = function (key, component) {
      _this.currentlyTransitioningKeys[key] = true;

      if (component.componentWillAppear) {
        component.componentWillAppear(_this._handleDoneAppearing.bind(_this, key, component));
      } else {
        _this._handleDoneAppearing(key, component);
      }
    };

    _this._handleDoneAppearing = function (key, component) {
      if (component.componentDidAppear) {
        component.componentDidAppear();
      }

      delete _this.currentlyTransitioningKeys[key];

      var currentChildMapping = (0, _ChildMapping.getChildMapping)(_this.props.children);

      if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
        // This was removed before it had fully appeared. Remove it.
        _this.performLeave(key, component);
      }
    };

    _this.performEnter = function (key, component) {
      _this.currentlyTransitioningKeys[key] = true;

      if (component.componentWillEnter) {
        component.componentWillEnter(_this._handleDoneEntering.bind(_this, key, component));
      } else {
        _this._handleDoneEntering(key, component);
      }
    };

    _this._handleDoneEntering = function (key, component) {
      if (component.componentDidEnter) {
        component.componentDidEnter();
      }

      delete _this.currentlyTransitioningKeys[key];

      var currentChildMapping = (0, _ChildMapping.getChildMapping)(_this.props.children);

      if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
        // This was removed before it had fully entered. Remove it.
        _this.performLeave(key, component);
      }
    };

    _this.performLeave = function (key, component) {
      _this.currentlyTransitioningKeys[key] = true;

      if (component.componentWillLeave) {
        component.componentWillLeave(_this._handleDoneLeaving.bind(_this, key, component));
      } else {
        // Note that this is somewhat dangerous b/c it calls setState()
        // again, effectively mutating the component before all the work
        // is done.
        _this._handleDoneLeaving(key, component);
      }
    };

    _this._handleDoneLeaving = function (key, component) {
      if (component.componentDidLeave) {
        component.componentDidLeave();
      }

      delete _this.currentlyTransitioningKeys[key];

      var currentChildMapping = (0, _ChildMapping.getChildMapping)(_this.props.children);

      if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
        // This entered again before it fully left. Add it again.
        _this.keysToEnter.push(key);
      } else {
        _this.setState(function (state) {
          var newChildren = _extends({}, state.children);
          delete newChildren[key];
          return { children: newChildren };
        });
      }
    };

    _this.childRefs = Object.create(null);

    _this.state = {
      children: (0, _ChildMapping.getChildMapping)(props.children)
    };
    return _this;
  }

  TransitionGroup.prototype.componentWillMount = function componentWillMount() {
    this.currentlyTransitioningKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
  };

  TransitionGroup.prototype.componentDidMount = function componentDidMount() {
    var initialChildMapping = this.state.children;
    for (var key in initialChildMapping) {
      if (initialChildMapping[key]) {
        this.performAppear(key, this.childRefs[key]);
      }
    }
  };

  TransitionGroup.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var nextChildMapping = (0, _ChildMapping.getChildMapping)(nextProps.children);
    var prevChildMapping = this.state.children;

    this.setState({
      children: (0, _ChildMapping.mergeChildMappings)(prevChildMapping, nextChildMapping)
    });

    for (var key in nextChildMapping) {
      var hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key);
      if (nextChildMapping[key] && !hasPrev && !this.currentlyTransitioningKeys[key]) {
        this.keysToEnter.push(key);
      }
    }

    for (var _key in prevChildMapping) {
      var hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(_key);
      if (prevChildMapping[_key] && !hasNext && !this.currentlyTransitioningKeys[_key]) {
        this.keysToLeave.push(_key);
      }
    }

    // If we want to someday check for reordering, we could do it here.
  };

  TransitionGroup.prototype.componentDidUpdate = function componentDidUpdate() {
    var _this2 = this;

    var keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(function (key) {
      return _this2.performEnter(key, _this2.childRefs[key]);
    });

    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(function (key) {
      return _this2.performLeave(key, _this2.childRefs[key]);
    });
  };

  TransitionGroup.prototype.render = function render() {
    var _this3 = this;

    // TODO: we could get rid of the need for the wrapper node
    // by cloning a single child
    var childrenToRender = [];

    var _loop = function _loop(key) {
      var child = _this3.state.children[key];
      if (child) {
        var isCallbackRef = typeof child.ref !== 'string';
        var factoryChild = _this3.props.childFactory(child);
        var ref = function ref(r) {
          _this3.childRefs[key] = r;
        };

        "production" !== 'production' ? (0, _warning2.default)(isCallbackRef, 'string refs are not supported on children of TransitionGroup and will be ignored. ' + 'Please use a callback ref instead: https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute') : void 0;

        // Always chaining the refs leads to problems when the childFactory
        // wraps the child. The child ref callback gets called twice with the
        // wrapper and the child. So we only need to chain the ref if the
        // factoryChild is not different from child.
        if (factoryChild === child && isCallbackRef) {
          ref = (0, _chainFunction2.default)(child.ref, ref);
        }

        // You may need to apply reactive updates to a child as it is leaving.
        // The normal React way to do it won't work since the child will have
        // already been removed. In case you need this behavior you can provide
        // a childFactory function to wrap every child, even the ones that are
        // leaving.
        childrenToRender.push(_react2.default.cloneElement(factoryChild, {
          key: key,
          ref: ref
        }));
      }
    };

    for (var key in this.state.children) {
      _loop(key);
    }

    // Do not forward TransitionGroup props to primitive DOM nodes
    var props = _extends({}, this.props);
    delete props.transitionLeave;
    delete props.transitionName;
    delete props.transitionAppear;
    delete props.transitionEnter;
    delete props.childFactory;
    delete props.transitionLeaveTimeout;
    delete props.transitionEnterTimeout;
    delete props.transitionAppearTimeout;
    delete props.component;

    return _react2.default.createElement(this.props.component, props, childrenToRender);
  };

  return TransitionGroup;
}(_react2.default.Component);

TransitionGroup.displayName = 'TransitionGroup';


TransitionGroup.propTypes = "production" !== "production" ? propTypes : {};
TransitionGroup.defaultProps = defaultProps;

exports.default = TransitionGroup;
module.exports = exports['default'];
//# sourceMappingURL=node_modules/react-transition-group/TransitionGroup.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-transition-group/TransitionGroup.js",}],
[3114, {"./utils/PropTypes":3118,"dom-helpers/class/addClass":1615,"dom-helpers/class/removeClass":1617,"dom-helpers/transition/properties":1618,"dom-helpers/util/requestAnimationFrame":1620,"prop-types":2900,"react":3121,"react-dom":3037}, function (require, module, exports) {
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _addClass = require('dom-helpers/class/addClass');

var _addClass2 = _interopRequireDefault(_addClass);

var _removeClass = require('dom-helpers/class/removeClass');

var _removeClass2 = _interopRequireDefault(_removeClass);

var _requestAnimationFrame = require('dom-helpers/util/requestAnimationFrame');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _properties = require('dom-helpers/transition/properties');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _PropTypes = require('./utils/PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var events = [];
if (_properties.transitionEnd) events.push(_properties.transitionEnd);
if (_properties.animationEnd) events.push(_properties.animationEnd);

function addEndListener(node, listener) {
  if (events.length) {
    events.forEach(function (e) {
      return node.addEventListener(e, listener, false);
    });
  } else {
    setTimeout(listener, 0);
  }

  return function () {
    if (!events.length) return;
    events.forEach(function (e) {
      return node.removeEventListener(e, listener, false);
    });
  };
}

var propTypes = {
  children: _propTypes2.default.node,
  name: _PropTypes.nameShape.isRequired,

  // Once we require timeouts to be specified, we can remove the
  // boolean flags (appear etc.) and just accept a number
  // or a bool for the timeout flags (appearTimeout etc.)
  appear: _propTypes2.default.bool,
  enter: _propTypes2.default.bool,
  leave: _propTypes2.default.bool,
  appearTimeout: _propTypes2.default.number,
  enterTimeout: _propTypes2.default.number,
  leaveTimeout: _propTypes2.default.number
};

var CSSTransitionGroupChild = function (_React$Component) {
  _inherits(CSSTransitionGroupChild, _React$Component);

  function CSSTransitionGroupChild() {
    var _temp, _this, _ret;

    _classCallCheck(this, CSSTransitionGroupChild);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.componentWillAppear = function (done) {
      if (_this.props.appear) {
        _this.transition('appear', done, _this.props.appearTimeout);
      } else {
        done();
      }
    }, _this.componentWillEnter = function (done) {
      if (_this.props.enter) {
        _this.transition('enter', done, _this.props.enterTimeout);
      } else {
        done();
      }
    }, _this.componentWillLeave = function (done) {
      if (_this.props.leave) {
        _this.transition('leave', done, _this.props.leaveTimeout);
      } else {
        done();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  CSSTransitionGroupChild.prototype.componentWillMount = function componentWillMount() {
    this.classNameAndNodeQueue = [];
    this.transitionTimeouts = [];
  };

  CSSTransitionGroupChild.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.transitionTimeouts.forEach(function (timeout) {
      clearTimeout(timeout);
    });

    this.classNameAndNodeQueue.length = 0;
  };

  CSSTransitionGroupChild.prototype.transition = function transition(animationType, finishCallback, timeout) {
    var node = (0, _reactDom.findDOMNode)(this);

    if (!node) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }

    var className = this.props.name[animationType] || this.props.name + '-' + animationType;
    var activeClassName = this.props.name[animationType + 'Active'] || className + '-active';
    var timer = null;
    var removeListeners = void 0;

    (0, _addClass2.default)(node, className);

    // Need to do this to actually trigger a transition.
    this.queueClassAndNode(activeClassName, node);

    // Clean-up the animation after the specified delay
    var finish = function finish(e) {
      if (e && e.target !== node) {
        return;
      }

      clearTimeout(timer);
      if (removeListeners) removeListeners();

      (0, _removeClass2.default)(node, className);
      (0, _removeClass2.default)(node, activeClassName);

      if (removeListeners) removeListeners();

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback();
      }
    };

    if (timeout) {
      timer = setTimeout(finish, timeout);
      this.transitionTimeouts.push(timer);
    } else if (_properties.transitionEnd) {
      removeListeners = addEndListener(node, finish);
    }
  };

  CSSTransitionGroupChild.prototype.queueClassAndNode = function queueClassAndNode(className, node) {
    var _this2 = this;

    this.classNameAndNodeQueue.push({
      className: className,
      node: node
    });

    if (!this.rafHandle) {
      this.rafHandle = (0, _requestAnimationFrame2.default)(function () {
        return _this2.flushClassNameAndNodeQueue();
      });
    }
  };

  CSSTransitionGroupChild.prototype.flushClassNameAndNodeQueue = function flushClassNameAndNodeQueue() {
    if (!this.unmounted) {
      this.classNameAndNodeQueue.forEach(function (obj) {
        // This is for to force a repaint,
        // which is necessary in order to transition styles when adding a class name.
        /* eslint-disable no-unused-expressions */
        obj.node.scrollTop;
        /* eslint-enable no-unused-expressions */
        (0, _addClass2.default)(obj.node, obj.className);
      });
    }
    this.classNameAndNodeQueue.length = 0;
    this.rafHandle = null;
  };

  CSSTransitionGroupChild.prototype.render = function render() {
    var props = _extends({}, this.props);
    delete props.name;
    delete props.appear;
    delete props.enter;
    delete props.leave;
    delete props.appearTimeout;
    delete props.enterTimeout;
    delete props.leaveTimeout;
    delete props.children;
    return _react2.default.cloneElement(_react2.default.Children.only(this.props.children), props);
  };

  return CSSTransitionGroupChild;
}(_react2.default.Component);

CSSTransitionGroupChild.displayName = 'CSSTransitionGroupChild';


CSSTransitionGroupChild.propTypes = "production" !== "production" ? propTypes : {};

exports.default = CSSTransitionGroupChild;
module.exports = exports['default'];
//# sourceMappingURL=node_modules/react-transition-group/CSSTransitionGroupChild.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/react-transition-group/CSSTransitionGroupChild.js",}],
[3948, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

class Tabs extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      activeTabIndex: Math.max(this._findChildByName(this.props.defaultActiveTabName), 0)
    });
  }

  handleTabClick(tabIndex, tabName) {
    const {
      onTabClick
    } = this.props;
    const {
      activeTabIndex
    } = this.state;

    if (tabIndex !== activeTabIndex) {
      this.setState({
        activeTabIndex: tabIndex
      }, () => {
        if (onTabClick) {
          onTabClick(tabName);
        }
      });
    }
  }

  renderTabs() {
    const numberOfTabs = _react.default.Children.count(this.props.children);

    return _react.default.Children.map(this.props.children, (child, index) => {
      const tabName = child === null || child === void 0 ? void 0 : child.props.name;
      return child && /*#__PURE__*/_react.default.cloneElement(child, {
        onClick: idx => this.handleTabClick(idx, tabName),
        tabIndex: index,
        isActive: numberOfTabs > 1 && index === this.state.activeTabIndex
      });
    });
  }

  renderActiveTabContent() {
    const {
      children
    } = this.props;
    const {
      activeTabIndex
    } = this.state;

    if (Array.isArray(children) && !children[activeTabIndex] || !Array.isArray(children) && activeTabIndex !== 0) {
      throw new Error(`Tab at index '${activeTabIndex}' does not exist`);
    }

    return children[activeTabIndex] ? children[activeTabIndex].props.children : children.props.children;
  }

  render() {
    const {
      tabsClassName
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "tabs"
    }, /*#__PURE__*/_react.default.createElement("ul", {
      className: (0, _classnames.default)('tabs__list', tabsClassName)
    }, this.renderTabs()), /*#__PURE__*/_react.default.createElement("div", {
      className: "tabs__content"
    }, this.renderActiveTabContent()));
  }
  /**
   * Returns the index of the child with the given name
   * @param {string} name - the name to search for
   * @returns {number} the index of the child with the given name
   * @private
   */


  _findChildByName(name) {
    return _react.default.Children.toArray(this.props.children).findIndex(c => (c === null || c === void 0 ? void 0 : c.props.name) === name);
  }

}

exports.default = Tabs;
(0, _defineProperty2.default)(Tabs, "defaultProps", {
  defaultActiveTabName: null,
  onTabClick: null,
  tabsClassName: undefined
});
(0, _defineProperty2.default)(Tabs, "propTypes", {
  defaultActiveTabName: _propTypes.default.string,
  onTabClick: _propTypes.default.func,
  children: _propTypes.default.node.isRequired,
  tabsClassName: _propTypes.default.string
});

//# sourceMappingURL=ui/components/ui/tabs/tabs.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/tabs/tabs.component.js",}],
[3946, {"./tab.component":3947,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tab = _interopRequireDefault(require("./tab.component"));

var _default = _tab.default;
exports.default = _default;

//# sourceMappingURL=ui/components/ui/tabs/tab/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/tabs/tab/index.js",}],
[3897, {"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = InfoTooltipIcon;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function InfoTooltipIcon({
  fillColor = '#b8b8b8'
}) {
  return /*#__PURE__*/_react.default.createElement("svg", {
    viewBox: "0 0 10 10",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M5 0C2.2 0 0 2.2 0 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 2c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.2-.7-.6.3-.8.7-.8zm.7 6H4.3V4.3h1.5V8z",
    fill: fillColor
  }));
}

InfoTooltipIcon.propTypes = {
  fillColor: _propTypes.default.string
};

//# sourceMappingURL=ui/components/ui/info-tooltip/info-tooltip-icon.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/info-tooltip/info-tooltip-icon.js",}],
[4172, {"../../../components/ui/text-field":3951,"../../../helpers/utils/util":4020,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@material-ui/core/InputAdornment":554,"fuse.js":1881,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _fuse = _interopRequireDefault(require("fuse.js"));

var _InputAdornment = _interopRequireDefault(require("@material-ui/core/InputAdornment"));

var _textField = _interopRequireDefault(require("../../../components/ui/text-field"));

var _util = require("../../../helpers/utils/util");

class TokenSearch extends _react.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "state", {
      searchQuery: ''
    });
    const {
      tokenList
    } = this.props;
    this.tokenList = Object.values(tokenList);
    this.tokenSearchFuse = new _fuse.default(this.tokenList, {
      shouldSort: true,
      threshold: 0.45,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [{
        name: 'name',
        weight: 0.5
      }, {
        name: 'symbol',
        weight: 0.5
      }]
    });
  }

  handleSearch(searchQuery) {
    this.setState({
      searchQuery
    });
    const fuseSearchResult = this.tokenSearchFuse.search(searchQuery);
    const addressSearchResult = this.tokenList.filter(token => {
      return token.address && searchQuery && (0, _util.isEqualCaseInsensitive)(token.address, searchQuery);
    });
    const results = [...addressSearchResult, ...fuseSearchResult];
    this.props.onSearch({
      searchQuery,
      results
    });
  }

  renderAdornment() {
    return /*#__PURE__*/_react.default.createElement(_InputAdornment.default, {
      position: "start",
      style: {
        marginRight: '12px'
      }
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "images/search.svg",
      width: "17",
      height: "17",
      alt: ""
    }));
  }

  render() {
    const {
      error
    } = this.props;
    const {
      searchQuery
    } = this.state;
    return /*#__PURE__*/_react.default.createElement(_textField.default, {
      id: "search-tokens",
      placeholder: this.context.t('searchTokens'),
      type: "text",
      value: searchQuery,
      onChange: e => this.handleSearch(e.target.value),
      error: error,
      fullWidth: true,
      autoFocus: true,
      autoComplete: "off",
      startAdornment: this.renderAdornment()
    });
  }

}

exports.default = TokenSearch;
(0, _defineProperty2.default)(TokenSearch, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(TokenSearch, "defaultProps", {
  error: null
});
(0, _defineProperty2.default)(TokenSearch, "propTypes", {
  onSearch: _propTypes.default.func,
  error: _propTypes.default.string,
  tokenList: _propTypes.default.object
});

//# sourceMappingURL=ui/pages/import-token/token-search/token-search.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/import-token/token-search/token-search.component.js",}],
[3965, {"../../../helpers/constants/design-system":3992,"../box":3838,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Typography;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _designSystem = require("../../../helpers/constants/design-system");

var _box = _interopRequireDefault(require("../box"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const {
  H6,
  H7,
  H8,
  H9
} = _designSystem.TYPOGRAPHY;

function Typography({
  variant = _designSystem.TYPOGRAPHY.Paragraph,
  className,
  color = _designSystem.COLORS.BLACK,
  tag,
  children,
  fontWeight = 'normal',
  fontStyle = 'normal',
  align,
  boxProps = {}
}) {
  const computedClassName = (0, _classnames.default)('typography', className, `typography--${variant}`, `typography--weight-${fontWeight}`, `typography--style-${fontStyle}`, {
    [`typography--align-${align}`]: Boolean(align),
    [`typography--color-${color}`]: Boolean(color)
  });
  let Tag = tag !== null && tag !== void 0 ? tag : variant;

  if (Tag === _designSystem.TYPOGRAPHY.Paragraph) {
    Tag = 'p';
  } else if ([H7, H8, H9].includes(Tag)) {
    Tag = H6;
  }

  return /*#__PURE__*/_react.default.createElement(_box.default, (0, _extends2.default)({
    margin: [1, 0]
  }, boxProps), boxClassName => /*#__PURE__*/_react.default.createElement(Tag, {
    className: (0, _classnames.default)(boxClassName, computedClassName)
  }, children));
}

Typography.propTypes = {
  variant: _propTypes.default.oneOf(Object.values(_designSystem.TYPOGRAPHY)),
  children: _propTypes.default.node.isRequired,
  color: _propTypes.default.oneOf(Object.values(_designSystem.COLORS)),
  className: _propTypes.default.string,
  align: _propTypes.default.oneOf(Object.values(_designSystem.TEXT_ALIGN)),
  boxProps: _propTypes.default.shape(_objectSpread({}, _box.default.propTypes)),
  fontWeight: _propTypes.default.oneOf(Object.values(_designSystem.FONT_WEIGHT)),
  fontStyle: _propTypes.default.oneOf(Object.values(_designSystem.FONT_STYLE)),
  tag: _propTypes.default.oneOf(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'dt', 'dd', 'i'])
};

//# sourceMappingURL=ui/components/ui/typography/typography.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/typography/typography.js",}],
[3924, {"./page-container-footer":3920,"./page-container-header":3922,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _pageContainerHeader = _interopRequireDefault(require("./page-container-header"));

var _pageContainerFooter = _interopRequireDefault(require("./page-container-footer"));

class PageContainer extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      activeTabIndex: this.props.defaultActiveTabIndex || 0
    });
  }

  handleTabClick(activeTabIndex) {
    this.setState({
      activeTabIndex
    });
  }

  renderTabs() {
    const {
      tabsComponent
    } = this.props;

    if (!tabsComponent) {
      return null;
    }

    const numberOfTabs = _react.default.Children.count(tabsComponent.props.children);

    return _react.default.Children.map(tabsComponent.props.children, (child, tabIndex) => {
      return child && /*#__PURE__*/_react.default.cloneElement(child, {
        onClick: index => this.handleTabClick(index),
        tabIndex,
        isActive: numberOfTabs > 1 && tabIndex === this.state.activeTabIndex,
        key: tabIndex,
        className: 'page-container__tab'
      });
    });
  }

  renderActiveTabContent() {
    const {
      tabsComponent
    } = this.props;
    let {
      children
    } = tabsComponent.props;
    children = children.filter(Boolean);
    const {
      activeTabIndex
    } = this.state;
    return children[activeTabIndex] ? children[activeTabIndex].props.children : children.props.children;
  }

  renderContent() {
    const {
      contentComponent,
      tabsComponent
    } = this.props;

    if (contentComponent) {
      return contentComponent;
    } else if (tabsComponent) {
      return this.renderActiveTabContent();
    }

    return null;
  }

  getTabSubmitText() {
    const {
      tabsComponent
    } = this.props;
    const {
      activeTabIndex
    } = this.state;

    if (tabsComponent) {
      var _children$activeTabIn;

      let {
        children
      } = tabsComponent.props;
      children = children.filter(Boolean);

      if (((_children$activeTabIn = children[activeTabIndex]) === null || _children$activeTabIn === void 0 ? void 0 : _children$activeTabIn.key) === 'custom-tab') {
        return this.context.t('addCustomToken');
      }
    }

    return null;
  }

  render() {
    const {
      title,
      subtitle,
      onClose,
      showBackButton,
      onBackButtonClick,
      backButtonStyles,
      backButtonString,
      onCancel,
      cancelText,
      onSubmit,
      submitText,
      disabled,
      headerCloseText,
      hideCancel
    } = this.props;
    const tabSubmitText = this.getTabSubmitText();
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container"
    }, /*#__PURE__*/_react.default.createElement(_pageContainerHeader.default, {
      title: title,
      subtitle: subtitle,
      onClose: onClose,
      showBackButton: showBackButton,
      onBackButtonClick: onBackButtonClick,
      backButtonStyles: backButtonStyles,
      backButtonString: backButtonString,
      tabs: this.renderTabs(),
      headerCloseText: headerCloseText
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__bottom"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__content"
    }, this.renderContent()), /*#__PURE__*/_react.default.createElement(_pageContainerFooter.default, {
      onCancel: onCancel,
      cancelText: cancelText,
      hideCancel: hideCancel,
      onSubmit: onSubmit,
      submitText: tabSubmitText || submitText,
      disabled: disabled,
      submitButtonType: "primary"
    })));
  }

}

exports.default = PageContainer;
(0, _defineProperty2.default)(PageContainer, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(PageContainer, "propTypes", {
  // PageContainerHeader props
  backButtonString: _propTypes.default.string,
  backButtonStyles: _propTypes.default.object,
  headerCloseText: _propTypes.default.string,
  onBackButtonClick: _propTypes.default.func,
  onClose: _propTypes.default.func,
  showBackButton: _propTypes.default.bool,
  subtitle: _propTypes.default.string,
  title: _propTypes.default.string.isRequired,
  // Tabs-related props
  defaultActiveTabIndex: _propTypes.default.number,
  tabsComponent: _propTypes.default.node,
  // Content props
  contentComponent: _propTypes.default.node,
  // PageContainerFooter props
  cancelText: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  hideCancel: _propTypes.default.bool,
  onCancel: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  submitText: _propTypes.default.string
});

//# sourceMappingURL=ui/components/ui/page-container/page-container.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/page-container/page-container.component.js",}],
[3922, {"./page-container-header.component":3923,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _pageContainerHeader.default;
  }
});

var _pageContainerHeader = _interopRequireDefault(require("./page-container-header.component"));

//# sourceMappingURL=ui/components/ui/page-container/page-container-header/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/page-container/page-container-header/index.js",}],
[3920, {"./page-container-footer.component":3921,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _pageContainerFooter.default;
  }
});

var _pageContainerFooter = _interopRequireDefault(require("./page-container-footer.component"));

//# sourceMappingURL=ui/components/ui/page-container/page-container-footer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/page-container/page-container-footer/index.js",}],
[4170, {"./token-list.component":4169,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _tokenList = _interopRequireDefault(require("./token-list.component"));

const mapStateToProps = ({
  metamask
}) => {
  const {
    tokens,
    useTokenDetection
  } = metamask;
  return {
    tokens,
    useTokenDetection
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_tokenList.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/import-token/token-list/token-list.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/import-token/token-list/token-list.container.js",}],
[3960, {"./tooltip":3961,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _tooltip.default;
  }
});

var _tooltip = _interopRequireDefault(require("./tooltip"));

//# sourceMappingURL=ui/components/ui/tooltip/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/tooltip/index.js",}],
[3652, {"./connected-accounts-list.component":3651,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _connectedAccountsList.default;
  }
});

var _connectedAccountsList = _interopRequireDefault(require("./connected-accounts-list.component"));

//# sourceMappingURL=ui/components/app/connected-accounts-list/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/connected-accounts-list/index.js",}],
[4251, {"../../../components/ui/button":3842,"../../../helpers/utils/build-types":4006,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _button = _interopRequireDefault(require("../../../components/ui/button"));

var _buildTypes = require("../../../helpers/utils/build-types");

class InfoTab extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      version: global.platform.getVersion()
    });
  }

  renderInfoLinks() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__content-item settings-page__content-item--without-height"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__link-header"
    }, t('links')), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__link-item"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      href: "https://monstainfinite.com/privacy-policy",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "info-tab__link-text"
    }, t('privacyMsg'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__link-item"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      href: "https://monstainfinite.com/terms-of-use/",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "info-tab__link-text"
    }, t('terms'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__link-item"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      href: "https://metamask.io/attributions.html",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "info-tab__link-text"
    }, t('attributions'))), /*#__PURE__*/_react.default.createElement("hr", {
      className: "info-tab__separator"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__link-item"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      href: "https://discord.gg/RCBhq6b6gA",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "info-tab__link-text"
    }, t('supportCenter'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__link-item"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      href: "https://metamask.io/",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "info-tab__link-text"
    }, t('visitWebSite'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__link-item"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      href: "https://discord.gg/RCBhq6b6gA",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "info-tab__link-text"
    }, t('contactUs'))));
  }

  render() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__body"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__content-row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "settings-page__content-item settings-page__content-item--without-height"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__item"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__version-header"
    }, (0, _buildTypes.isBeta)() ? t('betaMetamaskVersion') : t('metamaskVersion')), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__version-number"
    }, this.state.version)), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__item"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__about"
    }, t('builtAroundTheWorld')))), this.renderInfoLinks()), /*#__PURE__*/_react.default.createElement("div", {
      className: "info-tab__logo-wrapper"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "./images/info-logo.png",
      className: "info-tab__logo",
      alt: ""
    })));
  }

}

exports.default = InfoTab;
(0, _defineProperty2.default)(InfoTab, "contextTypes", {
  t: _propTypes.default.func
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/settings/info-tab/info-tab.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/info-tab/info-tab.component.js",}],
[3790, {"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

const TabBar = props => {
  const {
    tabs = [],
    onSelect,
    isActive
  } = props;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar"
  }, tabs.map(({
    key,
    content,
    description
  }) => /*#__PURE__*/_react.default.createElement("button", {
    key: key,
    className: (0, _classnames.default)('tab-bar__tab pointer', {
      'tab-bar__tab--active': isActive(key, content)
    }),
    onClick: () => onSelect(key)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar__tab__content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar__tab__content__title"
  }, content), /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar__tab__content__description"
  }, description)), /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar__tab__caret"
  }))));
};

TabBar.propTypes = {
  isActive: _propTypes.default.func.isRequired,
  tabs: _propTypes.default.array,
  onSelect: _propTypes.default.func
};
var _default = TabBar;
exports.default = _default;

//# sourceMappingURL=ui/components/app/tab-bar/tab-bar.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/tab-bar/tab-bar.js",}],
[4263, {"../../../selectors":4326,"../../../store/actions":4331,"./settings-tab.component":4262,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _settingsTab = _interopRequireDefault(require("./settings-tab.component"));

const mapStateToProps = state => {
  const {
    appState: {
      warning
    },
    metamask
  } = state;
  const {
    currentCurrency,
    conversionDate,
    nativeCurrency,
    useBlockie,
    currentLocale
  } = metamask;
  const {
    useNativeCurrencyAsPrimaryCurrency,
    hideZeroBalanceTokens
  } = (0, _selectors.getPreferences)(state);
  return {
    warning,
    currentLocale,
    currentCurrency,
    conversionDate,
    nativeCurrency,
    useBlockie,
    useNativeCurrencyAsPrimaryCurrency,
    hideZeroBalanceTokens
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentCurrency: currency => dispatch((0, _actions.setCurrentCurrency)(currency)),
    setUseBlockie: value => dispatch((0, _actions.setUseBlockie)(value)),
    updateCurrentLocale: key => dispatch((0, _actions.updateCurrentLocale)(key)),
    setUseNativeCurrencyAsPrimaryCurrencyPreference: value => {
      return dispatch((0, _actions.setUseNativeCurrencyAsPrimaryCurrencyPreference)(value));
    },
    setParticipateInMetaMetrics: val => dispatch((0, _actions.setParticipateInMetaMetrics)(val)),
    setHideZeroBalanceTokens: value => dispatch((0, _actions.setHideZeroBalanceTokens)(value))
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_settingsTab.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/settings/settings-tab/settings-tab.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/settings-tab/settings-tab.container.js",}],
[4230, {"../../../selectors":4326,"../../../store/actions":4331,"./advanced-tab.component":4229,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.mapDispatchToProps = exports.mapStateToProps = void 0;

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _advancedTab = _interopRequireDefault(require("./advanced-tab.component"));

const mapStateToProps = state => {
  const {
    appState: {
      warning
    },
    metamask
  } = state;
  const {
    featureFlags: {
      sendHexData,
      advancedInlineGas
    } = {},
    threeBoxSyncingAllowed,
    threeBoxDisabled,
    useNonceField,
    ipfsGateway,
    useLedgerLive,
    dismissSeedBackUpReminder
  } = metamask;
  const {
    showFiatInTestnets,
    autoLockTimeLimit
  } = (0, _selectors.getPreferences)(state);
  return {
    warning,
    sendHexData,
    advancedInlineGas,
    showFiatInTestnets,
    autoLockTimeLimit,
    threeBoxSyncingAllowed,
    threeBoxDisabled,
    useNonceField,
    ipfsGateway,
    useLedgerLive,
    dismissSeedBackUpReminder
  };
};

exports.mapStateToProps = mapStateToProps;

const mapDispatchToProps = dispatch => {
  return {
    setHexDataFeatureFlag: shouldShow => dispatch((0, _actions.setFeatureFlag)('sendHexData', shouldShow)),
    displayWarning: warning => dispatch((0, _actions.displayWarning)(warning)),
    showResetAccountConfirmationModal: () => dispatch((0, _actions.showModal)({
      name: 'CONFIRM_RESET_ACCOUNT'
    })),
    setAdvancedInlineGasFeatureFlag: shouldShow => dispatch((0, _actions.setFeatureFlag)('advancedInlineGas', shouldShow)),
    setUseNonceField: value => dispatch((0, _actions.setUseNonceField)(value)),
    setShowFiatConversionOnTestnetsPreference: value => {
      return dispatch((0, _actions.setShowFiatConversionOnTestnetsPreference)(value));
    },
    setAutoLockTimeLimit: value => {
      return dispatch((0, _actions.setAutoLockTimeLimit)(value));
    },
    setThreeBoxSyncingPermission: newThreeBoxSyncingState => {
      if (newThreeBoxSyncingState) {
        dispatch((0, _actions.turnThreeBoxSyncingOnAndInitialize)());
      } else {
        dispatch((0, _actions.setThreeBoxSyncingPermission)(newThreeBoxSyncingState));
      }
    },
    setIpfsGateway: value => {
      return dispatch((0, _actions.setIpfsGateway)(value));
    },
    setLedgerLivePreference: value => {
      return dispatch((0, _actions.setLedgerLivePreference)(value));
    },
    setDismissSeedBackUpReminder: value => {
      return dispatch((0, _actions.setDismissSeedBackUpReminder)(value));
    }
  };
};

exports.mapDispatchToProps = mapDispatchToProps;

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_advancedTab.default);

exports.default = _default;


//# sourceMappingURL=ui/pages/settings/advanced-tab/advanced-tab.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/advanced-tab/advanced-tab.container.js",}],
[4260, {"../../../store/actions":4331,"./security-tab.component":4259,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _actions = require("../../../store/actions");

var _securityTab = _interopRequireDefault(require("./security-tab.component"));

const mapStateToProps = state => {
  const {
    appState: {
      warning
    },
    metamask
  } = state;
  const {
    featureFlags: {
      showIncomingTransactions
    } = {},
    participateInMetaMetrics,
    usePhishDetect
  } = metamask;
  return {
    warning,
    showIncomingTransactions,
    participateInMetaMetrics,
    usePhishDetect
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setParticipateInMetaMetrics: val => dispatch((0, _actions.setParticipateInMetaMetrics)(val)),
    setShowIncomingTransactionsFeatureFlag: shouldShow => dispatch((0, _actions.setFeatureFlag)('showIncomingTransactions', shouldShow)),
    setUsePhishDetect: val => dispatch((0, _actions.setUsePhishDetect)(val))
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_securityTab.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/settings/security-tab/security-tab.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/security-tab/security-tab.container.js",}],
[4247, {"../../../selectors":4326,"../../../store/actions":4331,"./experimental-tab.component":4246,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _experimentalTab = _interopRequireDefault(require("./experimental-tab.component"));

const mapStateToProps = state => {
  return {
    useTokenDetection: (0, _selectors.getUseTokenDetection)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUseTokenDetection: val => dispatch((0, _actions.setUseTokenDetection)(val))
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_experimentalTab.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/settings/experimental-tab/experimental-tab.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/experimental-tab/experimental-tab.container.js",}],
[4232, {"../../../../shared/constants/alerts":3590,"../../../components/ui/toggle-button":3953,"../../../components/ui/tooltip":3960,"../../../ducks/metamask/metamask":3985,"../../../hooks/useI18nContext":4030,"../../../store/actions":4331,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _alerts = require("../../../../shared/constants/alerts");

var _tooltip = _interopRequireDefault(require("../../../components/ui/tooltip"));

var _toggleButton = _interopRequireDefault(require("../../../components/ui/toggle-button"));

var _actions = require("../../../store/actions");

var _metamask = require("../../../ducks/metamask/metamask");

var _useI18nContext = require("../../../hooks/useI18nContext");

const AlertSettingsEntry = ({
  alertId,
  description,
  title
}) => {
  const t = (0, _useI18nContext.useI18nContext)();
  const isEnabled = (0, _reactRedux.useSelector)(state => (0, _metamask.getAlertEnabledness)(state)[alertId]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", null, title), /*#__PURE__*/_react.default.createElement(_tooltip.default, {
    position: "top",
    title: description,
    wrapperClassName: "alerts-tab__description"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-info-circle"
  })), /*#__PURE__*/_react.default.createElement(_toggleButton.default, {
    offLabel: t('off'),
    onLabel: t('on'),
    onToggle: () => (0, _actions.setAlertEnabledness)(alertId, !isEnabled),
    value: isEnabled
  }));
};

AlertSettingsEntry.propTypes = {
  alertId: _propTypes.default.string.isRequired,
  description: _propTypes.default.string.isRequired,
  title: _propTypes.default.string.isRequired
};

const AlertsTab = () => {
  const t = (0, _useI18nContext.useI18nContext)();
  const alertConfig = {
    [_alerts.ALERT_TYPES.unconnectedAccount]: {
      title: t('alertSettingsUnconnectedAccount'),
      description: t('alertSettingsUnconnectedAccountDescription')
    },
    [_alerts.ALERT_TYPES.web3ShimUsage]: {
      title: t('alertSettingsWeb3ShimUsage'),
      description: t('alertSettingsWeb3ShimUsageDescription')
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "alerts-tab__body"
  }, Object.entries(alertConfig).map(([alertId, {
    title,
    description
  }]) => /*#__PURE__*/_react.default.createElement(AlertSettingsEntry, {
    alertId: alertId,
    description: description,
    key: alertId,
    title: title
  })));
};

var _default = AlertsTab;
exports.default = _default;

//# sourceMappingURL=ui/pages/settings/alerts-tab/alerts-tab.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/alerts-tab/alerts-tab.js",}],
[4257, {"../../../../app/scripts/lib/util":78,"../../../../shared/constants/app":3591,"../../../../shared/constants/network":3595,"../../../helpers/constants/routes":3995,"../../../store/actions":4331,"./networks-tab.component":4255,"./networks-tab.constants":4256,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _actions = require("../../../store/actions");

var _routes = require("../../../helpers/constants/routes");

var _app = require("../../../../shared/constants/app");

var _network = require("../../../../shared/constants/network");

var _util = require("../../../../app/scripts/lib/util");

var _networksTab = _interopRequireDefault(require("./networks-tab.component"));

var _networksTab2 = require("./networks-tab.constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const defaultNetworks = _networksTab2.defaultNetworksData.map(network => _objectSpread(_objectSpread({}, network), {}, {
  viewOnly: true
}));

const mapStateToProps = (state, ownProps) => {
  const {
    location: {
      pathname
    }
  } = ownProps;
  const environmentType = (0, _util.getEnvironmentType)();
  const isFullScreen = environmentType === _app.ENVIRONMENT_TYPE_FULLSCREEN;
  const shouldRenderNetworkForm = isFullScreen || Boolean(pathname.match(_routes.NETWORKS_FORM_ROUTE));
  const {
    frequentRpcListDetail,
    provider
  } = state.metamask;
  const {
    networksTabSelectedRpcUrl,
    networksTabIsInAddMode
  } = state.appState;
  const frequentRpcNetworkListDetails = frequentRpcListDetail.map(rpc => {
    var _rpc$rpcPrefs;

    return {
      label: rpc.nickname,
      iconColor: '#6A737D',
      providerType: _network.NETWORK_TYPE_RPC,
      rpcUrl: rpc.rpcUrl,
      chainId: rpc.chainId,
      ticker: rpc.ticker,
      blockExplorerUrl: ((_rpc$rpcPrefs = rpc.rpcPrefs) === null || _rpc$rpcPrefs === void 0 ? void 0 : _rpc$rpcPrefs.blockExplorerUrl) || ''
    };
  });
  const networksToRender = [...defaultNetworks, ...frequentRpcNetworkListDetails];
  let selectedNetwork = networksToRender.find(network => network.rpcUrl === networksTabSelectedRpcUrl) || {};
  const networkIsSelected = Boolean(selectedNetwork.rpcUrl);
  let networkDefaultedToProvider = false;

  if (!networkIsSelected && !networksTabIsInAddMode) {
    selectedNetwork = networksToRender.find(network => {
      return network.rpcUrl === provider.rpcUrl || network.providerType !== _network.NETWORK_TYPE_RPC && network.providerType === provider.type;
    }) || {};
    networkDefaultedToProvider = true;
  }

  return {
    selectedNetwork,
    networksToRender,
    networkIsSelected,
    networksTabIsInAddMode,
    providerType: provider.type,
    providerUrl: provider.rpcUrl,
    networkDefaultedToProvider,
    isFullScreen,
    shouldRenderNetworkForm
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSelectedSettingsRpcUrl: newRpcUrl => dispatch((0, _actions.setSelectedSettingsRpcUrl)(newRpcUrl)),
    setRpcTarget: (newRpc, chainId, ticker, nickname, rpcPrefs) => {
      return dispatch((0, _actions.updateAndSetCustomRpc)(newRpc, chainId, ticker, nickname, rpcPrefs));
    },
    showConfirmDeleteNetworkModal: ({
      target,
      onConfirm
    }) => {
      return dispatch((0, _actions.showModal)({
        name: 'CONFIRM_DELETE_NETWORK',
        target,
        onConfirm
      }));
    },
    displayWarning: warning => dispatch((0, _actions.displayWarning)(warning)),
    setNetworksTabAddMode: isInAddMode => dispatch((0, _actions.setNetworksTabAddMode)(isInAddMode)),
    editRpc: (oldRpc, newRpc, chainId, ticker, nickname, rpcPrefs) => {
      return dispatch((0, _actions.editRpc)(oldRpc, newRpc, chainId, ticker, nickname, rpcPrefs));
    }
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_networksTab.default);

exports.default = _default;


//# sourceMappingURL=ui/pages/settings/networks-tab/networks-tab.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/networks-tab/networks-tab.container.js",}],
[4238, {"../../../../app/scripts/lib/util":78,"../../../../shared/constants/app":3591,"../../../helpers/constants/routes":3995,"../../../selectors":4326,"./contact-list-tab.component":4237,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _selectors = require("../../../selectors");

var _app = require("../../../../shared/constants/app");

var _util = require("../../../../app/scripts/lib/util");

var _routes = require("../../../helpers/constants/routes");

var _contactListTab = _interopRequireDefault(require("./contact-list-tab.component"));

const mapStateToProps = (state, ownProps) => {
  const {
    location
  } = ownProps;
  const {
    pathname
  } = location;
  const pathNameTail = pathname.match(/[^/]+$/u)[0];
  const pathNameTailIsAddress = pathNameTail.includes('0x');
  const viewingContact = Boolean(pathname.match(_routes.CONTACT_VIEW_ROUTE));
  const editingContact = Boolean(pathname.match(_routes.CONTACT_EDIT_ROUTE));
  const addingContact = Boolean(pathname.match(_routes.CONTACT_ADD_ROUTE));

  const envIsPopup = (0, _util.getEnvironmentType)() === _app.ENVIRONMENT_TYPE_POPUP;

  const hideAddressBook = envIsPopup && (viewingContact || editingContact || addingContact);
  return {
    viewingContact,
    editingContact,
    addingContact,
    addressBook: (0, _selectors.getAddressBook)(state),
    selectedAddress: pathNameTailIsAddress ? pathNameTail : '',
    hideAddressBook,
    envIsPopup,
    showContactContent: !envIsPopup || hideAddressBook
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps))(_contactListTab.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/settings/contact-list-tab/contact-list-tab.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/settings/contact-list-tab/contact-list-tab.container.js",}],
[3928, {"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PulseLoader;

var _react = _interopRequireDefault(require("react"));

function PulseLoader() {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "pulse-loader"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "pulse-loader__loading-dot-one"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "pulse-loader__loading-dot-two"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "pulse-loader__loading-dot-three"
  }));
}

//# sourceMappingURL=ui/components/ui/pulse-loader/pulse-loader.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/pulse-loader/pulse-loader.js",}],
[4312, {"../../../components/ui/page-container/page-container-footer":3920,"../../../contexts/i18n":3970,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SwapsFooter;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../../contexts/i18n");

var _pageContainerFooter = _interopRequireDefault(require("../../../components/ui/page-container/page-container-footer"));

function SwapsFooter({
  onCancel,
  hideCancel,
  onSubmit,
  submitText,
  disabled,
  showTermsOfService,
  showTopBorder,
  className = ''
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps-footer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('swaps-footer__buttons', className, {
      'swaps-footer__buttons--border': showTopBorder
    })
  }, /*#__PURE__*/_react.default.createElement(_pageContainerFooter.default, {
    onCancel: onCancel,
    hideCancel: hideCancel,
    cancelText: t('back'),
    onSubmit: onSubmit,
    submitText: submitText,
    submitButtonType: "confirm",
    footerClassName: (0, _classnames.default)('swaps-footer__custom-page-container-footer-class', className),
    footerButtonClassName: (0, _classnames.default)('swaps-footer__custom-page-container-footer-button-class', {
      'swaps-footer__custom-page-container-footer-button-class--single': hideCancel
    }),
    disabled: disabled
  })), showTermsOfService && /*#__PURE__*/_react.default.createElement("div", {
    className: "swaps-footer__bottom-text",
    onClick: () => global.platform.openTab({
      url: 'https://monstainfinite.com/terms-of-use/'
    })
  }, t('termsOfService')));
}

SwapsFooter.propTypes = {
  onCancel: _propTypes.default.func,
  hideCancel: _propTypes.default.bool,
  onSubmit: _propTypes.default.func.isRequired,
  submitText: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  showTermsOfService: _propTypes.default.bool,
  showTopBorder: _propTypes.default.bool,
  className: _propTypes.default.string
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/swaps/swaps-footer/swaps-footer.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/swaps-footer/swaps-footer.js",}],
[3911, {"../../../helpers/utils/build-types":4006,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/logo":974,"lodash":2646,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _logo = _interopRequireDefault(require("@metamask/logo"));

var _lodash = require("lodash");

var _buildTypes = require("../../../helpers/utils/build-types");

const directionTargetGenerator = ({
  top,
  left,
  height,
  width
}) => {
  const horizontalMiddle = left + width / 2;
  const verticalMiddle = top + height / 2;
  return {
    up: {
      x: horizontalMiddle,
      y: top - height
    },
    down: {
      x: horizontalMiddle,
      y: top + height * 2
    },
    left: {
      x: left - width,
      y: verticalMiddle
    },
    right: {
      x: left + width * 2,
      y: verticalMiddle
    },
    middle: {
      x: horizontalMiddle,
      y: verticalMiddle
    }
  };
};

class Mascot extends _react.Component {
  constructor(props) {
    super(props);
    const {
      width,
      height,
      followMouse
    } = props;
    this.logo = (0, _logo.default)({
      followMouse,
      pxNotRatio: true,
      width,
      height,
      meshJson: (0, _buildTypes.getBuildSpecificAsset)('foxMeshJson')
    });
    this.mascotContainer = /*#__PURE__*/(0, _react.createRef)();
    this.refollowMouse = (0, _lodash.debounce)(this.logo.setFollowMouse.bind(this.logo, true), 1000);
    this.unfollowMouse = this.logo.setFollowMouse.bind(this.logo, false);
  }

  handleAnimationEvents() {
    // only setup listeners once
    if (this.animations) {
      return;
    }

    this.animations = this.props.animationEventEmitter;
    this.animations.on('point', this.lookAt.bind(this));
    this.animations.on('setFollowMouse', this.logo.setFollowMouse.bind(this.logo));
  }

  lookAt(target) {
    this.unfollowMouse();
    this.logo.lookAt(target);
    this.refollowMouse();
  }

  componentDidMount() {
    this.mascotContainer.current.appendChild(this.logo.container);
    this.directionTargetMap = directionTargetGenerator(this.mascotContainer.current.getBoundingClientRect());
    const {
      lookAtTarget,
      lookAtDirection
    } = this.props;

    if (lookAtTarget !== null && lookAtTarget !== void 0 && lookAtTarget.x && lookAtTarget !== null && lookAtTarget !== void 0 && lookAtTarget.y) {
      this.logo.lookAtAndRender(lookAtTarget);
    } else if (lookAtDirection) {
      this.logo.lookAtAndRender(this.directionTargetMap[lookAtDirection]);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      lookAtTarget: prevTarget = {},
      lookAtDirection: prevDirection = null,
      followMouse: prevFollowMouse
    } = prevProps;
    const {
      lookAtTarget = {},
      followMouse,
      lookAtDirection
    } = this.props;

    if (lookAtDirection && prevDirection !== lookAtDirection) {
      this.logo.lookAtAndRender(this.directionTargetMap[lookAtDirection]);
    } else if ((lookAtTarget === null || lookAtTarget === void 0 ? void 0 : lookAtTarget.x) !== (prevTarget === null || prevTarget === void 0 ? void 0 : prevTarget.x) || (lookAtTarget === null || lookAtTarget === void 0 ? void 0 : lookAtTarget.y) !== (prevTarget === null || prevTarget === void 0 ? void 0 : prevTarget.y)) {
      this.logo.lookAtAndRender(lookAtTarget);
    }

    if (prevFollowMouse !== followMouse) {
      this.unfollowMouse();
      followMouse && this.refollowMouse();
    }
  }

  componentWillUnmount() {
    this.animations = this.props.animationEventEmitter;
    this.animations.removeAllListeners();
    this.logo.container.remove();
    this.logo.stopAnimation();
  }

  render() {
    // this is a bit hacky
    // the event emitter is on `this.props`
    // and we dont get that until render
    this.handleAnimationEvents();
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: this.mascotContainer,
      style: {
        zIndex: 0
      }
    });
  }

}

exports.default = Mascot;
(0, _defineProperty2.default)(Mascot, "propTypes", {
  animationEventEmitter: _propTypes.default.object.isRequired,
  width: _propTypes.default.string,
  height: _propTypes.default.string,
  followMouse: _propTypes.default.bool,
  lookAtTarget: _propTypes.default.object,
  lookAtDirection: _propTypes.default.oneOf(['up', 'down', 'left', 'right', 'middle'])
});
(0, _defineProperty2.default)(Mascot, "defaultProps", {
  width: '200',
  height: '200',
  followMouse: true,
  lookAtTarget: {},
  lookAtDirection: null
});

//# sourceMappingURL=ui/components/ui/mascot/mascot.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/mascot/mascot.component.js",}],
[4275, {"../../../../contexts/i18n":3970,"../../../../helpers/utils/util":4020,"../../../../hooks/useMetricEvent":4032,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ViewOnEtherScanLink;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../../../contexts/i18n");

var _useMetricEvent = require("../../../../hooks/useMetricEvent");

var _util = require("../../../../helpers/utils/util");

function ViewOnEtherScanLink({
  txHash,
  blockExplorerUrl,
  isCustomBlockExplorerUrl
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const blockExplorerLinkClickedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    category: 'Swaps',
    event: 'Clicked Block Explorer Link',
    properties: {
      link_type: 'Transaction Block Explorer',
      action: 'Swap Transaction',
      block_explorer_domain: (0, _util.getURLHostName)(blockExplorerUrl)
    }
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('awaiting-swap__view-on-etherscan', {
      'awaiting-swap__view-on-etherscan--visible': txHash,
      'awaiting-swap__view-on-etherscan--invisible': !txHash
    }),
    onClick: () => {
      blockExplorerLinkClickedEvent();
      global.platform.openTab({
        url: blockExplorerUrl
      });
    }
  }, isCustomBlockExplorerUrl ? t('viewOnCustomBlockExplorer', [(0, _util.getURLHostName)(blockExplorerUrl)]) : t('viewOnEtherscan'));
}

ViewOnEtherScanLink.propTypes = {
  txHash: _propTypes.default.string,
  blockExplorerUrl: _propTypes.default.string,
  isCustomBlockExplorerUrl: _propTypes.default.bool
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/swaps/awaiting-swap/view-on-ether-scan-link/view-on-ether-scan-link.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/awaiting-swap/view-on-ether-scan-link/view-on-ether-scan-link.js",}],
[945, {"./token":946,"@babel/runtime/helpers/assertThisInitialized":175,"@babel/runtime/helpers/asyncToGenerator":176,"@babel/runtime/helpers/classCallCheck":177,"@babel/runtime/helpers/createClass":179,"@babel/runtime/helpers/getPrototypeOf":183,"@babel/runtime/helpers/inherits":184,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/possibleConstructorReturn":197,"@babel/runtime/regenerator":206,"deep-equal":1567,"eth-block-tracker":950,"ethjs-contract":1839,"ethjs-query":1854,"human-standard-token-abi":961,"safe-event-emitter":3238}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var Eth = require('ethjs-query');

var EthContract = require('ethjs-contract');

var Token = require('./token');

var BlockTracker = require('eth-block-tracker');

var abi = require('human-standard-token-abi');

var SafeEventEmitter = require('safe-event-emitter');

var deepEqual = require('deep-equal');

var TokenTracker =
/*#__PURE__*/
function (_SafeEventEmitter) {
  (0, _inherits2["default"])(TokenTracker, _SafeEventEmitter);

  function TokenTracker() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, TokenTracker);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TokenTracker).call(this));
    _this.includeFailedTokens = opts.includeFailedTokens || false;
    _this.userAddress = opts.userAddress || '0x0';
    _this.provider = opts.provider;
    var pollingInterval = opts.pollingInterval || 4000;
    _this.blockTracker = new BlockTracker({
      provider: _this.provider,
      pollingInterval: pollingInterval
    });
    _this.eth = new Eth(_this.provider);
    _this.contract = new EthContract(_this.eth);
    _this.TokenContract = _this.contract(abi);
    var tokens = opts.tokens || [];
    _this.tokens = tokens.map(function (tokenOpts) {
      return _this.createTokenFrom(tokenOpts);
    }); // initialize to empty array to ensure a tracker initialized
    // with zero tokens doesn't emit an update until a token is added.

    _this._oldBalances = [];
    Promise.all(_this.tokens.map(function (token) {
      return token.update();
    })).then(function (newBalances) {
      _this._update(newBalances);
    })["catch"](function (error) {
      _this.emit('error', error);
    });
    _this.updateBalances = _this.updateBalances.bind((0, _assertThisInitialized2["default"])(_this));
    _this.running = true;

    _this.blockTracker.on('latest', _this.updateBalances);

    return _this;
  }

  (0, _createClass2["default"])(TokenTracker, [{
    key: "serialize",
    value: function serialize() {
      return this.tokens.map(function (token) {
        return token.serialize();
      });
    }
  }, {
    key: "updateBalances",
    value: function () {
      var _updateBalances = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var newBalances;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return Promise.all(this.tokens.map(function (token) {
                  return token.updateBalance();
                }));

              case 3:
                newBalances = this.serialize();

                this._update(newBalances);

                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                this.emit('error', _context.t0);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function updateBalances() {
        return _updateBalances.apply(this, arguments);
      }

      return updateBalances;
    }()
  }, {
    key: "createTokenFrom",
    value: function createTokenFrom(opts) {
      var owner = this.userAddress;
      var address = opts.address,
          symbol = opts.symbol,
          balance = opts.balance,
          decimals = opts.decimals;
      var contract = this.TokenContract.at(address);
      return new Token({
        address: address,
        symbol: symbol,
        balance: balance,
        decimals: decimals,
        contract: contract,
        owner: owner,
        throwOnBalanceError: this.includeFailedTokens === false
      });
    }
  }, {
    key: "add",
    value: function add(opts) {
      var _this2 = this;

      var token = this.createTokenFrom(opts);
      this.tokens.push(token);
      token.update().then(function () {
        _this2._update(_this2.serialize());
      })["catch"](function (error) {
        _this2.emit('error', error);
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
      this.blockTracker.removeListener('latest', this.updateBalances);
    }
  }, {
    key: "_update",
    value: function _update(newBalances) {
      if (!this.running || deepEqual(newBalances, this._oldBalances)) {
        return;
      }

      this._oldBalances = newBalances;
      this.emit('update', newBalances);
    }
  }]);
  return TokenTracker;
}(SafeEventEmitter);

module.exports = TokenTracker;
//# sourceMappingURL=node_modules/@metamask/eth-token-tracker/dist/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/eth-token-tracker/dist/index.js",}],
[3994, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGasFormErrorText = getGasFormErrorText;
exports.GAS_FORM_ERRORS = void 0;
const GAS_FORM_ERRORS = {
  GAS_LIMIT_OUT_OF_BOUNDS: 'editGasLimitOutOfBounds',
  MAX_PRIORITY_FEE_TOO_LOW: 'editGasMaxPriorityFeeLow',
  MAX_FEE_TOO_LOW: 'editGasMaxFeeLow',
  MAX_PRIORITY_FEE_BELOW_MINIMUM: 'editGasMaxPriorityFeeBelowMinimum',
  MAX_PRIORITY_FEE_HIGH_WARNING: 'editGasMaxPriorityFeeHigh',
  MAX_FEE_HIGH_WARNING: 'editGasMaxFeeHigh',
  MAX_FEE_IMBALANCE: 'editGasMaxFeeImbalance',
  GAS_PRICE_TOO_LOW: 'editGasPriceTooLow'
};
exports.GAS_FORM_ERRORS = GAS_FORM_ERRORS;

function getGasFormErrorText(type, t, {
  minimumGasLimit
} = {}) {
  switch (type) {
    case GAS_FORM_ERRORS.GAS_LIMIT_OUT_OF_BOUNDS:
      return t('editGasLimitOutOfBounds', [minimumGasLimit]);

    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_TOO_LOW:
      return t('editGasMaxPriorityFeeLow');

    case GAS_FORM_ERRORS.MAX_FEE_TOO_LOW:
      return t('editGasMaxFeeLow');

    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_BELOW_MINIMUM:
      return t('editGasMaxPriorityFeeBelowMinimum');

    case GAS_FORM_ERRORS.MAX_PRIORITY_FEE_HIGH_WARNING:
      return t('editGasMaxPriorityFeeHigh');

    case GAS_FORM_ERRORS.MAX_FEE_HIGH_WARNING:
      return t('editGasMaxFeeHigh');

    case GAS_FORM_ERRORS.MAX_FEE_IMBALANCE:
      return t('editGasMaxFeePriorityImbalance');

    case GAS_FORM_ERRORS.GAS_PRICE_TOO_LOW:
      return t('editGasPriceTooLow');

    default:
      return '';
  }
}

//# sourceMappingURL=ui/helpers/constants/gas.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/constants/gas.js",}],
[4046, {"../ducks/metamask/metamask":3985,"../helpers/constants/common":3990,"../selectors":4326,"react-redux":3088}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useUserPreferencedCurrency = useUserPreferencedCurrency;

var _reactRedux = require("react-redux");

var _selectors = require("../selectors");

var _metamask = require("../ducks/metamask/metamask");

var _common = require("../helpers/constants/common");

/**
 * Defines the shape of the options parameter for useUserPreferencedCurrency
 * @typedef {Object} UseUserPreferencedCurrencyOptions
 * @property {number} [numberOfDecimals]     - Number of significant decimals to display
 * @property {number} [ethNumberOfDecimals]  - Number of significant decimals to display
 *                                             when using ETH
 * @property {number} [fiatNumberOfDecimals] - Number of significant decimals to display
 *                                            when using fiat
 */

/**
 * Defines the return shape of useUserPreferencedCurrency
 * @typedef {Object} UserPreferredCurrency
 * @property {string} currency         - the currency type to use (eg: 'ETH', 'usd')
 * @property {number} numberOfDecimals - Number of significant decimals to display
 */

/**
 * useUserPreferencedCurrency
 *
 * returns an object that contains what currency to use for displaying values based
 * on the user's preference settings, as well as the significant number of decimals
 * to display based on the currency
 * @param {"PRIMARY" | "SECONDARY"} type - what display type is being rendered
 * @param {UseUserPreferencedCurrencyOptions} opts - options to override default values
 * @return {UserPreferredCurrency}
 */
function useUserPreferencedCurrency(type, opts = {}) {
  const nativeCurrency = (0, _reactRedux.useSelector)(_metamask.getNativeCurrency);
  const {
    useNativeCurrencyAsPrimaryCurrency
  } = (0, _reactRedux.useSelector)(_selectors.getPreferences);
  const showFiat = (0, _reactRedux.useSelector)(_selectors.getShouldShowFiat);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  let currency, numberOfDecimals;

  if (!showFiat || type === _common.PRIMARY && useNativeCurrencyAsPrimaryCurrency || type === _common.SECONDARY && !useNativeCurrencyAsPrimaryCurrency) {
    // Display ETH
    currency = nativeCurrency || _common.xMONI;
    numberOfDecimals = opts.numberOfDecimals || opts.ethNumberOfDecimals || 6;
  } else if (type === _common.SECONDARY && useNativeCurrencyAsPrimaryCurrency || type === _common.PRIMARY && !useNativeCurrencyAsPrimaryCurrency) {
    // Display Fiat
    currency = currentCurrency;
    numberOfDecimals = opts.numberOfDecimals || opts.fiatNumberOfDecimals || 2;
  }

  return {
    currency,
    numberOfDecimals
  };
}

//# sourceMappingURL=ui/hooks/useUserPreferencedCurrency.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useUserPreferencedCurrency.js",}],
[4024, {"../../shared/modules/conversion.utils":3601,"../ducks/metamask/metamask":3985,"../helpers/utils/confirm-tx.util":4008,"../selectors":4326,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCurrencyDisplay = useCurrencyDisplay;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = require("react");

var _reactRedux = require("react-redux");

var _confirmTx = require("../helpers/utils/confirm-tx.util");

var _selectors = require("../selectors");

var _metamask = require("../ducks/metamask/metamask");

var _conversion = require("../../shared/modules/conversion.utils");

/**
 * Defines the shape of the options parameter for useCurrencyDisplay
 * @typedef {Object} UseCurrencyOptions
 * @property {string} [displayValue]     - When present is used in lieu of formatting the inputValue
 * @property {string} [prefix]           - String to prepend to the final result
 * @property {number} [numberOfDecimals] - Number of significant decimals to display
 * @property {string} [denomination]     - Denomination (wei, gwei) to convert to for display
 * @property {string} [currency]         - Currency type to convert to. Will override nativeCurrency
 */

/**
 * Defines the return shape of the second value in the tuple
 * @typedef {Object} CurrencyDisplayParts
 * @property {string} [prefix]  - string to prepend to the value for display
 * @property {string} value     - string representing the value, formatted for display
 * @property {string} [suffix]  - string to append to the value for display
 */

/**
 * useCurrencyDisplay hook
 *
 * Given a hexadecimal encoded value string and an object of parameters used for formatting the
 * display, produce both a fully formed string and the pieces of that string used for displaying
 * the currency to the user
 * @param {string} inputValue          - The value to format for display
 * @param {UseCurrencyOptions} opts    - An object for options to format the inputValue
 * @return {[string, CurrencyDisplayParts]}
 */
function useCurrencyDisplay(inputValue, _ref) {
  let {
    displayValue,
    prefix,
    numberOfDecimals,
    denomination,
    currency
  } = _ref,
      opts = (0, _objectWithoutProperties2.default)(_ref, ["displayValue", "prefix", "numberOfDecimals", "denomination", "currency"]);
  const currentCurrency = (0, _reactRedux.useSelector)(_selectors.getCurrentCurrency);
  const nativeCurrency = (0, _reactRedux.useSelector)(_metamask.getNativeCurrency);
  const conversionRate = (0, _reactRedux.useSelector)(_metamask.getConversionRate);
  const isUserPreferredCurrency = currency === currentCurrency;
  const value = (0, _react.useMemo)(() => {
    if (displayValue) {
      return displayValue;
    }

    if (currency === nativeCurrency || !isUserPreferredCurrency && !nativeCurrency) {
      return (0, _conversion.conversionUtil)(inputValue, {
        fromNumericBase: 'hex',
        toNumericBase: 'dec',
        fromDenomination: 'WEI',
        numberOfDecimals: numberOfDecimals || 2,
        toDenomination: denomination
      });
    } else if (isUserPreferredCurrency && conversionRate) {
      return (0, _confirmTx.formatCurrency)((0, _confirmTx.getValueFromWeiHex)({
        value: inputValue,
        fromCurrency: nativeCurrency,
        toCurrency: currency,
        conversionRate,
        numberOfDecimals: numberOfDecimals || 2,
        toDenomination: denomination
      }), currency);
    }

    return null;
  }, [inputValue, nativeCurrency, conversionRate, displayValue, numberOfDecimals, denomination, currency, isUserPreferredCurrency]);
  let suffix;

  if (!opts.hideLabel) {
    suffix = opts.suffix || currency;
  }

  return [`${prefix || ''}${value}${suffix ? ` ${suffix}` : ''}`, {
    prefix,
    value,
    suffix
  }];
}

//# sourceMappingURL=ui/hooks/useCurrencyDisplay.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useCurrencyDisplay.js",}],
[4278, {"../../../../shared/constants/time":3598,"../../../components/ui/info-tooltip":3896,"../../../contexts/i18n":3970,"../../../ducks/swaps/swaps":3988,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"luxon":2662,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CountdownTimer;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _luxon = require("luxon");

var _i18n = require("../../../contexts/i18n");

var _infoTooltip = _interopRequireDefault(require("../../../components/ui/info-tooltip"));

var _swaps = require("../../../ducks/swaps/swaps");

var _time = require("../../../../shared/constants/time");

// Return the mm:ss start time of the countdown timer.
// If time has elapsed between `timeStarted` the time current time,
// then that elapsed time will be subtracted from the timer before
// rendering
function getNewTimer(currentTime, timeStarted, timeBaseStart) {
  const timeAlreadyElapsed = currentTime - timeStarted;
  return timeBaseStart - timeAlreadyElapsed;
}

function decreaseTimerByOne(timer) {
  return Math.max(timer - _time.SECOND, 0);
}

function timeBelowWarningTime(timer, warningTime) {
  const [warningTimeMinutes, warningTimeSeconds] = warningTime.split(':');
  return timer <= (Number(warningTimeMinutes) * 60 + Number(warningTimeSeconds)) * _time.SECOND;
}

function CountdownTimer({
  timeStarted,
  timeOnly,
  timerBase,
  warningTime,
  labelKey,
  infoTooltipLabelKey
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const intervalRef = (0, _react.useRef)();
  const initialTimeStartedRef = (0, _react.useRef)();
  const swapsQuoteRefreshTime = (0, _reactRedux.useSelector)(_swaps.getSwapsQuoteRefreshTime);
  const timerStart = Number(timerBase) || swapsQuoteRefreshTime;
  const [currentTime, setCurrentTime] = (0, _react.useState)(() => Date.now());
  const [timer, setTimer] = (0, _react.useState)(() => getNewTimer(currentTime, timeStarted, timerStart));
  (0, _react.useEffect)(() => {
    if (intervalRef.current === undefined) {
      intervalRef.current = setInterval(() => {
        setTimer(decreaseTimerByOne);
      }, _time.SECOND);
    }

    return function cleanup() {
      clearInterval(intervalRef.current);
    };
  }, []); // Reset the timer that timer has hit '0:00' and the timeStarted prop has changed

  (0, _react.useEffect)(() => {
    if (!initialTimeStartedRef.current) {
      initialTimeStartedRef.current = timeStarted || Date.now();
    }

    if (timer === 0 && timeStarted !== initialTimeStartedRef.current) {
      initialTimeStartedRef.current = timeStarted;
      const newCurrentTime = Date.now();
      setCurrentTime(newCurrentTime);
      setTimer(getNewTimer(newCurrentTime, timeStarted, timerStart));
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer(decreaseTimerByOne);
      }, _time.SECOND);
    }
  }, [timeStarted, timer, timerStart]);

  const formattedTimer = _luxon.Duration.fromMillis(timer).toFormat('m:ss');

  let time;

  if (timeOnly) {
    time = /*#__PURE__*/_react.default.createElement("div", {
      className: "countdown-timer__time"
    }, formattedTimer);
  } else if (labelKey) {
    time = t(labelKey, [/*#__PURE__*/_react.default.createElement("div", {
      key: "countdown-time-1",
      className: "countdown-timer__time"
    }, formattedTimer)]);
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "countdown-timer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    "data-testid": "countdown-timer__timer-container",
    className: (0, _classnames.default)('countdown-timer__timer-container', {
      'countdown-timer__timer-container--warning': warningTime && timeBelowWarningTime(timer, warningTime)
    })
  }, time), !timeOnly && infoTooltipLabelKey ? /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
    position: "bottom",
    contentText: t(infoTooltipLabelKey)
  }) : null);
}

CountdownTimer.propTypes = {
  timeStarted: _propTypes.default.number,
  timeOnly: _propTypes.default.bool,
  timerBase: _propTypes.default.number,
  warningTime: _propTypes.default.string,
  labelKey: _propTypes.default.string,
  infoTooltipLabelKey: _propTypes.default.string
};

//# sourceMappingURL=ui/pages/swaps/countdown-timer/countdown-timer.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/countdown-timer/countdown-timer.js",}],
[4286, {"../../../../shared/constants/network":3595,"../../../components/app/gas-timing/gas-timing.component":3682,"../../../components/app/transaction-detail-item/transaction-detail-item.component":3807,"../../../components/app/transaction-detail/transaction-detail.component":3808,"../../../components/ui/info-tooltip":3896,"../../../components/ui/typography":3964,"../../../contexts/i18n":3970,"../../../helpers/constants/design-system":3992,"../../../hooks/useMetricEvent":4032,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FeeCard;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _i18n = require("../../../contexts/i18n");

var _infoTooltip = _interopRequireDefault(require("../../../components/ui/info-tooltip"));

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _network = require("../../../../shared/constants/network");

var _transactionDetail = _interopRequireDefault(require("../../../components/app/transaction-detail/transaction-detail.component"));

var _transactionDetailItem = _interopRequireDefault(require("../../../components/app/transaction-detail-item/transaction-detail-item.component"));

var _gasTiming = _interopRequireDefault(require("../../../components/app/gas-timing/gas-timing.component"));

var _typography = _interopRequireDefault(require("../../../components/ui/typography"));

var _designSystem = require("../../../helpers/constants/design-system");

const GAS_FEES_LEARN_MORE_URL = 'https://community.metamask.io/t/what-is-gas-why-do-transactions-take-so-long/3172';

function FeeCard({
  primaryFee,
  secondaryFee,
  hideTokenApprovalRow,
  onFeeCardMaxRowClick,
  tokenApprovalTextComponent,
  tokenApprovalSourceTokenSymbol,
  onTokenApprovalClick,
  metaMaskFee,
  isBestQuote,
  numberOfQuotes,
  onQuotesClick,
  tokenConversionRate,
  chainId,
  networkAndAccountSupports1559,
  maxPriorityFeePerGasDecGWEI,
  maxFeePerGasDecGWEI
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  let bestQuoteText = '';

  if (isBestQuote && tokenConversionRate) {
    bestQuoteText = t('swapUsingBestQuote');
  } else if (tokenConversionRate) {
    bestQuoteText = t('swapBetterQuoteAvailable');
  }

  const getTranslatedNetworkName = () => {
    switch (chainId) {
      case _network.MAINNET_CHAIN_ID:
        return t('networkNameEthereum');

      case _network.BSC_CHAIN_ID:
        return t('networkNameBSC');

      case _network.POLYGON_CHAIN_ID:
        return t('networkNamePolygon');

      case _network.LOCALHOST_CHAIN_ID:
        return t('networkNameTestnet');

      case _network.RINKEBY_CHAIN_ID:
        return t('networkNameRinkeby');

      default:
        throw new Error('This network is not supported for token swaps');
    }
  };

  const gasFeesLearnMoreLinkClickedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    category: 'Swaps',
    event: 'Clicked "Gas Fees: Learn More" Link'
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__savings-and-quotes-header",
    "data-testid": "fee-card__savings-and-quotes-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__savings-and-quotes-row"
  }, bestQuoteText && /*#__PURE__*/_react.default.createElement("p", {
    className: "fee-card__savings-text"
  }, bestQuoteText), numberOfQuotes > 1 && /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__quote-link-container",
    onClick: onQuotesClick
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "fee-card__quote-link-text"
  }, t('swapNQuotes', [numberOfQuotes])), /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__caret-right"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-angle-up"
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__main"
  }, networkAndAccountSupports1559 && /*#__PURE__*/_react.default.createElement(_transactionDetail.default, {
    rows: [/*#__PURE__*/_react.default.createElement(_transactionDetailItem.default, {
      key: "gas-item",
      detailTitle: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, t('transactionDetailGasHeading'), /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
        position: "top",
        contentText: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("p", {
          className: "fee-card__info-tooltip-paragraph"
        }, t('swapGasFeesSummary', [getTranslatedNetworkName()])), /*#__PURE__*/_react.default.createElement("p", {
          className: "fee-card__info-tooltip-paragraph"
        }, t('swapGasFeesDetails')), /*#__PURE__*/_react.default.createElement("p", {
          className: "fee-card__info-tooltip-paragraph"
        }, /*#__PURE__*/_react.default.createElement("a", {
          className: "fee-card__link",
          onClick: () => {
            gasFeesLearnMoreLinkClickedEvent();
            global.platform.openTab({
              url: GAS_FEES_LEARN_MORE_URL
            });
          },
          target: "_blank",
          rel: "noopener noreferrer"
        }, t('swapGasFeesLearnMore')))),
        containerClassName: "fee-card__info-tooltip-content-container",
        wrapperClassName: "fee-card__row-label fee-card__info-tooltip-container",
        wide: true
      })),
      detailText: primaryFee.fee,
      detailTotal: secondaryFee.fee,
      subTitle: /*#__PURE__*/_react.default.createElement(_gasTiming.default, {
        maxPriorityFeePerGas: maxPriorityFeePerGasDecGWEI,
        maxFeePerGas: maxFeePerGasDecGWEI
      }),
      subText: (secondaryFee === null || secondaryFee === void 0 ? void 0 : secondaryFee.maxFee) !== undefined && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_typography.default, {
        tag: "span",
        fontWeight: _designSystem.FONT_WEIGHT.BOLD,
        color: _designSystem.COLORS.UI4,
        variant: _designSystem.TYPOGRAPHY.H7
      }, t('maxFee')), `: ${secondaryFee.maxFee}`, /*#__PURE__*/_react.default.createElement("span", {
        className: "fee-card__edit-link",
        onClick: () => onFeeCardMaxRowClick()
      }, t('edit')))
    })]
  }), !networkAndAccountSupports1559 && /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header",
    "data-testid": "fee-card__row-header"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-text--bold"
  }, t('swapEstimatedNetworkFee')), /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
    position: "top",
    contentText: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("p", {
      className: "fee-card__info-tooltip-paragraph"
    }, t('swapNetworkFeeSummary', [getTranslatedNetworkName()])), /*#__PURE__*/_react.default.createElement("p", {
      className: "fee-card__info-tooltip-paragraph"
    }, t('swapEstimatedNetworkFeeSummary', [/*#__PURE__*/_react.default.createElement("span", {
      className: "fee-card__bold",
      key: "fee-card-bold-1"
    }, t('swapEstimatedNetworkFee'))])), /*#__PURE__*/_react.default.createElement("p", {
      className: "fee-card__info-tooltip-paragraph"
    }, t('swapMaxNetworkFeeInfo', [/*#__PURE__*/_react.default.createElement("span", {
      className: "fee-card__bold",
      key: "fee-card-bold-2"
    }, t('swapMaxNetworkFees'))]))),
    containerClassName: "fee-card__info-tooltip-content-container",
    wrapperClassName: "fee-card__row-label fee-card__info-tooltip-container",
    wide: true
  })), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-secondary--bold"
  }, primaryFee.fee), secondaryFee && /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-primary--bold"
  }, secondaryFee.fee))), !networkAndAccountSupports1559 && /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header",
    onClick: () => onFeeCardMaxRowClick()
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-text"
  }, t('swapMaxNetworkFees')), /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__link"
  }, t('edit'))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-secondary"
  }, primaryFee.maxFee), (secondaryFee === null || secondaryFee === void 0 ? void 0 : secondaryFee.maxFee) !== undefined && /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-primary"
  }, secondaryFee.maxFee))), !hideTokenApprovalRow && /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-label"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-text"
  }, t('swapThisWillAllowApprove', [tokenApprovalTextComponent])), /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
    position: "top",
    contentText: t('swapEnableDescription', [tokenApprovalSourceTokenSymbol]),
    containerClassName: "fee-card__info-tooltip-container"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__link",
    onClick: () => onTokenApprovalClick()
  }, t('swapEditLimit'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__top-bordered-row"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-label"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "fee-card__row-header-text"
  }, t('swapQuoteIncludesRate', [metaMaskFee])), /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
    position: "top",
    contentText: t('swapMetaMaskFeeDescription', [metaMaskFee]),
    wrapperClassName: "fee-card__info-tooltip-container"
  })))));
}

FeeCard.propTypes = {
  primaryFee: _propTypes.default.shape({
    fee: _propTypes.default.string.isRequired,
    maxFee: _propTypes.default.string.isRequired
  }).isRequired,
  secondaryFee: _propTypes.default.shape({
    fee: _propTypes.default.string.isRequired,
    maxFee: _propTypes.default.string.isRequired
  }),
  onFeeCardMaxRowClick: _propTypes.default.func.isRequired,
  hideTokenApprovalRow: _propTypes.default.bool.isRequired,
  tokenApprovalTextComponent: _propTypes.default.node,
  tokenApprovalSourceTokenSymbol: _propTypes.default.string,
  onTokenApprovalClick: _propTypes.default.func,
  metaMaskFee: _propTypes.default.string.isRequired,
  isBestQuote: _propTypes.default.bool,
  onQuotesClick: _propTypes.default.func.isRequired,
  numberOfQuotes: _propTypes.default.number.isRequired,
  tokenConversionRate: _propTypes.default.number,
  chainId: _propTypes.default.string.isRequired,
  networkAndAccountSupports1559: _propTypes.default.bool.isRequired,
  maxPriorityFeePerGasDecGWEI: _propTypes.default.string,
  maxFeePerGasDecGWEI: _propTypes.default.string
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/swaps/fee-card/fee-card.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/fee-card/fee-card.js",}],
[4295, {"../../../components/ui/tooltip":3960,"../../../components/ui/url-icon":3968,"../../../helpers/utils/token-util":4017,"../../../helpers/utils/util":4020,"../exchange-rate-display":4285,"../swaps.util":4316,"@babel/runtime/helpers/interopRequireDefault":186,"bignumber.js":1351,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MainQuoteSummary;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _tokenUtil = require("../../../helpers/utils/token-util");

var _util = require("../../../helpers/utils/util");

var _tooltip = _interopRequireDefault(require("../../../components/ui/tooltip"));

var _urlIcon = _interopRequireDefault(require("../../../components/ui/url-icon"));

var _exchangeRateDisplay = _interopRequireDefault(require("../exchange-rate-display"));

var _swaps = require("../swaps.util");

function getFontSizesAndLineHeights(fontSizeScore) {
  if (fontSizeScore <= 9) {
    return [60, 48];
  }

  if (fontSizeScore <= 13) {
    return [40, 32];
  }

  return [26, 15];
}

function MainQuoteSummary({
  sourceValue,
  sourceSymbol,
  sourceDecimals,
  sourceIconUrl,
  destinationValue,
  destinationSymbol,
  destinationDecimals,
  destinationIconUrl
}) {
  const sourceAmount = (0, _util.toPrecisionWithoutTrailingZeros)((0, _tokenUtil.calcTokenAmount)(sourceValue, sourceDecimals).toString(10), 12);
  const destinationAmount = (0, _tokenUtil.calcTokenAmount)(destinationValue, destinationDecimals);
  const amountToDisplay = (0, _swaps.formatSwapsValueForDisplay)(destinationAmount);
  const amountDigitLength = amountToDisplay.match(/\d+/gu).join('').length;
  const [numberFontSize, lineHeight] = getFontSizesAndLineHeights(amountDigitLength);
  let ellipsedAmountToDisplay = amountToDisplay;

  if (amountDigitLength > 20) {
    ellipsedAmountToDisplay = `${amountToDisplay.slice(0, 20)}...`;
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "main-quote-summary"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "main-quote-summary__details"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "main-quote-summary__quote-details-top"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "main-quote-summary__source-row",
    "data-testid": "main-quote-summary__source-row"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "main-quote-summary__source-row-value",
    title: (0, _swaps.formatSwapsValueForDisplay)(sourceAmount)
  }, (0, _swaps.formatSwapsValueForDisplay)(sourceAmount)), /*#__PURE__*/_react.default.createElement(_urlIcon.default, {
    url: sourceIconUrl,
    className: "main-quote-summary__icon",
    name: sourceSymbol,
    fallbackClassName: "main-quote-summary__icon-fallback"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "main-quote-summary__source-row-symbol",
    title: sourceSymbol
  }, sourceSymbol)), /*#__PURE__*/_react.default.createElement("img", {
    className: "main-quote-summary__down-arrow",
    src: "images/down-arrow-grey.svg"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "main-quote-summary__destination-row"
  }, /*#__PURE__*/_react.default.createElement(_urlIcon.default, {
    url: destinationIconUrl,
    className: "main-quote-summary__icon",
    name: destinationSymbol,
    fallbackClassName: "main-quote-summary__icon-fallback"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "main-quote-summary__destination-row-symbol"
  }, destinationSymbol)), /*#__PURE__*/_react.default.createElement("div", {
    className: "main-quote-summary__quote-large"
  }, /*#__PURE__*/_react.default.createElement(_tooltip.default, {
    interactive: true,
    position: "bottom",
    html: amountToDisplay,
    disabled: ellipsedAmountToDisplay === amountToDisplay,
    theme: "white"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "main-quote-summary__quote-large-number",
    style: {
      fontSize: numberFontSize,
      lineHeight: `${lineHeight}px`
    }
  }, `${ellipsedAmountToDisplay}`)))), /*#__PURE__*/_react.default.createElement("div", {
    className: "main-quote-summary__exchange-rate-container",
    "data-testid": "main-quote-summary__exchange-rate-container"
  }, /*#__PURE__*/_react.default.createElement(_exchangeRateDisplay.default, {
    primaryTokenValue: sourceValue,
    primaryTokenDecimals: sourceDecimals,
    primaryTokenSymbol: sourceSymbol,
    secondaryTokenValue: destinationValue,
    secondaryTokenDecimals: destinationDecimals,
    secondaryTokenSymbol: destinationSymbol,
    arrowColor: "#037DD6",
    boldSymbols: false,
    className: "main-quote-summary__exchange-rate-display"
  }))));
}

MainQuoteSummary.propTypes = {
  sourceValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.instanceOf(_bignumber.default)]).isRequired,
  sourceDecimals: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  sourceSymbol: _propTypes.default.string.isRequired,
  destinationValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.instanceOf(_bignumber.default)]).isRequired,
  destinationDecimals: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  destinationSymbol: _propTypes.default.string.isRequired,
  sourceIconUrl: _propTypes.default.string,
  destinationIconUrl: _propTypes.default.string
};

//# sourceMappingURL=ui/pages/swaps/main-quote-summary/main-quote-summary.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/main-quote-summary/main-quote-summary.js",}],
[4306, {"../../../components/ui/button":3842,"../../../components/ui/popover":3925,"../../../contexts/i18n":3970,"./quote-details":4303,"./select-quote-popover-constants":4305,"./sort-list":4307,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _i18n = require("../../../contexts/i18n");

var _popover = _interopRequireDefault(require("../../../components/ui/popover"));

var _button = _interopRequireDefault(require("../../../components/ui/button"));

var _quoteDetails = _interopRequireDefault(require("./quote-details"));

var _sortList = _interopRequireDefault(require("./sort-list"));

var _selectQuotePopoverConstants = require("./select-quote-popover-constants");

const SelectQuotePopover = ({
  quoteDataRows = [],
  onClose = null,
  onSubmit = null,
  swapToSymbol,
  initialAggId,
  onQuoteDetailsIsOpened
}) => {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const [sortDirection, setSortDirection] = (0, _react.useState)(1);
  const [sortColumn, setSortColumn] = (0, _react.useState)(null);
  const [selectedAggId, setSelectedAggId] = (0, _react.useState)(initialAggId);
  const [contentView, setContentView] = (0, _react.useState)('sortList');
  const [viewingAgg, setViewingAgg] = (0, _react.useState)(null);
  const onSubmitClick = (0, _react.useCallback)(() => {
    onSubmit(selectedAggId);
    onClose();
  }, [selectedAggId, onClose, onSubmit]);
  const closeQuoteDetails = (0, _react.useCallback)(() => {
    setViewingAgg(null);
    setContentView('sortList');
  }, []);
  const onRowClick = (0, _react.useCallback)(aggId => setSelectedAggId(aggId), [setSelectedAggId]);
  const onCaretClick = (0, _react.useCallback)(aggId => {
    const agg = quoteDataRows.find(quote => quote.aggId === aggId);
    setContentView('quoteDetails');
    onQuoteDetailsIsOpened();
    setViewingAgg(agg);
  }, [quoteDataRows, onQuoteDetailsIsOpened]);
  const CustomBackground = (0, _react.useCallback)(() => /*#__PURE__*/_react.default.createElement("div", {
    className: "select-quote-popover__popover-bg",
    onClick: onClose
  }), [onClose]);

  const footer = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "default",
    className: "page-container__footer-button select-quote-popover__button",
    onClick: onClose
  }, t('close')), /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "confirm",
    className: "page-container__footer-button select-quote-popover__button",
    onClick: onSubmitClick
  }, t('swapSelect')));

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "select-quote-popover"
  }, /*#__PURE__*/_react.default.createElement(_popover.default, {
    title: contentView === 'quoteDetails' ? t('swapSelectAQuote') : t('swapQuoteDetails'),
    subtitle: contentView === 'sortList' ? t('swapSelectQuotePopoverDescription') : null,
    onClose: onClose,
    CustomBackground: CustomBackground,
    className: "select-quote-popover__popover-wrap",
    footerClassName: "swaps__footer",
    footer: contentView === 'quoteDetails' ? null : footer,
    onBack: contentView === 'quoteDetails' ? closeQuoteDetails : null
  }, contentView === 'sortList' && /*#__PURE__*/_react.default.createElement(_sortList.default, {
    quoteDataRows: quoteDataRows,
    selectedAggId: selectedAggId,
    onSelect: onRowClick,
    onCaretClick: onCaretClick,
    swapToSymbol: swapToSymbol,
    sortDirection: sortDirection,
    setSortDirection: setSortDirection,
    sortColumn: sortColumn,
    setSortColumn: setSortColumn
  }), contentView === 'quoteDetails' && viewingAgg && /*#__PURE__*/_react.default.createElement(_quoteDetails.default, viewingAgg)));
};

SelectQuotePopover.propTypes = {
  onClose: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  swapToSymbol: _propTypes.default.string,
  renderableData: _propTypes.default.array,
  quoteDataRows: _propTypes.default.arrayOf(_selectQuotePopoverConstants.QUOTE_DATA_ROWS_PROPTYPES_SHAPE),
  initialAggId: _propTypes.default.string,
  onQuoteDetailsIsOpened: _propTypes.default.func
};
var _default = SelectQuotePopover;
exports.default = _default;

//# sourceMappingURL=ui/pages/swaps/select-quote-popover/select-quote-popover.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/select-quote-popover/select-quote-popover.js",}],
[4031, {"../../shared/modules/conversion.utils":3601,"../../shared/modules/transaction.utils":3609,"../helpers/utils/conversions.util":4009,"./useGasFeeEstimates":4028,"@babel/runtime/helpers/interopRequireDefault":186,"bignumber.js":1351,"ethereumjs-util":1810,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIncrementedGasFees = useIncrementedGasFees;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _ethereumjsUtil = require("ethereumjs-util");

var _react = require("react");

var _conversion = require("../../shared/modules/conversion.utils");

var _transaction = require("../../shared/modules/transaction.utils");

var _conversions = require("../helpers/utils/conversions.util");

var _useGasFeeEstimates = require("./useGasFeeEstimates");

/**
 * Simple helper to save on duplication to multiply the supplied wei hex string
 * by 1.10 to get bare minimum new gas fee.
 *
 * @param {string} hexStringValue - hex value in wei to be incremented
 * @returns {string} - hex value in WEI 10% higher than the param.
 */
function addTenPercent(hexStringValue) {
  return (0, _ethereumjsUtil.addHexPrefix)((0, _conversion.multiplyCurrencies)(hexStringValue, 1.1, {
    toNumericBase: 'hex',
    multiplicandBase: 16,
    multiplierBase: 10
  }));
}
/**
 * Helper that returns the higher of two options for a new gas fee:
 * The original fee + 10% or
 * the current medium suggested fee from our gas estimation api
 *
 * @param {string} originalFee - hexWei vale of the original fee (maxFee or maxPriority)
 * @param {string} currentEstimate - decGwei value of the current medium gasFee estimate (maxFee or maxPriorityfee)
 * @returns {string} - hexWei value of the higher of the two inputs.
 */


function getHighestIncrementedFee(originalFee, currentEstimate) {
  const buffedOriginalHexWei = addTenPercent(originalFee);
  const currentEstimateHexWei = (0, _conversions.decGWEIToHexWEI)(currentEstimate);
  return new _bignumber.default(buffedOriginalHexWei, 16).greaterThan(new _bignumber.default(currentEstimateHexWei, 16)) ? buffedOriginalHexWei : currentEstimateHexWei;
}
/**
 * When initializing cancellations or speed ups we need to set the baseline
 * gas fees to be 10% higher, which is the bare minimum that the network will
 * accept for transactions of the same nonce. Anything lower than this will be
 * discarded by the network to avoid DoS attacks. This hook returns an object
 * that either has gasPrice or maxFeePerGas/maxPriorityFeePerGas specified. In
 * addition the gasLimit will also be included.
 * @param {} transaction
 * @returns {import(
 *   '../../app/scripts/controllers/transactions'
 * ).CustomGasSettings} - Gas settings for cancellations/speed ups
 */


function useIncrementedGasFees(transaction) {
  const {
    gasFeeEstimates = {}
  } = (0, _useGasFeeEstimates.useGasFeeEstimates)(); // We memoize this value so that it can be relied upon in other hooks.

  const customGasSettings = (0, _react.useMemo)(() => {
    var _transaction$txParams, _transaction$txParams2, _gasFeeEstimates$medi, _gasFeeEstimates$medi2, _gasFeeEstimates$medi3, _gasFeeEstimates$medi4;

    // This hook is called indiscriminantly on all transactions appearing in
    // the activity list. This includes transitional items such as signature
    // requests. These types of "transactions" are not really transactions and
    // do not have txParams. This is why we use optional chaining on the
    // txParams object in this hook.
    const temporaryGasSettings = {
      gasLimit: (_transaction$txParams = transaction.txParams) === null || _transaction$txParams === void 0 ? void 0 : _transaction$txParams.gas,
      gas: (_transaction$txParams2 = transaction.txParams) === null || _transaction$txParams2 === void 0 ? void 0 : _transaction$txParams2.gas
    };
    const suggestedMaxFeePerGas = (_gasFeeEstimates$medi = gasFeeEstimates === null || gasFeeEstimates === void 0 ? void 0 : (_gasFeeEstimates$medi2 = gasFeeEstimates.medium) === null || _gasFeeEstimates$medi2 === void 0 ? void 0 : _gasFeeEstimates$medi2.suggestedMaxFeePerGas) !== null && _gasFeeEstimates$medi !== void 0 ? _gasFeeEstimates$medi : '0';
    const suggestedMaxPriorityFeePerGas = (_gasFeeEstimates$medi3 = gasFeeEstimates === null || gasFeeEstimates === void 0 ? void 0 : (_gasFeeEstimates$medi4 = gasFeeEstimates.medium) === null || _gasFeeEstimates$medi4 === void 0 ? void 0 : _gasFeeEstimates$medi4.suggestedMaxPriorityFeePerGas) !== null && _gasFeeEstimates$medi3 !== void 0 ? _gasFeeEstimates$medi3 : '0';

    if ((0, _transaction.isEIP1559Transaction)(transaction)) {
      var _transaction$txParams3, _transaction$txParams4;

      const transactionMaxFeePerGas = (_transaction$txParams3 = transaction.txParams) === null || _transaction$txParams3 === void 0 ? void 0 : _transaction$txParams3.maxFeePerGas;
      const transactionMaxPriorityFeePerGas = (_transaction$txParams4 = transaction.txParams) === null || _transaction$txParams4 === void 0 ? void 0 : _transaction$txParams4.maxPriorityFeePerGas;
      temporaryGasSettings.maxFeePerGas = transactionMaxFeePerGas === undefined || transactionMaxFeePerGas.startsWith('-') ? '0x0' : getHighestIncrementedFee(transactionMaxFeePerGas, suggestedMaxFeePerGas);
      temporaryGasSettings.maxPriorityFeePerGas = transactionMaxPriorityFeePerGas === undefined || transactionMaxPriorityFeePerGas.startsWith('-') ? '0x0' : getHighestIncrementedFee(transactionMaxPriorityFeePerGas, suggestedMaxPriorityFeePerGas);
    } else {
      var _transaction$txParams5;

      const transactionGasPrice = (_transaction$txParams5 = transaction.txParams) === null || _transaction$txParams5 === void 0 ? void 0 : _transaction$txParams5.gasPrice;
      temporaryGasSettings.gasPrice = transactionGasPrice === undefined || transactionGasPrice.startsWith('-') ? '0x0' : getHighestIncrementedFee(transactionGasPrice, suggestedMaxFeePerGas);
    }

    return temporaryGasSettings;
  }, [transaction, gasFeeEstimates]);
  return customGasSettings;
}

//# sourceMappingURL=ui/hooks/useIncrementedGasFees.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/hooks/useIncrementedGasFees.js",}],
[3903, {"../../../ducks/app/app":3977,"../../../hooks/useShouldAnimateGasEstimations":4036,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"react":3121,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LoadingHeartBeat;

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _app = require("../../../ducks/app/app");

var _useShouldAnimateGasEstimations = require("../../../hooks/useShouldAnimateGasEstimations");

const BASE_CLASS = 'loading-heartbeat';
const LOADING_CLASS = `${BASE_CLASS}--active`;

function LoadingHeartBeat() {
  (0, _useShouldAnimateGasEstimations.useShouldAnimateGasEstimations)();
  const active = (0, _reactRedux.useSelector)(_app.getGasLoadingAnimationIsShowing);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('loading-heartbeat', {
      [LOADING_CLASS]: active
    }),
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

//# sourceMappingURL=ui/components/ui/loading-heartbeat/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/loading-heartbeat/index.js",}],
[3665, {"./edit-gas-display-education.component":3664,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _editGasDisplayEducation.default;
  }
});

var _editGasDisplayEducation = _interopRequireDefault(require("./edit-gas-display-education.component"));

//# sourceMappingURL=ui/components/app/edit-gas-display-education/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/edit-gas-display-education/index.js",}],
[3667, {"./edit-gas-display.component":3666,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _editGasDisplay.default;
  }
});

var _editGasDisplay = _interopRequireDefault(require("./edit-gas-display.component"));

//# sourceMappingURL=ui/components/app/edit-gas-display/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/edit-gas-display/index.js",}],
[3898, {"../tooltip":3960,"./info-tooltip-icon":3897,"@babel/runtime/helpers/interopRequireDefault":186,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = InfoTooltip;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _tooltip = _interopRequireDefault(require("../tooltip"));

var _infoTooltipIcon = _interopRequireDefault(require("./info-tooltip-icon"));

const positionArrowClassMap = {
  top: 'info-tooltip__top-tooltip-arrow',
  bottom: 'info-tooltip__bottom-tooltip-arrow',
  left: 'info-tooltip__left-tooltip-arrow',
  right: 'info-tooltip__right-tooltip-arrow'
};

function InfoTooltip({
  contentText = '',
  position = '',
  containerClassName,
  wrapperClassName,
  wide,
  iconFillColor = '#b8b8b8'
}) {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "info-tooltip"
  }, /*#__PURE__*/_react.default.createElement(_tooltip.default, {
    interactive: true,
    position: position,
    containerClassName: (0, _classnames.default)('info-tooltip__tooltip-container', containerClassName),
    wrapperClassName: wrapperClassName,
    tooltipInnerClassName: "info-tooltip__tooltip-content",
    tooltipArrowClassName: positionArrowClassMap[position],
    html: contentText,
    theme: wide ? 'tippy-tooltip-wideInfo' : 'tippy-tooltip-info'
  }, /*#__PURE__*/_react.default.createElement(_infoTooltipIcon.default, {
    fillColor: iconFillColor
  })));
}

InfoTooltip.propTypes = {
  contentText: _propTypes.default.node,
  position: _propTypes.default.oneOf(['top', 'left', 'bottom', 'right']),
  wide: _propTypes.default.bool,
  containerClassName: _propTypes.default.string,
  wrapperClassName: _propTypes.default.string,
  iconFillColor: _propTypes.default.string
};

//# sourceMappingURL=ui/components/ui/info-tooltip/info-tooltip.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/info-tooltip/info-tooltip.js",}],
[4280, {"../../../components/ui/text-field":3951,"../dropdown-search-list":4283,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DropdownInputPair;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _dropdownSearchList = _interopRequireDefault(require("../dropdown-search-list"));

var _textField = _interopRequireDefault(require("../../../components/ui/text-field"));

const characterWidthMap = {
  '1': 5.86,
  '2': 10.05,
  '3': 10.45,
  '4': 11.1,
  '5': 10,
  '6': 10.06,
  '7': 9.17,
  '8': 10.28,
  '9': 10.06,
  '0': 11.22,
  '.': 4.55
};

const getInputWidth = value => {
  const valueString = String(value);
  const charArray = valueString.split('');
  return charArray.reduce((inputWidth, _char) => inputWidth + characterWidthMap[_char], 12);
};

function DropdownInputPair({
  itemsToSearch = [],
  onInputChange,
  inputValue = '',
  onSelect,
  leftValue,
  selectedItem,
  SearchListPlaceholder,
  maxListItems,
  selectPlaceHolderText,
  loading,
  hideItemIf,
  listContainerClassName,
  autoFocus
}) {
  const [isOpen, setIsOpen] = (0, _react.useState)(false);

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  const inputRef = (0, _react.useRef)();

  const onTextFieldChange = event => {
    event.stopPropagation(); // Automatically prefix value with 0. if user begins typing .

    const valueToUse = event.target.value === '.' ? '0.' : event.target.value; // Regex that validates strings with only numbers, 'x.', '.x', and 'x.x'

    const regexp = /^(\.\d+|\d+(\.\d+)?|\d+\.)$/u; // If the value is either empty or contains only numbers and '.' and only has one '.', update input to match

    if (valueToUse === '' || regexp.test(valueToUse)) {
      onInputChange(valueToUse);
    } else {
      // otherwise, use the previously set inputValue (effectively denying the user from inputting the last char)
      // or an empty string if we do not yet have an inputValue
      onInputChange(inputValue || '');
    }
  };

  const [applyTwoLineStyle, setApplyTwoLineStyle] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    var _inputRef$current, _inputRef$current$get;

    setApplyTwoLineStyle(((inputRef === null || inputRef === void 0 ? void 0 : (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : (_inputRef$current$get = _inputRef$current.getBoundingClientRect()) === null || _inputRef$current$get === void 0 ? void 0 : _inputRef$current$get.width) || 0) + getInputWidth(inputValue || '') > 137);
  }, [inputValue, inputRef]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-input-pair"
  }, /*#__PURE__*/_react.default.createElement(_dropdownSearchList.default, {
    itemsToSearch: itemsToSearch,
    SearchListPlaceholder: SearchListPlaceholder,
    fuseSearchKeys: [{
      name: 'name',
      weight: 0.499
    }, {
      name: 'symbol',
      weight: 0.499
    }, {
      name: 'address',
      weight: 0.002
    }],
    maxListItems: maxListItems,
    onOpen: open,
    onClose: close,
    onSelect: onSelect,
    className: isOpen ? 'dropdown-input-pair__list--full-width' : '',
    externallySelectedItem: selectedItem,
    selectPlaceHolderText: selectPlaceHolderText,
    selectorClosedClassName: "dropdown-input-pair__selector--closed",
    listContainerClassName: listContainerClassName,
    loading: loading,
    hideItemIf: hideItemIf,
    defaultToAll: true
  }), !isOpen && /*#__PURE__*/_react.default.createElement(_textField.default, {
    className: (0, _classnames.default)('dropdown-input-pair__input', {
      'dropdown-input-pair__two-line-input': applyTwoLineStyle
    }),
    type: "text",
    placeholder: "0",
    onChange: onTextFieldChange,
    fullWidth: true,
    margin: "dense",
    value: inputValue,
    autoFocus: autoFocus
  }), !isOpen && leftValue && /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('dropdown-input-pair__left-value', {
      'dropdown-input-pair__left-value--two-lines': applyTwoLineStyle
    }),
    ref: inputRef
  }, "\u2248 ", leftValue));
}

DropdownInputPair.propTypes = {
  itemsToSearch: _propTypes.default.array,
  onInputChange: _propTypes.default.func,
  inputValue: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  onSelect: _propTypes.default.func,
  leftValue: _propTypes.default.string,
  selectedItem: _propTypes.default.object,
  SearchListPlaceholder: _propTypes.default.func,
  maxListItems: _propTypes.default.number,
  selectPlaceHolderText: _propTypes.default.string,
  loading: _propTypes.default.bool,
  hideItemIf: _propTypes.default.func,
  listContainerClassName: _propTypes.default.string,
  autoFocus: _propTypes.default.bool
};

//# sourceMappingURL=ui/pages/swaps/dropdown-input-pair/dropdown-input-pair.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/dropdown-input-pair/dropdown-input-pair.js",}],
[4310, {"../../../components/ui/button":3842,"../../../components/ui/button-group":3840,"../../../components/ui/info-tooltip":3896,"../../../contexts/i18n":3970,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SlippageButtons;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("../../../contexts/i18n");

var _buttonGroup = _interopRequireDefault(require("../../../components/ui/button-group"));

var _button = _interopRequireDefault(require("../../../components/ui/button"));

var _infoTooltip = _interopRequireDefault(require("../../../components/ui/info-tooltip"));

function SlippageButtons({
  onSelect,
  maxAllowedSlippage,
  currentSlippage
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const [customValue, setCustomValue] = (0, _react.useState)(() => {
    if (typeof currentSlippage === 'number' && currentSlippage !== 2 && currentSlippage !== 3) {
      return currentSlippage.toString();
    }

    return '';
  });
  const [enteringCustomValue, setEnteringCustomValue] = (0, _react.useState)(false);
  const [activeButtonIndex, setActiveButtonIndex] = (0, _react.useState)(() => {
    if (currentSlippage === 3) {
      return 1;
    } else if (currentSlippage === 2) {
      return 0;
    } else if (typeof currentSlippage === 'number') {
      return 2;
    }

    return 1; // Choose activeButtonIndex = 1 for 3% slippage by default.
  });
  const [inputRef, setInputRef] = (0, _react.useState)(null);
  let errorText = '';

  if (customValue) {
    // customValue is a string, e.g. '0'
    if (Number(customValue) < 0) {
      errorText = t('swapSlippageNegative');
    } else if (Number(customValue) > 0 && Number(customValue) <= 1) {
      // We will not show this warning for 0% slippage, because we will only
      // return non-slippage quotes from off-chain makers.
      errorText = t('swapLowSlippageError');
    } else if (Number(customValue) >= 5 && Number(customValue) <= maxAllowedSlippage) {
      errorText = t('swapHighSlippageWarning');
    } else if (Number(customValue) > maxAllowedSlippage) {
      errorText = t('swapsExcessiveSlippageWarning');
    }
  }

  const customValueText = customValue || t('swapCustom');
  (0, _react.useEffect)(() => {
    if (inputRef && enteringCustomValue && window.document.activeElement !== inputRef) {
      inputRef.focus();
    }
  }, [inputRef, enteringCustomValue]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__header-text"
  }, t('swapsAdvancedOptions'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__dropdown-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__buttons-prefix"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__prefix-text"
  }, t('swapsMaxSlippage')), /*#__PURE__*/_react.default.createElement(_infoTooltip.default, {
    position: "top",
    contentText: t('swapAdvancedSlippageInfo')
  })), /*#__PURE__*/_react.default.createElement(_buttonGroup.default, {
    defaultActiveButtonIndex: activeButtonIndex === 2 && !customValue ? 1 : activeButtonIndex,
    variant: "radiogroup",
    newActiveButtonIndex: activeButtonIndex,
    className: (0, _classnames.default)('button-group', 'slippage-buttons__button-group')
  }, /*#__PURE__*/_react.default.createElement(_button.default, {
    onClick: () => {
      setCustomValue('');
      setEnteringCustomValue(false);
      setActiveButtonIndex(0);
      onSelect(2);
    }
  }, "2%"), /*#__PURE__*/_react.default.createElement(_button.default, {
    onClick: () => {
      setCustomValue('');
      setEnteringCustomValue(false);
      setActiveButtonIndex(1);
      onSelect(3);
    }
  }, "3%"), /*#__PURE__*/_react.default.createElement(_button.default, {
    className: (0, _classnames.default)('slippage-buttons__button-group-custom-button', {
      'radio-button--danger': errorText
    }),
    onClick: () => {
      setActiveButtonIndex(2);
      setEnteringCustomValue(true);
    }
  }, enteringCustomValue ? /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('slippage-buttons__custom-input', {
      'slippage-buttons__custom-input--danger': errorText
    })
  }, /*#__PURE__*/_react.default.createElement("input", {
    onChange: event => {
      setCustomValue(event.target.value);
      onSelect(Number(event.target.value));
    },
    type: "number",
    step: "0.1",
    ref: setInputRef,
    onBlur: () => {
      setEnteringCustomValue(false);
    },
    value: customValue || ''
  })) : customValueText, (customValue || enteringCustomValue) && /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__percentage-suffix"
  }, "%")))), errorText && /*#__PURE__*/_react.default.createElement("div", {
    className: "slippage-buttons__error-text"
  }, errorText)));
}

SlippageButtons.propTypes = {
  onSelect: _propTypes.default.func.isRequired,
  maxAllowedSlippage: _propTypes.default.number.isRequired,
  currentSlippage: _propTypes.default.number
};

//# sourceMappingURL=ui/pages/swaps/slippage-buttons/slippage-buttons.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/slippage-buttons/slippage-buttons.js",}],
[4282, {"../../../../shared/constants/swaps":3597,"../../../components/ui/actionable-message/actionable-message":3835,"../../../components/ui/pulse-loader":3927,"../../../components/ui/url-icon":3968,"../../../contexts/i18n":3970,"../../../helpers/utils/util":4020,"../../../hooks/useMetricEvent":4032,"../../../selectors/selectors":4328,"../import-token":4289,"../searchable-item-list":4296,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"lodash":2646,"prop-types":2900,"react":3121,"react-redux":3088}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DropdownSearchList;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = require("lodash");

var _i18n = require("../../../contexts/i18n");

var _searchableItemList = _interopRequireDefault(require("../searchable-item-list"));

var _pulseLoader = _interopRequireDefault(require("../../../components/ui/pulse-loader"));

var _urlIcon = _interopRequireDefault(require("../../../components/ui/url-icon"));

var _actionableMessage = _interopRequireDefault(require("../../../components/ui/actionable-message/actionable-message"));

var _importToken = _interopRequireDefault(require("../import-token"));

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _selectors = require("../../../selectors/selectors");

var _swaps = require("../../../../shared/constants/swaps");

var _util = require("../../../helpers/utils/util");

function DropdownSearchList({
  searchListClassName,
  itemsToSearch,
  selectPlaceHolderText,
  fuseSearchKeys,
  defaultToAll,
  maxListItems,
  onSelect,
  startingItem,
  onOpen,
  onClose,
  className = '',
  externallySelectedItem,
  selectorClosedClassName,
  loading,
  hideRightLabels,
  hideItemIf,
  listContainerClassName,
  shouldSearchForImports
}) {
  var _ref, _rpcPrefs$blockExplor;

  const t = (0, _react.useContext)(_i18n.I18nContext);
  const [isOpen, setIsOpen] = (0, _react.useState)(false);
  const [isImportTokenModalOpen, setIsImportTokenModalOpen] = (0, _react.useState)(false);
  const [selectedItem, setSelectedItem] = (0, _react.useState)(startingItem);
  const [tokenForImport, setTokenForImport] = (0, _react.useState)(null);
  const hardwareWalletUsed = (0, _reactRedux.useSelector)(_selectors.isHardwareWallet);
  const hardwareWalletType = (0, _reactRedux.useSelector)(_selectors.getHardwareWalletType);
  const chainId = (0, _reactRedux.useSelector)(_selectors.getCurrentChainId);
  const rpcPrefs = (0, _reactRedux.useSelector)(_selectors.getRpcPrefsForCurrentProvider);
  const tokenImportedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    event: 'Token Imported',
    sensitiveProperties: {
      symbol: tokenForImport === null || tokenForImport === void 0 ? void 0 : tokenForImport.symbol,
      address: tokenForImport === null || tokenForImport === void 0 ? void 0 : tokenForImport.address,
      chain_id: chainId,
      is_hardware_wallet: hardwareWalletUsed,
      hardware_wallet_type: hardwareWalletType
    },
    category: 'swaps'
  });
  const close = (0, _react.useCallback)(() => {
    setIsOpen(false);
    onClose === null || onClose === void 0 ? void 0 : onClose();
  }, [onClose]);
  const onClickItem = (0, _react.useCallback)(item => {
    onSelect === null || onSelect === void 0 ? void 0 : onSelect(item);
    setSelectedItem(item);
    close();
  }, [onSelect, close]);

  const onOpenImportTokenModalClick = item => {
    setTokenForImport(item);
    setIsImportTokenModalOpen(true);
  };

  const onImportTokenClick = () => {
    tokenImportedEvent(); // Only when a user confirms import of a token, we add it and show it in a dropdown.

    onSelect === null || onSelect === void 0 ? void 0 : onSelect(tokenForImport);
    setSelectedItem(tokenForImport);
    setTokenForImport(null);
    close();
  };

  const onImportTokenCloseClick = () => {
    setIsImportTokenModalOpen(false);
    close();
  };

  const onClickSelector = (0, _react.useCallback)(() => {
    if (!isOpen) {
      setIsOpen(true);
      onOpen === null || onOpen === void 0 ? void 0 : onOpen();
    }
  }, [isOpen, onOpen]);
  const prevExternallySelectedItemRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    prevExternallySelectedItemRef.current = externallySelectedItem;
  });
  const prevExternallySelectedItem = prevExternallySelectedItemRef.current;
  (0, _react.useEffect)(() => {
    if (externallySelectedItem && !(0, _lodash.isEqual)(externallySelectedItem, selectedItem)) {
      setSelectedItem(externallySelectedItem);
    } else if (prevExternallySelectedItem && !externallySelectedItem) {
      setSelectedItem(null);
    }
  }, [externallySelectedItem, selectedItem, prevExternallySelectedItem]);

  const onKeyUp = e => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Enter') {
      onClickSelector(e);
    }
  };

  const blockExplorerLink = (_ref = (_rpcPrefs$blockExplor = rpcPrefs.blockExplorerUrl) !== null && _rpcPrefs$blockExplor !== void 0 ? _rpcPrefs$blockExplor : _swaps.SWAPS_CHAINID_DEFAULT_BLOCK_EXPLORER_URL_MAP[chainId]) !== null && _ref !== void 0 ? _ref : null;
  const blockExplorerLabel = rpcPrefs.blockExplorerUrl ? (0, _util.getURLHostName)(blockExplorerLink) : t('etherscan');
  const blockExplorerLinkClickedEvent = (0, _useMetricEvent.useNewMetricEvent)({
    category: 'Swaps',
    event: 'Clicked Block Explorer Link',
    properties: {
      link_type: 'Token Tracker',
      action: 'Verify Contract Address',
      block_explorer_domain: (0, _util.getURLHostName)(blockExplorerLink)
    }
  });
  const importTokenProps = {
    onImportTokenCloseClick,
    onImportTokenClick,
    setIsImportTokenModalOpen,
    tokenForImport
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('dropdown-search-list', className),
    onClick: onClickSelector,
    onKeyUp: onKeyUp,
    tabIndex: "0"
  }, tokenForImport && isImportTokenModalOpen && /*#__PURE__*/_react.default.createElement(_importToken.default, importTokenProps), !isOpen && /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('dropdown-search-list__selector-closed-container', selectorClosedClassName)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-search-list__selector-closed"
  }, (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.iconUrl) && /*#__PURE__*/_react.default.createElement(_urlIcon.default, {
    url: selectedItem.iconUrl,
    className: "dropdown-search-list__selector-closed-icon",
    name: selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.symbol
  }), !(selectedItem !== null && selectedItem !== void 0 && selectedItem.iconUrl) && /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-search-list__default-dropdown-icon"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-search-list__labels"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-search-list__item-labels"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)('dropdown-search-list__closed-primary-label', {
      'dropdown-search-list__select-default': !(selectedItem !== null && selectedItem !== void 0 && selectedItem.symbol)
    })
  }, (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.symbol) || selectPlaceHolderText)))), /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-caret-down fa-lg dropdown-search-list__caret"
  })), isOpen && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_searchableItemList.default, {
    itemsToSearch: loading ? [] : itemsToSearch,
    Placeholder: ({
      searchQuery
    }) => loading ? /*#__PURE__*/_react.default.createElement("div", {
      className: "dropdown-search-list__loading-item"
    }, /*#__PURE__*/_react.default.createElement(_pulseLoader.default, null), /*#__PURE__*/_react.default.createElement("div", {
      className: "dropdown-search-list__loading-item-text-container"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "dropdown-search-list__loading-item-text"
    }, t('swapFetchingTokens')))) : /*#__PURE__*/_react.default.createElement("div", {
      className: "dropdown-search-list__placeholder"
    }, t('swapBuildQuotePlaceHolderText', [searchQuery]), /*#__PURE__*/_react.default.createElement("div", {
      tabIndex: "0",
      className: "searchable-item-list__item searchable-item-list__item--add-token",
      key: "searchable-item-list-item-last"
    }, /*#__PURE__*/_react.default.createElement(_actionableMessage.default, {
      message: blockExplorerLink && t('addCustomTokenByContractAddress', [/*#__PURE__*/_react.default.createElement("a", {
        key: "dropdown-search-list__etherscan-link",
        onClick: () => {
          blockExplorerLinkClickedEvent();
          global.platform.openTab({
            url: blockExplorerLink
          });
        },
        target: "_blank",
        rel: "noopener noreferrer"
      }, blockExplorerLabel)])
    }))),
    searchPlaceholderText: t('swapSearchForAToken'),
    fuseSearchKeys: fuseSearchKeys,
    defaultToAll: defaultToAll,
    onClickItem: onClickItem,
    onOpenImportTokenModalClick: onOpenImportTokenModalClick,
    maxListItems: maxListItems,
    className: (0, _classnames.default)('dropdown-search-list__token-container', searchListClassName, {
      'dropdown-search-list--open': isOpen
    }),
    hideRightLabels: hideRightLabels,
    hideItemIf: hideItemIf,
    listContainerClassName: listContainerClassName,
    shouldSearchForImports: shouldSearchForImports
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-search-list__close-area",
    onClick: event => {
      event.stopPropagation();
      setIsOpen(false);
      onClose === null || onClose === void 0 ? void 0 : onClose();
    }
  })));
}

DropdownSearchList.propTypes = {
  itemsToSearch: _propTypes.default.array,
  onSelect: _propTypes.default.func,
  searchListClassName: _propTypes.default.string,
  fuseSearchKeys: _propTypes.default.arrayOf(_propTypes.default.shape({
    name: _propTypes.default.string,
    weight: _propTypes.default.number
  })),
  defaultToAll: _propTypes.default.bool,
  maxListItems: _propTypes.default.number,
  startingItem: _propTypes.default.object,
  onOpen: _propTypes.default.func,
  onClose: _propTypes.default.func,
  className: _propTypes.default.string,
  externallySelectedItem: _propTypes.default.object,
  loading: _propTypes.default.bool,
  selectPlaceHolderText: _propTypes.default.string,
  selectorClosedClassName: _propTypes.default.string,
  hideRightLabels: _propTypes.default.bool,
  hideItemIf: _propTypes.default.func,
  listContainerClassName: _propTypes.default.string,
  shouldSearchForImports: _propTypes.default.bool
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/pages/swaps/dropdown-search-list/dropdown-search-list.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/dropdown-search-list/dropdown-search-list.js",}],
[3729, {"../../../../../shared/constants/network":3595,"../../../ui/button":3842,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _network = require("../../../../../shared/constants/network");

var _button = _interopRequireDefault(require("../../../ui/button"));

class DepositEtherModal extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "goToAccountDetailsModal", () => {
      this.props.hideWarning();
      this.props.hideModal();
      this.props.showAccountDetailModal();
    });
  }

  renderRow({
    logo,
    title,
    text,
    buttonLabel,
    onButtonClick,
    hide,
    className,
    hideButton,
    hideTitle,
    onBackClick,
    showBackButton
  }) {
    if (hide) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: className || 'deposit-ether-modal__buy-row'
    }, onBackClick && showBackButton && /*#__PURE__*/_react.default.createElement("div", {
      className: "deposit-ether-modal__buy-row__back",
      onClick: onBackClick
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-arrow-left cursor-pointer"
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "deposit-ether-modal__buy-row__logo-container"
    }, logo), /*#__PURE__*/_react.default.createElement("div", {
      className: "deposit-ether-modal__buy-row__description"
    }, !hideTitle && /*#__PURE__*/_react.default.createElement("div", {
      className: "deposit-ether-modal__buy-row__description__title"
    }, title), /*#__PURE__*/_react.default.createElement("div", {
      className: "deposit-ether-modal__buy-row__description__text"
    }, text)), !hideButton && /*#__PURE__*/_react.default.createElement("div", {
      className: "deposit-ether-modal__buy-row__button"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      className: "deposit-ether-modal__deposit-button",
      large: true,
      onClick: onButtonClick
    }, buttonLabel)));
  }

  render() {
    const {
      chainId,
      toWyre,
      toTransak,
      address,
      toFaucet,
      isTestnet,
      isMainnet
    } = this.props;
    const networkName = _network.NETWORK_TO_NAME_MAP[chainId];
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container page-container--full-width page-container--full-height"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__title"
    }, this.context.t('depositEther')), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__subtitle"
    }, this.context.t('needEtherInWallet')), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__header-close",
      onClick: () => {
        this.props.hideWarning();
        this.props.hideModal();
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "page-container__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "deposit-ether-modal__buy-rows"
    }, this.renderRow({
      logo: /*#__PURE__*/_react.default.createElement("div", {
        className: "deposit-ether-modal__logo",
        style: {
          backgroundImage: "url('./images/wyre.svg')",
          height: '40px'
        }
      }),
      title: this.context.t('buyWithWyre'),
      text: this.context.t('buyWithWyreDescription'),
      buttonLabel: this.context.t('continueToWyre'),
      onButtonClick: () => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Deposit Ether',
            name: 'Click buy Ether via Wyre'
          }
        });
        toWyre(address);
      },
      hide: !isMainnet
    }), this.renderRow({
      logo: /*#__PURE__*/_react.default.createElement("div", {
        className: "deposit-ether-modal__logo",
        style: {
          backgroundImage: "url('./images/transak.svg')",
          height: '60px'
        }
      }),
      title: this.context.t('buyWithTransak'),
      text: this.context.t('buyWithTransakDescription'),
      buttonLabel: this.context.t('continueToTransak'),
      onButtonClick: () => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Accounts',
            action: 'Deposit Ether',
            name: 'Click buy Ether via Transak'
          }
        });
        toTransak(address);
      },
      hide: !isMainnet
    }), this.renderRow({
      logo: /*#__PURE__*/_react.default.createElement("img", {
        alt: "",
        className: "deposit-ether-modal__logo",
        src: "./images/deposit-eth.svg",
        style: {
          height: '75px',
          width: '75px'
        }
      }),
      title: this.context.t('directDepositEther'),
      text: this.context.t('directDepositEtherExplainer'),
      buttonLabel: this.context.t('viewAccount'),
      onButtonClick: () => this.goToAccountDetailsModal()
    }), networkName && this.renderRow({
      logo: /*#__PURE__*/_react.default.createElement("i", {
        className: "fa fa-tint fa-2x"
      }),
      title: this.context.t('testFaucet'),
      text: this.context.t('getEtherFromFaucet', [networkName]),
      buttonLabel: this.context.t('getEther'),
      onButtonClick: () => toFaucet(chainId),
      hide: !isTestnet
    }))));
  }

}

exports.default = DepositEtherModal;
(0, _defineProperty2.default)(DepositEtherModal, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func.isRequired
});
(0, _defineProperty2.default)(DepositEtherModal, "propTypes", {
  chainId: _propTypes.default.string.isRequired,
  isTestnet: _propTypes.default.bool.isRequired,
  isMainnet: _propTypes.default.bool.isRequired,
  toWyre: _propTypes.default.func.isRequired,
  toTransak: _propTypes.default.func.isRequired,
  address: _propTypes.default.string.isRequired,
  toFaucet: _propTypes.default.func.isRequired,
  hideWarning: _propTypes.default.func.isRequired,
  hideModal: _propTypes.default.func.isRequired,
  showAccountDetailModal: _propTypes.default.func.isRequired
});

//# sourceMappingURL=ui/components/app/modals/deposit-ether-modal/deposit-ether-modal.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/deposit-ether-modal/deposit-ether-modal.component.js",}],
[3750, {"../../../../../app/scripts/lib/util":78,"../../../../../shared/constants/app":3591,"../../../../../shared/constants/time":3598,"../../../../helpers/utils/util":4020,"../../../../helpers/utils/webcam-utils":4021,"../../../ui/page-container/page-container-footer/page-container-footer.component":3921,"../../../ui/spinner":3943,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@zxing/library":1066,"loglevel":2657,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _loglevel = _interopRequireDefault(require("loglevel"));

var _library = require("@zxing/library");

var _util = require("../../../../../app/scripts/lib/util");

var _app = require("../../../../../shared/constants/app");

var _time = require("../../../../../shared/constants/time");

var _spinner = _interopRequireDefault(require("../../../ui/spinner"));

var _webcamUtils = _interopRequireDefault(require("../../../../helpers/utils/webcam-utils"));

var _util2 = require("../../../../helpers/utils/util");

var _pageContainerFooter = _interopRequireDefault(require("../../../ui/page-container/page-container-footer/page-container-footer.component"));

const READY_STATE = {
  ACCESSING_CAMERA: 'ACCESSING_CAMERA',
  NEED_TO_ALLOW_ACCESS: 'NEED_TO_ALLOW_ACCESS',
  READY: 'READY'
};

class QrScanner extends _react.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "checkEnvironment", async () => {
      try {
        const {
          environmentReady
        } = await _webcamUtils.default.checkStatus();

        if (!environmentReady && (0, _util.getEnvironmentType)() !== _app.ENVIRONMENT_TYPE_FULLSCREEN) {
          const currentUrl = (0, _util2.getURL)(window.location.href);
          const currentHash = currentUrl === null || currentUrl === void 0 ? void 0 : currentUrl.hash;
          const currentRoute = currentHash ? currentHash.substring(1) : null;
          global.platform.openExtensionInBrowser(currentRoute);
        }
      } catch (error) {
        if (this.mounted) {
          this.setState({
            error
          });
        }
      } // initial attempt is required to trigger permission prompt


      this.initCamera();
    });
    (0, _defineProperty2.default)(this, "checkPermissions", async () => {
      try {
        const {
          permissions
        } = await _webcamUtils.default.checkStatus();

        if (permissions) {
          // Let the video stream load first...
          await new Promise(resolve => setTimeout(resolve, _time.SECOND * 2));

          if (!this.mounted) {
            return;
          }

          this.setState({
            ready: READY_STATE.READY
          });
        } else if (this.mounted) {
          // Keep checking for permissions
          this.permissionChecker = setTimeout(this.checkPermissions, _time.SECOND);
        }
      } catch (error) {
        if (this.mounted) {
          this.setState({
            error
          });
        }
      }
    });
    (0, _defineProperty2.default)(this, "initCamera", async () => {
      // The `decodeFromInputVideoDevice` call prompts the browser to show
      // the user the camera permission request.  We must then call it again
      // once we receive permission so that the video displays.
      // It's important to prevent this codeReader from being created twice;
      // Firefox otherwise starts 2 video streams, one of which cannot be stopped
      if (!this.codeReader) {
        this.codeReader = new _library.BrowserQRCodeReader();
      }

      try {
        await this.codeReader.getVideoInputDevices();
        this.checkPermissions();
        const content = await this.codeReader.decodeFromInputVideoDevice(undefined, 'video');
        const result = this.parseContent(content.text);

        if (!this.mounted) {
          return;
        } else if (result.type === 'unknown') {
          this.setState({
            error: new Error(this.context.t('unknownQrCode'))
          });
        } else {
          this.props.qrCodeDetected(result);
          this.stopAndClose();
        }
      } catch (error) {
        if (!this.mounted) {
          return;
        }

        if (error.name === 'NotAllowedError') {
          _loglevel.default.info(`Permission denied: '${error}'`);

          this.setState({
            ready: READY_STATE.NEED_TO_ALLOW_ACCESS
          });
        } else {
          this.setState({
            error
          });
        }
      }
    });
    (0, _defineProperty2.default)(this, "stopAndClose", () => {
      if (this.codeReader) {
        this.teardownCodeReader();
      }

      this.props.hideModal();
    });
    (0, _defineProperty2.default)(this, "tryAgain", () => {
      clearTimeout(this.permissionChecker);

      if (this.codeReader) {
        this.teardownCodeReader();
      }

      this.setState(this.getInitialState(), () => {
        this.checkEnvironment();
      });
    });
    this.state = this.getInitialState();
    this.codeReader = null;
    this.permissionChecker = null;
    this.mounted = false; // Clear pre-existing qr code data before scanning

    this.props.qrCodeDetected(null);
  }

  componentDidMount() {
    this.mounted = true;
    this.checkEnvironment();
  }

  componentDidUpdate(_, prevState) {
    const {
      ready
    } = this.state;

    if (prevState.ready !== ready) {
      if (ready === READY_STATE.READY) {
        this.initCamera();
      } else if (ready === READY_STATE.NEED_TO_ALLOW_ACCESS) {
        this.checkPermissions();
      }
    }
  }

  getInitialState() {
    return {
      ready: READY_STATE.ACCESSING_CAMERA,
      error: null
    };
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.permissionChecker);
    this.teardownCodeReader();
  }

  teardownCodeReader() {
    if (this.codeReader) {
      this.codeReader.reset();
      this.codeReader.stop();
      this.codeReader = null;
    }
  }

  parseContent(content) {
    let type = 'unknown';
    let values = {}; // Here we could add more cases
    // To parse other type of links
    // For ex. EIP-681 (https://eips.ethereum.org/EIPS/eip-681)
    // Ethereum address links - fox ex. ethereum:0x.....1111

    if (content.split('ethereum:').length > 1) {
      type = 'address';
      values = {
        address: content.split('ethereum:')[1]
      }; // Regular ethereum addresses - fox ex. 0x.....1111
    } else if (content.substring(0, 2).toLowerCase() === '0x') {
      type = 'address';
      values = {
        address: content
      };
    }

    return {
      type,
      values
    };
  }

  renderError() {
    const {
      t
    } = this.context;
    const {
      error
    } = this.state;
    let title, msg;

    if (error.type === 'NO_WEBCAM_FOUND') {
      title = t('noWebcamFoundTitle');
      msg = t('noWebcamFound');
    } else if (error.message === t('unknownQrCode')) {
      msg = t('unknownQrCode');
    } else {
      title = t('unknownCameraErrorTitle');
      msg = t('unknownCameraError');
    }

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__image"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "images/webcam.svg",
      width: "70",
      height: "70",
      alt: ""
    })), title ? /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__title"
    }, title) : null, /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__error"
    }, msg), /*#__PURE__*/_react.default.createElement(_pageContainerFooter.default, {
      onCancel: this.stopAndClose,
      onSubmit: this.tryAgain,
      cancelText: t('cancel'),
      submitText: t('tryAgain'),
      submitButtonType: "confirm"
    }));
  }

  renderVideo() {
    const {
      t
    } = this.context;
    const {
      ready
    } = this.state;
    let message;

    if (ready === READY_STATE.ACCESSING_CAMERA) {
      message = t('accessingYourCamera');
    } else if (ready === READY_STATE.READY) {
      message = t('scanInstructions');
    } else if (ready === READY_STATE.NEED_TO_ALLOW_ACCESS) {
      message = t('youNeedToAllowCameraAccess');
    }

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__title"
    }, `${t('scanQrCode')}`), /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__content__video-wrapper"
    }, /*#__PURE__*/_react.default.createElement("video", {
      id: "video",
      style: {
        display: ready === READY_STATE.READY ? 'block' : 'none'
      }
    }), ready === READY_STATE.READY ? null : /*#__PURE__*/_react.default.createElement(_spinner.default, {
      color: "#F7C06C"
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__status"
    }, message));
  }

  render() {
    const {
      error
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "qr-scanner__close",
      onClick: this.stopAndClose
    }), error ? this.renderError() : this.renderVideo());
  }

}

exports.default = QrScanner;
(0, _defineProperty2.default)(QrScanner, "propTypes", {
  hideModal: _propTypes.default.func.isRequired,
  qrCodeDetected: _propTypes.default.func.isRequired
});
(0, _defineProperty2.default)(QrScanner, "contextTypes", {
  t: _propTypes.default.func
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/components/app/modals/qr-scanner/qr-scanner.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/qr-scanner/qr-scanner.component.js",}],
[4004, {"./with-modal-props":4005,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _withModalProps.default;
  }
});

var _withModalProps = _interopRequireDefault(require("./with-modal-props"));

//# sourceMappingURL=ui/helpers/higher-order-components/with-modal-props/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/helpers/higher-order-components/with-modal-props/index.js",}],
[3721, {"../../../../helpers/utils/util":4020,"../../../ui/identicon":3895,"../../modal":3700,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/etherscan-link":966,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _etherscanLink = require("@metamask/etherscan-link");

var _modal = _interopRequireDefault(require("../../modal"));

var _util = require("../../../../helpers/utils/util");

var _identicon = _interopRequireDefault(require("../../../ui/identicon"));

class ConfirmRemoveAccount extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "handleRemove", () => {
      this.props.removeAccount(this.props.identity.address).then(() => this.props.hideModal());
    });
    (0, _defineProperty2.default)(this, "handleCancel", () => {
      this.props.hideModal();
    });
  }

  renderSelectedAccount() {
    const {
      t
    } = this.context;
    const {
      identity,
      rpcPrefs,
      chainId
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-remove-account__account"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-remove-account__account__identicon"
    }, /*#__PURE__*/_react.default.createElement(_identicon.default, {
      address: identity.address,
      diameter: 32
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-remove-account__account__name"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "confirm-remove-account__account__label"
    }, t('name')), /*#__PURE__*/_react.default.createElement("span", {
      className: "account_value"
    }, identity.name)), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-remove-account__account__address"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "confirm-remove-account__account__label"
    }, t('publicAddress')), /*#__PURE__*/_react.default.createElement("span", {
      className: "account_value"
    }, (0, _util.addressSummary)(identity.address, 4, 4))), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-remove-account__account__link"
    }, /*#__PURE__*/_react.default.createElement("a", {
      className: "",
      onClick: () => {
        const accountLink = (0, _etherscanLink.getAccountLink)(identity.address, chainId, rpcPrefs);
        this.context.trackEvent({
          category: 'Accounts',
          event: 'Clicked Block Explorer Link',
          properties: {
            link_type: 'Account Tracker',
            action: 'Remove Account',
            block_explorer_domain: (0, _util.getURLHostName)(accountLink)
          }
        });
        global.platform.openTab({
          url: accountLink
        });
      },
      target: "_blank",
      rel: "noopener noreferrer",
      title: t('etherscanView')
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "images/popout.svg",
      alt: t('etherscanView')
    }))));
  }

  render() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_modal.default, {
      headerText: `${t('removeAccount')}?`,
      onClose: this.handleCancel,
      onSubmit: this.handleRemove,
      onCancel: this.handleCancel,
      submitText: t('remove'),
      cancelText: t('nevermind'),
      submitType: "secondary"
    }, /*#__PURE__*/_react.default.createElement("div", null, this.renderSelectedAccount(), /*#__PURE__*/_react.default.createElement("div", {
      className: "confirm-remove-account__description"
    }, t('removeAccountDescription'), /*#__PURE__*/_react.default.createElement("a", {
      className: "confirm-remove-account__link",
      rel: "noopener noreferrer",
      target: "_blank",
      href: "https://metamask.zendesk.com/hc/en-us/articles/360015289932"
    }, t('learnMore')))));
  }

}

exports.default = ConfirmRemoveAccount;
(0, _defineProperty2.default)(ConfirmRemoveAccount, "propTypes", {
  hideModal: _propTypes.default.func.isRequired,
  removeAccount: _propTypes.default.func.isRequired,
  identity: _propTypes.default.object.isRequired,
  chainId: _propTypes.default.string.isRequired,
  rpcPrefs: _propTypes.default.object.isRequired
});
(0, _defineProperty2.default)(ConfirmRemoveAccount, "contextTypes", {
  t: _propTypes.default.func,
  trackEvent: _propTypes.default.func
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/components/app/modals/confirm-remove-account/confirm-remove-account.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-remove-account/confirm-remove-account.component.js",}],
[3753, {"../../modal":3700,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _modal = _interopRequireDefault(require("../../modal"));

class RejectTransactionsModal extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "onSubmit", async () => {
      const {
        onSubmit,
        hideModal
      } = this.props;
      await onSubmit();
      hideModal();
    });
  }

  render() {
    const {
      t
    } = this.context;
    const {
      hideModal,
      unapprovedTxCount
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_modal.default, {
      headerText: t('rejectTxsN', [unapprovedTxCount]),
      onClose: hideModal,
      onSubmit: this.onSubmit,
      onCancel: hideModal,
      submitText: t('rejectAll'),
      cancelText: t('cancel'),
      submitType: "secondary"
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "reject-transactions__description"
    }, t('rejectTxsDescription', [unapprovedTxCount]))));
  }

}

exports.default = RejectTransactionsModal;
(0, _defineProperty2.default)(RejectTransactionsModal, "contextTypes", {
  t: _propTypes.default.func.isRequired
});
(0, _defineProperty2.default)(RejectTransactionsModal, "propTypes", {
  onSubmit: _propTypes.default.func.isRequired,
  hideModal: _propTypes.default.func.isRequired,
  unapprovedTxCount: _propTypes.default.number.isRequired
});

//# sourceMappingURL=ui/components/app/modals/reject-transactions/reject-transactions.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/reject-transactions/reject-transactions.component.js",}],
[3743, {"../../../ui/metafox-logo":3915,"../../../ui/page-container/page-container-footer":3920,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _metafoxLogo = _interopRequireDefault(require("../../../ui/metafox-logo"));

var _pageContainerFooter = _interopRequireDefault(require("../../../ui/page-container/page-container-footer"));

class MetaMetricsOptInModal extends _react.Component {
  render() {
    const {
      metricsEvent,
      t
    } = this.context;
    const {
      setParticipateInMetaMetrics,
      hideModal
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in metametrics-opt-in-modal"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__main"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__content"
    }, /*#__PURE__*/_react.default.createElement(_metafoxLogo.default, null), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__body-graphic"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "images/metrics-chart.svg",
      alt: ""
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__title"
    }, t('metametricsHelpImproveMetaMask')), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__body"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__description"
    }, t('metametricsOptInDescription')), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__description"
    }, t('metametricsCommitmentsIntro')), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__committments"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-check"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row-description"
    }, t('metametricsCommitmentsAllowOptOut'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-check"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row-description"
    }, t('metametricsCommitmentsSendAnonymizedEvents'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row metametrics-opt-in__break-row"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-times"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row-description"
    }, t('metametricsCommitmentsNeverCollectKeysEtc', [/*#__PURE__*/_react.default.createElement("span", {
      className: "metametrics-opt-in__bold",
      key: "neverCollectKeys"
    }, t('metametricsCommitmentsBoldNever'))]))), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-times"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row-description"
    }, t('metametricsCommitmentsNeverCollectIP', [/*#__PURE__*/_react.default.createElement("span", {
      className: "metametrics-opt-in__bold",
      key: "neverCollectIP"
    }, t('metametricsCommitmentsBoldNever'))]))), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row"
    }, /*#__PURE__*/_react.default.createElement("i", {
      className: "fa fa-times"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__row-description"
    }, t('metametricsCommitmentsNeverSellDataForProfit', [/*#__PURE__*/_react.default.createElement("span", {
      className: "metametrics-opt-in__bold",
      key: "neverSellData"
    }, t('metametricsCommitmentsBoldNever'))]))))), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__bottom-text"
    }, t('gdprMessage', [/*#__PURE__*/_react.default.createElement("a", {
      key: "metametrics-bottom-text-wrapper",
      href: "https://monstainfinite.com/privacy-policy",
      target: "_blank",
      rel: "noopener noreferrer"
    }, t('gdprMessagePrivacyPolicy'))]))), /*#__PURE__*/_react.default.createElement("div", {
      className: "metametrics-opt-in__footer"
    }, /*#__PURE__*/_react.default.createElement(_pageContainerFooter.default, {
      onCancel: () => {
        setParticipateInMetaMetrics(false).then(() => {
          metricsEvent({
            eventOpts: {
              category: 'Onboarding',
              action: 'Metrics Option',
              name: 'Metrics Opt Out'
            },
            isOptIn: true
          }, {
            excludeMetaMetricsId: true
          });
          hideModal();
        });
      },
      cancelText: t('noThanks'),
      hideCancel: false,
      onSubmit: () => {
        setParticipateInMetaMetrics(true).then(() => {
          metricsEvent({
            eventOpts: {
              category: 'Onboarding',
              action: 'Metrics Option',
              name: 'Metrics Opt In'
            },
            isOptIn: true
          });
          hideModal();
        });
      },
      submitText: t('affirmAgree'),
      submitButtonType: "confirm",
      disabled: false
    }))));
  }

}

exports.default = MetaMetricsOptInModal;
(0, _defineProperty2.default)(MetaMetricsOptInModal, "propTypes", {
  setParticipateInMetaMetrics: _propTypes.default.func,
  hideModal: _propTypes.default.func
});
(0, _defineProperty2.default)(MetaMetricsOptInModal, "contextTypes", {
  metricsEvent: _propTypes.default.func,
  t: _propTypes.default.func
});

//# sourceMappingURL=ui/components/app/modals/metametrics-opt-in-modal/metametrics-opt-in-modal.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/metametrics-opt-in-modal/metametrics-opt-in-modal.component.js",}],
[3747, {"../../../ui/button/button.component":3841,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _button = _interopRequireDefault(require("../../../ui/button/button.component"));

class NewAccountModal extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      alias: this.context.t('newAccountNumberName', [this.props.newAccountNumber])
    });
    (0, _defineProperty2.default)(this, "onChange", e => {
      this.setState({
        alias: e.target.value
      });
    });
    (0, _defineProperty2.default)(this, "onSubmit", () => {
      this.props.onSave(this.state.alias).then(this.props.hideModal);
    });
    (0, _defineProperty2.default)(this, "onKeyPress", e => {
      if (e.key === 'Enter' && this.state.alias) {
        this.onSubmit();
      }
    });
  }

  render() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-modal"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-modal__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-modal__content__header"
    }, t('newAccount'), /*#__PURE__*/_react.default.createElement("button", {
      className: "fas fa-times new-account-modal__content__header-close",
      title: t('close'),
      onClick: this.props.hideModal
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-modal__input-label"
    }, t('accountName')), /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      className: "new-account-modal__input",
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      value: this.state.alias,
      autoFocus: true
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "new-account-modal__footer"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      onClick: this.props.hideModal
    }, t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "primary",
      onClick: this.onSubmit,
      disabled: !this.state.alias
    }, t('save'))));
  }

}

exports.default = NewAccountModal;
(0, _defineProperty2.default)(NewAccountModal, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(NewAccountModal, "propTypes", {
  hideModal: _propTypes.default.func.isRequired,
  newAccountNumber: _propTypes.default.number.isRequired,
  onSave: _propTypes.default.func.isRequired
});

//# sourceMappingURL=ui/components/app/modals/new-account-modal/new-account-modal.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/new-account-modal/new-account-modal.component.js",}],
[3724, {"../../modal":3700,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _modal = _interopRequireWildcard(require("../../modal"));

class ConfirmResetAccount extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "handleReset", () => {
      this.props.resetAccount().then(() => this.props.hideModal());
    });
  }

  render() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_modal.default, {
      onSubmit: this.handleReset,
      onCancel: () => this.props.hideModal(),
      submitText: t('reset'),
      cancelText: t('nevermind'),
      submitType: "danger"
    }, /*#__PURE__*/_react.default.createElement(_modal.ModalContent, {
      title: `${t('resetAccount')}?`,
      description: t('resetAccountDescription')
    }));
  }

}

exports.default = ConfirmResetAccount;
(0, _defineProperty2.default)(ConfirmResetAccount, "propTypes", {
  hideModal: _propTypes.default.func.isRequired,
  resetAccount: _propTypes.default.func.isRequired
});
(0, _defineProperty2.default)(ConfirmResetAccount, "contextTypes", {
  t: _propTypes.default.func
});

//# sourceMappingURL=ui/components/app/modals/confirm-reset-account/confirm-reset-account.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-reset-account/confirm-reset-account.component.js",}],
[3718, {"../../modal":3700,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _modal = _interopRequireWildcard(require("../../modal"));

class ConfirmDeleteNetwork extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "handleDelete", () => {
      this.props.delRpcTarget(this.props.target).then(() => {
        this.props.onConfirm();
        this.props.hideModal();
      });
    });
  }

  render() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_modal.default, {
      onSubmit: this.handleDelete,
      onCancel: () => this.props.hideModal(),
      submitText: t('delete'),
      cancelText: t('cancel'),
      submitType: "danger"
    }, /*#__PURE__*/_react.default.createElement(_modal.ModalContent, {
      title: t('deleteNetwork'),
      description: t('deleteNetworkDescription')
    }));
  }

}

exports.default = ConfirmDeleteNetwork;
(0, _defineProperty2.default)(ConfirmDeleteNetwork, "propTypes", {
  hideModal: _propTypes.default.func.isRequired,
  delRpcTarget: _propTypes.default.func.isRequired,
  onConfirm: _propTypes.default.func.isRequired,
  target: _propTypes.default.string.isRequired
});
(0, _defineProperty2.default)(ConfirmDeleteNetwork, "contextTypes", {
  t: _propTypes.default.func
});

//# sourceMappingURL=ui/components/app/modals/confirm-delete-network/confirm-delete-network.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/confirm-delete-network/confirm-delete-network.component.js",}],
[3756, {"../../modal":3700,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _modal = _interopRequireDefault(require("../../modal"));

class TransactionConfirmed extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "handleSubmit", () => {
      const {
        hideModal,
        onSubmit
      } = this.props;
      hideModal();

      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit();
      }
    });
  }

  render() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_modal.default, {
      onSubmit: this.handleSubmit,
      submitText: t('ok')
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "transaction-confirmed__content"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "images/check-icon.svg",
      alt: ""
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "transaction-confirmed__title"
    }, `${t('confirmed')}!`), /*#__PURE__*/_react.default.createElement("div", {
      className: "transaction-confirmed__description"
    }, t('initialTransactionConfirmed'))));
  }

}

exports.default = TransactionConfirmed;
(0, _defineProperty2.default)(TransactionConfirmed, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(TransactionConfirmed, "propTypes", {
  onSubmit: _propTypes.default.func,
  hideModal: _propTypes.default.func
});

//# sourceMappingURL=ui/components/app/modals/transaction-confirmed/transaction-confirmed.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/transaction-confirmed/transaction-confirmed.component.js",}],
[3710, {"../../../ui/button/button.component":3841,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _button = _interopRequireDefault(require("../../../ui/button/button.component"));

class AddToAddressBookModal extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      alias: ''
    });
    (0, _defineProperty2.default)(this, "onSave", async () => {
      const {
        recipient,
        addToAddressBook,
        hideModal
      } = this.props;
      await addToAddressBook(recipient, this.state.alias);
      hideModal();
    });
    (0, _defineProperty2.default)(this, "onChange", e => {
      this.setState({
        alias: e.target.value
      });
    });
    (0, _defineProperty2.default)(this, "onKeyPress", async e => {
      if (e.key === 'Enter' && this.state.alias) {
        this.onSave();
      }
    });
  }

  render() {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "add-to-address-book-modal"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "add-to-address-book-modal__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "add-to-address-book-modal__content__header"
    }, t('addToAddressBook')), /*#__PURE__*/_react.default.createElement("div", {
      className: "add-to-address-book-modal__input-label"
    }, t('enterAnAlias')), /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      className: "add-to-address-book-modal__input",
      placeholder: t('addToAddressBookModalPlaceholder'),
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      value: this.state.alias,
      autoFocus: true
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "add-to-address-book-modal__footer"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      onClick: this.props.hideModal
    }, t('cancel')), /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "primary",
      onClick: this.onSave,
      disabled: !this.state.alias
    }, t('save'))));
  }

}

exports.default = AddToAddressBookModal;
(0, _defineProperty2.default)(AddToAddressBookModal, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(AddToAddressBookModal, "propTypes", {
  hideModal: _propTypes.default.func.isRequired,
  addToAddressBook: _propTypes.default.func.isRequired,
  recipient: _propTypes.default.string.isRequired
});

//# sourceMappingURL=ui/components/app/modals/add-to-addressbook-modal/add-to-addressbook-modal.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/add-to-addressbook-modal/add-to-addressbook-modal.component.js",}],
[3732, {"../../../../helpers/utils/token-util":4017,"../../../ui/identicon":3895,"../../../ui/text-field":3951,"../../modal":3700,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"bignumber.js":1351,"classnames":1449,"loglevel":2657,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _loglevel = _interopRequireDefault(require("loglevel"));

var _classnames = _interopRequireDefault(require("classnames"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _modal = _interopRequireDefault(require("../../modal"));

var _identicon = _interopRequireDefault(require("../../../ui/identicon"));

var _textField = _interopRequireDefault(require("../../../ui/text-field"));

var _tokenUtil = require("../../../../helpers/utils/token-util");

const MAX_UNSIGNED_256_INT = new _bignumber.default(2).pow(256).minus(1).toString(10);

class EditApprovalPermission extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      // This is used as a TextField value, which should be a string.
      customSpendLimit: this.props.customTokenAmount || '',
      selectedOptionIsUnlimited: !this.props.customTokenAmount
    });
  }

  renderModalContent(error) {
    const {
      t
    } = this.context;
    const {
      hideModal,
      selectedIdentity,
      tokenAmount,
      tokenSymbol,
      tokenBalance,
      customTokenAmount,
      origin
    } = this.props;
    const {
      name,
      address
    } = selectedIdentity || {};
    const {
      selectedOptionIsUnlimited
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__header"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__title"
    }, t('editPermission')), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__header__close",
      onClick: () => hideModal()
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__account-info"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__account-info__account"
    }, /*#__PURE__*/_react.default.createElement(_identicon.default, {
      address: address,
      diameter: 32
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__name-and-balance-container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__account-info__name"
    }, name), /*#__PURE__*/_react.default.createElement("div", null, t('balance')))), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__account-info__balance"
    }, `${Number(tokenBalance).toPrecision(9)} ${tokenSymbol}`)), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__title"
    }, t('spendLimitPermission')), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__description"
    }, t('allowWithdrawAndSpend', [origin])), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__radio-button",
      onClick: () => this.setState({
        selectedOptionIsUnlimited: true
      })
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)({
        'edit-approval-permission__edit-section__radio-button-outline': !selectedOptionIsUnlimited,
        'edit-approval-permission__edit-section__radio-button-outline--selected': selectedOptionIsUnlimited
      })
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__radio-button-fill"
    }), selectedOptionIsUnlimited && /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__radio-button-dot"
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option-text"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)({
        'edit-approval-permission__edit-section__option-label': !selectedOptionIsUnlimited,
        'edit-approval-permission__edit-section__option-label--selected': selectedOptionIsUnlimited
      })
    }, new _bignumber.default(tokenAmount).lessThan(new _bignumber.default(tokenBalance)) ? t('proposedApprovalLimit') : t('unlimited')), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option-description"
    }, t('spendLimitRequestedBy', [origin])), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option-value"
    }, `${Number(tokenAmount)} ${tokenSymbol}`))), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__radio-button",
      onClick: () => this.setState({
        selectedOptionIsUnlimited: false
      })
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)({
        'edit-approval-permission__edit-section__radio-button-outline': selectedOptionIsUnlimited,
        'edit-approval-permission__edit-section__radio-button-outline--selected': !selectedOptionIsUnlimited
      })
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__radio-button-fill"
    }), !selectedOptionIsUnlimited && /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__radio-button-dot"
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option-text"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)({
        'edit-approval-permission__edit-section__option-label': selectedOptionIsUnlimited,
        'edit-approval-permission__edit-section__option-label--selected': !selectedOptionIsUnlimited
      })
    }, t('customSpendLimit')), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option-description"
    }, t('enterMaxSpendLimit')), /*#__PURE__*/_react.default.createElement("div", {
      className: "edit-approval-permission__edit-section__option-input"
    }, /*#__PURE__*/_react.default.createElement(_textField.default, {
      type: "number",
      placeholder: `${Number(customTokenAmount || tokenAmount)} ${tokenSymbol}`,
      onChange: event => {
        this.setState({
          customSpendLimit: event.target.value
        });

        if (selectedOptionIsUnlimited) {
          this.setState({
            selectedOptionIsUnlimited: false
          });
        }
      },
      fullWidth: true,
      margin: "dense",
      value: this.state.customSpendLimit,
      error: error,
      theme: "white-bordered"
    }))))));
  }

  validateSpendLimit() {
    const {
      t
    } = this.context;
    const {
      decimals,
      requiredMinimum
    } = this.props;
    const {
      selectedOptionIsUnlimited,
      customSpendLimit
    } = this.state;

    if (selectedOptionIsUnlimited || !customSpendLimit) {
      return undefined;
    }

    let customSpendLimitNumber;

    try {
      customSpendLimitNumber = new _bignumber.default(customSpendLimit);
    } catch (error) {
      _loglevel.default.debug(`Error converting '${customSpendLimit}' to BigNumber:`, error);

      return t('spendLimitInvalid');
    }

    if (customSpendLimitNumber.isNegative()) {
      return t('spendLimitInvalid');
    }

    const maxTokenAmount = (0, _tokenUtil.calcTokenAmount)(MAX_UNSIGNED_256_INT, decimals);

    if (customSpendLimitNumber.greaterThan(maxTokenAmount)) {
      return t('spendLimitTooLarge');
    }

    if (requiredMinimum !== undefined && customSpendLimitNumber.lessThan(requiredMinimum)) {
      return t('spendLimitInsufficient');
    }

    return undefined;
  }

  render() {
    const {
      t
    } = this.context;
    const {
      setCustomAmount,
      hideModal,
      customTokenAmount
    } = this.props;
    const {
      selectedOptionIsUnlimited,
      customSpendLimit
    } = this.state;
    const error = this.validateSpendLimit();
    const disabled = Boolean(customSpendLimit === customTokenAmount && !selectedOptionIsUnlimited || error);
    return /*#__PURE__*/_react.default.createElement(_modal.default, {
      onSubmit: () => {
        setCustomAmount(selectedOptionIsUnlimited ? '' : customSpendLimit);
        hideModal();
      },
      submitText: t('save'),
      submitType: "primary",
      contentClass: "edit-approval-permission-modal-content",
      containerClass: "edit-approval-permission-modal-container",
      submitDisabled: disabled
    }, this.renderModalContent(error));
  }

}

exports.default = EditApprovalPermission;
(0, _defineProperty2.default)(EditApprovalPermission, "propTypes", {
  decimals: _propTypes.default.number,
  hideModal: _propTypes.default.func.isRequired,
  selectedIdentity: _propTypes.default.object,
  tokenAmount: _propTypes.default.string,
  customTokenAmount: _propTypes.default.string,
  tokenSymbol: _propTypes.default.string,
  tokenBalance: _propTypes.default.string,
  setCustomAmount: _propTypes.default.func,
  origin: _propTypes.default.string.isRequired,
  requiredMinimum: _propTypes.default.instanceOf(_bignumber.default)
});
(0, _defineProperty2.default)(EditApprovalPermission, "contextTypes", {
  t: _propTypes.default.func
});

//# sourceMappingURL=ui/components/app/modals/edit-approval-permission/edit-approval-permission.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/edit-approval-permission/edit-approval-permission.component.js",}],
[3704, {"../../../../helpers/utils/util":4020,"../../../ui/button":3842,"../../../ui/editable-label":3864,"../../../ui/qr-code":3929,"../account-modal-container":3709,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/etherscan-link":966,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _accountModalContainer = _interopRequireDefault(require("../account-modal-container"));

var _qrCode = _interopRequireDefault(require("../../../ui/qr-code"));

var _editableLabel = _interopRequireDefault(require("../../../ui/editable-label"));

var _button = _interopRequireDefault(require("../../../ui/button"));

var _util = require("../../../../helpers/utils/util");

class AccountDetailsModal extends _react.Component {
  render() {
    var _keyring$type;

    const {
      selectedIdentity,
      chainId,
      showExportPrivateKeyModal,
      setAccountLabel,
      keyrings,
      rpcPrefs
    } = this.props;
    const {
      name,
      address
    } = selectedIdentity;
    const keyring = keyrings.find(kr => {
      return kr.accounts.includes(address);
    });
    let exportPrivateKeyFeatureEnabled = true; // This feature is disabled for hardware wallets

    if ((keyring === null || keyring === void 0 ? void 0 : (_keyring$type = keyring.type) === null || _keyring$type === void 0 ? void 0 : _keyring$type.search('Hardware')) !== -1) {
      exportPrivateKeyFeatureEnabled = false;
    }

    return /*#__PURE__*/_react.default.createElement(_accountModalContainer.default, {
      className: "account-details-modal"
    }, /*#__PURE__*/_react.default.createElement(_editableLabel.default, {
      className: "account-details-modal__name",
      defaultValue: name,
      onSubmit: label => setAccountLabel(address, label)
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "account-details-modal__divider"
    }), exportPrivateKeyFeatureEnabled ? /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "secondary",
      className: "account-details-modal__button",
      onClick: () => showExportPrivateKeyModal()
    }, this.context.t('exportPrivateKey')) : null);
  }

}

exports.default = AccountDetailsModal;
(0, _defineProperty2.default)(AccountDetailsModal, "propTypes", {
  selectedIdentity: _propTypes.default.object,
  chainId: _propTypes.default.string,
  showExportPrivateKeyModal: _propTypes.default.func,
  setAccountLabel: _propTypes.default.func,
  keyrings: _propTypes.default.array,
  rpcPrefs: _propTypes.default.object
});
(0, _defineProperty2.default)(AccountDetailsModal, "contextTypes", {
  t: _propTypes.default.func,
  trackEvent: _propTypes.default.func
});


//# sourceMappingURL=ui/components/app/modals/account-details-modal/account-details-modal.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/account-details-modal/account-details-modal.component.js",}],
[3700, {"./modal-content":3701,"./modal.component":3703,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _modal.default;
  }
});
Object.defineProperty(exports, "ModalContent", {
  enumerable: true,
  get: function () {
    return _modalContent.default;
  }
});

var _modal = _interopRequireDefault(require("./modal.component"));

var _modalContent = _interopRequireDefault(require("./modal-content"));

//# sourceMappingURL=ui/components/app/modal/index.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modal/index.js",}],
[3735, {"../../../../../shared/modules/hexstring-utils":3604,"../../../ui/button":3842,"../../../ui/readonly-input":3932,"../account-modal-container":3709,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"copy-to-clipboard":1467,"ethereumjs-util":1810,"loglevel":2657,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _loglevel = _interopRequireDefault(require("loglevel"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _ethereumjsUtil = require("ethereumjs-util");

var _copyToClipboard = _interopRequireDefault(require("copy-to-clipboard"));

var _readonlyInput = _interopRequireDefault(require("../../../ui/readonly-input"));

var _button = _interopRequireDefault(require("../../../ui/button"));

var _accountModalContainer = _interopRequireDefault(require("../account-modal-container"));

var _hexstringUtils = require("../../../../../shared/modules/hexstring-utils");

class ExportPrivateKeyModal extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      password: '',
      privateKey: null,
      showWarning: true
    });
    (0, _defineProperty2.default)(this, "exportAccountAndGetPrivateKey", (password, address) => {
      const {
        exportAccount
      } = this.props;
      exportAccount(password, address).then(privateKey => this.setState({
        privateKey,
        showWarning: false
      })).catch(e => _loglevel.default.error(e));
    });
  }

  componentWillUnmount() {
    this.props.clearAccountDetails();
    this.props.hideWarning();
  }

  renderPasswordLabel(privateKey) {
    return /*#__PURE__*/_react.default.createElement("span", {
      className: "export-private-key-modal__password-label"
    }, privateKey ? this.context.t('copyPrivateKey') : this.context.t('typePassword'));
  }

  renderPasswordInput(privateKey) {
    const plainKey = privateKey && (0, _ethereumjsUtil.stripHexPrefix)(privateKey);

    if (!privateKey) {
      return /*#__PURE__*/_react.default.createElement("input", {
        type: "password",
        className: "export-private-key-modal__password-input",
        onChange: event => this.setState({
          password: event.target.value
        })
      });
    }

    return /*#__PURE__*/_react.default.createElement(_readonlyInput.default, {
      wrapperClass: "export-private-key-modal__password-display-wrapper",
      inputClass: "export-private-key-modal__password-display-textarea",
      textarea: true,
      value: plainKey,
      onClick: () => (0, _copyToClipboard.default)(plainKey)
    });
  }

  renderButtons(privateKey, address, hideModal) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "export-private-key-modal__buttons"
    }, !privateKey && /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "default",
      large: true,
      className: "export-private-key-modal__button export-private-key-modal__button--cancel",
      onClick: () => hideModal()
    }, this.context.t('cancel')), privateKey ? /*#__PURE__*/_react.default.createElement(_button.default, {
      onClick: () => hideModal(),
      type: "secondary",
      large: true,
      className: "export-private-key-modal__button"
    }, this.context.t('done')) : /*#__PURE__*/_react.default.createElement(_button.default, {
      onClick: () => this.exportAccountAndGetPrivateKey(this.state.password, address),
      type: "secondary",
      large: true,
      className: "export-private-key-modal__button",
      disabled: !this.state.password
    }, this.context.t('confirm')));
  }

  render() {
    const {
      selectedIdentity,
      warning,
      showAccountDetailModal,
      hideModal,
      previousModalState
    } = this.props;
    const {
      name,
      address
    } = selectedIdentity;
    const {
      privateKey,
      showWarning
    } = this.state;
    return /*#__PURE__*/_react.default.createElement(_accountModalContainer.default, {
      className: "export-private-key-modal",
      selectedIdentity: selectedIdentity,
      showBackButton: previousModalState === 'ACCOUNT_DETAILS',
      backButtonAction: () => showAccountDetailModal()
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "export-private-key-modal__account-name"
    }, name), /*#__PURE__*/_react.default.createElement(_readonlyInput.default, {
      wrapperClass: "ellip-address-wrapper",
      value: (0, _hexstringUtils.toChecksumHexAddress)(address)
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "export-private-key-modal__divider"
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "export-private-key-modal__body-title"
    }, this.context.t('showPrivateKeys')), /*#__PURE__*/_react.default.createElement("div", {
      className: "export-private-key-modal__password"
    }, this.renderPasswordLabel(privateKey), this.renderPasswordInput(privateKey), showWarning && warning ? /*#__PURE__*/_react.default.createElement("span", {
      className: "export-private-key-modal__password--error"
    }, warning) : null), /*#__PURE__*/_react.default.createElement("div", {
      className: "export-private-key-modal__password--warning"
    }, this.context.t('privateKeyWarning')), this.renderButtons(privateKey, address, hideModal));
  }

}

exports.default = ExportPrivateKeyModal;
(0, _defineProperty2.default)(ExportPrivateKeyModal, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(ExportPrivateKeyModal, "defaultProps", {
  warning: null,
  previousModalState: null
});
(0, _defineProperty2.default)(ExportPrivateKeyModal, "propTypes", {
  exportAccount: _propTypes.default.func.isRequired,
  selectedIdentity: _propTypes.default.object.isRequired,
  warning: _propTypes.default.node,
  showAccountDetailModal: _propTypes.default.func.isRequired,
  hideModal: _propTypes.default.func.isRequired,
  hideWarning: _propTypes.default.func.isRequired,
  clearAccountDetails: _propTypes.default.func.isRequired,
  previousModalState: _propTypes.default.string
});

//# sourceMappingURL=ui/components/app/modals/export-private-key-modal/export-private-key-modal.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/export-private-key-modal/export-private-key-modal.component.js",}],
[3715, {"../../../../../shared/constants/transaction":3599,"../../modal":3700,"./cancel-transaction-gas-fee":3714,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _modal = _interopRequireDefault(require("../../modal"));

var _transaction = require("../../../../../shared/constants/transaction");

var _cancelTransactionGasFee = _interopRequireDefault(require("./cancel-transaction-gas-fee"));

class CancelTransaction extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      busy: false
    });
    (0, _defineProperty2.default)(this, "handleSubmit", async () => {
      const {
        createCancelTransaction,
        hideModal
      } = this.props;
      this.setState({
        busy: true
      });
      await createCancelTransaction();
      this.setState({
        busy: false
      }, () => hideModal());
    });
    (0, _defineProperty2.default)(this, "handleCancel", () => {
      this.props.hideModal();
    });
  }

  componentDidUpdate() {
    const {
      transactionStatus,
      showTransactionConfirmedModal
    } = this.props;

    if (transactionStatus !== _transaction.TRANSACTION_STATUSES.SUBMITTED) {
      showTransactionConfirmedModal();
    }
  }

  render() {
    const {
      t
    } = this.context;
    const {
      newGasFee
    } = this.props;
    const {
      busy
    } = this.state;
    return /*#__PURE__*/_react.default.createElement(_modal.default, {
      headerText: t('attemptToCancel'),
      onClose: this.handleCancel,
      onSubmit: this.handleSubmit,
      onCancel: this.handleCancel,
      submitText: t('yesLetsTry'),
      cancelText: t('nevermind'),
      submitType: "secondary",
      submitDisabled: busy
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "cancel-transaction__title"
    }, t('cancellationGasFee')), /*#__PURE__*/_react.default.createElement("div", {
      className: "cancel-transaction__cancel-transaction-gas-fee-container"
    }, /*#__PURE__*/_react.default.createElement(_cancelTransactionGasFee.default, {
      value: newGasFee
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "cancel-transaction__description"
    }, t('attemptToCancelDescription'))));
  }

}

exports.default = CancelTransaction;
(0, _defineProperty2.default)(CancelTransaction, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(CancelTransaction, "propTypes", {
  createCancelTransaction: _propTypes.default.func,
  hideModal: _propTypes.default.func,
  showTransactionConfirmedModal: _propTypes.default.func,
  transactionStatus: _propTypes.default.string,
  newGasFee: _propTypes.default.string
});

//# sourceMappingURL=ui/components/app/modals/cancel-transaction/cancel-transaction.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/modals/cancel-transaction/cancel-transaction.component.js",}],
[3677, {"../../../../store/actions":4331,"../../../ui/page-container":3918,"../../../ui/tabs":3945,"./advanced-tab-content":3674,"./basic-tab-content":3676,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _pageContainer = _interopRequireDefault(require("../../../ui/page-container"));

var _tabs = require("../../../ui/tabs");

var _actions = require("../../../../store/actions");

var _advancedTabContent = _interopRequireDefault(require("./advanced-tab-content"));

var _basicTabContent = _interopRequireDefault(require("./basic-tab-content"));

class GasModalPageContainer extends _react.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "_beforeUnload", () => {
      this._isMounted = false;

      if (this.state.pollingToken) {
        (0, _actions.disconnectGasFeeEstimatePoller)(this.state.pollingToken);
        (0, _actions.removePollingTokenFromAppState)(this.state.pollingToken);
      }
    });
    this.state = {
      pollingToken: undefined
    };
  }

  componentDidMount() {
    this._isMounted = true;
    (0, _actions.getGasFeeEstimatesAndStartPolling)().then(pollingToken => {
      if (this._isMounted) {
        (0, _actions.addPollingTokenToAppState)(pollingToken);
        this.setState({
          pollingToken
        });
      } else {
        (0, _actions.disconnectGasFeeEstimatePoller)(pollingToken);
        (0, _actions.removePollingTokenFromAppState)(pollingToken);
      }
    });
    window.addEventListener('beforeunload', this._beforeUnload);
  }

  componentWillUnmount() {
    this._beforeUnload();

    window.removeEventListener('beforeunload', this._beforeUnload);
  }

  renderBasicTabContent(gasPriceButtonGroupProps) {
    return /*#__PURE__*/_react.default.createElement(_basicTabContent.default, {
      gasPriceButtonGroupProps: gasPriceButtonGroupProps
    });
  }

  renderAdvancedTabContent() {
    const {
      updateCustomGasPrice,
      updateCustomGasLimit,
      customModalGasPriceInHex,
      customModalGasLimitInHex,
      insufficientBalance,
      customPriceIsSafe,
      isSpeedUp,
      isRetry,
      customPriceIsExcessive,
      infoRowProps: {
        transactionFee
      }
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_advancedTabContent.default, {
      updateCustomGasPrice: updateCustomGasPrice,
      updateCustomGasLimit: updateCustomGasLimit,
      customModalGasPriceInHex: customModalGasPriceInHex,
      customModalGasLimitInHex: customModalGasLimitInHex,
      transactionFee: transactionFee,
      insufficientBalance: insufficientBalance,
      customPriceIsSafe: customPriceIsSafe,
      isSpeedUp: isSpeedUp,
      isRetry: isRetry,
      customPriceIsExcessive: customPriceIsExcessive
    });
  }

  renderInfoRows(newTotalFiat, newTotalEth, sendAmount, transactionFee) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row-wrapper"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__send-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__send-info__label"
    }, this.context.t('sendAmount')), /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__send-info__value"
    }, sendAmount)), /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__transaction-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__transaction-info__label"
    }, this.context.t('transactionFee')), /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__transaction-info__value"
    }, transactionFee)), /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__total-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__total-info__label"
    }, this.context.t('newTotal')), /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__total-info__value"
    }, newTotalEth)), /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__fiat-total-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__fiat-total-info__value"
    }, newTotalFiat))));
  }

  renderTabs() {
    const {
      gasPriceButtonGroupProps,
      hideBasic,
      infoRowProps: {
        newTotalFiat,
        newTotalEth,
        sendAmount,
        transactionFee
      }
    } = this.props;
    let tabsToRender;

    if (hideBasic) {
      tabsToRender = [{
        name: this.context.t('advanced'),
        content: this.renderAdvancedTabContent()
      }];
    } else {
      tabsToRender = [{
        name: this.context.t('basic'),
        content: this.renderBasicTabContent(gasPriceButtonGroupProps)
      }, {
        name: this.context.t('advanced'),
        content: this.renderAdvancedTabContent()
      }];
    }

    return /*#__PURE__*/_react.default.createElement(_tabs.Tabs, null, tabsToRender.map(({
      name,
      content
    }, i) => /*#__PURE__*/_react.default.createElement(_tabs.Tab, {
      name: name,
      key: `gas-modal-tab-${i}`
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content"
    }, content, this.renderInfoRows(newTotalFiat, newTotalEth, sendAmount, transactionFee)))));
  }

  render() {
    const {
      cancelAndClose,
      onSubmit,
      customModalGasPriceInHex,
      customModalGasLimitInHex,
      disableSave,
      isSpeedUp
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-page-container"
    }, /*#__PURE__*/_react.default.createElement(_pageContainer.default, {
      title: this.context.t('customGas'),
      subtitle: this.context.t('customGasSubTitle'),
      tabsComponent: this.renderTabs(),
      disabled: disableSave,
      onCancel: () => cancelAndClose(),
      onClose: () => cancelAndClose(),
      onSubmit: () => {
        if (isSpeedUp) {
          this.context.metricsEvent({
            eventOpts: {
              category: 'Navigation',
              action: 'Activity Log',
              name: 'Saved "Speed Up"'
            }
          });
        }

        onSubmit(customModalGasLimitInHex, customModalGasPriceInHex);
      },
      submitText: this.context.t('save'),
      headerCloseText: this.context.t('close'),
      hideCancel: true
    }));
  }

}

exports.default = GasModalPageContainer;
(0, _defineProperty2.default)(GasModalPageContainer, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func,
  trackEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(GasModalPageContainer, "propTypes", {
  hideBasic: _propTypes.default.bool,
  updateCustomGasPrice: _propTypes.default.func,
  updateCustomGasLimit: _propTypes.default.func,
  insufficientBalance: _propTypes.default.bool,
  gasPriceButtonGroupProps: _propTypes.default.object,
  infoRowProps: _propTypes.default.shape({
    originalTotalFiat: _propTypes.default.string,
    originalTotalEth: _propTypes.default.string,
    newTotalFiat: _propTypes.default.string,
    newTotalEth: _propTypes.default.string,
    sendAmount: _propTypes.default.string,
    transactionFee: _propTypes.default.string
  }),
  onSubmit: _propTypes.default.func,
  customModalGasPriceInHex: _propTypes.default.string,
  customModalGasLimitInHex: _propTypes.default.string,
  cancelAndClose: _propTypes.default.func,
  customPriceIsSafe: _propTypes.default.bool,
  isSpeedUp: _propTypes.default.bool,
  isRetry: _propTypes.default.bool,
  disableSave: _propTypes.default.bool,
  customPriceIsExcessive: _propTypes.default.bool.isRequired
});

//# sourceMappingURL=ui/components/app/gas-customization/gas-modal-page-container/gas-modal-page-container.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/gas-customization/gas-modal-page-container/gas-modal-page-container.component.js",}],
[4314, {"../../../components/app/gas-customization/advanced-gas-inputs":3672,"../../../components/app/gas-customization/gas-modal-page-container/basic-tab-content":3676,"../../../components/ui/page-container":3918,"../../../components/ui/tabs":3945,"../../../helpers/constants/common":3990,"../../../helpers/utils/conversions.util":4009,"../../send/send.utils":4228,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _pageContainer = _interopRequireDefault(require("../../../components/ui/page-container"));

var _tabs = require("../../../components/ui/tabs");

var _send = require("../../send/send.utils");

var _conversions = require("../../../helpers/utils/conversions.util");

var _advancedGasInputs = _interopRequireDefault(require("../../../components/app/gas-customization/advanced-gas-inputs"));

var _basicTabContent = _interopRequireDefault(require("../../../components/app/gas-customization/gas-modal-page-container/basic-tab-content"));

var _common = require("../../../helpers/constants/common");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class GasModalPageContainer extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      gasSpeedType: ''
    });
  }

  setGasSpeedType(gasEstimateType) {
    if (gasEstimateType === _common.GAS_ESTIMATE_TYPES.AVERAGE) {
      this.setState({
        gasSpeedType: 'average'
      });
    } else {
      this.setState({
        gasSpeedType: 'fast'
      });
    }
  }

  renderBasicTabContent(gasPriceButtonGroupProps) {
    return /*#__PURE__*/_react.default.createElement(_basicTabContent.default, {
      gasPriceButtonGroupProps: _objectSpread(_objectSpread({}, gasPriceButtonGroupProps), {}, {
        handleGasPriceSelection: ({
          gasPrice,
          gasEstimateType
        }) => {
          this.setGasSpeedType(gasEstimateType);
          this.props.setSwapsCustomizationModalPrice(gasPrice);
        }
      })
    });
  }

  renderAdvancedTabContent() {
    const {
      insufficientBalance,
      showCustomPriceTooLowWarning,
      infoRowProps: {
        transactionFee
      },
      customGasLimitMessage,
      setSwapsCustomizationModalPrice,
      setSwapsCustomizationModalLimit,
      customGasPrice,
      customGasLimit,
      minimumGasLimit
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "advanced-tab"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "advanced-tab__transaction-data-summary"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "advanced-tab__transaction-data-summary__titles"
    }, /*#__PURE__*/_react.default.createElement("span", null, this.context.t('newTransactionFee'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "advanced-tab__transaction-data-summary__container"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "advanced-tab__transaction-data-summary__fee"
    }, transactionFee))), /*#__PURE__*/_react.default.createElement("div", {
      className: "advanced-tab__fee-chart"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "advanced-tab__gas-inputs"
    }, /*#__PURE__*/_react.default.createElement(_advancedGasInputs.default, {
      updateCustomGasPrice: updatedPrice => {
        this.setState({
          gasSpeedType: 'custom'
        });
        setSwapsCustomizationModalPrice(updatedPrice);
      },
      updateCustomGasLimit: updatedLimit => {
        this.setState({
          gasSpeedType: 'custom'
        });
        setSwapsCustomizationModalLimit(updatedLimit);
      },
      customGasPrice: customGasPrice,
      customGasLimit: customGasLimit,
      insufficientBalance: insufficientBalance,
      customPriceIsSafe: !showCustomPriceTooLowWarning,
      customGasLimitMessage: customGasLimitMessage,
      minimumGasLimit: minimumGasLimit
    }))));
  }

  renderInfoRows(newTotalFiat, newTotalEth, sendAmount, transactionFee, extraInfoRow) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row-wrapper"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__send-info",
      "data-testid": "gas-modal-content__info-row__send-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__send-info__label"
    }, this.context.t('sendAmount')), /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__send-info__value"
    }, sendAmount)), /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__transaction-info",
      "data-testid": "gas-modal-content__info-row__transaction-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__transaction-info__label"
    }, this.context.t('transactionFee')), /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__transaction-info__value"
    }, transactionFee)), extraInfoRow && /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__transaction-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__transaction-info__label"
    }, extraInfoRow.label), /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__transaction-info__value"
    }, extraInfoRow.value)), /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__total-info",
      "data-testid": "gas-modal-content__info-row__total-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__total-info__label"
    }, this.context.t('newTotal')), /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__total-info__value"
    }, newTotalEth)), /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content__info-row__fiat-total-info"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "gas-modal-content__info-row__fiat-total-info__value"
    }, newTotalFiat))));
  }

  renderTabs() {
    const {
      gasPriceButtonGroupProps,
      infoRowProps: {
        newTotalFiat,
        newTotalEth,
        sendAmount,
        transactionFee,
        extraInfoRow
      },
      gasEstimateLoadingHasFailed
    } = this.props;
    const basicTabInfo = {
      name: this.context.t('basic'),
      content: this.renderBasicTabContent(_objectSpread(_objectSpread({}, gasPriceButtonGroupProps), {}, {
        handleGasPriceSelection: this.props.setSwapsCustomizationModalPrice
      }))
    };
    const advancedTabInfo = {
      name: this.context.t('advanced'),
      content: this.renderAdvancedTabContent()
    };
    const tabsToRender = gasEstimateLoadingHasFailed ? [advancedTabInfo] : [basicTabInfo, advancedTabInfo];
    return /*#__PURE__*/_react.default.createElement(_tabs.Tabs, null, tabsToRender.map(({
      name,
      content
    }, i) => /*#__PURE__*/_react.default.createElement(_tabs.Tab, {
      name: name,
      key: `gas-modal-tab-${i}`
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-content"
    }, content, this.renderInfoRows(newTotalFiat, newTotalEth, sendAmount, transactionFee, extraInfoRow)))));
  }

  render() {
    const {
      cancelAndClose,
      onSubmit,
      disableSave,
      customGasPrice,
      customGasLimit
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "gas-modal-page-container"
    }, /*#__PURE__*/_react.default.createElement(_pageContainer.default, {
      title: this.context.t('customGas'),
      subtitle: this.context.t('customGasSubTitle'),
      tabsComponent: this.renderTabs(),
      disabled: disableSave,
      onCancel: () => cancelAndClose(),
      onClose: () => cancelAndClose(),
      onSubmit: () => {
        var _sumHexWEIsToUnformat;

        const newSwapGasTotal = (0, _send.calcGasTotal)(customGasLimit, customGasPrice);
        this.context.trackEvent({
          event: 'Gas Fees Changed',
          category: 'swaps',
          properties: {
            speed_set: this.state.gasSpeedType,
            gas_fees: (_sumHexWEIsToUnformat = (0, _conversions.sumHexWEIsToUnformattedFiat)([newSwapGasTotal, this.props.customTotalSupplement], 'usd', this.props.usdConversionRate)) === null || _sumHexWEIsToUnformat === void 0 ? void 0 : _sumHexWEIsToUnformat.slice(1)
          }
        });
        onSubmit(customGasLimit, customGasPrice);
      },
      submitText: this.context.t('save'),
      headerCloseText: this.context.t('close'),
      hideCancel: true
    }));
  }

}

exports.default = GasModalPageContainer;
(0, _defineProperty2.default)(GasModalPageContainer, "contextTypes", {
  t: _propTypes.default.func,
  trackEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(GasModalPageContainer, "propTypes", {
  insufficientBalance: _propTypes.default.bool,
  gasPriceButtonGroupProps: _propTypes.default.object,
  infoRowProps: _propTypes.default.shape({
    originalTotalFiat: _propTypes.default.string,
    originalTotalEth: _propTypes.default.string,
    newTotalFiat: _propTypes.default.string,
    newTotalEth: _propTypes.default.string,
    sendAmount: _propTypes.default.string,
    transactionFee: _propTypes.default.string,
    extraInfoRow: _propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string
    })
  }),
  onSubmit: _propTypes.default.func,
  cancelAndClose: _propTypes.default.func,
  showCustomPriceTooLowWarning: _propTypes.default.bool,
  disableSave: _propTypes.default.bool,
  customGasLimitMessage: _propTypes.default.string,
  customTotalSupplement: _propTypes.default.string,
  usdConversionRate: _propTypes.default.number,
  customGasPrice: _propTypes.default.string,
  customGasLimit: _propTypes.default.string,
  setSwapsCustomizationModalPrice: _propTypes.default.func,
  setSwapsCustomizationModalLimit: _propTypes.default.func,
  gasEstimateLoadingHasFailed: _propTypes.default.bool,
  minimumGasLimit: _propTypes.default.number.isRequired
});

//# sourceMappingURL=ui/pages/swaps/swaps-gas-customization-modal/swaps-gas-customization-modal.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/swaps/swaps-gas-customization-modal/swaps-gas-customization-modal.component.js",}],
[4131, {"./first-time-flow-switch.component":4130,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _firstTimeFlowSwitch = _interopRequireDefault(require("./first-time-flow-switch.component"));

const mapStateToProps = ({
  metamask
}) => {
  const {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    seedPhraseBackedUp
  } = metamask;
  return {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    seedPhraseBackedUp
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_firstTimeFlowSwitch.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/first-time-flow/first-time-flow-switch/first-time-flow-switch.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/first-time-flow-switch/first-time-flow-switch.container.js",}],
[4138, {"../../../selectors":4326,"../../../store/actions":4331,"./metametrics-opt-in.component":4137,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _metametricsOptIn = _interopRequireDefault(require("./metametrics-opt-in.component"));

const firstTimeFlowTypeNameMap = {
  create: 'Selected Create New Wallet',
  import: 'Selected Import Wallet'
};

const mapStateToProps = state => {
  const {
    firstTimeFlowType,
    participateInMetaMetrics
  } = state.metamask;
  return {
    nextRoute: (0, _selectors.getFirstTimeFlowTypeRoute)(state),
    firstTimeSelectionMetaMetricsName: firstTimeFlowTypeNameMap[firstTimeFlowType],
    participateInMetaMetrics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setParticipateInMetaMetrics: val => dispatch((0, _actions.setParticipateInMetaMetrics)(val))
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_metametricsOptIn.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/first-time-flow/metametrics-opt-in/metametrics-opt-in.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/metametrics-opt-in/metametrics-opt-in.container.js",}],
[4153, {"../../../selectors":4326,"../../../store/actions":4331,"./select-action.component":4152,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _redux = require("redux");

var _actions = require("../../../store/actions");

var _selectors = require("../../../selectors");

var _selectAction = _interopRequireDefault(require("./select-action.component"));

const mapStateToProps = state => {
  return {
    nextRoute: (0, _selectors.getFirstTimeFlowTypeRoute)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFirstTimeFlowType: type => dispatch((0, _actions.setFirstTimeFlowType)(type))
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_selectAction.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/first-time-flow/select-action/select-action.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/select-action/select-action.container.js",}],
[4158, {"../../../store/actions":4331,"./welcome.component":4157,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _redux = require("redux");

var _actions = require("../../../store/actions");

var _welcome = _interopRequireDefault(require("./welcome.component"));

const mapStateToProps = ({
  metamask
}) => {
  const {
    welcomeScreenSeen,
    participateInMetaMetrics
  } = metamask;
  return {
    welcomeScreenSeen,
    participateInMetaMetrics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeWelcomeScreen: () => dispatch((0, _actions.closeWelcomeScreen)())
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_welcome.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/first-time-flow/welcome/welcome.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/welcome/welcome.container.js",}],
[4128, {"../../../selectors":4326,"../../../store/actions":4331,"./end-of-flow.component":4127,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _selectors = require("../../../selectors");

var _actions = require("../../../store/actions");

var _endOfFlow = _interopRequireDefault(require("./end-of-flow.component"));

const firstTimeFlowTypeNameMap = {
  create: 'New Wallet Created',
  import: 'New Wallet Imported'
};

const mapStateToProps = state => {
  const {
    metamask: {
      firstTimeFlowType
    }
  } = state;
  return {
    completionMetaMetricsName: firstTimeFlowTypeNameMap[firstTimeFlowType],
    onboardingInitiator: (0, _selectors.getOnboardingInitiator)(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCompletedOnboarding: () => dispatch((0, _actions.setCompletedOnboarding)())
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_endOfFlow.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/first-time-flow/end-of-flow/end-of-flow.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/end-of-flow/end-of-flow.container.js",}],
[4120, {"./create-password.component":4119,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _createPassword = _interopRequireDefault(require("./create-password.component"));

const mapStateToProps = state => {
  const {
    metamask: {
      isInitialized
    }
  } = state;
  return {
    isInitialized
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_createPassword.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/first-time-flow/create-password/create-password.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/create-password/create-password.container.js",}],
[4150, {"../../../components/ui/metafox-logo":3915,"../../../helpers/constants/routes":3995,"../../../helpers/utils/build-types":4006,"./confirm-seed-phrase":4143,"./reveal-seed-phrase":4145,"./seed-phrase-intro":4148,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121,"react-dnd":3027,"react-dnd-html5-backend":3013,"react-router-dom":3099}, function (require, module, exports) {
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

var _reactDndHtml5Backend = _interopRequireDefault(require("react-dnd-html5-backend"));

var _reactDnd = require("react-dnd");

var _routes = require("../../../helpers/constants/routes");

var _metafoxLogo = _interopRequireDefault(require("../../../components/ui/metafox-logo"));

var _buildTypes = require("../../../helpers/utils/build-types");

var _confirmSeedPhrase = _interopRequireDefault(require("./confirm-seed-phrase"));

var _revealSeedPhrase = _interopRequireDefault(require("./reveal-seed-phrase"));

var _seedPhraseIntro = _interopRequireDefault(require("./seed-phrase-intro"));

class SeedPhrase extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      verifiedSeedPhrase: ''
    });
  }

  componentDidMount() {
    const {
      seedPhrase,
      history,
      verifySeedPhrase
    } = this.props;

    if (!seedPhrase) {
      verifySeedPhrase().then(verifiedSeedPhrase => {
        if (verifiedSeedPhrase) {
          this.setState({
            verifiedSeedPhrase
          });
        } else {
          history.push(_routes.DEFAULT_ROUTE);
        }
      });
    }
  }

  render() {
    var _history$location;

    const {
      seedPhrase,
      history
    } = this.props;
    const {
      verifiedSeedPhrase
    } = this.state;
    const pathname = history === null || history === void 0 ? void 0 : (_history$location = history.location) === null || _history$location === void 0 ? void 0 : _history$location.pathname;
    const introClass = pathname === _routes.INITIALIZE_SEED_PHRASE_INTRO_ROUTE ? 'intro' : '';
    return /*#__PURE__*/_react.default.createElement(_reactDnd.DragDropContextProvider, {
      backend: _reactDndHtml5Backend.default
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: `first-time-flow__wrapper ${introClass}`
    }, /*#__PURE__*/_react.default.createElement(_metafoxLogo.default, {
      useDark: (0, _buildTypes.isBeta)()
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Switch, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_confirmSeedPhrase.default, (0, _extends2.default)({}, routeProps, {
        seedPhrase: seedPhrase || verifiedSeedPhrase
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.INITIALIZE_SEED_PHRASE_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_revealSeedPhrase.default, (0, _extends2.default)({}, routeProps, {
        seedPhrase: seedPhrase || verifiedSeedPhrase
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.INITIALIZE_BACKUP_SEED_PHRASE_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_revealSeedPhrase.default, (0, _extends2.default)({}, routeProps, {
        seedPhrase: seedPhrase || verifiedSeedPhrase
      }))
    }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
      exact: true,
      path: _routes.INITIALIZE_SEED_PHRASE_INTRO_ROUTE,
      render: routeProps => /*#__PURE__*/_react.default.createElement(_seedPhraseIntro.default, (0, _extends2.default)({}, routeProps, {
        seedPhrase: seedPhrase || verifiedSeedPhrase
      }))
    }))));
  }

}

exports.default = SeedPhrase;
(0, _defineProperty2.default)(SeedPhrase, "propTypes", {
  history: _propTypes.default.object,
  seedPhrase: _propTypes.default.string,
  verifySeedPhrase: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/first-time-flow/seed-phrase/seed-phrase.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/first-time-flow/seed-phrase/seed-phrase.component.js",}],
[3935, {"@babel/runtime/helpers/interopRequireDefault":186,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SearchIcon;

var _react = _interopRequireDefault(require("react"));

function SearchIcon() {
  return /*#__PURE__*/_react.default.createElement("svg", {
    height: "20",
    width: "20",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor"
  }, /*#__PURE__*/_react.default.createElement("g", {
    clipRule: "evenodd",
    fillRule: "evenodd"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M9.167 3.333a5.833 5.833 0 100 11.667 5.833 5.833 0 000-11.667zm-7.5 5.834a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M13.286 13.286a.833.833 0 011.178 0l3.625 3.625a.833.833 0 11-1.178 1.178l-3.625-3.625a.833.833 0 010-1.178z"
  })));
}

//# sourceMappingURL=ui/components/ui/search-icon/search-icon.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/search-icon/search-icon.component.js",}],
[3821, {"../../../helpers/constants/common":3990,"../../../hooks/useUserPreferencedCurrency":4046,"../../ui/currency-display":3854,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@babel/runtime/helpers/objectWithoutProperties":195,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UserPreferencedCurrencyDisplay;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _common = require("../../../helpers/constants/common");

var _currencyDisplay = _interopRequireDefault(require("../../ui/currency-display"));

var _useUserPreferencedCurrency = require("../../../hooks/useUserPreferencedCurrency");

function UserPreferencedCurrencyDisplay(_ref) {
  let {
    'data-testid': dataTestId,
    ethLogoHeight = 12,
    ethNumberOfDecimals,
    fiatNumberOfDecimals,
    'numberOfDecimals': propsNumberOfDecimals,
    showEthLogo,
    type
  } = _ref,
      restProps = (0, _objectWithoutProperties2.default)(_ref, ["data-testid", "ethLogoHeight", "ethNumberOfDecimals", "fiatNumberOfDecimals", "numberOfDecimals", "showEthLogo", "type"]);
  const {
    currency,
    numberOfDecimals
  } = (0, _useUserPreferencedCurrency.useUserPreferencedCurrency)(type, {
    ethNumberOfDecimals,
    fiatNumberOfDecimals,
    numberOfDecimals: propsNumberOfDecimals
  });
  const prefixComponent = (0, _react.useMemo)(() => {
    return currency === _common.ETH && showEthLogo && /*#__PURE__*/_react.default.createElement("img", {
      src: "./images/eth.svg",
      height: ethLogoHeight,
      alt: ""
    });
  }, [currency, showEthLogo, ethLogoHeight]);
  return /*#__PURE__*/_react.default.createElement(_currencyDisplay.default, (0, _extends2.default)({}, restProps, {
    currency: currency,
    "data-testid": dataTestId,
    numberOfDecimals: numberOfDecimals,
    prefixComponent: prefixComponent
  }));
}

UserPreferencedCurrencyDisplay.propTypes = {
  'className': _propTypes.default.string,
  'data-testid': _propTypes.default.string,
  'prefix': _propTypes.default.string,
  'value': _propTypes.default.string,
  'numberOfDecimals': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  'hideLabel': _propTypes.default.bool,
  'hideTitle': _propTypes.default.bool,
  'style': _propTypes.default.object,
  'showEthLogo': _propTypes.default.bool,
  'ethLogoHeight': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  'type': _propTypes.default.oneOf([_common.PRIMARY, _common.SECONDARY]),
  'justValue': _propTypes.default.bool,
  'ethNumberOfDecimals': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  'fiatNumberOfDecimals': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};

//# sourceMappingURL=ui/components/app/user-preferenced-currency-display/user-preferenced-currency-display.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/user-preferenced-currency-display/user-preferenced-currency-display.component.js",}],
[553, {"../FormControl/FormControlContext":521,"../Typography":687,"../styles/withStyles":762,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@babel/runtime/helpers/objectWithoutProperties":195,"clsx":1451,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.styles = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx = _interopRequireDefault(require("clsx"));

var _Typography = _interopRequireDefault(require("../Typography"));

var _withStyles = _interopRequireDefault(require("../styles/withStyles"));

var _FormControlContext = _interopRequireWildcard(require("../FormControl/FormControlContext"));

var styles = {
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
    height: '0.01em',
    // Fix IE 11 flexbox alignment. To remove at some point.
    maxHeight: '2em',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  },

  /* Styles applied to the root element if `variant="filled"`. */
  filled: {
    '&$positionStart:not($hiddenLabel)': {
      marginTop: 16
    }
  },

  /* Styles applied to the root element if `position="start"`. */
  positionStart: {
    marginRight: 8
  },

  /* Styles applied to the root element if `position="end"`. */
  positionEnd: {
    marginLeft: 8
  },

  /* Styles applied to the root element if `disablePointerEvents=true`. */
  disablePointerEvents: {
    pointerEvents: 'none'
  },

  /* Styles applied if the adornment is used inside <FormControl hiddenLabel />. */
  hiddenLabel: {},

  /* Styles applied if the adornment is used inside <FormControl margin="dense" />. */
  marginDense: {}
};
exports.styles = styles;
var InputAdornment = /*#__PURE__*/React.forwardRef(function InputAdornment(props, ref) {
  var children = props.children,
      classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? 'div' : _props$component,
      _props$disablePointer = props.disablePointerEvents,
      disablePointerEvents = _props$disablePointer === void 0 ? false : _props$disablePointer,
      _props$disableTypogra = props.disableTypography,
      disableTypography = _props$disableTypogra === void 0 ? false : _props$disableTypogra,
      position = props.position,
      variantProp = props.variant,
      other = (0, _objectWithoutProperties2.default)(props, ["children", "classes", "className", "component", "disablePointerEvents", "disableTypography", "position", "variant"]);
  var muiFormControl = (0, _FormControlContext.useFormControl)() || {};
  var variant = variantProp;

  if (variantProp && muiFormControl.variant) {
    if ("production" !== 'production') {
      if (variantProp === muiFormControl.variant) {
        console.error('Material-UI: The `InputAdornment` variant infers the variant prop ' + 'you do not have to provide one.');
      }
    }
  }

  if (muiFormControl && !variant) {
    variant = muiFormControl.variant;
  }

  return /*#__PURE__*/React.createElement(_FormControlContext.default.Provider, {
    value: null
  }, /*#__PURE__*/React.createElement(Component, (0, _extends2.default)({
    className: (0, _clsx.default)(classes.root, className, disablePointerEvents && classes.disablePointerEvents, muiFormControl.hiddenLabel && classes.hiddenLabel, variant === 'filled' && classes.filled, {
      'start': classes.positionStart,
      'end': classes.positionEnd
    }[position], muiFormControl.margin === 'dense' && classes.marginDense),
    ref: ref
  }, other), typeof children === 'string' && !disableTypography ? /*#__PURE__*/React.createElement(_Typography.default, {
    color: "textSecondary"
  }, children) : children));
});
"production" !== "production" ? InputAdornment.propTypes = {
  /**
   * The content of the component, normally an `IconButton` or string.
   */
  children: _propTypes.default.node.isRequired,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: _propTypes.default.object.isRequired,

  /**
   * @ignore
   */
  className: _propTypes.default.string,

  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: _propTypes.default
  /* @typescript-to-proptypes-ignore */
  .elementType,

  /**
   * Disable pointer events on the root.
   * This allows for the content of the adornment to focus the input on click.
   */
  disablePointerEvents: _propTypes.default.bool,

  /**
   * If children is a string then disable wrapping in a Typography component.
   */
  disableTypography: _propTypes.default.bool,

  /**
   * @ignore
   */
  muiFormControl: _propTypes.default.object,

  /**
   * The position this adornment should appear relative to the `Input`.
   */
  position: _propTypes.default.oneOf(['start', 'end']),

  /**
   * The variant to use.
   * Note: If you are using the `TextField` component or the `FormControl` component
   * you do not have to set this manually.
   */
  variant: _propTypes.default.oneOf(['standard', 'outlined', 'filled'])
} : void 0;

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiInputAdornment'
})(InputAdornment);

exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/InputAdornment/InputAdornment.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/InputAdornment/InputAdornment.js",}],
[678, {"../FilledInput":519,"../FormControl":523,"../FormHelperText":530,"../Input":552,"../InputLabel":559,"../OutlinedInput":598,"../Select":618,"../styles/withStyles":762,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@babel/runtime/helpers/objectWithoutProperties":195,"@material-ui/utils":853,"clsx":1451,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.styles = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx = _interopRequireDefault(require("clsx"));

var _utils = require("@material-ui/utils");

var _Input = _interopRequireDefault(require("../Input"));

var _FilledInput = _interopRequireDefault(require("../FilledInput"));

var _OutlinedInput = _interopRequireDefault(require("../OutlinedInput"));

var _InputLabel = _interopRequireDefault(require("../InputLabel"));

var _FormControl = _interopRequireDefault(require("../FormControl"));

var _FormHelperText = _interopRequireDefault(require("../FormHelperText"));

var _Select = _interopRequireDefault(require("../Select"));

var _withStyles = _interopRequireDefault(require("../styles/withStyles"));

var variantComponent = {
  standard: _Input.default,
  filled: _FilledInput.default,
  outlined: _OutlinedInput.default
};
var styles = {
  /* Styles applied to the root element. */
  root: {}
};
/**
 * The `TextField` is a convenience wrapper for the most common cases (80%).
 * It cannot be all things to all people, otherwise the API would grow out of control.
 *
 * ## Advanced Configuration
 *
 * It's important to understand that the text field is a simple abstraction
 * on top of the following components:
 *
 * - [FormControl](/api/form-control/)
 * - [InputLabel](/api/input-label/)
 * - [FilledInput](/api/filled-input/)
 * - [OutlinedInput](/api/outlined-input/)
 * - [Input](/api/input/)
 * - [FormHelperText](/api/form-helper-text/)
 *
 * If you wish to alter the props applied to the `input` element, you can do so as follows:
 *
 * ```jsx
 * const inputProps = {
 *   step: 300,
 * };
 *
 * return <TextField id="time" type="time" inputProps={inputProps} />;
 * ```
 *
 * For advanced cases, please look at the source of TextField by clicking on the
 * "Edit this page" button above. Consider either:
 *
 * - using the upper case props for passing values directly to the components
 * - using the underlying components directly as shown in the demos
 */

exports.styles = styles;
var TextField = /*#__PURE__*/React.forwardRef(function TextField(props, ref) {
  var autoComplete = props.autoComplete,
      _props$autoFocus = props.autoFocus,
      autoFocus = _props$autoFocus === void 0 ? false : _props$autoFocus,
      children = props.children,
      classes = props.classes,
      className = props.className,
      _props$color = props.color,
      color = _props$color === void 0 ? 'primary' : _props$color,
      defaultValue = props.defaultValue,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$error = props.error,
      error = _props$error === void 0 ? false : _props$error,
      FormHelperTextProps = props.FormHelperTextProps,
      _props$fullWidth = props.fullWidth,
      fullWidth = _props$fullWidth === void 0 ? false : _props$fullWidth,
      helperText = props.helperText,
      hiddenLabel = props.hiddenLabel,
      id = props.id,
      InputLabelProps = props.InputLabelProps,
      inputProps = props.inputProps,
      InputProps = props.InputProps,
      inputRef = props.inputRef,
      label = props.label,
      _props$multiline = props.multiline,
      multiline = _props$multiline === void 0 ? false : _props$multiline,
      name = props.name,
      onBlur = props.onBlur,
      onChange = props.onChange,
      onFocus = props.onFocus,
      placeholder = props.placeholder,
      _props$required = props.required,
      required = _props$required === void 0 ? false : _props$required,
      rows = props.rows,
      rowsMax = props.rowsMax,
      _props$select = props.select,
      select = _props$select === void 0 ? false : _props$select,
      SelectProps = props.SelectProps,
      type = props.type,
      value = props.value,
      _props$variant = props.variant,
      variant = _props$variant === void 0 ? 'standard' : _props$variant,
      other = (0, _objectWithoutProperties2.default)(props, ["autoComplete", "autoFocus", "children", "classes", "className", "color", "defaultValue", "disabled", "error", "FormHelperTextProps", "fullWidth", "helperText", "hiddenLabel", "id", "InputLabelProps", "inputProps", "InputProps", "inputRef", "label", "multiline", "name", "onBlur", "onChange", "onFocus", "placeholder", "required", "rows", "rowsMax", "select", "SelectProps", "type", "value", "variant"]);

  if ("production" !== 'production') {
    if (select && !children) {
      console.error('Material-UI: `children` must be passed when using the `TextField` component with `select`.');
    }
  }

  var InputMore = {};

  if (variant === 'outlined') {
    if (InputLabelProps && typeof InputLabelProps.shrink !== 'undefined') {
      InputMore.notched = InputLabelProps.shrink;
    }

    if (label) {
      var _InputLabelProps$requ;

      var displayRequired = (_InputLabelProps$requ = InputLabelProps === null || InputLabelProps === void 0 ? void 0 : InputLabelProps.required) !== null && _InputLabelProps$requ !== void 0 ? _InputLabelProps$requ : required;
      InputMore.label = /*#__PURE__*/React.createElement(React.Fragment, null, label, displayRequired && "\xA0*");
    }
  }

  if (select) {
    // unset defaults from textbox inputs
    if (!SelectProps || !SelectProps.native) {
      InputMore.id = undefined;
    }

    InputMore['aria-describedby'] = undefined;
  }

  var helperTextId = helperText && id ? "".concat(id, "-helper-text") : undefined;
  var inputLabelId = label && id ? "".concat(id, "-label") : undefined;
  var InputComponent = variantComponent[variant];
  var InputElement = /*#__PURE__*/React.createElement(InputComponent, (0, _extends2.default)({
    "aria-describedby": helperTextId,
    autoComplete: autoComplete,
    autoFocus: autoFocus,
    defaultValue: defaultValue,
    fullWidth: fullWidth,
    multiline: multiline,
    name: name,
    rows: rows,
    rowsMax: rowsMax,
    type: type,
    value: value,
    id: id,
    inputRef: inputRef,
    onBlur: onBlur,
    onChange: onChange,
    onFocus: onFocus,
    placeholder: placeholder,
    inputProps: inputProps
  }, InputMore, InputProps));
  return /*#__PURE__*/React.createElement(_FormControl.default, (0, _extends2.default)({
    className: (0, _clsx.default)(classes.root, className),
    disabled: disabled,
    error: error,
    fullWidth: fullWidth,
    hiddenLabel: hiddenLabel,
    ref: ref,
    required: required,
    color: color,
    variant: variant
  }, other), label && /*#__PURE__*/React.createElement(_InputLabel.default, (0, _extends2.default)({
    htmlFor: id,
    id: inputLabelId
  }, InputLabelProps), label), select ? /*#__PURE__*/React.createElement(_Select.default, (0, _extends2.default)({
    "aria-describedby": helperTextId,
    id: id,
    labelId: inputLabelId,
    value: value,
    input: InputElement
  }, SelectProps), children) : InputElement, helperText && /*#__PURE__*/React.createElement(_FormHelperText.default, (0, _extends2.default)({
    id: helperTextId
  }, FormHelperTextProps), helperText));
});
"production" !== "production" ? TextField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------

  /**
   * This prop helps users to fill forms faster, especially on mobile devices.
   * The name can be confusing, as it's more like an autofill.
   * You can learn more about it [following the specification](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).
   */
  autoComplete: _propTypes.default.string,

  /**
   * If `true`, the `input` element will be focused during the first mount.
   */
  autoFocus: _propTypes.default.bool,

  /**
   * @ignore
   */
  children: _propTypes.default.node,

  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: _propTypes.default.object,

  /**
   * @ignore
   */
  className: _propTypes.default.string,

  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color: _propTypes.default.oneOf(['primary', 'secondary']),

  /**
   * The default value of the `input` element.
   */
  defaultValue: _propTypes.default.any,

  /**
   * If `true`, the `input` element will be disabled.
   */
  disabled: _propTypes.default.bool,

  /**
   * If `true`, the label will be displayed in an error state.
   */
  error: _propTypes.default.bool,

  /**
   * Props applied to the [`FormHelperText`](/api/form-helper-text/) element.
   */
  FormHelperTextProps: _propTypes.default.object,

  /**
   * If `true`, the input will take up the full width of its container.
   */
  fullWidth: _propTypes.default.bool,

  /**
   * The helper text content.
   */
  helperText: _propTypes.default.node,

  /**
   * @ignore
   */
  hiddenLabel: _propTypes.default.bool,

  /**
   * The id of the `input` element.
   * Use this prop to make `label` and `helperText` accessible for screen readers.
   */
  id: _propTypes.default.string,

  /**
   * Props applied to the [`InputLabel`](/api/input-label/) element.
   */
  InputLabelProps: _propTypes.default.object,

  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps: _propTypes.default.object,

  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/api/filled-input/),
   * [`OutlinedInput`](/api/outlined-input/) or [`Input`](/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps: _propTypes.default.object,

  /**
   * Pass a ref to the `input` element.
   */
  inputRef: _utils.refType,

  /**
   * The label content.
   */
  label: _propTypes.default.node,

  /**
   * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
   */
  margin: _propTypes.default.oneOf(['dense', 'none', 'normal']),

  /**
   * If `true`, a textarea element will be rendered instead of an input.
   */
  multiline: _propTypes.default.bool,

  /**
   * Name attribute of the `input` element.
   */
  name: _propTypes.default.string,

  /**
   * @ignore
   */
  onBlur: _propTypes.default.func,

  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange: _propTypes.default.func,

  /**
   * @ignore
   */
  onFocus: _propTypes.default.func,

  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder: _propTypes.default.string,

  /**
   * If `true`, the label is displayed as required and the `input` element` will be required.
   */
  required: _propTypes.default.bool,

  /**
   * Number of rows to display when multiline option is set to true.
   */
  rows: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),

  /**
   * Maximum number of rows to display when multiline option is set to true.
   */
  rowsMax: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),

  /**
   * Render a [`Select`](/api/select/) element while passing the Input element to `Select` as `input` parameter.
   * If this option is set you must pass the options of the select as children.
   */
  select: _propTypes.default.bool,

  /**
   * Props applied to the [`Select`](/api/select/) element.
   */
  SelectProps: _propTypes.default.object,

  /**
   * The size of the text field.
   */
  size: _propTypes.default.oneOf(['medium', 'small']),

  /**
   * Type of the `input` element. It should be [a valid HTML5 input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types).
   */
  type: _propTypes.default.string,

  /**
   * The value of the `input` element, required for a controlled component.
   */
  value: _propTypes.default.any,

  /**
   * The variant to use.
   */
  variant: _propTypes.default.oneOf(['filled', 'outlined', 'standard'])
} : void 0;

var _default = (0, _withStyles.default)(styles, {
  name: 'MuiTextField'
})(TextField);

exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/TextField/TextField.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/TextField/TextField.js",}],
[743, {"@material-ui/utils":853}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRgb = hexToRgb;
exports.rgbToHex = rgbToHex;
exports.hslToRgb = hslToRgb;
exports.decomposeColor = decomposeColor;
exports.recomposeColor = recomposeColor;
exports.getContrastRatio = getContrastRatio;
exports.getLuminance = getLuminance;
exports.emphasize = emphasize;
exports.fade = fade;
exports.darken = darken;
exports.lighten = lighten;

var _utils = require("@material-ui/utils");

/* eslint-disable no-use-before-define */

/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {number} value The value to be clamped
 * @param {number} min The lower boundary of the output range
 * @param {number} max The upper boundary of the output range
 * @returns {number} A number in the range [min, max]
 */
function clamp(value) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if ("production" !== 'production') {
    if (value < min || value > max) {
      console.error("Material-UI: The value provided ".concat(value, " is out of range [").concat(min, ", ").concat(max, "]."));
    }
  }

  return Math.min(Math.max(min, value), max);
}
/**
 * Converts a color from CSS hex format to CSS rgb format.
 *
 * @param {string} color - Hex color, i.e. #nnn or #nnnnnn
 * @returns {string} A CSS rgb color string
 */


function hexToRgb(color) {
  color = color.substr(1);
  var re = new RegExp(".{1,".concat(color.length >= 6 ? 2 : 1, "}"), 'g');
  var colors = color.match(re);

  if (colors && colors[0].length === 1) {
    colors = colors.map(function (n) {
      return n + n;
    });
  }

  return colors ? "rgb".concat(colors.length === 4 ? 'a' : '', "(").concat(colors.map(function (n, index) {
    return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1000) / 1000;
  }).join(', '), ")") : '';
}

function intToHex(int) {
  var hex = int.toString(16);
  return hex.length === 1 ? "0".concat(hex) : hex;
}
/**
 * Converts a color from CSS rgb format to CSS hex format.
 *
 * @param {string} color - RGB color, i.e. rgb(n, n, n)
 * @returns {string} A CSS rgb color string, i.e. #nnnnnn
 */


function rgbToHex(color) {
  // Idempotent
  if (color.indexOf('#') === 0) {
    return color;
  }

  var _decomposeColor = decomposeColor(color),
      values = _decomposeColor.values;

  return "#".concat(values.map(function (n) {
    return intToHex(n);
  }).join(''));
}
/**
 * Converts a color from hsl format to rgb format.
 *
 * @param {string} color - HSL color values
 * @returns {string} rgb color values
 */


function hslToRgb(color) {
  color = decomposeColor(color);
  var _color = color,
      values = _color.values;
  var h = values[0];
  var s = values[1] / 100;
  var l = values[2] / 100;
  var a = s * Math.min(l, 1 - l);

  var f = function f(n) {
    var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };

  var type = 'rgb';
  var rgb = [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];

  if (color.type === 'hsla') {
    type += 'a';
    rgb.push(values[3]);
  }

  return recomposeColor({
    type: type,
    values: rgb
  });
}
/**
 * Returns an object with the type and values of a color.
 *
 * Note: Does not support rgb % values.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {object} - A MUI color object: {type: string, values: number[]}
 */


function decomposeColor(color) {
  // Idempotent
  if (color.type) {
    return color;
  }

  if (color.charAt(0) === '#') {
    return decomposeColor(hexToRgb(color));
  }

  var marker = color.indexOf('(');
  var type = color.substring(0, marker);

  if (['rgb', 'rgba', 'hsl', 'hsla'].indexOf(type) === -1) {
    throw new Error("production" !== "production" ? "Material-UI: Unsupported `".concat(color, "` color.\nWe support the following formats: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla().") : (0, _utils.formatMuiErrorMessage)(3, color));
  }

  var values = color.substring(marker + 1, color.length - 1).split(',');
  values = values.map(function (value) {
    return parseFloat(value);
  });
  return {
    type: type,
    values: values
  };
}
/**
 * Converts a color object with type and values to a string.
 *
 * @param {object} color - Decomposed color
 * @param {string} color.type - One of: 'rgb', 'rgba', 'hsl', 'hsla'
 * @param {array} color.values - [n,n,n] or [n,n,n,n]
 * @returns {string} A CSS color string
 */


function recomposeColor(color) {
  var type = color.type;
  var values = color.values;

  if (type.indexOf('rgb') !== -1) {
    // Only convert the first 3 values to int (i.e. not alpha)
    values = values.map(function (n, i) {
      return i < 3 ? parseInt(n, 10) : n;
    });
  } else if (type.indexOf('hsl') !== -1) {
    values[1] = "".concat(values[1], "%");
    values[2] = "".concat(values[2], "%");
  }

  return "".concat(type, "(").concat(values.join(', '), ")");
}
/**
 * Calculates the contrast ratio between two colors.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} foreground - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {string} background - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {number} A contrast ratio value in the range 0 - 21.
 */


function getContrastRatio(foreground, background) {
  var lumA = getLuminance(foreground);
  var lumB = getLuminance(background);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}
/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {number} The relative brightness of the color in the range 0 - 1
 */


function getLuminance(color) {
  color = decomposeColor(color);
  var rgb = color.type === 'hsl' ? decomposeColor(hslToRgb(color)).values : color.values;
  rgb = rgb.map(function (val) {
    val /= 255; // normalized

    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  }); // Truncate at 3 digits

  return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
}
/**
 * Darken or lighten a color, depending on its luminance.
 * Light colors are darkened, dark colors are lightened.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} coefficient=0.15 - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */


function emphasize(color) {
  var coefficient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.15;
  return getLuminance(color) > 0.5 ? darken(color, coefficient) : lighten(color, coefficient);
}
/**
 * Set the absolute transparency of a color.
 * Any existing alpha values are overwritten.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} value - value to set the alpha channel to in the range 0 -1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */


function fade(color, value) {
  color = decomposeColor(color);
  value = clamp(value);

  if (color.type === 'rgb' || color.type === 'hsl') {
    color.type += 'a';
  }

  color.values[3] = value;
  return recomposeColor(color);
}
/**
 * Darkens a color.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */


function darken(color, coefficient) {
  color = decomposeColor(color);
  coefficient = clamp(coefficient);

  if (color.type.indexOf('hsl') !== -1) {
    color.values[2] *= 1 - coefficient;
  } else if (color.type.indexOf('rgb') !== -1) {
    for (var i = 0; i < 3; i += 1) {
      color.values[i] *= 1 - coefficient;
    }
  }

  return recomposeColor(color);
}
/**
 * Lightens a color.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */


function lighten(color, coefficient) {
  color = decomposeColor(color);
  coefficient = clamp(coefficient);

  if (color.type.indexOf('hsl') !== -1) {
    color.values[2] += (100 - color.values[2]) * coefficient;
  } else if (color.type.indexOf('rgb') !== -1) {
    for (var i = 0; i < 3; i += 1) {
      color.values[i] += (255 - color.values[i]) * coefficient;
    }
  }

  return recomposeColor(color);
}
//# sourceMappingURL=node_modules/@material-ui/core/styles/colorManipulator.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/colorManipulator.js",}],
[762, {"./defaultTheme":753,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/styles":809}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _styles = require("@material-ui/styles");

var _defaultTheme = _interopRequireDefault(require("./defaultTheme"));

function withStyles(stylesOrCreator, options) {
  return (0, _styles.withStyles)(stylesOrCreator, (0, _extends2.default)({
    defaultTheme: _defaultTheme.default
  }, options));
}

var _default = withStyles;
exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/styles/withStyles.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/withStyles.js",}],
[750, {"@material-ui/styles":809}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStyles;

var _styles = require("@material-ui/styles");

// let warnOnce = false;
// To remove in v5
function createStyles(styles) {
  // warning(
  //   warnOnce,
  //   [
  //     'Material-UI: createStyles from @material-ui/core/styles is deprecated.',
  //     'Please use @material-ui/styles/createStyles',
  //   ].join('\n'),
  // );
  // warnOnce = true;
  return (0, _styles.createStyles)(styles);
}
//# sourceMappingURL=node_modules/@material-ui/core/styles/createStyles.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/createStyles.js",}],
[746, {"./createMuiTheme":747,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/utils":853}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMuiStrictModeTheme;

var _utils = require("@material-ui/utils");

var _createMuiTheme = _interopRequireDefault(require("./createMuiTheme"));

function createMuiStrictModeTheme(options) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _createMuiTheme.default.apply(void 0, [(0, _utils.deepmerge)({
    unstable_strictMode: true
  }, options)].concat(args));
}
//# sourceMappingURL=node_modules/@material-ui/core/styles/createMuiStrictModeTheme.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/createMuiStrictModeTheme.js",}],
[755, {"./defaultTheme":753,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/styles":809}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _styles = require("@material-ui/styles");

var _defaultTheme = _interopRequireDefault(require("./defaultTheme"));

function makeStyles(stylesOrCreator) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _styles.makeStyles)(stylesOrCreator, (0, _extends2.default)({
    defaultTheme: _defaultTheme.default
  }, options));
}

var _default = makeStyles;
exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/styles/makeStyles.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/makeStyles.js",}],
[760, {"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.duration = exports.easing = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

// Follow https://material.google.com/motion/duration-easing.html#duration-easing-natural-easing-curves
// to learn the context in which each easing should be used.
var easing = {
  // This is the most common easing curve.
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
}; // Follow https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
// to learn when use what timing

exports.easing = easing;
var duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195
};
exports.duration = duration;

function formatMs(milliseconds) {
  return "".concat(Math.round(milliseconds), "ms");
}
/**
 * @param {string|Array} props
 * @param {object} param
 * @param {string} param.prop
 * @param {number} param.duration
 * @param {string} param.easing
 * @param {number} param.delay
 */


var _default = {
  easing: easing,
  duration: duration,
  create: function create() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['all'];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$duration = options.duration,
        durationOption = _options$duration === void 0 ? duration.standard : _options$duration,
        _options$easing = options.easing,
        easingOption = _options$easing === void 0 ? easing.easeInOut : _options$easing,
        _options$delay = options.delay,
        delay = _options$delay === void 0 ? 0 : _options$delay,
        other = (0, _objectWithoutProperties2.default)(options, ["duration", "easing", "delay"]);

    if ("production" !== 'production') {
      var isString = function isString(value) {
        return typeof value === 'string';
      };

      var isNumber = function isNumber(value) {
        return !isNaN(parseFloat(value));
      };

      if (!isString(props) && !Array.isArray(props)) {
        console.error('Material-UI: Argument "props" must be a string or Array.');
      }

      if (!isNumber(durationOption) && !isString(durationOption)) {
        console.error("Material-UI: Argument \"duration\" must be a number or a string but found ".concat(durationOption, "."));
      }

      if (!isString(easingOption)) {
        console.error('Material-UI: Argument "easing" must be a string.');
      }

      if (!isNumber(delay) && !isString(delay)) {
        console.error('Material-UI: Argument "delay" must be a number or a string.');
      }

      if (Object.keys(other).length !== 0) {
        console.error("Material-UI: Unrecognized argument(s) [".concat(Object.keys(other).join(','), "]."));
      }
    }

    return (Array.isArray(props) ? props : [props]).map(function (animatedProp) {
      return "".concat(animatedProp, " ").concat(typeof durationOption === 'string' ? durationOption : formatMs(durationOption), " ").concat(easingOption, " ").concat(typeof delay === 'string' ? delay : formatMs(delay));
    }).join(',');
  },
  getAutoHeightDuration: function getAutoHeightDuration(height) {
    if (!height) {
      return 0;
    }

    var constant = height / 36; // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10

    return Math.round((4 + 15 * Math.pow(constant, 0.25) + constant / 5) * 10);
  }
};
exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/styles/transitions.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/transitions.js",}],
[761, {"./defaultTheme":753,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/styles":809,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTheme;

var _styles = require("@material-ui/styles");

var _react = _interopRequireDefault(require("react"));

var _defaultTheme = _interopRequireDefault(require("./defaultTheme"));

function useTheme() {
  var theme = (0, _styles.useTheme)() || _defaultTheme.default;

  if ("production" !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    _react.default.useDebugValue(theme);
  }

  return theme;
}
//# sourceMappingURL=node_modules/@material-ui/core/styles/useTheme.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/useTheme.js",}],
[763, {"./defaultTheme":753,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/styles":809}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _styles = require("@material-ui/styles");

var _defaultTheme = _interopRequireDefault(require("./defaultTheme"));

var withTheme = (0, _styles.withThemeCreator)({
  defaultTheme: _defaultTheme.default
});
var _default = withTheme;
exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/styles/withTheme.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/withTheme.js",}],
[759, {"./defaultTheme":753,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/styles":809}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _styles = require("@material-ui/styles");

var _defaultTheme = _interopRequireDefault(require("./defaultTheme"));

var styled = function styled(Component) {
  var componentCreator = (0, _styles.styled)(Component);
  return function (style, options) {
    return componentCreator(style, (0, _extends2.default)({
      defaultTheme: _defaultTheme.default
    }, options));
  };
};

var _default = styled;
exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/styles/styled.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/styled.js",}],
[756, {"./cssUtils":752,"@babel/runtime/helpers/extends":181,"@babel/runtime/helpers/interopRequireDefault":186,"@material-ui/utils":853}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = responsiveFontSizes;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("@material-ui/utils");

var _cssUtils = require("./cssUtils");

function responsiveFontSizes(themeInput) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$breakpoints = options.breakpoints,
      breakpoints = _options$breakpoints === void 0 ? ['sm', 'md', 'lg'] : _options$breakpoints,
      _options$disableAlign = options.disableAlign,
      disableAlign = _options$disableAlign === void 0 ? false : _options$disableAlign,
      _options$factor = options.factor,
      factor = _options$factor === void 0 ? 2 : _options$factor,
      _options$variants = options.variants,
      variants = _options$variants === void 0 ? ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button', 'overline'] : _options$variants;
  var theme = (0, _extends2.default)({}, themeInput);
  theme.typography = (0, _extends2.default)({}, theme.typography);
  var typography = theme.typography; // Convert between css lengths e.g. em->px or px->rem
  // Set the baseFontSize for your project. Defaults to 16px (also the browser default).

  var convert = (0, _cssUtils.convertLength)(typography.htmlFontSize);
  var breakpointValues = breakpoints.map(function (x) {
    return theme.breakpoints.values[x];
  });
  variants.forEach(function (variant) {
    var style = typography[variant];
    var remFontSize = parseFloat(convert(style.fontSize, 'rem'));

    if (remFontSize <= 1) {
      return;
    }

    var maxFontSize = remFontSize;
    var minFontSize = 1 + (maxFontSize - 1) / factor;
    var lineHeight = style.lineHeight;

    if (!(0, _cssUtils.isUnitless)(lineHeight) && !disableAlign) {
      throw new Error("production" !== "production" ? "Material-UI: Unsupported non-unitless line height with grid alignment.\nUse unitless line heights instead." : (0, _utils.formatMuiErrorMessage)(6));
    }

    if (!(0, _cssUtils.isUnitless)(lineHeight)) {
      // make it unitless
      lineHeight = parseFloat(convert(lineHeight, 'rem')) / parseFloat(remFontSize);
    }

    var transform = null;

    if (!disableAlign) {
      transform = function transform(value) {
        return (0, _cssUtils.alignProperty)({
          size: value,
          grid: (0, _cssUtils.fontGrid)({
            pixels: 4,
            lineHeight: lineHeight,
            htmlFontSize: typography.htmlFontSize
          })
        });
      };
    }

    typography[variant] = (0, _extends2.default)({}, style, (0, _cssUtils.responsiveProperty)({
      cssProperty: 'fontSize',
      min: minFontSize,
      max: maxFontSize,
      unit: 'rem',
      breakpoints: breakpointValues,
      transform: transform
    }));
  });
  return theme;
}
//# sourceMappingURL=node_modules/@material-ui/core/styles/responsiveFontSizes.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/responsiveFontSizes.js",}],
[747, {"./createBreakpoints":744,"./createMixins":745,"./createPalette":748,"./createSpacing":749,"./createTypography":751,"./shadows":757,"./shape":758,"./transitions":760,"./zIndex":764,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/objectWithoutProperties":195,"@material-ui/utils":853}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _utils = require("@material-ui/utils");

var _createBreakpoints = _interopRequireDefault(require("./createBreakpoints"));

var _createMixins = _interopRequireDefault(require("./createMixins"));

var _createPalette = _interopRequireDefault(require("./createPalette"));

var _createTypography = _interopRequireDefault(require("./createTypography"));

var _shadows = _interopRequireDefault(require("./shadows"));

var _shape = _interopRequireDefault(require("./shape"));

var _createSpacing = _interopRequireDefault(require("./createSpacing"));

var _transitions = _interopRequireDefault(require("./transitions"));

var _zIndex = _interopRequireDefault(require("./zIndex"));

function createMuiTheme() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$breakpoints = options.breakpoints,
      breakpointsInput = _options$breakpoints === void 0 ? {} : _options$breakpoints,
      _options$mixins = options.mixins,
      mixinsInput = _options$mixins === void 0 ? {} : _options$mixins,
      _options$palette = options.palette,
      paletteInput = _options$palette === void 0 ? {} : _options$palette,
      spacingInput = options.spacing,
      _options$typography = options.typography,
      typographyInput = _options$typography === void 0 ? {} : _options$typography,
      other = (0, _objectWithoutProperties2.default)(options, ["breakpoints", "mixins", "palette", "spacing", "typography"]);
  var palette = (0, _createPalette.default)(paletteInput);
  var breakpoints = (0, _createBreakpoints.default)(breakpointsInput);
  var spacing = (0, _createSpacing.default)(spacingInput);
  var muiTheme = (0, _utils.deepmerge)({
    breakpoints: breakpoints,
    direction: 'ltr',
    mixins: (0, _createMixins.default)(breakpoints, spacing, mixinsInput),
    overrides: {},
    // Inject custom styles
    palette: palette,
    props: {},
    // Provide default props
    shadows: _shadows.default,
    typography: (0, _createTypography.default)(palette, typographyInput),
    spacing: spacing,
    shape: _shape.default,
    transitions: _transitions.default,
    zIndex: _zIndex.default
  }, other);

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  muiTheme = args.reduce(function (acc, argument) {
    return (0, _utils.deepmerge)(acc, argument);
  }, muiTheme);

  if ("production" !== 'production') {
    var pseudoClasses = ['checked', 'disabled', 'error', 'focused', 'focusVisible', 'required', 'expanded', 'selected'];

    var traverse = function traverse(node, parentKey) {
      var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var key; // eslint-disable-next-line guard-for-in, no-restricted-syntax

      for (key in node) {
        var child = node[key];

        if (depth === 1) {
          if (key.indexOf('Mui') === 0 && child) {
            traverse(child, key, depth + 1);
          }
        } else if (pseudoClasses.indexOf(key) !== -1 && Object.keys(child).length > 0) {
          if ("production" !== 'production') {
            console.error(["Material-UI: The `".concat(parentKey, "` component increases ") + "the CSS specificity of the `".concat(key, "` internal state."), 'You can not override it like this: ', JSON.stringify(node, null, 2), '', 'Instead, you need to use the $ruleName syntax:', JSON.stringify({
              root: (0, _defineProperty2.default)({}, "&$".concat(key), child)
            }, null, 2), '', 'https://material-ui.com/r/pseudo-classes-guide'].join('\n'));
          } // Remove the style to prevent global conflicts.


          node[key] = {};
        }
      }
    };

    traverse(muiTheme.overrides);
  }

  return muiTheme;
}

var _default = createMuiTheme;
exports.default = _default;
//# sourceMappingURL=node_modules/@material-ui/core/styles/createMuiTheme.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/core/styles/createMuiTheme.js",}],
[809, {"./ServerStyleSheets":794,"./StylesProvider":796,"./ThemeProvider":798,"./createGenerateClassName":801,"./createStyles":803,"./getThemeProps":808,"./jssPreset":810,"./makeStyles":812,"./mergeClasses":816,"./styled":818,"./useTheme":821,"./withStyles":823,"./withTheme":825,"@babel/runtime/helpers/interopRequireWildcard":187,"@material-ui/utils":853}, function (require, module, exports) {
/** @license Material-UI v4.10.0
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createGenerateClassName: true,
  createStyles: true,
  getThemeProps: true,
  jssPreset: true,
  makeStyles: true,
  mergeClasses: true,
  ServerStyleSheets: true,
  styled: true,
  StylesProvider: true,
  ThemeProvider: true,
  useTheme: true,
  withStyles: true,
  withTheme: true
};
Object.defineProperty(exports, "createGenerateClassName", {
  enumerable: true,
  get: function get() {
    return _createGenerateClassName.default;
  }
});
Object.defineProperty(exports, "createStyles", {
  enumerable: true,
  get: function get() {
    return _createStyles.default;
  }
});
Object.defineProperty(exports, "getThemeProps", {
  enumerable: true,
  get: function get() {
    return _getThemeProps.default;
  }
});
Object.defineProperty(exports, "jssPreset", {
  enumerable: true,
  get: function get() {
    return _jssPreset.default;
  }
});
Object.defineProperty(exports, "makeStyles", {
  enumerable: true,
  get: function get() {
    return _makeStyles.default;
  }
});
Object.defineProperty(exports, "mergeClasses", {
  enumerable: true,
  get: function get() {
    return _mergeClasses.default;
  }
});
Object.defineProperty(exports, "ServerStyleSheets", {
  enumerable: true,
  get: function get() {
    return _ServerStyleSheets.default;
  }
});
Object.defineProperty(exports, "styled", {
  enumerable: true,
  get: function get() {
    return _styled.default;
  }
});
Object.defineProperty(exports, "StylesProvider", {
  enumerable: true,
  get: function get() {
    return _StylesProvider.default;
  }
});
Object.defineProperty(exports, "ThemeProvider", {
  enumerable: true,
  get: function get() {
    return _ThemeProvider.default;
  }
});
Object.defineProperty(exports, "useTheme", {
  enumerable: true,
  get: function get() {
    return _useTheme.default;
  }
});
Object.defineProperty(exports, "withStyles", {
  enumerable: true,
  get: function get() {
    return _withStyles.default;
  }
});
Object.defineProperty(exports, "withTheme", {
  enumerable: true,
  get: function get() {
    return _withTheme.default;
  }
});

var _utils = require("@material-ui/utils");

var _createGenerateClassName = _interopRequireWildcard(require("./createGenerateClassName"));

Object.keys(_createGenerateClassName).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _createGenerateClassName[key];
    }
  });
});

var _createStyles = _interopRequireWildcard(require("./createStyles"));

Object.keys(_createStyles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _createStyles[key];
    }
  });
});

var _getThemeProps = _interopRequireWildcard(require("./getThemeProps"));

Object.keys(_getThemeProps).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _getThemeProps[key];
    }
  });
});

var _jssPreset = _interopRequireWildcard(require("./jssPreset"));

Object.keys(_jssPreset).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _jssPreset[key];
    }
  });
});

var _makeStyles = _interopRequireWildcard(require("./makeStyles"));

Object.keys(_makeStyles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _makeStyles[key];
    }
  });
});

var _mergeClasses = _interopRequireWildcard(require("./mergeClasses"));

Object.keys(_mergeClasses).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mergeClasses[key];
    }
  });
});

var _ServerStyleSheets = _interopRequireWildcard(require("./ServerStyleSheets"));

Object.keys(_ServerStyleSheets).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ServerStyleSheets[key];
    }
  });
});

var _styled = _interopRequireWildcard(require("./styled"));

Object.keys(_styled).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _styled[key];
    }
  });
});

var _StylesProvider = _interopRequireWildcard(require("./StylesProvider"));

Object.keys(_StylesProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _StylesProvider[key];
    }
  });
});

var _ThemeProvider = _interopRequireWildcard(require("./ThemeProvider"));

Object.keys(_ThemeProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ThemeProvider[key];
    }
  });
});

var _useTheme = _interopRequireWildcard(require("./useTheme"));

Object.keys(_useTheme).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _useTheme[key];
    }
  });
});

var _withStyles = _interopRequireWildcard(require("./withStyles"));

Object.keys(_withStyles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _withStyles[key];
    }
  });
});

var _withTheme = _interopRequireWildcard(require("./withTheme"));

Object.keys(_withTheme).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _withTheme[key];
    }
  });
});

/* eslint-disable import/export */

/* Warning if there are several instances of @material-ui/styles */
if ("production" !== 'production' && "production" !== 'test' && typeof window !== 'undefined') {
  _utils.ponyfillGlobal['__@material-ui/styles-init__'] = _utils.ponyfillGlobal['__@material-ui/styles-init__'] || 0;

  if (_utils.ponyfillGlobal['__@material-ui/styles-init__'] === 1) {
    console.warn(['It looks like there are several instances of `@material-ui/styles` initialized in this application.', 'This may cause theme propagation issues, broken class names, ' + 'specificity issues, and makes your application bigger without a good reason.', '', 'See https://material-ui.com/r/styles-instance-warning for more info.'].join('\n'));
  }

  _utils.ponyfillGlobal['__@material-ui/styles-init__'] += 1;
}
//# sourceMappingURL=node_modules/@material-ui/styles/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@material-ui/styles/index.js",}],
[4222, {"../../../components/ui/page-container/page-container-footer":3920,"../../../ducks/send":3986,"../../../helpers/constants/routes":3995,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"lodash":2646,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _lodash = require("lodash");

var _pageContainerFooter = _interopRequireDefault(require("../../../components/ui/page-container/page-container-footer"));

var _routes = require("../../../helpers/constants/routes");

var _send = require("../../../ducks/send");

class SendFooter extends _react.Component {
  onCancel() {
    const {
      cancelTx,
      draftTransactionID,
      history,
      mostRecentOverviewPage,
      resetSendState,
      sendStage
    } = this.props;
    if (draftTransactionID) cancelTx({
      id: draftTransactionID
    });
    resetSendState();
    const nextRoute = sendStage === _send.SEND_STAGES.EDIT ? _routes.DEFAULT_ROUTE : mostRecentOverviewPage;
    history.push(nextRoute);
  }

  async onSubmit(event) {
    event.preventDefault();
    const {
      addToAddressBookIfNew,
      sign,
      to,
      toAccounts,
      history,
      gasEstimateType
    } = this.props;
    const {
      metricsEvent
    } = this.context; // TODO: add nickname functionality

    await addToAddressBookIfNew(to, toAccounts);
    const promise = sign();
    Promise.resolve(promise).then(() => {
      metricsEvent({
        eventOpts: {
          category: 'Transactions',
          action: 'Edit Screen',
          name: 'Complete'
        },
        customVariables: {
          gasChanged: gasEstimateType
        }
      });
      history.push(_routes.CONFIRM_TRANSACTION_ROUTE);
    });
  }

  componentDidUpdate(prevProps) {
    const {
      sendErrors
    } = this.props;
    const {
      metricsEvent
    } = this.context;

    if (Object.keys(sendErrors).length > 0 && (0, _lodash.isEqual)(sendErrors, prevProps.sendErrors) === false) {
      const errorField = Object.keys(sendErrors).find(key => sendErrors[key]);
      const errorMessage = sendErrors[errorField];
      metricsEvent({
        eventOpts: {
          category: 'Transactions',
          action: 'Edit Screen',
          name: 'Error'
        },
        customVariables: {
          errorField,
          errorMessage
        }
      });
    }
  }

  render() {
    const {
      t
    } = this.context;
    const {
      sendStage
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_pageContainerFooter.default, {
      onCancel: () => this.onCancel(),
      onSubmit: e => this.onSubmit(e),
      disabled: this.props.disabled,
      cancelText: sendStage === _send.SEND_STAGES.EDIT ? t('reject') : t('cancel')
    });
  }

}

exports.default = SendFooter;
(0, _defineProperty2.default)(SendFooter, "propTypes", {
  addToAddressBookIfNew: _propTypes.default.func,
  resetSendState: _propTypes.default.func,
  disabled: _propTypes.default.bool.isRequired,
  history: _propTypes.default.object,
  sign: _propTypes.default.func,
  to: _propTypes.default.string,
  toAccounts: _propTypes.default.array,
  sendStage: _propTypes.default.string,
  sendErrors: _propTypes.default.object,
  gasEstimateType: _propTypes.default.string,
  mostRecentOverviewPage: _propTypes.default.string.isRequired,
  cancelTx: _propTypes.default.func,
  draftTransactionID: _propTypes.default.string
});
(0, _defineProperty2.default)(SendFooter, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/send/send-footer/send-footer.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-footer/send-footer.component.js",}],
[4195, {"../../../../../shared/modules/hexstring-utils":3604,"../../../../helpers/utils/util":4020,"../../send.utils":4228,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _send = require("../../send.utils");

var _util = require("../../../../helpers/utils/util");

var _hexstringUtils = require("../../../../../shared/modules/hexstring-utils");

class EnsInput extends _react.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "onPaste", event => {
      var _event$clipboardData$;

      if ((_event$clipboardData$ = event.clipboardData.items) !== null && _event$clipboardData$ !== void 0 && _event$clipboardData$.length) {
        const clipboardItem = event.clipboardData.items[0];
        clipboardItem === null || clipboardItem === void 0 ? void 0 : clipboardItem.getAsString(text => {
          const input = text.trim();

          if (!(0, _hexstringUtils.isBurnAddress)(input) && (0, _hexstringUtils.isValidHexAddress)(input, {
            mixedCaseUseChecksum: true
          })) {
            this.props.onPaste(input);
          }
        });
      }
    });
    (0, _defineProperty2.default)(this, "onChange", ({
      target: {
        value
      }
    }) => {
      const {
        onValidAddressTyped,
        internalSearch,
        onChange,
        lookupEnsName,
        resetEnsResolution
      } = this.props;
      const input = value.trim();
      onChange(input);
      const convertedAddress = input.replace('monsta:', '0x');

      if (internalSearch) {
        return null;
      } // Empty ENS state if input is empty
      // maybe scan ENS


      if ((0, _util.isValidDomainName)(convertedAddress)) {
        lookupEnsName(convertedAddress);
      } else {
        resetEnsResolution();

        if (onValidAddressTyped && !(0, _hexstringUtils.isBurnAddress)(convertedAddress) && (0, _hexstringUtils.isValidHexAddress)(convertedAddress, {
          mixedCaseUseChecksum: true
        })) {
          onValidAddressTyped(input);
        }
      }

      return null;
    });
  }

  componentDidMount() {
    this.props.initializeEnsSlice();
  }

  render() {
    const {
      t
    } = this.context;
    const {
      className,
      selectedAddress,
      selectedName,
      userInput
    } = this.props;
    const hasSelectedAddress = Boolean(selectedAddress);
    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('ens-input', className)
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('ens-input__wrapper', {
        'ens-input__wrapper__status-icon--error': false,
        'ens-input__wrapper__status-icon--valid': false,
        'ens-input__wrapper--valid': hasSelectedAddress
      })
    }, hasSelectedAddress ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "ens-input__wrapper__input ens-input__wrapper__input--selected"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "ens-input__wrapper__wrapper-status-icon"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('ens-input__wrapper__status-icon', {
        'ens-input__wrapper__status-icon--valid': hasSelectedAddress
      })
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "ens-input__selected-input__title"
    }, selectedName.replace('0x', 'monsta:') || (0, _send.ellipsify)(selectedAddress.replace('0x', 'monsta:'), 10))), selectedName && /*#__PURE__*/_react.default.createElement("div", {
      className: "ens-input__selected-input__subtitle"
    }, selectedAddress.replace('0x', 'monsta:'))), /*#__PURE__*/_react.default.createElement("div", {
      className: "ens-input__wrapper__action-icon-responsive ens-input__wrapper__action-icon--erase",
      style: {
        display: "flex",
        alignItems: "center"
      },
      onClick: this.props.onReset
    })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)('ens-input__wrapper__status-icon', {
        'ens-input__wrapper__status-icon--valid': hasSelectedAddress
      })
    }), /*#__PURE__*/_react.default.createElement("input", {
      className: "ens-input__wrapper__input",
      type: "text",
      dir: "auto",
      placeholder: t('recipientAddressPlaceholder'),
      onChange: this.onChange,
      onPaste: this.onPaste,
      spellCheck: "false",
      value: selectedAddress || userInput,
      autoFocus: true,
      "data-testid": "ens-input"
    }), /*#__PURE__*/_react.default.createElement("button", {
      className: (0, _classnames.default)('ens-input__wrapper__action-icon', {
        'ens-input__wrapper__action-icon--erase': userInput,
        'ens-input__wrapper__action-icon--qrcode': !userInput
      }),
      onClick: () => {
        if (userInput) {
          this.props.onReset();
        } else {
          this.props.scanQrCode();
        }
      }
    }))));
  }

}

exports.default = EnsInput;
(0, _defineProperty2.default)(EnsInput, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});
(0, _defineProperty2.default)(EnsInput, "propTypes", {
  className: _propTypes.default.string,
  selectedAddress: _propTypes.default.string,
  selectedName: _propTypes.default.string,
  scanQrCode: _propTypes.default.func,
  onPaste: _propTypes.default.func,
  onValidAddressTyped: _propTypes.default.func,
  internalSearch: _propTypes.default.bool,
  userInput: _propTypes.default.string,
  onChange: _propTypes.default.func.isRequired,
  onReset: _propTypes.default.func.isRequired,
  lookupEnsName: _propTypes.default.func.isRequired,
  initializeEnsSlice: _propTypes.default.func.isRequired,
  resetEnsResolution: _propTypes.default.func.isRequired
});

//# sourceMappingURL=ui/pages/send/send-content/add-recipient/ens-input.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/add-recipient/ens-input.component.js",}],
[4193, {"../../../../components/app/contact-list":3660,"../../../../components/app/contact-list/recipient-group/recipient-group.component":3661,"../../../../components/ui/button":3842,"../../../../components/ui/confusable":3852,"../../../../components/ui/dialog":3860,"../../../../components/ui/identicon":3895,"../../send.utils":4228,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"fuse.js":1881,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _fuse = _interopRequireDefault(require("fuse.js"));

var _identicon = _interopRequireDefault(require("../../../../components/ui/identicon"));

var _dialog = _interopRequireDefault(require("../../../../components/ui/dialog"));

var _contactList = _interopRequireDefault(require("../../../../components/app/contact-list"));

var _recipientGroup = _interopRequireDefault(require("../../../../components/app/contact-list/recipient-group/recipient-group.component"));

var _send = require("../../send.utils");

var _button = _interopRequireDefault(require("../../../../components/ui/button"));

var _confusable = _interopRequireDefault(require("../../../../components/ui/confusable"));

class AddRecipient extends _react.Component {
  constructor(props) {
    super(props);
    (0, _defineProperty2.default)(this, "selectRecipient", (address, nickname = '') => {
      this.props.updateRecipient({
        address,
        nickname
      });
    });
    (0, _defineProperty2.default)(this, "searchForContacts", () => {
      const {
        userInput,
        contacts
      } = this.props;
      let _contacts = contacts;

      if (userInput) {
        this.contactFuse.setCollection(contacts);
        _contacts = this.contactFuse.search(userInput);
      }

      return _contacts;
    });
    (0, _defineProperty2.default)(this, "searchForRecents", () => {
      const {
        userInput,
        nonContacts
      } = this.props;
      let _nonContacts = nonContacts;

      if (userInput) {
        this.recentFuse.setCollection(nonContacts);
        _nonContacts = this.recentFuse.search(userInput);
      }

      return _nonContacts;
    });
    this.recentFuse = new _fuse.default(props.nonContacts, {
      shouldSort: true,
      threshold: 0.45,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [{
        name: 'address',
        weight: 0.5
      }]
    });
    this.contactFuse = new _fuse.default(props.contacts, {
      shouldSort: true,
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
    });
  }

  render() {
    const {
      ensResolution,
      recipient,
      userInput,
      addressBookEntryName,
      isUsingMyAccountsForRecipientSearch
    } = this.props;
    let content;

    if (recipient.address) {
      content = this.renderExplicitAddress(recipient.address, recipient.nickname);
    } else if (ensResolution) {
      content = this.renderExplicitAddress(ensResolution, addressBookEntryName || userInput);
    } else if (isUsingMyAccountsForRecipientSearch) {
      content = this.renderTransfer();
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "send__select-recipient-wrapper"
    }, this.renderDialogs(), content || this.renderMain());
  }

  renderExplicitAddress(address, name) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: address,
      className: "send__select-recipient-wrapper__group-item",
      onClick: () => this.selectRecipient(address, name)
    }, /*#__PURE__*/_react.default.createElement(_identicon.default, {
      address: address,
      diameter: 28
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "send__select-recipient-wrapper__group-item__content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "send__select-recipient-wrapper__group-item__title"
    }, name ? /*#__PURE__*/_react.default.createElement(_confusable.default, {
      input: name
    }) : (0, _send.ellipsify)(address)), name && /*#__PURE__*/_react.default.createElement("div", {
      className: "send__select-recipient-wrapper__group-item__subtitle"
    }, (0, _send.ellipsify)(address))));
  }

  renderTransfer() {
    let {
      ownedAccounts
    } = this.props;
    const {
      userInput,
      useContactListForRecipientSearch,
      isUsingMyAccountsForRecipientSearch
    } = this.props;
    const {
      t
    } = this.context;

    if (isUsingMyAccountsForRecipientSearch && userInput) {
      ownedAccounts = ownedAccounts.filter(item => item.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1 || item.address.toLowerCase().indexOf(userInput.toLowerCase()) > -1);
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "send__select-recipient-wrapper__list"
    }, /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      className: "send__select-recipient-wrapper__list__link",
      onClick: useContactListForRecipientSearch
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "send__select-recipient-wrapper__list__back-caret"
    }), t('backToAll')), /*#__PURE__*/_react.default.createElement(_recipientGroup.default, {
      label: t('myAccounts'),
      items: ownedAccounts,
      onSelect: this.selectRecipient
    }));
  }

  renderMain() {
    const {
      t
    } = this.context;
    const {
      userInput,
      ownedAccounts = [],
      addressBook,
      useMyAccountsForRecipientSearch
    } = this.props;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "send__select-recipient-wrapper__list"
    }, /*#__PURE__*/_react.default.createElement(_contactList.default, {
      addressBook: addressBook,
      searchForContacts: this.searchForContacts.bind(this),
      searchForRecents: this.searchForRecents.bind(this),
      selectRecipient: this.selectRecipient.bind(this)
    }, ownedAccounts && ownedAccounts.length > 1 && !userInput && /*#__PURE__*/_react.default.createElement(_button.default, {
      type: "link",
      className: "send__select-recipient-wrapper__list__link",
      onClick: useMyAccountsForRecipientSearch
    }, t('transferBetweenAccounts'))));
  }

  renderDialogs() {
    const {
      ensError,
      recipient,
      ensWarning
    } = this.props;
    const {
      t
    } = this.context;

    if (ensError || recipient.error && recipient.error !== 'required') {
      return /*#__PURE__*/_react.default.createElement(_dialog.default, {
        type: "error",
        className: "send__error-dialog"
      }, t(ensError !== null && ensError !== void 0 ? ensError : recipient.error));
    } else if (ensWarning || recipient.warning) {
      return /*#__PURE__*/_react.default.createElement(_dialog.default, {
        type: "warning",
        className: "send__error-dialog"
      }, t(ensWarning !== null && ensWarning !== void 0 ? ensWarning : recipient.warning));
    }

    return null;
  }

}

exports.default = AddRecipient;
(0, _defineProperty2.default)(AddRecipient, "propTypes", {
  userInput: _propTypes.default.string,
  ownedAccounts: _propTypes.default.array,
  addressBook: _propTypes.default.array,
  updateRecipient: _propTypes.default.func,
  ensResolution: _propTypes.default.string,
  ensError: _propTypes.default.string,
  ensWarning: _propTypes.default.string,
  addressBookEntryName: _propTypes.default.string,
  contacts: _propTypes.default.array,
  nonContacts: _propTypes.default.array,
  useMyAccountsForRecipientSearch: _propTypes.default.func,
  useContactListForRecipientSearch: _propTypes.default.func,
  isUsingMyAccountsForRecipientSearch: _propTypes.default.bool,
  recipient: _propTypes.default.shape({
    address: _propTypes.default.string,
    nickname: _propTypes.default.nickname,
    error: _propTypes.default.string,
    warning: _propTypes.default.string
  })
});
(0, _defineProperty2.default)(AddRecipient, "contextTypes", {
  t: _propTypes.default.func,
  metricsEvent: _propTypes.default.func
});

//# sourceMappingURL=ui/pages/send/send-content/add-recipient/add-recipient.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/add-recipient/add-recipient.component.js",}],
[4208, {"../../../components/ui/dialog":3860,"../../../components/ui/page-container/page-container-content.component":3919,"../../../helpers/constants/error-keys":3993,"./send-amount-row":4202,"./send-asset-row":4205,"./send-gas-row":4210,"./send-hex-data-row":4213,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"prop-types":2900,"react":3121}, function (require, module, exports) {
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

var _pageContainerContent = _interopRequireDefault(require("../../../components/ui/page-container/page-container-content.component"));

var _dialog = _interopRequireDefault(require("../../../components/ui/dialog"));

var _errorKeys = require("../../../helpers/constants/error-keys");

var _sendAmountRow = _interopRequireDefault(require("./send-amount-row"));

var _sendHexDataRow = _interopRequireDefault(require("./send-hex-data-row"));

var _sendAssetRow = _interopRequireDefault(require("./send-asset-row"));

var _sendGasRow = _interopRequireDefault(require("./send-gas-row"));

class SendContent extends _react.Component {
  render() {
    const {
      warning,
      error,
      gasIsExcessive,
      isEthGasPrice,
      noGasPrice,
      isAssetSendable,
      networkAndAccountSupports1559
    } = this.props;
    let gasError;
    if (gasIsExcessive) gasError = _errorKeys.GAS_PRICE_EXCESSIVE_ERROR_KEY;else if (noGasPrice) gasError = _errorKeys.GAS_PRICE_FETCH_FAILURE_ERROR_KEY;
    return /*#__PURE__*/_react.default.createElement(_pageContainerContent.default, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "send-v2__form"
    }, gasError && this.renderError(gasError), isEthGasPrice && this.renderWarning(_errorKeys.ETH_GAS_PRICE_FETCH_WARNING_KEY), error && this.renderError(error), warning && this.renderWarning(), this.maybeRenderAddContact(), /*#__PURE__*/_react.default.createElement(_sendAssetRow.default, null), /*#__PURE__*/_react.default.createElement(_sendAmountRow.default, null), !networkAndAccountSupports1559 && /*#__PURE__*/_react.default.createElement(_sendGasRow.default, null), this.props.showHexData && /*#__PURE__*/_react.default.createElement(_sendHexDataRow.default, null)));
  }

  maybeRenderAddContact() {
    const {
      t
    } = this.context;
    const {
      isOwnedAccount,
      showAddToAddressBookModal,
      contact = {}
    } = this.props;

    if (isOwnedAccount || contact.name) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement(_dialog.default, {
      type: "message",
      className: "send__dialog",
      onClick: showAddToAddressBookModal
    }, t('newAccountDetectedDialogMessage'));
  }

  renderWarning(gasWarning = '') {
    const {
      t
    } = this.context;
    const {
      warning
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(_dialog.default, {
      type: "warning",
      className: "send__error-dialog"
    }, gasWarning === '' ? t(warning) : t(gasWarning));
  }

  renderError(error) {
    const {
      t
    } = this.context;
    return /*#__PURE__*/_react.default.createElement(_dialog.default, {
      type: "error",
      className: "send__error-dialog"
    }, t(error));
  }

}

exports.default = SendContent;
(0, _defineProperty2.default)(SendContent, "contextTypes", {
  t: _propTypes.default.func
});
(0, _defineProperty2.default)(SendContent, "propTypes", {
  isAssetSendable: _propTypes.default.bool,
  showAddToAddressBookModal: _propTypes.default.func,
  showHexData: _propTypes.default.bool,
  contact: _propTypes.default.object,
  isOwnedAccount: _propTypes.default.bool,
  warning: _propTypes.default.string,
  error: _propTypes.default.string,
  gasIsExcessive: _propTypes.default.bool.isRequired,
  isEthGasPrice: _propTypes.default.bool,
  noGasPrice: _propTypes.default.bool,
  networkAndAccountSupports1559: _propTypes.default.bool
});

//# sourceMappingURL=ui/pages/send/send-content/send-content.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/send/send-content/send-content.component.js",}],
[3759, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

class MultipleNotifications extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "state", {
      showAll: false
    });
  }

  render() {
    const {
      showAll
    } = this.state;
    const {
      children,
      classNames
    } = this.props;
    const childrenToRender = children.filter(Boolean);

    if (childrenToRender.length === 0) {
      return null;
    }

    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)(...classNames, {
        'home-notification-wrapper--show-all': showAll,
        'home-notification-wrapper--show-first': !showAll
      })
    }, childrenToRender, /*#__PURE__*/_react.default.createElement("div", {
      className: "home-notification-wrapper__i-container",
      onClick: () => this.setState({
        showAll: !showAll
      })
    }, childrenToRender.length > 1 ? /*#__PURE__*/_react.default.createElement("i", {
      className: (0, _classnames.default)('fa fa-sm fa-sort-amount-asc', {
        flipped: !showAll
      })
    }) : null));
  }

}

exports.default = MultipleNotifications;
(0, _defineProperty2.default)(MultipleNotifications, "defaultProps", {
  children: [],
  classNames: []
});
(0, _defineProperty2.default)(MultipleNotifications, "propTypes", {
  children: _propTypes.default.array,
  classNames: _propTypes.default.array
});

//# sourceMappingURL=ui/components/app/multiple-notifications/multiple-notifications.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/multiple-notifications/multiple-notifications.component.js",}],
[3684, {"../../ui/button":3842,"../../ui/check-box":3846,"../../ui/tooltip":3960,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _button = _interopRequireDefault(require("../../ui/button"));

var _checkBox = _interopRequireDefault(require("../../ui/check-box"));

var _tooltip = _interopRequireDefault(require("../../ui/tooltip"));

const HomeNotification = ({
  acceptText,
  checkboxText,
  checkboxTooltipText,
  classNames = [],
  descriptionText,
  ignoreText,
  infoText,
  onAccept,
  onIgnore
}) => {
  const [checkboxState, setCheckBoxState] = (0, _react.useState)(false);

  const checkboxElement = checkboxText && /*#__PURE__*/_react.default.createElement(_checkBox.default, {
    id: "homeNotification_checkbox",
    checked: checkboxState,
    className: "home-notification__checkbox",
    onClick: () => setCheckBoxState(checked => !checked)
  });

  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('home-notification', ...classNames)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "home-notification__content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "home-notification__content-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "home-notification__text"
  }, descriptionText)), infoText ? /*#__PURE__*/_react.default.createElement(_tooltip.default, {
    position: "top",
    title: infoText,
    wrapperClassName: "home-notification__tooltip-wrapper"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fa fa-info-circle"
  })) : null), /*#__PURE__*/_react.default.createElement("div", {
    className: "home-notification__buttons"
  }, onAccept && acceptText ? /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "primary",
    className: "home-notification__accept-button",
    onClick: onAccept
  }, acceptText) : null, onIgnore && ignoreText ? /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "secondary",
    className: "home-notification__ignore-button" // Some onIgnore handlers use the checkboxState to determine whether
    // to disable the notification
    ,
    onClick: () => onIgnore(checkboxState)
  }, ignoreText) : null, checkboxText ? /*#__PURE__*/_react.default.createElement("div", {
    className: "home-notification__checkbox-wrapper"
  }, checkboxTooltipText ? /*#__PURE__*/_react.default.createElement(_tooltip.default, {
    position: "top",
    title: checkboxTooltipText,
    wrapperClassName: "home-notification__checkbox-label-tooltip"
  }, checkboxElement) : checkboxElement, /*#__PURE__*/_react.default.createElement("label", {
    className: "home-notification__checkbox-label",
    htmlFor: "homeNotification_checkbox"
  }, checkboxText)) : null));
};

HomeNotification.propTypes = {
  acceptText: _propTypes.default.node,
  checkboxText: _propTypes.default.node,
  checkboxTooltipText: _propTypes.default.node,
  classNames: _propTypes.default.array,
  descriptionText: _propTypes.default.node.isRequired,
  ignoreText: _propTypes.default.node,
  infoText: _propTypes.default.node,
  onAccept: _propTypes.default.func,
  onIgnore: _propTypes.default.func
};
var _default = HomeNotification;
exports.default = _default;

//# sourceMappingURL=ui/components/app/home-notification/home-notification.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/home-notification/home-notification.component.js",}],
[3926, {"../../../hooks/useI18nContext":4030,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121,"react-dom":3037}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _useI18nContext = require("../../../hooks/useI18nContext");

const Popover = ({
  title,
  subtitle = '',
  children,
  footer,
  footerClassName,
  onBack,
  onClose,
  className,
  contentClassName,
  showArrow,
  CustomBackground,
  popoverRef,
  centerTitle
}) => {
  const t = (0, _useI18nContext.useI18nContext)();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "popover-container"
  }, CustomBackground ? /*#__PURE__*/_react.default.createElement(CustomBackground, {
    onClose: onClose
  }) : /*#__PURE__*/_react.default.createElement("div", {
    className: "popover-bg",
    onClick: onClose
  }), /*#__PURE__*/_react.default.createElement("section", {
    className: (0, _classnames.default)('popover-wrap', className),
    ref: popoverRef
  }, showArrow ? /*#__PURE__*/_react.default.createElement("div", {
    className: "popover-arrow"
  }) : null, /*#__PURE__*/_react.default.createElement("header", {
    className: "popover-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('popover-header__title', centerTitle ? 'center' : '')
  }, /*#__PURE__*/_react.default.createElement("h2", {
    title: title
  }, onBack ? /*#__PURE__*/_react.default.createElement("button", {
    className: "fas fa-chevron-left popover-header__button",
    title: t('back'),
    onClick: onBack
  }) : null, title), onClose ? /*#__PURE__*/_react.default.createElement("button", {
    className: "fas fa-times popover-header__button",
    title: t('close'),
    "data-testid": "popover-close",
    onClick: onClose
  }) : null), subtitle ? /*#__PURE__*/_react.default.createElement("p", {
    className: "popover-header__subtitle"
  }, subtitle) : null), children ? /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('popover-content', contentClassName)
  }, children) : null, footer ? /*#__PURE__*/_react.default.createElement("footer", {
    className: (0, _classnames.default)('popover-footer', footerClassName)
  }, footer) : null));
};

Popover.propTypes = {
  title: _propTypes.default.string.isRequired,
  subtitle: _propTypes.default.string,
  children: _propTypes.default.node,
  footer: _propTypes.default.node,
  footerClassName: _propTypes.default.string,
  onBack: _propTypes.default.func,
  onClose: _propTypes.default.func,
  CustomBackground: _propTypes.default.func,
  contentClassName: _propTypes.default.string,
  className: _propTypes.default.string,
  showArrow: _propTypes.default.bool,
  popoverRef: _propTypes.default.shape({
    current: _propTypes.default.instanceOf(window.Element)
  }),
  centerTitle: _propTypes.default.bool
};

class PopoverPortal extends _react.PureComponent {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "rootNode", document.getElementById('popover-content'));
    (0, _defineProperty2.default)(this, "instanceNode", document.createElement('div'));
  }

  componentDidMount() {
    if (!this.rootNode) {
      return;
    }

    this.rootNode.appendChild(this.instanceNode);
  }

  componentWillUnmount() {
    if (!this.rootNode) {
      return;
    }

    this.rootNode.removeChild(this.instanceNode);
  }

  render() {
    const children = /*#__PURE__*/_react.default.createElement(Popover, this.props);

    return this.rootNode ? /*#__PURE__*/_reactDom.default.createPortal(children, this.instanceNode) : children;
  }

}

exports.default = PopoverPortal;
(0, _defineProperty2.default)(PopoverPortal, "propTypes", Popover.propTypes);

//# sourceMappingURL=ui/components/ui/popover/popover.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/ui/popover/popover.component.js",}],
[3772, {"../../../helpers/constants/design-system":3992,"../../../helpers/constants/routes":3995,"../../../hooks/useI18nContext":4030,"../../ui/box":3838,"../../ui/button":3842,"../../ui/popover":3925,"../../ui/typography":3964,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RecoveryPhraseReminder;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _useI18nContext = require("../../../hooks/useI18nContext");

var _box = _interopRequireDefault(require("../../ui/box"));

var _button = _interopRequireDefault(require("../../ui/button"));

var _popover = _interopRequireDefault(require("../../ui/popover"));

var _typography = _interopRequireDefault(require("../../ui/typography"));

var _designSystem = require("../../../helpers/constants/design-system");

var _routes = require("../../../helpers/constants/routes");

// Components
// Helpers
function RecoveryPhraseReminder({
  onConfirm,
  hasBackedUp
}) {
  const t = (0, _useI18nContext.useI18nContext)();
  const history = (0, _reactRouterDom.useHistory)();

  const handleBackUp = () => {
    history.push(_routes.INITIALIZE_BACKUP_SEED_PHRASE_ROUTE);
  };

  return /*#__PURE__*/_react.default.createElement(_popover.default, {
    centerTitle: true,
    title: t('recoveryPhraseReminderTitle')
  }, /*#__PURE__*/_react.default.createElement(_box.default, {
    padding: [0, 4, 6, 4],
    className: "recovery-phrase-reminder"
  }, /*#__PURE__*/_react.default.createElement(_typography.default, {
    color: _designSystem.COLORS.BLACK,
    align: _designSystem.TEXT_ALIGN.CENTER,
    variant: _designSystem.TYPOGRAPHY.Paragraph,
    boxProps: {
      marginTop: 0,
      marginBottom: 4
    }
  }, t('recoveryPhraseReminderSubText')), /*#__PURE__*/_react.default.createElement(_box.default, {
    margin: [4, 0, 8, 0]
  }, /*#__PURE__*/_react.default.createElement("ul", {
    className: "recovery-phrase-reminder__list"
  }, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_typography.default, {
    tag: "span",
    color: _designSystem.COLORS.BLACK,
    fontWeight: _designSystem.FONT_WEIGHT.BOLD
  }, t('recoveryPhraseReminderItemOne'))), /*#__PURE__*/_react.default.createElement("li", null, t('recoveryPhraseReminderItemTwo')), /*#__PURE__*/_react.default.createElement("li", null, hasBackedUp ? t('recoveryPhraseReminderHasBackedUp') : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, t('recoveryPhraseReminderHasNotBackedUp'), /*#__PURE__*/_react.default.createElement(_box.default, {
    display: _designSystem.DISPLAY.INLINE_BLOCK,
    marginLeft: 1
  }, /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "link",
    onClick: handleBackUp,
    style: {
      fontSize: 'inherit',
      padding: 0
    }
  }, t('recoveryPhraseReminderBackupStart'))))))), /*#__PURE__*/_react.default.createElement(_box.default, {
    justifyContent: _designSystem.JUSTIFY_CONTENT.CENTER
  }, /*#__PURE__*/_react.default.createElement(_box.default, {
    width: _designSystem.BLOCK_SIZES.TWO_FIFTHS
  }, /*#__PURE__*/_react.default.createElement(_button.default, {
    rounded: true,
    type: "primary",
    onClick: onConfirm
  }, t('recoveryPhraseReminderConfirm'))))));
}

RecoveryPhraseReminder.propTypes = {
  hasBackedUp: _propTypes.default.bool.isRequired,
  onConfirm: _propTypes.default.func.isRequired
};

//# sourceMappingURL=ui/components/app/recovery-phrase-reminder/recovery-phrase-reminder.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/recovery-phrase-reminder/recovery-phrase-reminder.js",}],
[3833, {"../../../../shared/notifications":3610,"../../../contexts/i18n":3970,"../../../ducks/metamask/metamask":3985,"../../../helpers/constants/design-system":3992,"../../../helpers/constants/routes":3995,"../../../hooks/useEqualityCheck":4026,"../../../selectors":4326,"../../../store/actions":4331,"../../ui/button":3842,"../../ui/popover":3925,"../../ui/typography":3964,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"classnames":1449,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WhatsNewPopup;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _reactRedux = require("react-redux");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _metamask = require("../../../ducks/metamask/metamask");

var _i18n = require("../../../contexts/i18n");

var _useEqualityCheck = require("../../../hooks/useEqualityCheck");

var _button = _interopRequireDefault(require("../../ui/button"));

var _popover = _interopRequireDefault(require("../../ui/popover"));

var _typography = _interopRequireDefault(require("../../ui/typography"));

var _actions = require("../../../store/actions");

var _notifications = require("../../../../shared/notifications");

var _selectors = require("../../../selectors");

var _routes = require("../../../helpers/constants/routes");

var _designSystem = require("../../../helpers/constants/design-system");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function getActionFunctionById(id, history) {
  const actionFunctions = {
    2: () => {
      global.platform.openTab({
        url: 'https://survey.alchemer.com/s3/6173069/MetaMask-Extension-NPS-January-2021'
      });
    },
    3: () => {
      global.platform.openTab({
        url: 'https://community.metamask.io/t/about-the-security-category/72'
      });
    },
    4: () => {
      (0, _actions.updateViewedNotifications)({
        4: true
      });
      history.push(_routes.BUILD_QUOTE_ROUTE);
    },
    5: () => {
      (0, _actions.updateViewedNotifications)({
        5: true
      });
      global.platform.openTab({
        url: 'https://metamask.zendesk.com/hc/en-us/articles/360060826432'
      });
    }
  };
  return actionFunctions[id];
}

const renderDescription = description => {
  if (!Array.isArray(description)) {
    return /*#__PURE__*/_react.default.createElement(_typography.default, {
      variant: _designSystem.TYPOGRAPHY.Paragraph
    }, description);
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, description.map((piece, index) => {
    const isLast = index === description.length - 1;
    return /*#__PURE__*/_react.default.createElement(_typography.default, {
      key: `item-${index}`,
      variant: _designSystem.TYPOGRAPHY.Paragraph,
      boxProps: {
        marginBottom: isLast ? 0 : 2
      }
    }, piece);
  }));
};

const renderFirstNotification = (notification, idRefMap, history, isLast) => {
  const {
    id,
    date,
    title,
    description,
    image,
    actionText
  } = notification;
  const actionFunction = getActionFunctionById(id, history);

  const imageComponent = image && /*#__PURE__*/_react.default.createElement("img", {
    className: "whats-new-popup__notification-image",
    src: image.src,
    height: image.height,
    width: image.width
  });

  const placeImageBelowDescription = image === null || image === void 0 ? void 0 : image.placeImageBelowDescription;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('whats-new-popup__notification whats-new-popup__first-notification', {
      'whats-new-popup__last-notification': isLast
    }),
    key: `whats-new-popop-notification-${id}`
  }, !placeImageBelowDescription && imageComponent, /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__notification-title"
  }, title), /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__description-and-date"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__notification-description"
  }, renderDescription(description)), /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__notification-date"
  }, date)), placeImageBelowDescription && imageComponent, actionText && /*#__PURE__*/_react.default.createElement(_button.default, {
    type: "secondary",
    className: "whats-new-popup__button",
    rounded: true,
    onClick: actionFunction
  }, actionText), /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__intersection-observable",
    ref: idRefMap[id]
  }));
};

const renderSubsequentNotification = (notification, idRefMap, history, isLast) => {
  const {
    id,
    date,
    title,
    description,
    actionText
  } = notification;
  const actionFunction = getActionFunctionById(id, history);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)('whats-new-popup__notification', {
      'whats-new-popup__last-notification': isLast
    }),
    key: `whats-new-popop-notification-${id}`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__notification-title"
  }, title), /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__description-and-date"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__notification-description"
  }, renderDescription(description)), /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__notification-date"
  }, date)), actionText && /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__link",
    onClick: actionFunction
  }, `${actionText} >`), /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__intersection-observable",
    ref: idRefMap[id]
  }));
};

function WhatsNewPopup({
  onClose
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const history = (0, _reactRouterDom.useHistory)();
  const notifications = (0, _reactRedux.useSelector)(_selectors.getSortedNotificationsToShow);
  const locale = (0, _reactRedux.useSelector)(_metamask.getCurrentLocale);
  const [seenNotifications, setSeenNotifications] = (0, _react.useState)({});
  const popoverRef = (0, _react.useRef)();
  const memoizedNotifications = (0, _useEqualityCheck.useEqualityCheck)(notifications);
  const idRefMap = (0, _react.useMemo)(() => memoizedNotifications.reduce((_idRefMap, notification) => _objectSpread(_objectSpread({}, _idRefMap), {}, {
    [notification.id]: /*#__PURE__*/_react.default.createRef()
  }), {}), [memoizedNotifications]);
  (0, _react.useEffect)(() => {
    const observer = new window.IntersectionObserver((entries, _observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const [id, ref] = Object.entries(idRefMap).find(([_, _ref]) => _ref.current.isSameNode(entry.target));
          setSeenNotifications(_seenNotifications => _objectSpread(_objectSpread({}, _seenNotifications), {}, {
            [id]: true
          }));

          _observer.unobserve(ref.current);
        }
      });
    }, {
      root: popoverRef.current,
      threshold: 1.0
    });
    Object.values(idRefMap).forEach(ref => {
      observer.observe(ref.current);
    });
    return () => {
      observer.disconnect();
    };
  }, [idRefMap, setSeenNotifications]);
  return /*#__PURE__*/_react.default.createElement(_popover.default, {
    className: "whats-new-popup__popover",
    title: t('whatsNew'),
    onClose: () => {
      (0, _actions.updateViewedNotifications)(seenNotifications);
      onClose();
    },
    popoverRef: popoverRef
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "whats-new-popup__notifications"
  }, notifications.map(({
    id
  }, index) => {
    const notification = (0, _notifications.getTranslatedUINoficiations)(t, locale)[id];
    const isLast = index === notifications.length - 1; // Display the swaps notification with full image

    return index === 0 || id === 1 ? renderFirstNotification(notification, idRefMap, history, isLast) : renderSubsequentNotification(notification, idRefMap, history, isLast);
  })));
}

WhatsNewPopup.propTypes = {
  onClose: _propTypes.default.func.isRequired
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=ui/components/app/whats-new-popup/whats-new-popup.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/whats-new-popup/whats-new-popup.js",}],
[4105, {"../../ducks/history/history":3982,"../../helpers/constants/routes":3995,"../../selectors":4326,"../../store/actions":4331,"./connected-sites.component":4104,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var _actions = require("../../store/actions");

var _selectors = require("../../selectors");

var _routes = require("../../helpers/constants/routes");

var _history = require("../../ducks/history/history");

var _connectedSites = _interopRequireDefault(require("./connected-sites.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const mapStateToProps = state => {
  var _permittedAccountsByO;

  const {
    openMetaMaskTabs
  } = state.appState;
  const {
    id
  } = state.activeTab;
  const connectedDomains = (0, _selectors.getConnectedDomainsForSelectedAddress)(state);
  const originOfCurrentTab = (0, _selectors.getOriginOfCurrentTab)(state);
  const permittedAccountsByOrigin = (0, _selectors.getPermittedAccountsByOrigin)(state);
  const selectedAddress = (0, _selectors.getSelectedAddress)(state);
  const currentTabHasNoAccounts = !((_permittedAccountsByO = permittedAccountsByOrigin[originOfCurrentTab]) !== null && _permittedAccountsByO !== void 0 && _permittedAccountsByO.length);
  let tabToConnect;

  if (originOfCurrentTab && currentTabHasNoAccounts && !openMetaMaskTabs[id]) {
    tabToConnect = {
      origin: originOfCurrentTab
    };
  }

  return {
    accountLabel: (0, _selectors.getCurrentAccountWithSendEtherInfo)(state).name,
    connectedDomains,
    domains: (0, _selectors.getPermissionDomains)(state),
    domainHostCount: (0, _selectors.getPermissionsMetadataHostCounts)(state),
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    permittedAccountsByOrigin,
    selectedAddress,
    tabToConnect
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getOpenMetamaskTabsIds: () => dispatch((0, _actions.getOpenMetamaskTabsIds)()),
    disconnectAccount: (domainKey, address) => {
      dispatch((0, _actions.removePermittedAccount)(domainKey, address));
    },
    disconnectAllAccounts: (domainKey, domain) => {
      const permissionMethodNames = domain.permissions.map(({
        parentCapability
      }) => parentCapability);
      dispatch((0, _actions.removePermissionsFor)({
        [domainKey]: permissionMethodNames
      }));
    },
    requestAccountsPermissionWithId: origin => dispatch((0, _actions.requestAccountsPermissionWithId)(origin))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    connectedDomains,
    domains,
    mostRecentOverviewPage,
    selectedAddress,
    tabToConnect
  } = stateProps;
  const {
    disconnectAccount,
    disconnectAllAccounts,
    // eslint-disable-next-line no-shadow
    requestAccountsPermissionWithId
  } = dispatchProps;
  const {
    history
  } = ownProps;

  const closePopover = () => history.push(mostRecentOverviewPage);

  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, ownProps), stateProps), dispatchProps), {}, {
    closePopover,
    disconnectAccount: domainKey => {
      disconnectAccount(domainKey, selectedAddress);

      if (connectedDomains.length === 1) {
        closePopover();
      }
    },
    disconnectAllAccounts: domainKey => {
      disconnectAllAccounts(domainKey, domains[domainKey]);

      if (connectedDomains.length === 1) {
        closePopover();
      }
    },
    requestAccountsPermission: async () => {
      const id = await requestAccountsPermissionWithId(tabToConnect.origin);
      history.push(`${_routes.CONNECT_ROUTE}/${id}`);
    }
  });
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(_connectedSites.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/connected-sites/connected-sites.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/connected-sites/connected-sites.container.js",}],
[4102, {"../../ducks/history/history":3982,"../../helpers/utils/util":4020,"../../selectors":4326,"../../store/actions":4331,"./connected-accounts.component":4101,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactRedux = require("react-redux");

var _selectors = require("../../selectors");

var _util = require("../../helpers/utils/util");

var _actions = require("../../store/actions");

var _history = require("../../ducks/history/history");

var _connectedAccounts = _interopRequireDefault(require("./connected-accounts.component"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const mapStateToProps = state => {
  const {
    activeTab
  } = state;
  const accountToConnect = (0, _selectors.getAccountToConnectToActiveTab)(state);
  const connectedAccounts = (0, _selectors.getOrderedConnectedAccountsForActiveTab)(state);
  const permissions = (0, _selectors.getPermissionsForActiveTab)(state);
  const selectedAddress = (0, _selectors.getSelectedAddress)(state);
  const isActiveTabExtension = (0, _util.isExtensionUrl)(activeTab);
  return {
    accountToConnect,
    isActiveTabExtension,
    activeTabOrigin: activeTab.origin,
    connectedAccounts,
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state),
    permissions,
    selectedAddress
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addPermittedAccount: (origin, address) => dispatch((0, _actions.addPermittedAccount)(origin, address)),
    removePermittedAccount: (origin, address) => dispatch((0, _actions.removePermittedAccount)(origin, address)),
    setSelectedAddress: address => dispatch((0, _actions.setSelectedAddress)(address))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    activeTabOrigin
  } = stateProps;
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, ownProps), stateProps), dispatchProps), {}, {
    connectAccount: address => dispatchProps.addPermittedAccount(activeTabOrigin, address),
    removePermittedAccount: address => dispatchProps.removePermittedAccount(activeTabOrigin, address)
  });
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(_connectedAccounts.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/connected-accounts/connected-accounts.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/connected-accounts/connected-accounts.container.js",}],
[3693, {"../../../../app/scripts/lib/util":78,"../../../../shared/constants/app":3591,"../../../helpers/constants/routes":3995,"../../../hooks/useI18nContext":4030,"../../../hooks/useMetricEvent":4032,"../../../selectors":4326,"../connected-status-indicator":3658,"../selected-account":3773,"./account-options-menu":3691,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"extensionizer":1869,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MenuBar;

var _react = _interopRequireWildcard(require("react"));

var _extensionizer = _interopRequireDefault(require("extensionizer"));

var _reactRouterDom = require("react-router-dom");

var _reactRedux = require("react-redux");

var _selectedAccount = _interopRequireDefault(require("../selected-account"));

var _connectedStatusIndicator = _interopRequireDefault(require("../connected-status-indicator"));

var _util = require("../../../../app/scripts/lib/util");

var _app = require("../../../../shared/constants/app");

var _routes = require("../../../helpers/constants/routes");

var _useI18nContext = require("../../../hooks/useI18nContext");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _selectors = require("../../../selectors");

var _accountOptionsMenu = _interopRequireDefault(require("./account-options-menu"));

function MenuBar() {
  const t = (0, _useI18nContext.useI18nContext)();
  const openAccountOptionsEvent = (0, _useMetricEvent.useMetricEvent)({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Opened Account Options'
    }
  });
  const history = (0, _reactRouterDom.useHistory)();
  const [accountOptionsButtonElement, setAccountOptionsButtonElement] = (0, _react.useState)(null);
  const [accountOptionsMenuOpen, setAccountOptionsMenuOpen] = (0, _react.useState)(false);
  const origin = (0, _reactRedux.useSelector)(_selectors.getOriginOfCurrentTab);

  const showStatus = (0, _util.getEnvironmentType)() === _app.ENVIRONMENT_TYPE_POPUP && origin && origin !== _extensionizer.default.runtime.id;

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "menu-bar"
  }, showStatus ? /*#__PURE__*/_react.default.createElement(_connectedStatusIndicator.default, {
    onClick: () => history.push(_routes.CONNECTED_ACCOUNTS_ROUTE)
  }) : null, /*#__PURE__*/_react.default.createElement(_selectedAccount.default, null), /*#__PURE__*/_react.default.createElement("button", {
    className: "fas fa-ellipsis-v menu-bar__account-options",
    "data-testid": "account-options-menu-button",
    ref: setAccountOptionsButtonElement,
    title: t('accountOptions'),
    onClick: () => {
      openAccountOptionsEvent();
      setAccountOptionsMenuOpen(true);
    }
  }), accountOptionsMenuOpen && /*#__PURE__*/_react.default.createElement(_accountOptionsMenu.default, {
    anchorElement: accountOptionsButtonElement,
    onClose: () => setAccountOptionsMenuOpen(false)
  }));
}

//# sourceMappingURL=ui/components/app/menu-bar/menu-bar.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/menu-bar/menu-bar.js",}],
[3628, {"../../../ducks/metamask/metamask":3985,"../../../helpers/constants/common":3990,"../../../helpers/constants/design-system":3992,"../../../helpers/constants/routes":3995,"../../../hooks/useCurrencyDisplay":4024,"../../../hooks/useI18nContext":4030,"../../../hooks/useMetricEvent":4032,"../../../hooks/useUserPreferencedCurrency":4046,"../../../selectors":4326,"../../ui/box/box":3837,"../../ui/typography/typography":3965,"../asset-list-item":3627,"../import-token-link":3687,"../token-list":3793,"@babel/runtime/helpers/interopRequireDefault":186,"prop-types":2900,"react":3121,"react-redux":3088,"react-router-dom":3099}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _importTokenLink = _interopRequireDefault(require("../import-token-link"));

var _tokenList = _interopRequireDefault(require("../token-list"));

var _routes = require("../../../helpers/constants/routes");

var _assetListItem = _interopRequireDefault(require("../asset-list-item"));

var _common = require("../../../helpers/constants/common");

var _useMetricEvent = require("../../../hooks/useMetricEvent");

var _useUserPreferencedCurrency = require("../../../hooks/useUserPreferencedCurrency");

var _selectors = require("../../../selectors");

var _metamask = require("../../../ducks/metamask/metamask");

var _useCurrencyDisplay = require("../../../hooks/useCurrencyDisplay");

var _typography = _interopRequireDefault(require("../../ui/typography/typography"));

var _box = _interopRequireDefault(require("../../ui/box/box"));

var _designSystem = require("../../../helpers/constants/design-system");

var _useI18nContext = require("../../../hooks/useI18nContext");

const AssetList = ({
  onClickAsset
}) => {
  const t = (0, _useI18nContext.useI18nContext)();
  const history = (0, _reactRouterDom.useHistory)();
  const selectedAccountBalance = (0, _reactRedux.useSelector)(state => (0, _selectors.getCurrentAccountWithSendEtherInfo)(state).balance);
  const nativeCurrency = (0, _reactRedux.useSelector)(_metamask.getNativeCurrency);
  const showFiat = (0, _reactRedux.useSelector)(_selectors.getShouldShowFiat);
  const selectTokenEvent = (0, _useMetricEvent.useMetricEvent)({
    eventOpts: {
      category: 'Navigation',
      action: 'Token Menu',
      name: 'Clicked Token'
    }
  });
  const addTokenEvent = (0, _useMetricEvent.useMetricEvent)({
    eventOpts: {
      category: 'Navigation',
      action: 'Token Menu',
      name: 'Clicked "Add Token"'
    }
  });
  const {
    currency: primaryCurrency,
    numberOfDecimals: primaryNumberOfDecimals
  } = (0, _useUserPreferencedCurrency.useUserPreferencedCurrency)(_common.PRIMARY, {
    ethNumberOfDecimals: 4
  });
  const {
    currency: secondaryCurrency,
    numberOfDecimals: secondaryNumberOfDecimals
  } = (0, _useUserPreferencedCurrency.useUserPreferencedCurrency)(_common.SECONDARY, {
    ethNumberOfDecimals: 4
  });
  const [, primaryCurrencyProperties] = (0, _useCurrencyDisplay.useCurrencyDisplay)(selectedAccountBalance, {
    numberOfDecimals: primaryNumberOfDecimals,
    currency: primaryCurrency
  });
  const [secondaryCurrencyDisplay, secondaryCurrencyProperties] = (0, _useCurrencyDisplay.useCurrencyDisplay)(selectedAccountBalance, {
    numberOfDecimals: secondaryNumberOfDecimals,
    currency: secondaryCurrency
  });
  const primaryTokenImage = (0, _reactRedux.useSelector)(_selectors.getNativeCurrencyImage);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_tokenList.default, {
    onTokenClick: tokenAddress => {
      onClickAsset(tokenAddress);
      selectTokenEvent();
    }
  }));
};

AssetList.propTypes = {
  onClickAsset: _propTypes.default.func.isRequired
};
var _default = AssetList;
exports.default = _default;

//# sourceMappingURL=ui/components/app/asset-list/asset-list.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/components/app/asset-list/asset-list.js",}],
[4082, {"../../ducks/metamask/metamask":3985,"../../helpers/utils/conversions.util":4009,"../../helpers/utils/token-util":4017,"../../helpers/utils/transactions.util":4018,"../../helpers/utils/util":4020,"../../selectors":4326,"./confirm-token-transaction-base.component":4081,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reactRouterDom = require("react-router-dom");

var _selectors = require("../../selectors");

var _metamask = require("../../ducks/metamask/metamask");

var _transactions = require("../../helpers/utils/transactions.util");

var _tokenUtil = require("../../helpers/utils/token-util");

var _conversions = require("../../helpers/utils/conversions.util");

var _util = require("../../helpers/utils/util");

var _confirmTokenTransactionBase = _interopRequireDefault(require("./confirm-token-transaction-base.component"));

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params = {}
    }
  } = ownProps;
  const {
    id: paramsTransactionId
  } = params;
  const {
    confirmTransaction,
    metamask: {
      currentCurrency,
      conversionRate,
      currentNetworkTxList,
      nativeCurrency
    }
  } = state;
  const {
    txData: {
      id: transactionId,
      txParams: {
        to: tokenAddress,
        data
      } = {}
    } = {}
  } = confirmTransaction;
  const transaction = currentNetworkTxList.find(({
    id
  }) => id === (Number(paramsTransactionId) || transactionId)) || {};
  const {
    ethTransactionTotal,
    fiatTransactionTotal,
    hexMaximumTransactionFee
  } = (0, _selectors.transactionFeeSelector)(state, transaction);
  const tokens = (0, _metamask.getTokens)(state);
  const currentToken = tokens === null || tokens === void 0 ? void 0 : tokens.find(({
    address
  }) => (0, _util.isEqualCaseInsensitive)(tokenAddress, address));
  const {
    decimals,
    symbol: tokenSymbol,
    image: tokenImage
  } = currentToken || {};
  const ethTransactionTotalMaxAmount = Number((0, _conversions.hexWEIToDecETH)(hexMaximumTransactionFee)).toFixed(6);
  const tokenData = (0, _transactions.getTokenData)(data);
  const tokenValue = (0, _tokenUtil.getTokenValueParam)(tokenData);
  const toAddress = (0, _tokenUtil.getTokenAddressParam)(tokenData);
  const tokenAmount = tokenData && (0, _tokenUtil.calcTokenAmount)(tokenValue, decimals).toFixed();
  const contractExchangeRate = (0, _selectors.contractExchangeRateSelector)(state);
  return {
    toAddress,
    tokenAddress,
    tokenImage,
    tokenAmount,
    tokenSymbol,
    currentCurrency,
    conversionRate,
    contractExchangeRate,
    fiatTransactionTotal,
    ethTransactionTotal,
    ethTransactionTotalMaxAmount,
    nativeCurrency
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps))(_confirmTokenTransactionBase.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-token-transaction-base/confirm-token-transaction-base.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-token-transaction-base/confirm-token-transaction-base.container.js",}],
[4081, {"../../components/app/user-preferenced-currency-display":3820,"../../contexts/i18n":3970,"../../helpers/constants/common":3990,"../../helpers/utils/confirm-tx.util":4008,"../../helpers/utils/conversions.util":4009,"../confirm-transaction-base":4086,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"bignumber.js":1351,"prop-types":2900,"react":3121}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ConfirmTokenTransactionBase;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _i18n = require("../../contexts/i18n");

var _confirmTransactionBase = _interopRequireDefault(require("../confirm-transaction-base"));

var _userPreferencedCurrencyDisplay = _interopRequireDefault(require("../../components/app/user-preferenced-currency-display"));

var _confirmTx = require("../../helpers/utils/confirm-tx.util");

var _conversions = require("../../helpers/utils/conversions.util");

var _common = require("../../helpers/constants/common");

function ConfirmTokenTransactionBase({
  toAddress,
  tokenAddress,
  tokenImage,
  tokenAmount = '0',
  tokenSymbol,
  fiatTransactionTotal,
  ethTransactionTotal,
  ethTransactionTotalMaxAmount,
  contractExchangeRate,
  conversionRate,
  currentCurrency,
  nativeCurrency,
  onEdit
}) {
  const t = (0, _react.useContext)(_i18n.I18nContext);
  const hexWeiValue = (0, _react.useMemo)(() => {
    if (tokenAmount === '0' || !contractExchangeRate) {
      return '0';
    }

    const decimalEthValue = new _bignumber.default(tokenAmount).times(new _bignumber.default(contractExchangeRate)).toFixed();
    return (0, _conversions.getWeiHexFromDecimalValue)({
      value: decimalEthValue,
      fromCurrency: _common.ETH,
      fromDenomination: _common.ETH
    });
  }, [tokenAmount, contractExchangeRate]);
  const secondaryTotalTextOverride = (0, _react.useMemo)(() => {
    if (typeof contractExchangeRate === 'undefined') {
      return (0, _confirmTx.formatCurrency)(fiatTransactionTotal, currentCurrency);
    }

    const fiatTransactionAmount = (0, _confirmTx.convertTokenToFiat)({
      value: tokenAmount,
      toCurrency: currentCurrency,
      conversionRate,
      contractExchangeRate
    });
    const fiatTotal = (0, _confirmTx.addFiat)(fiatTransactionAmount, fiatTransactionTotal);
    const roundedFiatTotal = (0, _confirmTx.roundExponential)(fiatTotal);
    return (0, _confirmTx.formatCurrency)(roundedFiatTotal, currentCurrency);
  }, [currentCurrency, conversionRate, contractExchangeRate, fiatTransactionTotal, tokenAmount]);
  const tokensText = `${tokenAmount} ${tokenSymbol}`;
  return /*#__PURE__*/_react.default.createElement(_confirmTransactionBase.default, {
    toAddress: toAddress,
    onEdit: onEdit,
    identiconAddress: tokenAddress,
    tokenImage: tokenImage,
    title: tokensText,
    subtitleComponent: contractExchangeRate === undefined ? /*#__PURE__*/_react.default.createElement("span", null, t('noConversionRateAvailable')) : /*#__PURE__*/_react.default.createElement(_userPreferencedCurrencyDisplay.default, {
      value: hexWeiValue,
      type: _common.PRIMARY,
      showEthLogo: true,
      hideLabel: true
    }),
    primaryTotalTextOverride: `${tokensText}`,
    primaryTotalTextOverrideMaxAmount: `${tokensText} + ${ethTransactionTotalMaxAmount} xMONI`,
    secondaryTotalTextOverride: secondaryTotalTextOverride
  });
}

ConfirmTokenTransactionBase.propTypes = {
  tokenAddress: _propTypes.default.string,
  toAddress: _propTypes.default.string,
  tokenAmount: _propTypes.default.string,
  tokenSymbol: _propTypes.default.string,
  fiatTransactionTotal: _propTypes.default.string,
  ethTransactionTotal: _propTypes.default.string,
  contractExchangeRate: _propTypes.default.number,
  conversionRate: _propTypes.default.number,
  currentCurrency: _propTypes.default.string,
  onEdit: _propTypes.default.func,
  nativeCurrency: _propTypes.default.string,
  ethTransactionTotalMaxAmount: _propTypes.default.string
};

//# sourceMappingURL=ui/pages/confirm-token-transaction-base/confirm-token-transaction-base.component.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-token-transaction-base/confirm-token-transaction-base.component.js",}],
[4076, {"../../ducks/confirm-transaction/confirm-transaction.duck":3978,"../../ducks/send":3986,"./confirm-send-ether.component":4075,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reactRouterDom = require("react-router-dom");

var _send = require("../../ducks/send");

var _confirmTransaction = require("../../ducks/confirm-transaction/confirm-transaction.duck");

var _confirmSendEther = _interopRequireDefault(require("./confirm-send-ether.component"));

const mapStateToProps = state => {
  const {
    confirmTransaction: {
      txData: {
        txParams
      } = {}
    }
  } = state;
  return {
    txParams
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editTransaction: async txData => {
      const {
        id
      } = txData;
      await dispatch((0, _send.editTransaction)(_send.ASSET_TYPES.NATIVE, id.toString()));
      dispatch((0, _confirmTransaction.clearConfirmTransaction)());
    }
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_confirmSendEther.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-send-ether/confirm-send-ether.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-send-ether/confirm-send-ether.container.js",}],
[4079, {"../../ducks/confirm-transaction/confirm-transaction.duck":3978,"../../ducks/send":3986,"../../selectors":4326,"../../store/actions":4331,"./confirm-send-token.component":4078,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
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

var _actions = require("../../store/actions");

var _send = require("../../ducks/send");

var _selectors = require("../../selectors");

var _confirmSendToken = _interopRequireDefault(require("./confirm-send-token.component"));

const mapStateToProps = state => {
  const {
    tokenAmount
  } = (0, _selectors.sendTokenTokenAmountAndToAddressSelector)(state);
  return {
    tokenAmount
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editTransaction: ({
      txData,
      tokenData,
      tokenProps: assetDetails
    }) => {
      const {
        id
      } = txData;
      dispatch((0, _send.editTransaction)(_send.ASSET_TYPES.TOKEN, id.toString(), tokenData, assetDetails));
      dispatch((0, _confirmTransaction.clearConfirmTransaction)());
      dispatch((0, _actions.showSendTokenPage)());
    }
  };
};

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_confirmSendToken.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-send-token/confirm-send-token.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-send-token/confirm-send-token.container.js",}],
[4088, {"../../selectors":4326,"./confirm-transaction-switch.component":4087,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _selectors = require("../../selectors");

var _confirmTransactionSwitch = _interopRequireDefault(require("./confirm-transaction-switch.component"));

const mapStateToProps = (state, ownProps) => {
  const {
    metamask: {
      unapprovedTxs
    }
  } = state;
  const {
    match: {
      params = {},
      url
    }
  } = ownProps;
  const urlId = (url === null || url === void 0 ? void 0 : url.match(/\d+/u)) && (url === null || url === void 0 ? void 0 : url.match(/\d+/u)[0]);
  const {
    id: paramsId
  } = params;
  const transactionId = paramsId || urlId;
  const unconfirmedTransactions = (0, _selectors.unconfirmedTransactionsListSelector)(state);
  const totalUnconfirmed = unconfirmedTransactions.length;
  const transaction = totalUnconfirmed ? unapprovedTxs[transactionId] || unconfirmedTransactions[0] : {};
  return {
    txData: transaction
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_confirmTransactionSwitch.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-transaction-switch/confirm-transaction-switch.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-transaction-switch/confirm-transaction-switch.container.js",}],
[4067, {"./confirm-deploy-contract.component":4066,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRedux = require("react-redux");

var _confirmDeployContract = _interopRequireDefault(require("./confirm-deploy-contract.component"));

const mapStateToProps = state => {
  const {
    confirmTransaction: {
      txData
    } = {}
  } = state;
  return {
    txData
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(_confirmDeployContract.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-deploy-contract/confirm-deploy-contract.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-deploy-contract/confirm-deploy-contract.container.js",}],
[4064, {"../../ducks/confirm-transaction/confirm-transaction.duck":3978,"../../ducks/history/history":3982,"../../selectors":4326,"../../store/actions":4331,"./confirm-decrypt-message.component":4063,"@babel/runtime/helpers/interopRequireDefault":186,"react-redux":3088,"react-router-dom":3099,"redux":3144}, function (require, module, exports) {
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

var _selectors = require("../../selectors");

var _confirmTransaction = require("../../ducks/confirm-transaction/confirm-transaction.duck");

var _history = require("../../ducks/history/history");

var _confirmDecryptMessage = _interopRequireDefault(require("./confirm-decrypt-message.component"));

function mapStateToProps(state) {
  const {
    metamask: {
      domainMetadata = {}
    }
  } = state;
  const unconfirmedTransactions = (0, _selectors.unconfirmedTransactionsListSelector)(state);
  const txData = unconfirmedTransactions[0];
  const {
    msgParams: {
      from
    }
  } = txData;
  const fromAccount = (0, _selectors.getTargetAccountWithSendEtherInfo)(state, from);
  return {
    txData,
    domainMetadata,
    fromAccount,
    requester: null,
    requesterAddress: null,
    conversionRate: (0, _selectors.conversionRateSelector)(state),
    mostRecentOverviewPage: (0, _history.getMostRecentOverviewPage)(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goHome: () => dispatch((0, _actions.goHome)()),
    clearConfirmTransaction: () => dispatch((0, _confirmTransaction.clearConfirmTransaction)()),
    decryptMessage: (msgData, event) => {
      const params = msgData.msgParams;
      params.metamaskId = msgData.id;
      event.stopPropagation(event);
      return dispatch((0, _actions.decryptMsg)(params));
    },
    cancelDecryptMessage: (msgData, event) => {
      event.stopPropagation(event);
      return dispatch((0, _actions.cancelDecryptMsg)(msgData));
    },
    decryptMessageInline: (msgData, event) => {
      const params = msgData.msgParams;
      params.metamaskId = msgData.id;
      event.stopPropagation(event);
      return dispatch((0, _actions.decryptMsgInline)(params));
    }
  };
}

var _default = (0, _redux.compose)(_reactRouterDom.withRouter, (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(_confirmDecryptMessage.default);

exports.default = _default;

//# sourceMappingURL=ui/pages/confirm-decrypt-message/confirm-decrypt-message.container.js
}, {file:"/Users/jack/projects/monsta-wallet/ui/pages/confirm-decrypt-message/confirm-decrypt-message.container.js",}]],[],{})


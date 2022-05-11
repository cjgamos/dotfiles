LavaPack.loadBundle([
[147, {}, function (require, module, exports) {
"use strict";

/*
Passing messages from background script to popup
*/
let port = chrome.runtime.connect({
  name: 'trezor-connect'
});
port.onMessage.addListener(message => {
  window.postMessage(message, window.location.origin);
});
port.onDisconnect.addListener(d => {
  port = null;
});
/*
Passing messages from popup to background script
*/

window.addEventListener('message', event => {
  if (port && event.source === window && event.data) {
    port.postMessage({
      data: event.data
    });
  }
});

//# sourceMappingURL=app/vendor/trezor/content-script.js
}, {file:"/Users/jack/projects/monsta-wallet/app/vendor/trezor/content-script.js",}]],[147],{})


(()=>{"use strict";var e={38300:(e,n)=>{var t;Object.defineProperty(n,"__esModule",{value:!0}),n.RONIN_EVENT=n.REQUEST_TYPES=void 0,(t=n.REQUEST_TYPES||(n.REQUEST_TYPES={})).ASK_PROVIDER_FROM_CONTENT_SCRIPT="ask_provider_from_content_script",t.RONIN_WALLET_ENABLE_REQUEST="ronin_wallet_enable_request",t.ASK_PROVIDER_FROM_POPUP="ask_provider_from_popup",(n.RONIN_EVENT||(n.RONIN_EVENT={})).ACCOUNT_CHANGED="account_changed"},67749:(e,n,t)=>{n.u=void 0;var E=t(38300);n.u={sendAsync:function(e,n){var t=e.id,r=new CustomEvent(E.REQUEST_TYPES.ASK_PROVIDER_FROM_CONTENT_SCRIPT,{detail:{payload:e}});window.dispatchEvent(r);var a=function(e){e.source===window&&e.data&&"from-content-script"===e.data.direction&&e.data.detail.id===t&&(n(e.data.error,e.data.detail),window.removeEventListener("message",a))};window.addEventListener("message",a)},enable:function(e){var n=new CustomEvent(E.REQUEST_TYPES.RONIN_WALLET_ENABLE_REQUEST);window.dispatchEvent(n)}};var r=new EventTarget;window.addEventListener("message",(function(e){e.source===window&&e.data&&"from-content-script"===e.data.direction&&e.data.roninEvent===E.RONIN_EVENT.ACCOUNT_CHANGED&&r.dispatchEvent(new Event(E.RONIN_EVENT.ACCOUNT_CHANGED))}));var a={provider:n.u,roninEvent:r};window.ronin=a}},n={};!function t(E){var r=n[E];if(void 0!==r)return r.exports;var a=n[E]={exports:{}};return e[E](a,a.exports,t),a.exports}(67749)})();
"use strict";(self.webpackChunksolflare=self.webpackChunksolflare||[]).push([["src_common_components_ConfirmationHelpers_CreateTokenAccount_js-src_common_components_Confirm-666fcc"],{"./src/common/components/ConfirmationHelpers/CreateTokenAccount.js":function(e,t,n){n.d(t,{Z:function(){return x}});var r,o,i=n("./node_modules/@material-ui/core/esm/Avatar/Avatar.js"),c=n("./node_modules/@material-ui/icons/esm/HelpOutline.js"),a=n("./node_modules/@material-ui/core/esm/Typography/Typography.js"),s=n("./node_modules/@material-ui/core/esm/Divider/Divider.js"),u=n("./node_modules/@material-ui/core/esm/Box/Box.js"),l=n("./node_modules/react/index.js"),f=n("./src/assets/create-account-icon.svg"),p=n("./node_modules/@material-ui/core/esm/styles/withStyles.js"),m=n("./node_modules/prop-types/index.js"),d=n.n(m);function y(e){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},y(e)}function b(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function v(e,t){return v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},v(e,t)}function g(e,t){if(t&&("object"===y(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function j(e){return j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},j(e)}var w,_,O,x=(0,n("./node_modules/react-i18next/dist/es/withTranslation.js").Z)()(r=(0,p.Z)((function(){return{icon:{width:100},address:{wordBreak:"break-all"}}}))((o=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&v(e,t)}(m,e);var t,n,r,o,p=(r=m,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=j(r);if(o){var n=j(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return g(this,e)});function m(){return b(this,m),p.apply(this,arguments)}return t=m,(n=[{key:"render",value:function(){var e=this.props,t=e.classes,n=e.mint,r=e.t;return l.createElement(u.Z,{display:"flex",flexDirection:"column",alignItems:"center"},l.createElement(u.Z,{mb:2},l.createElement("img",{className:t.icon,alt:"transaction",src:f})),l.createElement(s.Z,{light:!0,style:{width:"100%"}}),l.createElement(u.Z,{display:"flex",flexDirection:"column",alignItems:"center",my:2},l.createElement(a.Z,{variant:"body2",gutterBottom:!0},r("confirm_creating_new_account")),l.createElement(u.Z,{display:"flex",alignItems:"center",my:2},l.createElement(i.Z,{src:n.logoURI||null},l.createElement(c.Z,{fontSize:"large"})),l.createElement(u.Z,{ml:1},l.createElement(a.Z,{variant:"h2",color:"primary"},n.name||r("error_unknown_mint")))),l.createElement(a.Z,{variant:"body2",gutterBottom:!0},r("confirm_with_mint_address")),l.createElement(a.Z,{variant:"caption",gutterBottom:!0,className:t.address},n.mint)),l.createElement(s.Z,{light:!0,style:{width:"100%"}}))}}])&&h(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),m}(l.Component),w=o,_="propTypes",O={t:d().func,mint:d().object,classes:d().object},_ in w?Object.defineProperty(w,_,{value:O,enumerable:!0,configurable:!0,writable:!0}):w[_]=O,r=o))||r)||r},"./src/common/components/ConfirmationHelpers/TransferSol.js":function(e,t,n){n.d(t,{Z:function(){return Z}});var r,o,i=n("./node_modules/@material-ui/core/esm/Typography/Typography.js"),c=n("./node_modules/@material-ui/core/esm/Divider/Divider.js"),a=n("./node_modules/@material-ui/core/esm/Box/Box.js"),s=n("./node_modules/react/index.js"),u=n("./src/assets/transaction-icon.svg"),l=n("./node_modules/@material-ui/core/esm/styles/withStyles.js"),f=n("./node_modules/prop-types/index.js"),p=n.n(f),m=n("./node_modules/react-i18next/dist/es/withTranslation.js"),d=n("./src/common/components/Avatar/index.js"),y=n("./node_modules/react-redux/es/index.js"),b=n("./src/actions/nameService.js"),h=n("./node_modules/@solana/web3.js/lib/index.browser.esm.js");function v(e){return v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},v(e)}function g(e,t,n,r,o,i,c){try{var a=e[i](c),s=a.value}catch(e){return void n(e)}a.done?t(s):Promise.resolve(s).then(r,o)}function j(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function c(e){g(i,r,o,c,a,"next",e)}function a(e){g(i,r,o,c,a,"throw",e)}c(void 0)}))}}function w(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function O(e,t){return O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},O(e,t)}function x(e,t){if(t&&("object"===v(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return E(e)}function E(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function P(e){return P=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},P(e)}function k(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Z=(0,m.Z)()(r=(0,l.Z)((function(){return{icon:{width:100},address:{wordBreak:"break-all",textAlign:"center"},avatar:{width:64,height:64,marginBottom:6}}}))(r=(0,y.$j)(null,{getTwitterHandleFromPubkey:b.CW})((o=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&O(e,t)}(f,e);var t,n,r,o,l=(r=f,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=P(r);if(o){var n=P(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return x(this,e)});function f(){var e;w(this,f);for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return k(E(e=l.call.apply(l,[this].concat(n))),"state",{twitterHandle:null}),k(E(e),"fetchTwitterHandle",j(regeneratorRuntime.mark((function t(){var n,r,o,i,c,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.props,r=n.recepient,o=n.recipientName,i=n.getTwitterHandleFromPubkey,r!==o){t.next=7;break}return c=new h.PublicKey(r),t.next=5,i({pubkey:c});case 5:a=t.sent,e.setState({twitterHandle:a});case 7:case"end":return t.stop()}}),t)})))),e}return t=f,(n=[{key:"componentDidMount",value:function(){this.fetchTwitterHandle()}},{key:"render",value:function(){var e=this.props,t=e.classes,n=e.amount,r=e.recepient,o=e.recipientName,l=e.ticker,f=void 0===l?"SOL":l,p=e.t;return s.createElement(a.Z,{display:"flex",flexDirection:"column",alignItems:"center"},s.createElement(a.Z,{mb:2},s.createElement("img",{className:t.icon,alt:"transaction",src:u})),s.createElement(c.Z,{light:!0,style:{width:"100%"}}),s.createElement(a.Z,{display:"flex",flexDirection:"column",alignItems:"center",my:2},s.createElement(i.Z,{variant:"body2",gutterBottom:!0},p("confirm_you_are_sending")),s.createElement(i.Z,{variant:"h2",color:"primary",gutterBottom:!0},n," ",f),s.createElement(i.Z,{variant:"body2",gutterBottom:!0},p("confirm_sending_to")),s.createElement(d.Z,{className:t.avatar,pubkey:r}),o?s.createElement(i.Z,{variant:"caption",gutterBottom:!0,className:t.address},o):s.createElement(i.Z,{variant:"caption",gutterBottom:!0,className:t.address},r),!!this.state.twitterHandle&&s.createElement(i.Z,{variant:"body2",gutterBottom:!0},"(@",this.state.twitterHandle,")")),s.createElement(c.Z,{light:!0,style:{width:"100%"}}))}}])&&_(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),f}(s.Component),k(o,"propTypes",{t:p().func,amount:p().any,recepient:p().string,recipientName:p().string,ticker:p().string,classes:p().object,getTwitterHandleFromPubkey:p().func}),r=o))||r)||r)||r},"./src/common/components/SensitiveData/index.js":function(e,t,n){n.d(t,{Z:function(){return E}});var r=n("./node_modules/@material-ui/core/esm/Box/Box.js"),o=n("./node_modules/@material-ui/lab/esm/Skeleton/Skeleton.js"),i=n("./node_modules/react/index.js"),c=n("./node_modules/prop-types/index.js"),a=n.n(c),s=n("./node_modules/react-redux/es/index.js"),u=n("./node_modules/reselect/es/index.js"),l=n("./src/selectors/config.js"),f=(0,u.zB)({hideBalances:l.d2});function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}var m,d,y=["children","inline","hideBalances","dispatch"];function b(){return b=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},b.apply(this,arguments)}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function v(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function g(e,t){return g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},g(e,t)}function j(e,t){if(t&&("object"===p(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function w(e){return w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},w(e)}var _,O,x,E=(0,s.$j)(f)((d=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&g(e,t)}(u,e);var t,n,c,a,s=(c=u,a=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=w(c);if(a){var n=w(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return j(this,e)});function u(){return h(this,u),s.apply(this,arguments)}return t=u,(n=[{key:"render",value:function(){var e=this.props,t=e.children,n=e.inline,c=e.hideBalances,a=(e.dispatch,function(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}(e,y));return c?n?i.createElement(r.Z,{clone:!0,display:"inline-block !important"},i.createElement(o.Z,b({animation:!1,width:"100%"},a))):i.createElement(o.Z,b({animation:!1,width:"100%"},a)):t||null}}])&&v(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),u}(i.Component),_=d,O="propTypes",x={children:a().node,dispatch:a().func,inline:a().bool,hideBalances:a().bool},O in _?Object.defineProperty(_,O,{value:x,enumerable:!0,configurable:!0,writable:!0}):_[O]=x,m=d))||m},"./src/common/utils/moonpay.js":function(e,t,n){n.d(t,{D:function(){return i}});var r=n("./node_modules/crypto-browserify/index.js"),o=n("./node_modules/buffer/index.js").Buffer;function i(e){var t="?apiKey=".concat("pk_live_eVl5696SEf2QM8FCvCCXQI63k4OxJJf","&currencyCode=sol&colorCode=").concat(encodeURIComponent("#FF842D"),"&walletAddress=").concat(e),n=(0,r.zH)("sha256",o.from("sk_live_uujqqbJQPUtNtfxTCvzPPsz6FUErJEI9"));n.update(t);var i=n.digest(),c=encodeURIComponent(o.from(i).toString("base64"));return"".concat("https://buy.moonpay.com").concat(t,"&signature=").concat(c)}},"./src/common/utils/parsePriceChange.js":function(e,t,n){n.d(t,{p:function(){return o}});var r=n("./src/common/utils/displayPrice.js"),o=function(e,t,n){var o=e*(t/100)||0,i=Math.abs(o)<.01,c=n*(t/100)||0,a=Math.abs(c)<.01;return{priceChange:o,tokenPriceChange:c,priceChangeDisplay:(0,r.E)({amount:i?o<0?"-<$0.01":"+<$0.01":Math.abs(o),prefix:i?"":t<0?"-$":"+$",displayType:"medium"}),tokenPriceChangeDisplay:(0,r.E)({amount:a?c<0?"-<$0.01":"+<$0.01":Math.abs(c),prefix:a?"":c<0?"-$":"+$",displayType:"medium"})}}},"./src/assets/create-account-icon.svg":function(e,t,n){e.exports=n.p+"assets/create-account-icon.46dad860..svg"},"./src/assets/solana.png":function(e,t,n){e.exports=n.p+"assets/solana.356c6cf4..png"},"./src/assets/transaction-icon.svg":function(e,t,n){e.exports=n.p+"assets/transaction-icon.c4d7ab7e..svg"}}]);
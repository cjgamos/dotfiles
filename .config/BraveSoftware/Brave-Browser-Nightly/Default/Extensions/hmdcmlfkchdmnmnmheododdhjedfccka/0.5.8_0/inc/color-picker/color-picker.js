/*! For license information please see color-picker.js.LICENSE.txt */
var CP=function(t){var e=window,n=document,r=this,o=!1,c={},u=n.createElement("div");function s(t){return void 0!==t}function i(t,e,n){return t<e?e:t>n?n:t}function a(t){var e,n,r,o,c,u,s,i,a=+t[0],f=+t[1],l=+t[2];switch(u=l*(1-f),s=l*(1-(c=6*a-(o=Math.floor(6*a)))*f),i=l*(1-(1-c)*f),isNaN(o)&&(o=0),isNaN(s)&&(s=0),isNaN(i)&&(i=0),o%6){case 0:e=l,n=i,r=u;break;case 1:e=s,n=l,r=u;break;case 2:e=u,n=l,r=i;break;case 3:e=u,n=s,r=l;break;case 4:e=i,n=u,r=l;break;case 5:e=l,n=u,r=s}return[Math.round(255*e),Math.round(255*n),Math.round(255*r)]}function f(t){return h(a(t))}function l(t){var e,n=+t[0],r=+t[1],o=+t[2],c=Math.max(n,r,o),u=Math.min(n,r,o),s=c-u,i=0===c?0:s/c,a=c/255;switch(c){case u:e=0;break;case n:e=r-o+s*(r<o?6:0),e/=6*s;break;case r:e=o-n+2*s,e/=6*s;break;case o:e=n-r+4*s,e/=6*s}return[e,i,a]}function h(t){var e=+t[2]|+t[1]<<8|+t[0]<<16;return(e="000000"+e.toString(16)).slice(-6)}function p(t){return l(d(t))}function d(t){return 3===t.length&&(t=t.replace(/./g,"$&$&")),[parseInt(t[0]+t[1],16),parseInt(t[2]+t[3],16),parseInt(t[4]+t[5],16)]}function v(t){return[+t[0]/360,+t[1]/100,+t[2]/100]}function g(t){return[Math.round(360*+t[0]),Math.round(100*+t[1]),Math.round(100*+t[2])]}function m(t,e,n){return e.addEventListener(t,n,!1)}function y(t,e,n){return e.removeEventListener(t,n)}function k(t,e){for(var n=e.touches?e.touches[0].pageX:e.pageX,r=e.touches?e.touches[0].pageY:e.pageY,o=x(t).l,c=x(t).t;t=t.offsetParent;)o+=x(t).l,c+=x(t).t;return{x:n-o,y:r-c}}function x(t){return{l:t.offsetLeft,t:t.offsetTop}}function b(t){return{w:t.offsetWidth,h:t.offsetHeight}}function H(t){return o||!!s(t)&&t}function w(t){o=t}function M(t,e,n){if(!s(c[t]))return r;if(s(n))s(c[t][n])&&c[t][n].apply(r,e);else for(var o in c[t])c[t][o].apply(r,e);return r}r.parse=function(t){if("object"==typeof t)return t;var e=/\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i.exec(t),n=/\s*hsv\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/i.exec(t);return"#"===t[0]&&t.match(/^#([\da-f]{3}|[\da-f]{6})$/)?p(t.slice(1)):n?v([+n[1],+n[2],+n[3]]):e?l([+e[1],+e[2],+e[3]]):[0,1,1]},w(r.parse(t.getAttribute("data-color")||t.value||[0,1,1])),u.className="color-picker",u.innerHTML='<div class="color-picker-control"><span class="color-picker-h"><i></i></span><span class="color-picker-sv"><i></i></span></div>';var E,S,N=n.body,V=n.documentElement,X=u.firstChild.children,C=H([0,1,1]),B=X[0],G=X[1],L=B.firstChild,R=G.firstChild,T=!1,$=!1,_=!1,j=!1,I=0,D=0,P=0,Y=0,z=f(C);function A(t,e){t&&"h"!==t||M("change:h",e),t&&"sv"!==t||M("change:sv",e),M("change",e)}function O(t,n){return e.setTimeout(t,n)}function W(){return u.parentNode}function q(){var n=b(V).w,o=e.innerHeight,c=n+Math.max(N.scrollLeft,V.scrollLeft),s=o+Math.max(N.scrollTop,V.scrollTop);return I=x(t).l,D=x(t).t+b(t).h,I+P>c&&(I=c-P),D+Y>s&&(D=s-Y),u.style.left=I+"px",u.style.top=D+"px",M("fit",[r]),r}function F(o){o||N.appendChild(u),P=b(u).w,Y=b(u).h;var c=b(B).h,s=b(G).w,l=b(G).h,h=b(L).h,p=b(R).w,d=b(R).h;if(o){function v(t){M("before.click",[r]),O((function(){F(),M("click",[r])}),.1),t.preventDefault()}u.style.left="-9999px",u.style.top="-9999px",m("resize",e,q),m("touchdown",t,v),m("click",t,v),r.create=function(){return M("before.create",[r]),O((function(){F(1),M("create",[r])}),.1),r},r.destroy=function(){return y("touchdown",t,v),y("click",t,v),w(!1),S(),M("destroy",[r]),r}}else q(),M("enter",[r]);function g(t){a(C);var e=a([C[0],1,1]);G.style.backgroundColor="rgb("+e.join(",")+")",w(C),t&&t.preventDefault()}function x(t){_&&(function(t){var e=i(k(B,t).y,0,c);C[0]=(c-e)/c,L.style.top=e-h/2+"px",g(t)}(t),z=f(C),T||(M("drag:h",[z,r]),M("drag",[z,r])),A("h",[z,r])),j&&(function(t){var e=k(G,t),n=i(e.x,0,s),r=i(e.y,0,l);C[1]=1-(s-n)/s,C[2]=(l-r)/l,R.style.right=s-n-p/2+"px",R.style.top=r-d/2+"px",g(t)}(t),z=f(C),$||(M("drag:sv",[z,r]),M("drag",[z,r])),A("sv",[z,r])),T=!1,$=!1}function V(t){if(!o){var e=_?"h":"sv",n=[f(C),r];M("stop:"+e,n),M("stop",n),A(e,n)}_=!1,j=!1}function X(t){T=!0,_=!0,x(t),M("start:h",[z,r]),M("start",[z,r]),A("h",[z,r])}function I(t){$=!0,j=!0,x(t),M("start:sv",[z,r]),M("start",[z,r]),A("sv",[z,r])}S=function(t){return W()&&W().removeChild(u),y("touchmove",n,x),y("mousemove",n,x),y("touchend",n,V),y("mouseup",n,V),y("touchdown",n,S),y("click",n,S),M("before.exit",[r]),O((function(){W()||M("exit",[r])}),.11),r},(E=function(){C=H(C),g(),L.style.top=c-h/2-c*+C[0]+"px",R.style.right=s-p/2-s*+C[1]+"px",R.style.top=l-d/2-l*+C[2]+"px"})(),m("touchstart",B,X),m("mousedown",B,X),m("touchstart",G,I),m("mousedown",G,I),m("touchmove",n,x),m("mousemove",n,x),m("touchend",n,V),m("mouseup",n,V)}return F(1),M("before.create",[r]),O((function(){M("create",[z=f(C),r]),A(0,[z,r])}),.1),r.target=t,r.picker=u,r.on=function(t,e,n){return s(t)?s(e)?(s(c[t])||(c[t]={}),s(n)||(n=Object.keys(c[t]).length),c[t][n]=e,r):c[t]:c},r.off=function(t,e){return s(t)?s(e)?(delete c[t][e],r):(c[t]={},r):(c={},r)},r.trigger=M,r.fit=q,r.set=function(t){return s(t)?("string"==typeof t&&(t=r.parse(t)),w(t),E(),r):H()},r.HSV2RGB=function(t){return a(v(t))},r._HSV2RGB=a,r.HSV2HEX=function(t){return f(v(t))},r._HSV2HEX=f,r.RGB2HSV=function(t){return g(l(t))},r._RGB2HSV=l,r.RGB2HEX=h,r.HEX2HSV=function(t){return g(p(t))},r._HEX2HSV=p,r.HEX2RGB=d,r.hooks=c,r.enter=F,r.exit=S,r};
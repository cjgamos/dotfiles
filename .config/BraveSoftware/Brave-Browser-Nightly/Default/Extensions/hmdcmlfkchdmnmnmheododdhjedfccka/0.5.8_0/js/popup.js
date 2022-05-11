(()=>{let e=null,t={},l={},o=null,s=null,a=null,r=null,c=null,i=null,d=null,u=null;var m;function p(e){const t=e.split(/[,)]/);return`${t[0]},${t[1]}%,${t[2]}%)`}function g(){let t=document.getElementById("colors-palette-change");if(e.bg.plus()){t.style.display="inline",i.innerHTML='<span class="small-caps b">Plus</span>',i.className="ed-external link hint--right hint--no-animate block pv1 ph2 mt1 db silver no-underline";let l="You unlocked Plus. Thanks!";"free"===e.bg.plus()&&(l="Unlocked for free. Want to donate for future development?"),i.setAttribute("aria-label",l)}else E(e.bg.defaultPalette),t.style.display="none";i.style.display="block"}function y(e){e.dataset.url&&(e.onclick=()=>{chrome.tabs.create({url:e.dataset.url})})}function h(){for(let e of document.getElementsByClassName("ed-external"))y(e)}function f(){chrome.tabs.getSelected(null,(e=>{!function(e){void 0===e.url||0==e.url.indexOf("chrome")?b(e,!1,"Chrome doesn't allow <i>extensions</i> to play with special Chrome pages like this one. <pre>chrome://...</pre>"):0==e.url.indexOf("https://chrome.google.com/webstore")?b(e,!1,"Chrome doesn't allow its <i>extensions</i> to play on Web Store."):0===e.url.indexOf("file")?chrome.extension.isAllowedFileSchemeAccess((t=>{t?b(e,!0):(b(e,!1,'<strong>Eye Dropper</strong> can\'t access local pages unless you grant it the permission. Check <a href="#" id="link-help-file-urls" data-url="https://eyedropper.test/help/file-urls">the instructions how to allow it</a>.'),y(document.getElementById("link-help-file-urls")))})):b(e,!0)}(e)})),t={current:document.getElementById("box-current"),new:document.getElementById("box-new")},k(),B(),document.getElementById("colors-history-clear").onclick=()=>{mscConfirm({title:"Wipe It?",subtitle:`Really clear palette ${e.bg.getPaletteName()}?`,okText:"Yes, Wipe It!",cancelText:"No",onOk:()=>{chrome.runtime.sendMessage({type:"clear-history"},(()=>{B(),k()}))}})},document.getElementById("colors-history-export").onclick=()=>{!function(){let t=e.bg.getPalette().colors,l="";if(e.bg.plus()){l+='"RGB Hex","Date","Source","RGB Hex3","HSL","RGB","HTML Keyword"',l+="\n";for(let o of t){let t="function"==typeof o.t?new Date(o.t()):new Date(o.t),n=`${t.getFullYear()}-${("0"+(t.getMonth()+1)).slice(-2)}-${("0"+t.getDate()).slice(-2)} ${("0"+t.getHours()).slice(-2)}:${("0"+t.getMinutes()).slice(-2)}:${("0"+t.getSeconds()).slice(-2)}`;l+=`"${o.h}","${n}","${e.bg.color_sources[o.s]}"`,o=pusher.color(o.h);let s=[o.hex3(),p(o.html("hsl")),o.html("rgb"),o.html("keyword")];for(let e of s)l+=`,"${e}"`;l+="\n"}}else{l+='"RGB Hex","RGB Hex3","HSL","RGB","HTML Keyword"',l+="\n";for(let e of t){let t="function"==typeof e.t?new Date(e.t()):new Date(e.t);t.getFullYear(),("0"+(t.getMonth()+1)).slice(-2),("0"+t.getDate()).slice(-2),("0"+t.getHours()).slice(-2),("0"+t.getMinutes()).slice(-2),("0"+t.getSeconds()).slice(-2),l+=`"${e.h}"`,e=pusher.color(e.h);let o=[e.hex3(),p(e.html("hsl")),e.html("rgb"),e.html("keyword")];for(let e of o)l+=`,"${e}"`;l+="\n"}}let o="data:text/csv;base64,"+btoa(l),n=document.createElement("a");n.setAttribute("href",o),n.setAttribute("download","export.csv"),n.click()}()},function(){let e=document.getElementById("colors-palette-change");r=document.getElementById("colors-palette"),c=document.getElementById("palette-name"),e.onclick=()=>{r.style.display="none"===r.style.display?"inline-block":"none"},$()}(),g()}function b(t,l,o=""){let n=document.getElementById("pick");if(l)n.onclick=()=>{e.bg.useTab(t),e.bg.activate(),window.close()};else{let e=document.getElementById("pick-message");e.innerHTML=`<h3 class="normal">&#128542; Whoops. Can't pick from this page</h3><p class="lh-copy">${o}</p>`,e.style.display="block",n.style.display="none"}}function k(){x("current",e.bg.getColor()),x("new",e.bg.getColor())}function w(t){mscConfirm({title:`Destroy Palette '${t}'?`,subtitle:`Really destroy palette ${t}?`,okText:"Yes, Destroy It!",cancelText:"No",onOk:()=>{let l=t===e.bg.getPaletteName();e.bg.destroyPalette(t),l?E("default"):$()}})}function B(){let t=document.getElementById("colors-history"),l=document.getElementById("colors-history-instructions"),o=(document.getElementById("colors-history-toolbar"),document.getElementsByClassName("eb-history-tool-noempty")),s="",a=e.bg.getPalette();for(let e of a.colors)s+=C(e.h);t.innerHTML=s;for(let t of document.getElementsByClassName("colors-history-square"))t.onmouseover=()=>{x("new",t.dataset.color)},t.onclick=()=>{x("current",t.dataset.color),e.bg.setColor(t.dataset.color,!1),I(t.dataset.color)};if(a.colors.length>0)for(n of(l.innerHTML="Hover over squares to preview.",o))n.style.display="";else for(n of(l.innerHTML="History is empty, try to pick some colors first.",o))n.style.display="none";t.onmouseenter=()=>{l.innerHTML="Click on square to select and copy to clipboard."},t.onmouseleave=()=>{l.innerHTML="Hover over squares to preview.."}}function $(){let t='<a href="#" class="dib link dim ph2 ml1 white bg-dark-green br1 b--dark-green mb1" id="new-palette">new</a>',l=e.bg.getPaletteName();c.innerHTML=l,c.dataset.palette=l;for(let l of e.bg.getPaletteNames()){t+=`<span class="nowrap dib"><a href="#" class="ed-palette dib link dim pl2 pr1 ml1 white bg-light-purple br1 b--light-purple mb1" data-palette="${l}">${l}`;let o=e.bg.getPalette(l).colors.length;o>0&&(t+=`<span class="dib pink pl1">${o}</span>`),"default"!==l&&(t+=`\n                <a class="ed-palette-destroy link dib w1 hint--top hint--no-animate hint--rounded" aria-label="Destroy Palette ${l}!" data-palette="${l}" href="#">\n                <svg class="dim v-mid" viewBox="0 0 1792 1792" style="fill:gray;width:14px;">\n                <use xlink:href="/img/icons.svg#fa-ban">\n                </svg>\n                </a>`),t+="</a></span>"}r.innerHTML=t;for(let e of document.getElementsByClassName("ed-palette"))e.onclick=()=>{let t=e.dataset.palette;t!==l&&E(t)};for(let e of document.getElementsByClassName("ed-palette-destroy"))e.onclick=()=>{w(e.dataset.palette)};document.getElementById("new-palette").onclick=()=>{mscPrompt({title:"Name the Color Palette",okText:"Create Palette",cancelText:"Cancel",placeholder:"palette",onOk:t=>{!function(t){null!==t&&E(e.bg.createPalette(t).name)}(t)}})}}function E(t){e.bg.changePalette(t),$(),B()}function v(t){"button-about"===t?(o.style.display="none",s.style.display="none"):(o.style.display="block",s.style.display="block"),d&&d.destroy();for(let e in l)e.match(/-active$/)&&e!==`${t}-active`||e.match(/-link$/)&&e===`${t}-link`?l[e].style.display="none":l[e].style.display="inline-block";!function(t){let l=!1;for(let e of document.getElementsByClassName("content-page"))e.id===`${t}-content`?(e.style.display="block",l=!0):e.style.display="none";if(l)"tab-cp"===t&&H();else{let l=new XMLHttpRequest;l.open("GET",`/${t}.html`),l.onload=()=>{l.status>=200&&l.status<400&&(a.insertAdjacentHTML("afterend",l.responseText),h(),"tab-cp"===t&&function(){let t=document.createElement("script");t.onload=()=>{u=document.getElementById("colorpicker-input"),u.value=e.bg.getColor(),H()},t.src="/inc/color-picker/color-picker.js",document.head.appendChild(t),document.getElementById("colorpicker-select").onclick=()=>{let t=d.target.value.toLowerCase();x("current",t),e.bg.setColor(t,!0,2),B()}}())},l.send()}}(t)}function x(e,l){if(t[e]){let o=[(l=pusher.color(l)).hex6(),l.hex3(),l.html("keyword"),p(l.html("hsl")),l.html("rgb")],n="";for(let e of o)n+=`<span class="mr1 bg-white br1 ph1 mb1 dib"><code>${e}</code></span>`;t[e].innerHTML=n,t[e].style=`background: ${l.hex6()}`}}function C(e){return`<div class="fl dib dim mr1 br1 mb1 ba b--gray colors-history-square" data-color="${e}" style="background-color: ${e}">&nbsp;</div>`}function H(){function e(e){x("new",`#${e}`),d.target.value=`#${e}`}function t(){try{let e=d.target.value.toLowerCase();x("new",e),d.set(e)}catch(e){}}d=new CP(u),d.on("start",e),d.on("drag",e),d.on("enter",(()=>{document.getElementById("colorpicker").appendChild(d.picker)})),d.target.onkeyup=t,d.target.oncut=t,d.target.onpaste=t,d.target.oninput=t,d.enter()}function I(e){d&&(d.target.value=e,d.set(e))}m=function(){(function(){for(let e of document.getElementsByClassName("ed-tab"))e.onclick=()=>{v(e.id)};for(let e of document.getElementsByClassName("ed-tab-in"))l[e.id]=e})(),h(),chrome.runtime.getBackgroundPage((t=>{!function(t){e=t,void 0===e.bg.version||e.bg.version<17?(chrome.runtime.sendMessage({type:"reload-background"}),setTimeout(f,1e3)):f()}(t)})),a=document.getElementById("content"),o=document.getElementById("color-boxes"),s=document.getElementById("color-history"),i=document.getElementById("plus-badge"),i.style.display="none"},"loading"!=document.readyState?m():document.addEventListener("DOMContentLoaded",m)})();
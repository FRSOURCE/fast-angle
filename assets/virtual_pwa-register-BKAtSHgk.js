import{_ as f}from"./app-PxSx_Uzg.js";function _(c={}){const{immediate:o=!1,onNeedRefresh:u,onOfflineReady:i,onRegistered:s,onRegisteredSW:r,onRegisterError:t}=c;let a,n;const d=async(e=!0)=>{await n};async function l(){if("serviceWorker"in navigator){if(a=await f(async()=>{const{Workbox:e}=await import("./workbox-window.prod.es5-D5gOYdM7.js");return{Workbox:e}},[]).then(({Workbox:e})=>new e("/fast-angle/sw.js",{scope:"/fast-angle/",type:"classic"})).catch(e=>{t==null||t(e)}),!a)return;a.addEventListener("activated",e=>{(e.isUpdate||e.isExternal)&&window.location.reload()}),a.addEventListener("installed",e=>{e.isUpdate||i==null||i()}),a.register({immediate:o}).then(e=>{r?r("/fast-angle/sw.js",e):s==null||s(e)}).catch(e=>{t==null||t(e)})}}return n=l(),d}export{_ as registerSW};
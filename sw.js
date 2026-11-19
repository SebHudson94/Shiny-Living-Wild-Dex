const CACHE="shiny-dex-v3";
const FILES=["./index.html","./manifest.json","./icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
// Network first so updates show straight away; the cache is the offline fallback
self.addEventListener("fetch",e=>{
  if(new URL(e.request.url).origin!==self.location.origin)return;   // leave sprites to the browser cache
  e.respondWith(
    fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;}).catch(()=>caches.match(e.request))
  );
});

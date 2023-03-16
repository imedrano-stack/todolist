// import { precacheAndRoute } from "workbox-precaching";
// import { registerRoute } from "workbox-routing";

// precacheAndRoute(self.__WB_MANIFEST);

// registerRoute(
//   ({ url }) => url.host === "https://todolist-186d6.web.app",
//   new NetworkFirst()
// );

//STORAGE OF BROWSER
const CACHE_NAME = "version-1";
const urlsToCache = [
  // "/static/js/bundle.js",
  "/regist_serviceworker.js",
  "/index.html",
  "/",
  // "/app.js",
  "/static/js/main.eb27ed9c.js",
  // "/static/js/main.eb27ed9c.js.map",
  "/static/css/main.b983daaf.css",
  // "/static/css/main.b983daaf.css.map",
  // "build/static/js/main.eb27ed9c.js",
  // "/build/static/js/main.eb27ed9c.js",
  // "/build",
  // "build",
];
const self = this;

//installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");

        return cache.addAll(urlsToCache).then(() => self.skipWaiting());
      })
      .catch((err) => console.log("Fallo el registro del cache", err))
  );
});

self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  );
});

// listen for request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(event.request);
      //recuperar de la petición a la url
      //   return fetch(event.request);
      //   return fetch(event.request).catch(() => caches.match("/index.html"));
    })
  );
});

// actitivate the service worker
// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   //   cacheWhitelist.push(CACHE_NAME);
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );
// });

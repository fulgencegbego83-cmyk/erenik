const CACHE = 'erenik-v4';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('push', function(e) {
  var d = e.data ? e.data.json() : { title: 'ÉRÉNIK', body: 'Nouveau message !' };
  e.waitUntil(
    self.registration.showNotification(d.title || 'ÉRÉNIK', {
      body: d.body,
      icon: '/icon-192.png',
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

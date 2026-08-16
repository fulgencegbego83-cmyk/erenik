// Service worker sûr ET installable — l'équilibre entre les deux exigences :
// 1. Un gestionnaire "fetch" DOIT exister pour que Chrome propose l'installation
//    (sans lui, le bouton "Installer" ne fonctionne jamais correctement).
// 2. Ce gestionnaire ne doit JAMAIS retomber sur un cache vide/mal alimenté
//    (c'est ce qui causait le plantage précédent).
// Solution : on laisse passer chaque requête directement au réseau, sans aucune
// tentative de cache. Résultat identique à une navigation normale, mais l'app
// reste installable.

const CACHE_NAME = 'erenik-v5';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Simple passage direct au réseau — aucune interception risquée, aucun cache
  // à alimenter, donc aucun risque de blocage si une requête échoue.
  e.respondWith(fetch(e.request));
});

self.addEventListener('push', function(e) {
  var d = e.data ? e.data.json() : { title: 'ÉRÉNIK', body: 'Nouveau message !' };
  e.waitUntil(
    self.registration.showNotification(d.title || 'ÉRÉNIK', {
      body: d.body,
      icon: 'icon-192.png',
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

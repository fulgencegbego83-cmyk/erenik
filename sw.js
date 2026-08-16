// Service worker volontairement minimal et sûr — aucune mise en cache hors-ligne
// (c'est justement cette logique de cache mal alimentée qui bloquait le chargement du site).
// Son seul rôle ici est de rendre l'application installable, et de permettre les
// notifications push. Toutes les requêtes passent directement par le réseau normal.

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.clients.claim();
});

// Pas de fetch handler du tout — le navigateur traite chaque requête normalement,
// exactement comme si aucun service worker n'existait. C'est la configuration la
// plus sûre : impossible qu'il bloque ou casse le chargement du site.

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

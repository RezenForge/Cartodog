// Cartodog : service worker des notifications. Il ne met rien en cache : l'appli se charge toujours en ligne comme avant.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { t: 'Cartodog', b: e.data ? e.data.text() : '' }; }
  e.waitUntil((async () => {
    const cl = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    cl.forEach((c) => c.postMessage({ cartodog: 'push', u: d.u || '' }));      // l'appli ouverte relève tout de suite les nouveautés
    const ios = /iPhone|iPad|iPod|Macintosh/.test(self.navigator.userAgent);
    if (!ios && cl.some((c) => c.visibilityState === 'visible' && c.focused)) return;      // déjà à l'écran : pas de bannière en plus
    await self.registration.showNotification(d.t || 'Cartodog', {
      body: d.b || '', tag: d.tag || undefined, renotify: !!d.tag, lang: 'fr',
      icon: 'icon-192.png', badge: 'icon-192.png', data: { u: d.u || '' },
    });
  })());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const u = (e.notification.data && e.notification.data.u) || '';
  e.waitUntil((async () => {
    const cl = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of cl) { if ('focus' in c) { try { await c.focus(); } catch (x) {} c.postMessage({ cartodog: 'open', u }); return; } }
    await self.clients.openWindow('./index.html?app=cartodog' + u);
  })());
});

// Self-destructing service worker — clears all old caches and removes itself.
// This ensures users on stale ww-v1/ww-v2 never get stuck on cached pages.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', async () => {
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  await self.registration.unregister();
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(c => c.navigate(c.url));
});

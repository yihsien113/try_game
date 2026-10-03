const CACHE_NAME = 'dollhouse-game-v1';

// 要預載並永久離線快取的檔案清單
const ASSETS_TO_CACHE = [
  './map1.html',
  './manifest.json',
  './map1_s.webp',
  './han1-1.webp',
  './han1-2.webp',
  './han1-3.webp',
  './bad1-1.webp',
  './bad1-2.webp',
  './bad1-3.webp'
];

// 安裝時自動下載所有素材（預載）
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA] 正在預載所有遊戲素材...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 啟動時清理舊快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 攔截網路請求，優先使用本機快取
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
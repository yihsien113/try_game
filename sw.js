const CACHE_NAME = 'dollhouse-game-v1';

// 填寫與 map1.html 同目錄下的檔案檔名
const ASSETS_TO_CACHE = [
  'map1.html',
  'manifest.json',
  'map1_s.webp',
  'han1-1.webp',
  'han1-2.webp',
  'han1-3.webp',
  'bad1-1.webp',
  'bad1-2.webp',
  'bad1-3.webp'
];

// 安裝並預載
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[PWA] 開始預載檔案...');
      // 逐一加進快取，若有檔案找不到會在 Console 印出詳細錯在哪個檔
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
          console.log(`[PWA] 成功預載: ${asset}`);
        } catch (err) {
          console.error(`❌ [PWA] 預載失敗，請檢查此檔案是否存在或檔名大小寫: ${asset}`, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 啟動與清理舊快取
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

// 攔截請求
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
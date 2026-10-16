// 引用素材清單
importScripts('./assets-manifest.js');

// 1. 安裝階段：快取所有資源並立刻接管
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(GAME_ASSETS))
  );
  self.skipWaiting(); // 強制跳過等待，立刻啟用新版
});

// 2. 啟用階段：清除「舊版本」快取（非常重要！）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // 如果快取名稱不是當前的 CACHE_NAME 就刪除
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // 讓新版 Service Worker 立即控制現有頁面
});

// 3. 攔截請求：優先讀取快取，沒有才走網路
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
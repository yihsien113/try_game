// 引用素材清單
importScripts('./assets-manifest.js');

// 1. 安裝階段：移除 cache.addAll，交由 index.html 統一預載並顯示進度，避免背景搶頻寬
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 強制跳過等待，立刻啟用新版 Service Worker
});

// 2. 啟用階段：清除「舊版本」快取
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
    }).then(() => {
      return self.clients.claim(); // 確保清除完舊快取後，立即接管現有頁面
    })
  );
});

// 3. 攔截請求：優先讀取快取，沒有才走網路（並順手將新請求寫入快取）
self.addEventListener('fetch', (event) => {
  // 只攔截 GET 請求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // 若快取中沒有（例如未列入清單的動態資源），從網路抓取
      return fetch(event.request);
    })
  );
});
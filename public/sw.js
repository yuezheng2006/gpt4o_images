// Service Worker版本，用于更新缓存
const CACHE_VERSION = 'v2';
const CACHE_NAME = 'gpt4o-images-cache-v2';
const IMAGE_CACHE_NAME = 'gpt4o-images-image-cache-v1';

// 需要缓存的核心资源
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/fallback-image.svg',
  '/assets/index-Cv-EYoPi.css',
  '/assets/index-CIfMqhYP.js'
];

// 安装Service Worker并缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('核心缓存已打开');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        return caches.open(IMAGE_CACHE_NAME);
      })
      .then(() => {
        console.log('图片缓存已初始化');
        return self.skipWaiting();
      })
  );
});

// 激活Service Worker并清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // 保留当前版本的核心缓存和图片缓存
          return cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME;
        }).map(cacheName => {
          console.log('删除旧缓存:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 网络优先策略，失败时使用缓存
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 特殊处理GitHub图片 - 配置为优先尝试直接加载，失败再使用代理
  if (event.request.url.includes('githubusercontent.com') || 
      event.request.url.includes('github.com') && 
      event.request.url.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
    
    event.respondWith(fetchWithFallback(event.request));
    return;
  }
  
  // 处理API代理请求
  if (url.pathname.startsWith('/api/image-proxy')) {
    // 这些请求由Cloudflare Functions处理，不在Service Worker中缓存
    return;
  }
  
  // 处理普通请求
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到响应，则返回缓存的响应
        if (response) {
          return response;
        }

        // 克隆请求，因为请求是一个流，只能使用一次
        const fetchRequest = event.request.clone();

        // 发起网络请求
        return fetch(fetchRequest).then(response => {
          // 检查是否收到有效的响应
          if (!response || response.status !== 200) {
            return response;
          }

          // 克隆响应，因为响应是一个流，只能使用一次
          const responseToCache = response.clone();

          // 打开缓存并将获取的响应添加到缓存中
          caches.open(CACHE_NAME)
            .then(cache => {
              // 只缓存同源请求和特定类型的资源
              if (url.origin === self.location.origin || 
                  url.pathname.match(/\.(css|js|html|json|svg)$/i)) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        })
        .catch(error => {
          // 网络请求失败时，如果是图片请求，返回备用图片
          if (event.request.url.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
            return caches.match('/fallback-image.svg');
          }
          
          // 如果是HTML请求，返回离线页面
          if (event.request.headers.get('Accept').includes('text/html')) {
            return caches.match('/');
          }
          
          console.error('Fetch failed:', error);
          throw error;
        });
      })
  );
});

// 优化的图片请求处理函数 - 先直接加载，失败再用代理
async function fetchWithFallback(request) {
  const url = new URL(request.url);
  let response = null;
  
  // 先检查缓存
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // 第一步：尝试直接从源站加载
  try {
    console.log('尝试直接加载图片:', request.url);
    
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GPT4OImages/1.0)',
        'Accept': 'image/*, */*;q=0.8',
        'Origin': self.location.origin,
        'Referer': self.location.origin
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store'
    };
    
    // 设置超时时间（可调整）
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('直接加载超时')), 5000);
    });
    
    // 使用 Promise.race 来实现超时控制
    response = await Promise.race([
      fetch(request, fetchOptions),
      timeoutPromise
    ]);
    
    if (response && response.ok) {
      console.log('直接加载成功:', request.url);
      const responseToCache = response.clone();
      const cache = await caches.open(IMAGE_CACHE_NAME);
      await cache.put(request, responseToCache);
      return response;
    }
  } catch (error) {
    console.warn('直接加载失败:', error.message);
    // 失败时继续使用代理
  }
  
  // 第二步：如果直接加载失败，尝试使用代理
  if (url.hostname.includes('githubusercontent.com') || url.hostname.includes('github.com')) {
    try {
      console.log('尝试使用代理加载:', request.url);
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(request.url)}`;
      response = await fetch(proxyUrl);
      
      if (response && response.ok) {
        console.log('代理加载成功:', request.url);
        const responseToCache = response.clone();
        const cache = await caches.open(IMAGE_CACHE_NAME);
        await cache.put(request, responseToCache);
        return response;
      }
    } catch (error) {
      console.error('代理加载失败:', error.message);
    }
  }
  
  // 第三步：如果上述方法都失败，返回默认占位图片
  console.log('所有加载方式失败，返回占位图片');
  return caches.match('/fallback-image.svg')
    .then(fallbackResponse => fallbackResponse || 
      new Response('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#6b9eff"/><text x="200" y="150" font-family="Arial" font-size="24" fill="white" text-anchor="middle">图片加载失败</text></svg>', 
      { headers: { 'Content-Type': 'image/svg+xml' } })
    );
}

// 后台同步API数据
self.addEventListener('sync', event => {
  if (event.tag === 'sync-images') {
    event.waitUntil(syncImages());
  }
});

// 预缓存新内容
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // 处理预缓存图片的消息
  if (event.data && event.data.type === 'PRECACHE') {
    if (event.data.urls && Array.isArray(event.data.urls)) {
      event.waitUntil(
        caches.open(IMAGE_CACHE_NAME).then(cache => {
          const fetchPromises = event.data.urls.map(url => {
            // 只预缓存图片URL
            if (typeof url === 'string' && url.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
              return fetch(url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (compatible; GPT4OImages/1.0)',
                  'Accept': 'image/*'
                },
                mode: 'cors',
                cache: 'no-store'
              })
              .then(response => {
                if (response && response.ok) {
                  return cache.put(url, response);
                }
                return Promise.resolve();
              })
              .catch(() => Promise.resolve()); // 忽略单个图片的错误
            }
            return Promise.resolve();
          });
          
          return Promise.all(fetchPromises);
        })
      );
    }
  }
});

// 模拟后台同步图片数据的函数
async function syncImages() {
  try {
    const response = await fetch('/api/images');
    if (response.ok) {
      const data = await response.json();
      // 更新IndexedDB或其他客户端存储
      // ...
      return true;
    }
    return false;
  } catch (error) {
    console.error('同步失败:', error);
    return false;
  }
}

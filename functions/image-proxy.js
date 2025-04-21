// Cloudflare Worker 增强版图片代理服务
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 处理OPTIONS请求（CORS预检）
  if (request.method === 'OPTIONS') {
    return handleCORS();
  }
  
  const imageUrl = url.searchParams.get('url');
  
  // 安全检查：确保提供了URL参数
  if (!imageUrl) {
    return new Response('Missing URL parameter', { 
      status: 400,
      headers: corsHeaders()
    });
  }
  
  try {
    const targetUrl = new URL(imageUrl);
    
    // 允许代理的域名列表
    const allowedDomains = [
      'raw.githubusercontent.com',
      'github.com',
      'githubusercontent.com',
      'i.imgur.com',
      'imgur.com',
      'assets.gpt4o-images-8vz.pages.dev'
    ];
    
    // 检查是否是允许的域名
    if (!allowedDomains.some(domain => targetUrl.hostname.includes(domain))) {
      return new Response('Domain not allowed', { 
        status: 403,
        headers: corsHeaders()
      });
    }
    
    // 构建请求选项
    const fetchOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GPT4OImagesProxy/1.0)',
        'Accept': 'image/*, */*;q=0.8',
        'Origin': url.origin,
        'Referer': url.origin
      },
      cf: {
        // 使用Cloudflare缓存
        cacheTtl: 86400, // 24小时缓存
        cacheEverything: true
      }
    };
    
    // 发起请求获取图片
    const response = await fetch(imageUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    // 获取原始响应的headers
    const originalHeaders = Object.fromEntries(response.headers.entries());
    
    // 创建新的响应头
    const headers = new Headers(corsHeaders());
    
    // 添加缓存相关头
    headers.set('Cache-Control', 'public, max-age=86400');
    headers.set('CF-Cache-Status', 'HIT');
    
    // 确定内容类型
    const contentType = determineContentType(imageUrl, response.headers.get('content-type'));
    headers.set('Content-Type', contentType);
    
    // 如果是图片，添加图片相关头
    if (contentType.startsWith('image/')) {
      headers.set('Content-Disposition', 'inline');
    }
    
    // 返回代理的响应
    return new Response(response.body, {
      headers,
      status: response.status
    });
  } catch (error) {
    console.error('Proxy error:', error);
    
    // 返回备用图片
    return serveFallbackImage(url.origin);
  }
}

// 处理CORS预检请求
function handleCORS() {
  return new Response(null, {
    status: 204, // No Content
    headers: corsHeaders()
  });
}

// 生成CORS头
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400', // 24小时
    'Access-Control-Allow-Credentials': 'true'
  };
}

// 确定内容类型
function determineContentType(url, originalContentType) {
  // 如果原始响应包含内容类型，优先使用
  if (originalContentType) {
    return originalContentType;
  }
  
  // 根据文件扩展名确定类型
  if (url.endsWith('.svg')) return 'image/svg+xml';
  if (url.endsWith('.png')) return 'image/png';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
  if (url.endsWith('.gif')) return 'image/gif';
  if (url.endsWith('.webp')) return 'image/webp';
  if (url.endsWith('.css')) return 'text/css';
  if (url.endsWith('.js')) return 'application/javascript';
  
  // 默认二进制数据
  return 'application/octet-stream';
}

// 提供备用图片
async function serveFallbackImage(origin) {
  try {
    // 尝试使用预定义的备用图片
    const fallbackResponse = await fetch(new URL('/fallback-image.svg', origin));
    
    if (fallbackResponse.ok) {
      const headers = new Headers(corsHeaders());
      headers.set('Content-Type', 'image/svg+xml');
      headers.set('Cache-Control', 'public, max-age=3600');
      
      return new Response(fallbackResponse.body, {
        headers,
        status: 200
      });
    }
  } catch (e) {
    console.error('Failed to fetch fallback image:', e);
  }
  
  // 如果无法获取备用图片，生成一个简单的SVG
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#6b9eff" />
    <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">图片加载失败</text>
  </svg>`;
  
  const headers = new Headers(corsHeaders());
  headers.set('Content-Type', 'image/svg+xml');
  headers.set('Cache-Control', 'public, max-age=3600');
  
  return new Response(svgContent, {
    headers,
    status: 200
  });
}

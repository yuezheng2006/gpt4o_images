// Cloudflare Workersu811au672cu7528u4e8eu8fdbu4e00u6b65u4f18u5316u7f51u7ad9u6027u80fd
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

/**
 * u5904u7406u8bf7u6c42u7684u4e3bu51fdu6570
 */
async function handleRequest(event) {
  const url = new URL(event.request.url)
  let options = {}

  try {
    // u68c0u67e5u662fu5426u4e3aAPIu8bf7u6c42
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(event)
    }

    // u5904u7406u9759u6001u8d44u6e90u8bf7u6c42
    const page = await getAssetFromKV(event, options)

    // u5141u8bb8u5ba2u6237u7aefu7f13u5b58
    const response = new Response(page.body, page)
    
    // u4e3au4e0du540cu7c7bu578bu7684u8d44u6e90u8bbeu7f6eu4e0du540cu7684u7f13u5b58u65f6u95f4
    if (url.pathname.endsWith('.html')) {
      response.headers.set('Cache-Control', 'public, max-age=3600') // 1u5c0fu65f6
    } else if (url.pathname.match(/\.(js|css|svg|png)$/)) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable') // 1u5e74
    } else if (url.pathname === '/sw.js') {
      // Service Workeru4e0du5e94u8be5u88abu957fu65f6u95f4u7f13u5b58
      response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    }

    // u542fu7528Brotli/Gzipu538bu7f29
    if (response.headers.get('content-type')?.includes('text/')) {
      response.headers.set('Content-Encoding', 'br')
    }

    return response
  } catch (e) {
    // u5982u679cu8d44u6e90u4e0du5b58u5728uff0cu8fd4u56deindex.htmluff08u5bf9SPAu5e94u7528u5f88u6709u7528uff09
    if (e.status === 404 || e.status === 400) {
      try {
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 200 })
      } catch (e) {}
    }

    return new Response(e.message || 'Error', { status: e.status || 500 })
  }
}

/**
 * u5904u7406APIu8bf7u6c42
 */
async function handleApiRequest(event) {
  const url = new URL(event.request.url)
  const path = url.pathname.replace('/api/', '')

  // u5904u7406u7279u5b9au7684APIu8defu5f84
  if (path === 'images') {
    // u8fd9u91ccu53efu4ee5u5b9eu73b0u4e00u4e2au7b80u5355u7684APIu6765u8fd4u56deu56feu7247u6570u636e
    // u5728u5b9eu9645u5e94u7528u4e2duff0cu8fd9u53efu80fdu4f1au4eceu6570u636eu5e93u6216u5176u4ed6u6e90u83b7u53d6u6570u636e
    return new Response(JSON.stringify({
      status: 'success',
      data: []
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    })
  }

  // u5982u679cu6ca1u6709u5339u914du7684APIu8defu5f84uff0cu8fd4u56de404
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * u5904u7406u6240u6709u8bf7u6c42
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

/**
 * u5b9au671fu9884u70edu7f13u5b58
 */
addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event))
})

async function handleScheduled(event) {
  // u8fd9u91ccu53efu4ee5u5b9eu73b0u5b9au671fu9884u70edu7f13u5b58u7684u903bu8f91
  console.log('Running scheduled task:', event.scheduledTime)
  
  // u4f8bu5982uff0cu53efu4ee5u9884u70edu91cdu8981u9875u9762
  const urls = [
    '/',
    '/index.html',
    '/assets/index-Cv-EYoPi.css',
    '/assets/index-CIfMqhYP.js'
  ]
  
  for (const url of urls) {
    try {
      await fetch(`https://gpt4o-images-8vz.pages.dev${url}`, {
        headers: { 'User-Agent': 'Cloudflare-Workers' }
      })
      console.log(`Preheated cache for: ${url}`)
    } catch (error) {
      console.error(`Failed to preheat cache for ${url}:`, error)
    }
  }
}

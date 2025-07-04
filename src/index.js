addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// robots.txt content
const ROBOTS_TXT = `# Block all known AI crawlers and assistants
# from using content for training AI models.
# Source: https://robotstxt.com/ai
User-Agent: GPTBot
User-Agent: ClaudeBot
User-Agent: Claude-User
User-Agent: Claude-SearchBot
User-Agent: CCBot
User-Agent: Google-Extended
User-Agent: Applebot-Extended
User-Agent: Facebookbot
User-Agent: Meta-ExternalAgent
User-Agent: Meta-ExternalFetcher
User-Agent: diffbot
User-Agent: PerplexityBot
User-Agent: Perplexity‑User
User-Agent: Omgili
User-Agent: Omgilibot
User-Agent: webzio-extended
User-Agent: ImagesiftBot
User-Agent: Bytespider
User-Agent: TikTokSpider
User-Agent: Amazonbot
User-Agent: Youbot
User-Agent: SemrushBot-OCOB
User-Agent: Petalbot
User-Agent: VelenPublicWebCrawler
User-Agent: TurnitinBot
User-Agent: Timpibot
User-Agent: OAI-SearchBot
User-Agent: ICC-Crawler
User-Agent: AI2Bot
User-Agent: AI2Bot-Dolma
User-Agent: DataForSeoBot
User-Agent: AwarioBot
User-Agent: AwarioSmartBot
User-Agent: AwarioRssBot
User-Agent: Google-CloudVertexBot
User-Agent: PanguBot
User-Agent: Kangaroo Bot
User-Agent: Sentibot
User-Agent: img2dataset
User-Agent: Meltwater
User-Agent: Seekr
User-Agent: peer39_crawler
User-Agent: cohere-ai
User-Agent: cohere-training-data-crawler
User-Agent: DuckAssistBot
User-Agent: Scrapy
User-Agent: Cotoyogi
User-Agent: aiHitBot
User-Agent: Factset_spyderbot
User-Agent: FirecrawlAgent

Disallow: /
DisallowAITraining: /

# Block any non-specified AI crawlers (e.g., new
# or unknown bots) from using content for training
# AI models, while allowing the website to be
# indexed and accessed by bots.  These directives
# are still experimental and may not be supported
# by all AI crawlers.
User-Agent: *
DisallowAITraining: /
Content-Usage: ai=n
Allow: /`

// Custom IP location favicon (SVG base64 encoded)
const FAVICON_SVG = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMC4yMzQgMjAuMjM0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8cGF0aCBmaWxsPSIjMDMwMTA0IiBkPSJNNi43NzYsNC43MmgxLjU0OXY2LjgyN0g2Ljc3NlY0LjcyeiBNMTEuNzUxLDQuNjY5Yy0wLjk0MiwwLTEuNjEsMC4wNjEtMi4wODcsMC4xNDN2Ni43MzVoMS41M1Y5LjEwNmMwLjE0MywwLjAyLDAuMzI0LDAuMDMxLDAuNTI3LDAuMDMxYzAuOTExLDAsMS42OTEtMC4yMjQsMi4yMTgtMC43MjFjMC40MDUtMC4zODYsMC42MjgtMC45NTIsMC42MjgtMS42MjFjMC0wLjY2OC0wLjI5NS0xLjIzNC0wLjcyOS0xLjU3OUMxMy4zODIsNC44NTEsMTIuNzAyLDQuNjY5LDExLjc1MSw0LjY2OXogTTExLjcwOSw3Ljk1Yy0wLjIyMiwwLTAuMzg1LTAuMDEtMC41MTYtMC4wNDFWNS44OTVjMC4xMTEtMC4wMywwLjMyNC0wLjA2MSwwLjYzOS0wLjA2MWMwLjc2OSwwLDEuMjA1LDAuMzc1LDEuMjA1LDEuMDAyQzEzLjAzNyw3LjUzNSwxMi41Myw3Ljk1LDExLjcwOSw3Ljk1eiBNMTAuMTE3LDBDNS41MjMsMCwxLjgsMy43MjMsMS44LDguMzE2czguMzE3LDExLjkxOCw4LjMxNywxMS45MThzOC4zMTctNy4zMjQsOC4zMTctMTEuOTE3UzE0LjcxMSwwLDEwLjExNywweiBNMTAuMTM4LDEzLjM3M2MtMy4wNSwwLTUuNTIyLTIuNDczLTUuNTIyLTUuNTI0YzAtMy4wNSwyLjQ3My01LjUyMiw1LjUyMi01LjUyMmMzLjA1MSwwLDUuNTIyLDIuNDczLDUuNTIyLDUuNTIyQzE1LjY2LDEwLjg5OSwxMy4xODgsMTMuMzczLDEwLjEzOCwxMy4zNzN6Ii8+Cjwvc3ZnPg=='

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type'
}

// Cache busting headers
const cacheBustingHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0'
}

// Documentation Header
const documentationHeader = {
  'Link': '<https://github.com/fili/ip.app>; rel="canonical"'
}

function extractIPFromForwarded(forwardedHeader) {
  if (!forwardedHeader) return null

  // Forwarded header format: "for=192.0.2.60;proto=http;by=203.0.113.43"
  // or: "for="[2001:db8:cafe::17]:4711""
  const forMatch = forwardedHeader.match(/for=([^;,\s]+)/)
  if (!forMatch) return null

  let ip = forMatch[1]

  // Remove quotes if present
  ip = ip.replace(/"/g, '')

  // Handle IPv6 in brackets with port: [2001:db8::1]:8080 -> 2001:db8::1
  if (ip.startsWith('[') && ip.includes(']:')) {
    ip = ip.substring(1, ip.indexOf(']:'))
  }
  // Handle IPv4 with port: 192.168.1.1:8080 -> 192.168.1.1
  else if (ip.includes(':') && !ip.includes('::')) {
    const parts = ip.split(':')
    if (parts.length === 2 && /^\d+$/.test(parts[1])) {
      ip = parts[0]
    }
  }

  return ip
}

function getClientIP(request) {
  const forwardedHeader = request.headers.get('Forwarded')
  const forwardedIP = extractIPFromForwarded(forwardedHeader)

  return request.headers.get('CF-Connecting-IP') ||
    forwardedIP ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    request.headers.get('X-Real-IP') ||
    'Unknown'
}

function isJsonRequested(request) {
  const acceptHeader = request.headers.get('Accept') || ''
  const url = new URL(request.url)

  return acceptHeader.includes('application/json') ||
    acceptHeader.includes('*/json') ||
    url.searchParams.get('json') === '1' ||
    url.searchParams.get('format') === 'json'
}

// Handle IP request
async function handleIPRequest(request) {
  const clientIP = getClientIP(request)
  const ipVersion = clientIP.includes(':') ? 'ipv6' : (clientIP.includes('.') ? 'ipv4' : '')
  const wantsJson = isJsonRequested(request)

  if (wantsJson) {
    const jsonResponse = { ip: clientIP, ip_version: ipVersion }
    const responseBody = request.method === 'HEAD' ? null : JSON.stringify(jsonResponse) + '\n'

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'x-ipapp-ip': clientIP,
        'x-ipapp-ip-version': ipVersion,
        'x-request-ip': clientIP,
        ...corsHeaders,
        ...cacheBustingHeaders,
        ...documentationHeader
      }
    })
  } else {
    const responseBody = request.method === 'HEAD' ? null : (clientIP + '\n')

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'x-ipapp-ip': clientIP,
        'x-ipapp-ip-version': ipVersion,
        'x-request-ip': clientIP,
        ...corsHeaders,
        ...cacheBustingHeaders,
        ...documentationHeader
      }
    })
  }
}

// Handle headers request
async function handleHeadersRequest(request) {
  const headers = {}
  const renamedHeaders = {}
  // Common proxy headers to filter out
  const proxyHeaders = [
    'via',
    'forwarded',
    'client-ip',
    'useragent_via',
    'proxy_connection',
    'xproxy_connection',
    'http_pc_remote_addr',
    'http_client_ip',
    'http_x_appengine_country',
    'x-real-ip',
    // Request/correlation tracing headers
    'x-correlation-id',
    'x-trace-id',
    // Other distributed tracing headers
    'b3',
    'x-ot-span-context',
    'sw8'
  ]

  // Copy headers, excluding Cloudflare-added and proxy headers
  for (const [key, value] of request.headers) {
    const lowerKey = key.toLowerCase()
    // Filter out CF headers, X-Forwarded headers, and common proxy headers
    if (!lowerKey.startsWith('cf-') && // Cloudflare headers
      !lowerKey.startsWith('x-forwarded-') && // X-Forwarded headers
      !lowerKey.startsWith('x-b3-') && // Zipkin B3 tracing headers
      !lowerKey.startsWith('x-datadog-') && // Datadog tracing headers
      !lowerKey.startsWith('x-envoy-') && // Envoy tracing headers
      !lowerKey.startsWith('x-amzn-') && // Amazon tracing headers
      !proxyHeaders.includes(lowerKey)) {
      headers[key] = value
    }
  }

  // Rename incoming headers, appending x-ipapp- to the original header name
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase()
    renamedHeaders['x-ipapp-header-' + lowerKey] = value
  }

  const wantsJson = isJsonRequested(request)
  const clientIP = getClientIP(request)
  const ipVersion = clientIP.includes(':') ? 'ipv6' : (clientIP.includes('.') ? 'ipv4' : '')

  if (wantsJson) {
    const responseBody = request.method === 'HEAD' ? null : JSON.stringify(headers, null, 2) + '\n'

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'x-ipapp-ip': clientIP,
        'x-ipapp-ip-version': ipVersion,
        ...corsHeaders,
        ...cacheBustingHeaders,
        ...documentationHeader,
        ...renamedHeaders
      }
    })
  } else {
    const headerText = Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    const responseBody = request.method === 'HEAD' ? null : (headerText + '\n')

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'x-ipapp-ip': clientIP,
        'x-ipapp-ip-version': ipVersion,
        ...corsHeaders,
        ...cacheBustingHeaders,
        ...documentationHeader,
        ...renamedHeaders
      }
    })
  }
}

async function handleRequest(request) {
  const url = new URL(request.url)

  // Only allow GET, POST, and HEAD methods
  if (!['GET', 'POST', 'HEAD'].includes(request.method)) {
    return new Response('Method not allowed. Use GET, POST, or HEAD.', {
      status: 405,
      headers: {
        'Content-Type': 'text/plain',
        'Allow': 'GET, POST, HEAD',
        ...corsHeaders,
        ...cacheBustingHeaders
      }
    })
  }

  // Handle www subdomain redirect
  if (url.hostname.startsWith('www.')) {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': url.toString().replace('www.', ''),
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders
      }
    })
  }

  // Redirect /docs to GitHub README
  if (url.pathname === '/docs') {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': 'https://github.com/fili/ip.app',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }

  // Serve favicon.ico
  if (url.pathname === '/favicon.ico') {
    const svgContent = atob(FAVICON_SVG)
    return new Response(svgContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400'
      }
    })
  }

  // Serve robots.txt
  if (url.pathname === '/robots.txt') {
    return new Response(ROBOTS_TXT, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400'
      }
    })
  }

  // Handle /headers route
  if (url.pathname === '/headers') {
    return handleHeadersRequest(request)
  }

  // Handle root path (IP address)
  if (url.pathname === '/') {
    return handleIPRequest(request)
  }

  // 404 for all other paths
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
      ...corsHeaders,
      ...cacheBustingHeaders,
      ...documentationHeader
    }
  })
}

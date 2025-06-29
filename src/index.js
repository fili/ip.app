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

async function handleRequest(request) {
  // Parse the URL to get the pathname
  const url = new URL(request.url)

  // Redirect /docs to GitHub README
  if (url.pathname === '/docs') {
    return new Response(null, {
      status: 301,
      headers: {
        'Location': 'https://github.com/fili/ip.app',
        'Cache-Control': 'public, max-age=3600' // Cache redirect for 1 hour
      }
    })
  }

  // Serve robots.txt
  if (url.pathname === '/robots.txt') {
    return new Response(ROBOTS_TXT, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    })
  }

  // Only serve IP on root path, everything else gets 404
  if (url.pathname !== '/') {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    })
  }

  // Get the client's IP address from various headers
  const forwardedHeader = request.headers.get('Forwarded')
  const forwardedIP = extractIPFromForwarded(forwardedHeader)

  const clientIP = request.headers.get('CF-Connecting-IP') ||
                   forwardedIP ||
                   request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
                   request.headers.get('X-Real-IP') ||
                   'Unknown'

  // Check if client accepts JSON
  const acceptHeader = request.headers.get('Accept') || ''
  const wantsJson = acceptHeader.includes('application/json') ||
                    acceptHeader.includes('*/json') ||
                    request.url.includes('json=1') ||
                    request.url.includes('format=json')

  // Set CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  // Only allow GET and POST methods
  if (!['GET', 'POST', 'HEAD'].includes(request.method)) {
    return new Response('Method not allowed. Use GET, POST, or HEAD.', {
      status: 405,
      headers: {
        'Content-Type': 'text/plain',
        'Allow': 'GET, POST, HEAD',
        ...corsHeaders
      }
    })
  }

  if (wantsJson) {
    // Return JSON response
    const jsonResponse = {
      ip: clientIP
    }

    const responseBody = request.method === 'HEAD' ? null : JSON.stringify(jsonResponse)

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Request-IP': clientIP,
        ...corsHeaders
      }
    })
  } else {
    // Return plain text response
    const responseBody = request.method === 'HEAD' ? null : (clientIP + '\n')

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Request-IP': clientIP,
        ...corsHeaders
      }
    })
  }
}

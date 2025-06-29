addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

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
        'X-Your-IP': clientIP,
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
        'X-Your-IP': clientIP,
        ...corsHeaders
      }
    })
  }
}

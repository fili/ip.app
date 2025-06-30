# IP.APP API

A free and easy way to request your current IP address. Without any ads, trackers, or weird requirements.

In addition to the `plain/text` response, this API also supports getting the IP address in [JSON](#json) format and in the
[HTTP Headers](https://http.dev/headers?utm_source=ip.app) responses (e.g. using the [HEAD](https://http.dev/head?utm_source=ip.app) method).

[![IP.APP API - Free easy to use API to check your IP address | Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=985169&theme=neutral&t=1751270589029)](https://www.producthunt.com/products/ip-app-api)

## Usage

The API supports the following [HTTP methods](https://http.dev/methods?utm_source=ip.app):
- [GET](https://http.dev/get?utm_source=ip.app)
- [POST](https://http.dev/post?utm_source=ip.app)
- [HEAD](https://http.dev/head?utm_source=ip.app)

The following [cURL](https://curl.se) and [Python](https://python.org) (using the [requests](https://requests.readthedocs.io) library) examples will return the IP address:

> Note: Since cURL does not need the URL to include the scheme, just using `ip.app` will work on most machines. However, if it doesn't, just add `https://` to the address.

### GET

Returns `plain text` or [JSON](#json) in HTTP response body.

#### cURL

```bash
curl ip.app
```

#### Python

```python
requests.get('https://ip.app').text.strip()
```

### POST

Returns `plain text` or [JSON](#json) in HTTP response body. Any [POST](https://http.dev/post?utm_source=ip.app) data submitted is ignored and disregarded.

#### cURL

```bash
curl -X POST ip.app
```

#### Python

```python
requests.post('https://ip.app').text.strip()
```

### HEAD

No HTTP response body is returned, only [HTTP headers](https://http.dev/headers?utm_source=ip.app) are returned.

#### cURL

```bash
curl -sI ip.app | grep -i "x-request-ip" | cut -d' ' -f2
```

#### Python

```python
requests.head('https://ip.app').headers.get('X-Request-IP', 'Unknown')
```

## JSON

The API returns a JSON response when using query parameters `?format=json` or `?json=1`. For example:

```bash
https://ip.app?format=json
https://ip.app?json=1
```

The API also returns a JSON response when the [Accept](https://http.dev/accept?utm_source=ip.app) header contains either one of the following values:

```bash
application/json
*/json
```

The HTTP response body will be like:

```json
{
  "ip": "1.1.1.1",
}
```

### JSON Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ip` | String | The public IP address of the requesting client (IPv4 or IPv6), or `Unknown` when no IP address is detected | `1.1.1.1`, `2001:db8::1`, `Unknown` |

### JSON examples

Try the following examples:

#### cURL

Using the query parameter `?format=json`:

```bash
curl -s https://ip.app?format=json | grep -o '"ip":"[^"]*"' | cut -d'"' -f4
```

Using the `Accept` header:

```bash
curl -s -H "Accept: application/json" https://ip.app | grep -o '"ip":"[^"]*"' | cut -d'"' -f4
```


#### Python

Using the query parameter `?json=1`:

```python
requests.get('https://ip.app?json=1').json().get('ip', 'Unknown')
```

Using the `Accept` header:

```python
requests.get('https://ip.app', headers={'Accept': 'application/json'}).json().get('ip', 'Unknown')
```

## X-Request-IP HTTP Header

The API returns with every HTTP request a `X-Request-IP` HTTP header, which includes the public IP address of the requesting client (IPv4 or IPv6), or `Unknown` when no IP address is detected.

Since the IP address is included in the [HTTP header](https://http.dev/headers?utm_source=ip.app), response, it can be efficiently retrieved using just a [HEAD](https://http.dev/head?utm_source=ip.app) request without needing to download the response body. This makes it particularly useful for applications that want to avoid the overhead of initiating a [GET](https://http.dev/get?utm_source=ip.app) request and downloading and reading the HTTP response body.

For examples, check out the [HEAD](#head) examples under [Usage](#usage).

## Response Values

The API returns one of the following response values across all formats (`plain text`, [JSON](#json), and [HTTP header](#x-request-ip-http-header)):

- **IP Address**: The detected public IP address in IPv4 format (e.g., `1.1.1.1`) or IPv6 format (e.g., `2001:db8::1`)
- **Unknown**: Returned as a fallback when no IP address is detected

## Status Codes

The API returns the following [HTTP status codes](https://http.dev/status?utm_source=ip.app):

| Status Code | Description |
|-------------|-------------|
| `200` | Successful request - IP address returned |
| `301` | Redirect to documentation |
| `404` | Not found - invalid endpoint |
| `429` | Too many requests - rate limiting applied |
| `1015` | Rate limiting - requests blocked due to rate limits |

## Accepted Paths

The API accepts requests to the following paths:

| Path | Description |
|------|-------------|
| `/` | Main endpoint - returns IP address |
| `/docs` | Redirects to the API documentation |
| `/robots.txt` | Robots exclusion file, based on [robotstxt.com/ai](https://robotstxt.com/ai?utm_source=ip.app) |
| `/favicon.ico` | Favicon icon |

All other paths return a [404 status code](https://http.dev/404?utm_source=ip.app).


## Rate Limiting

Rate limiting is enabled to ensure fair usage of the API. Requests exceeding the rate limit will receive a `429` or `1015` status code response.

## Geographic Restrictions

Certain countries are blocked from using this API due to historic abuse patterns. Users from these countries will not be able to access the service.

## Ideas / Questions / Suggestions

I want to thank you for your enthusiasm and request that you please create an [issue](https://github.com/fili/ip.app/issues/new) in this repository.

## Sponsoring

If you find this API useful and like to assist paying for domain renewal and data traffic costs, please consider [sponsering this API](https://github.com/sponsors/fili).

## Credits

This API is inspired by [icanhazip](https://icanhazip.com), which operates in a similar way but does not support IP reporting in a [HEAD](#x-request-ip-http-header) or [JSON](#json) response.

## License
- Code: MIT License
- Favicon (decoded): CC0 Public Domain

## Disclaimer

**IMPORTANT: The website/API does not initiate any outbound HTTP or network requests of any kind and only responds to inbound requests made by external clients. There is no active scanning, tracking, exploitation, or malware distribution occurring from ip.app. If you are seeing requests to ip.app from within your network or systems, it means a client or device within your network or system has reached out to the API — not the other way around.**

This website/API may be abused by malware or fraud software. Please note, that as this a service for everyone, I can not control how it is (ab)used. However, it is important to note that the website/API and the software itself is not malware or fraudelant software or part of a malware infection. The website/API only returns public IP addresses based on the requester's IP address. Best efforts to reduce potential abuse is made using available Cloudflare functionality.

If you have any questions or abuse concerns, please email [abuse@ip.app](mailto:abuse@ip.app).

This website/API is coded by SEO expert and ex-Google engineer [Fili](https://fili.com/?utm_source=ip.app) and is under constant development as improvements are made over time.

Bugs will happen. Despite best efforts to maintain the code base and data quality, no guarantees can or will be given. Data may be incomplete and/or errors may occur. This is a personal website and for-fun project. [Use at your own risk](https://fili.com/d/?utm_source=ip.app).

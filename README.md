# IP.APP API

A free and easy way to request your current IP address. Without any ads, trackers, or weird requirements.

In addition to the `plain/text` response, this API also supports getting the IP address in JSON and
[HTTP Headers](https://http.dev/headers?utm_source=ip.app) responses (e.g. using the [HEAD](https://http.dev/head?utm_source=ip.app) method).

## JSON

The API returns a JSON response when using query parameters `?format=json` or `?json=1`. For example:

```bash
https://ip.app/?format=json
https://ip.app/?json=1
```

The API also returns a JSON response when the [Accept](https://http.dev/accept?utm_source=ip.app) header contains either one of the following:

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

### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ip` | String | The public IP address of the requesting client (IPv4 or IPv6), or `Unknown` when no IP address is detected | `1.1.1.1`, `2001:db8::1`, `Unknown` |


## X-Request-IP HTTP Header

The API returns with every HTTP request a `X-Request-IP` HTTP header, which includes the public IP address of the requesting client (IPv4 or IPv6), or `Unknown` when no IP address is detected.

The API supports the following [HTTP methods](https://http.dev/methods?utm_source=ip.app):
- [GET](https://http.dev/get?utm_source=ip.app)
- [POST](https://http.dev/post?utm_source=ip.app) - Any POST data submitted is ignored and disregarded.
- [HEAD](https://http.dev/head?utm_source=ip.app)

The following [cURL](https://curl.se?utm_source=ip.app) examples will return the IP address:

### HEAD

```bash
curl -sI ip.app | grep -i "X-Request-IP" | cut -d' ' -f2
```

### GET

```bash
curl ip.app
```

### POST

```bash
curl -X POST ip.app
```

*Note: Since cURL does not need the URL to include the scheme, just using `ip.app` will work on most machines. However, if it doesn't, just add `http://` to the address.*

## Response Values

The API returns one of the following response values across all formats (plain text, JSON, and HTTP header):

- **IP Address**: The detected public IP address in IPv4 format (e.g., `1.1.1.1`) or IPv6 format (e.g., `2001:db8::1`)
- **Unknown**: Returned as a fallback when no IP address is detected

## Status Codes

The API returns the following HTTP status codes:

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

All other paths return a [404 status code](https://http.dev/404?utm_source=ip.app).


## Rate Limiting

Rate limiting is enabled to ensure fair usage of the API. Requests exceeding the rate limit will receive a `429` or `1015` status code response.

## Geographic Restrictions

Certain countries are blocked from using this API due to historic abuse patterns. Users from these countries will not be able to access the service.

## Ideas, Questions, Suggestions

I want to thank you for your enthusiasm and request that you please create an [issue](https://github.com/fili/ip.app/issues/new) in this repository.

## Sponsoring

If you find this API useful and like to assist paying for domain renewal and data traffic costs, please consider [sponsering this API](https://github.com/sponsors/fili).

## Credits

This API is inspired by [icanhazip](http://icanhazip.com), which operates in a similar way but does not support IP reporting in a HEAD or JSON response.

## Disclaimer

**IMPORTANT: The website/API does not initiate any outbound HTTP or network requests of any kind and only responds to inbound requests made by external clients. There is no active scanning, tracking, exploitation, or malware distribution occurring from ip.app. If you are seeing requests to ip.app from within your network or systems, it means a client or device within your network or system has reached out to the API — not the other way around.**

This website/API may be abused by malware or fraud software. Please note, that as this a service for everyone, I can not control how it is (ab)used. However, it is important to note that the website/API and the software itself is not malware or fraudelant software or part of a malware infection. The website/API only returns public IP addresses based on the requester's IP address. Best efforts to reduce potential abuse is made using available Cloudflare functionality.

If you have any questions or abuse concerns, please email [abuse@ip.app](mailto:abuse@ip.app).

This website/API is coded by SEO expert and ex-Google engineer [Fili](https://fili.com/?utm_source=ip.app) and is under constant development as improvements are made over time.

Bugs will happen. Despite best efforts to maintain the code base and data quality, no guarantees can or will be given. Data may be incomplete and/or errors may occur. This is a personal website and for-fun project. [Use at your own risk](https://fili.com/d/?utm_source=ip.app).

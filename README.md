# IP.APP API

A free and easy way to check your current IP address or the HTTP headers your browser is sending.

> Without any ads, trackers, or weird requirements.

In addition to the `plain/text` response, this API also supports the [JSON](#json) format and
[HTTP Headers](https://http.dev/headers?utm_source=ip.app) responses (e.g. using the [HEAD](https://http.dev/head?utm_source=ip.app) method).

The API always returns the IP address as `x-ipapp-ip` and the IP version as `x-ipapp-ip-version` in the HTTP headers for all endpoints. So no matter which endpoint you use or which format you use (e.g. [JSON](#json) or `plain/text`) or which request method you use (e.g. [HEAD](https://http.dev/head?utm_source=ip.app) or [GET](https://http.dev/get?utm_source=ip.app) or [POST](https://http.dev/post?utm_source=ip.app)), you will always have the IP address and version available in the [HTTP headers](https://http.dev/headers?utm_source=ip.app).

## Endpoints

The API accepts requests to the following paths:

| Path | Name | Description |
|------|------|-------------|
| `/` | IP address | Endpoint for returning the current IP address |
| `/headers` |  HTTP headers | Endpoint for returning HTTP headers the client sent to the server |
| `/asn` | ASN | Endpoint for returning the ASN of the current IP address |


The API endpoints supports the following [HTTP methods](https://http.dev/methods?utm_source=ip.app):
- [GET](https://http.dev/get?utm_source=ip.app)
- [POST](https://http.dev/post?utm_source=ip.app)
- [HEAD](https://http.dev/head?utm_source=ip.app)

## Usage

### Endpoint: IP address

The following [cURL](https://curl.se) and [Python](https://python.org) (using the [requests](https://requests.readthedocs.io) library) examples will return the IP address of the requesting client.

> Note: Since cURL does not need the URL to include the scheme, just using `ip.app` will work on most machines. However, if it doesn't, just add `https://` to the address.

#### GET

Returns `plain text` or [JSON](#getting-the-ip-address-in-json-format) in HTTP response body.

##### cURL

```bash
curl ip.app
```

##### Python

```python
requests.get('https://ip.app').text.strip()
```

##### wget

```bash
wget -qO- ip.app
```

##### JavaScript

```js
const ip_address = (await (await fetch('https://ip.app/')).text()).trim()
```

##### PHP

```php
trim(file_get_contents('https://ip.app'))
```

##### Perl

```perl
perl -MLWP::Simple -E 'say get("https://ip.app") =~ s/\s+$//r'
```

##### Ruby

```ruby
require 'net/http'; Net::HTTP.get(URI('https://ip.app')).strip
```

##### PowerShell

```bash
(Invoke-WebRequest ip.app).Content.Trim()
```

##### C# (with using statements in scope)

```c
(await new HttpClient().GetStringAsync("https://ip.app")).Trim()
```

##### Swift

```swift
try String(contentsOf: URL(string: "https://ip.app")!).trimmingCharacters(in: .whitespacesAndNewlines)
```

##### Dart/Flutter

```js
(await http.get(Uri.parse('https://ip.app'))).body.trim()
```

##### Rust (with reqwest crate)

```rust
reqwest::get("https://ip.app").await?.text().await?.trim()
```

##### HTTPie

```bash
http --body ip.app
```

##### Using netcat (with timeout) and HTTP

```bash
echo -e "GET / HTTP/1.1\r\nHost: ip.app\r\nConnection: close\r\n\r" | nc -w 3 ip.app 80 | tail -1
```

#### POST

Returns `plain text` or [JSON](#getting-the-ip-address-in-json-format) in HTTP response body. Any [POST](https://http.dev/post?utm_source=ip.app) data submitted is ignored and disregarded.

##### cURL

```bash
curl -X POST ip.app
```

##### Python

```python
requests.post('https://ip.app').text.strip()
```

#### HEAD

No HTTP response body is returned, only [HTTP headers](https://http.dev/headers?utm_source=ip.app) are returned.

##### cURL

```bash
curl -sI ip.app | grep -i "x-ipapp-ip" | cut -d' ' -f2
```

##### Python

```python
requests.head('https://ip.app').headers.get('x-ipapp-ip', 'Unknown')
```

#### Response Values

The API endpoint `/` returns one of the following response values across all formats (`plain text`, [JSON](#getting-the-ip-address-in-json-format), and [HTTP header](#x-ipapp-ip-http-header)):

- **IP Address**: The detected public IP address in IPv4 format (e.g., `1.1.1.1`) or IPv6 format (e.g., `2001:db8::1`).
- **Unknown**: Returned as a fallback when no IP address is detected.

The API endpoint `/` will also return in [JSON](#getting-the-ip-address-in-json-format), and [HTTP header](#x-ipapp-ip-http-header) the following response values:

- **IP Version**: The version of the detected IP address, e.g. `ipv4` or `ipv6` or empty string.

### Endpoint: HTTP headers

The following [cURL](https://curl.se) and [Python](https://python.org) (using the [requests](https://requests.readthedocs.io) library) examples will return the [HTTP headers](https://http.dev/headers?utm_source=ip.app) the requesting client (e.g. your browser) is sending to the server.

> Note: Since cURL does not need the URL to include the scheme, just using `ip.app` will work on most machines. However, if it doesn't, just add `https://` to the address.

#### GET

Returns `plain text` or [JSON](#getting-the-requesting-http-headers-in-json-format) in HTTP response body.

##### cURL

```bash
curl ip.app/headers
```

##### Python

```python
requests.get('https://ip.app/headers').text
```

##### wget

```bash
wget -qO- ip.app/headers
```

#### POST

Returns `plain text` or [JSON](#getting-the-requesting-http-headers-in-json-format) in HTTP response body. Any [POST](https://http.dev/post?utm_source=ip.app) data submitted is ignored and disregarded.

##### cURL

```bash
curl -X POST ip.app/headers
```

##### Python

```python
requests.post('https://ip.app/headers').text
```

#### HEAD

No HTTP response body is returned, only [HTTP headers](https://http.dev/headers?utm_source=ip.app) are returned. All HTTP headers sent by the requesting client (e.g. your browser) are returned alongside the HTTP server response headers, however the names of the client's HTTP headers start with `x-ipapp-`.

##### cURL

Read the HTTP headers in HEAD response and extract only the request headers:

```bash
curl -sI ip.app/headers | grep -i "x-ipapp-header-"
```

Removing the `x-ipapp-header-` prefix:

```bash
curl -sI ip.app/headers | grep -i "x-ipapp-header-" | sed 's/x-ipapp-header-//i'
```

##### Python

Read the HTTP headers in HEAD response, extract only the request headers and removing the `x-ipapp-header-` prefix:

```python
response = requests.head('https://ip.app/headers')
for key, value in response.headers.items():
    if key.lower().startswith('x-ipapp-header-'):
        clean_key = key[8:]  # Remove 'x-ipapp-header-' prefix
        print(f"{clean_key}: {value}")
```

One-liner:

```python
{k[8:]: v for k, v in requests.head('https://ip.app/headers').headers.items() if k.lower().startswith('x-ipapp-header-')}
```

#### Response Values

The API endpoint `/headers` returns one of the following response values across the formats `plain text` and [JSON](#json):

- **Key: Value pairs**: representing the HTTP headers the requesting client sent to the server.
- **Empty Response**: An empty response or `{}` as no headers were sent.

### Endpoint: ASN

The following [cURL](https://curl.se) and [Python](https://python.org) (using the [requests](https://requests.readthedocs.io) library) examples will return the ASN of the current IP address.

#### GET

Returns `plain text` or [JSON](#getting-the-requesting-http-headers-in-json-format) in HTTP response body.

##### cURL

```bash
curl ip.app/asn
```

##### Python

```python
requests.get('https://ip.app/asn').text
```

##### wget

```bash
wget -qO- ip.app/asn
```

#### POST

Returns `plain text` or [JSON](#getting-the-requesting-http-headers-in-json-format) in HTTP response body. Any [POST](https://http.dev/post?utm_source=ip.app) data submitted is ignored and disregarded.

##### cURL

```bash
curl -X POST ip.app/asn
```

##### Python

```python
requests.post('https://ip.app/asn').text
```

#### HEAD

No HTTP response body is returned, only [HTTP headers](https://http.dev/headers?utm_source=ip.app) are returned. All HTTP headers sent by the requesting client (e.g. your browser) are returned alongside the HTTP server response headers, however the names of the client's HTTP headers start with `x-ipapp-`.

##### cURL

Read the ASN in HEAD response and extract only the request headers:

```bash
curl -sI ip.app/asn | grep -i "x-ipapp-asn"
```

Removing the `x-ipapp-asn-` prefix:

```bash
curl -sI ip.app/asn | grep -i "x-ipapp-asn-" | sed 's/x-ipapp-asn-//i'
```

##### Python

Read the ASN in HEAD response, extract only the relevant request headers:

```python
requests.head('https://ip.app/asn').headers.get('x-ipapp-asn', '')
```

#### Response Values

The API endpoint `/asn` returns one of the following response values across the formats `plain text` and [JSON](#json):

- **Key: Value pairs**: representing the ASN of the current IP address. Where the key is the ASN number, starting with `AS` and the value is the ASN organization name, separated by a colon and a space `: `.
- **Empty Response**: An empty response or `{}` as no ASN was found.


## JSON

The API endpoints returns a JSON response when using query parameters `?format=json` or `?json=1`. For example:

```bash
https://ip.app?format=json
https://ip.app?json=1
```

The API endpoints also returns a JSON response when the [Accept](https://http.dev/accept?utm_source=ip.app) header contains either one of the following values:

```bash
application/json
*/json
```

The HTTP response body for the endpoint `/` will be like:

```json
{
  "ip": "1.1.1.1",
  "ip_version": "ipv4"
}
```

Whereas the HTTP response body for the endpoint `/headers` will be like:

```json
{
  "accept": "*/*",
  "accept-encoding": "gzip",
  "connection": "Keep-Alive",
  "host": "ip.app",
  "user-agent": "curl/8.5.0"
}
```

### JSON Response Fields

#### Endpoint: IP address of the requesting client

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ip` | String | The public IP address of the requesting client (IPv4 or IPv6), or `Unknown` when no IP address is detected | `1.1.1.1`, `2001:db8::1`, `Unknown` |

#### Endpoint: HTTP Headers sent by the requesting client

The fields returned depends heavily on the requesting client used, which is different for each client and why this endpoint exists.

Here is a response example from cURL:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `accept` | String | [Accept](https://http.dev/accept?utm_source=ip.app) | `*/*` |
| `accept-encoding` | String | [Accept-Encoding](https://http.dev/accept-encoding?utm_source=ip.app) | `gzip` |
| `connection` | String | [Connection](https://http.dev/connection?utm_source=ip.app) | `Keep-Alive` |
| `host` | String | [Host](https://http.dev/host?utm_source=ip.app) | `ip.app` |
| `user-agent` | String | [User-Agent](https://http.dev/user-agent?utm_source=ip.app) | `curl/8.5.0` |

More information on [HTTP Headers](https://http.dev/headers?utm_source=ip.app) sent by the requesting client.

### JSON examples

Try the following examples:

#### Getting the IP address in JSON format

#####  cURL

Using the query parameter `?format=json`:

```bash
curl -s ip.app?format=json
```

Using the `Accept` header:

```bash
curl -s -H "Accept: application/json" ip.app
```

##### Python

Using the query parameter `?json=1`:

```python
requests.get('https://ip.app?json=1').json().get('ip', 'Unknown')
```

Using the `Accept` header:

```python
requests.get('https://ip.app', headers={'Accept': 'application/json'}).json().get('ip', 'Unknown')
```

#### Returning only the IP address from JSON format

##### cURL

Using the query parameter `?json=1`:

```bash
curl -s ip.app?json=1 | grep -o '"ip":"[^"]*"' | cut -d'"' -f4
```

Using the `Accept` header:

```bash
curl -s -H "Accept: application/json" ip.app | grep -o '"ip":"[^"]*"' | cut -d'"' -f4
```

#### Getting the requesting HTTP headers in JSON format

##### cURL

Using the query parameter `?json=1`:

```bash
curl -s ip.app/headers?json=1
```

Using the `Accept` header:

```bash
curl -s -H "Accept: application/json" ip.app/headers
```

##### Python

Using the query parameter `?format=json`:

```python
requests.get('https://ip.app/headers?format=json').json()
```

Using the `Accept` header:

```python
requests.get('https://ip.app/headers', headers={'Accept': 'application/json'}).json()
```

## x-ipapp-ip HTTP Header

The API returns with every HTTP request a `x-ipapp-ip` HTTP header, which includes the public IP address of the requesting client (IPv4 or IPv6), or `Unknown` when no IP address is detected.

Since the IP address is included in the [HTTP header](https://http.dev/headers?utm_source=ip.app), response, it can be efficiently retrieved using just a [HEAD](https://http.dev/head?utm_source=ip.app) request without needing to download the response body. This makes it particularly useful for applications that want to avoid the overhead of initiating a [GET](https://http.dev/get?utm_source=ip.app) request and downloading and reading the HTTP response body.

For examples, check out the [HEAD](#head-1) examples under [Usage](#endpoint-ip-address).

## x-ipapp-ip-version HTTP Header

The API returns with every HTTP request a `x-ipapp-ip-version` HTTP header, which returns the version of the detected public IP address of the requesting client  and is either `ipv4` or `ipv6`, or `''` (an empty string) when no valid IP address is detected.

Since the IP address version is included in the [HTTP header](https://http.dev/headers?utm_source=ip.app), response, it can be efficiently retrieved using just a [HEAD](https://http.dev/head?utm_source=ip.app) request without needing to download the response body. This makes it particularly useful for applications that want to avoid the overhead of initiating a [GET](https://http.dev/get?utm_source=ip.app) request and downloading and reading the HTTP response body.

For examples, check out the [HEAD](#head-1) examples under [Usage](#endpoint-ip-address).

## Status Codes

The API returns the following [HTTP status codes](https://http.dev/status?utm_source=ip.app):

| Status Code | Description |
|-------------|-------------|
| [`200`](https://http.dev/200?utm_source=ip.app) | Successful request - IP address returned |
| [`301`](https://http.dev/301?utm_source=ip.app) | Redirects to documentation |
| [`404`](https://http.dev/404?utm_source=ip.app) | Not found - invalid endpoint |
| [`429`](https://http.dev/429?utm_source=ip.app) | Too many requests - rate limiting applied |
| `1015` | Rate limiting - requests blocked due to rate limits |

## Other Accepted Paths

The API accepts requests to the following paths:

| Path | Description |
|------|-------------|
| `/docs` | Redirects to the API documentation |
| `/robots.txt` | Robots exclusion file, based on [robotstxt.com/ai](https://robotstxt.com/ai?utm_source=ip.app) |
| `/favicon.ico` | Favicon icon |

All other paths return a [404 status code](https://http.dev/404?utm_source=ip.app).

## Rate Limiting

Rate limiting is enabled to ensure fair usage of the API. Requests exceeding the rate limit will receive a `429` or `1015` status code response.

## Geographic Restrictions

Certain countries are blocked from using this API due to historic abuse patterns. Users from these countries will not be able to access the service.

## Changelog

### 2025-07-03

- **New endpoint `/headers`**: Added a new endpoint which returns the HTTP headers the requesting client (e.g. your browser) is sending to the server.
- **Breaking change**: Removed renamed HTTP header `x-request-ip` from the code base and HTTP responses.
- **Examples**: Added more [GET](https://http.dev/get?utm_source=ip.app) request examples for the [IP address endpoint](#endpoint-ip-address), using different programming languages and command line tools.

### 2025-07-02

- **Breaking change**: Renamed the `x-request-ip` HTTP header to `x-ipapp-ip` to prevent future conflicts and unify the naming convention for all endpoints.
- **IP version**: Added IP version to [JSON](#getting-the-ip-address-in-json-format) and [HEAD](#x-ipapp-ip-version-http-header) responses.

Important news and/or status updates will also be announced on BlueSky: [@ip.app](https://bsky.app/profile/ip.app)

## Ideas / Questions / Suggestions

Thank you for your enthusiasm, please create an [issue](https://github.com/fili/ip.app/issues/new) in this repository.

## Sponsoring

If you find this API useful and like to assist paying for domain renewal and data traffic costs, please consider [sponsering this API](https://github.com/sponsors/fili).

## Credits

This API is inspired by [icanhazip](https://icanhazip.com), which operates in a similar way but has less endpoints and does not support IP reporting using the [HEAD](#x-ipapp-ip-http-header) method or in a [JSON](#getting-the-ip-address-in-json-format) format.

Especially getting the information using the [HEAD](#x-ipapp-ip-http-header) method is the primary reason why this API was launched. None of the other many alternatives found support the [HEAD](https://http.dev/head?utm_source=ip.app) method either.

## License
- Code: MIT License
- Favicon (decoded): CC0 Public Domain

## Disclaimer

**IMPORTANT: The website/API does not initiate any outbound HTTP or network requests of any kind and only responds to inbound requests made by external clients. There is no active scanning, tracking, exploitation, or malware distribution occurring from ip.app. If you are seeing requests to ip.app from within your network or systems, it means a client or device within your network or system has reached out to the API — not the other way around.**

This website/API may be abused by malware or fraud software. Please note, that as this a service for everyone, I can not control how it is (ab)used. However, it is important to note that the website/API and the software itself is not malware or fraudelant software or part of a malware infection. The website/API only returns public IP addresses based on the requester's IP address. Best efforts to reduce potential abuse is made using available Cloudflare functionality.

If you have any questions or abuse concerns, please email [abuse@ip.app](mailto:abuse@ip.app).

This website/API is coded by SEO expert and ex-Google engineer [Fili](https://fili.com/?utm_source=ip.app) and is under constant development as improvements are made over time.

Bugs will happen. Despite best efforts to maintain the code base and data quality, no guarantees can or will be given. Data may be incomplete and/or errors may occur. This is a personal website and for-fun project. [Use at your own risk](https://fili.com/d/?utm_source=ip.app).

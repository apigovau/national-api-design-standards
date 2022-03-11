______________________________________________________________________________
# Networking

## Caching

Implementing caching is not a one size fit all approach. Caching can occur in many parts of the network and can happen with unwanted and unintended results.

Not all APIs require caching such as serving live data fields (a stock market price) API may desire no caching. It is important to understand how HTTP caching can impact your API.

There are two HTTP cache headers: `Cache-Control` and `Expires`.

### Cache-Control

`Cache-Control` notifies if the client agent should cache. It supports three main values:

- `public`
- `private`; and
- `no-cache`.

If set to `public`; caching can occur anywhere within the network traffic such as intermediate proxies.

If set to `private`; only the client agent is allowed to cache.

If set to `no-cache`; no caching should be done - though this is not always the case due to the complexity of the network.

Accompanying `Cache-Control`; is the `max-age`. The `max-age` is defined in seconds and how long the response can be cached before it is considered stale.

Example: – Any part of the network can cache the content for one hour:

```
Cache-Control: public, max-age=3600
```

### Expires

The `Expires` directive when used alongside `Cache-Control` sets a date when the content is considered stale.

If both `Expires` and `max-age` is specified `max-age` will take precedence.

Example: - `Cache-Control` with `Expires`

```
Cache-Control: public

Expires: Mon, 25 Jun 2019 21:31:12 GMT

```

### Caching in the API Gateway

To reduce load the API Gateway offers a manage cache service.

The API Gateway provides its own local copy of the cache but registers a cache event listener that replicates messages to the other caches across the WoG API Gateway Network so that put, remove, expiry and delete events on a single cache are duplicated across all other caches.

Further information about caching in your API can be discussed with the WoG API Team at [apiteam@dpc.vic.gov.au](apiteam@dpc.vic.gov.au).

______________________________________________________________________________
# Pagination

APIs **SHOULD** follow a "pagination first" policy.

Pagination is **RECOMMENDED** to:

1. serve requests in a timely manner (e.g. > 2s)
2. ensure the amount of data returned remains within a manageable payload (e.g. > 500kb)
3. ensure the data in the response is easily manageable to improve the user experience.

## Query Parameters

When pagination is implemented, the following query parameters **MUST** be used:

| Query Parameter | Description | Example |
| --- | --- | --- |
| `page` | The page that the user wants to return. | `page=1` (default: 1)|
| `limit` | The number of results per page the user wants to return. | `limit=10` (default: 10)|

This creates a URI structure as follows:

Page 1: `/customers?page=1&limit=10`

Page 2: `/customers?page=2&limit=10`

...

Page 50: `/customers?page=50&limit=10`

This structure is useful as it is easy to understand and can be directly included in a UI.

**Common Terms**

The following parameters are also common across REST APIs but are not to be used in this specification.

- `offset` and `limit`. This is common in SQL databases and is a good option when you need stable permalinks to result sets however usability of the `offset` parameter can be difficult so `page` is preferred.
  
- `since` and `limit`. Get everything "since" some ID or timestamp. These are useful when it is a priority to let clients efficiently stay "in sync" with data however they generally require the result set order to be very stable.

## Pagination Response

When pagination is implemented, it is **RECOMMENDED** for the response body to include `_meta` and `_links` fields to provide the client with appropriate information about the result set, and for easy navigation within the collection. The fields can also remove the need for clients to unnecessarily parse query parameters to continue navigating the collection.

- The `_links` field **SHOULD** include links for `self`, `first`, `last`, `next` and `prev`.
- Each link **MUST** include any additional query string parameters provided in the original request.

An example of this response body is as follows:

```javascript
{
  "_meta": {
    "processing_time": "10 milliseconds",
    "processing_time_ms": 10,
    "total_records": 38,
    "page": 3,
    "limit": 10,
    "count": 8
  },
  "_links": [
    {
      "href": "/customers?page=3&limit=10",
      "rel": "self"
    },
    {
      "href": "/customers?page=1&limit=10",
      "rel": "first"
    },
    {
      "href": "/customers?page=5&limit=10",
      "rel": "last"
    },
    {
      "href": "/customers?page=2&limit=10",
      "rel": "prev"
    },
    {
      "href": "/customers?page=4&limit=10",
      "rel": "next"
    }
  ],
  "customers": ...
}
```

The following is the **RECOMMENDED** structure of the Metadata object:

```yml
metaModel:
    description: Metadata object model
    readOnly: true
    type: object
    properties:
      processing_time:
        type: string
        description: "The processing time for this request in human readable format."
        example: "10 milliseconds"
      processing_time_ms:
        type: integer
        description: "The processing time for this request in milliseconds."
        example: 10
      total_records:
        type: integer
        description: "Total number of the results which meets the search criteria regardless of the page and limit."
        example: 38
      page:
        type: integer
        description: "The current page for this collection request."
        example: 3
      limit:
        type: integer
        description: "The number of records per page."
        example: 10
      count:
        type: integer
        description: "Number of records in the current page"
        example: 8
```

## Out of Range

If the client requests a page that this out of the valid range for the collection, for example if the valid page range is `1 to 15`, but the client requests `?page=0` or `?page=999999`, then the response body **SHOULD** contain an empty collection with HTTP Status code as `200`.

An example of the response is as follows:

```javascript
{
  "_meta": {
    "processing_time": "10 milliseconds",
    "processing_time_ms": 10,
    "total_records": 38
  },
  "_links": [
    {
      "href": "/customers?page=99999&limit=10",
      "rel": "self"
    },
    {
      "href": "/customers?page=1&limit=10",
      "rel": "first"
    },
    {
      "href": "/customers?page=15&limit=10",
      "rel": "last"
    }
  ],
  "customers": []
}
```

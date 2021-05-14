______________________________________________________________________________
# Pagination

APIs **SHOULD** follow a "pagination first" policy.

Pagination is **RECOMMENDED** to:

1. serve requests in a timely manner (e.g. < 2s)
2. ensure the amount of data returned remains within a manageable payload (e.g. < 500kb)
3. ensure the data in the response is easily manageable to improve the user experience.

## Query Parameters

When pagination is implemented, the following query parameters **MUST** be used:

| Query Parameter | Description | Example |
| --- | --- | --- |
| `page` | The page that the user wants to return. | `page=1` (default: 1)|
| `page-size` | the number of records to return in each page. | `page-size=10` (default: 25)|

This creates a URI structure as follows:

Page 1: `/customers?page=1&page-size=10`

Page 2: `/customers?page=2&page-size=10`

...

Page 50: `/customers?page=50&page-size=10`

This structure is useful as it is easy to understand and can be directly included in a UI.

### Other Pagination Patterns

Other allowable pagination strategies include (but are not limited to): page-based, offset-based, and cursor-based. The page query parameter can be used as a basis for any of these strategies. For example, an offset-based strategy might use page-offset and page-limit e.g. ‘?page-offset=0&page-limit=10’, while a cursor-based strategy might use page-cursor.

## Pagination Response

When pagination is implemented, it is **RECOMMENDED** for the response body to include `meta` and `links` fields to provide the client with appropriate information about the result set, and for easy navigation within the collection. The fields can also remove the need for clients to unnecessarily parse query parameters to continue navigating the collection.

- The `links` field **SHOULD** include links for `self`, `first`, `last`, `next` and `prev`.
- Each link **MUST** include any additional query string parameters provided in the original request.

An example of this response body is as follows:

```javascript
{
  "meta": {
    "processingTime": "10 milliseconds",
    "processingTimeMs": 10,
    "totalPages": 8,
    "totalRecords": 76,
    "page": 3,
    "limit": 10,
    "count": 8
  },
  "links": {
      "self": "/customers?page=3&limit=10",
      "first": "/customers?page=1&limit=10",
      "last": "/customers?page=8&limit=10",
      "prev": "/customers?page=2&limit=10",
      "next": "/customers?page=4&limit=10",
  },
  "data": ...
}
```

The following is the **RECOMMENDED** structure of the Metadata object:

```yml
metaModel:
    description: Metadata object model
    readOnly: true
    type: object
    properties:
      processingTime:
        type: string
        description: "The processing time for this request in human readable format."
        example: "10 milliseconds"
      processingTimeMs:
        type: integer
        description: "The processing time for this request in milliseconds."
        example: 10
      totalRecords:
        type: integer
        description: "Total number of the results which meets the search criteria regardless of the page and limit."
        example: 38
      totalPages:
        type: integer
        description: "Total number of the pages in the result set."
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

If the client requests a page that this out of the valid range for the collection, for example if the valid page range is `1 to 15`, but the client requests `?page=0` or `?page=1000`, then the response body **SHOULD** contain an empty collection with HTTP Status code as `200`.

An example of the response is as follows:

```javascript
{
  "meta": {
    "processing_time": "10 milliseconds",
    "processing_time_ms": 10,
    "total_records": 38
  },
  "links": {
      "self": "/customers?page=99999&limit=10",
      "first": "/customers?page=1&limit=10",
      "last": "/customers?page=15&limit=10",
  },
  "data": []
}
```
A maximum page size of 1000 records is assumed for all end points (unless otherwise stipulated in the end point definition). If a page size greater than this maximum is requested then a HTTP status of 422 Unprocessable Entity SHOULD be returned.

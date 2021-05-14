______________________________________________________________________________
# API Responses

## Response Document Structure

The returned media type MUST conform to the value provided in the API request Accept header, or the 1st supported media type if multiple values are specified. The default content type is JSON (application/json).

If the requested media type(s) are unsupported, the server MUST return an HTTP response status 415 Unsupported Media Type.

### Operations on a Resource Collection
A GET performed on a resource collection (without specifying a resource Id) will return potentially multiple resource instances, and MUST return the collection in a "data" array, which provides a predictable document path to resource data. The data array must be returned even when the response is a collection of one.

e.g.      GET /v1/persons  

Response

```
// 200 OK
Content-Type: application/json; charset=utf-8

{
   "data": [
       {
           "applicationId": "65648987234",
           "familyName": "SMITH",
           "givenName": "John",
           "birthDate": "1990-01-01"
       },
       {
           "applicationId": "878795465",
           "familyName": "DOE",
           "givenName": "Jane",
           "birthDate": "1986-03-01"
       }
   ]
}
```

NOTE: Arrays containing very large datasets or large binary objects, such as documents or images, MUST be controlled by pagination. Total payload size MUST NOT exceed 10 Mb. It is suggested that payload size SHOULD NOT exceed 2 Mb, an historical default payload maximum for a number of platforms.

A POST may also be performed on a resource collection to create a new instance of the resource. The server MUST return a ‘Location’ header containing the relative path of the newly created resource, and SHOULD return a resource identifier field in the form of '{resourceName}Id' or '{resourceName}_id'. Additional derived data MAY be returned as deemed appropriate. A links object MAY be returned if required, for instance to return a version link in cases where a versioned change history is maintained.

e.g.  POST /v1/persons

Response

```
// 201 Created
Content-Type: application/json; charset=utf-8
Location: /persons/65648987235
{
   "data": {      
      "personId": "65648987235",
   }
}
```

### Operations on a Single UI/Experience Resource Instance

A top-level member or root element is not required for a UI/experience, functional or 'private' API response document unless the request is unsuccessful, in which case an ‘errors‘ collection - an array of error objects - SHOULD be returned, as outlined in the Error Handling section of this standard.

### Operations on a Canonical Business Resource Instance

A canonical business resource response document SHOULD contain at least one of the following top-level members:

| Status | Top-Level Member |
| --- | --- |
| Success (200, 201) | SHOULD contain a top-level ‘data‘ object <br />SHOULD contain a ‘links‘ object – HATEOAS links to sub-resources, including, at a minimum, a ‘self’ reference. <br />MAY contain a ‘meta‘ object - a meta object that contains non-standard meta-information. <br />
| Unsuccessful (4xx, 5xx) | MUST contain an ‘errors‘ object - an array of error objects. |

The members ‘data’ and ‘errors’ MUST NOT coexist in the same document.

A GET request to the parent resource SHOULD return root-level resource data only, SHOULD provide links to identify sub-resources, and MAY provide links to identify existentially related objects.

The ‘meta’ top-level element provides a mechanism for the provision of meta-data, such as copyright, timestamp, origin, ownership, and dissemination delimiter. If a ‘meta’ member is to be returned, its content MUST be defined in the API specification.

Example response document:

```
{
    "meta": {
        "dlm": "sensitive:personal",
        "copyright": "Copyright 2015 Example Corp.", 
        "totalPages": 13
    }
    "data": {  
        "documentId": "3456789", 
        "title": "declaration", 
        "uploaded": "2018-05-22T14:56:29.000Z", 
        "updated": "2015-05-22T14:56:28.000Z 
    }
    "links": {
        "self": "http://example.com/v1/documents/3456789"
    }
}
```

## Response Headers

The recommended content type is `JSON` (`application/json`).

The following response headers **MAY** be included in all responses:

| Header | Value |
| --- | --- |
| Access-Control-Allow-Origin | The URL that is allowed to access this service from javascript and browser based clients directly.<br/><br/> **Note:** Never use wildcard (*) URLs unless the REST resource is truly public. |
| Access-Control-Allow-Methods | The methods that are allowed to be accessed from javascript and browser based clients directly. |
| Access-Control-Allow-Headers | The headers that are allowed to be accessed from javascript and browser based clients directly. |
| Content-Type | Choice of: <ul> <li>`application/json` (required)</li> <li>`application/xml` (optional for `xml`)</li> <li>`multipart/form-data` (optional for files)</li> <li>`text/html` (optional for `html`)</li> </ul> |
| Cache-Control | Informs the caching mechanisms. It is measured in seconds.max-age=3600 |
| Date | The date and time that the message was originated Date  e.g. Tue, 15 Nov 1994 08:12:31 GMT |
| Expires | Gives the date/time after which the response is considered stale  e.g. Thu, 01 Dec 1994 16:00:00 GMT |
| ETag | Used to identify the particular version of a resource.  The client should include this in any update requests to make sure it is unchanged.|

## HTTP Response Codes

Not all HTTP status codes are mandatory, or will apply to every operation. The table below indicates the HTTP Response codes that SHOULD be supported at a minimum for each HTTP method.

| Code | Description | POST /resources | GET /resources | GET /resources/{id} | PUT /resources/{id} | DELETE /resources/{id} | PATCH /resources/{id} |
| --- | ---------------------- | :-: | :-: | :-: | :-: | :-: | :-: |
| 200 | OK                     |   | √ | √ | √ |   |   |
| 201 | Created                | √ |   |   |   |   |   |
| 202 | Accepted               | √ |   |   | √ | √ | √ |
| 204 | No content             |   |   |   | √ | √ | √ |
|     |                        |  
| 400 | Bad Request            | √ | √ | √ | √ | √ | √ |
| 401 | Unauthorised           | √ | √ | √ | √ | √ | √ |
| 403 | Forbidden              | √ | √ | √ | √ | √ | √ |
| 404 | Not found              | √ | √ | √ | √ | √ | √ |
| 405 | Not Allowed            | √ | √ | √ | √ | √ | √ |
| 408 | Request Timeout        | √ | √ | √ | √ | √ | √ |
| 415 | Unsupported Media Type | √ | √ | √ | √ |   | √ |
|     |                        |
| 500 | Internal Server Error  | √ | √ | √ | √ | √ | √ |
| 501 | Method Not Implemented | √ |   |   | √ | √ | √ |


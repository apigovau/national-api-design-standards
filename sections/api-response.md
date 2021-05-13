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
           "sexType": "M",
           "birthDate": "1990-01-01"
       },
       {
           "applicationId": "878795465",
           "familyName": "DOE",
           "givenName": "Jane",
           "sexType": "F",
           "birthDate": "1986-03-01"
       }
   ]
}
```

NOTE: Arrays containing very large datasets or large binary objects, such as documents or images, MUST NOT be controlled by pagination. Total payload size MUST NOT exceed 10 Mb. It is suggested that payload size SHOULD NOT exceed 2 Mb, an historical default payload maximum for a number of platforms.

A POST may also be performed on a resource collection to create a new instance of the resource. The server MUST return a ‘Location’ header containing the relative path of the newly created resource, and SHOULD return a resource identifier field in the form of '{resourceName}Id' or '{resourceName}_id'. Additional derived data MAY be returned as deemed appropriate. A links object MAY be returned if required, for instance to return a version link in cases where a versioned change history is maintained.

e.g.      POST    /v1/persons  

```
{
   "data": {       
      "familyName": "SMITH",
      "givenName": "Jane",
      "sexType": "F",
      "birthDate": "1992-01-01"
   }
}
```

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

These are the only operations that may be performed on a collection. Creating or updating multiple resource instances in the same request is not standardised, and should be avoided. There are factors such as receipt acknowledgement and how to handle partial success in a set of batches that add significant complexity.

### Operations on a Single UI/Experience or Functional Resource Instance

A top-level member or root element is not required for a UI/experience or functional API response document unless the request is unsuccessful, in which case an ‘errors‘ object - an array of error objects - SHOULD be returned.

### Operations on a Canonical Business Resource Instance

Any canonical business resource API response payload MUST contain a top level member. Note: The top level object requirement not required to wrap UI/experience or 'private' APIs. The requirement applies to functional/controller APIs only when the response returns the current state of a canonical resource.

A canonical business resource response document MUST contain at least one of the following top-level members:

| Status | Top-Level Member |
| --- | --- |
| Success (200, 201) | SHOULD contain a top-level ‘data‘ object <br />SHOULD contain a ‘links‘ object – HATEOAS links to sub-resources, including, at a minimum, a ‘self’ reference. <br />MAY contain a ‘meta‘ object - a meta object that contains non-standard meta-information. <br />
| Unsuccessful (4xx, 5xx) | SHOULD contain an ‘errors‘ object - an array of error objects. |

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
| --- | --- | :-: | :-: | :-: | :-: | :-: | :-: |
| 200 | OK | √ |  | √ |  |  |  |
| 201 | Created | √ |  | √ |  |  |  |
| 202 | Accepted | √ |  | √ |  |  |  |
| 204 | No content | √ |  | √ |  |  |  |
| 400 | Bad Request | √ |  | √ |  |  |  |
| 401 | Unauthorised | √ |  | √ |  |  |  |
| 403 | Forbidden | √ |  | √ |  |  |  |
| 404 | Not found | √ |  | √ |  |  |  |
| 405 | Not Allowed | √ |  | √ |  |  |  |
| 408 | Request Timeout | √ |  | √ |  |  |  |
| 415 | Unsupported Media Type | √ |  | √ |  |  |  |
| 500 | Internal Server Error | √ |  | √ |  |  |  |
| 501 | Method Not Implemented | √ |  | √ |  |  |  |


The following table defines the responses that **MUST** be supported by your API.

| Request Method | Status | Code | When to use |
| --- | --- | --- | --- |
| GET | OK | 200 | The request was successfully processed |
| GET | Bad Request | 400 | The server cannot process the request (such as malformed request syntax, size too large, invalid request message framing, or deceptive request routing, invalid values in the request) |
|GET| Unauthorised | 401 | The request could not be authenticated. |
|GET| Forbidden | 403 | The request was authenticated but is not authorised to access the resource. |
|GET| Not found | 404 | The resource was not found. |
|GET| Not Allowed | 405 | The method is not implemented for this resource. The response may include an Allow header containing a list of valid methods for the resource. |
|GET| Unsupported Media Type | 415 | This status code indicates that the server refuses to accept the request because the content type specified in the request is not supported by the server |
|GET| Internal Server error | 500 | An internal server error. The response body may contain error messages. |

| Request Method | Status | Code | When to use |
| --- | --- | --- | --- |
| POST | Created | 201 | The resource was created. The Response Location HTTP header **SHOULD** be returned to indicate where the newly created resource is accessible. |
|POST| Accepted | 202 | Is used for asynchronous processing to indicate that the server has accepted the request but the result is not available yet. The Response Location HTTP header may be returned to indicate where the created resource will be accessible. |
|POST| Bad Request | 400 | The server cannot process the request (such as malformed request syntax, size too large, invalid request message framing, or deceptive request routing, invalid values in the request) For example, the API requires a numerical identifier and the client sent a text value instead, the server will return this status code. |
|POST| Unauthorised | 401 | The request could not be authenticated. |
|POST| Forbidden | 403 | The request was authenticated but is not authorised to access the resource. |
|POST| Not found | 404 | The resource was not found. |
|POST| Not Allowed | 405 | The method is not implemented for this resource. The response may include an Allow header containing a list of valid methods for the resource. |
|POST| Unsupported Media Type | 415 | This status code indicates that the server refuses to accept the request because the content type specified in the request is not supported by the server |
|POST| Unprocessable Entity | 422 | This status code indicates that the server received the request but it did not fulfil the requirements of the back end. An example is a mandatory field was not provided in the payload. |
|POST| Internal Server error | 500 | An internal server error. The response body may contain error messages. |

| Request Method | Status | Code | When to use |
| --- | --- | --- | --- |
| PUT | Accepted | 202 | Is used for asynchronous processing to indicate that the server has accepted the request but the result is not available yet. |
|PUT| No content | 204 | The server successfully processed the request and is not returning any content |
|PUT| Bad Request | 400 | The server cannot process the request (such as malformed request syntax, size too large, invalid request message framing, or deceptive request routing, invalid values in the request)For example, the API requires a numerical identifier and the client sent a text value instead, the server will return this status code. |
|PUT| Unauthorised | 401 | The request could not be authenticated. |
|PUT| Forbidden | 403 | The request was authenticated but is not authorised to access the resource. |
|PUT| Not found | 404 | The resource was not found. |
|PUT| Not Allowed | 405 | The method is not implemented for this resource. The response may include an Allow header containing a list of valid methods for the resource. |
|PUT| Unsupported Media Type | 415 | This status code indicates that the server refuses to accept the request because the content type specified in the request is not supported by the server |
|PUT| Unprocessable Entity | 422 | This status code indicates that the server received the request but it did not fulfil the requirements of the back end. An example is a mandatory field was not provided in the payload. |
|PUT| Internal Server error | 500 | An internal server error. The response body may contain error messages. |

| Request Method | Status | Code | When to use |
| --- | --- | --- | --- |
| DELETE | Accepted | 202 | Is used for asynchronous processing to indicate that the server has accepted the request but the result is not available yet. |
|DELETE| No content | 204 | The server successfully processed the request and is not returning any content |
|DELETE| Bad Request | 400 | The server cannot process the request (such as malformed request syntax, size too large, invalid request message framing, or deceptive request routing, invalid values in the request) |
|DELETE| Unauthorised | 401 | The request could not be authenticated. |
|DELETE| Forbidden | 403 | The request was authenticated but is not authorised to access the resource. |
|DELETE| Not found | 404 | The resource was not found. |
|DELETE| Not Allowed | 405 | Method not allowed on resource. The response may include an Allow header containing a list of valid methods for the resource. |
|DELETE| Unsupported Media Type | 415 | This status code indicates that the server refuses to accept the request because the content type specified in the request is not supported by the server |
|DELETE| Internal Server error | 500 | An internal server error. The response body may contain error messages. |

| Request Method | Status | Code | When to use |
| --- | --- | --- | --- |
| PATCH | Accepted | 202 | Is used for asynchronous processing to indicate that the server has accepted the request, but the result is not available yet. |
|PATCH| No content | 204 | The server successfully processed the request and is not returning any content |
|PATCH| Bad Request | 400 | The server cannot process the request (such as malformed request syntax, size too large, invalid request message framing, or deceptive request routing, invalid values in the request) For example, the API requires a numerical identifier and the client sent a text value instead, the server will return this status code. |
|PATCH| Unauthorised | 401 | The request could not be authenticated. |
|PATCH| Forbidden | 403 | The request was authenticated but is not authorised to access the resource. |
|PATCH| Not found | 404 | The resource was not found. |
|PATCH| Not Allowed | 405 | The method is not implemented for this resource. The response may include an Allow header containing a list of valid methods for the resource. |
|PATCH| Unsupported Media Type | 415 | It indicates that the server refuses to accept the request because the content type specified in the request is not supported by the server |
|PATCH| Unprocessable Entity | 422 | This status code indicates that the server received the request but it did not fulfil the requirements of the back end. An example is a mandatory field was not provided in the payload. |
|PATCH| Internal Server error | 500 | An internal server error. The response body may contain error messages. |

This table highlights the status codes that are applicable for all HTTP Methods

| Request Method | Status | Code | When to use |
| --- | --- | --- | --- |
| All | Request Timeout | 408 | The request timed out before a response was received. |
| All | Method Not Implemented | 501 | It indicates that the request method is not supported by the server and cannot be handled for **any** resource. For example, the server supports GET, POST, PUT, DELETE, and PATCH but not OPTIONS methods. |

## Response Payload

The Response payload for an API can be for a single resource or a collection of resources.

When the response format is `JSON`, the following response standards apply:

### Single Resource

The following status codes represent appropriate responses to the different operations that can be performed on a single resource within the system.

| Request Method | Resource Path | Status | Code |
| --- | --- | --- | --- |
| POST | `/resources/{id}` | Created | 201 | 
||| Accepted | 202 |
||| Bad Request | 400 |
||| Unauthorised | 401 | 
||| Forbidden | 403 | 
||| Not found | 404 | 
||| Not Allowed | 405 | 
||| Unsupported Media Type | 415 | 
||| Unprocessable Entity | 422 |
||| Internal Server Error | 500 | 
| PUT | `/resources/{id}` | OK | 200 |
||| Accepted | 202 |
||| No content | 204 | 
||| Bad Request | 400 | 
||| Unauthorised | 401 | 
||| Forbidden | 403 | 
||| Not found | 404 | 
||| Not Allowed | 405 | 
||| Unsupported Media Type | 415 | 
||| Unprocessable Entity | 422 |
||| Internal Server error | 500 | 
| DELETE | `/resources/{id}` | Accepted | 202 | 
||| No Content | 204 |
||| Bad Request | 400 | 
||| Unauthorised | 401 | 
||| Forbidden | 403 | 
||| Not found | 404 | 
||| Not Allowed | 405 | 
||| Internal Server error | 500 | 
| PATCH | `/resources/{id}` | Accepted | 202 | 
||| No content | 204 | 
||| Bad Request | 400 | 
||| Unauthorised | 401 | 
||| Forbidden | 403 | 
||| Not found | 404 | 
||| Not Allowed | 405 | 
||| Unsupported Media Type | 415 | 
||| Unprocessable Entity | 422 |
||| Internal Server error | 500 |

### Collection of Resources

The following status codes represent appropriate responses to the different operations that can be performed on a collection resource within the system.

| Request Method | Resource Path | Status | Code |
| --- | --- | --- | --- | 
| GET | `/resources/` | OK | 200 |
||| Bad Request | 400 | 
||| Unauthorised | 401 | 
||| Forbidden | 403 | 
||| Not found | 404 | 
||| Not Allowed | 405 | 
||| Unsupported Media Type | 415 | 
||| Internal Server error | 500 |

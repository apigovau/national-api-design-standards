______________________________________________________________________________
# API Request

## Request Headers

All APIs **MUST** support the following request headers:

| Header | Value |
| --- | --- |
| Authorization / Identification | One of: <ul> <li> API Key </li> <li> Basic Auth (APIKey + Secret) </li> <li> Username + Password </li> <li> Bearer {token} </li></ul> |

The following request headers are optional.

| Header | Value |
| --- | --- |
| Content-Type | A choice of: <ul> <li> `application/json` (required)</li> <li> `application/xml` (optional for xml)</li> <li> `multipart/form-data` (optional for files) </li> <li> `application/x-www-form-urlencoded` (optional for form data) </li> </ul> |
| Accept | Content-Types that are acceptable for the response. Choice of: <ul> <li> `application/json` (required) </li> <li> `application/xml` (optional for xml) </li></ul> |
| Connection | Control options for the current connection. e.g. `keep-alive`. |
| Date | The date and time at which the message was originated, in "HTTP-date" format as defined by [RFC 7231 Date/Time Formats](http://tools.ietf.org/html/rfc7231#section-7.1.1.1). E.g. `Tue, 15 Nov 1994 08:12:31 GMT`.  |
| Cookie | An HTTP cookie previously sent by the server. |
| Cache-Control | Used to specify directives that must be obeyed by all caching mechanisms e.g. no-cache. |
| ETag | Used to identify the particular version of a resource being updated to prevent multiple user updates. This should match what is currently stored on the server.|

Payload data **MUST** NOT be used in HTTP Headers. They are reserved for transversal information (authentication token, monitoring token, request properties etc).

## HTTP Request Methods

RESTful API operations are based on the HTTP Request Method standard as defined by [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3).

### Supported HTTP request methods

|HTTP Method|Description|
|---|---|
| `GET`| To _retrieve_ a resource. |
| `POST`| To _create_ a new resource, or to _execute_ an operation on a resource that changes the state of the system e.g. send a message. |
| `PUT`| To _replace_ a resource with another supplied in the request. |
| `PATCH`| To perform a _partial update_ to a resource. |
| `DELETE`| To _delete_ a resource. |
| `HEAD`| For retrieving metadata about the request e.g. how many results _would_ a query return? (without actually performing the query). |
| `OPTIONS`| Used to determine if a CORS (cross-origin resource sharing) request can be made. This is primarily used in front-end web applications to determine if they can use APIs directly. |

A request to retrieve resources can be made for a single resource or a collection of resources.

Consider the following example:

```
https://gw.api.gov.au/agency/v1/customers/{id}
```

To retrieve a collection of customers, a request is sent to the URN `/customers`.

To retrieve a single "customer", a request is sent to the URN `/customers/{id}`.

### Collection of Resources

The following operations are applicable for a collection of resources:

| HTTP method | Resource Path | Operation | Examples |
| --- | --- | --- | --- |
| GET | `/resources` | Get a collection of the resource | GET `/employees` or GET `/employees?status=open` |
| POST | `/resources` | Create a new instance of this resource.|

**Note:**

Creating or updating multiple resource instances in the same request is currently not standardised. There are factors such as receipt acknowledgement and how to handle partial success in a set of batches that must be considered on a case-by-case basis.

Future versions of the specification may address batch processing using APIs.

### Single Resource

The following operations are applicable for a single resource:

| HTTP method | Resource Path | Operation |
| --- | --- | --- |
| GET | `/resources/{id}` | Get the instance corresponding to the resource ID |
| PUT | `/resources/{id}` | To update a resource instance by replacing it – "_Take this new thing and_ _ **put** _ _it there_" |
| DELETE | `/resources/{id}` | To delete the resource instance based on the resource e.g. id |
| PATCH | `/resources/{id}` | Perform changes such as add, update, and delete to the specified attribute(s). Is used often to perform partial updates on a resource |

## Request Payload Formats

At minimum the API **MUST** support a `JSON` formatted payload when supplied.

Other payload format such as `XML`, `CSV` and `YAML` may be supported as needed.

The additional format support must be documented in your API design (Swagger definition).

## Idempotency

An idempotent HTTP method is an HTTP method that can be called many times without different outcomes.  In some cases, and secondary calls will result in a different response code, but there will be no change of state of the resource.  
As an example, when you invoke N similar DELETE requests, the first request will delete the resource and the response will be 200 (OK) or 204 (No Content). Further requests will return 404 (Not Found). Clearly, the response is different from first request, but there is no change of state for any resource on server side because original resource is already deleted.

|HTTP Method|Is Idempotent|
|---|---|
| `GET` |True |
| `POST`|False |
| `PUT` |True |
| `PATCH` |False |
| `DELETE` |True |
| `HEAD` |True |
| `OPTIONS` |True |

RESTful API methods **MUST** adhere to the specified idempotency in the table above

______________________________________________________________________________
# API Request

## HTTP Request Methods

RESTful API operations are based on the HTTP Request Method standard as defined by [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3).

### Collection of Resources

The following operations are applicable for a collection of resources:

| HTTP method | Resource Path | Operation | Examples |
| --- | --- | --- | --- |
| GET | `/resources` | Get a collection of the resource | GET `/employees` or GET `/employees?status=open` |
| POST | `/resources` | Create a new instance of this resource.|

**Note:**

Creating or updating multiple resource instances in the same request is not standardised, and should be avoided. There are factors such as receipt acknowledgement and how to handle partial success in a set of batches that add significant complexity.

### Single Resource

The following operations are applicable for a single resource:

| HTTP method | Resource Path | Operation |
| --- | --- | --- |
| GET | `/resources/{id}` | Get the instance corresponding to the resource ID e.g. GET https://gw.api.gov.au/agency/v1/customers/1234567 |
| PUT | `/resources/{id}` | To update a resource instance by replacing it – "_Take this new thing and_ _ **put** _ _it there_". If supported, a PUT method must be implimented with care |
| DELETE | `/resources/{id}` | To delete the resource instance based on the resource e.g. id |
| PATCH | `/resources/{id}` | Perform changes such as add, update, and delete to the specified attribute(s). Is used often to perform partial updates on a resource |

## Request Document Structure

At minimum the API **MUST** support a `JSON` formatted payload when supplied.
Other payload format such as `XML`, `CSV` and `YAML` may be supported as needed.
The additional format support must be documented in your API design (Swagger/OpenAPI definition).

### Operations on a Business Information Resource

A JSON document passed to a canonical business information resource (POST, PUT, PATCH) SHOULD contain a ‘data’ top-level member to hold the primary data for the request. The 'data' object is NOT required to wrap UI/experience or ‘private’ client-coupled API request data.

The request document MAY also contain a ‘meta’ top-level object if, and only if, it is specifically defined by the API Specification. The ‘meta’ object is used to provide additional information such as second factor authorisation data, copyright, timestamps, origin, ownership, dlm, or other purposes that are complementary to the workings of the API.

e.g.      POST /v1/persons  

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

The ‘resourceId’ payload field is not required (nor should it be supported) when the resource object originates at the client, for either creation of or update to a resource on the server. The unique and immutable resource identifier MUST be managed exclusively by the resource owner.

## Request Headers

All APIs **MUST** support the following request headers:

| Header | Value |
| --- | --- |
| Authorization | One of: <ul> <li> Basic Auth (API-Key + Secret) </li> <li> Username + Password </li> <li> Bearer {token} </li></ul> |

The following request headers **SHOULD** be supported.

| Header | Value |
| --- | --- |
| Content-Type | A choice of: <ul> <li> `application/json` (required)</li> <li> `application/xml` (optional for xml)</li> <li> `multipart/form-data` (optional for files) </li> <li> `application/x-www-form-urlencoded` (optional for form data) </li> </ul> |
| Accept | Content-Types that are acceptable for the response. Choice of: <ul> <li> `application/json` (required) </li> <li> `application/xml` (optional for xml) </li></ul> |
| Request-Id | A unique identifier for the API request to assist with issue resolution |
| API-Key | A unique client application identifier, usually issued by an API Developer portal |

The following optional request headers **MAY** apply.

| Header | Value |
| --- | --- |
| Connection | Control options for the current connection. e.g. `keep-alive`. |
| Date | The date and time at which the message was originated, in "HTTP-date" format as defined by [RFC 7231 Date/Time Formats](http://tools.ietf.org/html/rfc7231#section-7.1.1.1). E.g. `Tue, 15 Nov 1994 08:12:31 GMT`.  |
| Cookie | An HTTP cookie previously sent by the server. |
| Cache-Control | Used to specify directives that must be obeyed by all caching mechanisms e.g. no-cache. |
| If-None-Match | A string of ASCII characters placed between double quotes. Matches the content of the server-provided ‘Etag’ header. The client should include this in any update requests to ascertain whether the version of a resource is unchanged. |

Payload data **MUST NOT** be transmitted via HTTP Headers. They are reserved for transversal information (authentication token, monitoring token, request properties etc).

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

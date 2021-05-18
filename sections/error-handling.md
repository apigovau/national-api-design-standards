______________________________________________________________________________
# Error Handling

## Error Response Payload

For some errors returning the HTTP status code is enough to convey the response. Additional error information can be supplemented in the response body. For example; HTTP 400 Bad request is considered to be too generic for a validation error and more information must be provided in the response body.

Defined here are the attributes of the error object:

| Error attributes | Description | Mandatory? |
| --- | --- | --- |
| `id` | Identifier of the specific error | Optional |
| `detail` | A human-readable explanation specific to this occurrence of the problem. | Mandatory |
| `code` | An application-specific error code | Mandatory |
| `source` | An object containing references to the source of the error, optionally including any of the following members:pointer: a JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].parameter: a string indicating which URI query parameter caused the error | Optional |
| `source > pointer` | JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute]. | Optional |
| `source > parameter` | A string indicating which URI query parameter caused the error. | Optional |

The error schema may be _extended_ with optional fields (e.g. 'helpUrl') as required to meet specific business or enterprise requirements.
The returned error objects must be in a collection (array) – see the examples for details.

## Input Validation

There are two types of input validation errors

|Request Validation Issue | HTTP status code|
|------------- | -------------|
|Not well-formed JSON | `400 Bad Request`|
|Contains validation errors that the client can change e.g. missing a mandatory field | `422 Unprocessable Entity`|

## Error Samples

A sample 400 Bad Request error response:

```javascript
{
  "errors": [
    {
      "id": "86032cbe-a804-4c3b-86ce-ec3041e3effc",
      "detail": "Invalid value(s) in request input",
      "code": "19283",
      "source": {
        "parameter": "postcode"
      }
    },
    {
      "id": "45786a8f-452e-492f-a779-801b5d0bd0a7",
      "detail": "Input value(s) exceeded maximum length",
      "code": "19284",
      "source": {
        "parameter": "last_name"
      }
    }
  ]
}
```

A sample 500 Internal Service error:

```javascript
{
  "errors": [{
    "id": "86032cbe-a804-4c3b-86ce-ec3041e3effc",
    "detail": "Downstream system is not responding correctly"
    "code" : "500"
  }]
}
```

## Warning and Information Responses

It may be appropriate in some scenarios for resource servers to return information about non-critical errors or other significant conditions.
When employing extra-data messages, the intent of such messages **MUST** be clearly articulated in API specifications, **MUST NOT** constrain or direct client behaviour (i.e. avoid close coupling) and **MUST NOT** be stateful (i.e. do not represent retention of client state by the server). Warning and information messages **SHOULD** be returned only in exceptional circumstances, **MUST ONLY** be returned by a server and **MUST NOT** be passed to a server by a client.

When utilised, warning and information messages **MUST** be returned as child objects of a single 'messages' top level collection, and **MAY ONLY** be returned with a success response (Success 200, 201).

The messages object **MUST** conform to the error object definition described above, and **SHOULD** include an aditional 'severity' attribute.

| Attribute | Description | Mandatory? |
| --- | --- | --- |
| `severity` | The severity level of the message. Valid values: 'information' or 'warning'. | Optional |

Sample warning content :

```javascript
{
  "data": {
    "applicationId": "65648987234",
    "creationDate": "2020-01-01",
    "applicantId": "123456",
    "status": "incomplete"
  }
  "messages": [
    {
      "severity": "warning",
      "id": "86032cbe-a804-4c3b-86ce-ec3041e3effc",
      "code": "APP0025",
      "detail": "application 65648987234 to be retired 2022-01-01 due to inactivity"
    }
  ]
}
```

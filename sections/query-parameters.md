______________________________________________________________________________
# Query Parameters

## Pagination

Pagination is the process of returning a large set of results in chunks (or pages) to reduce the amount of information that is sent with each request.

Pagination requires multiple query parameters to be provided, and further information about how to set this up is provided in the [pagination section](pagination.html#query-parameters) of this document.

## Filtering and Sorting

Providing the ability to filter and sort collections in your API allows your consumers greater flexibility and controls on how they choose to consume your API. 

There are number of techniques on how to do this and further explanations are provided below however **DO NOT** define filter and sort parameters as part of the API URI (e.g. `/employees/age/from/20/to/30`). 

Filter parameters are not part of the resource definition. Instead use query parameters to specify the filter and sort requirements.

Below are the different techniques used when applying filtering and sorting:

### Output Selection

Consumers can specify the fields they wish to return in the [response payload](api-response.html#response-payload) by specifying the fields in the [query parameters](pagination.html#query-parameters).

Example that returns only the `first_name` and `last_name` fields in the response.

```
?fields=first_name,last_name
```

### Simple Filtering

Attributes can be used to filter a collection of resources.

Example:

```
?last_name=Citizen
```

will filter out the collection of resources with the attribute `last_name` that matches `Citizen`.

Example:

```
?last_name=Citizen&date_of_birth=1999-12-31
```

will filter out the collection of resources with the attribute `last_name` that matches `Citizen` and `date_of_birth` that matches 31st of December, 1999.

The equal (=) operator is the only supported operator when used in this technique. For other operators and conditions see the 'Advanced Filtering' technique.

### Advanced Filtering

There are situations where simple filtering does not meet the needs and a more comprehensive approach is required. Use the reserved keyword 'filter' to define a more complex filtering logic.

Complex filter logic can be chained together in a single 'filter' value, using OData 4.0 query compliant query strings.

The following operators should supported at a minimum:

  1. gt - Greater than
  2. lt - Less than
  3. ge - Greater than or equal to
  5. le - Less than or equal to
  7. eq - Equal
  8. ne - Not equal

The 'and', 'or' conditions shoud be supported.

Example:

```
?filter=creation_date gt 2001-09-20T13:00:00 and creation_date lt 2001-09-21T13:00:00 and post_code eq 3000
```

Return a collection of resources where the `creation_date` is between `2001-09-20 1pm` and `2001-09-21 1pm` and `post_code` is 3000.

### Match Case Sensitivity

As a general guide it is better to return similar matches than to return no matches at all.

**The preference is to filter with case insensitivity**.

Whether you choose to filter with case insensitivity or not should be clearly documented.

### Sorting

Providing data in specific order is often the requirement from client applications and hence it is important to provide the flexibility for clients to retrieve the data in the order they need it.

The two parameters that make up sorting are as follows:

| Query Parameter | Description |
| --- | --- |
| `sort` | The direction to sort e.g. `asc` or `desc` |
| `sort_fields` | The fields to sort by e.g. `id` or `name` |

`sort_fields` is plural as the following options are both available:

Examples:

- `?sort=asc&sort_fields=name,last_modified`

- `?sort=desc&sort_fields=name&sort_fields=last_modified`

Both of these queries should sort first by name and then by last modified date.

## Relocation of the Query parameters if Personally Identifiable Information (PII) is contained

To conform to various privacy legislation, PII should not be included in the Query String where there is a risk that it may be stored in logs or on proxy servers. PII should be installed in headers, but reserved headers complicate this issue. As such, where PII is included within a query string, it is recommended that the string itself, or the PII component at least, be moved to a header where it will not be cached or logged, outside of the intended server that responds to it, with all information encrypted in transport by TLS. 

As such, where a query string contains any personally identifiable information, it is recommended that either the entire query string, or the part containing the PII, be relocated to the headers in a suitable header.

### The QUERY header

RFC 6648 defines that the "X-" header prefix should be deprecated, and the list of established headers is maintained by IANA at: https://www.iana.org/assignments/message-headers/message-headers.xml

As it is permitted to include query data within the headers under the RFC, and there are no headers beginning with the letter Q, the header "Query" shall be used within Australia when relocating query string content to a common header. This does not preclude deliberate use of other headers, for any reason, though any reuse of the "Query" header within Australia should be mindful of this fact. 

URL encoding should be maintained within the field as per the Query standard. A "&" symbol should be assumed prior to concatenating with the original query string in the URI if it is not already present, unless there is no query string specified at all within the URI, in which case a "?" symbol should be assumed prior.

There is no requirement to support this standard within an API endpoint. It is provided as an alternative standard in the event that an API must handle PII within the query.

Example;
URI
- https://myAPI.example.gov.au/employees?search=all

Headers:
- Query: surname%3Dcitizen

Would be the equivalent of;

- https://myAPI.example.gov.au/employees?search=all&surname=citizen



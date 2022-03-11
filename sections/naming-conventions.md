______________________________________________________________________________
# Naming Conventions

## Message Format

For request and response body field names and query parameter names case **MUST** be consistent, and **SHOULD** be either camelCase OR snake_case:

Examples:
```
// thisIsCamelCase

{
  "documentId" : "AB1837"
}
```
```
// this_is_snake_case

{
  "document_id" : "AB1837"
}
```

Fields that represent arrays **SHOULD** be named using plural nouns (e.g. products - contains one or more products).
The object and field definition **MUST** be the same for the request and response body as well as corresponding query parameter values.

## URI Component Names

URIs follow [RFC 3986](https://tools.ietf.org/html/rfc3986) specification. This specification simplifies REST API service development and consumption. 

The guidelines in this section govern your URI structure and semantics following the [RFC 3986](https://tools.ietf.org/html/rfc3986) constraints.

### URI Components

The structure of the URLs used within APIs **SHOULD** be meaningful to the consumers. URLs **SHOULD** follow a predictable, hierarchical structure to enhance understandability and therefore usability. 

URLs **MUST** follow the standard naming convention as described below:


```
   https://gw.api.gov.au/namespace/project-name/v1/collection?fields=startDate,endDate
   \___/   \___________/\___________________________________/\______________________________/
     |           |                        |                                  |
  scheme     authority                   path                              query
```

### URI Maximum Length

The total URI, including the Path and the Query, **MUST NOT** exceed 2000 characters in length including any formatting codes such as commas, underscores, question marks, hyphens, plus or slashes.

### URI Naming Conventions

URLs **MUST** follow the standard naming convention as described below:

- the URI **MUST** be specified in all lower case
- only hyphens '-' can be used to separate words or path parameters for readability (no spaces or underscores)
- underscores '\_' or camelCase can be used to separate words in query parameter names but not as part of the base URI

The following table provides a breakdown of how to construct the API URI.

| URI Element | Description | Example |
| --- | --- | --- |
| Protocol | All APIs **MUST** be exposed using HTTPS. | `https:// `|
| Authority \> Environment | The domain of where the API endpoint will be exposed. Refer to the 'DNS' standard section for details. | `gw.api.gov.au` |
| Path \> API | The API name which is derived from the business domain. | e.g. `/namespace/project-name` <br />Any agency/department can specify the API name that they would like to expose their services on. |
| Path \> Version | The version of the API that is desired to be accessed by the consumer. | e.g. `/v1` <br/> All APIs must specify a version that follow the versioning scheme as specified in 'versioning' below. |
| Path \> Collection | The collection identifies a list of resources. The collection **MUST** be named using the **plural** representation of a noun. | e.g. As part of the workforce API - a resource could be a list of `employees`. |
| Path \> Resource | The resource identifier which corresponds to an instance of the resource. | e.g. As part of the **project-name** API - if there was a specific document with id E13454. These details can be retrieved using `GET` `/project-name/v1/documentId/E13454` |
| Query String \> Parameters | Query parameters **MUST** NOT be used to transport payload or actual data. <br/>The following query parameters **SHOULD** be supported by your API where they would be useful: <ul> <li>**fields** - specify or restrict the fields to be returned </li> <li> **filter** – conditions to restrict/filter the collection list </li> <li> **sort** – specify the sort requirement </li> <li> **page** – specify which pagination index to be return in a collection set</li> </ul> | e.g. `fields=start_date,end_date`  returns data element with only the `start_date` and `end_date` attributes <p> `filter=creation_date gt 2001-09-20T13:00:00 and creation_date le 2001-09-21T13:00:00 and and post_code eq 3000` - return a collection of resources where the creation date is greater than 2001-09-20 1pm and less than or equal to 2001-09-21 1pm and post_code is 3000.</p> <p> `sort=car_bay desc` - return a collection where the resources are sorted by car_bay in descending order. </p> <p> `page=10` – returns the 10th page index</p>

### Resource Names

API Designers **MUST** follow these principles when creating a REST API:

- Nouns **MUST** be used - not verbs for names.
- Resource names **MUST** be plural.  Where the plural of a resource is non-standard, such as leaf or fish, then either choose a more appropriate noun, or use the proper plural - leaves, fishes.
- Resource names **MUST** be lower-case and use only alphabetic characters and hyphens.
- The hyphen character, ( - ), MUST be used as a word separator in URI path parameters.
  
**Note** that this is the only place where hyphens are used as a word separator. In nearly all other situations camelCase OR an underscore character, ( _ ), **MUST** be used.

Good examples:

- `/par-avion`
- `/sea-cargo`
- `/products`

Bad examples:

- `/get-employee`
- `/customer`
- `/add-product`

### Query Parameter Names

- Literals/expressions in query strings **SHOULD** be separated using underscore ( _ ).
- Query parameters values **MUST** be percent-encoded. Consider that AWS requires query paramter names to conform to the regex ^[a-zA-Z0-9._$-]+$
- Query parameters **MUST** start with a letter and **SHOULD** be either camelCase or snake_case, consistent with the case standard employed for field names.
- Query parameters **SHOULD** be optional.
- Query parameters **SHOULD** not contain characters that are not URL safe.

## Field Names

The data model for the representation **MUST** conform to the `JSON` specification. 

The values may themselves be objects, strings, numbers, booleans, or arrays of objects.

- Key names MUST be either camelCase or snake_case, however case MUST be used consistently.
  - `foo`
  - `barBaz` OR `bar_baz`
- Prefix such as `is` or `has` **SHOULD NOT** be used for keys of type boolean.
- Fields that represent arrays **SHOULD** be named using plural nouns (e.g. authenticators-contains one or more authenticators, products-contains one or more products).

## Link Relation Names

To help guide users through your API relational links **MUST** be provided.  These links act as the navigation of your API advising users of where they can go to next.

A `_links` array **SHOULD** be provided for resources.  This contains link objects that can refer to related resources in the system.

A link relation **MUST** contain the following elements:

- href - string containing the absolute or relative URL to the resource
- rel - the textual string describing what this entity is
- method - the HTTP method that **SHOULD** be used when using this related resource.

Example:

```javascript
"_links": [
    {
        "href": "/v1/customer/partner-referrals/ALT-JFWXHGUV7VI",
        "rel": "_self",
        "method": "GET"
    }
]
```

## Request Headers

The following headers **SHOULD** be assumed by default on all requests.

|Header | Default Value|
|---|---|
|Accept|`application/json`|

## Managing Dates

### ISO8601 Formatted Dates

All implementations using dates **MUST** conform to [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.

In ISO 8601, date and time values are ordered from the largest to smallest unit of time: year, month (or week), day, hour, minute, second, and fraction of second.

The internationally recognised way to represent a date object is:

`YYYY-MM-DD`

The internationally recognised way to represent a time object is:

`hh:mm:ss.fff`

The component parts of these are described below:

|Date Component| Description | Example|
|---|---|---|
|YYYY|Four Digit Year|`2019`|
|MM|Two Digit Month (with leading zero)|`04`|
|DD|Two Digit Day (with leading zero)|`27`|
|T|Set character indicating the start of the time element in a combined datetime format|`T`|
|hh|Two digits of an hour (00 through 23)|`18`|
|mm|Two digits of a minute|`38`|
|ss|Two digits of a second|`12`|
|fff|Three digits of a millisecond (000 through 999)|`123`|

When combined into a datetime, the object can be represented as follows:

`2019-10-02T18:36:12.123`

### Usage of Timezones

When using ISO 8601 format the timezone is **RECOMMENDED** to be provided.  This is due to the complexities that arise when consuming data and converting to local time.

The timezone can be represented in a variety of mechanisms, but is most commonly represented as an offset from GMT+0 (or Zulu time).

`2019-10-02T18:36:12.123Z` (with `Z` denoting Zulu time).

The convention here is as follows:

|Date Component| Description | Example|
|---|---|---|
|Z|Denotes Zulu Time (optional)|`Z`|
|+ \| -|+ represents positive offset from Zulu (e.g. ahead of Zulu).  - represents negative offset from Zulu (e.g. behid Zulu) |`+ | -`|
|hh|Two digits of an hour (00 through 13)|`10`|
|mm|Two digits of a minute (typically either 00, 15, 30 or 45) |`30`|

To represent Australian Eastern Standard time (+10), the following format would be used:

`2019-10-02T18:36:12.123+10:00`

### Date Field Naming Conventions

When using date fields, the following naming conventions for these fields should be used:

- For properties requiring both date and time, services **MUST** use the suffix `datetime`, e.g. `startDateTime` | `start_datetime`.

- For properties requiring only date information without specifying time, services **MUST** use the suffix `date`, e.g. `birthDate` | `birth_date`.

- For properties requiring only time information without specifying date, services **MUST** use the suffix `time`, e.g. `startTime` | `start_time`.

## Examples

### Good URL examples

List of employees:<br />
  `GET` https://gw.api.gov.au/e09284/v1/employees<br />
Filtering is a query:<br />
  `GET` https://gw.api.gov.au/e09284/v1/employees?year=2011&sort=desc<br />
  `GET` https://gw.api.gov.au/e09284/v1/employees?section=economy&year=2011<br />
A single employee in JSON format:<br />
  `GET` https://gw.api.gov.au/e09284/v1/employees/0d047d80-eb69-4665-9395-6df5a5e569a4<br />
All locations this employee works in:<br />
  `GET` https://gw.api.gov.au/e09284/v1/employees/0d047d80-eb69-4665-9395-6df5a5e569a4/locations<br />
Specify optional fields in a comma separated list:<br />
  `GET` https://gw.api.gov.au/e09284/v1/employees/0d047d80-eb69-4665-9395-6df5a5e569a4?fields=job_title,start_date<br />
Add a new location to a particular employee:<br />
  `POST` https://gw.api.gov.au/e09284/v1/employees/0d047d80-eb69-4665-9395-6df5a5e569a4/locations<br />

### Bad URL examples

Non-plural endpoint:

  `GET` https://gw.api.vic.gov.au/e09284/v1/employee<br />
  `GET` https://gw.api.vic.gov.au/e09284/v1/employee/0d047d80-eb69-4665-9395-6df5a5e569a4<br />
  `GET` https://gw.api.vic.gov.au/e09284/v1/employee/0d047d80-eb69-4665-9395-6df5a5e569a4/location<br />

  `GET` https://gw.api.gov.au/e09284/v1/employee<br />
  `GET` https://gw.api.gov.au/e09284/v1/employee/0d047d80-eb69-4665-9395-6df5a5e569a4<br />
  `GET` https://gw.api.gov.au/e09284/v1/employee/0d047d80-eb69-4665-9395-6df5a5e569a4/location<br />

Verb in the URL:<br />
  `POST` https://gw.api.gov.au/e09284/v1/employee/0d047d80-eb69-4665-9395-6df5a5e569a4/create<br />

Filtering outside in the URL instead of the query string<br />
  `GET` https://gw.api.gov.au/e09284/v1/employee/0d047d80-eb69-4665-9395-6df5a5e569a4/desc<br />

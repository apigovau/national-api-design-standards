______________________________________________________________________________
# Hypermedia

## Hypermedia - Linked Data

Hypermedia links in APIs are links in the response payload that inform the consumers to what contents can be retrieved. Though simple in concept hypermedia links in APIs allow consumers to locate resource without the need to have an upfront understanding of the resource and its relationship.

This is similar to the navigation of a web page. The user is not expected to know the structure of the web page prior to visiting. They can simply browse to the home page and the navigation lets them browse the site as required.

APIs that do not provide links expect the consumer to refer to the documentation.

The exclusion of Personally Identifiable Information (PII) in links provided back to a consumer should be a security / privacy consideration when referencing entities related to citizens, businesses, or any other entity considered to be non-discoverable, protected or sensitive in nature. The underlying reason for not including PII in links in particular is related to browsers and network devices being able to record and reference GET request information indefinitely.

References to such entities should be non-enumerable i.e. knowing one reference shouldn't allow the simple discovery of another (e.g. entities referenced with id=123 allow the enumeration of references id=122, id=124 etc). The use of UUIDs can be considered a good replacement for sequential references e.g. `6df54d5e-3df7-11ec-96ad-6f2d87ff1821` is non-enumerable. A reference may be also constructed using [pseudonymization techniques](https://en.wikipedia.org/wiki/Pseudonymization), in the case of OIDC "Subjects" the [Pairwise Identifier Algorithm](https://openid.net/specs/openid-connect-core-1_0.html#PairwiseAlg) may be used i.e. the identifier is non-enumerable and persistent only for the authenticated caller, however will not be resolvable for a different caller under a different authentication context. In some circumstances producing transient, short-lived, non-persistent or one-time-use references for entities may be appropriate (if explicitly understood and handled by the service & caller. Confirmation / reset links may be an appropriate example of this).

Example:

```javascript

GET /namespace/v1/employees

//200 OK

{
  "total_records" : "1",
  "_links": [{
      "href" : "/namespace/v1/employees",
      "rel" : "self"
  }],
  "employees": [{
    "name" : "John Smith",
    "_links": [{
        "href" : "/namespace/v1/employees/6df54d5e-3df7-11ec-96ad-6f2d87ff1821",
        "rel" : "self"
    }]
  }]
}
```

## HATEOAS

`Hypermedia As The Engine Of Application State` is the concept of representing allowable actions as hyperlinks associated with resource. Similar to Hypermedia Linked Data concept the links defined in the response data represents state transitions that are available from that current state to adjacent states.

```javascript
{
  "account_ref":"a2be47d4-3dfc-11ec-a765-db48afd2ce06",
  "balance": 100.00,
  "_links":[
    {"rel": " **deposit**",  "href":"/accounts/a2be47d4-3dfc-11ec-a765-db48afd2ce06/deposit"},
    {"rel": " **withdraw**", "href":"/accounts/a2be47d4-3dfc-11ec-a765-db48afd2ce06/withdraw"},
    {"rel": " **transfer**", "href":"/accounts/a2be47d4-3dfc-11ec-a765-db48afd2ce06/transfer"}
  ]
}

```

But if the same account is overdrawn by 25 then the only allowed action is deposit:

```javascript
{
  "account_ref":"a2be47d4-3dfc-11ec-a765-db48afd2ce06",
  "balance": -25.00,
  "_links":[{
    "rel": "deposit",
    "href":"/accounts/a2be47d4-3dfc-11ec-a765-db48afd2ce06/deposit"
  }]
}

```

Deciding to implement HATEOAS designs in your API is dependent on the readiness of the clients to consume HATEOAS and the design and implementation effort.

## Hypermedia Compliant API

A hypermedia compliant API provides consumers with an accessible a state machine of the transitions that are available for them to use. 

In APIs, request methods such as `DELETE`, `PATCH`, `POST` and `PUT` initiate a transition in the state of a resource. A `GET` request **MUST** never change the state of the resource that is retrieved.

In order to provide a better experience for API consumers, API designers **SHOULD** provide a list of state transitions that are available for each resource in the `_links` array.

An example of an API that exposes a set of operations to manage a user account lifecycle and implements the HATEOAS interface constraint is as follows:

A client starts their interaction with a service through the URI `/users`. This fixed URI supports both `GET` and `POST` operations. The client decides to do a `POST` operation to create a user in the system.

### Request

```
POST https://gw.api.gov.au/dept-xyz/v1/users

{
    "first_name": "John",
    "last_name" : "smith",
    ...
}
```

### Response

The API creates a new user from the input and returns the following links to the client in the response.

- A link to the created resource in the `Location` header (to comply with the 201 response spec)
- A link to retrieve the complete representation of the user (aka `self` link) (`GET`).
- A link to update the user (`PUT`).
- A link to partially update the user (`PATCH`).
- A link to delete the user (`DELETE`).

```json
HTTP/1.1 201 CREATED
Content-Type: application/json
Location: https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179
...

{
  "_links": [
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "self",
          "method" : "GET"
      },
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "delete",
          "method": "DELETE"
      },
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "replace",
          "method": "PUT"
      },
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "edit",
          "method": "PATCH"
      }
  ]

}

```

A client can store these links in its database for later use.

A client may then want to display a set of users and their details before the admin decides to delete one of the users. So the client does a `GET` to the same fixed URI `/users`.

### Request

```
GET https://gw.api.gov.au/dept-xyz/v1/users
```

The API returns all the users in the system with respective `self` links.

### Response

```json
HTTP/1.1 200 OK
Content-Type: application/json
...

{
    "total_records": "2",
    "users": [
      {
          "first_name": "John",
          "last_name": "Greenwood",
          ...
          "_links": [
              {
                  "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
                  "rel": "self"
              }
          ]
      },
      {
          "first_name": "David",
          "last_name": "Brown",
          ...
          "_links": [
              {
                  "href": "https://gw.api.gov.au/dept-xyz/v1/users/81d13dea-3e03-11ec-8c06-bff381749c44",
                  "rel": "self"
              }
          ]
      }
    ]
}

```

The client MAY follow the `self` link of each user and figure out all the possible operations that it can perform on the user resource.

### Request

```
GET https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179
```

### Response

```json
HTTP/1.1 200 OK
Content-Type: application/json
...
{
    "first_name": "John",
    "last_name": "Smith",
    ...
    "_links": [
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "self",
          "method" : "GET"
      },
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "delete",
          "method": "DELETE"
      },
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "replace",
          "method": "PUT"
      },
      {
          "href": "https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179",
          "rel": "edit",
          "method": "PATCH"
      }
    ]
}
```

To delete the user, the client retrieves the URI of the link relation type `delete` from its data store and performs a delete operation on the URI.

### Request

```
DELETE https://gw.api.gov.au/dept-xyz/v1/users/e7c9ad70-3dff-11ec-9d87-6fc27f396179

```

In summary:

- There is a well defined index or navigation entry point for every API which a client navigates to in order to access all other resources.
- The client does not need to build the logic of composing URIs to execute different requests or code any kind of business rule by looking into the response details that may be associated with the URIs and state changes.
- The client acknowledges the fact that the process of creating URIs belongs to the server.
- Client treats URIs as opaque identifiers.
- APIs using hypermedia in representations could be extended seamlessly. As new methods are introduced responses could be extended with relevant HATEOAS links. This way clients could take advantage of the functionality in incremental fashion. For example; if the API starts supporting a new `PATCH` operation then clients could use it to do partial updates.

The mere presence of links does not decouple a client from having to learn the data required to make requests for a transition and all associated link semantics particularly for `POST`/`PUT`/`PATCH` operations. An API **MUST** provide documentation to clearly describe all the links, link relation types and request response formats for each of the URIs.

## Link Description Object

Links **MUST** be described using the [Link Description Object (LDO)](http://json-schema.org/latest/json-schema-hypermedia.html#anchor17) schema. An LDO describes a single link relation in the links array. Following is brief description for properties of Link Description Object.

### href

- A value for the `href` property **MUST** be provided.

- The value of the `href` property **MUST** be a [URI template](https://tools.ietf.org/html/rfc6570) used to determine the target URI of the related resource. It **SHOULD** be resolved as a URI template per [RFC 6570](https://tools.ietf.org/html/rfc6570).

- Use **ONLY** absolute URIs as a value for `href` property. Clients usually bookmark the absolute URI of a link relation type from the representation to make API requests later. Developers **MUST** use the URI Component Naming Conventions to construct absolute URIs. The value from the incoming `Host` header (e.g. gw.api.gov.au) MUST be used as the `host` field of the absolute URI.

### rel

- `rel` stands for relation as defined in Link Relation Type

- The value of the `rel` property indicates the name of the relation to the target resource.

- A value for the `rel` property **MUST** be provided.

### method

- The `method` property identifies the HTTP verb that **MUST** be used to make a request to the target of the link. The `method` property assumes a default value of `GET` if it is omitted.

### title

- The `title` property provides a title for the link and is a helpful documentation tool to facilitate understanding by the end clients. This property is **NOT REQUIRED**.

## Link Relation Type

A `Link Relation Type` serves as an identifier for a link. An API MUST assign a meaningful link relation type that unambiguously describes the semantics of the link. Clients use the relevant Link Relation Type in order to identify the link to use from a representation.

When the semantics of a Link Relation Type defined in [IANA's list of standardized link relations](http://www.iana.org/assignments/link-relations/link-relations.xhtml) matches with the one you want to define then it **MUST** be used.

The table below describes some of the commonly used link relation types. It also lists some additional link relation types defined by these guidelines.

|Link Relation Type | Description|
|---------|------------|
|`self` | Conveys an identifier for the link's context. Usually a link pointing to the resource itself.|
|`create` | Refers to a link that can be used to create a new resource.|
|`edit` | Refers to editing (or partially updating) the representation identified by the link. Use this to represent a `PATCH` operation link.|
|`delete` | Refers to deleting a resource identified by the link. Use this `Extended link relation type` to represent a `DELETE` operation link.|
|`replace` | Refers to completely update (or replace) the representation identified by the link. Use this `Extended link relation type` to represent a `PUT` operation link.|
|`first` | Refers to the first page of the result list.|
|`last` | Refers to the last page of the result list provided `total_required` is specified as a query parameter.|
|`next` | Refers to the next page of the result list.|
|`prev` | Refers to the previous page of the result list.|
|`collection` | Refers to a collections resource (e.g /v1/users).|
|`latest-version` | Points to a resource containing the latest (e.g., current) version.|
|`search` | Refers to a resource that can be used to search through the link's context and related resources.|
|`up` | Refers to a parent resource in a hierarchy of resources.|

For all `controller` style complex operations, the controller `action` name must be used as the link relation type (e.g. `activate`,`cancel`,`send`).

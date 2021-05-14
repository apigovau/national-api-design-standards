______________________________________________________________________________
# Hypermedia

## Hypermedia - Linked Data

Hypermedia links in APIs are links in the response payload that inform the consumers to what contents can be retrieved. Though simple in concept hypermedia links in APIs allow consumers to locate resource without the need to have an upfront understanding of the resource and its relationship.

This is similar to the navigation of a web page.  The user is not expected to know the structure of the web page prior to visiting.  They can simply browse to the home page and the navigation lets them browse the site as required.

APIs that do not provide links are difficult to use and expect the consumer to refer to the documentation.

## HATEOAS

Hypermedia As The Engine Of Application State (HATEOAS) SHOULD be implimented by enterprise APIs to provide a consistent notation to describe linked resources.

HATEOAS is the concept of representing allowable actions as hyperlinks associated with resource. When provided, links defined in the response data:

**MUST** return a link element to self
**MUST** return links to sub-resource
**MUST** return links to adjacent members of a compound document (if any)
**SHOULD** only return links to operations which the requester is entitled
**MAY** return links to intrinsically related objects

Where HATEOAS links are implemented, links MUST reflect the currently returned version. Care must be taken when linking to versioned resources outside of the current API specification. If it is a resource that maintains deprecated versions, a versioned URL may not represent the correct version for every client. If there is likely to be any doubt, consider returning an Id (or array of Ids) with an indicative name derived from the singular form of the related resource, in camelCase (remove hyphens), with a suffix of ‘Id’, e.g. 'resourceId', rather than a link.

### Link Notation

A straightforward “linkName”: “URIString” link notation MUST be used to implement HATEOAS, keyed against the sub-resource or related-resource name, without “rel” or “href” keys, and MUST be relative (as defined by rfc3986 - URI generic syntax), beginning with a leading slash character, and refering to the resource path WITHOUT the domain/hostname, as per . E.g.

“link-name”: “/v1/resources/{resourceId}/sub-resources”

The following example represents the content of an “account” resource 12345. Available deposit, withdraw and transfer actions are represented as HATEOAS links:

```javascript
{
    "data": {
        "accountId":"12345",
        "clientId": 567890,
        "balance": 100.00
    }
    "links": {
           "self": "/v1/accounts/12345",
           "deposits": "/v1/account/12345/deposits",
           "withdrawals": "/v1/account/12345/withdrawals",
    }
}

```

But if the same account is overdrawn by 25 then the only allowed action is deposit:

```javascript
{
    "data": {
        "accountId":"12345",
        "clientId": 567890,
        "balance": 100.00
    }
    "links": {
           "self": "/v1/accounts/12345",
           "deposits": "/v1/account/12345/deposits",
    }
}

```

A client can store these links in its database for later use, or use them to mask end-user options.

Deciding to implement HATEOAS designs in your API is dependent on the readiness of the clients to consume HATEOAS and the design and implementation effort.

In summary:

- There is a well defined index or navigation entry point for every API which a client navigates to in order to access all other resources.
- The client does not need to build the logic of composing URIs to execute different requests or code any kind of business rule by looking into the response details that may be associated with the URIs and state changes.
- The client acknowledges the fact that the process of creating URIs belongs to the server.
- Client treats URIs as opaque identifiers.
- APIs using hypermedia in representations could be extended seamlessly. As new related resources are introduced responses could be extended with relevant HATEOAS links. This way clients could take advantage of the functionality in incremental fashion. 

An API specificaion **MUST** clearly describe all the links, link relation types and request response formats for each of the URIs.

## Link Relation Type

A `Link Relation Type` serves as an identifier for a link. An API MUST assign a meaningful link relation type that unambiguously describes the semantics of the link. Clients use the relevant Link Relation Type in order to identify the link to use from a representation.

When the semantics of a Link Relation Type defined in [IANA's list of standardized link relations](http://www.iana.org/assignments/link-relations/link-relations.xhtml) matches with the one you want to define then it **MUST** be used.

The table below describes some of the commonly used link relation types. It also lists some additional link relation types defined by these guidelines.

|Link Relation Type | Description|
|---------|------------|
|`self`  | Conveys an identifier for the link's context. Usually a link pointing to the resource itself.|
|`first` | Refers to the first page of the result list.|
|`last` | Refers to the last page of the result list provided `total_required` is specified as a query parameter.|
|`next` | Refers to the next page of the result list.|
|`prev` | Refers to the previous page of the result list.|
|`collection` | Refers to a collections resource (e.g /v1/users).|
|`latest-version` | Points to a resource containing the latest (e.g., current) version.|
|`search` | Refers to a resource that can be used to search through the link's context and related resources.|
|`up` | Refers to a parent resource in a hierarchy of resources.|

For all `controller` style complex operations, the controller `action` name must be used as the link relation type (e.g. `activate`,`cancel`,`send`).

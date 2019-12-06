______________________________________________________________________________
# WoG API Requirements

## API Documentation

Well documented APIs are a critical component of a successful API programme. This assists with the interoperability of services through a common descriptive document.  Where possible the structure, methods, naming conventions and responses will also be standardised to ensure a common experience for developers accessing services from a range of publishers.

All APIs created for the Australian government **MUST** specify a valid OpenAPI v2.0 document as it has the widest support. An OpenAPI v3.0 document **MAY** also be provided to future proof the API.

The API description document is **RECOMMENDED** to contain the following sections:

- About
- Legals
  - Terms of Use
  - License
  - Data Classification
  - Copyright
  - Attribution
- Authentication Requirements
- Data Model
- Contact Us

## API Development

The following guidelines are **RECOMMENDED** to be followed when developing APIs:

- The API description documents **SHOULD** contain the API documentation (high level information and descriptions) and version controlled accordingly. 
  
- They **MUST** be considered as technical contracts between designers and developers and between consumers and providers. 
  
- Mock APIs **SHOULD** be created using the API description to allow early code integration for development.
  
- The behaviour and intent of the API **SHOULD** be described with as much information as possible.

- Documentation **SHOULD** be public where possible and easily accessible to those that require it.
  
- The descriptions **SHOULD** contain example of request and responses.

- Example request and response bodies **SHOULD** be provided in full.
  
- Expected response codes and error messages **SHOULD** be provided in full.
  
- Correct response codes **SHOULD** be used (see [HTTP Response Codes](api-response.html#http-response-codes)).
  
- Known issues or limitations **SHOULD** be clearly documented.
  
- Expected performance, uptime and SLA/OLA **SHOULD** be clearly documented.
  
- If known, a timeline when methods will be deprecated **SHOULD** be provided. (See section [End of Life Policy](api-versioning.html#end-of-life-policy) and [API Deprecation](api-versioning.html#api-deprecation)).
  
- All API documentation **SHOULD** be printable or exportable.

### Packaging

The OpenAPI description files must be available:

- **Online** : Serve as part of the product API under `/<namespace>/<project-name>/v<x>/api-docs`
- **Offline** : As part of the product packaging.

### File Format

All OpenAPI documents **SHOULD** be provided in JSON format since it is the most widely supported.

### Versioning

In order to follow the versioning recommendations in this standard there must be one OpenAPI description per major version.

For example; if your API product exposes and maintains 3 major versions of its REST API then you must provide 3 OpenAPI descriptions (one for each version: v1, v2 and v3).

## API Developer Experience & Ease of Use

An API that is difficult to use reduces the likelihood that consumers will continue to use it and will therefore seek alternatives.  They will also be unlikely to recommend the API to others.

APIs that are being designed are **RECOMMENDED** to be tested with real consumers.  Any feedback provided **SHOULD** be considered for incorporation into the API to ensure the best possible outcome.

The WoG API Team provides an API review process to ensure APIs meet a baseline level of usability prior to them being published to potential consumers for feedback.

## API Stability

APIs **MUST** be designed with backwards compatibility in mind as when changes are introduced it is not likely that consumers will introduce these into their applications immediately.

In most cases introducing new fields to an API or adding new endpoints is a non-breaking change and can be introduced with a patch version update.

Should the API contract need to change in a manner that breaks the consumers contract this **SHOULD** be communicated clearly.

  1. API Product owners **SHOULD** document the support lifespan for API services (e.g. how long they will be supported).
  2. New functionality **MUST** be introduced in a way that does not impact existing consumers.
  3. Any deprecation activities **MUST** be known to consumers prior to them being put into effect.

## API Design Maturity

When designing a new API, one of the key considerations is the experience of the developer using this API. Developers will have a far better experience if they already understand the core concepts within the API. 

The most familiar concept for API developers is the architectural style of RESTful APIs.

In order to assist API designers in ensuring their APIs are designed *RESTfully*, the [Richardson Maturity Model](https://restfulapi.net/richardson-maturity-model/) was developed as a tool.

This model breaks down all RESTful APIs into one of 4 different levels based on their use of URIs, HTTP Methods and HATEOAS:

- Level 0 - Base State for any new API.
- Level 1 - API implements different URIs, but only a single verb (e.g. POST)
- Level 2 - API implements different URIs and multiple verbs (e.g. CRUD via GET/POST/PUT/DELETE).
- Level 3 - API implements different URIs, multiple verbs and HATEOAS to represent the relationships between objects.

All APIs adhering to this standard **MUST** be designed to Level 2 of the Richardson Maturity Model. 

An API **MAY** choose to implement Level 3 of the model, however this is not mandatory for this standard.

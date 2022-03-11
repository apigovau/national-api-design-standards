______________________________________________________________________________
# Getting Started

## What is this design standard?

This document is intended to be a reference point in the design phase of a new API development process.

The design standards defined in this document are both data-agnostic (i.e. they don't take into account the type of data being consumed or produced), and programming language agnostic (i.e. they don't take into account the programming language being used).

Instead, these design standards present common patterns that are applicable to all API and integration scenarios and provides an agreed upon view of how this scenario should be addressed.

As such, this document does not need to be consumed and understood in one sitting.  Instead it can be used as a reference point when facing a new API or integration scenario to understand the agreed upon approach for implementation.

## How to apply the design standard

Knowing how and when to apply the API Design Standards will significantly influence the API Solution Design that an API Designer will take.  

Determining when to use the standard is based on the API Category and the required level of abstraction required. 

An API will generally fall into one of the following categories:

- **System Level APIs**: These are low-level APIs that are exposed directly by an application.

- **Process Level APIs**: These are APIs composed of other System APIs through orchestration and choreography.

- **Experience Level APIs**: These are APIs intended to ease the adoption of API integration between an organisation and its external consumers. 

If your API falls into the System Level API and is custom developed, it is **RECOMMENDED** that you use the design standard as this will assist in developing Process or Experience level APIs if they are required in future.

If your API is a Process Level API, you **SHOULD** apply the design standard as more often than not, a process level API will be tailored for re-usability. 

If your API is an Experience Level API, then the design standards **MUST** be applied.

This design standard itself does NOT apply to third-party System level APIs such as those available as ‘out-of-the-box’ or as part of SaaS platform, e.g. Salesforce APIs or ArcGIS APIs.  However, the standard may apply if you were looking to re-expose these APIs as experience level APIs for wider consumption.

## The choice behind REST

This API design standard largely focuses on using HTTP REST (Representational State Transfer) APIs as the basis for design. 

Whilst there are emerging design standards and patterns for APIs (including GraphQL and gRPC), developers around the world have largely accepted REST as the de-facto mechanism of data representation and transfer to/and from systems on the internet.

REST performs well when modelling systems and data. The principles can be applied to systems that are both large and small and the tooling available to developers largely supports data access out of the box.

REST APIs typically are not good for streaming data (websockets) nor are they the best use for largely function based APIs (gRPC/JSON-RPC).  GraphQL is an alternative that handles these aspects of development in a different way and was considered as an option for WoG standards.

As the tooling for REST APIs is more widely available, and the general technology literacy across government is already reasonably versed with REST APIs and design principles, it was determined that REST would be the basis for modelling this API design standard for use across the Australian Government.

It is expected that future development of these design standards will also consider GraphQL and gRPC/JSON-RPC.

## Sample OpenAPI Definition

Sample [OpenAPI (formerly known as Swagger)](https://github.com/OAI/OpenAPI-Specification) templates that exposes APIs methods and conforms to the Service Design Guide is provided here to help API Designers get started. API Designers can use these templates as a basis to start their API definition from a standards-compliant starting point.

The available templates are:

- [OpenAPI v2.0 Template (JSON format)](../open-api-templates/v2.0/api-example-swagger-v1.4.json)
- [OpenAPI v2.0 Template (YAML format)](../open-api-templates/v2.0/api-example-swagger-v1.4.yml)
- [OpenAPI v3.0 Template (JSON format)](../open-api-templates/v3.0/api-example-openapi-v1.4.json)
- [OpenAPI v3.0 Template (YAML format)](../open-api-templates/v3.0/api-example-openapi-v1.4.yml)

Once the OpenAPI definition has been copied, designers can perform the following tasks:

1. Provide a relevant description of the API – Refer to line number 5.
2. Review and update the description
3. For each method:

    - Update the field definition
    - Update the description
    - Provide examples
    - Review the status codes and error messages and update as required

See section [API Documentation](wog-api-requirements.html#api-documentation) for more details on what information should be included in the OpenAPI documentation file.

**NB. These OpenAPI examples demonstrate how an API could be defined. Always check the the repository for the latest copy of the template and examples.**

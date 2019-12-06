---
collection: national_api_standards
title: "API Versioning"
nav_order: 6
---
______________________________________________________________________________
# API Versioning

## Versioning Scheme

All APIs **MUST** adhere to [semantic versioning](https://semver.org/):

{MAJOR}.{MINOR}.{PATCH}

The first version of an API **MUST** always start with a MAJOR version of 1.

Use the following guidelines when incrementing the API version number:

- **MAJOR** version when you make **incompatible** or **breaking** API changes,
- **MINOR** version when you add functionality in a backwards-compatible manner, and
- **PATCH** version when you make backwards-compatible bug fixes.

## Major Version

All APIs **MUST** only include the MAJOR version as part of the URI in the format of 'v{MAJOR}', e.g.
  https://api.gov.au/namespace/v1/employees

The minor and patch versions is NOT required in the URI as the change is backwards-compatible.

### Minimise New Major Versions

With each new major version of the API the older versions are required until all the consumers are uplifted to use the new versions. This adds to the overall maintenance and support requirements.

Use API keys to identify consumers and decommission older version(s) of the API with sufficient notification.

When new major versions are published the older version must be deprecated following the deprecation process in [API Deprecation](api-versioning.html#api-deprecation)

## Minor Version

Minor version numbers are displayed on the API documentation page or part of a special management call to the API URI itself. To support this your API **MUST** implement a response to a GET request to the base URI of the API and return the following metadata in the response:

- **api_name:** The API Name
- **api_version:** The API Version with major and minor versions
- **api_released:** The date the API was released
- **api_documentation:** Links to the API Documentation
- **api_status:** To indicate whether an API is still active or has been deprecated.

Additional metadata can be added to the response if required.

Example:

```javascript
GET /namespace/v1/

//HTTP 200 OK

{
  "api_name": "namespace",
  "api_version": "1.0.3"
  "api_released": "2018-08-10"
  "api_documentation": "https://gw.api.gov.au/namespace/v1/docs"
  "api_status": "active"
}

```

## Minor and Patch Documentation

The Swagger definition **SHOULD** also contain the minor and patch version.

API product version and API implementation version are **NOT** the same.

A product version is the logical version that is applied to the API for documentation and reference purpose. The implementation version is the physical build version that was created.

For example:

| Product version | API implementation version | Change Type | Version Change |
| --- | --- | --- | --- |
| 17.04.xx | 1.29.xx | Bug Fixes | Product version will be changed to **17.04.02** if changes are related to product. API implementation version will be changed to **1.29.02** if changes are related to API |
| 17.04.xx | 1.29.xx | Backward Compatible | Product version will be changed to **17.05.xx** if changes are related to product. API implementation version will be changed to **1.30.x** if changes are related to API |
| 17.04.xx | 1.29.xx | Non-Backward Compatible | Product version will be changed to **18.01.x** if changes are related to product. API implementation version will be changed to **2.00.x** if changes are related to API |

A patch update (Patch or Service Pack) **MUST** have backward compatibility.

## Backwards Compatibility

It is critical that APIs are developed with loose coupling in mind to ensure backwards compatibility for consumers.

The following changes are deemed to be backwards compatible:

- Addition of a new optional field to a representation
- Addition of a new link to the `_links` array of a representation
- Addition of a new endpoint to an API
- Additional support of a new media type (e.g. `Accept: application/pdf`)

The following changes are **NOT** deemed to be backwards compatible:

- Removal of fields from representations
- Changes of data types on fields (e.g. string to boolean)
- Removal of endpoints or functions
- Removal of media type support

Any of these changes **MUST** require a major version update so these should be managed with caution.

## End of Life Policy

When designing new APIs one of the most important dates to consider is when the API will be retired.

APIs are not intended to last forever. Some APIs are retired after a short time as they may be proving a use-case, others may be removed when better options are available for users.

The End-of-Life (EOL) policy determines the process that APIs go through to move through their workflow from `LIVE` to the `RETIRED` state.

The EOL policy is designed to ensure a consistent and reasonable transition period for API customers who need to migrate from the old API version to the new API version while enabling a healthy process to retire technical debt.

### Minor API Version EOL

Per versioning policy, minor API versions MUST be backwards compatible with preceding minor versions within the same major version. Therefore minor API versions are `RETIRED` immediately after a newer minor version of the same major version becomes `LIVE`. This change should have no impact on existing subscribers so there is no need to transition through a `DEPRECATED` state to facilitate client migration.

### Major API Version EOL

Major API versions **MAY** be backwards compatible with preceding major versions. The following rules apply when retiring a major API version.

1. A major API **MUST NOT** be `DEPRECATED` state until a replacement service is `LIVE` that provides a clear migration path for all functionality that will be retained moving forward. This **SHOULD** include documentation and migration tools/sample code that provide users what they need to make a clean migration.

2. The deprecated API version **MUST** be in the `DEPRECATED` state for a minimum period of 60 days to give users adequate notice to migrate.

3. Deprecation of API versions with external users **SHOULD** be considered on a case-by-case basis and may require additional deprecation time and/or constraints to minimise impact to users.

4. If a versioned API in `LIVE` or `DEPRECATED` state has no registered users, it **MAY** move to the `RETIRED` state immediately.

### Replacement Major API Version

Since a new major API version that results in deprecation of a pre-existing API version is a significant product investment API owners **MUST** justify the new major version before beginning significant design and development work.

API owners **SHOULD** explore all possible alternatives to introducing a new major API version with the objective of minimizing the impact on customers before deciding to introduce a new version. 

Justification **SHOULD** include the following:

#### Business Case

1. Customer value delivered by new version that is not possible with existing version.
2. Cost-benefit analysis of deprecated version versus the new version.
3. Explanation of alternatives to introducing an new major version and why those were not chosen.
4. If a backwards incompatible change is required to address a critical security issue items 1 and 2 (above) are not required.

#### API Design

1. A domain model of all resources in the new API version and how they compare to the domain model of the previous major API version.
2. Description of APIs operations and use cases they implement.
3. Definition of service level objectives for performance and availability that are equal or better to the major API version to be deprecated.

#### Migration Strategy

1. Number of existing customers impacted; internal, external and partners.
2. Communication and support plan to inform existing customers of new version, value and migration path.

## API Deprecation

When a newer API is available API Owners are **RECOMMENDED** to provide two headers in the response when old versions are used:

- X-API-Deprecated - boolean field advising that this has been deprecated
- X-API-Retire-Time - ISO8601 date advising when it will be deprecated

For example:

```
GET `/namespace/v1`

// 200 OK
Content-Type: application/json; charset=utf-8
X-API-Deprecated: true
X-API-Retire-Time: 2018-11-17T13:00:00Z
```

This provides consumers with a constant reminder that the API is marked to be deprecated and there is likely another version available for them to migrate to.

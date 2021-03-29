______________________________________________________________________________
# API Security

## API Design

Applying the right level of security will allow your APIs to perform well without compromising on the security risk.

To secure your APIs the security standards are grouped into three categories: Design, Transport, and Authentication & Authorisation.

At minimum the security standards that are defined here **MUST** be applied. Further security considerations may apply depending on the API design and requirements – refer to our [API Design Considerations section](getting-started.html#how-to-apply-the-design-standard) for more details.

## Transport Security

- ALL transport **MUST** occur over HTTPS using TLS 1.2.
- ALL certificates **MUST** be from SHA-2 (Secure Hash Algorithm 2) cryptographic hash functions with minimum key length of 2048.
- ALL publicly accessible endpoints **MUST** use a Digital Certificate that has been signed by an approved Certificate Authority.
- Internal facing endpoints **MAY** use self-signed Digital Certificates.
- Do not redirect HTTP traffic to HTTPS - reject these requests
- Unused HTTP methods **SHOULD** be disabled and return HTTP 405.
- ALL requests must be validated.

Depending on the security classification you may be required to establish the following controls above and beyond the standard controls:

- Mutual authentication between the consumer and the API Gateway
- Mutual authentication between the API Gateway and the back-end API
- IP Whitelisting of API Consumers using either API Gateway Policy or Firewall configurations
- IP Whitelisting of API Publishers using either API Gateway Policy or Firewall configurations
- Payload encryption while in transit
- Payload signing for integrity and verification

## Authentication and Authorization

- Basic or Digest authentication **SHOULD NOT**  be used.
- The `Authorization: Bearer` header **MUST** be used for authentication/authorization e.g. using a JWT token.
- A refresh token **SHOULD** be provided for extending expiry time of existing token without having to provide the credentials again. 
- Always set a reasonable expiration date for tokens. JWT token lifetime **SHOULD NOT*** exceed 5 minutes.
- JWT refresh tokens **SHOULD** be used when new JWT tokens are required outside of this lifetime. 
- All APIs **MUST** have a policy that only allows access based on a valid API key.
- API keys **MUST** be used for client authentication. Use of API keys should only be permitted when TLS is enabled. Rotation policy for API Key should be implemented as well.
- API keys **SHOULD NOT** be included in the URL or query string. API keys **SHOULD** be included in the HTTP header as query strings may be saved by the client or server in unencrypted format by the browser or server application. 
- CORS headers should only be used when necessary as it reduce overall security mechanisms built into web browsers by selectively relaxing cross-origin restrictions.
- A request from Domain A is considered cross-origin when it tries to make a request to an API that is hosted in Domain B.
  - For security reasons, browsers restrict cross-origin HTTP requests.
  - The Cross-Origin Resource Sharing standard works by adding new HTTP headers (i.e. Access-Control-Allow-Origin) that allow servers to describe the set of origins that are permitted to access the API
- Never use wildcard (\*) URLs in the response headers (i.e. Access-Control-Allow-Origin) unless the REST resource is truly public and requires little or no authorization for use.

### TDIF

TDIF ( Trusted Digital Identity Framework ) forms the basis of single-sign-on (SSO) user authentication for citizens to access government services across Australia. Through a series of double-blind identity exchanges, it provides a federated approach to SSO that allows user choice in terms of identity provider, as well as attribute provider capabilities. It is currently being developed at state level with states either building their own identity exchange or using the federal identity exchange. It supports OpenID Connect and SAML 2.0 - OpenID Connect is built on top of OAuth 2.0.
ref: https://www.dta.gov.au/our-projects/digital-identity/trusted-digital-identity-framework

### OAuth 2.0

OAuth 2.0 can be used for authorisation. OAuth is an authorisation protocol that securely delegates authorisation to another resource. It allows users to approve applications to act on their behalf without sharing their password.

OpenID Connect extends the OAuth 2.0 protocol to receive information about the authenticated users such as their username and is useful when dealing with federated identity providers.

The API Team provides an OAuth service that can be used by WoG APIs.  Alternatively, API Providers can link into Open ID Providers to delegate authorisation. This process can be facilitated by the WoG API Gateway.

## Abstraction

There are multiple levels of abstraction and determining the level of abstraction is largely based on the number of consumers and the cost to change the system in response to an API change.

As a general principle there should be a level of abstraction of the source system data and business logic in your API design to decouple the consumers and the API service provider(s). Applying BASIC abstraction to a SaaS API (such as an Azure API) is recommended. For example; if there are changes in the SaaS authentication schema it could be handled within the API. 

A higher level of abstraction would be required for APIs that have multiple consumers and the cost of change to the API consumers is greater than the cost to change the backend systems / service providers.

The varying levels of abstraction are as follows:

| Abstraction Level | Description |
| --- | --- |
| `BASIC` | **Basic abstraction level**  - represents the minimum abstraction required for all APIs (including point-to-point):  - Use `JSON` as your default representation.  - Always provide a version number in the URL to facilitate change.  - Always use an API Key ID  - Little or no abstraction of the Data model and expose data as required
| `INTERMEDIATE` | APIs which aim for re-use should consider Intermediate levels of abstraction:  **Payload abstraction**  - Represent resources from the consumer view point and be independent of the underlying system. NEVER directly expose the internal database table structure as is in your API.  - Error abstraction  – Handle source system errors and represent the errors in a consistent and informative. **System IDs abstraction**  – Avoid exposing and sharing internal system identifiers (such as a database ID) with your consumers. Use a candidate key or a secondary identifier.
| `ADVANCED` | The highest level of abstraction and it encompasses all the other levels. - Use the API Gateway pattern to take care of cross-cutting concerns such as security, traffic management and analytics/monitoring.  - Use Linked Data hypermedia to promote "discoverability" of your API resources and relationships.   - Consider using HATEOAS to abstract allowable actions.

## Rate Limiting

Apply rate limiting and throttling policies to prevent abuse of your API. Ensure appropriate alerts are implemented and respond with informative errors when thresholds are nearing or have been exceeded.

The following headers will be returned when rate limits are in place:

| Header | Description |
| --- | --- |
| `X-Rate-Limit-Limit` | Rate limit ceiling for the given request (for example, 100 messages). |
| `X-Rate-Limit-Remaining` | Number of requests left for the time window (for example, 45 messages). |
| `X-Rate-Limit-Reset` | Remaining time window before the rate limit resets in UTC epoch seconds (for example, 1353517297). |

## Error Handling

When your application displays error messages, it should not expose information that could be used to attack your system. You should establish the following controls when providing error messages:

- Your API **MUST** mask any system related errors behind standard HTTP status responses and error messages e.g. do not expose system level information in your error response
- Your API **MUST NOT** pass technical details (e.g. call stacks or other internal hints) to the client

## Audit Logs

An important aspect of security is to be notified when something wrong occurs, and to be able to investigate it. It is **RECOMMENDED** to define the right level of logging and audit and to set the right alerts.

- Write audit logs before and after security related events which can trigger the alerts
- Sanitizing the log data to prevent log injection attacks

## Input Validation

Input validation is performed to ensure only properly formed data is received by your system, this helps to prevent malicious attacks

- Input validation should happen as early as possible, preferably as soon as the data is received from the external party
- Define an appropriate request size limit and reject requests exceeding the limit
- Validate input: e.g. length / range / format and type
- Consider logging input validation failures. Assume that someone who is performing hundreds of failed input validations per second has a malicious intent.
- Constrain string inputs with regular expression where appropriate

## Content Type Validation

Honour the specified content-type. Reject requests containing unexpected or missing content type headers with HTTP response status `415 Unsupported Media Type`.

## Gateway Security Features

It is preferable to use the security policy features available in the WoG API Gateway platform than to implement the policies in your back-end API.

| Security | API Gateway Component | Comment | Implementation Required |
| --- | --- | --- | --- |
| HTTP verbs | Listeners-\>Path | HTTP verbs can be selected when defining the path for the API | Recommended |
| Input Validation | Filter -\> Content Filtering | Various filters can be used for validating the input i.e. message size, schema validation, validate headers, validate query strings etc. | Recommended |
| SSL | Listeners | SSL protocol (i.e. TLS 1.2 etc.) can be selected at listener level | Recommended |
| Digital Certificate | Filter -\> Integrity | Various filters can be used for creating and validating the signature i.e. XML signature, JWT sign | Optional depends on business requirements (Recommended algorithm is RS256) |
| JWT | Filter -\> Integrity | Message can be signed using JWT | Optional depends on business requirements |
| API Keys | Filter -\> Authentication | Various filters can be used for authenticating the consumers i.e. API Keys etc. | Recommended |
| OAUTH | Filter -\> OAUTH | OAUTH can be used for authorizing the consumers | Optional as it depends on business requirements |
| CORS | Listeners-\>Path | CORS can be restricted at path level | Recommended |

The WoG API Team can provide advice on which API Gateway security policies should be applied.
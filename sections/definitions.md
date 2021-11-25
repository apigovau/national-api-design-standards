______________________________________________________________________________
# Definitions

## API

In the context of this API Design Standard, an API (Application Programming Interface) is defined as a RESTful API.

A RESTful API is a style of communication between systems where resources are defined by URI and its operations are defined by the use of HTTP methods.

A RESTful API adopts many HTTP standards such as response codes and methods.

## Resource

In order to design a useful and clean API your system should be broken down into logical groupings (often called Models or Resources). In most cases the resources are the 'nouns' of your system.

In the example of an HR system, the resources are `employees`, `positions` and `leave-requests`.

By breaking systems down into these logical areas it allows a clean separation of concerns (e.g. employee functions only work on `employees` and only `employees` can apply for `leave-requests`).  It also ensures that each piece of data that is returned from your API is the smallest that it needs to be to fulfil the client requirement (e.g. when asking for `employees` you don't also receive back `family-members`).

## Resource Identifier

Every resource that is available within your system (e.g. every employee or every leave-request) must be identifiable uniquely within the system. This is a key element of the RESTful style of APIs; the ability to individually address any item within your system and store these identifiers for later use.

Resource identifiers can be any of the following:

Name | Example
-- | --
Numeric | /leave-requests/12389
String | /country-codes/australia
GUID | /employees/0d047d80-eb69-4665-9395-6df5a5e569a4
Date (Short form) | /dates/2018-09-17

As long as the identifier is unique within your application it can be any string of characters or numbers.

The resource identifier MUST be immutable. Primary keys or Personally Identifiable Information (PII) MUST NOT be exposed. When numeric IDs are used they MUST NOT be sequential e.g. it should not be trivial to guess the next ID. If this is difficult to achieve, then it is likely the API needs to be further abstracted from the underlying data source.

## Representation

A key concept in RESTful API design is the idea of the representation of a resource at any particular time.

When you ask the system for employee information you will receive a representation of that employee e.g.

```
HTTP 1.1 GET /employees/0d047d80-eb69-4665-9395-6df5a5e569a4
Accept: application/json

200 OK
Content-Type: application/json

{
  "name" : "John Smith",
  "employee_id" : "0d047d80-eb69-4665-9395-6df5a5e569a4",
  "position" : "Manager",
  "onLeave" : false
}
```

The intent is this representation can change over time as the system and data within changes.  A future call to this same endpoint may yield a different representation possibly if the employee is now on leave or their position within the organisation has changed.

It is also possible to request an entirely different representation of this same resource if the system supports it.  For example, there may be a case where you require a PDF version of this employee and this could be facilitated with a request for a different representation through the `Accept` header:

```
HTTP 1.1 GET /employees/0d047d80-eb69-4665-9395-6df5a5e569a4
Accept: application/pdf

200 OK
Content-Type: application/pdf

...<BINARY CODE>...
```

More information about representations and how to support them is provided in the [Hypermedia](hypermedia.html) section of this document.

## Namespace

The namespace for a service defines the grouping of related functions within.  Namespaces could be quite high level (e.g. an agency or department name) or quite low level (e.g. a project, team or service being exposed).

Namespaces are useful when providing consumers access to related functions through gateway technologies.  Once a consumer has an access token to a particular namespace it is likely (though not always required) that they will get access to all functions supplied within that namespace.

Namespaces are relevant when designing your URL structure and are further covered in section [URI Component Names](naming-conventions.html#uri-component-names).

## Operation

To make use of any of the namespaces, resources and resource identifiers, developers must make use of Operations.

An operation is defined by the use of:

- an HTTP method; and
- a resource path.

Examples:

```
GET /employees
GET /employees/0d047d80-eb69-4665-9395-6df5a5e569a4
DELETE /employees/0d047d80-eb69-4665-9395-6df5a5e569a4
```

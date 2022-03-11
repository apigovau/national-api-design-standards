______________________________________________________________________________
# Webhooks

## Current Guidance

Webhooks allow API Consumers to be notified of when a specific event occurs within an API interface. To implement this the API Consumer must establish a URL Endpoint that can receive and process a HTTP POST request. The endpoint must also be registered with the API Publisher along with the events that the API Consumer is interested in subscribing to.

In a basic implementation an API Webhook payload is usually sent as a JSON document and will only provide enough information about the event that occurred. e.g. the message can contain just the reference id of the resource that has been updated. As a result the consumer will have to make a subsequent call to the API Interface to retrieve the updated resource.

In a more sophisticated scenario an API Webhook payload can provide the details of the updates that have occurred without the API Consumer having to make a subsequent call to retrieve the updated resource. This reduces the network traffic but is likely to add additional complexity to the API Interface design.

The following design guidelines should be considered when implementing Webhooks for your API:

- If you are sending sensitive data in your Webhook then consider encrypting/signing the Webhook POST request for message integrity and verification
- Within your Webhook POST request it is useful to include a unique event Id for troubleshooting and auditing purposes
- Your API should implement a retry mechanism in case the destination URL is not available
- The API Platform does not have existing capabilities to register Webhook endpoints, so onboarding/offboarding will need to be considered separately
- Webhooks require additional infrastructure from your API Consumers so consider their needs and capabilities when designing your solution

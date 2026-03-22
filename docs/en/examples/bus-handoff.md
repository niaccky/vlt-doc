# Bus Handoff Example

## Scenario

This sample centers on `order-bus` and shows an asynchronous publish-consume-publish handoff pattern that eventually lands in the audit service.

## Source file

```text
examples/upload-bus-handoff.json
```

## Trace ID

```text
33333333333333333333333333333333
```

## Key sources

- `checkout-web`
- `order-bus`
- `inventory-worker`
- `shipping-worker`
- `email-worker`
- `audit-service`

## Expected topology shape

```text
checkout-web
  -> order-bus
  -> inventory-worker
  -> order-bus
  -> shipping-worker
  -> order-bus
  -> email-worker
  -> audit-service
```

## Key field snippet

```json
{
  "requestId": "req-topology-bus-handoff",
  "defaultSource": {
    "sourceName": "checkout-web",
    "sourceType": "SOURCE_TYPE_SERVICE"
  },
  "records": [
    {
      "eventName": "order_event_published",
      "source": {
        "sourceName": "order-bus",
        "sourceType": "SOURCE_TYPE_MQ"
      }
    },
    {
      "eventName": "confirmation_email_scheduled",
      "source": {
        "sourceName": "email-worker"
      }
    }
  ]
}
```

## What to look for

- How `SOURCE_TYPE_MQ` appears as a routing hub in topology
- How asynchronous handoff differs visually from a linear service chain
- How the final `audit-service` node closes the trace

## Sources of truth

- `examples/upload-bus-handoff.json`

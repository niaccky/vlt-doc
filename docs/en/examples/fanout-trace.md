# Fan-out and Join Example

## Scenario

This sample uses `order-orchestrator` as the hub. It fans out to inventory, pricing, and promotion branches, then joins back into payment and notification. It is useful for observing a center node that appears repeatedly.

## Source file

```text
examples/upload-fanout.json
```

## Trace ID

```text
11111111111111111111111111111111
```

## Key sources

- `order-api`
- `order-orchestrator`
- `inventory-service`
- `pricing-engine`
- `promo-service`
- `payment-worker`
- `notification-bus`

## Expected topology shape

```text
order-api
  -> order-orchestrator
  -> inventory-service
  -> order-orchestrator
  -> pricing-engine
  -> order-orchestrator
  -> promo-service
  -> order-orchestrator
  -> payment-worker
  -> notification-bus
```

## Key field snippet

```json
{
  "requestId": "req-topology-fanout-hub",
  "defaultSource": {
    "sourceName": "order-api",
    "sourceType": "SOURCE_TYPE_SERVICE"
  },
  "records": [
    {
      "eventName": "workflow_started",
      "source": {
        "sourceName": "order-orchestrator"
      }
    },
    {
      "eventName": "promotion_applied",
      "source": {
        "sourceName": "promo-service"
      }
    }
  ]
}
```

## What to look for

- How `order-orchestrator` behaves as the hub node in topology
- How timeline lanes represent branch fan-out and join-back
- Why repeated appearances of the same source instance do not create new nodes

## Sources of truth

- `examples/upload-fanout.json`

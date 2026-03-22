# Linear Trace Example

## Scenario

This sample shows a checkout flow that moves through inventory, pricing, payment, fraud, ledger, and notification. It is mostly linear, but it returns to `inventory-service` once in the middle.

## Source file

```text
examples/upload.json
```

## Trace ID

```text
0123456789abcdef0123456789abcdef
```

## Key sources

- `checkout-service`
- `inventory-service`
- `pricing-engine`
- `payment-worker`
- `fraud-service`
- `ledger-writer`
- `notification-bus`

## Expected topology shape

```text
checkout-service
  -> inventory-service
  -> pricing-engine
  -> inventory-service
  -> payment-worker
  -> fraud-service
  -> ledger-writer
  -> notification-bus
```

## Key field snippet

```json
{
  "requestId": "req-topology-7-nodes",
  "project": "demo",
  "environment": "dev",
  "defaultSource": {
    "sourceName": "checkout-service",
    "sourceType": "SOURCE_TYPE_SERVICE",
    "instanceId": "checkout-1"
  },
  "records": [
    {
      "eventName": "request_received",
      "traceId": "0123456789abcdef0123456789abcdef"
    },
    {
      "eventName": "ledger_write_delayed",
      "severityNumber": 17
    }
  ]
}
```

## What to look for

- How the batch default source feeds the first log
- How `severityNumber: 17` affects topology and timeline error counts
- How string and structured `body` values normalize differently

## Sources of truth

- `examples/upload.json`

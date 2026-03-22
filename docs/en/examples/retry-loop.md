# Retry Loop Example

## Scenario

This sample shows a refund worker retrying against a bank gateway and eventually switching to a fallback bank instance. It is a good fit for validating loop-like flows and instance changes in topology.

## Source file

```text
examples/upload-retry-loop.json
```

## Trace ID

```text
22222222222222222222222222222222
```

## Key sources

- `refund-api`
- `refund-worker`
- `bank-gateway` (`bank-1`)
- `bank-gateway` (`bank-2`)
- `notification-bus`

## Expected topology shape

```text
refund-api
  -> refund-worker
  -> bank-gateway(bank-1)
  -> refund-worker
  -> bank-gateway(bank-1)
  -> refund-worker
  -> bank-gateway(bank-2)
  -> refund-worker
  -> notification-bus
```

## Key field snippet

```json
{
  "requestId": "req-topology-retry-loop-v2",
  "records": [
    {
      "eventName": "bank_timeout",
      "severityNumber": 13
    },
    {
      "eventName": "fallback_provider_selected",
      "severityNumber": 17
    },
    {
      "eventName": "refund_settled",
      "source": {
        "sourceName": "bank-gateway",
        "instanceId": "bank-2"
      }
    }
  ]
}
```

## What to look for

- Back-and-forth edges between `refund-worker` and `bank-gateway`
- Why changing `instance_id` creates a different node
- How `severityNumber >= 17` impacts error counters

## Sources of truth

- `examples/upload-retry-loop.json`

# Errors and Limits

This page collects protocol errors, HTTP status codes, and current implementation limits in one place.

## Batch-level failures

The whole batch is rejected when:

- `request_id` is missing
- `project` is missing
- `environment` is missing
- `producer` is missing
- `producer.protocol_version != "v1"`
- `records` is empty
- `records` exceeds the configured limit
- body decoding fails
- `Content-Type` is unsupported
- `Content-Encoding` is unsupported

## Record-level failures

A single record is rejected into `errors[]` when:

- `event_time` is missing
- `severity_number` falls outside `0..24`
- the effective source is invalid
- `trace_id` has an invalid format
- `span_id` has an invalid format
- `trace_flags` has an invalid format

## HTTP status codes

| Status | Meaning |
| --- | --- |
| `200` | Upload succeeded, or partially succeeded |
| `400` | Invalid request, decode failure, or malformed query parameters |
| `401` | Missing bearer token, or token not authorized for the project |
| `413` | Request body exceeds the configured limit |
| `500` | Internal normalization or storage failure |

## Current limits

- Default maximum of `1000` log records per request
- Default maximum decompressed body size of `1 MiB`
- In-memory storage only
- Process-local idempotency cache
- Fixed idempotency TTL of 24 hours
- No pagination in query endpoints
- Query result ordering is fixed in code

## What it does not do today

- It does not build graphs from span parent-child relationships
- It does not expose `observed_time` in query responses
- It does not search attributes or resource through `keyword`

## Sources of truth

- `docs/protocol.md`
- `internal/api/http.go`
- `internal/ingest/decode.go`
- `internal/ingest/service.go`
- `internal/ingest/validate.go`
- `internal/store/memory/memory.go`

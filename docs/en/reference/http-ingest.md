# `POST /v1/logs`

This is the only upload endpoint in the current implementation.

## Request contract

- Method: `POST`
- Path: `/v1/logs`
- Auth: `Authorization: Bearer <ingest_token>`

## Supported content types

- `application/protobuf`
- `application/protobuf+json`
- `application/json`

## Supported content encodings

- `identity`
- `gzip`

## Batch-level rules

- `request_id`, `project`, and `environment` are required
- `producer` is required
- `producer.protocol_version` must be `v1`
- `records` must not be empty
- Record count must not exceed `VLT_MAX_RECORDS`

## Record-level rules

- `event_time` is required
- `severity_number` must be in `0..24`
- A valid effective source must resolve `source_name` and `source_type`
- If present, `trace_id` must be 32 lowercase hex chars
- If present, `span_id` must be 16 lowercase hex chars
- If present, `trace_flags` must be 2 lowercase hex chars

## Idempotency and partial success

- Idempotency key: `project + request_id`
- Cache TTL: 24 hours
- Record-level rejection does not fail the whole batch
- Accepted records are still written
- `errors[].retryable` is always `false` today

## Typical JSON request

```bash
curl -X POST "http://localhost:8080/v1/logs" \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  --data-binary @examples/upload.json
```

## Typical Protobuf request

The simplest path is to use the bundled sender:

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -format protobuf
```

## Typical success response

```json
{
  "requestId": "req-http-1",
  "accepted": 1,
  "rejected": 0,
  "errors": []
}
```

## Status codes

| Status | When it appears |
| --- | --- |
| `200` | Full success or partial success |
| `400` | Invalid batch, decode failure, unsupported content type or encoding |
| `401` | Missing/invalid bearer token, or token not allowed for the project |
| `413` | Decompressed request body exceeds `VLT_MAX_BODY_BYTES` |

## Sources of truth

- `internal/api/http.go`
- `internal/ingest/decode.go`
- `internal/ingest/service.go`
- `internal/ingest/validate.go`

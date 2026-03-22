# Protocol Overview

The current VLT surface has two layers:

- Proto definitions for upload requests, log records, and shared types
- HTTP endpoints for ingest and query behavior

## Proto package layout

| Package | Purpose |
| --- | --- |
| `vlt.common.v1` | Source types, source references, producer metadata |
| `vlt.logs.v1` | One log record |
| `vlt.ingest.v1` | Upload request, upload response, record-level errors |

## HTTP surface

### Ingest

- `POST /v1/logs`

### Query

- `GET /healthz`
- `GET /v1/logs/search`
- `GET /v1/traces/{trace_id}`
- `GET /v1/traces/{trace_id}/timeline`
- `GET /v1/traces/{trace_id}/topology`
- `GET /v1/sources`

## Encoding rules

### Upload requests

- Protobuf binary
- Protobuf JSON representation
- Standard JSON
- Optional `gzip`

### Query responses

- JSON only in the current implementation

## Suggested reading order

1. Start with [POST /v1/logs](./http-ingest)
2. Continue with [Normalization and Derivation](./normalization)
3. Then dive into `common.v1`, `logs.v1`, and `ingest.v1` as needed

## Sources of truth

- `proto/vlt/common/v1/common.proto`
- `proto/vlt/logs/v1/logs.proto`
- `proto/vlt/ingest/v1/ingest.proto`
- `internal/api/http.go`

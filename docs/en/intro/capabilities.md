# Capabilities

This page summarizes only what the current implementation already does.

## 1. Ingestion and integration

- One ingestion entrypoint: `POST /v1/logs`
- Supported content types:
  - `application/protobuf`
  - `application/protobuf+json`
  - `application/json`
- Supported content encodings: `identity` and `gzip`
- Bearer token authorization with project-scoped access
- Batch idempotency keyed by `project + request_id`
- Record-level rejection, so one batch can partially succeed

## 2. Structured validation

- Batch-level validation for `request_id`, `project`, `environment`, and `producer.protocol_version`
- Record-level validation for `event_time`, `severity_number`, `source`, `trace_id`, `span_id`, and `trace_flags`
- Default record limit of `1000` per request
- Default decompressed body limit of `1 MiB`

## 3. Normalization and modeling

- Merges batch `default_source` with per-record `LogRecord.source`
- Produces a unified `NormalizedLogRecord`
- Computes `source_fingerprint` for each accepted record
- Preserves both `body_text` and `body_json`

## 4. Query APIs

- `GET /v1/logs/search`
- `GET /v1/traces/{trace_id}`
- `GET /v1/traces/{trace_id}/timeline`
- `GET /v1/traces/{trace_id}/topology`
- `GET /v1/sources`

## 5. Frontend visualization

- Logs Explorer for filtering and opening traces
- Trace Workbench for summary cards, topology, timeline lanes, and inspection
- Sources View for `source_type -> source_name -> instance_id`
- Built-in UI i18n in the frontend itself

## 6. Examples and demo flow

- Linear trace example
- Fan-out and join example
- Retry loop example
- Message bus handoff example
- `make preview` / `./scripts/dev-preview.sh` for an end-to-end local preview

## Sources of truth

- `README.md`
- `docs/protocol.md`
- `internal/api/http.go`
- `internal/ingest/*.go`
- `internal/store/*.go`
- `web/src/App.jsx`

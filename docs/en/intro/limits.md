# Current Limits

This page documents what the implementation does not provide yet.

## Storage and durability

- Only an in-memory store is implemented
- Data disappears when the process restarts
- There is no indexing, sharding, or storage tiering

## Ingestion and authorization

- There is only one ingestion endpoint: `POST /v1/logs`
- Only Bearer token authorization is implemented
- Tokens are authorized at the project level only

## Query behavior

- All query endpoints return JSON
- Log search supports only fixed query fields
- `keyword` matches `body_text + body_json` only, not attributes or resource
- There is no pagination or configurable sort order

## Trace and topology semantics

- Topology is not a span graph; it is inferred from adjacent source segments inside a trace
- Consecutive identical source segments are collapsed to avoid accidental self-loops
- `observed_time` is accepted by the protocol but is not exposed in current normalized query outputs

## Idempotency and caching

- The idempotency window is process-local
- TTL is fixed at 24 hours
- The idempotency key is `project + request_id`

## Frontend and deployment

- The current frontend defaults to `http://localhost:8080`
- This documentation does not add CI/CD or production deployment guidance

## Sources of truth

- `README.md`
- `internal/config/config.go`
- `internal/ingest/service.go`
- `internal/ingest/normalize.go`
- `internal/store/memory/memory.go`

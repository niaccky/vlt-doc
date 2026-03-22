# Architecture and Data Flow

VLT is intentionally a compact monolithic reference implementation. Ingestion, validation, normalization, in-memory storage, HTTP queries, and the frontend workbench all live in the same repository.

## End-to-end path

1. A client builds an `ingest.v1.UploadLogsRequest`.
2. The batch is sent to `POST /v1/logs` with `Authorization: Bearer <token>`.
3. The server reads the body, handles `Content-Encoding`, and decodes by `Content-Type`.
4. It performs batch-level validation and then record-level validation.
5. Accepted records are normalized into `NormalizedLogRecord`.
6. Those records are written into the in-memory store.
7. Frontend or other clients query logs, trace detail, timeline, topology, and grouped sources.

## Main modules

<div class="vlt-source-list">
  <div>
    <strong>Protocol layer</strong>
    <span><code>proto/vlt/common/v1</code>, <code>proto/vlt/logs/v1</code>, and <code>proto/vlt/ingest/v1</code></span>
  </div>
  <div>
    <strong>Ingest layer</strong>
    <span><code>internal/ingest</code> handles decoding, validation, authorization, normalization, and idempotency caching.</span>
  </div>
  <div>
    <strong>HTTP API</strong>
    <span><code>internal/api/http.go</code> exposes ingest and query routes and applies CORS.</span>
  </div>
  <div>
    <strong>Store layer</strong>
    <span><code>internal/store/memory</code> stores normalized records and serves aggregations.</span>
  </div>
</div>

## Core derived entities

- `NormalizedLogRecord`: the base record used by search and trace aggregation
- `TraceTimelineResponse`: timeline grouped by `source_fingerprint`
- `TraceTopologyResponse`: nodes and edges derived from adjacent source segments
- `SourceGroup`: grouped data for the sources view

## Important derivations

- Effective source prefers `LogRecord.source`; otherwise it falls back to batch `default_source`
- `source_fingerprint` is derived from `project + environment + source_type + source_name + instance_id`
- Timeline groups records by `source_fingerprint`
- Topology first collapses consecutive identical source segments, then emits edges from adjacent segments

## Deliberate tradeoffs

- In-memory storage keeps the reference implementation simple
- One HTTP ingest surface keeps protocol behavior explicit
- Explicit source modeling keeps the multi-source trace problem easy to reason about

## Sources of truth

- `internal/api/http.go`
- `internal/ingest/decode.go`
- `internal/ingest/normalize.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

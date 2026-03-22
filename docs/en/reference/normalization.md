# Normalization and Derivation

The query layer does not expose raw `LogRecord` values directly. The server first normalizes each accepted record into one unified shape and then derives timeline, topology, and source views from that data.

## `NormalizedLogRecord`

| Field | Meaning |
| --- | --- |
| `log_id` | Original log identifier |
| `project` | Logical project |
| `environment` | Logical environment |
| `source_type` | Source type without the `SOURCE_TYPE_` prefix, such as `SERVICE` |
| `source_name` | Source name |
| `source_id` | Source identifier |
| `instance_id` | Instance identifier |
| `timestamp` | `event_time`, converted to UTC |
| `severity_number` | Numeric severity |
| `severity_text` | Text severity |
| `logger_name` | Logger name |
| `event_name` | Event name |
| `body_text` | Search/display friendly text form |
| `body_json` | Raw JSON form of the body |
| `attributes_json` | Attributes as JSON |
| `resource_json` | Batch resource map as JSON |
| `trace_id` | Trace ID |
| `span_id` | Span ID |
| `trace_flags` | Trace flags |
| `source_fingerprint` | Source-instance aggregation key |

## `source_fingerprint` formula

The current implementation uses:

```text
sha256(project | environment | source_type | source_name | instance_id)
```

It then keeps the first 16 bytes and encodes them as hexadecimal.

## Effective source selection

Rules:

1. If `LogRecord.source.source_name` is non-empty, use the record-level source
2. Otherwise fall back to batch `default_source`

## Timeline aggregation

- Filter records by `trace_id`
- Group them into lanes by `source_fingerprint`
- Each lane carries:
  - `event_count`
  - `error_count`
  - `first_seen`
  - `last_seen`
  - `events[]`
- `events[]` are sorted by timestamp ascending
- `event_id` prefers `log_id`; otherwise it falls back to `source_fingerprint/timestampUnixNano`

## Topology derivation

- Sort trace records by timestamp ascending
- Collapse consecutive records with the same `source_fingerprint` into segments
- Emit edges from adjacent segments
- Repeated edges in the same direction accumulate `transition_count`

## Error counting rule

The current implementation treats a record as an error when:

```text
severity_number >= 17
```

This affects:

- timeline `error_count`
- topology node `error_count`
- topology edge `error_count`

## Source grouping

The source tree is grouped as:

```text
source_type -> source_name -> instance_id
```

If `instance_id` is empty, the current implementation uses `-`.

## Sources of truth

- `internal/ingest/normalize.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

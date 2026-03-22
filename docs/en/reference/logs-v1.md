# `logs.v1`

`vlt.logs.v1.LogRecord` represents one raw log event.

## `LogRecord` fields

| Field | Type | Current implementation meaning |
| --- | --- | --- |
| `log_id` | `string` | Optional; preferred as timeline event ID |
| `event_time` | `Timestamp` | Required |
| `observed_time` | `Timestamp` | Optional; accepted but not exposed by normalization |
| `severity_number` | `int32` | Must be in `0..24` |
| `severity_text` | `string` | Optional text severity |
| `logger_name` | `string` | Optional |
| `event_name` | `string` | Optional |
| `body` | `Value` | Can be string, object, array, number, and more |
| `source` | `SourceRef` | Optional; can override the batch default source |
| `attributes` | `map<string, Value>` | Optional attributes |
| `trace_id` | `string` | Optional; if present, must be 32 lowercase hex chars |
| `span_id` | `string` | Optional; if present, must be 16 lowercase hex chars |
| `trace_flags` | `string` | Optional; if present, must be 2 lowercase hex chars |

## How `body` is normalized

### When `body` is a string

- `body_text` becomes the original string
- `body_json` becomes the JSON string value

Example:

```json
{
  "body": "received request /checkout"
}
```

### When `body` is structured

- `body_text` becomes the serialized JSON string
- `body_json` keeps the original JSON structure

Example:

```json
{
  "body": {
    "message": "risk scoring finished",
    "score": 0.08
  }
}
```

## Source override rule

- If `LogRecord.source.source_name` is non-empty, the server uses the record-level source
- Otherwise it falls back to batch `default_source`

## Sources of truth

- `proto/vlt/logs/v1/logs.proto`
- `internal/ingest/validate.go`
- `internal/ingest/normalize.go`

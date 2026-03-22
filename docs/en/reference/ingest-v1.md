# `ingest.v1`

`vlt.ingest.v1` defines upload batches, upload responses, and record-level errors.

## `UploadLogsRequest`

| Field | Type | Meaning |
| --- | --- | --- |
| `request_id` | `string` | Required; part of the idempotency key |
| `project` | `string` | Required; used by auth and idempotency |
| `environment` | `string` | Required |
| `producer` | `ProducerInfo` | Required, and `protocol_version` must be `v1` |
| `default_source` | `SourceRef` | Batch default source |
| `resource` | `map<string, Value>` | Batch-level resource attributes |
| `records` | `repeated LogRecord` | Required and must not be empty |

## `UploadLogsResponse`

| Field | Type | Meaning |
| --- | --- | --- |
| `request_id` | `string` | Echoes the request ID |
| `accepted` | `int32` | Number of accepted records |
| `rejected` | `int32` | Number of rejected records |
| `errors` | `repeated RecordError` | Per-record validation errors |

## `RecordError`

| Field | Type | Meaning |
| --- | --- | --- |
| `record_index` | `int32` | Index of the failed record in the batch |
| `code` | `RejectCode` | Reject code |
| `message` | `string` | Human-readable message |
| `retryable` | `bool` | Always `false` in the current implementation |

## `RejectCode`

| Enum | Meaning |
| --- | --- |
| `REJECT_CODE_UNSPECIFIED` | Unspecified |
| `REJECT_CODE_INVALID_REQUEST` | Invalid overall request |
| `REJECT_CODE_INVALID_PROJECT` | Invalid project |
| `REJECT_CODE_INVALID_ENVIRONMENT` | Invalid environment |
| `REJECT_CODE_INVALID_PROTOCOL_VERSION` | Invalid protocol version |
| `REJECT_CODE_TOO_MANY_RECORDS` | Too many records |
| `REJECT_CODE_MISSING_EVENT_TIME` | Missing `event_time` |
| `REJECT_CODE_INVALID_SOURCE` | Invalid source |
| `REJECT_CODE_INVALID_SEVERITY` | Invalid `severity_number` |
| `REJECT_CODE_INVALID_TRACE_ID` | Invalid `trace_id` |
| `REJECT_CODE_INVALID_SPAN_ID` | Invalid `span_id` |
| `REJECT_CODE_INVALID_TRACE_FLAGS` | Invalid `trace_flags` |

## Current response semantics

- Batch-level failures return an HTTP error instead of `UploadLogsResponse`
- Record-level failures still return HTTP `200`, with `accepted`, `rejected`, and `errors`
- Repeating the same `project + request_id` within 24 hours returns the cached response

## Sources of truth

- `proto/vlt/ingest/v1/ingest.proto`
- `internal/ingest/service.go`
- `internal/ingest/validate.go`

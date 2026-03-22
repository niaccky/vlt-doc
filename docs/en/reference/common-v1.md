# `common.v1`

`vlt.common.v1` defines shared types reused across ingestion and normalization.

## `SourceType`

Current enum values:

| Enum | Meaning |
| --- | --- |
| `SOURCE_TYPE_UNSPECIFIED` | Unspecified |
| `SOURCE_TYPE_SERVICE` | Service |
| `SOURCE_TYPE_JOB` | Job |
| `SOURCE_TYPE_HOST` | Host |
| `SOURCE_TYPE_CONTAINER` | Container |
| `SOURCE_TYPE_FUNCTION` | Function |
| `SOURCE_TYPE_BROWSER` | Browser |
| `SOURCE_TYPE_MOBILE` | Mobile |
| `SOURCE_TYPE_DESKTOP` | Desktop |
| `SOURCE_TYPE_DATABASE` | Database |
| `SOURCE_TYPE_MQ` | Message queue |
| `SOURCE_TYPE_AGENT` | Agent |
| `SOURCE_TYPE_CUSTOM` | Custom |

## `SourceRef`

| Field | Type | Meaning |
| --- | --- | --- |
| `source_id` | `string` | Optional source identifier |
| `source_name` | `string` | Source name; required by current validation |
| `source_type` | `SourceType` | Source type; must not be `UNSPECIFIED` |
| `namespace` | `string` | Optional logical namespace |
| `instance_id` | `string` | Optional instance identifier; affects `source_fingerprint` |
| `labels` | `map<string,string>` | Custom labels |

## `ProducerInfo`

| Field | Type | Meaning |
| --- | --- | --- |
| `client_name` | `string` | Sender name |
| `client_version` | `string` | Sender version |
| `protocol_version` | `string` | Must be `v1` in the current server |

## Important implementation semantics

- `SourceRef` can appear as batch `default_source` and per-record `LogRecord.source`
- A record-level source with a non-empty `source_name` overrides the batch default source
- During normalization, `source_type` drops the `SOURCE_TYPE_` prefix, so stored values become `SERVICE`, `JOB`, and so on

## Sources of truth

- `proto/vlt/common/v1/common.proto`
- `internal/ingest/validate.go`
- `internal/ingest/normalize.go`

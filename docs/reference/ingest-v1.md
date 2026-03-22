# `ingest.v1`

`vlt.ingest.v1` 描述上传批次、上传响应和记录级错误。

## `UploadLogsRequest`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `request_id` | `string` | 必填；参与幂等键 |
| `project` | `string` | 必填；参与 token 授权和幂等键 |
| `environment` | `string` | 必填 |
| `producer` | `ProducerInfo` | 必填，且 `protocol_version` 必须为 `v1` |
| `default_source` | `SourceRef` | 批次默认来源 |
| `resource` | `map<string, Value>` | 批次级资源属性 |
| `records` | `repeated LogRecord` | 必填且不能为空 |

## `UploadLogsResponse`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `request_id` | `string` | 原样返回请求 ID |
| `accepted` | `int32` | 成功写入的记录数 |
| `rejected` | `int32` | 被拒绝的记录数 |
| `errors` | `repeated RecordError` | 每条失败记录的错误 |

## `RecordError`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `record_index` | `int32` | 失败记录在批次里的索引 |
| `code` | `RejectCode` | 拒绝码 |
| `message` | `string` | 错误信息 |
| `retryable` | `bool` | 当前实现始终返回 `false` |

## `RejectCode`

| 枚举值 | 含义 |
| --- | --- |
| `REJECT_CODE_UNSPECIFIED` | 未指定 |
| `REJECT_CODE_INVALID_REQUEST` | 请求整体无效 |
| `REJECT_CODE_INVALID_PROJECT` | project 无效 |
| `REJECT_CODE_INVALID_ENVIRONMENT` | environment 无效 |
| `REJECT_CODE_INVALID_PROTOCOL_VERSION` | 协议版本无效 |
| `REJECT_CODE_TOO_MANY_RECORDS` | 记录数过多 |
| `REJECT_CODE_MISSING_EVENT_TIME` | 缺少 `event_time` |
| `REJECT_CODE_INVALID_SOURCE` | 来源无效 |
| `REJECT_CODE_INVALID_SEVERITY` | `severity_number` 无效 |
| `REJECT_CODE_INVALID_TRACE_ID` | `trace_id` 无效 |
| `REJECT_CODE_INVALID_SPAN_ID` | `span_id` 无效 |
| `REJECT_CODE_INVALID_TRACE_FLAGS` | `trace_flags` 无效 |

## 当前实现中的返回语义

- 批次级错误会直接返回 HTTP 错误，不产生 `UploadLogsResponse`
- 记录级错误会返回 HTTP `200`，并通过 `accepted` / `rejected` / `errors` 表示部分成功
- 相同 `project + request_id` 在 24 小时内再次上传，会命中幂等缓存并返回同一个响应

## 事实来源

- `proto/vlt/ingest/v1/ingest.proto`
- `internal/ingest/service.go`
- `internal/ingest/validate.go`

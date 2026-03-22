# `logs.v1`

`vlt.logs.v1.LogRecord` 表示一条原始日志记录。

## `LogRecord` 字段

| 字段 | 类型 | 当前实现语义 |
| --- | --- | --- |
| `log_id` | `string` | 可选；若存在，会优先作为 timeline event ID |
| `event_time` | `Timestamp` | 必填 |
| `observed_time` | `Timestamp` | 可选；当前服务端接受但不会进入归一化输出 |
| `severity_number` | `int32` | 必须在 `0..24` |
| `severity_text` | `string` | 可选文本级别 |
| `logger_name` | `string` | 可选 |
| `event_name` | `string` | 可选 |
| `body` | `Value` | 可为字符串、对象、数组、数字等 |
| `source` | `SourceRef` | 可选；存在时可覆盖批次默认来源 |
| `attributes` | `map<string, Value>` | 可选属性 |
| `trace_id` | `string` | 可选；如果出现，必须是 32 位小写十六进制 |
| `span_id` | `string` | 可选；如果出现，必须是 16 位小写十六进制 |
| `trace_flags` | `string` | 可选；如果出现，必须是 2 位小写十六进制 |

## `body` 的归一化表现

### 当 `body` 是字符串

- `body_text` 为原字符串
- `body_json` 为 JSON 字符串

例如：

```json
{
  "body": "received request /checkout"
}
```

### 当 `body` 是对象或其他结构化值

- `body_text` 为结构化值序列化后的 JSON 字符串
- `body_json` 为原始 JSON

例如：

```json
{
  "body": {
    "message": "risk scoring finished",
    "score": 0.08
  }
}
```

## 来源覆盖规则

- 如果当前 `LogRecord.source.source_name` 非空，就使用该来源
- 否则回退到批次 `default_source`

## 事实来源

- `proto/vlt/logs/v1/logs.proto`
- `internal/ingest/validate.go`
- `internal/ingest/normalize.go`

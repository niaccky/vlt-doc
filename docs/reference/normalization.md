# 归一化模型与推导规则

VLT 的查询层不是直接返回原始 `LogRecord`，而是先把每条记录归一化成统一结构，再基于这个结构做 timeline、topology 和 sources 聚合。

## `NormalizedLogRecord`

| 字段 | 说明 |
| --- | --- |
| `log_id` | 原始日志 ID |
| `project` | 所属项目 |
| `environment` | 所属环境 |
| `source_type` | 去掉前缀后的来源类型，如 `SERVICE` |
| `source_name` | 来源名称 |
| `source_id` | 来源 ID |
| `instance_id` | 实例 ID |
| `timestamp` | 取自 `event_time`，统一转为 UTC |
| `severity_number` | 数值级别 |
| `severity_text` | 文本级别 |
| `logger_name` | logger 名称 |
| `event_name` | 事件名称 |
| `body_text` | 面向搜索/展示的文本形态 |
| `body_json` | 原始 body 的 JSON 形态 |
| `attributes_json` | 属性 JSON |
| `resource_json` | 批次资源 JSON |
| `trace_id` | Trace ID |
| `span_id` | Span ID |
| `trace_flags` | Trace flags |
| `source_fingerprint` | 来源实例级聚合键 |

## `source_fingerprint` 公式

当前实现使用：

```text
sha256(project | environment | source_type | source_name | instance_id)
```

然后取前 16 个字节再编码为十六进制字符串。

## 有效来源选择

规则如下：

1. 如果 `LogRecord.source.source_name` 非空，使用记录级来源
2. 否则回退到批次 `default_source`

## Timeline 聚合

- 先按 `trace_id` 找出记录
- 再按 `source_fingerprint` 聚合为 lanes
- 每个 lane 保留：
  - `event_count`
  - `error_count`
  - `first_seen`
  - `last_seen`
  - `events[]`
- `events[]` 按时间升序排列
- `event_id` 优先取 `log_id`；如果没有 `log_id`，回退为 `source_fingerprint/timestampUnixNano`

## Topology 推导

- 先按时间升序排列 Trace 记录
- 把连续相同 `source_fingerprint` 的记录折叠成 segment
- 对相邻 segment 生成一条边
- 相同方向的边会累计 `transition_count`

## 错误数判定

当前实现中，错误记录定义为：

```text
severity_number >= 17
```

这会影响：

- timeline `error_count`
- topology node `error_count`
- topology edge `error_count`

## Sources 聚合

来源树的聚合顺序是：

```text
source_type -> source_name -> instance_id
```

如果 `instance_id` 为空，当前实现会把实例名写成 `-`。

## 事实来源

- `internal/ingest/normalize.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

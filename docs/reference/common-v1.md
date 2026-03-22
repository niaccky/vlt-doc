# `common.v1`

`vlt.common.v1` 定义了上传和归一化过程中会反复出现的公共类型。

## `SourceType`

当前枚举值如下：

| 枚举值 | 含义 |
| --- | --- |
| `SOURCE_TYPE_UNSPECIFIED` | 未指定 |
| `SOURCE_TYPE_SERVICE` | 服务 |
| `SOURCE_TYPE_JOB` | 任务 |
| `SOURCE_TYPE_HOST` | 主机 |
| `SOURCE_TYPE_CONTAINER` | 容器 |
| `SOURCE_TYPE_FUNCTION` | 函数 |
| `SOURCE_TYPE_BROWSER` | 浏览器 |
| `SOURCE_TYPE_MOBILE` | 移动端 |
| `SOURCE_TYPE_DESKTOP` | 桌面端 |
| `SOURCE_TYPE_DATABASE` | 数据库 |
| `SOURCE_TYPE_MQ` | 消息队列 |
| `SOURCE_TYPE_AGENT` | Agent |
| `SOURCE_TYPE_CUSTOM` | 自定义 |

## `SourceRef`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `source_id` | `string` | 来源 ID，可选 |
| `source_name` | `string` | 来源名称，当前实现要求非空 |
| `source_type` | `SourceType` | 来源类型，当前实现要求不是 `UNSPECIFIED` |
| `namespace` | `string` | 逻辑命名空间，可选 |
| `instance_id` | `string` | 实例 ID，可选但会影响 `source_fingerprint` |
| `labels` | `map<string,string>` | 自定义标签 |

## `ProducerInfo`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `client_name` | `string` | 发送端名称 |
| `client_version` | `string` | 发送端版本 |
| `protocol_version` | `string` | 当前服务端要求必须为 `v1` |

## 当前实现中的关键语义

- `SourceRef` 可以出现在批次默认来源 `default_source`，也可以出现在单条 `LogRecord.source`
- 记录级来源存在且 `source_name` 非空时，会覆盖批次默认来源
- 归一化时 `source_type` 会去掉前缀 `SOURCE_TYPE_`，例如落库后变成 `SERVICE`、`JOB`

## 事实来源

- `proto/vlt/common/v1/common.proto`
- `internal/ingest/validate.go`
- `internal/ingest/normalize.go`

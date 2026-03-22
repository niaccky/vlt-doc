# 错误与限制

这一页把协议错误、HTTP 状态码和实现限制放在一起，方便对照。

## 批次级错误

下列情况会直接拒绝整批：

- `request_id` 缺失
- `project` 缺失
- `environment` 缺失
- `producer` 缺失
- `producer.protocol_version != "v1"`
- `records` 为空
- `records` 超过上限
- body 解码失败
- `Content-Type` 不支持
- `Content-Encoding` 不支持

## 记录级错误

下列情况会让单条记录进入 `errors[]`：

- 缺少 `event_time`
- `severity_number` 超出 `0..24`
- 有效来源解析失败
- `trace_id` 格式不合法
- `span_id` 格式不合法
- `trace_flags` 格式不合法

## HTTP 状态码对照

| 状态码 | 说明 |
| --- | --- |
| `200` | 上传成功，或者部分成功 |
| `400` | 请求无效、解码失败、参数格式错误 |
| `401` | 缺少 Bearer token，或 token 无权写入当前 project |
| `413` | 请求体超过最大限制 |
| `500` | 归一化或存储阶段的内部错误 |

## 当前限制

- 默认单请求最多 `1000` 条日志
- 默认解压后请求体最大 `1 MiB`
- 只提供内存存储
- 幂等缓存只保存在当前进程
- 幂等 TTL 固定 24 小时
- 查询接口无分页
- 查询结果排序逻辑是代码内固定的默认行为

## 当前不会做的事

- 不会自动根据 span parent-child 关系构图
- 不会把 `observed_time` 暴露到查询响应
- 不会把 attributes/resource 纳入 `keyword` 搜索

## 事实来源

- `docs/protocol.md`
- `internal/api/http.go`
- `internal/ingest/decode.go`
- `internal/ingest/service.go`
- `internal/ingest/validate.go`
- `internal/store/memory/memory.go`

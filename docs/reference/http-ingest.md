# `POST /v1/logs`

这是当前实现唯一的上传入口。

## 请求约定

- 方法：`POST`
- 路径：`/v1/logs`
- 鉴权：`Authorization: Bearer <ingest_token>`

## 支持的内容类型

- `application/protobuf`
- `application/protobuf+json`
- `application/json`

## 支持的内容编码

- `identity`
- `gzip`

## 批次级规则

- `request_id`、`project`、`environment` 必填
- `producer` 必填
- `producer.protocol_version` 必须为 `v1`
- `records` 不能为空
- 单请求记录数不能超过 `VLT_MAX_RECORDS`

## 记录级规则

- `event_time` 必填
- `severity_number` 必须在 `0..24`
- 有效来源必须能解析出 `source_name` 和 `source_type`
- `trace_id` 如出现，必须是 32 位小写十六进制
- `span_id` 如出现，必须是 16 位小写十六进制
- `trace_flags` 如出现，必须是 2 位小写十六进制

## 幂等与部分成功

- 幂等键：`project + request_id`
- 幂等缓存 TTL：24 小时
- 记录级拒绝不会使整批失败
- 通过校验的记录会继续写入
- 当前 `errors[].retryable` 始终为 `false`

## 典型 JSON 请求

```bash
curl -X POST "http://localhost:8080/v1/logs" \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  --data-binary @examples/upload.json
```

## 典型 Protobuf 请求

当前仓库提供了 sender，最直接的方式是：

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -format protobuf
```

## 典型成功响应

```json
{
  "requestId": "req-http-1",
  "accepted": 1,
  "rejected": 0,
  "errors": []
}
```

## 状态码

| 状态码 | 何时出现 |
| --- | --- |
| `200` | 全部成功，或部分成功 |
| `400` | 批次级校验失败、解码失败、内容类型/编码不支持 |
| `401` | Bearer token 缺失、格式不对、或 token 无权写入该 project |
| `413` | 解压后请求体超过 `VLT_MAX_BODY_BYTES` |

## 事实来源

- `internal/api/http.go`
- `internal/ingest/decode.go`
- `internal/ingest/service.go`
- `internal/ingest/validate.go`

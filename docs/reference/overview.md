# 协议总览

VLT 当前的协议表面分成两层：

- Proto：定义上传请求、日志记录和公共类型
- HTTP：定义摄取入口和查询接口

## Proto 包结构

| 包 | 作用 |
| --- | --- |
| `vlt.common.v1` | 来源类型、来源引用、发送端信息 |
| `vlt.logs.v1` | 单条日志记录 |
| `vlt.ingest.v1` | 上传请求、上传响应、记录级错误 |

## HTTP 表面

### 摄取

- `POST /v1/logs`

### 查询

- `GET /healthz`
- `GET /v1/logs/search`
- `GET /v1/traces/{trace_id}`
- `GET /v1/traces/{trace_id}/timeline`
- `GET /v1/traces/{trace_id}/topology`
- `GET /v1/sources`

## 编码规则

### 上传请求

- 支持 protobuf 二进制
- 支持 protobuf JSON 表示
- 支持普通 JSON
- 支持 `gzip`

### 查询响应

- 当前全部返回 JSON

## 阅读建议

1. 先看 [POST /v1/logs](./http-ingest)
2. 再看 [归一化模型与推导规则](./normalization)
3. 最后按需查 `common.v1`、`logs.v1`、`ingest.v1`

## 事实来源

- `proto/vlt/common/v1/common.proto`
- `proto/vlt/logs/v1/logs.proto`
- `proto/vlt/ingest/v1/ingest.proto`
- `internal/api/http.go`

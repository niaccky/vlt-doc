# 能做什么

这一页只总结当前实现已经具备的能力，不延伸到未来可能会做的方向。

## 1. 上传与接入

- 单一上传入口：`POST /v1/logs`
- 支持三种内容类型：
  - `application/protobuf`
  - `application/protobuf+json`
  - `application/json`
- 支持 `identity` 与 `gzip` 内容编码
- Bearer token 鉴权，并按 token 限定可写入的 project
- 批次幂等：幂等键为 `project + request_id`
- 记录级拒绝：同一批次可以部分成功、部分失败

## 2. 结构化校验

- 批次级检查 `request_id`、`project`、`environment`、`producer.protocol_version`
- 记录级检查 `event_time`、`severity_number`、`source`、`trace_id`、`span_id`、`trace_flags`
- 单请求记录数上限默认为 `1000`
- 解压后请求体大小上限默认为 `1 MiB`

## 3. 归一化与建模

- 把批次默认来源 `default_source` 与记录级来源 `LogRecord.source` 合并成有效来源
- 生成统一的 `NormalizedLogRecord`
- 为每条记录计算 `source_fingerprint`
- 把字符串 body 和结构化 body 同时保留为 `body_text` / `body_json`

## 4. 查询接口

- `GET /v1/logs/search`：筛选日志
- `GET /v1/traces/{trace_id}`：按 Trace 返回日志流与 span 概览
- `GET /v1/traces/{trace_id}/timeline`：按来源实例聚合时间线泳道
- `GET /v1/traces/{trace_id}/topology`：按来源实例推导节点与边
- `GET /v1/sources`：聚合来源树

## 5. 前端可视化

- Logs Explorer：筛选并打开 Trace
- Trace Workbench：摘要卡片、拓扑、时间线、检查面板联动
- Sources View：按 `source_type -> source_name -> instance_id` 浏览来源实例
- 前端自身支持中英文界面切换

## 6. 示例与演示

- 线性链路示例
- 扇出/汇合示例
- 重试回环示例
- 消息总线 handoff 示例
- `make preview` / `./scripts/dev-preview.sh` 一键演示完整流程

## 事实来源

- `README.md`
- `docs/protocol.md`
- `internal/api/http.go`
- `internal/ingest/*.go`
- `internal/store/*.go`
- `web/src/App.jsx`

# 当前实现边界

这一页记录的是“现在没有什么”，避免把参考实现误读成更完整的平台能力。

## 存储与持久化

- 只提供内存存储实现
- 进程重启后数据不会保留
- 没有索引、分片、冷热分层或多租户存储策略

## 摄取与鉴权

- 只有一个上传入口：`POST /v1/logs`
- 只有 Bearer token 授权，没有更细粒度的用户/角色模型
- token 只按 project 做允许写入控制

## 查询能力

- 查询接口全部返回 JSON
- 日志搜索当前只支持固定字段筛选，不支持复杂布尔表达式
- `keyword` 只匹配 `body_text + body_json`，不匹配 attributes/resource
- 没有分页参数，没有排序选项

## Trace 与拓扑语义

- topology 不是 span 关系图，而是根据 Trace 内时间相邻来源段推导
- 连续相同来源片段会折叠，避免错误自环
- `observed_time` 会被协议接受，但不会进入当前归一化输出

## 幂等与缓存

- 幂等窗口只在当前进程内维护
- TTL 固定为 24 小时
- 幂等键为 `project + request_id`

## 前端与部署

- 当前前端默认请求 `http://localhost:8080`
- 文档未包含 CI/CD、生产部署或云托管方案

## 事实来源

- `README.md`
- `internal/config/config.go`
- `internal/ingest/service.go`
- `internal/ingest/normalize.go`
- `internal/store/memory/memory.go`

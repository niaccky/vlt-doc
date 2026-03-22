# 架构与数据流

VLT 当前是一套非常明确的单体参考实现：摄取、校验、归一化、内存存储、HTTP 查询和前端工作台都在同一个仓库中。

## 端到端路径

1. 调用方按 `ingest.v1.UploadLogsRequest` 组织日志批次。
2. 发送到 `POST /v1/logs`，并携带 `Authorization: Bearer <token>`。
3. 服务端读取请求体，处理 `Content-Encoding`，再按 `Content-Type` 解码。
4. 执行批次级校验，再执行记录级校验。
5. 对通过校验的记录做归一化，生成 `NormalizedLogRecord`。
6. 写入内存存储。
7. 前端或其他调用方通过查询接口读取日志、Trace、Timeline、Topology、Sources。

## 主要模块

<div class="vlt-source-list">
  <div>
    <strong>协议层</strong>
    <span><code>proto/vlt/common/v1</code>、<code>proto/vlt/logs/v1</code>、<code>proto/vlt/ingest/v1</code></span>
  </div>
  <div>
    <strong>摄取层</strong>
    <span><code>internal/ingest</code> 负责解码、校验、鉴权、归一化、幂等缓存。</span>
  </div>
  <div>
    <strong>HTTP API</strong>
    <span><code>internal/api/http.go</code> 暴露摄取与查询路由，并处理 CORS。</span>
  </div>
  <div>
    <strong>存储层</strong>
    <span><code>internal/store/memory</code> 保存归一化记录并提供聚合查询。</span>
  </div>
</div>

## 归一化之后的核心实体

- `NormalizedLogRecord`：日志查询与 Trace 聚合的统一基础记录
- `TraceTimelineResponse`：以 `source_fingerprint` 为 lane 的时间线视图
- `TraceTopologyResponse`：由相邻来源段推导出的节点/边视图
- `SourceGroup`：供来源视图使用的树形聚合结构

## 关键推导点

- 有效来源优先使用 `LogRecord.source`，否则回退到批次 `default_source`
- `source_fingerprint` 由 `project + environment + source_type + source_name + instance_id` 哈希得出
- timeline 按 `source_fingerprint` 聚合
- topology 会先折叠连续相同 `source_fingerprint` 的片段，再从相邻片段生成边

## 设计取舍

- 选择内存存储，优先降低参考实现复杂度
- 选择单一 HTTP 上传入口，优先把协议行为做清楚
- 选择显式来源建模，优先解决“同一 Trace 下多来源日志如何组织”的问题

## 事实来源

- `internal/api/http.go`
- `internal/ingest/decode.go`
- `internal/ingest/normalize.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

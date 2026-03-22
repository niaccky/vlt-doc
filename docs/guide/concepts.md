# 数据与视图概念

理解这几个概念后，VLT 的协议和 UI 会容易很多。

## project

`project` 是批次级字段，用来表示日志属于哪个逻辑项目。它也是 token 写入权限和幂等键的一部分。

## environment

`environment` 同样是批次级字段，用来区分 `dev`、`staging`、`prod` 之类的环境。

## source

VLT 用 `SourceRef` 表示日志来源。一个来源至少要能解析出：

- `source_name`
- `source_type`

还可以带：

- `source_id`
- `namespace`
- `instance_id`
- `labels`

## trace 与 span

- `trace_id` 表示整条调用链
- `span_id` 表示链路中的一个局部片段
- `trace_flags` 保留 Trace 元数据

当前实现会校验它们的格式，但 topology 并不是按 span parent-child 推导的。

## source_fingerprint

这是当前实现里非常关键的概念。它由以下输入计算而来：

```text
project + environment + source_type + source_name + instance_id
```

用途：

- Timeline 中作为 lane 标识
- Topology 中作为 node 标识
- 记录同一来源实例级别的聚合

## timeline lane

Timeline 中的每个 lane 对应一个 `source_fingerprint`。也就是说，lane 代表的是“来源实例级别视图”，而不是抽象服务名视图。

## topology edge

Topology 的边来自“同一条 Trace 内，相邻且来源不同的片段”。这意味着：

- 它反映的是日志时序上的流转
- 它不是 span DAG
- 连续相同来源会先折叠，减少错误自环

## 来源树

`GET /v1/sources` 返回的是：

```text
source_type -> source_name -> instance_id
```

这更适合回答“现在有哪些来源实例在发日志”，而不是“某一条 Trace 是怎么走的”。

## 事实来源

- `proto/vlt/common/v1/common.proto`
- `proto/vlt/logs/v1/logs.proto`
- `internal/ingest/normalize.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

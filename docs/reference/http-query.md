# 查询接口

当前实现的查询接口全部返回 JSON。

## `GET /healthz`

### 用途

确认服务存活。

### 响应

```json
{
  "status": "ok"
}
```

## `GET /v1/logs/search`

### 支持参数

- `project`
- `environment`
- `source_type`
- `source_name`
- `severity_number`
- `trace_id`
- `keyword`
- `start`
- `end`

其中：

- `severity_number` 需要是整数
- `start` / `end` 需要是 RFC3339 时间
- `source_type` 会在服务端转成大写后再匹配
- `keyword` 只匹配 `body_text + body_json`

### 响应形状

```json
{
  "count": 1,
  "logs": []
}
```

## `GET /v1/traces/{trace_id}`

### 查询参数

- `project`
- `environment`

### 响应形状

```json
{
  "trace_id": "0123456789abcdef0123456789abcdef",
  "count": 8,
  "spans": [
    {
      "span_id": "0123456789abcdef",
      "count": 1
    }
  ],
  "logs": []
}
```

说明：

- `logs` 按时间升序返回
- `spans` 是按 `span_id` 聚合的计数摘要

## `GET /v1/traces/{trace_id}/timeline`

### 查询参数

- `project`
- `environment`

### 响应要点

- `summary.log_count`
- `summary.error_count`
- `summary.trace_range.start_time`
- `summary.trace_range.end_time`
- `lanes[]`
- `lanes[].events[]`

每个 lane 对应一个 `source_fingerprint`。

## `GET /v1/traces/{trace_id}/topology`

### 查询参数

- `project`
- `environment`

### 响应要点

- `summary.node_count`
- `summary.edge_count`
- `summary.error_count`
- `nodes[]`
- `edges[]`

当前实现中：

- `nodes[].node_id` 固定等于 `source_fingerprint`
- `edges[]` 来自相邻来源段推导

## `GET /v1/sources`

### 查询参数

- `project`
- `environment`

### 响应形状

```json
{
  "count": 3,
  "sources": [
    {
      "source_type": "SERVICE",
      "sources": []
    }
  ]
}
```

当前返回结构本质上是：

```text
source_type -> source_name -> instance_id
```

如果某条记录没有 `instance_id`，来源树里会显示为 `-`。

## 事实来源

- `internal/api/http.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

# 常见工作流

这一页把当前参考实现最常见的使用路径拆成 5 个连续步骤。

## 1. 灌入示例日志

先用 sender 或示例文件把一批日志送进服务：

```bash
go run ./cmd/vlt-sender -token dev-token -project demo -environment dev -format json
```

如果你想演示不同拓扑形态，优先使用这 4 个示例文件：

- `examples/upload.json`
- `examples/upload-fanout.json`
- `examples/upload-retry-loop.json`
- `examples/upload-bus-handoff.json`

## 2. 搜索日志

日志搜索入口是：

```text
GET /v1/logs/search
```

你可以组合以下筛选参数：

- `project`
- `environment`
- `source_type`
- `source_name`
- `severity_number`
- `trace_id`
- `keyword`
- `start`
- `end`

典型用法：

```bash
curl "http://localhost:8080/v1/logs/search?project=demo&trace_id=0123456789abcdef0123456789abcdef"
```

## 3. 打开一条 Trace

一旦你从日志列表拿到 `trace_id`，就可以继续读取：

- `GET /v1/traces/{trace_id}`
- `GET /v1/traces/{trace_id}/timeline`
- `GET /v1/traces/{trace_id}/topology`

前端的 Logs Explorer 也是通过日志行上的 `trace_id` 进入 Trace Workbench。

## 4. 查看 Timeline / Topology

### Timeline

- 每条 lane 对应一个 `source_fingerprint`
- 每个 lane 会带上事件列表、错误数、首次/最后出现时间
- lane 顺序按 `first_seen` 排序

### Topology

- 节点按 `source_fingerprint` 聚合
- 边由 Trace 内相邻来源段推导
- 连续相同来源会先折叠，再生成边
- 错误数判定基于 `severity_number >= 17`

## 5. 浏览 Sources

来源视图适合回答“当前项目/环境里有哪些来源实例”：

```text
GET /v1/sources
```

返回结构是：

```text
source_type -> source_name -> instance_id
```

如果某条记录没有 `instance_id`，当前实现会在来源树里显示为 `-`。

## 一条完整的推荐路径

1. 启动后端
2. 发送一个示例 JSON
3. 通过 `GET /v1/logs/search` 确认写入成功
4. 选中 `trace_id`
5. 打开 Timeline / Topology
6. 用 Sources 视图检查来源分布

## 事实来源

- `internal/api/http.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`
- `web/src/App.jsx`

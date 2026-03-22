# Virtual Log Trace 是什么

Virtual Log Trace，简称 VLT，是一个协议优先的可视化日志追踪参考实现。它不是“日志平台概念图”，而是一个已经把协议、上传入口、查询接口、示例发送器和前端工作台都串起来的可运行代码库。

## 它在解决什么问题

很多系统的日志能产出 `trace_id`，但缺少统一上传协议、缺少来源建模、也缺少把“同一条 Trace 的多来源日志”用直观视图串起来的最小闭环。VLT 解决的是这个闭环问题：

- 上传侧：定义统一的批次协议与校验规则
- 存储侧：把每条日志归一化到统一模型
- 查询侧：按日志、Trace、Timeline、Topology、Sources 多种视角取数
- 展示侧：用一个 Trace Workbench 联动这些视角

## 当前仓库里已经有什么

- `proto/vlt/common/v1/common.proto`
- `proto/vlt/logs/v1/logs.proto`
- `proto/vlt/ingest/v1/ingest.proto`
- `POST /v1/logs` 摄取入口
- `GET /v1/logs/search`、`GET /v1/traces/{trace_id}`、`GET /v1/traces/{trace_id}/timeline`、`GET /v1/traces/{trace_id}/topology`、`GET /v1/sources`
- Go 服务端 `cmd/vlt-server`
- Go sender `cmd/vlt-sender`
- React Trace Workbench `web/`

## 它适合拿来做什么

- 验证你自己的日志上传协议设计
- 给 demo / 原型项目补一套真实可跑的 Trace 浏览能力
- 在继续做持久化、权限、索引之前，先把字段和交互闭环跑顺
- 作为团队讨论“来源建模”和“拓扑推导”时的具体参考对象

## 它不是什么

- 不是一套完整的生产级 observability 平台
- 不是持久化日志存储系统，当前只提供内存存储
- 不是 OpenTelemetry 全量替代品，当前协议是 VLT 自己的 `v1`
- 不是自动发现系统依赖图的引擎，当前 topology 由 Trace 内时间相邻来源段推导

## 事实来源

- `README.md`
- `proto/vlt/*/v1/*.proto`
- `cmd/vlt-server/main.go`
- `web/src/App.jsx`

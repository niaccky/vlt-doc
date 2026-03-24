---
layout: home
title: Virtual Log Trace

hero:
  name: Virtual Log Trace
  text: 面向多来源系统的可视化日志追踪参考实现
  tagline: 用一套 protobuf 协议、单一上传入口和可视化 Trace Workbench，把服务、任务、函数、消息队列等来源的日志串成可搜索、可浏览、可推断拓扑的链路。
  actions:
    - theme: brand
      text: 5 分钟上手
      link: /guide/quickstart
    - theme: alt
      text: 查看协议参考
      link: /reference/overview
    - theme: alt
      text: 浏览示例场景
      link: /examples/linear-trace

features:
  - title: 协议优先摄取
    details: 通过 `POST /v1/logs` 摄取日志批次，支持 `application/protobuf`、`application/protobuf+json` 与 `application/json`，并接受 `gzip` 压缩。
  - title: 查询与聚合
    details: 既能做日志搜索，也能按 `trace_id` 返回 Trace 详情、时间线泳道、拓扑图和来源清单。
  - title: 参考实现完整可跑
    details: 仓库同时提供 Go 服务端、Go sender、React 可视化前端和多组示例请求，方便本地直接演示。
---

<script setup lang="ts">
import { withBase } from "vitepress";
</script>

<div class="vlt-architecture">
  <p class="vlt-architecture__lead">
    文档聚焦三件事：它是什么、它能做什么、它当前到底实现到了哪一步。
  </p>
  <div class="vlt-architecture__row">
    <div class="vlt-architecture__node">
      <strong>发送端</strong>
      <span>Go sender 或你自己的客户端，按 `ingest.v1.UploadLogsRequest` 组织批次。</span>
    </div>
    <div class="vlt-architecture__node">
      <strong>摄取与校验</strong>
      <span>服务端完成 token 授权、批次校验、记录级拒绝判定、幂等缓存与 body/source 归一化。</span>
    </div>
    <div class="vlt-architecture__node">
      <strong>查询聚合</strong>
      <span>内存存储支持日志搜索、Trace 明细、Timeline lanes、Topology edges 与 Sources 树形聚合。</span>
    </div>
    <div class="vlt-architecture__node">
      <strong>Trace Workbench</strong>
      <span>前端把同一条 Trace 以日志、时间线、拓扑、检查面板四种视角联动展现。</span>
    </div>
  </div>
  <div class="vlt-architecture__flow">Sender → Ingest API → Normalized Records → Query API → Workbench</div>
</div>

## 你可以用它做什么

- 为自定义日志采集链路定义一套稳定的上传协议，而不是把日志结构散落在多个系统里。
- 用统一的 `trace_id`、`source_name`、`instance_id` 把多来源日志整理成可搜索、可回放、可观察的 Trace。
- 演示从“上传一批日志”到“在 UI 中浏览 topology/timeline”的完整闭环。
- 作为你自己 observability 平台的轻量原型，先验证字段设计、交互视图和协议行为，再决定是否继续演进。

## 适合谁看

- 想快速理解 `virtual-log-trace` 代码库的人
- 需要接入上传协议的调用方
- 想确认查询接口与聚合语义的前端/平台工程师
- 想基于当前参考实现继续演化产品的人

<div class="vlt-quick-links">
  <a :href="withBase('/intro/what-is-vlt')">
    <strong>它是什么</strong>
    <span>先看定位、问题边界和包含内容。</span>
  </a>
  <a :href="withBase('/guide/quickstart')">
    <strong>Guide</strong>
    <span>5 分钟跑起后端、sender、前端和一键预览脚本。</span>
  </a>
  <a :href="withBase('/reference/overview')">
    <strong>Protocol Reference</strong>
    <span>按 proto、HTTP 和归一化行为阅读完整协议。</span>
  </a>
</div>

<div class="vlt-preview">
  <div class="vlt-preview__body">
    <h2>界面预览</h2>
    <p>
      下面三张图来自真实运行中的 React 工作台，分别对应 Logs Explorer、Trace flow workbench 和 Source intelligence 视图。
    </p>
    <div class="vlt-preview-grid">
      <PreviewImageCard
        :src="withBase('/logs-explorer-preview.png')"
        alt="Logs Explorer page preview"
        title="Logs Explorer"
        description="筛选面板、统计卡片和可直接进入 Trace 的日志列表。点击图片可在当前页面预览，右上角按钮可关闭。"
        close-label="关闭预览"
        preview-hint="查看 Logs Explorer 大图"
      />
      <PreviewImageCard
        :src="withBase('/trace-flow-workbench-preview.png')"
        alt="Trace flow workbench preview"
        title="Trace flow workbench"
        description="同一条 Trace 的摘要、拓扑、时间线泳道与检查面板联动展示。点击图片可在当前页面预览，右上角按钮可关闭。"
        close-label="关闭预览"
        preview-hint="查看 Trace flow workbench 大图"
      />
      <PreviewImageCard
        :src="withBase('/source-intelligence-preview.png')"
        alt="Source intelligence preview"
        title="Source intelligence"
        description="按来源类型、逻辑来源和实例维度查看当前系统的来源分布。点击图片可在当前页面预览，右上角按钮可关闭。"
        close-label="关闭预览"
        preview-hint="查看 Source intelligence 大图"
      />
    </div>
  </div>
</div>

## 5 分钟起步路径

1. 在 `virtual-log-trace` 仓库根目录启动服务端：`go run ./cmd/vlt-server`
2. 用 sender 灌入示例日志：`go run ./cmd/vlt-sender -token dev-token -project demo -environment dev -format json`
3. 进入 `web` 启动前端：`npm install && npm run dev`
4. 或直接运行 `./scripts/dev-preview.sh` / `make preview`

## 事实来源

- `README.md`
- `cmd/vlt-server/main.go`
- `cmd/vlt-sender/main.go`
- `internal/api/http.go`
- `internal/ingest/*.go`
- `internal/store/*.go`

# vlt-doc

`vlt-doc` 是 [Virtual Log Trace](../virtual-log-trace) 的独立文档站仓库，使用 VitePress 构建，提供中英文双语文档。

文档内容主要覆盖：

- Virtual Log Trace 是什么
- 能做什么
- 快速开始与常见工作流
- 协议与 HTTP 接口说明
- 归一化、聚合和实现边界
- 示例 Trace 场景

## 相关仓库

- 文档站仓库：`/Users/kityeung/Documents/workspace/vlt-doc`
- 源项目仓库：`/Users/kityeung/Documents/workspace/virtual-log-trace`

当前文档内容严格依据 `virtual-log-trace` 现有实现编写，不补充未实现能力。

## 技术栈

- VitePress
- 本地搜索
- 自定义主题样式
- 中英文双语路由

## 安装依赖

```bash
npm install
```

## 本地开发

启动文档站：

```bash
npm run docs:dev
```

默认会启动 VitePress 开发服务器。

## 构建静态站点

```bash
npm run docs:build
```

构建产物会输出到：

```text
docs/.vitepress/dist
```

## 本地预览构建结果

```bash
npm run docs:preview
```

## 目录结构

```text
docs/
  .vitepress/         VitePress 配置与主题
  public/             静态资源
  intro/              中文介绍页
  guide/              中文 Guide
  reference/          中文协议参考
  examples/           中文示例页
  en/                 英文镜像内容
package.json
```

## 语言与路由

- 中文默认在根路径 `/`
- 英文在 `/en/`
- 中英文页面结构保持镜像一致

## 常用维护说明

### 更新文档内容

直接修改 `docs/` 下的 Markdown 文件即可。

### 更新站点配置

主要配置文件：

```text
docs/.vitepress/config.ts
```

### 更新首页预览图

当前首页使用的界面预览图位于：

```text
docs/public/logs-explorer-preview.png
docs/public/trace-flow-workbench-preview.png
docs/public/source-intelligence-preview.png
```

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run docs:dev` | 启动本地开发服务 |
| `npm run docs:build` | 构建静态站点 |
| `npm run docs:preview` | 预览构建结果 |

## 备注

- `node_modules/`、VitePress 缓存和构建产物已通过 `.gitignore` 忽略
- 建议在更新文档后执行一次 `npm run docs:build`，确保站点可正常构建

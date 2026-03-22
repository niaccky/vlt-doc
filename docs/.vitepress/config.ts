import { defineConfig } from "vitepress";

const zhNav = [
  { text: "首页", link: "/" },
  { text: "Guide", link: "/guide/quickstart" },
  { text: "Protocol Reference", link: "/reference/overview" },
  { text: "Examples", link: "/examples/linear-trace" },
];

const enNav = [
  { text: "Home", link: "/en/" },
  { text: "Guide", link: "/en/guide/quickstart" },
  { text: "Protocol Reference", link: "/en/reference/overview" },
  { text: "Examples", link: "/en/examples/linear-trace" },
];

const zhSidebar = [
  {
    text: "介绍",
    items: [
      { text: "Virtual Log Trace 是什么", link: "/intro/what-is-vlt" },
      { text: "能做什么", link: "/intro/capabilities" },
      { text: "架构与数据流", link: "/intro/architecture" },
      { text: "当前实现边界", link: "/intro/limits" },
    ],
  },
  {
    text: "Guide",
    items: [
      { text: "快速开始", link: "/guide/quickstart" },
      { text: "常见工作流", link: "/guide/workflows" },
      { text: "配置与环境变量", link: "/guide/configuration" },
      { text: "数据与视图概念", link: "/guide/concepts" },
    ],
  },
  {
    text: "Protocol Reference",
    items: [
      { text: "协议总览", link: "/reference/overview" },
      { text: "common.v1", link: "/reference/common-v1" },
      { text: "logs.v1", link: "/reference/logs-v1" },
      { text: "ingest.v1", link: "/reference/ingest-v1" },
      { text: "POST /v1/logs", link: "/reference/http-ingest" },
      { text: "查询接口", link: "/reference/http-query" },
      { text: "归一化模型与推导规则", link: "/reference/normalization" },
      { text: "错误与限制", link: "/reference/errors-and-limits" },
    ],
  },
  {
    text: "Examples",
    items: [
      { text: "线性链路示例", link: "/examples/linear-trace" },
      { text: "扇出汇合示例", link: "/examples/fanout-trace" },
      { text: "重试回环示例", link: "/examples/retry-loop" },
      { text: "消息总线 handoff 示例", link: "/examples/bus-handoff" },
    ],
  },
];

const enSidebar = [
  {
    text: "Introduction",
    items: [
      { text: "What Is Virtual Log Trace", link: "/en/intro/what-is-vlt" },
      { text: "Capabilities", link: "/en/intro/capabilities" },
      { text: "Architecture and Data Flow", link: "/en/intro/architecture" },
      { text: "Current Limits", link: "/en/intro/limits" },
    ],
  },
  {
    text: "Guide",
    items: [
      { text: "Quickstart", link: "/en/guide/quickstart" },
      { text: "Common Workflows", link: "/en/guide/workflows" },
      { text: "Configuration", link: "/en/guide/configuration" },
      { text: "Concepts", link: "/en/guide/concepts" },
    ],
  },
  {
    text: "Protocol Reference",
    items: [
      { text: "Overview", link: "/en/reference/overview" },
      { text: "common.v1", link: "/en/reference/common-v1" },
      { text: "logs.v1", link: "/en/reference/logs-v1" },
      { text: "ingest.v1", link: "/en/reference/ingest-v1" },
      { text: "POST /v1/logs", link: "/en/reference/http-ingest" },
      { text: "Query APIs", link: "/en/reference/http-query" },
      { text: "Normalization and Derivation", link: "/en/reference/normalization" },
      { text: "Errors and Limits", link: "/en/reference/errors-and-limits" },
    ],
  },
  {
    text: "Examples",
    items: [
      { text: "Linear Trace", link: "/en/examples/linear-trace" },
      { text: "Fan-out and Join", link: "/en/examples/fanout-trace" },
      { text: "Retry Loop", link: "/en/examples/retry-loop" },
      { text: "Bus Handoff", link: "/en/examples/bus-handoff" },
    ],
  },
];

export default defineConfig({
  title: "Virtual Log Trace",
  description: "Protocol-first visual log tracing reference implementation.",
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#0f1519" }],
  ],
  themeConfig: {
    logo: "/favicon.svg",
    search: {
      provider: "local",
    },
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      description: "协议优先的可视化日志追踪参考实现。",
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        lastUpdatedText: "最后更新于",
        outlineTitle: "页面导航",
        returnToTopLabel: "返回顶部",
        sidebarMenuLabel: "菜单",
        darkModeSwitchLabel: "主题",
        lightModeSwitchTitle: "切换到浅色模式",
        darkModeSwitchTitle: "切换到深色模式",
        langMenuLabel: "切换语言",
        docFooter: {
          prev: "上一页",
          next: "下一页",
        },
        footer: {
          message: "文档内容严格依据当前 virtual-log-trace 实现编写。",
          copyright: "Virtual Log Trace Documentation",
        },
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      link: "/en/",
      description: "Protocol-first visual log tracing reference implementation.",
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        lastUpdatedText: "Last updated",
        outlineTitle: "On this page",
        returnToTopLabel: "Back to top",
        sidebarMenuLabel: "Menu",
        darkModeSwitchLabel: "Theme",
        lightModeSwitchTitle: "Switch to light mode",
        darkModeSwitchTitle: "Switch to dark mode",
        langMenuLabel: "Change language",
        docFooter: {
          prev: "Previous page",
          next: "Next page",
        },
        footer: {
          message: "Every page is written against the current virtual-log-trace implementation.",
          copyright: "Virtual Log Trace Documentation",
        },
      },
    },
  },
});

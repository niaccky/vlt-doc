# 配置与环境变量

当前服务端配置全部来自环境变量，读取逻辑位于 `internal/config/config.go`。

## 环境变量一览

| 变量名 | 默认值 | 作用 |
| --- | --- | --- |
| `PORT` | `8080` | HTTP 服务监听端口 |
| `VLT_ALLOWED_ORIGIN` | `*` | CORS 的 `Access-Control-Allow-Origin` |
| `VLT_INGEST_TOKENS` | `dev-token=demo|sandbox` | token 到 project 范围的映射 |
| `VLT_MAX_BODY_BYTES` | `1048576` | 请求体解压后的大小上限 |
| `VLT_MAX_RECORDS` | `1000` | 单请求允许的最大日志条数 |

## `VLT_INGEST_TOKENS` 格式

格式为：

```text
token=project1|project2,admin=*
```

示例：

```bash
export VLT_INGEST_TOKENS='dev-token=demo|sandbox,admin=*'
```

含义：

- `dev-token` 只能写入 `demo` 和 `sandbox`
- `admin` 可以写入任意 project

如果该变量为空，当前实现会自动提供默认 scope：

```text
dev-token => demo, sandbox
```

## 常见配置组合

### 本地开发

```bash
export PORT=8080
export VLT_ALLOWED_ORIGIN='*'
export VLT_INGEST_TOKENS='dev-token=demo|sandbox'
```

### 前后端分离本地调试

```bash
export VLT_ALLOWED_ORIGIN='http://localhost:5173'
```

### 调整请求限制

```bash
export VLT_MAX_BODY_BYTES=2097152
export VLT_MAX_RECORDS=2000
```

## 注意点

- `VLT_MAX_BODY_BYTES` 的限制作用在“解压之后”的请求体大小
- token scope 只控制 project 写入权限，不区分读权限
- CORS 允许的请求头固定为 `Authorization, Content-Type, Content-Encoding`

## 事实来源

- `internal/config/config.go`
- `internal/api/http.go`

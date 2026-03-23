# 快速开始

这份快速开始以当前仓库 `/path/to/virtual-log-trace` 为准，目标是在最短路径内跑通后端、发送示例日志，并打开前端工作台。

## 前置条件

### 运行当前仓库所需

- Go
- Node.js 与 `npm`

### 仅在你需要重新生成 proto 代码时才需要

- `protoc`
- `protoc-gen-go`

当前仓库已经包含 `gen/go/**` 生成代码，所以只想运行演示时，不必先执行 `make proto`。

## 1. 启动后端

在 `virtual-log-trace` 根目录执行：

```bash
cd /path/to/virtual-log-trace
export VLT_INGEST_TOKENS='dev-token=demo|sandbox'
go run ./cmd/vlt-server
```

默认监听 `:8080`。

可以用健康检查确认服务可用：

```bash
curl http://localhost:8080/healthz
```

## 2. 发送示例日志

### 发送 JSON 载荷

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -format json
```

### 发送 Protobuf 载荷

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -format protobuf
```

### 发送特定示例文件

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -file examples/upload-fanout.json \
  -format json
```

如果请求被接受，sender 会打印 HTTP 状态和响应体。

## 3. 验证是否已写入

```bash
curl "http://localhost:8080/v1/logs/search?project=demo&environment=dev"
```

你应该能看到 `count` 和 `logs` 字段。

## 4. 启动前端

```bash
cd /path/to/virtual-log-trace/web
npm install
npm run dev
```

前端默认请求 `http://localhost:8080`。

## 5. 一键预览

如果你想一次完成：

- 启动后端
- 等待健康检查
- 灌入所有示例文件
- 启动前端

可以直接执行：

```bash
cd /path/to/virtual-log-trace
./scripts/dev-preview.sh
```

或：

```bash
make preview
```

## 6. 如果你修改了 proto

只有在你改动 `proto/**` 后，才需要重新生成代码：

```bash
cd /path/to/virtual-log-trace
go mod tidy
brew install protobuf
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
make proto
```

## 事实来源

- `README.md`
- `cmd/vlt-server/main.go`
- `cmd/vlt-sender/main.go`
- `scripts/dev-preview.sh`
- `Makefile`

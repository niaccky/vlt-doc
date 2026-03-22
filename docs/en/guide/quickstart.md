# Quickstart

This quickstart targets the current repository at `/Users/kityeung/Documents/workspace/virtual-log-trace` and focuses on the shortest path to run the backend, ingest sample logs, and open the frontend workbench.

## Prerequisites

### Required to run the current repository

- Go
- Node.js and `npm`

### Required only when regenerating proto code

- `protoc`
- `protoc-gen-go`

The repository already includes generated files under `gen/go/**`, so you do not need `make proto` just to run the demo.

## 1. Start the backend

From the `virtual-log-trace` repository root:

```bash
cd /Users/kityeung/Documents/workspace/virtual-log-trace
export VLT_INGEST_TOKENS='dev-token=demo|sandbox'
go run ./cmd/vlt-server
```

The default listen address is `:8080`.

You can confirm the server is alive with:

```bash
curl http://localhost:8080/healthz
```

## 2. Send sample logs

### Send a JSON payload

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -format json
```

### Send a Protobuf payload

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -format protobuf
```

### Send a specific sample file

```bash
go run ./cmd/vlt-sender \
  -token dev-token \
  -project demo \
  -environment dev \
  -file examples/upload-fanout.json \
  -format json
```

The sender prints the HTTP status and response body.

## 3. Verify that data was written

```bash
curl "http://localhost:8080/v1/logs/search?project=demo&environment=dev"
```

You should see `count` and `logs`.

## 4. Start the frontend

```bash
cd /Users/kityeung/Documents/workspace/virtual-log-trace/web
npm install
npm run dev
```

The frontend defaults to `http://localhost:8080`.

## 5. Use the one-command preview

To run the backend, wait for health checks, ingest all samples, and start the frontend in one flow:

```bash
cd /Users/kityeung/Documents/workspace/virtual-log-trace
./scripts/dev-preview.sh
```

Or:

```bash
make preview
```

## 6. If you changed proto files

Only regenerate code after editing `proto/**`:

```bash
cd /Users/kityeung/Documents/workspace/virtual-log-trace
go mod tidy
brew install protobuf
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
make proto
```

## Sources of truth

- `README.md`
- `cmd/vlt-server/main.go`
- `cmd/vlt-sender/main.go`
- `scripts/dev-preview.sh`
- `Makefile`

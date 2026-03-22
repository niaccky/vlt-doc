# Common Workflows

This page breaks the current reference implementation into five practical steps.

## 1. Ingest sample logs

Use the sender or a sample file to push one batch into the server:

```bash
go run ./cmd/vlt-sender -token dev-token -project demo -environment dev -format json
```

To demo different topology shapes, start with these files:

- `examples/upload.json`
- `examples/upload-fanout.json`
- `examples/upload-retry-loop.json`
- `examples/upload-bus-handoff.json`

## 2. Search logs

The log search endpoint is:

```text
GET /v1/logs/search
```

Supported filters:

- `project`
- `environment`
- `source_type`
- `source_name`
- `severity_number`
- `trace_id`
- `keyword`
- `start`
- `end`

Typical usage:

```bash
curl "http://localhost:8080/v1/logs/search?project=demo&trace_id=0123456789abcdef0123456789abcdef"
```

## 3. Open a trace

Once you have a `trace_id`, continue with:

- `GET /v1/traces/{trace_id}`
- `GET /v1/traces/{trace_id}/timeline`
- `GET /v1/traces/{trace_id}/topology`

The frontend Logs Explorer follows the same path when a row has a trace.

## 4. Inspect timeline and topology

### Timeline

- Every lane maps to one `source_fingerprint`
- Each lane contains events, error count, and first/last seen timestamps
- Lanes are ordered by `first_seen`

### Topology

- Nodes are grouped by `source_fingerprint`
- Edges are derived from adjacent source segments inside the trace
- Consecutive identical sources are collapsed before edges are emitted
- Error counting is based on `severity_number >= 17`

## 5. Browse sources

The sources view answers “which source instances are currently writing logs?”:

```text
GET /v1/sources
```

Its structure is:

```text
source_type -> source_name -> instance_id
```

If a record has no `instance_id`, the current implementation exposes it as `-`.

## One recommended end-to-end path

1. Start the backend
2. Send one sample batch
3. Confirm it via `GET /v1/logs/search`
4. Pick a `trace_id`
5. Open timeline and topology
6. Use the sources view to inspect instance coverage

## Sources of truth

- `internal/api/http.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`
- `web/src/App.jsx`

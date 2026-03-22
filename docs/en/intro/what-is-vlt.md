# What Is Virtual Log Trace

Virtual Log Trace, or VLT, is a protocol-first visual log tracing reference implementation. It is not just an architecture sketch. The repository already wires together the protocol, ingestion endpoint, query APIs, sample sender, and frontend workbench into a runnable stack.

## The problem it addresses

Many systems can emit logs with a `trace_id`, but they still lack a shared upload contract, explicit source modeling, and a simple way to explore multi-source logs as one trace. VLT closes that loop:

- Upload: one batch protocol and validation model
- Storage: a normalized record shape for every accepted log
- Query: logs, trace detail, timeline, topology, and source inventory
- UI: one Trace Workbench that links those views together

## What is already in the repository

- `proto/vlt/common/v1/common.proto`
- `proto/vlt/logs/v1/logs.proto`
- `proto/vlt/ingest/v1/ingest.proto`
- `POST /v1/logs`
- `GET /v1/logs/search`, `GET /v1/traces/{trace_id}`, `GET /v1/traces/{trace_id}/timeline`, `GET /v1/traces/{trace_id}/topology`, `GET /v1/sources`
- Go server in `cmd/vlt-server`
- Go sender in `cmd/vlt-sender`
- React Trace Workbench in `web/`

## Good fits for the project

- Validate a custom log upload protocol
- Add a real trace browsing loop to a demo or prototype
- Align on fields and UI flows before investing in persistence, auth, or indexing
- Use it as a concrete reference for source modeling and topology derivation

## What it is not

- Not a full production-grade observability platform
- Not a durable log store
- Not a replacement for the full OpenTelemetry ecosystem
- Not a dependency discovery engine; current topology is inferred from adjacent source segments inside a trace

## Sources of truth

- `README.md`
- `proto/vlt/*/v1/*.proto`
- `cmd/vlt-server/main.go`
- `web/src/App.jsx`

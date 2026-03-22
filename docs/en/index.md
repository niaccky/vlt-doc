---
layout: home
title: Virtual Log Trace

hero:
  name: Virtual Log Trace
  text: A visual log tracing reference implementation for multi-source systems
  tagline: It combines a protobuf-first protocol, one ingestion endpoint, and a Trace Workbench so logs from services, jobs, functions, and message queues can be searched, grouped, and explored as a trace.
  actions:
    - theme: brand
      text: Start in 5 Minutes
      link: /en/guide/quickstart
    - theme: alt
      text: Read the Protocol Reference
      link: /en/reference/overview
    - theme: alt
      text: Browse Examples
      link: /en/examples/linear-trace

features:
  - title: Protocol-first ingestion
    details: Ingest batches through `POST /v1/logs`, with support for `application/protobuf`, `application/protobuf+json`, `application/json`, and `gzip`.
  - title: Query and aggregation
    details: Search logs, then move to trace detail, timeline lanes, topology edges, and grouped source inventory.
  - title: End-to-end reference stack
    details: The repository already contains the Go server, a Go sender, a React workbench UI, and multiple sample payloads.
---

<div class="vlt-architecture">
  <p class="vlt-architecture__lead">
    This documentation focuses on three things: what the project is, what it can do, and which behaviors are actually implemented today.
  </p>
  <div class="vlt-architecture__row">
    <div class="vlt-architecture__node">
      <strong>Sender</strong>
      <span>Use the bundled Go sender or your own client to emit `ingest.v1.UploadLogsRequest` batches.</span>
    </div>
    <div class="vlt-architecture__node">
      <strong>Ingest and validation</strong>
      <span>The server performs token authorization, batch validation, record rejection, idempotency caching, and source/body normalization.</span>
    </div>
    <div class="vlt-architecture__node">
      <strong>Query layer</strong>
      <span>The in-memory store serves log search, trace detail, timeline lanes, topology edges, and grouped sources.</span>
    </div>
    <div class="vlt-architecture__node">
      <strong>Trace Workbench</strong>
      <span>The frontend links logs, topology, timeline, and inspection into one operator-facing flow.</span>
    </div>
  </div>
  <div class="vlt-architecture__flow">Sender → Ingest API → Normalized Records → Query API → Workbench</div>
</div>

## What you can use it for

- Define a stable upload protocol instead of scattering log shape across multiple systems.
- Use `trace_id`, `source_name`, and `instance_id` to turn multi-source logs into trace-shaped data.
- Demo the full path from “upload a batch” to “inspect timeline and topology in the UI”.
- Prototype the protocol and workbench behavior for a future observability product.

## Who this documentation is for

- Engineers onboarding into the `virtual-log-trace` repository
- Clients integrating with the upload protocol
- Frontend or platform engineers validating query payloads and aggregation semantics
- Anyone using the current implementation as a starting point for further product work

<div class="vlt-quick-links">
  <a href="/en/intro/what-is-vlt">
    <strong>What it is</strong>
    <span>Start with project scope, problem framing, and included components.</span>
  </a>
  <a href="/en/guide/quickstart">
    <strong>Guide</strong>
    <span>Run the backend, sender, frontend, and preview script in a few minutes.</span>
  </a>
  <a href="/en/reference/overview">
    <strong>Protocol Reference</strong>
    <span>Read the exact proto, HTTP, and normalization behaviors.</span>
  </a>
</div>

<div class="vlt-preview">
  <div class="vlt-preview__body">
    <h2>Workbench preview</h2>
    <p>
      These screenshots come from the live React workbench and show the Logs Explorer, Trace flow workbench, and Source intelligence views.
    </p>
    <div class="vlt-preview-grid">
      <PreviewImageCard
        src="/logs-explorer-preview.png"
        alt="Logs Explorer page preview"
        title="Logs Explorer"
        description="Filter controls, summary cards, and a trace-openable log list in one screen. Click the image to preview it in place, then close it from the top-right corner."
        close-label="Close preview"
        preview-hint="Preview Logs Explorer image"
      />
      <PreviewImageCard
        src="/trace-flow-workbench-preview.png"
        alt="Trace flow workbench preview"
        title="Trace flow workbench"
        description="Summary, topology, timeline lanes, and inspection for one trace working together. Click the image to preview it in place, then close it from the top-right corner."
        close-label="Close preview"
        preview-hint="Preview Trace flow workbench image"
      />
      <PreviewImageCard
        src="/source-intelligence-preview.png"
        alt="Source intelligence preview"
        title="Source intelligence"
        description="Grouped visibility into source types, logical sources, and live source instances. Click the image to preview it in place, then close it from the top-right corner."
        close-label="Close preview"
        preview-hint="Preview Source intelligence image"
      />
    </div>
  </div>
</div>

## A 5-minute path

1. Start the backend in the `virtual-log-trace` repository root: `go run ./cmd/vlt-server`
2. Ingest sample logs: `go run ./cmd/vlt-sender -token dev-token -project demo -environment dev -format json`
3. Start the frontend from `web`: `npm install && npm run dev`
4. Or use the all-in-one flow: `./scripts/dev-preview.sh` or `make preview`

## Sources of truth

- `README.md`
- `cmd/vlt-server/main.go`
- `cmd/vlt-sender/main.go`
- `internal/api/http.go`
- `internal/ingest/*.go`
- `internal/store/*.go`

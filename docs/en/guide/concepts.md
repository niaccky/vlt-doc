# Concepts

These concepts make the protocol and UI much easier to reason about.

## project

`project` is a batch-level field that identifies the logical project. It is also part of authorization and idempotency.

## environment

`environment` is another batch-level field used for values such as `dev`, `staging`, or `prod`.

## source

VLT models log origin with `SourceRef`. A valid source must resolve to:

- `source_name`
- `source_type`

It can also include:

- `source_id`
- `namespace`
- `instance_id`
- `labels`

## trace and span

- `trace_id` identifies the whole flow
- `span_id` identifies a local step
- `trace_flags` stores trace-level flags

The current implementation validates these fields but does not derive topology from span parent-child relationships.

## source_fingerprint

This is one of the most important concepts in the implementation. It is derived from:

```text
project + environment + source_type + source_name + instance_id
```

It is used as:

- the lane identifier in timeline
- the node identifier in topology
- the aggregation key for source-instance views

## timeline lane

Each timeline lane maps to one `source_fingerprint`. In other words, lanes are instance-level views, not abstract service-level views.

## topology edge

Topology edges come from adjacent source segments inside the same trace. That means:

- they reflect observed time flow through sources
- they are not a span DAG
- consecutive identical sources are collapsed first

## source tree

`GET /v1/sources` returns:

```text
source_type -> source_name -> instance_id
```

It answers “which source instances are present?”, not “how did one trace travel?”.

## Sources of truth

- `proto/vlt/common/v1/common.proto`
- `proto/vlt/logs/v1/logs.proto`
- `internal/ingest/normalize.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

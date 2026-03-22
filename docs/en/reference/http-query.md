# Query APIs

All query endpoints return JSON in the current implementation.

## `GET /healthz`

### Purpose

Confirm that the service is alive.

### Response

```json
{
  "status": "ok"
}
```

## `GET /v1/logs/search`

### Supported parameters

- `project`
- `environment`
- `source_type`
- `source_name`
- `severity_number`
- `trace_id`
- `keyword`
- `start`
- `end`

Notes:

- `severity_number` must parse as an integer
- `start` and `end` must be RFC3339 timestamps
- `source_type` is uppercased before matching
- `keyword` matches `body_text + body_json` only

### Response shape

```json
{
  "count": 1,
  "logs": []
}
```

## `GET /v1/traces/{trace_id}`

### Query parameters

- `project`
- `environment`

### Response shape

```json
{
  "trace_id": "0123456789abcdef0123456789abcdef",
  "count": 8,
  "spans": [
    {
      "span_id": "0123456789abcdef",
      "count": 1
    }
  ],
  "logs": []
}
```

Notes:

- `logs` are sorted by timestamp ascending
- `spans` is a simple count grouped by `span_id`

## `GET /v1/traces/{trace_id}/timeline`

### Query parameters

- `project`
- `environment`

### Response highlights

- `summary.log_count`
- `summary.error_count`
- `summary.trace_range.start_time`
- `summary.trace_range.end_time`
- `lanes[]`
- `lanes[].events[]`

Each lane maps to one `source_fingerprint`.

## `GET /v1/traces/{trace_id}/topology`

### Query parameters

- `project`
- `environment`

### Response highlights

- `summary.node_count`
- `summary.edge_count`
- `summary.error_count`
- `nodes[]`
- `edges[]`

In the current implementation:

- `nodes[].node_id` is always the `source_fingerprint`
- `edges[]` are derived from adjacent source segments

## `GET /v1/sources`

### Query parameters

- `project`
- `environment`

### Response shape

```json
{
  "count": 3,
  "sources": [
    {
      "source_type": "SERVICE",
      "sources": []
    }
  ]
}
```

The structure is effectively:

```text
source_type -> source_name -> instance_id
```

If a record has no `instance_id`, the tree exposes it as `-`.

## Sources of truth

- `internal/api/http.go`
- `internal/store/store.go`
- `internal/store/memory/memory.go`

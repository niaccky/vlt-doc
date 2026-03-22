# Configuration

The current server reads all runtime configuration from environment variables in `internal/config/config.go`.

## Environment variables

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | `8080` | HTTP listen port |
| `VLT_ALLOWED_ORIGIN` | `*` | CORS `Access-Control-Allow-Origin` |
| `VLT_INGEST_TOKENS` | `dev-token=demo|sandbox` | Token-to-project scope mapping |
| `VLT_MAX_BODY_BYTES` | `1048576` | Maximum decompressed request body size |
| `VLT_MAX_RECORDS` | `1000` | Maximum records per request |

## `VLT_INGEST_TOKENS` format

Format:

```text
token=project1|project2,admin=*
```

Example:

```bash
export VLT_INGEST_TOKENS='dev-token=demo|sandbox,admin=*'
```

Meaning:

- `dev-token` can write only to `demo` and `sandbox`
- `admin` can write to any project

If the variable is empty, the server installs a default scope:

```text
dev-token => demo, sandbox
```

## Common setups

### Local development

```bash
export PORT=8080
export VLT_ALLOWED_ORIGIN='*'
export VLT_INGEST_TOKENS='dev-token=demo|sandbox'
```

### Local frontend/backend split

```bash
export VLT_ALLOWED_ORIGIN='http://localhost:5173'
```

### Looser request limits

```bash
export VLT_MAX_BODY_BYTES=2097152
export VLT_MAX_RECORDS=2000
```

## Notes

- `VLT_MAX_BODY_BYTES` applies after decompression
- Token scope controls write access by project only
- Allowed CORS headers are fixed to `Authorization, Content-Type, Content-Encoding`

## Sources of truth

- `internal/config/config.go`
- `internal/api/http.go`

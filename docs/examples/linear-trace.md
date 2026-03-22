# 线性链路示例

## 场景说明

这个示例展示一条以 checkout 为入口、随后串联库存、定价、支付、风控、台账和通知的链路。整体上接近线性，但中间会回到 `inventory-service` 一次。

## 示例文件

```text
examples/upload.json
```

## Trace ID

```text
0123456789abcdef0123456789abcdef
```

## 关键来源

- `checkout-service`
- `inventory-service`
- `pricing-engine`
- `payment-worker`
- `fraud-service`
- `ledger-writer`
- `notification-bus`

## 预期 topology 形态

```text
checkout-service
  -> inventory-service
  -> pricing-engine
  -> inventory-service
  -> payment-worker
  -> fraud-service
  -> ledger-writer
  -> notification-bus
```

## 关键字段片段

```json
{
  "requestId": "req-topology-7-nodes",
  "project": "demo",
  "environment": "dev",
  "defaultSource": {
    "sourceName": "checkout-service",
    "sourceType": "SOURCE_TYPE_SERVICE",
    "instanceId": "checkout-1"
  },
  "records": [
    {
      "eventName": "request_received",
      "traceId": "0123456789abcdef0123456789abcdef"
    },
    {
      "eventName": "ledger_write_delayed",
      "severityNumber": 17
    }
  ]
}
```

## 你可以重点观察什么

- 默认来源如何覆盖第一条日志
- `severityNumber: 17` 如何影响 topology / timeline 的错误统计
- `body` 既有字符串也有对象时的归一化效果

## 事实来源

- `examples/upload.json`

# 扇出汇合示例

## 场景说明

这个示例以 `order-orchestrator` 为中心，向库存、定价、促销三个分支扇出，再汇合到支付和通知，适合观察“一个中心节点反复出现”的拓扑形态。

## 示例文件

```text
examples/upload-fanout.json
```

## Trace ID

```text
11111111111111111111111111111111
```

## 关键来源

- `order-api`
- `order-orchestrator`
- `inventory-service`
- `pricing-engine`
- `promo-service`
- `payment-worker`
- `notification-bus`

## 预期 topology 形态

```text
order-api
  -> order-orchestrator
  -> inventory-service
  -> order-orchestrator
  -> pricing-engine
  -> order-orchestrator
  -> promo-service
  -> order-orchestrator
  -> payment-worker
  -> notification-bus
```

## 关键字段片段

```json
{
  "requestId": "req-topology-fanout-hub",
  "defaultSource": {
    "sourceName": "order-api",
    "sourceType": "SOURCE_TYPE_SERVICE"
  },
  "records": [
    {
      "eventName": "workflow_started",
      "source": {
        "sourceName": "order-orchestrator"
      }
    },
    {
      "eventName": "promotion_applied",
      "source": {
        "sourceName": "promo-service"
      }
    }
  ]
}
```

## 你可以重点观察什么

- `order-orchestrator` 如何在 topology 中表现为中心节点
- Timeline lanes 如何反映多分支回流
- 同一来源实例多次出现时，节点数不会线性增加

## 事实来源

- `examples/upload-fanout.json`

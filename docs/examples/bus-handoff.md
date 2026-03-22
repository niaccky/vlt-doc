# 消息总线 handoff 示例

## 场景说明

这个示例以 `order-bus` 为中心，展示异步发布、消费、再次发布的 handoff 过程，最后落到审计服务。

## 示例文件

```text
examples/upload-bus-handoff.json
```

## Trace ID

```text
33333333333333333333333333333333
```

## 关键来源

- `checkout-web`
- `order-bus`
- `inventory-worker`
- `shipping-worker`
- `email-worker`
- `audit-service`

## 预期 topology 形态

```text
checkout-web
  -> order-bus
  -> inventory-worker
  -> order-bus
  -> shipping-worker
  -> order-bus
  -> email-worker
  -> audit-service
```

## 关键字段片段

```json
{
  "requestId": "req-topology-bus-handoff",
  "defaultSource": {
    "sourceName": "checkout-web",
    "sourceType": "SOURCE_TYPE_SERVICE"
  },
  "records": [
    {
      "eventName": "order_event_published",
      "source": {
        "sourceName": "order-bus",
        "sourceType": "SOURCE_TYPE_MQ"
      }
    },
    {
      "eventName": "confirmation_email_scheduled",
      "source": {
        "sourceName": "email-worker"
      }
    }
  ]
}
```

## 你可以重点观察什么

- `SOURCE_TYPE_MQ` 在 topology 中如何作为枢纽节点出现
- 异步 handoff 与同步串行链路在视觉上的差异
- 最后一个 `audit-service` 节点如何收尾整条 Trace

## 事实来源

- `examples/upload-bus-handoff.json`

# 重试回环示例

## 场景说明

这个示例描述退款任务与银行网关之间的重试回环，并在后面切换到备用银行实例。它非常适合验证 topology 是否能正确表现“往返”和“实例切换”。

## 示例文件

```text
examples/upload-retry-loop.json
```

## Trace ID

```text
22222222222222222222222222222222
```

## 关键来源

- `refund-api`
- `refund-worker`
- `bank-gateway`（`bank-1`）
- `bank-gateway`（`bank-2`）
- `notification-bus`

## 预期 topology 形态

```text
refund-api
  -> refund-worker
  -> bank-gateway(bank-1)
  -> refund-worker
  -> bank-gateway(bank-1)
  -> refund-worker
  -> bank-gateway(bank-2)
  -> refund-worker
  -> notification-bus
```

## 关键字段片段

```json
{
  "requestId": "req-topology-retry-loop-v2",
  "records": [
    {
      "eventName": "bank_timeout",
      "severityNumber": 13
    },
    {
      "eventName": "fallback_provider_selected",
      "severityNumber": 17
    },
    {
      "eventName": "refund_settled",
      "source": {
        "sourceName": "bank-gateway",
        "instanceId": "bank-2"
      }
    }
  ]
}
```

## 你可以重点观察什么

- `refund-worker` 与 `bank-gateway` 的往返边
- `instance_id` 改变后为何会产生新的 node
- `severityNumber >= 17` 对错误统计的影响

## 事实来源

- `examples/upload-retry-loop.json`

export enum KafkaTopics {
  ORDER_CREATED = "order.created",
  INVENTORY_RESERVED = "inventory.reserved",
  INVENTORY_FAILED = "inventory.failed",
  PAYMENT_PROCESSED = "payment.processed",
  PAYMENT_FAILED = "payment.failed",
  PAYMENT_FAILED_DLQ = "payment.failed.dlq",
  PAYMENT_FAILED_RETRY = "payment.failed.retry",
  INVENTORY_RELEASE = "inventory.release"
}
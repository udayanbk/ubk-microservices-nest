export interface PaymentProcessedEvent {
  orderId: string;
}

export interface PaymentFailedEvent {
  orderId: string;
  reason?: string;
}

export interface PaymentFailedDlqEvent {
  topic: string,
  payload: any,
  error: string,
  service: string
}
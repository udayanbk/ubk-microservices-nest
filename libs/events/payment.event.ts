export interface PaymentProcessedEvent {
  orderId: string;
}

export interface PaymentFailedEvent {
  orderId: string;
  productId: string;
  quantity: number;
  reason?: string;
}

export interface PaymentFailedDlqEvent {
  topic: string,
  payload: any,
  error: string,
  service: string
}
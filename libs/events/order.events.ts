export interface OrderCreatedEvent {
  orderId: string;
  productId: string;
  quantity: number;
  userId: string;
}
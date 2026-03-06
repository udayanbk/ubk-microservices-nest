export interface InventoryReservedEvent {
  orderId: string;
  productId: string;
  quantity: number;
}

export interface InventoryFailedEvent {
  orderId: string;
  reason: string
}
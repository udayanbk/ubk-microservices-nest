export interface InventoryReservedEvent {
  orderId: string;
  productId: string;
  quantity: number;
}

export interface InventoryFailedEvent {
  orderId: string;
  productId: string;
  reason: string
}
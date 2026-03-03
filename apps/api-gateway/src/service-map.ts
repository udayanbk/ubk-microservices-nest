export const serviceMap: Record<string, string | undefined> = {
  auth: process.env.AUTH_SERVICE_URL,
  users: process.env.USER_SERVICE_URL,
  products: process.env.PRODUCT_SERVICE_URL,
  inventory: process.env.INVENTORY_SERVICE_URL,
  orders: process.env.ORDER_SERVICE_URL,
  payments: process.env.PAYMENT_SERVICE_URL,
};
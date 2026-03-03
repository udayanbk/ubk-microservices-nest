import { AUTH_SERVICE_URL } from "./env";

export const SERVICES = {
  AUTH: AUTH_SERVICE_URL,
  USER: process.env.USER_SERVICE_URL,
  PRODUCT: process.env.PRODUCT_SERVICE_URL,
  INVENTORY: process.env.INVENTORY_SERVICE_URL,
  ORDER: process.env.ORDER_SERVICE_URL,
  PAYMENT: process.env.PAYMENT_SERVICE_URL,
};
import { Body, Controller, Post } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

@Controller("inventory")
export class InventoryController {

  constructor(private readonly inventoryService: InventoryService) {}

  @Post("setStock")
  async setStock(@Body() body: any) {

    console.log("📦 /inventory/setStock hit");
    console.log("Body:", body);

    return this.inventoryService.setStock(
      body.productId,
      body.stock
    );
  }

  @Post("reduce")
  async reduce(@Body() body: any) {

    console.log("🔻 /inventory/reduce hit");
    console.log("Body:", body);

    return this.inventoryService.reduceStock(
      body.productId,
      body.quantity
    );
  }
}
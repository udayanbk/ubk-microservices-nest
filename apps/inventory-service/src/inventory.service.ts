import { PrismaService } from '@ecom/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {

  constructor(private prisma: PrismaService) { }


  getHello(): string {
    return 'Hello World!';
  }

  async setStock(productId: string, stock: number) {

    console.log("📦 Setting stock:", productId, stock);

    return this.prisma.inventory.upsert({
      where: { productId },
      update: { stock },
      create: { productId, stock }
    });
  }

  async reduceStock(productId: string, quantity: number) {

    console.log("🔻 Reducing stock:", productId, quantity);

    const item = await this.prisma.inventory.findUnique({
      where: { productId }
    });

    if (!item || item.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    return this.prisma.inventory.update({
      where: { productId },
      data: { stock: item.stock - quantity }
    });
  }

  async increaseStock(productId: string, quantity: number) {

    console.log("♻ Increasing stock:", productId, quantity);

    const item = await this.prisma.inventory.findUnique({
      where: { productId }
    });

    if (!item) {
      throw new Error("Inventory record not found");
    }

    return this.prisma.inventory.update({
      where: { productId },
      data: { stock: item.stock + quantity }
    });
  }

}

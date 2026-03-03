import { Injectable } from "@nestjs/common";
import { PrismaService } from "@ecom/database";

@Injectable()
export class ProductService {

  constructor(private prisma: PrismaService) {}

  async createProduct(data: any) {

    console.log("📦 Creating product:", data.name);

    const product = await this.prisma.product.create({
      data
    });

    console.log("✅ Product created:", product.id);

    return product;
  }

  async listProducts() {

    console.log("📦 Fetching all products");

    return this.prisma.product.findMany();
  }

}
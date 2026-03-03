import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller("products")
export class ProductController {

  constructor(private service: ProductService) {}

  @Post()
  create(@Body() body: any) {

    console.log("🚀 /products POST hit");

    return this.service.createProduct(body);
  }

  @Get()
  list() {

    console.log("📦 /products GET hit");

    return this.service.listProducts();
  }

}
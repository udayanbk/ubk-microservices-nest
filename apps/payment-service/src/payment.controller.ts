import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller("payments")
export class PaymentController {

  constructor(private service: PaymentService) {}

  @Post("process")
  async process(@Body() body: any) {

    console.log("🚀 /payments/process hit");

    return this.service.processPayment(
      body.orderId,
      body.amount
    );
  }
}
import { PrismaService } from "@ecom/database";
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {

  constructor(
    private prisma: PrismaService
  ){}

  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  async sendOrderCreatedEmail(userId: string, orderId: string) {
    console.log("userId", userId, "orderId", orderId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log("❌ User not found for email");
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Created",
      text: `Your order ${orderId} has been placed successfully`
    };
    console.log("mailOptions", mailOptions)
    const result = await this.transporter.sendMail(mailOptions);

    console.log("📧 Order Created Email sent:", result.messageId);
  }

  async sendOrderFailedEmail(userId: string, orderId: string) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log("❌ User not found for email");
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Failed",
      text: `Your order ${orderId} has been failed.`
    };

    const result = await this.transporter.sendMail(mailOptions);

    console.log("📧 Failed Order Email sent:", result.messageId);
  }

}
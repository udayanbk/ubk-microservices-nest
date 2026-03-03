import { Injectable } from "@nestjs/common";
import { PrismaService } from "@ecom/database";

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string) {

    console.log("📩 Request to create user:", email);

    const user = await this.prisma.user.create({
      data: {
        email,
        password
      }
    });

    console.log("✅ User created with ID:", user.id);

    return user;

  }

  async findUser(email: string) {

    console.log("🔍 Searching user:", email);

    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    console.log("📦 User search result:", user);

    return user;

  }

}
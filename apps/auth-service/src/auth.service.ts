import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { firstValueFrom } from 'rxjs';

type User = {
  id: number;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private http: HttpService
  ) { }

  // private users: User[] = [];

  async register(email: string, password: string) {

    console.log("🔵 Auth service register called");
    console.log("Email:", email);

    const url = `${process.env.USER_SERVICE_URL}/users/create`;

    const hashed = await bcrypt.hash(password, 10);

    const response = await firstValueFrom(
      this.http.post(url, {
        email,
        password: hashed
      })
    );

    console.log("🟢 User created in User Service:", response.data);

    return {
      message: "User registered successfully",
      user: response.data
    };
  }

  async login(email: string, password: string) {

    console.log("🔵 AuthService login called");

    const url = `${process.env.USER_SERVICE_URL}/users/find`;

    const response = await firstValueFrom(
      this.http.post(url, { email })
    );

    const user = response.data;

    if (!user) {
      console.log("❌ User not found");
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log("❌ Invalid password");
      throw new Error("Invalid credentials");
    }

    console.log("🟢 Credentials valid");

    const token = this.jwtService.sign({
      userId: user.id
    });

    console.log("✅ JWT generated");

    return { token };
  }

  // getHello(): string {
  //   return 'Hello World!';
  // }

}


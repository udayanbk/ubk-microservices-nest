import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@ecom/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    console.log("AuthController hit")
  }

  @Post("register")
  register(@Body() body:RegisterDto) {
    return this.authService.register(body.email,body.password);
  }

  @Post("login")
  login(@Body() body:LoginDto) {
    return this.authService.login(body.email,body.password);
  }

  // @Get()
  // getHello(): string {
  //   return this.authService.getHello();
  // }

  // @Get("health")
  // health() {
  //   return "Auth service running";
  // }
}

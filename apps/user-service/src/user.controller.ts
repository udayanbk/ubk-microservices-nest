import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {

  constructor(private userService: UserService) {}

  @Post("create")
  async create(@Body() body: any) {

    console.log("🚀 /users/create endpoint hit");

    return this.userService.createUser(body.email, body.password);

  }

  @Post("find")
  async find(@Body() body: any) {

    console.log("🔍 /users/find endpoint hit");

    return this.userService.findUser(body.email);

  }

}
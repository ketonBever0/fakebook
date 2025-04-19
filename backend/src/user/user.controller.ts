/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('one/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getOneUser(parseInt(id));
  }

  @Get("all")
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}

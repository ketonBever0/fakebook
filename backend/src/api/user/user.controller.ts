/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles("ADMIN", "MODERATOR")
  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('one/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getOneUser(parseInt(id));
  }

  @Put('one/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(parseInt(id), dto);
  }

  @Delete('one/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(parseInt(id));
  }
}

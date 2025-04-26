/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthModel, Roles, User } from '../auth/decorator/auth.decorator';
import { RoleGuard } from '../auth/guard/role.guard';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Get('')
  getInterests() {
    return this.interestService.getInterests();
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Post('')
  addInterest(@Body() body: { name: string }) {
    return this.interestService.addInterest(body.name);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Put(':id')
  updateInterest(@Param('id') id: string, @Body() body: { name: string }) {
    return this.interestService.updateInterest(parseInt(id), body.name);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Delete(':id')
  deleteInterest(@Param('id') id: string) {
    return this.interestService.deleteInterest(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getUserInterests(@User() user: AuthModel) {
    return this.interestService.getUserInterests(user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('user/:id')
  addUserInterest(@User() user: AuthModel, @Param('id') id: string) {
    return this.interestService.addUserInterest(user.sub, parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Delete('user/:id')
  deleteUserInterest(@Param('id') id: string) {
    return this.interestService.deleteUserInterest(parseInt(id));
  }
}

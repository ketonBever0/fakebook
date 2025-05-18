/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthModel, User } from '../auth/decorator/auth.decorator';
import { MessageDto } from './dto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('user/:uid')
  async sendMessage(
    @User() user: AuthModel,
    @Param('uid', ParseIntPipe) uid: number,
    @Body() dto: MessageDto,
  ) {
    if (
      (await this.userService.getOneUser(uid)) &&
      (await this.messageService.sendMessage(user.sub, uid, dto.text))
    ) {
      return;
    }
  }

  @UseGuards(AuthGuard)
  @Get('user/:uid')
  async getMyMessagesFromUser(
    @User() user: AuthModel,
    @Param('uid', ParseIntPipe) otherId: number,
  ) {
    if (await this.userService.getOneUser(otherId)) {
      return this.messageService.getMyMessagesFromUser(user.sub, otherId);
    }
  }
}

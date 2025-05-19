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
import { GroupMessageService } from './group-message.service';
import { GroupService } from '../group/group.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly groupMessageService: GroupMessageService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
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

  @UseGuards(AuthGuard)
  @Post('group/:id')
  sendGroupMessage(
    @User() user: AuthModel,
    @Param(':id', ParseIntPipe) groupId: number,
    @Body() dto: MessageDto,
  ) {
    if (this.groupService.getOneGroup(groupId)) {
      return this.groupMessageService.sendGroupMessage(
        user.sub,
        groupId,
        dto.text,
      );
    }
  }
}

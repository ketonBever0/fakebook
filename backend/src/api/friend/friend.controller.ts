/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthModel, User } from '../auth/decorator/auth.decorator';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(AuthGuard)
  @Post('user/friend/:id')
  requestFriend(@User() user: AuthModel, @Param('id') receiverId: string) {
    return this.friendService.requestFriend(user.sub, parseInt(receiverId));
  }
}

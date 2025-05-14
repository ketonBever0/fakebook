/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthModel, User } from '../auth/decorator/auth.decorator';
import { UserService } from '../user/user.service';

@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('suggest/company')
  async suggestFriendsByCompany(@User() user: AuthModel) {
    const company = (
      (await this.userService.getOneUser(user.sub)) as { company: string }
    ).company;
    return this.friendService.suggestFriendsByCompany(user.sub, company);
  }

  @UseGuards(AuthGuard)
  @Get('user/friend')
  getMyFriends(@User() user: AuthModel) {
    return this.friendService.getMyFriends(user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('user/friend/:id')
  requestFriend(@User() user: AuthModel, @Param('id') receiverId: string) {
    return this.friendService.requestFriend(user.sub, parseInt(receiverId));
  }

  @UseGuards(AuthGuard)
  @Put('user/friend/:id')
  acceptRequest(@User() user: AuthModel, @Param('id') receiverId: string) {
    return this.friendService.acceptRequest(user.sub, parseInt(receiverId));
  }

  @UseGuards(AuthGuard)
  @Delete('user/friend/:id')
  deleteFriend(@User() user: AuthModel, @Param('id') receiverId: string) {
    return this.friendService.deleteFriend(user.sub, parseInt(receiverId));
  }
}

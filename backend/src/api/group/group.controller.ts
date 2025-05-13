/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { MemberService } from './member.service';
import { GroupDto } from './dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthModel, User, UserModel } from '../auth/decorator/auth.decorator';

@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly memberService: MemberService,
  ) {}

  @Get()
  getAllGroups() {
    return this.groupService.getAllGroups();
  }

  @Get('one/:id')
  getOneGroup(@Param('id') id: string) {
    return this.groupService.getOneGroup(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Post('')
  createGroup(@Body() dto: GroupDto, @User() user: AuthModel) {
    return this.groupService.createGroup(
      dto.name,
      dto.private ? 1 : 0,
      user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('one/:id')
  async deleteGroup(@User() user: AuthModel, @Param('id') id: string) {
    if (await this.groupService.isGroupOwner(parseInt(id), user.sub)) {
      return await this.groupService.deleteGroup(parseInt(id));
    } else {
      throw new ForbiddenException('Only its owner can delete the group!');
    }
  }

  @UseGuards(AuthGuard)
  @Post('join/:id')
  joinGroup(@User() user: UserModel, @Param('id') groupId: string) {
    return this.memberService.joinGroup(user.id, parseInt(groupId));
  }
}

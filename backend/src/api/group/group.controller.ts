/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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

  // GROUPS
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
  @Put('one/:id')
  async updateGroup(
      @User() user: AuthModel,
      @Param('id') groupId: string,
      @Body() dto: GroupDto,
  ) {
    const intId = parseInt(groupId);
    const membership = await this.memberService.getMyMembership(
        intId,
        user.sub,
    );
    if (
        this.memberService.isGroupOwner(intId, user.sub) ||
        membership.role == 'ADMIN'
    ) {
      return this.groupService.updateGroup(intId, dto);
    } else {
      throw new ForbiddenException(
          'You have no permission to modify this group!',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('one/:id')
  async deleteGroup(@User() user: AuthModel, @Param('id') id: string) {
    if (await this.memberService.isGroupOwner(parseInt(id), user.sub)) {
      return await this.groupService.deleteGroup(parseInt(id));
    } else {
      throw new ForbiddenException('Only the owner can delete the group!');
    }
  }

  // GROUP_MEMBERS
  @UseGuards(AuthGuard)
  @Get('me/:id')
  async getMyMembership(@User() user: AuthModel, @Param('id') groupId: string) {
    return {
      role: (
          await this.memberService.getMyMembership(parseInt(groupId), user.sub)
      ).role,
    };
  }

  @UseGuards(AuthGuard)
  @Post('me/:id')
  joinGroup(@User() user: AuthModel, @Param('id') groupId: string) {
    return this.memberService.joinGroup(user.sub, parseInt(groupId));
  }

  @UseGuards(AuthGuard)
  @Delete('me/:id')
  async leaveGroup(@User() user: AuthModel, @Param('id') groupId: string) {
    if (
        (await this.memberService.getMyMembership(parseInt(groupId), user.sub))
            .role == 'OWNER'
    ) {
      throw new ForbiddenException(
          'As a group owner, You need to delete the group, or request your demotion from another group owner!',
      );
    }
    if (
        await this.memberService.deleteMembership(parseInt(groupId), user.sub)
    ) {
      return { message: 'Group left.' };
    } else {
      throw new NotFoundException('Group not found!');
    }
  }
}
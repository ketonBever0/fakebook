/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';
import { AuthService } from '../auth/auth.service';
import { GroupService } from '../group/group.service';

@Injectable()
export class GroupMessageService {
  constructor(
    private readonly db: OracleService,
    private readonly groupService: GroupService
  ) {}


  async sendGroupMessage(userId: number, groupId: number, text: string) {
    return true;
  }



}

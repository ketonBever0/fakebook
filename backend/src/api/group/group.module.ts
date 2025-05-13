import { GroupService } from './group.service';
import { GroupController } from './group.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OracleModule } from 'src/oracle/oracle.module';
import { MemberService } from './member.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, OracleModule, JwtModule],
  controllers: [GroupController],
  providers: [GroupService, MemberService],
})
export class GroupModule {}

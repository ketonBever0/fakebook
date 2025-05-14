import { JwtModule } from '@nestjs/jwt';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OracleModule } from 'src/oracle/oracle.module';

@Module({
  imports: [JwtModule, OracleModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}

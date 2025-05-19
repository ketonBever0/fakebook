import { MessageService } from './message.service';
import { MessageController } from './message.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { OracleModule } from 'src/oracle/oracle.module';
import { GroupMessageService } from './group-message.service';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [OracleModule, JwtModule, UserModule, GroupModule],
  controllers: [MessageController],
  providers: [MessageService, GroupMessageService],
})
export class MessageModule {}

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { OracleModule } from 'src/oracle/oracle.module';

@Module({
  imports: [OracleModule, JwtModule, UserModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}

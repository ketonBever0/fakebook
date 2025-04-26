import { UserService } from './user.service';
import { UserController } from './user.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OracleModule } from 'src/oracle/oracle.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [OracleModule, JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

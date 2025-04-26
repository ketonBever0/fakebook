import { OracleModule } from 'src/oracle/oracle.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [OracleModule, JwtModule, ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

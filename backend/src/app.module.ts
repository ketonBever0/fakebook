import { OracleModule } from './oracle/oracle.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [OracleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { ObsceneModule } from './api/obscene/obscene.module';
import { UserModule } from './api/user/user.module';
import { OracleModule } from './oracle/oracle.module';
import { AuthModule } from './api/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
        ObsceneModule, 
    UserModule,
    OracleModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { ObsceneController } from './obscene.controller';
import { OracleModule } from 'src/oracle/oracle.module';
import { ObsceneService } from './obscene.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [OracleModule],
  controllers: [ObsceneController],
  providers: [ObsceneService],
})
export class ObsceneModule {}

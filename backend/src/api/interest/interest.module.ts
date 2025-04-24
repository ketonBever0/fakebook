import { InterestController } from './interest.controller';
import { OracleModule } from 'src/oracle/oracle.module';
import { InterestService } from './interest.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [OracleModule],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}

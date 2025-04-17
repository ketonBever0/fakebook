import { OracleService } from './oracle.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [OracleService],
  exports: [OracleService],
})
export class OracleModule {}

import { CommentController } from './comment.controller';
import { OracleModule } from 'src/oracle/oracle.module';
import { CommentService } from './comment.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [OracleModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

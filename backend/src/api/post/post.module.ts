import { PostService } from './post.service';
import { PostController } from './post.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OracleModule } from 'src/oracle/oracle.module';

@Module({
  imports: [OracleModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

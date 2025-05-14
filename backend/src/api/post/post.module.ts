import { PostService } from './post.service';
import { PostController } from './post.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OracleModule } from 'src/oracle/oracle.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [OracleModule, JwtModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

import { MessageModule } from './api/message/message.module';
import { FriendModule } from './api/friend/friend.module';
import { GroupModule } from './api/group/group.module';
import { CommentModule } from './api/comment/comment.module';
import { PostModule } from './api/post/post.module';
import { ObsceneModule } from './api/obscene/obscene.module';
import { UserModule } from './api/user/user.module';
import { OracleModule } from './oracle/oracle.module';
import { AuthModule } from './api/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InterestModule } from './api/interest/interest.module';

@Module({
  imports: [
    MessageModule,
    FriendModule,
    GroupModule,
    CommentModule,
    PostModule,
    InterestModule,
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

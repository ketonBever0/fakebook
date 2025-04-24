/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto, EditCommentDto } from './dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('')
  getAllComments() {
    return this.commentService.getAllComments();
  }

  @Get('post/:id')
  getAllCommentsByPost(@Param('id') postId: string) {
    return this.commentService.getAllCommentsFromPost(parseInt(postId));
  }

  @Post('post/:id')
  addComment(@Param('id') postId: string, @Body() dto: AddCommentDto) {
    return this.commentService.addComment(parseInt(postId), dto);
  }

  @Put('comment/:id')
  editComment(@Param('id') commentId: string, @Body() dto: EditCommentDto) {
    return this.commentService.editComment(parseInt(commentId), dto);
  }

  @Delete('comment/:id')
  deleteComment(@Param('id') commentId: string) {
    return this.commentService.deleteComment(parseInt(commentId));
  }
}

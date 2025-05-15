/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AddPostDto, UpdatePostDto } from './dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('all')
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('one/:id')
  getOnePost(@Param('id') id: string) {
    return this.postService.getOnePost(parseInt(id));
  }


  @Post('')
  addPost(@Body() dto: AddPostDto) {
    return this.postService.addPost(dto);
  }

  @Put('one/:id')
  updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.updatePost(parseInt(id), dto);
  }

  @Delete('one/:id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(parseInt(id));
  }
}

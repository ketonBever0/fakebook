/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AddPostDto, UpdatePostDto } from './dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname, join } from 'path';
import { Response } from 'express';

@Controller('post')
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

  @Get("/image/:file")
  async getImage(
    @Param("file") fileName: string,
    @Res() res: Response
  ) {
    const filePath = `files/postimgs/${fileName}`;
    if (!fs.existsSync(filePath))
      throw new NotFoundException('Image not found!')
    const file = fs.createReadStream(join(process.cwd(), filePath));
    file.pipe(res);
  }

  @Post('')
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = `files/postimgs`;
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: async (req, file, cb) => {
          cb(
            null,
            `${Date.now()}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(new BadRequestException('Csak kép formátum tölthető fel!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  addPost(@Body() dto: AddPostDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.postService.addPost(dto, files[0].filename);
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

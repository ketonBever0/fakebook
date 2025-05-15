/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';
import { AddPostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private readonly db: OracleService) {}

  async getAllPosts() {
    return await this.db.pool
      .execute(
        `
      SELECT ID AS "id", TEXT AS "text", IMAGE_URL AS "imageUrl", AUTHOR_ID AS "authorId"
      FROM POSTS
      `,
        {},
        this.db.jsonFormat,
      )
      .then((res) => res.rows);
  }

  async getOnePost(id: number) {
    const result = await this.db.pool
      .execute(
        `
      SELECT ID AS "id", TEXT AS "text", IMAGE_URL AS "imageUrl", AUTHOR_ID AS "authorId"
      FROM POSTS
      WHERE ID = :id
      `,
        { id: id },
        this.db.jsonFormat,
      )
      .then((res) => res.rows[0]);

    if (!result) throw new NotFoundException('Post not found!');
    return result;
  }

  async addPost(dto: AddPostDto) {
    return await this.db.pool
      .execute(
        `
      INSERT INTO POSTS (TEXT, IMAGE_URL, AUTHOR_ID) VALUES (:text, :imageUrl, :authorId)
      `,
        { text: dto.text, imageUrl: dto.imageUrl, authorId: dto.authorId },
        this.db.autoCommit,
      )
      .then(() => {
        return { message: 'Post added.' };
      })
      .catch((e: Error) => {
        if (e.message.includes('FORBIDDEN_EXPRESSION')) {
          throw new NotAcceptableException('Obscene expression found in post!');
        }
        throw e;
      });
  }

  async updatePost(id: number, dto: UpdatePostDto) {
    return await this.db.pool
      .execute(
        `
      UPDATE POSTS SET TEXT = :text, IMAGE_URL = :imageUrl
      WHERE ID = :id
      `,
        { text: dto.text, imageUrl: dto.imageUrl, id: id },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Post updated.' };
        else throw new NotFoundException('Post not found!');
      })
      .catch((e: Error) => {
        if (e.message.includes('FORBIDDEN_EXPRESSION')) {
          throw new NotAcceptableException('Obscene expression found in post!');
        }
        throw e;
      });
  }

  async deletePost(id: number) {
    return await this.db.pool
      .execute(
        `
      DELETE FROM POSTS
      WHERE ID = :id
      `,
        { id: id },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Post deleted.' };
        else throw new NotFoundException('Post not found!');
      });
  }
}

/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';
import { AddCommentDto, EditCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private readonly db: OracleService) {}

  async getAllComments() {
    return await this.db.pool
      .execute(
        `
      SELECT ID AS "id", TEXT AS "text", AUTHOR_ID AS "authorId", POST_ID AS "postId"
      FROM COMMENTS
      `,
        {},
        this.db.jsonFormat,
      )
      .then((res) => res.rows);
  }

  async getAllCommentsFromPost(postId: number) {
    return await this.db.pool
      .execute(
        `
      SELECT ID AS "id", TEXT AS "text", AUTHOR_ID AS "authorId", POST_ID AS "postId"
      FROM COMMENTS
      WHERE POST_ID = :id
      `,
        { id: postId },
        this.db.jsonFormat,
      )
      .then((res) => res.rows);
  }

  async addComment(postId: number, dto: AddCommentDto) {
    return await this.db.pool
      .execute(
        `
      INSERT INTO COMMENTS (TEXT, AUTHOR_ID, POST_ID) VALUES (:text, :authorId, :postId)
      `,
        { text: dto.text, authorId: dto.authorId, postId: postId },
        this.db.autoCommit,
      )
      .then(() => {
        return { message: 'Comment posted.' };
      })
      .catch((e: Error) => {
        if (e.message.includes('COMMENTS_POSTS_FK'))
          throw new NotFoundException('Post not found!');

        // Trigger hibakezelés
        if (e.message.includes('FORBIDDEN_EXPRESSION') || 
            e.message.includes('FORBIDDEN_EXPRESSION_IN_COMMENT')) {
          throw new NotAcceptableException('Obscene expression found in comment!');
        }
        
        throw e; 
      });
  }

  async editComment(commentId: number, dto: EditCommentDto) {
    return await this.db.pool
      .execute(
        `
      UPDATE COMMENTS SET TEXT = :text
      WHERE ID = :commentId
      `,
        { text: dto.text, commentId: commentId },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Comment updated.' };
        throw new NotFoundException('Comment not found!');
      })
      .catch((e: Error) => {
        // Trigger hibakezelés
        if (e.message.includes('FORBIDDEN_EXPRESSION') || 
            e.message.includes('FORBIDDEN_EXPRESSION_IN_COMMENT')) {
          throw new NotAcceptableException('Obscene expression found in comment!');
        }
        
        throw e; 
      });
  }

  async deleteComment(commentId: number) {
    return await this.db.pool
      .execute(
        `
      DELETE FROM COMMENTS
      WHERE ID = :commentId
      `,
        { commentId: commentId },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Comment deleted.' };
        throw new NotFoundException('Comment not found!');
      });
  }
}

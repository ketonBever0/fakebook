/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';

@Injectable()
export class ObsceneService {
  constructor(private readonly db: OracleService) {}

  async getExpressions() {
    return await this.db.pool
      .execute(
        `
      SELECT ID AS "id", LOWER(PATTERN) AS "pattern" FROM FORBIDDEN_EXPRESSIONS
      `,
        {},
        this.db.jsonFormat,
      )
      .then((res) => {
        return res.rows;
      });
  }

  async addExpression(pattern: string) {
    return await this.db.pool
      .execute(
        `
      INSERT INTO FORBIDDEN_EXPRESSIONS (PATTERN) VALUES (UPPER(:pattern))
      `,
        { pattern },
        this.db.autoCommit,
      )
      .then(() => {
        return { message: 'Expression added.' };
      })
      .catch((e: Error) => {
        if (e.message.includes('FORBIDDEN_EXPRESSIONS_UNIQUE'))
          throw new ConflictException('Expression already exists!');
      });
  }

  async updateExpression(id: number, pattern: string) {
    const result = await this.db.pool
      .execute(
        `
      UPDATE FORBIDDEN_EXPRESSIONS SET PATTERN = UPPER(:pattern)
      WHERE ID = :id
      `,
        { pattern: pattern, id: id },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Expression updated.' };
      })
      .catch((e: Error) => {
        if (e.message.includes('FORBIDDEN_EXPRESSIONS_UNIQUE'))
          throw new ConflictException('Expression already exists!');
      });
    if (!result) throw new NotFoundException('Expression not found!');
    return result;
  }

  async deleteExpression(id: number) {
    const result = await this.db.pool
      .execute(
        `
      DELETE FROM FORBIDDEN_EXPRESSIONS
      WHERE ID = :id
      `,
        { id: id },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Expression deleted.' };
      });
    if (!result) throw new NotFoundException('Expression not found!');
    return result;
  }
}

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
export class InterestService {
  constructor(private readonly db: OracleService) {}

  async getInterests() {
    return await this.db.pool
      .execute(
        `
      SELECT ID AS "id", NAME AS "name" FROM INTERESTS
      `,
        {},
        this.db.jsonFormat,
      )
      .then((res) => {
        return res.rows;
      });
  }

  async addInterest(name: string) {
    return await this.db.pool
      .execute(
        `
      INSERT INTO INTERESTS (NAME) VALUES (:name)
      `,
        { name: name },
        this.db.autoCommit,
      )
      .then(() => {
        return { message: 'Interest added.' };
      })
      .catch((e: Error) => {
        if (e.message.includes('INTERESTS_UNIQUE'))
          throw new ConflictException('Interest already exists!');
      });
  }

  async updateInterest(id: number, name: string) {
    const result = await this.db.pool
      .execute(
        `
      UPDATE INTERESTS SET NAME = :name
      WHERE ID = :id
      `,
        { name: name, id: id },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Interest updated.' };
      })
      .catch((e: Error) => {
        if (e.message.includes('INTERESTS_UNIQUE'))
          throw new ConflictException('Interest already exists!');
      });
    if (!result) throw new NotFoundException('Interest not found!');
    return result;
  }

  async deleteInterest(id: number) {
    const result = await this.db.pool
      .execute(
        `
      DELETE FROM INTERESTS
      WHERE ID = :id
      `,
        { id: id },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1) return { message: 'Interest deleted.' };
      });
    if (!result) throw new NotFoundException('Interest not found!');
    return result;
  }
}

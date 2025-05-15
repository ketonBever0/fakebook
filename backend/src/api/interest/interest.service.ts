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

  async getUserInterests(userId: number) {
    return await this.db.pool
        .execute(
            `
      SELECT I.ID   AS "id", I.NAME AS "name"
      FROM INTERESTS I
      JOIN USER_INTERESTS UI ON UI.INTEREST_ID = I.ID
      WHERE UI.USER_ID = :userId
      `,
            { userId },
            this.db.jsonFormat,
        )
        .then(res => res.rows);
  }

  async addUserInterest(userId: number, interestId: number) {
    return await this.db.pool
        .execute(
            `
      INSERT INTO USER_INTERESTS (USER_ID, INTEREST_ID)
      VALUES (:userId, :interestId)
      `,
            { userId, interestId },
            this.db.autoCommit,
        )
        .then(() => {
          return { message: 'Interest added.' };
        })
        .catch((e: Error) => {
          if (e.message.includes('FAKEBOOK.USER_INTERESTS_INTERESTS_FK')) {
            throw new NotFoundException('Interest not exists!');
          }

          if (e.message.includes('INTEREST_ALREADY_ADDED')) {
            throw new ConflictException('Interest already added!');
          }

          console.log(e);
        });
  }

  async deleteUserInterest(userId: number, interestId: number) {
    const result = await this.db.pool.execute(
        `
    DELETE FROM USER_INTERESTS
    WHERE USER_ID = :userId AND INTEREST_ID = :interestId
    `,
        { userId, interestId },
        this.db.autoCommit,
    ).then(res => res.rowsAffected);

    if (!result) throw new NotFoundException('Interest not found!');
    return { message: 'Interest removed.' };
  }

}
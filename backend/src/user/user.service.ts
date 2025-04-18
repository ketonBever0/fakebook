/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';

@Injectable()
export class UserService {
  constructor(private readonly db: OracleService) {}

  async getOneUser(id: number) {
    const res = await this.db.pool
      .execute(
        `
      SELECT ID AS "id", EMAIL AS "email", FULLNAME AS "fullname", BIRTH_DATE AS "birthDate", COMPANY AS "company", ROLE AS "role"
      FROM USERS
      WHERE id = :id
      `,
        { id: id },
        this.db.jsonFormat);
    if (res.rows.length > 0) return res.rows[0];
    else throw new NotFoundException('User not found!');
  }

  async getAllUsers() {
    const res = await this.db.pool
      .execute(
        `
      SELECT ID AS "id", EMAIL AS "email", FULLNAME AS "fullname", BIRTH_DATE AS "birthDate", COMPANY AS "company", ROLE AS "role"
      FROM USERS
      `,
        {},
        this.db.jsonFormat);
    return res.rows;
  }
}

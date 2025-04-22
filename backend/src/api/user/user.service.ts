/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: OracleService) {}

  async getOneUser(id: number) {
    const result = await this.db.pool
      .execute(
        `
      SELECT ID AS "id", EMAIL AS "email", FULLNAME AS "fullname", BIRTH_DATE AS "birthDate", COMPANY AS "company", ROLE AS "role"
      FROM USERS
      WHERE id = :id
      `,
        { id: id },
        this.db.jsonFormat,
      )
      .then((res) => {
        if (res.rows.length == 1) return res.rows[0];
      });
    if (!result) throw new NotFoundException('User not found!');
    return result;
  }

  async getAllUsers() {
    const res = await this.db.pool.execute(
      `
      SELECT ID AS "id", EMAIL AS "email", FULLNAME AS "fullname", BIRTH_DATE AS "birthDate", COMPANY AS "company", ROLE AS "role"
      FROM USERS
      `,
      {},
      this.db.jsonFormat,
    );
    return res.rows;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const result = await this.db.pool
      .execute(
        `
        UPDATE USERS
        SET EMAIL = :email, FULLNAME = :fullname, BIRTH_DATE = TO_DATE(:birthDate, 'yyyy-mm-dd'), COMPANY = :company, ROLE = :role
        WHERE ID = :id
        `,
        {
          id,
          email: dto.email,
          fullname: dto.fullname,
          birthDate: dto.birthDate,
          company: dto.company,
          role: dto.role,
        },
        this.db.autoCommit,
      )
      .then((res) => {
        if(res.rowsAffected == 1) return { message: 'User updated successfully!' };
      })
      .catch((e: Error) => {
        if (e.message.includes('USERS_EMAIL_UNIQUE')) {
          throw new ConflictException('E-mail already exists!');
        }

        if (e.message.includes('FORBIDDEN_EXPRESSION')) {
          throw new NotAcceptableException(
            'Obscene expression found in fullname!',
          );
        }
      });

    if (!result) throw new NotFoundException('User not found!');
    return result;
  }

  async deleteUser(id: number) {
    return await this.db.pool
      .execute(
        `
      DELETE FROM USERS WHERE ID = :id
      `,
        { id: id },
        this.db.autoCommit,
      )
      .then((res) => {
        if (res.rowsAffected == 1)
          return { message: 'User deleted successfully!' };
        else throw new NotFoundException('User not found!');
      });
  }
}

import * as argon from 'argon2';

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import OracleDB from 'oracledb';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: OracleService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signToken(
    id: number,
    email: string,
    role: 'NORMAL' | 'MODERATOR' | 'ADMIN',
  ) {
    return await this.jwt.signAsync(
      {
        sub: id,
        email,
        role,
      },
      {
        expiresIn: '30m',
        secret: this.config.get('JWT_SECRET'),
      },
    );
  }

  async register(dto: RegisterDto) {
    const hash = await argon.hash(dto.password);

    return await this.db.pool
      .execute(
        `
        INSERT INTO USERS
          (EMAIL, fullname, PASSWORD, BIRTH_DATE, COMPANY)
          VALUES(:email, :fullname, :password, TO_DATE(:birthDate, 'yyyy-mm-dd'), :company)
      `,
        {
          email: dto.email,
          fullname: dto.fullname,
          password: hash,
          birthDate: dto.birthDate,
          company: dto.company,
        },
        { autoCommit: true },
      )
      .then((res) => {
        if (res.rowsAffected == 1) {
          return { message: 'Register successful! Now login.' };
        }
      })
      .catch((e: Error) => {
        if (e.message.includes('USERS_EMAIL_UNIQUE')) {
          throw new ConflictException('E-mail address is already registered.');
        }

        if (e.message.includes('FORBIDDEN_EXPRESSION')) {
          throw new NotAcceptableException(
            'Obscene expression found in fullname!',
          );
        }
      });
  }

  async login(dto: LoginDto) {
    const user: any = await this.db.pool
      .execute(
        `
      SELECT ID AS "id", EMAIL AS "email", FULLNAME AS "fullname", PASSWORD AS "password", BIRTH_DATE AS "birthDate", COMPANY AS "company"
      FROM USERS
      WHERE email = :email
      `,
        { email: dto.email },
        this.db.jsonFormat,
      )
      .then((e) => e.rows[0]);

    if (!user) throw new NotFoundException('E-mail address not found!');

    if (await argon.verify(user.password, dto.password)) {
      const token = await this.signToken(user.id, user.email, user.role);
      delete user.password;
      return { token, user };
    } else {
      throw new ForbiddenException('Incorrect password!');
    }
  }

  async createPassword(id: number, password: string) {
    const hash = await argon.hash(password);
    return await this.db.pool
      .execute(
        `
        UPDATE USERS SET PASSWORD = :password
        WHERE ID = :id
      `,
        { password: hash, id: id },
        this.db.autoCommit,
      )
      .then(async (res) => {
        const user: { email: string } = await this.db.pool
          .execute(
            `
          SELECT EMAIL AS "email" FROM USERS WHERE ID = :id
          `,
            { id: id },
            this.db.jsonFormat,
          )
          .then((res) => res.rows[0] as { email: string });
        if (user) return { message: `Password created for ${user.email}.` };
        else throw new NotFoundException('User not found!');
      });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { OracleService } from './oracle/oracle.service';

@Injectable()
export class AppService {
  constructor(private readonly db: OracleService) {}

  getHello(): string {
    return this.db.pool ? 'Connected!' : 'Not Connected!';
  }

  async postTest(body: any) {
    return body.injectMode
      ? await this.db.pool
          .execute(
            `
      SELECT * FROM FORBIDDEN_EXPRESSIONS
      WHERE PATTERN LIKE UPPER('%' || '${body.pattern}' || '%')
      `,
            {
              // pattern: body.pattern,
            },
            this.db.jsonFormat,
          )
          .then((res) => res.rows)
      : await this.db.pool
          .execute(
            `
      SELECT * FROM FORBIDDEN_EXPRESSIONS
      WHERE PATTERN LIKE UPPER('%' || :pattern || '%')
      `,
            {
              pattern: body.pattern,
            },
            this.db.jsonFormat,
          )
          .then((res) => res.rows);
  }

  async getTime() {
    return await this.db.pool
      .execute(
        `
          SELECT SYSDATE FROM DUAL
        `,
        [],
        this.db.jsonFormat,
      )
      .then((res) => res.rows[0])
      .catch((e) => {
        console.log(e);
        throw new NotFoundException(e);
      });
  }
}

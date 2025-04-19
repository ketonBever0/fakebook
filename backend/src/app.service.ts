import { Injectable, NotFoundException } from '@nestjs/common';
import { OracleService } from './oracle/oracle.service';

@Injectable()
export class AppService {
  constructor(private readonly db: OracleService) {}

  getHello(): string {
    return this.db.pool ? 'Connected!' : 'Not Connected!';
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

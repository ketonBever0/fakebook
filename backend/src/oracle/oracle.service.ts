import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

@Injectable()
export class OracleService {
  pool: oracledb.Connection | null;
  readonly jsonFormat = oracledb.OUT_FORMAT_OBJECT;

  constructor(private readonly config: ConfigService) {
    this.connect();
  }

  async connect() {
    this.pool = await (
      await oracledb.createPool({
        user: this.config.get('DB_USER'),
        password: this.config.get('DB_PASSWORD'),
        connectString: this.config.get('DB_CONNECTION_STRING'),
      })
    )
      .getConnection()
      .then((res) => {
        // console.log('OracleDB connection pool created successfully');
        return res;
      })
      .catch((e) => {
        console.error('Error creating OracleDB connection pool', e);
        return null;
      });
  }

  getDb() {
    return oracledb;
  }
}

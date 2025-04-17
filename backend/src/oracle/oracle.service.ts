import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import oracledb from 'oracledb';

@Injectable()
export class OracleService {
  private readonly config: ConfigService;

  static pool: oracledb.Pool | null;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await oracledb.createPool({
        user: this.config.get('DB_USER'),
        password: this.config.get('DB_PASSWORD'),
        connectString: this.config.get('DB_CONNECTION_STRING'),
      });
      console.log('OracleDB connection pool created successfully');
    } catch (err) {
      console.error('Error creating OracleDB connection pool', err);
    }
  }

}

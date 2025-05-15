import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OracleService implements OnModuleInit {
  pool: oracledb.Connection | null;
  readonly jsonFormat = { outFormat: oracledb.OUT_FORMAT_OBJECT };
  readonly autoCommit = { autoCommit: true };

  constructor(private readonly config: ConfigService) {
    this.connect();
  }

  async onModuleInit() {
    // if (this.pool) {
    //   await this.runTriggerMigrations();
    // }
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
        console.log('OracleDB connection pool created successfully!');
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

  async runTriggerMigrations() {
    try {
      const triggersFilePath = path.join(
        __dirname,
        'migrations',
        'triggers.sql',
      );

      if (!fs.existsSync(triggersFilePath)) {
        console.log('triggers.sql fájl nem létezik');
        return;
      }

      const sqlScript = fs.readFileSync(triggersFilePath, 'utf8');

      const statements = sqlScript.split('/');

      console.log(`${statements.length} trigger futtatásra kerül`);

      for (const statement of statements) {
        const trimmed = statement.trim();
        if (trimmed) {
          try {
            await this.pool.execute(trimmed, {}, this.autoCommit);
            console.log('Sikeresen lefutott a trigger');
          } catch (err) {
            console.error('Hibás trigger:', err.message);
          }
        }
      }

      console.log('Trigger futtatások sikeresek');
    } catch (error) {
      console.error('Trigger futtatások sikertelenek:', error);
    }
  }
}

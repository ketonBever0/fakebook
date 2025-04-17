import { Injectable } from '@nestjs/common';
import { OracleService } from './oracle/oracle.service';

@Injectable()
export class AppService {
  getHello(): string {
    return `${OracleService.pool ? 'Connected' : 'Not Connected'} to OracleDB`;
  }
}

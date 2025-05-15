/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';

@Injectable()
export class MessageService {

  constructor(db: OracleService) {}


  


}

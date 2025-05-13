/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';

@Injectable()
export class MemberService {
  constructor(private readonly db: OracleService) {}

  async joinGroup(userId: number, groupId: number) {
    return await this.db.pool
      .execute(
        `
        INSERT INTO USER_GROUP (ROLE, USER_ID, GROUP_ID)
        VALUES ((
          SELECT CASE WHEN PRIVATE = 1 THEN 'PENDING' ELSE 'NORMAL' END "groupStatus"
          FROM FAKEBOOK.GROUPS
          WHERE ID = :groupId),
        :userId, :groupId)
      `,
        { userId, groupId },
        this.db.autoCommit,
      )
      .then(() => {
        return { message: 'Joined.' };
      });
  }
}

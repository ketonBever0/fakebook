/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';
import { GroupService } from './group.service';
import { DBError } from 'oracledb';

@Injectable()
export class MemberService {
  constructor(
      private readonly groupService: GroupService,
      private readonly db: OracleService,
  ) {}

  async isGroupOwner(which: number, who: number) {
    return (
        ((await this.groupService.getOneGroup(which)) as { ownerId: number })
            .ownerId == who
    );
  }

  async getMyMembership(
      groupId: number,
      userId: number,
  ): Promise<{ role: string }> {
    return await this.db.pool
        .execute(
            `
      SELECT ROLE "role"
      FROM USER_GROUPS
      WHERE GROUP_ID = :groupId AND USER_ID = :userId
      `,
            { groupId, userId },
            this.db.jsonFormat,
        )
        .then((res) => {
          if (res.rows.length == 1) {
            return res.rows[0] as { role: string };
          } else {
            throw new NotFoundException('Membership not found!');
          }
        });
  }

  async joinGroup(userId: number, groupId: number) {
    return await this.db.pool
        .execute(
            `
        INSERT INTO USER_GROUPS (ROLE, USER_ID, GROUP_ID)
        VALUES ((
          SELECT CASE WHEN PRIVATE = 1 THEN 'PENDING' ELSE 'NORMAL' END "groupStatus"
          FROM FAKEBOOK.GROUPS
          WHERE ID = :groupId),
        :userId, :groupId)
      `,
            { userId, groupId },
            this.db.autoCommit,
        )
        .then(async () => {
          const groupData = (await this.groupService.getOneGroup(groupId)) as {
            private: number;
          };
          return {
            message: groupData.private
                ? 'Join request sent.'
                : 'Joined. Welcome to the group!',
          };
        })
        .catch((e: DBError) => {
          if (e.message.includes('MEMBERSHIP_ALREADY_EXISTS')) {
            throw new ConflictException('Membership already exists!');
          }
          if (e.errorNum == 1400) {
            throw new NotFoundException('Group not found!');
          }
        });
  }

  async deleteMembership(groupId: number, userId: number) {
    return await this.db.pool
        .execute(
            `
      DELETE FROM USER_GROUPS
      WHERE GROUP_ID = :groupId AND USER_ID = :userId
      `,
            { groupId, userId },
            this.db.autoCommit,
        )
        .then((res) => {
          return res.rowsAffected > 0;
        })
        .catch((e: Error) => {
          if (e.message.includes('CANNOT_REMOVE_GROUP_OWNER')) {
            throw new ConflictException('Cannot remove the owner of the group!');
          }
          throw e;
        });
  }
}
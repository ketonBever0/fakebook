/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';
import { GroupDto } from './dto';

@Injectable()
export class GroupService {
  constructor(private readonly db: OracleService) {}

  async getAllGroups() {
    return await this.db.pool
        .execute(
            `
      SELECT G.ID "id", G.NAME "name", G.PRIVATE "private", (
        SELECT COUNT(IU.USER_ID) FROM FAKEBOOK.USER_GROUPS IU
        WHERE GROUP_ID = G.ID) "memberCount"
      FROM FAKEBOOK.GROUPS G
      `,
            {},
            this.db.jsonFormat,
        )
        .then((res) => res.rows);
  }

  async getOneGroup(id: number) {
    return await this.db.pool
        .execute(
            `
      SELECT G.ID "id", G.NAME "name", G.PRIVATE "private", U.FULLNAME "ownerName", U.EMAIL "ownerEmail", U.ID "ownerId"
      FROM GROUPS G
      JOIN USER_GROUPS UG ON G.ID = UG.GROUP_ID
      JOIN USERS U ON U.ID = UG.USER_ID
      WHERE G.ID = :id AND UG.ROLE = 'OWNER'
      `,
            { id },
            this.db.jsonFormat,
        )
        .then((res) => {
          if (res.rows.length == 1) {
            return res.rows[0];
          } else {
            throw new NotFoundException('Group not found!');
          }
        });
  }

  async createGroup(name: string, isPrivate: number, userId: number) {
    let newGroupId = await this.db.pool
        .execute(
            `INSERT INTO GROUPS (NAME, PRIVATE) VALUES (:name, :isPrivate) RETURNING ID INTO :newGroupId`,
            {
              name,
              isPrivate,
              newGroupId: {
                // ...this.db.autoCommit,
                dir: this.db.getDb().BIND_OUT,
                type: this.db.getDb().NUMBER,
              },
            },
        )
        .then((res) => {
          return (res.outBinds as { newGroupId: number[] }).newGroupId[0];
        })
        .catch((e: Error) => {
          if (e.message.includes('GROUPS_UNIQUE'))
            throw new ConflictException('Group name is occupied!');
        });

    return await this.db.pool
      .execute(
        `
        INSERT INTO USER_GROUPS (ROLE, USER_ID, GROUP_ID)
        VALUES ('OWNER', :userId, :groupId)
        `,
            { userId: userId, groupId: newGroupId as number },
            this.db.autoCommit,
        )
        .then(() => {
          return { message: 'Group created.' };
        });
  }

  async updateGroup(id: number, dto: GroupDto) {
    const res = (await this.db.pool
        .execute(
            `
      UPDATE GROUPS SET NAME = :name, PRIVATE = :private
      WHERE ID = :id
      `,
            { name: dto.name, private: dto.private ? 1 : 0, id },
            this.db.autoCommit,
        )
        .then((res) => {
          return res.rowsAffected;
        })
        .catch((e: Error) => {
          if (e.message.includes('GROUPS_UNIQUE')) {
            throw new ConflictException('Group name already exists!');
          }
        })) as number;

    if (res > 0) {
      return { message: 'Group updated.' };
    } else throw new NotFoundException('Group not found!');
  }

  async deleteGroup(id: number) {
    return await this.db.pool
        .execute(
            `
      DELETE FROM GROUPS WHERE ID = :id
      `,
            { id },
            this.db.autoCommit,
        )
        .then((res) => {
          if (res.rowsAffected > 0) {
            return { message: 'Group deleted.' };
          } else {
            throw new NotFoundException('Group not found!');
          }
        });
  }
}
/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DBError } from 'oracledb';
import { OracleService } from 'src/oracle/oracle.service';

@Injectable()
export class FriendService {
  constructor(private readonly db: OracleService) {}

  async requestFriend(senderId: number, receiverId: number) {
    const res = (await this.db.pool
      .execute(
        `
      INSERT INTO FRIENDS (SENDER_ID, RECEIVER_ID)
      VALUES (:senderId, :receiverId)
      `,
        { senderId, receiverId },
        this.db.autoCommit,
      )
      .then((res) => {
        return res.rowsAffected > 0;
      })
      .catch((e: DBError) => {
        if (e.message.includes('FRIEND_ALREADY_ADDED')) {
          throw new ConflictException('Friend already added!');
        }
      })) as boolean;

    if (res) {
      return { message: 'Friend request sent.' };
    } else {
      throw new NotFoundException('Requested user not found!');
    }
  }

  async acceptRequest(senderId: number, receiverId: number) {
    const res = (await this.db.pool.execute(`
      UPDATE FRIENDS SET PENDING = 0
      WHERE SENDER_ID = :senderId AND RECEIVER_ID = :receiverId
      `, {senderId, receiverId}, this.db.autoCommit)
      .then(res => res.rowsAffected == 1)) as boolean;

      if (res) {
      return { message: 'Friend accepted.' };
    } else {
      throw new NotFoundException('Friend request not found!');
    }
  }
}

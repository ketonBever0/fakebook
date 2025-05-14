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

  async getMyFriends(me: number) {
    return await this.db.pool
      .execute(
        `
      SELECT F.PENDING "pending", F.WHEN "when", F.SENDER_ID "senderId", F.RECEIVER_ID "receiverId", S.FULLNAME "senderName", R.FULLNAME "receiverName"
      FROM FRIENDS F
      JOIN USERS S ON F.SENDER_ID = S.ID
      JOIN USERS R ON F.SENDER_ID = R.ID
      WHERE F.SENDER_ID = :me OR F.RECEIVER_ID = :me
      `,
        { me },
        this.db.jsonFormat,
      )
      .then((res) => res.rows);
  }

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
    const res = (await this.db.pool
      .execute(
        `
      UPDATE FRIENDS SET PENDING = 0
      WHERE SENDER_ID = :receiverId AND RECEIVER_ID = :senderId
      `,
        { senderId, receiverId },
        this.db.autoCommit,
      )
      .then((res) => res.rowsAffected == 1)) as boolean;

    if (res) {
      return { message: 'Friend accepted.' };
    } else {
      throw new NotFoundException('Friend request not found!');
    }
  }

  async deleteFriend(senderId: number, receiverId: number) {
    const res = (await this.db.pool
      .execute(
        `
      DELETE FROM FRIENDS
      WHERE SENDER_ID = :senderId AND RECEIVER_ID = :receiverId
      OR SENDER_ID = :receiverId AND RECEIVER_ID = :senderId
      `,
        { senderId, receiverId },
        this.db.autoCommit,
      )
      .then((res) => res.rowsAffected > 0)) as boolean;

    if (res) {
      return { message: 'Friend deleted.' };
    } else {
      throw new NotFoundException('Friend not found!');
    }
  }
}

/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/oracle/oracle.service';

@Injectable()
export class MessageService {
  constructor(private readonly db: OracleService) {}

  async sendMessage(fromId: number, toId: number, text: string) {
    return await this.db.pool
      .execute(
        `
      INSERT INTO MESSAGES (SENDER_ID, RECEIVER_ID, TEXT)
      VALUES (:fromId, :toId, :text)
      `,
        { fromId, toId, text },
        this.db.autoCommit,
      )
      .then(() => {
        return true;
      });
  }

  async getMyMessagesFromUser(meId: number, otherId: number) {
    return await this.db.pool
      .execute(
        `
      SELECT M.ID "messageId", M.TEXT "text", M.WHEN "when", SU.ID "sender_id", SU.FULLNAME "senderName", RU.ID "receiverId", RU.FULLNAME "receiverName"
      FROM FAKEBOOK.MESSAGES M
      JOIN FAKEBOOK.USERS SU ON M.SENDER_ID = SU.ID
      JOIN FAKEBOOK.USERS RU ON M.RECEIVER_ID = RU.ID
      WHERE (M.SENDER_ID = :meId OR M.RECEIVER_ID = :meId)
      AND (M.SENDER_ID = :otherId OR M.RECEIVER_ID = :otherId)
      ORDER BY M.WHEN DESC
      `,
        { meId, otherId },
        this.db.jsonFormat,
      )
      .then((res) => res.rows);
  }
}

/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';

@Controller()
export class MessageController {

  constructor(private readonly messageService: MessageService, private readonly userService: UserService) {}


  


}

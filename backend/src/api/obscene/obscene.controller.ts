/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObsceneService } from './obscene.service';

@Controller('obscene')
export class ObsceneController {
  constructor(private readonly obsceneService: ObsceneService) {}

  @Get('')
  getExpressions() {
    return this.obsceneService.getExpressions();
  }

  @Post('')
  addExpression(@Body() body: { pattern: string }) {
    return this.obsceneService.addExpression(body.pattern);
  }

  @Put(':id')
  updateExpression(@Param('id') id: string, @Body() body: { pattern: string }) {
    return this.obsceneService.updateExpression(parseInt(id), body.pattern);
  }

  @Delete(':id')
  deleteExpression(@Param('id') id: string) {
    return this.obsceneService.deleteExpression(parseInt(id));
  }
}

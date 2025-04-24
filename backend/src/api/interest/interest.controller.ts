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
import { InterestService } from './interest.service';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Get('')
  getInterests() {
    return this.interestService.getInterests();
  }

  @Post('')
  addInterest(@Body() body: { name: string }) {
    return this.interestService.addInterest(body.name);
  }

  @Put(':id')
  updateInterest(@Param('id') id: string, @Body() body: { name: string }) {
    return this.interestService.updateInterest(parseInt(id), body.name);
  }

  @Delete(':id')
  deleteInterest(@Param('id') id: string) {
    return this.interestService.deleteInterest(parseInt(id));
  }
}

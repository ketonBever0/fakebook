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

  @Get('user/:id')
  getUserInterestsById(@Param('id') id: string) {
    return this.interestService.getUserInterests(parseInt(id));
  }

  @Post('user/:id')
  addUserInterest(@Param('id') id: string, @Body() body: { userId: number }) {
    return this.interestService.addUserInterest(body.userId, parseInt(id));
  }

  @Delete('user/:userId/:interestId')
  deleteUserInterest(
      @Param('userId') userId: string,
      @Param('interestId') interestId: string
  ) {
    return this.interestService.deleteUserInterest(parseInt(userId), parseInt(interestId));
  }

}

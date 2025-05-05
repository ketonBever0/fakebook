import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("test")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  postTest(@Body() body: Object) {
    return this.appService.postTest(body);
  }

  @Get("time")
  getTime() {
    return this.appService.getTime();
  }
}

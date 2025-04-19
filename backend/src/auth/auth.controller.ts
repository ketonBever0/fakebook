import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    // return res.status(HttpStatus.OK).json(this.authService.login(dto));
    return this.authService.login(dto);
  }

  @Patch("password/:id")
  createPassword(@Param("id") id: string, @Body() body: { password: string }) {
    return this.authService.createPassword(parseInt(id), body.password)
  }

}

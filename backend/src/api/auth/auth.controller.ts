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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RegisterDto, UpdateMeDto } from './dto';
import { AuthModel, Roles, User, UserModel } from './decorator/auth.decorator';
import { AuthGuard } from './guard/auth.guard';
import { RoleGuard } from './guard/role.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@User() user: AuthModel) {
    return this.userService.getOneUser(user.sub);
  }

  @Put('me')
  @UseGuards(AuthGuard)
  updateMe(@User() user: AuthModel, @Body() dto: UpdateMeDto) {
    return this.userService.updateUser(user.sub, { ...dto, role: 'NORMAL' });
  }

  @UseGuards(AuthGuard)
  @Patch('me/password')
  changePassword(@User() user: AuthModel, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.sub, dto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'MODERATOR')
  @Patch('password/:id')
  createPassword(@Param('id') id: string, @Body() body: { password: string }) {
    return this.authService.createPassword(parseInt(id), body.password);
  }
}

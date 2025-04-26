/*
https://docs.nestjs.com/openapi/decorators#decorators
*/

import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export interface UserModel {
  id: number;
  email: string;
  fullname: string;
  password: string;
  birthDate: string;
  company: string;
  pictureUrl: string | null;
  registeredAt: string;
  lastLogin: string;
  role: 'ADMIN' | 'MODERATOR' | 'NORMAL';
}

export interface AuthModel {
  sub: number;
  email: string;
  iat: EpochTimeStamp
  exp: EpochTimeStamp
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

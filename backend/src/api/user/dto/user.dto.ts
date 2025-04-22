import {
  Equals,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsIn(['NORMAL', 'MODERATOR', 'ADMIN'], {
    message: 'Role must be NORMAL, MODERATOR or ADMIN!',
  })
  role: string;
}

import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddCommentDto {

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsNotEmpty()
  text: string;
}

export class EditCommentDto {
  @IsNotEmpty()
  text: string;
}

import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddPostDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  imageUrl: string;

  @IsNotEmpty()
  authorId: number;
}

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  imageUrl: string;
}
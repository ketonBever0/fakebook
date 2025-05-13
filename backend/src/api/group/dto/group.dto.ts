import { IsBoolean, IsInt, IsString } from "class-validator";

export class GroupDto {

  @IsString()
  name: string;

  @IsBoolean()
  private: boolean;

}
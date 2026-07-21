import { IsOptional, IsString } from 'class-validator';

export class GetUserRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  userCustomerId!: string;
}
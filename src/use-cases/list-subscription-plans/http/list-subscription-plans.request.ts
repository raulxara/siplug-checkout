import { IsOptional, IsString } from 'class-validator';

export class ListSubscriptionPlansRequest {
  @IsOptional()
  @IsString()
  token?: string;
}
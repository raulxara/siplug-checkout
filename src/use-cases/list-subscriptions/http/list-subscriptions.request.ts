import { IsOptional, IsString } from 'class-validator';

export class ListSubscriptionsRequest {
  @IsOptional()
  @IsString()
  token?: string;
}

import { IsOptional, IsString } from 'class-validator';

export class ListSubscriptionInvoicesRequest {
  @IsOptional()
  @IsString()
  token?: string;
}

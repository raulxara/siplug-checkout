import { IsOptional, IsString } from 'class-validator';

export class GetSubscriptionInvoiceByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  subscriptionInvoiceId?: string;

  @IsOptional()
  @IsString()
  _id?: string;
}

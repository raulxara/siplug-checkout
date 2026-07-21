import { IsOptional, IsString } from 'class-validator';

export class GetSubscriptionByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @IsOptional()
  @IsString()
  _id?: string;
}

import { IsOptional, IsString } from 'class-validator';

export class GetSubscriptionPlanByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  subscriptionPlanId?: string;

  @IsOptional()
  @IsString()
  _id?: string;
}

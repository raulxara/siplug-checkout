import { IsOptional, IsString } from 'class-validator';

export class ListSubscriptionPlansByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}

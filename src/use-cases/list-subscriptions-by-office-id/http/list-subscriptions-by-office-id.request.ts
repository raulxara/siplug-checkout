import { IsOptional, IsString } from 'class-validator';

export class ListSubscriptionsByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}

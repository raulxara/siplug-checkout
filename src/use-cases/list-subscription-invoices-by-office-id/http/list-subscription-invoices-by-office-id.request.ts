import { IsOptional, IsString } from 'class-validator';

export class ListSubscriptionInvoicesByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}

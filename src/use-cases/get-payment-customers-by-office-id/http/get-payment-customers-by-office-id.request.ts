import { IsOptional, IsString } from 'class-validator';

export class GetPaymentCustomersByOfficeIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;
}

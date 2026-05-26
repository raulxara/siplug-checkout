import { IsOptional, IsString } from 'class-validator';

export class GetPaymentCustomerByUniqueIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  paymentCustomerId!: string;
}
import { IsOptional, IsString } from 'class-validator';

export class ListPaymentSplitsByPaymentTransactionIdRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  paymentTransactionId!: string;
}

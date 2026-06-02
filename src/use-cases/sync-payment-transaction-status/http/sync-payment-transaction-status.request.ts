import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncPaymentTransactionStatusRequest {
  @IsString()
  @IsNotEmpty()
  paymentTransactionId!: string;

  @IsBoolean()
  @IsOptional()
  force?: boolean;
}

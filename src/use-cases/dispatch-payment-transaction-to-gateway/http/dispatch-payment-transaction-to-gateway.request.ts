import { IsOptional, IsString } from 'class-validator';

export class DispatchPaymentTransactionToGatewayRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  paymentTransactionId!: string;
}

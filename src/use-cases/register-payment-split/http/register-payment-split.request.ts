import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterPaymentSplitRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  splitRuleId!: string;

  @IsOptional()
  @IsString()
  checkoutSessionId?: string;

  @IsString()
  paymentTransactionId!: string;

  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @IsOptional()
  @IsString()
  subscriptionInvoiceId?: string;

  @IsString()
  gatewayProvider!: string;

  @IsNumber()
  grossAmount!: number;

  @IsOptional()
  @IsNumber()
  gatewayFeeAmount?: number;

  @IsOptional()
  @IsNumber()
  netAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}

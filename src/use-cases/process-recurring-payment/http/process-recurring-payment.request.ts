import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ProcessRecurringPaymentRequest {
  @IsString()
  @IsNotEmpty()
  checkoutSessionId!: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsString()
  @IsOptional()
  gatewayProvider?: string;

  @IsString()
  @IsOptional()
  gatewaySlug?: string;

  @IsString()
  @IsOptional()
  gatewayId?: string;

  @IsString()
  @IsOptional()
  apiCredentialId?: string;

  @IsObject()
  @IsOptional()
  payer?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  paymentData?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;
}

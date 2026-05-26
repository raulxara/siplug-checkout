import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class ProcessPaymentRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  checkoutSessionId!: string;

  @IsString()
  paymentMethod!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  installmentAmount?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  interestAmount?: number | null;

  @IsOptional()
  @IsString()
  interestType?: string | null;

  @IsOptional()
  @IsString()
  idempotencyKey?: string | null;

  @IsOptional()
  @IsString()
  externalReference?: string | null;

  @IsOptional()
  @IsObject()
  payer?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  paymentData?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;
}

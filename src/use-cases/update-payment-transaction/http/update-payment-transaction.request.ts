import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentTransactionRequest {
  @IsString()
  @IsNotEmpty()
  paymentTransactionId!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  gatewayStatus?: string;

  @IsString()
  @IsOptional()
  processStatus?: string;

  @IsString()
  @IsOptional()
  processMessage?: string;

  @IsString()
  @IsOptional()
  qrCode?: string;

  @IsString()
  @IsOptional()
  qrCodeBase64?: string;

  @IsString()
  @IsOptional()
  boletoUrl?: string;

  @IsString()
  @IsOptional()
  checkoutUrl?: string;

  @IsString()
  @IsOptional()
  paidAt?: string;

  @IsString()
  @IsOptional()
  authorizedAt?: string;

  @IsString()
  @IsOptional()
  canceledAt?: string;

  @IsString()
  @IsOptional()
  failedAt?: string;

  @IsString()
  @IsOptional()
  refundedAt?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;
}

import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePaymentSplitLifecycleRecipientRequest {
  @IsOptional()
  @IsString()
  paymentSplitRecipientId?: string;

  @IsOptional()
  @IsString()
  splitRecipientId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  gatewayRecipientId?: string;

  @IsOptional()
  @IsString()
  gatewayTransferId?: string;

  @IsOptional()
  @IsObject()
  providerPayload?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  providerResponse?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  gatewayResponse?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;
}

export class UpdatePaymentSplitLifecycleRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  paymentSplitId!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  gatewaySplitId?: string;

  @IsOptional()
  @IsObject()
  providerPayload?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  providerResponse?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  gatewayResponse?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  recipients?: UpdatePaymentSplitLifecycleRecipientRequest[];
}

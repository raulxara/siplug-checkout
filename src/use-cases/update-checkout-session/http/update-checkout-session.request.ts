import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCheckoutSessionItemRequest {
  @IsString()
  checkoutSessionItemId!: string;

  @IsOptional()
  @IsString()
  itemRef?: string | null;

  @IsOptional()
  @IsString()
  itemType?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  unitAmount?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalAmount?: number | null;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string | null;
}

export class UpdateCheckoutSessionRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  checkoutSessionId!: string;

  @IsOptional()
  @IsString()
  officeId?: string | null;

  @IsOptional()
  @IsString()
  clientId?: string | null;

  @IsOptional()
  @IsString()
  paymentCustomerId?: string | null;

  @IsOptional()
  @IsString()
  gatewayId?: string | null;

  @IsOptional()
  @IsString()
  apiCredentialId?: string | null;

  @IsOptional()
  @IsString()
  code?: string | null;

  @IsOptional()
  @IsString()
  externalReference?: string | null;

  @IsOptional()
  @IsString()
  idempotencyKey?: string | null;

  @IsOptional()
  @IsString()
  paymentType?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  amount?: number | null;

  @IsOptional()
  @IsString()
  currency?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  successUrl?: string | null;

  @IsOptional()
  @IsString()
  cancelUrl?: string | null;

  @IsOptional()
  @IsString()
  expiresAt?: string | null;

  @IsOptional()
  @IsArray()
  items?: UpdateCheckoutSessionItemRequest[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @IsString()
  source?: string;
}

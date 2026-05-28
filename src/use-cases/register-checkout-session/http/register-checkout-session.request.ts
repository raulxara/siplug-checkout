import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RegisterCheckoutSessionItemRequest {
  @IsOptional()
  @IsString()
  itemRef?: string | null;

  @IsOptional()
  @IsString()
  itemType?: string | null;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsInt()
  @Min(1)
  unitAmount!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalAmount?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string;
}

export class RegisterCheckoutSessionRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  officeId!: string;

  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  paymentCustomerId?: string | null;

  @IsOptional()
  @IsString()
  gatewayId!: string | null;

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

  @IsString()
  paymentType!: string;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

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

  @IsArray()
  items!: RegisterCheckoutSessionItemRequest[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @IsOptional()
  @IsString()
  status?: string;
}

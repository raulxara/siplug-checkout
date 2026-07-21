import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentCustomerRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  paymentCustomerId!: string;

  @IsOptional()
  @IsString()
  officeId?: string | null;

  @IsOptional()
  @IsString()
  clientId?: string | null;

  @IsOptional()
  @IsString()
  profileId?: string | null;

  @IsOptional()
  @IsString()
  externalReference?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  email?: string | null;

  @IsOptional()
  @IsString()
  documentType?: string | null;

  @IsOptional()
  @IsString()
  documentValue?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsObject()
  billingAddress?: Record<string, unknown> | null;

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
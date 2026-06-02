import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RegisterSubscriptionRequest {
  @IsString()
  @IsNotEmpty()
  officeId!: string;

  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  subscriptionPlanId!: string;

  @IsString()
  @IsNotEmpty()
  paymentCustomerId!: string;

  @IsString()
  @IsOptional()
  gatewayId?: string;

  @IsString()
  @IsOptional()
  apiCredentialId?: string;

  @IsString()
  @IsOptional()
  externalReference?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  nextBillingAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  status?: string;
}
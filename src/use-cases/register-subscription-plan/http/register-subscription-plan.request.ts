import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RegisterSubscriptionPlanRequest {
  @IsString()
  @IsNotEmpty()
  officeId!: string;

  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsOptional()
  gatewayId?: string;

  @IsString()
  @IsOptional()
  apiCredentialId?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  billingInterval!: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  billingIntervalCount?: number;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  trialDays?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxBillingCycles?: number;

  @IsArray()
  @IsOptional()
  paymentMethods?: string[];

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

import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CalculatePaymentSplitRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  splitRuleId!: string;

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
}

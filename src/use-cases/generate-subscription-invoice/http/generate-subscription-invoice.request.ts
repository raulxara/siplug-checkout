import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateSubscriptionInvoiceRequest {
  @IsString()
  @IsNotEmpty()
  subscriptionId!: string;

  @IsString()
  @IsOptional()
  scheduledAt?: string;

  @IsString()
  @IsOptional()
  dueAt?: string;

  @IsBoolean()
  @IsOptional()
  force?: boolean;
}
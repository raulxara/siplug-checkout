import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SyncSplitRuleRecipientRequestItem {
  @IsString()
  splitRecipientId!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  percentage?: number;

  @IsOptional()
  @IsNumber()
  fixedAmount?: number;

  @IsOptional()
  @IsBoolean()
  liableForGatewayFee?: boolean;

  @IsOptional()
  @IsBoolean()
  liableForRefund?: boolean;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  status?: string;
}

export class SyncSplitRuleRecipientsRequest {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  splitRuleId!: string;

  @IsArray()
  recipients!: SyncSplitRuleRecipientRequestItem[];
}

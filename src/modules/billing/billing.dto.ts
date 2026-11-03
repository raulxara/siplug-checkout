import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
export class BillingListDto {
  @IsOptional() @IsDateString() start?: string;
  @IsOptional() @IsDateString() end?: string;
  @IsOptional() @IsString() @MaxLength(100) gateway?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100000) page = 1;
  @IsOptional() @IsString() @MaxLength(100) q = '';
  @IsOptional()
  @IsIn([
    'all',
    'overdue',
    'open',
    'paid',
    'partial',
    'canceled',
    'refunded',
    'partial_refund',
    'draft',
  ])
  status = 'all';
  @IsOptional() @IsIn(['all', 'overdue', 'upcoming']) timing = 'all';
  @IsOptional() @IsIn(['all', 'manual', 'one_time', 'recurring']) origin =
    'all';
}
export class BillingIdentityDto {
  @IsUUID() id!: string;
  @IsIn(['session', 'invoice', 'payment']) kind!: string;
}
export class BillingCreateDto {
  @IsUUID() requestKey!: string;
  @IsUUID() customerId!: string;
  @IsString() @MaxLength(255) description!: string;
  @IsInt() @Min(1) @Max(999999999) amount!: number;
  @IsDateString() dueAt!: string;
}
export class BillingActionDto extends BillingIdentityDto {
  @IsIn(['issue', 'receive', 'cancel', 'refresh']) action!: string;
  @IsUUID() requestKey!: string;
  @IsOptional() @IsInt() @Min(1) @Max(999999999) amount?: number;
  @IsOptional() @IsString() @MaxLength(500) reason?: string;
  @IsOptional()
  @IsIn(['pix', 'cash', 'bank_transfer', 'other'])
  method?: string;
  @IsOptional() @IsDateString() receivedAt?: string;
}

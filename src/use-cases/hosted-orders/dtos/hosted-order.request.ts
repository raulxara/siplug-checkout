import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
export class HostedOrderItem {
  @IsOptional() @IsIn(['one_time', 'recurring']) paymentType?:
    | 'one_time'
    | 'recurring';
  @IsUUID() itemRef!: string;
  @IsString() @MaxLength(255) name!: string;
  @IsInt() @Min(1) @Max(10) quantity!: number;
  @IsInt() @Min(1) @Max(999999999) unitAmount!: number;
  @IsInt() @Min(1) @Max(999999999) totalAmount!: number;
}
export class HostedOrderIdentity {
  @IsUUID() orderId!: string;
}
export class HostedOrderAnalytics {
  @IsUUID() siteId!: string;
  @IsUUID() sessionKey!: string;
  @IsUUID() visitorKey!: string;
  @IsUUID() cartId!: string;
}
export class HostedOrderRequest extends HostedOrderIdentity {
  @IsOptional() @ValidateNested() @Type(() => HostedOrderAnalytics) analytics?: HostedOrderAnalytics;
  @IsInt() @Min(1) @Max(999999999) amount!: number;
  @IsIn(['one_time', 'recurring', 'mixed']) paymentType!:
    | 'one_time'
    | 'recurring'
    | 'mixed';
  @IsOptional() @IsInt() @Min(0) @Max(999999999) recurringDiscount?: number;
  @IsIn(['month', 'year']) interval!: string;
  @IsInt() @Min(1) @Max(12) intervalCount!: number;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => HostedOrderItem)
  items!: HostedOrderItem[];
  @IsOptional() @IsIn(['first_payment', 'all_payments']) couponRecurrence?:
    | 'first_payment'
    | 'all_payments'
    | null;
  @IsOptional() @IsUUID() cuponId?: string | null;
  @IsOptional() @IsInt() @Min(0) @Max(999999999) discount?: number;
  @IsObject() payer!: Record<string, unknown>;
}

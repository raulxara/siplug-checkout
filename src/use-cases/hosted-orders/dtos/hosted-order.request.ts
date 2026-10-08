import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
export class HostedOrderItem {
  @IsUUID() itemRef!: string;
  @IsString() @MaxLength(255) name!: string;
  @IsInt() @Min(1) @Max(10) quantity!: number;
  @IsInt() @Min(1) @Max(999999999) unitAmount!: number;
  @IsInt() @Min(1) @Max(999999999) totalAmount!: number;
}
export class HostedOrderIdentity {
  @IsUUID() orderId!: string;
}
export class HostedOrderRequest extends HostedOrderIdentity {
  @IsInt() @Min(1) @Max(999999999) amount!: number;
  @IsIn(['one_time', 'recurring']) paymentType!: 'one_time' | 'recurring';
  @IsIn(['month', 'year']) interval!: string;
  @IsInt() @Min(1) @Max(12) intervalCount!: number;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  @Type(() => HostedOrderItem)
  items!: HostedOrderItem[];
  @IsObject() payer!: Record<string, unknown>;
}

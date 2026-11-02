import {
  IsUUID,
  IsInt,
  Min,
  Max,
  IsIn,
  IsString,
  Matches,
} from 'class-validator';
export class OrderRefundListDto {
  @IsUUID() orderId!: string;
}
export class OrderRefundDto extends OrderRefundListDto {
  @IsUUID() requestId!: string;
  @IsUUID() paymentId!: string;
  @IsInt() @Min(1) @Max(999999999) amount!: number;
}

export class CancelOrderSubscriptionDto extends OrderRefundListDto {
  @IsUUID() subscriptionId!: string;
  @IsIn(['paid_period', 'immediate']) access!: 'paid_period' | 'immediate';
}

export class ReconcileOrderRefundDto extends OrderRefundDto {
  @IsString() @Matches(/^[0-9]{1,40}$/) gatewayRefundId!: string;
}

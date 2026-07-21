import { IsNotEmpty, IsString } from 'class-validator';

export class GetPaymentTransactionByUniqueIdRequest {
  @IsString()
  @IsNotEmpty()
  paymentTransactionId!: string;
}

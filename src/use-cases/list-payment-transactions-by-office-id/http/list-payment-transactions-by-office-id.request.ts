import { IsNotEmpty, IsString } from 'class-validator';

export class ListPaymentTransactionsByOfficeIdRequest {
  @IsString()
  @IsNotEmpty()
  officeId!: string;
}

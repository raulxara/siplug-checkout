import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { PAYMENT_CUSTOMERS_REPOSITORY } from '../../tokens/payment-customers.tokens';
import { GetAllPaymentCustomersDtoIn } from './dtos/get-all-payment-customers.dto-in';
import { GetAllPaymentCustomersDtoOut } from './dtos/get-all-payment-customers.dto-out';

@Injectable()
export class GetAllPaymentCustomersService {
  constructor(
    @Inject(PAYMENT_CUSTOMERS_REPOSITORY)
    private readonly repository: IPaymentCustomersRepository,
  ) {}

  async exec(
    dtoIn: GetAllPaymentCustomersDtoIn,
  ): Promise<GetAllPaymentCustomersDtoOut> {
    dtoIn;

    try {
      const rows = await this.repository.getAll();

      return new GetAllPaymentCustomersDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all payment customers';

      throw new Error(message);
    }
  }
}
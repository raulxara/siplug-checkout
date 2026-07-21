import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { PAYMENT_CUSTOMERS_REPOSITORY } from '../../tokens/payment-customers.tokens';
import { FindPaymentCustomerByUniqueIdDtoIn } from './dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdDtoOut } from './dtos/find-payment-customer-by-unique-id.dto-out';

@Injectable()
export class FindPaymentCustomerByUniqueIdService {
  constructor(
    @Inject(PAYMENT_CUSTOMERS_REPOSITORY)
    private readonly repository: IPaymentCustomersRepository,
  ) {}

  async exec(
    dtoIn: FindPaymentCustomerByUniqueIdDtoIn,
  ): Promise<FindPaymentCustomerByUniqueIdDtoOut> {
    try {
      const paymentCustomer = await this.repository.findByUniqueId(dtoIn._id);

      if (!paymentCustomer) {
        throw new Error('payment customer not found');
      }

      return new FindPaymentCustomerByUniqueIdDtoOut(paymentCustomer);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find payment customer by unique id';

      throw new Error(message);
    }
  }
}
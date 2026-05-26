import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentCustomersRepository } from '../../entities/payment-customers-repository.interface';
import { PAYMENT_CUSTOMERS_REPOSITORY } from '../../tokens/payment-customers.tokens';
import { GetAllPaymentCustomersByOfficeIdDtoIn } from './dtos/get-all-payment-customers-by-office-id.dto-in';
import { GetAllPaymentCustomersByOfficeIdDtoOut } from './dtos/get-all-payment-customers-by-office-id.dto-out';

@Injectable()
export class GetAllPaymentCustomersByOfficeIdService {
  constructor(
    @Inject(PAYMENT_CUSTOMERS_REPOSITORY)
    private readonly repository: IPaymentCustomersRepository,
  ) {}

  async exec(
    dtoIn: GetAllPaymentCustomersByOfficeIdDtoIn,
  ): Promise<GetAllPaymentCustomersByOfficeIdDtoOut> {
    try {
      const rows = await this.repository.getAllByOfficeId(dtoIn.officeId);

      return new GetAllPaymentCustomersByOfficeIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all payment customers by office id';

      throw new Error(message);
    }
  }
}
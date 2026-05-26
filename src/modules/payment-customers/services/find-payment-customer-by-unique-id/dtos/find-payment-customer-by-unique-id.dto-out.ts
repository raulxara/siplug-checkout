import type { PaymentCustomerRow } from '../../../entities/payment-customers-repository.interface';

export class FindPaymentCustomerByUniqueIdDtoOut {
  constructor(public readonly paymentCustomer: PaymentCustomerRow) {}
}
import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';

export class GetPaymentCustomerByUniqueIdDtoOut {
  constructor(public readonly paymentCustomer: PaymentCustomerRow) {}
}
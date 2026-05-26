import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';

export class UpdatePaymentCustomerDtoOut {
  constructor(public readonly paymentCustomer: PaymentCustomerRow) {}
}
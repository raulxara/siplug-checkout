import type { PaymentCustomerRow } from '../../../entities/payment-customers-repository.interface';

export class UpdatePaymentCustomerDtoOut {
  constructor(public readonly paymentCustomer: PaymentCustomerRow) {}
}
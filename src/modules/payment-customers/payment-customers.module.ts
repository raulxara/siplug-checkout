import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PaymentCustomersRepository } from './repositories/payment-customers.repository';
import { CreatePaymentCustomerService } from './services/create-payment-customer/create-payment-customer.service';
import { FindPaymentCustomerByUniqueIdService } from './services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';
import { GetAllPaymentCustomersByOfficeIdService } from './services/get-all-payment-customers-by-office-id/get-all-payment-customers-by-office-id.service';
import { GetAllPaymentCustomersService } from './services/get-all-payment-customers/get-all-payment-customers.service';
import { UpdatePaymentCustomerService } from './services/update-payment-customer/update-payment-customer.service';
import { PAYMENT_CUSTOMERS_REPOSITORY } from './tokens/payment-customers.tokens';

@Module({
  providers: [
    {
      provide: PAYMENT_CUSTOMERS_REPOSITORY,
      useClass: PaymentCustomersRepository,
    },
    BuildChangesHistoryService,
    CreatePaymentCustomerService,
    UpdatePaymentCustomerService,
    FindPaymentCustomerByUniqueIdService,
    GetAllPaymentCustomersService,
    GetAllPaymentCustomersByOfficeIdService,
  ],
  exports: [
    PAYMENT_CUSTOMERS_REPOSITORY,
    CreatePaymentCustomerService,
    UpdatePaymentCustomerService,
    FindPaymentCustomerByUniqueIdService,
    GetAllPaymentCustomersService,
    GetAllPaymentCustomersByOfficeIdService,
  ],
})
export class PaymentCustomersModule {}
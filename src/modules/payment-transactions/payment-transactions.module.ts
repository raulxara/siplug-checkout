import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PaymentTransactionsRepository } from './repositories/payment-transactions.repository';
import { CreatePaymentTransactionService } from './services/create-payment-transaction/create-payment-transaction.service';
import { FindPaymentTransactionByUniqueIdService } from './services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { GetAllPaymentTransactionsByCheckoutSessionIdService } from './services/get-all-payment-transactions-by-checkout-session-id/get-all-payment-transactions-by-checkout-session-id.service';
import { GetAllPaymentTransactionsByOfficeIdService } from './services/get-all-payment-transactions-by-office-id/get-all-payment-transactions-by-office-id.service';
import { UpdatePaymentTransactionService } from './services/update-payment-transaction/update-payment-transaction.service';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from './tokens/payment-transactions.tokens';

@Module({
  providers: [
    {
      provide: PAYMENT_TRANSACTIONS_REPOSITORY,
      useClass: PaymentTransactionsRepository,
    },
    BuildChangesHistoryService,
    CreatePaymentTransactionService,
    UpdatePaymentTransactionService,
    FindPaymentTransactionByUniqueIdService,
    GetAllPaymentTransactionsByOfficeIdService,
    GetAllPaymentTransactionsByCheckoutSessionIdService,
  ],
  exports: [
    PAYMENT_TRANSACTIONS_REPOSITORY,
    CreatePaymentTransactionService,
    UpdatePaymentTransactionService,
    FindPaymentTransactionByUniqueIdService,
    GetAllPaymentTransactionsByOfficeIdService,
    GetAllPaymentTransactionsByCheckoutSessionIdService,
  ],
})
export class PaymentTransactionsModule {}

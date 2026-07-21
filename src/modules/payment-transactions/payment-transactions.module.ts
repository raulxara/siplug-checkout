import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PaymentTransactionsRepository } from './repositories/payment-transactions.repository';
import { CreatePaymentTransactionService } from './services/create-payment-transaction/create-payment-transaction.service';
import { FindPaymentTransactionByGatewayTransactionIdService } from './services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdService } from './services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { GetAllPaymentTransactionsByCheckoutSessionIdService } from './services/get-all-payment-transactions-by-checkout-session-id/get-all-payment-transactions-by-checkout-session-id.service';
import { GetAllPaymentTransactionsByOfficeIdService } from './services/get-all-payment-transactions-by-office-id/get-all-payment-transactions-by-office-id.service';
import { UpdatePaymentTransactionService } from './services/update-payment-transaction/update-payment-transaction.service';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from './tokens/payment-transactions.tokens';
import { GetAllPaymentTransactionsService } from './services/get-all-payment-transactions/get-all-payment-transactions.service';
@Module({
  providers: [
    {
      provide: PAYMENT_TRANSACTIONS_REPOSITORY,
      useClass: PaymentTransactionsRepository,
    },
    BuildChangesHistoryService,
    CreatePaymentTransactionService,
    UpdatePaymentTransactionService,
    FindPaymentTransactionByGatewayTransactionIdService,
    FindPaymentTransactionByUniqueIdService,
    GetAllPaymentTransactionsByOfficeIdService,
    GetAllPaymentTransactionsByCheckoutSessionIdService,
    GetAllPaymentTransactionsService,
  ],
  exports: [
    PAYMENT_TRANSACTIONS_REPOSITORY,
    CreatePaymentTransactionService,
    UpdatePaymentTransactionService,
    FindPaymentTransactionByGatewayTransactionIdService,
    FindPaymentTransactionByUniqueIdService,
    GetAllPaymentTransactionsByOfficeIdService,
    GetAllPaymentTransactionsByCheckoutSessionIdService,
    GetAllPaymentTransactionsService,
  ],
})
export class PaymentTransactionsModule {}

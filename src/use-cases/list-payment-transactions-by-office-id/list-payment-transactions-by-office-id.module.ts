import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListPaymentTransactionsByOfficeIdController } from './list-payment-transactions-by-office-id.controller';
import { ListPaymentTransactionsByOfficeIdUseCase } from './list-payment-transactions-by-office-id.use-case';

@Module({
  imports: [PaymentTransactionsModule, SecurityModule, UseCaseSupportModule],
  controllers: [ListPaymentTransactionsByOfficeIdController],
  providers: [ListPaymentTransactionsByOfficeIdUseCase],
  exports: [ListPaymentTransactionsByOfficeIdUseCase],
})
export class ListPaymentTransactionsByOfficeIdModule {}

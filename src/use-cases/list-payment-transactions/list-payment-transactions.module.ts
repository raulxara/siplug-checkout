import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListPaymentTransactionsController } from './list-payment-transactions.controller';
import { ListPaymentTransactionsUseCase } from './list-payment-transactions.use-case';

@Module({
  imports: [PaymentTransactionsModule, SecurityModule, UseCaseSupportModule],
  controllers: [ListPaymentTransactionsController],
  providers: [ListPaymentTransactionsUseCase],
  exports: [ListPaymentTransactionsUseCase],
})
export class ListPaymentTransactionsModule {}

import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UpdatePaymentTransactionController } from './update-payment-transaction.controller';
import { UpdatePaymentTransactionUseCase } from './update-payment-transaction.use-case';

@Module({
  imports: [PaymentTransactionsModule, SecurityModule, UseCaseSupportModule],
  controllers: [UpdatePaymentTransactionController],
  providers: [UpdatePaymentTransactionUseCase],
  exports: [UpdatePaymentTransactionUseCase],
})
export class UpdatePaymentTransactionModule {}

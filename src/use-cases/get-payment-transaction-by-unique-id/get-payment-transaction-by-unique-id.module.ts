import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { GetPaymentTransactionByUniqueIdController } from './get-payment-transaction-by-unique-id.controller';
import { GetPaymentTransactionByUniqueIdUseCase } from './get-payment-transaction-by-unique-id.use-case';

@Module({
  imports: [PaymentTransactionsModule, SecurityModule, UseCaseSupportModule],
  controllers: [GetPaymentTransactionByUniqueIdController],
  providers: [GetPaymentTransactionByUniqueIdUseCase],
  exports: [GetPaymentTransactionByUniqueIdUseCase],
})
export class GetPaymentTransactionByUniqueIdModule {}

import { Module } from '@nestjs/common';

import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListPaymentSplitsByPaymentTransactionIdController } from './list-payment-splits-by-payment-transaction-id.controller';
import { ListPaymentSplitsByPaymentTransactionIdUseCase } from './list-payment-splits-by-payment-transaction-id.use-case';

@Module({
  imports: [SecurityModule, PaymentSplitsModule, PaymentSplitRecipientsModule],
  controllers: [ListPaymentSplitsByPaymentTransactionIdController],
  providers: [ListPaymentSplitsByPaymentTransactionIdUseCase],
  exports: [ListPaymentSplitsByPaymentTransactionIdUseCase],
})
export class ListPaymentSplitsByPaymentTransactionIdModule {}

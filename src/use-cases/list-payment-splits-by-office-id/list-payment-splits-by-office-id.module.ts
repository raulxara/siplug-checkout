import { Module } from '@nestjs/common';

import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { SecurityModule } from '../../modules/security/security.module';
import { ListPaymentSplitsByOfficeIdController } from './list-payment-splits-by-office-id.controller';
import { ListPaymentSplitsByOfficeIdUseCase } from './list-payment-splits-by-office-id.use-case';

@Module({
  imports: [SecurityModule, PaymentSplitsModule, PaymentSplitRecipientsModule],
  controllers: [ListPaymentSplitsByOfficeIdController],
  providers: [ListPaymentSplitsByOfficeIdUseCase],
  exports: [ListPaymentSplitsByOfficeIdUseCase],
})
export class ListPaymentSplitsByOfficeIdModule {}

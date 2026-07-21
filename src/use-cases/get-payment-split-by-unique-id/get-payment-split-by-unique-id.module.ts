import { Module } from '@nestjs/common';

import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { SecurityModule } from '../../modules/security/security.module';
import { GetPaymentSplitByUniqueIdController } from './get-payment-split-by-unique-id.controller';
import { GetPaymentSplitByUniqueIdUseCase } from './get-payment-split-by-unique-id.use-case';

@Module({
  imports: [SecurityModule, PaymentSplitsModule, PaymentSplitRecipientsModule],
  controllers: [GetPaymentSplitByUniqueIdController],
  providers: [GetPaymentSplitByUniqueIdUseCase],
  exports: [GetPaymentSplitByUniqueIdUseCase],
})
export class GetPaymentSplitByUniqueIdModule {}

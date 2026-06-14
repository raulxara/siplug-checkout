import { Module } from '@nestjs/common';

import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { SecurityModule } from '../../modules/security/security.module';
import { UpdatePaymentSplitLifecycleController } from './update-payment-split-lifecycle.controller';
import { UpdatePaymentSplitLifecycleUseCase } from './update-payment-split-lifecycle.use-case';

@Module({
  imports: [SecurityModule, PaymentSplitsModule, PaymentSplitRecipientsModule],
  controllers: [UpdatePaymentSplitLifecycleController],
  providers: [UpdatePaymentSplitLifecycleUseCase],
  exports: [UpdatePaymentSplitLifecycleUseCase],
})
export class UpdatePaymentSplitLifecycleModule {}

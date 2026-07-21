import { Module } from '@nestjs/common';

import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { SecurityModule } from '../../modules/security/security.module';
import { SplitCalculationsModule } from '../../modules/split-calculations/split-calculations.module';
import { RegisterPaymentSplitController } from './register-payment-split.controller';
import { RegisterPaymentSplitUseCase } from './register-payment-split.use-case';

@Module({
  imports: [
    SecurityModule,
    SplitCalculationsModule,
    PaymentSplitsModule,
    PaymentSplitRecipientsModule,
  ],
  controllers: [RegisterPaymentSplitController],
  providers: [RegisterPaymentSplitUseCase],
  exports: [RegisterPaymentSplitUseCase],
})
export class RegisterPaymentSplitModule {}

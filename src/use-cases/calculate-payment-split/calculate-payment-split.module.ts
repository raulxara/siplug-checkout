import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitCalculationsModule } from '../../modules/split-calculations/split-calculations.module';
import { CalculatePaymentSplitController } from './calculate-payment-split.controller';
import { CalculatePaymentSplitUseCase } from './calculate-payment-split.use-case';

@Module({
  imports: [SplitCalculationsModule, SecurityModule],
  controllers: [CalculatePaymentSplitController],
  providers: [CalculatePaymentSplitUseCase],
  exports: [CalculatePaymentSplitUseCase],
})
export class CalculatePaymentSplitModule {}

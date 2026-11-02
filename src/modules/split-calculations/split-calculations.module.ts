import { Module } from '@nestjs/common';

import { SplitRuleRecipientsModule } from '../split-rule-recipients/split-rule-recipients.module';
import { SplitRulesModule } from '../split-rules/split-rules.module';
import { SplitRecipientsModule } from '../split-recipients/split-recipients.module';
import { CalculatePaymentSplitService } from './services/calculate-payment-split/calculate-payment-split.service';

@Module({
  imports: [SplitRulesModule, SplitRuleRecipientsModule, SplitRecipientsModule],
  providers: [CalculatePaymentSplitService],
  exports: [CalculatePaymentSplitService],
})
export class SplitCalculationsModule {}

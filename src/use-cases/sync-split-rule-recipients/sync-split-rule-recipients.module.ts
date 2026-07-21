import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRecipientsModule } from '../../modules/split-recipients/split-recipients.module';
import { SplitRuleRecipientsModule } from '../../modules/split-rule-recipients/split-rule-recipients.module';
import { SplitRulesModule } from '../../modules/split-rules/split-rules.module';
import { SyncSplitRuleRecipientsController } from './sync-split-rule-recipients.controller';
import { SyncSplitRuleRecipientsUseCase } from './sync-split-rule-recipients.use-case';

@Module({
  imports: [
    SecurityModule,
    SplitRulesModule,
    SplitRecipientsModule,
    SplitRuleRecipientsModule,
  ],
  controllers: [SyncSplitRuleRecipientsController],
  providers: [SyncSplitRuleRecipientsUseCase],
  exports: [SyncSplitRuleRecipientsUseCase],
})
export class SyncSplitRuleRecipientsModule {}

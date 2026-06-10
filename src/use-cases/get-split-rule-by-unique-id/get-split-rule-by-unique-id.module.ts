import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRulesModule } from '../../modules/split-rules/split-rules.module';
import { GetSplitRuleByUniqueIdController } from './get-split-rule-by-unique-id.controller';
import { GetSplitRuleByUniqueIdUseCase } from './get-split-rule-by-unique-id.use-case';

@Module({
  imports: [SplitRulesModule, SecurityModule],
  controllers: [GetSplitRuleByUniqueIdController],
  providers: [GetSplitRuleByUniqueIdUseCase],
  exports: [GetSplitRuleByUniqueIdUseCase],
})
export class GetSplitRuleByUniqueIdModule {}

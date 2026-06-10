import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRulesModule } from '../../modules/split-rules/split-rules.module';
import { UpdateSplitRuleController } from './update-split-rule.controller';
import { UpdateSplitRuleUseCase } from './update-split-rule.use-case';

@Module({
  imports: [SplitRulesModule, SecurityModule],
  controllers: [UpdateSplitRuleController],
  providers: [UpdateSplitRuleUseCase],
  exports: [UpdateSplitRuleUseCase],
})
export class UpdateSplitRuleModule {}

import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRulesModule } from '../../modules/split-rules/split-rules.module';
import { RegisterSplitRuleController } from './register-split-rule.controller';
import { RegisterSplitRuleUseCase } from './register-split-rule.use-case';

@Module({
  imports: [SplitRulesModule, SecurityModule],
  controllers: [RegisterSplitRuleController],
  providers: [RegisterSplitRuleUseCase],
  exports: [RegisterSplitRuleUseCase],
})
export class RegisterSplitRuleModule {}

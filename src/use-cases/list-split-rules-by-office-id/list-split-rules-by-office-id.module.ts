import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRulesModule } from '../../modules/split-rules/split-rules.module';
import { ListSplitRulesByOfficeIdController } from './list-split-rules-by-office-id.controller';
import { ListSplitRulesByOfficeIdUseCase } from './list-split-rules-by-office-id.use-case';

@Module({
  imports: [SplitRulesModule, SecurityModule],
  controllers: [ListSplitRulesByOfficeIdController],
  providers: [ListSplitRulesByOfficeIdUseCase],
  exports: [ListSplitRulesByOfficeIdUseCase],
})
export class ListSplitRulesByOfficeIdModule {}
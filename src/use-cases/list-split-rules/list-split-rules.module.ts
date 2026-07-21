import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRulesModule } from '../../modules/split-rules/split-rules.module';
import { ListSplitRulesController } from './list-split-rules.controller';
import { ListSplitRulesUseCase } from './list-split-rules.use-case';

@Module({
  imports: [SplitRulesModule, SecurityModule],
  controllers: [ListSplitRulesController],
  providers: [ListSplitRulesUseCase],
  exports: [ListSplitRulesUseCase],
})
export class ListSplitRulesModule {}

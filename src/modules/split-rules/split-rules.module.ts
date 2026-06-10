import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { SplitRulesRepository } from './repositories/split-rules.repository';
import { CreateSplitRuleService } from './services/create-split-rule/create-split-rule.service';
import { FindSplitRuleByUniqueIdService } from './services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { SPLIT_RULES_REPOSITORY } from './tokens/split-rules.tokens';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { GetAllSplitRulesService } from './services/get-all-split-rules/get-all-split-rules.service';
import { GetAllSplitRulesByOfficeIdService } from './services/get-all-split-rules-by-office-id/get-all-split-rules-by-office-id.service';
import { UpdateSplitRuleService } from './services/update-split-rule/update-split-rule.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SPLIT_RULES_REPOSITORY,
      useClass: SplitRulesRepository,
    },

    CreateSplitRuleService,
    FindSplitRuleByUniqueIdService,
    BuildChangesHistoryService,
    BuildChangesHistoryService,
    GetAllSplitRulesService,
    GetAllSplitRulesByOfficeIdService,
    UpdateSplitRuleService,
  ],
  exports: [
    SPLIT_RULES_REPOSITORY,

    CreateSplitRuleService,
    FindSplitRuleByUniqueIdService,
    GetAllSplitRulesService,
    GetAllSplitRulesByOfficeIdService,
    UpdateSplitRuleService,
  ],
})
export class SplitRulesModule {}

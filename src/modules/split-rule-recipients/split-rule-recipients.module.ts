import { Module } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { SplitRuleRecipientsRepository } from './repositories/split-rule-recipients.repository';
import { CreateSplitRuleRecipientService } from './services/create-split-rule-recipient/create-split-rule-recipient.service';
import { FindSplitRuleRecipientByRuleAndRecipientService } from './services/find-split-rule-recipient-by-rule-and-recipient/find-split-rule-recipient-by-rule-and-recipient.service';
import { GetAllSplitRuleRecipientsBySplitRuleIdService } from './services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service';
import { UpdateSplitRuleRecipientService } from './services/update-split-rule-recipient/update-split-rule-recipient.service';
import { SPLIT_RULE_RECIPIENTS_REPOSITORY } from './tokens/split-rule-recipients.tokens';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SPLIT_RULE_RECIPIENTS_REPOSITORY,
      useClass: SplitRuleRecipientsRepository,
    },

    BuildChangesHistoryService,

    CreateSplitRuleRecipientService,
    UpdateSplitRuleRecipientService,
    FindSplitRuleRecipientByRuleAndRecipientService,
    GetAllSplitRuleRecipientsBySplitRuleIdService,
  ],
  exports: [
    SPLIT_RULE_RECIPIENTS_REPOSITORY,

    CreateSplitRuleRecipientService,
    UpdateSplitRuleRecipientService,
    FindSplitRuleRecipientByRuleAndRecipientService,
    GetAllSplitRuleRecipientsBySplitRuleIdService,
  ],
})
export class SplitRuleRecipientsModule {}

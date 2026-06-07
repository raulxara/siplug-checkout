import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { SplitRecipientsRepository } from './repositories/split-recipients.repository';
import { CreateSplitRecipientService } from './services/create-split-recipient/create-split-recipient.service';
import { FindSplitRecipientByUniqueIdService } from './services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
import { SPLIT_RECIPIENTS_REPOSITORY } from './tokens/split-recipients.tokens';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { GetAllSplitRecipientsService } from './services/get-all-split-recipients/get-all-split-recipients.service';
import { GetAllSplitRecipientsByOfficeIdService } from './services/get-all-split-recipients-by-office-id/get-all-split-recipients-by-office-id.service';
import { UpdateSplitRecipientService } from './services/update-split-recipient/update-split-recipient.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SPLIT_RECIPIENTS_REPOSITORY,
      useClass: SplitRecipientsRepository,
    },

    CreateSplitRecipientService,
    FindSplitRecipientByUniqueIdService,
    BuildChangesHistoryService,
    GetAllSplitRecipientsService,
    GetAllSplitRecipientsByOfficeIdService,
    UpdateSplitRecipientService,
  ],
  exports: [
    SPLIT_RECIPIENTS_REPOSITORY,

    CreateSplitRecipientService,
    FindSplitRecipientByUniqueIdService,
    GetAllSplitRecipientsService,
    GetAllSplitRecipientsByOfficeIdService,
    UpdateSplitRecipientService,
  ],
})
export class SplitRecipientsModule {}

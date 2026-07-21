import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRecipientsModule } from '../../modules/split-recipients/split-recipients.module';
import { ListSplitRecipientsByOfficeIdController } from './list-split-recipients-by-office-id.controller';
import { ListSplitRecipientsByOfficeIdUseCase } from './list-split-recipients-by-office-id.use-case';

@Module({
  imports: [SplitRecipientsModule, SecurityModule],
  controllers: [ListSplitRecipientsByOfficeIdController],
  providers: [ListSplitRecipientsByOfficeIdUseCase],
  exports: [ListSplitRecipientsByOfficeIdUseCase],
})
export class ListSplitRecipientsByOfficeIdModule {}
import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRecipientsModule } from '../../modules/split-recipients/split-recipients.module';
import { UpdateSplitRecipientController } from './update-split-recipient.controller';
import { UpdateSplitRecipientUseCase } from './update-split-recipient.use-case';

@Module({
  imports: [SplitRecipientsModule, SecurityModule],
  controllers: [UpdateSplitRecipientController],
  providers: [UpdateSplitRecipientUseCase],
  exports: [UpdateSplitRecipientUseCase],
})
export class UpdateSplitRecipientModule {}
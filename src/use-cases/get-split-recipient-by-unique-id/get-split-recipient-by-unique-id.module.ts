import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRecipientsModule } from '../../modules/split-recipients/split-recipients.module';
import { GetSplitRecipientByUniqueIdController } from './get-split-recipient-by-unique-id.controller';
import { GetSplitRecipientByUniqueIdUseCase } from './get-split-recipient-by-unique-id.use-case';

@Module({
  imports: [SplitRecipientsModule, SecurityModule],
  controllers: [GetSplitRecipientByUniqueIdController],
  providers: [GetSplitRecipientByUniqueIdUseCase],
  exports: [GetSplitRecipientByUniqueIdUseCase],
})
export class GetSplitRecipientByUniqueIdModule {}

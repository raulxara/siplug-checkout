import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRecipientsModule } from '../../modules/split-recipients/split-recipients.module';
import { RegisterSplitRecipientController } from './register-split-recipient.controller';
import { RegisterSplitRecipientUseCase } from './register-split-recipient.use-case';

@Module({
  imports: [SplitRecipientsModule, SecurityModule],
  controllers: [RegisterSplitRecipientController],
  providers: [RegisterSplitRecipientUseCase],
  exports: [RegisterSplitRecipientUseCase],
})
export class RegisterSplitRecipientModule {}

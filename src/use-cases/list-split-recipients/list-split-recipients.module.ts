import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SplitRecipientsModule } from '../../modules/split-recipients/split-recipients.module';
import { ListSplitRecipientsController } from './list-split-recipients.controller';
import { ListSplitRecipientsUseCase } from './list-split-recipients.use-case';

@Module({
  imports: [SplitRecipientsModule, SecurityModule],
  controllers: [ListSplitRecipientsController],
  providers: [ListSplitRecipientsUseCase],
  exports: [ListSplitRecipientsUseCase],
})
export class ListSplitRecipientsModule {}

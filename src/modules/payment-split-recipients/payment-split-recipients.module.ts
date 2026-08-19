import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';

import { SplitRecipientsModule } from '../split-recipients/split-recipients.module';

import { PaymentSplitRecipientsRepository } from './repositories/payment-split-recipients.repository';
import { PAYMENT_SPLIT_RECIPIENTS_REPOSITORY } from './tokens/payment-split-recipients.tokens';

import { CreatePaymentSplitRecipientService } from './services/create-payment-split-recipient/create-payment-split-recipient.service';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from './services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { UpdatePaymentSplitRecipientStatusService } from './services/update-payment-split-recipient-status/update-payment-split-recipient-status.service';
import { UpdatePaymentSplitRecipientService } from './services/update-payment-split-recipient/update-payment-split-recipient.service';

@Module({
  imports: [PrismaModule, SplitRecipientsModule],
  providers: [
    {
      provide: PAYMENT_SPLIT_RECIPIENTS_REPOSITORY,
      useClass: PaymentSplitRecipientsRepository,
    },

    CreatePaymentSplitRecipientService,
    GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    BuildChangesHistoryService,
    UpdatePaymentSplitRecipientStatusService,
    UpdatePaymentSplitRecipientService,
  ],
  exports: [
    PAYMENT_SPLIT_RECIPIENTS_REPOSITORY,

    CreatePaymentSplitRecipientService,
    GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    UpdatePaymentSplitRecipientStatusService,
    UpdatePaymentSplitRecipientService,
  ],
})
export class PaymentSplitRecipientsModule {}

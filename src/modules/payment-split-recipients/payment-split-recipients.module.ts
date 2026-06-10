import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { PaymentSplitRecipientsRepository } from './repositories/payment-split-recipients.repository';
import { CreatePaymentSplitRecipientService } from './services/create-payment-split-recipient/create-payment-split-recipient.service';
import { PAYMENT_SPLIT_RECIPIENTS_REPOSITORY } from './tokens/payment-split-recipients.tokens';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: PAYMENT_SPLIT_RECIPIENTS_REPOSITORY,
      useClass: PaymentSplitRecipientsRepository,
    },

    CreatePaymentSplitRecipientService,
  ],
  exports: [
    PAYMENT_SPLIT_RECIPIENTS_REPOSITORY,

    CreatePaymentSplitRecipientService,
  ],
})
export class PaymentSplitRecipientsModule {}

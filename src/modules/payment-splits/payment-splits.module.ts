import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { PaymentSplitsRepository } from './repositories/payment-splits.repository';
import { CreatePaymentSplitService } from './services/create-payment-split/create-payment-split.service';
import { FindPaymentSplitByUniqueIdService } from './services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { PAYMENT_SPLITS_REPOSITORY } from './tokens/payment-splits.tokens';
import { GetAllPaymentSplitsByPaymentTransactionIdService } from './services/get-all-payment-splits-by-payment-transaction-id/get-all-payment-splits-by-payment-transaction-id.service';
import { GetAllPaymentSplitsByOfficeIdService } from './services/get-all-payment-splits-by-office-id/get-all-payment-splits-by-office-id.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: PAYMENT_SPLITS_REPOSITORY,
      useClass: PaymentSplitsRepository,
    },

    CreatePaymentSplitService,
    FindPaymentSplitByUniqueIdService,
    GetAllPaymentSplitsByPaymentTransactionIdService,
    GetAllPaymentSplitsByOfficeIdService,
  ],
  exports: [
    PAYMENT_SPLITS_REPOSITORY,

    CreatePaymentSplitService,
    FindPaymentSplitByUniqueIdService,
    GetAllPaymentSplitsByPaymentTransactionIdService,
    GetAllPaymentSplitsByOfficeIdService,
  ],
})
export class PaymentSplitsModule {}

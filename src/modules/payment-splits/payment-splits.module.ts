import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { PaymentSplitsRepository } from './repositories/payment-splits.repository';
import { CreatePaymentSplitService } from './services/create-payment-split/create-payment-split.service';
import { FindPaymentSplitByUniqueIdService } from './services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { PAYMENT_SPLITS_REPOSITORY } from './tokens/payment-splits.tokens';
import { GetAllPaymentSplitsByPaymentTransactionIdService } from './services/get-all-payment-splits-by-payment-transaction-id/get-all-payment-splits-by-payment-transaction-id.service';
import { GetAllPaymentSplitsByOfficeIdService } from './services/get-all-payment-splits-by-office-id/get-all-payment-splits-by-office-id.service';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { UpdatePaymentSplitStatusService } from './services/update-payment-split-status/update-payment-split-status.service';
import { ResolvePaymentSplitDispatchEligibilityService } from './services/resolve-payment-split-dispatch-eligibility/resolve-payment-split-dispatch-eligibility.service';
import { ReservePaymentSplitDispatchService } from './services/reserve-payment-split-dispatch/reserve-payment-split-dispatch.service';
import { UpdatePaymentSplitService } from './services/update-payment-split/update-payment-split.service';

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
    UpdatePaymentSplitStatusService,
    BuildChangesHistoryService,
    ResolvePaymentSplitDispatchEligibilityService,
    ReservePaymentSplitDispatchService,
    UpdatePaymentSplitService,
  ],
  exports: [
    PAYMENT_SPLITS_REPOSITORY,

    CreatePaymentSplitService,
    FindPaymentSplitByUniqueIdService,
    GetAllPaymentSplitsByPaymentTransactionIdService,
    GetAllPaymentSplitsByOfficeIdService,
    UpdatePaymentSplitStatusService,
    ResolvePaymentSplitDispatchEligibilityService,
    ReservePaymentSplitDispatchService,
    UpdatePaymentSplitService,
  ],
})
export class PaymentSplitsModule {}

import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { CheckoutSessionItemsRepository } from './repositories/checkout-session-items.repository';
import { CheckoutSessionsRepository } from './repositories/checkout-sessions.repository';
import { CreateCheckoutSessionItemService } from './services/create-checkout-session-item/create-checkout-session-item.service';
import { CreateCheckoutSessionService } from './services/create-checkout-session/create-checkout-session.service';
import { FindCheckoutSessionByUniqueIdService } from './services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from './services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';
import { GetAllCheckoutSessionsByOfficeIdService } from './services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service';
import { UpdateCheckoutSessionItemService } from './services/update-checkout-session-item/update-checkout-session-item.service';
import { UpdateCheckoutSessionService } from './services/update-checkout-session/update-checkout-session.service';
import {
  CHECKOUT_SESSION_ITEMS_REPOSITORY,
  CHECKOUT_SESSIONS_REPOSITORY,
} from './tokens/checkout-sessions.tokens';

@Module({
  providers: [
    {
      provide: CHECKOUT_SESSIONS_REPOSITORY,
      useClass: CheckoutSessionsRepository,
    },
    {
      provide: CHECKOUT_SESSION_ITEMS_REPOSITORY,
      useClass: CheckoutSessionItemsRepository,
    },
    BuildChangesHistoryService,

    CreateCheckoutSessionService,
    UpdateCheckoutSessionService,
    FindCheckoutSessionByUniqueIdService,
    GetAllCheckoutSessionsByOfficeIdService,

    CreateCheckoutSessionItemService,
    UpdateCheckoutSessionItemService,
    GetAllCheckoutSessionItemsByCheckoutSessionIdService,
  ],
  exports: [
    CHECKOUT_SESSIONS_REPOSITORY,
    CHECKOUT_SESSION_ITEMS_REPOSITORY,

    CreateCheckoutSessionService,
    UpdateCheckoutSessionService,
    FindCheckoutSessionByUniqueIdService,
    GetAllCheckoutSessionsByOfficeIdService,

    CreateCheckoutSessionItemService,
    UpdateCheckoutSessionItemService,
    GetAllCheckoutSessionItemsByCheckoutSessionIdService,
  ],
})
export class CheckoutSessionsModule {}
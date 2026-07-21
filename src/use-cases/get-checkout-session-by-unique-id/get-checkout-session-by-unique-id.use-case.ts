import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindCheckoutSessionByUniqueIdDtoIn as FindCheckoutSessionByUniqueIdServiceDtoIn } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in';
import { FindCheckoutSessionByUniqueIdService } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetCheckoutSessionByUniqueIdDtoIn } from './dtos/get-checkout-session-by-unique-id.dto-in';
import { GetCheckoutSessionByUniqueIdDtoOut } from './dtos/get-checkout-session-by-unique-id.dto-out';

@Injectable()
export class GetCheckoutSessionByUniqueIdUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findCheckoutSessionByUniqueIdService: FindCheckoutSessionByUniqueIdService,
    private readonly getAllCheckoutSessionItemsByCheckoutSessionIdService: GetAllCheckoutSessionItemsByCheckoutSessionIdService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetCheckoutSessionByUniqueIdDtoIn,
  ): Promise<GetCheckoutSessionByUniqueIdDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'getCheckoutSessionByUniqueId',
          requiredEntity: 'checkout_sessions',
        }),
      );

      const checkoutSessionDtoOut =
        await this.findCheckoutSessionByUniqueIdService.exec(
          new FindCheckoutSessionByUniqueIdServiceDtoIn(
            dtoIn.checkoutSessionId,
          ),
        );

      const checkoutSession = checkoutSessionDtoOut.checkoutSession;

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(checkoutSession.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const itemsDtoOut =
        await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(
          new GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(
            checkoutSession._id,
          ),
        );

      return new GetCheckoutSessionByUniqueIdDtoOut(
        checkoutSession,
        itemsDtoOut.items,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetCheckoutSessionByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            checkoutSessionId: dtoIn.checkoutSessionId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on get checkout session by unique id use case';

      throw new Error(message);
    }
  }
}
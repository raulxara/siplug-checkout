import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import type { CheckoutSessionRow } from '../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
import { GetAllCheckoutSessionsByOfficeIdDtoIn as GetAllCheckoutSessionsByOfficeIdServiceDtoIn } from '../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/dtos/get-all-checkout-sessions-by-office-id.dto-in';
import { GetAllCheckoutSessionsByOfficeIdService } from '../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListCheckoutSessionsByOfficeIdDtoIn } from './dtos/list-checkout-sessions-by-office-id.dto-in';
import { ListCheckoutSessionsByOfficeIdDtoOut } from './dtos/list-checkout-sessions-by-office-id.dto-out';

@Injectable()
export class ListCheckoutSessionsByOfficeIdUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly getAllCheckoutSessionsByOfficeIdService: GetAllCheckoutSessionsByOfficeIdService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListCheckoutSessionsByOfficeIdDtoIn,
  ): Promise<ListCheckoutSessionsByOfficeIdDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'listCheckoutSessionsByOfficeId',
          requiredEntity: 'checkout_sessions',
        }),
      );

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const checkoutSessionsDtoOut =
        await this.getAllCheckoutSessionsByOfficeIdService.exec(
          new GetAllCheckoutSessionsByOfficeIdServiceDtoIn(dtoIn.officeId),
        );

      const normalizedDtoOut = checkoutSessionsDtoOut as unknown as {
        items?: CheckoutSessionRow[];
        checkoutSessions?: CheckoutSessionRow[];
        total?: number;
      };

      const checkoutSessions =
        normalizedDtoOut.items ?? normalizedDtoOut.checkoutSessions ?? [];

      return new ListCheckoutSessionsByOfficeIdDtoOut(
        checkoutSessions,
        normalizedDtoOut.total ?? checkoutSessions.length,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListCheckoutSessionsByOfficeIdUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list checkout sessions by office id use case';

      throw new Error(message);
    }
  }
}

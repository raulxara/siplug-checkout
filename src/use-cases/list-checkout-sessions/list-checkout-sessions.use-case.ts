import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';
import { GetAllCheckoutSessionsByOfficeIdDtoIn } from '../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/dtos/get-all-checkout-sessions-by-office-id.dto-in';
import { GetAllCheckoutSessionsByOfficeIdService } from '../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service';
import type { CheckoutSessionRow } from '../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListCheckoutSessionsDtoIn } from './dtos/list-checkout-sessions.dto-in';
import {
  ListCheckoutSessionsDtoOut,
  ListCheckoutSessionsItem,
} from './dtos/list-checkout-sessions.dto-out';

@Injectable()
export class ListCheckoutSessionsUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly getAllCheckoutSessionsByOfficeIdService: GetAllCheckoutSessionsByOfficeIdService,
    private readonly getAllCheckoutSessionItemsByCheckoutSessionIdService: GetAllCheckoutSessionItemsByCheckoutSessionIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListCheckoutSessionsDtoIn,
  ): Promise<ListCheckoutSessionsDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'listCheckoutSessions',
          requiredEntity: 'checkout_sessions',
        }),
      );

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const sessionsDtoOut =
        await this.getAllCheckoutSessionsByOfficeIdService.exec(
          new GetAllCheckoutSessionsByOfficeIdDtoIn(dtoIn.officeId),
        );

      const filteredSessions = sessionsDtoOut.items.filter((session) => {
        if (dtoIn.status !== null && session.status !== dtoIn.status) {
          return false;
        }

        if (!this.matchesSearch(dtoIn.search, session)) {
          return false;
        }

        return true;
      });

      const total = filteredSessions.length;
      const totalPages = Math.ceil(total / dtoIn.perPage);
      const start = (dtoIn.page - 1) * dtoIn.perPage;
      const paginatedSessions = filteredSessions.slice(
        start,
        start + dtoIn.perPage,
      );

      const items: ListCheckoutSessionsItem[] = [];

      for (const checkoutSession of paginatedSessions) {
        const sessionItemsDtoOut =
          await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(
            new GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(
              checkoutSession._id,
            ),
          );

        items.push({
          checkoutSession,
          items: sessionItemsDtoOut.items,
        });
      }

      return new ListCheckoutSessionsDtoOut(
        dtoIn.officeId,
        items,
        total,
        dtoIn.page,
        dtoIn.perPage,
        totalPages,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListCheckoutSessionsUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            status: dtoIn.status,
            search: dtoIn.search,
            page: dtoIn.page,
            perPage: dtoIn.perPage,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list checkout sessions use case';

      throw new Error(message);
    }
  }

  private matchesSearch(
    search: string | null,
    checkoutSession: CheckoutSessionRow,
  ): boolean {
    if (search === null || search.trim() === '') {
      return true;
    }

    const normalizedSearch = search.toLowerCase().trim();

    const searchable = [
      checkoutSession._id,
      checkoutSession.code ?? '',
      checkoutSession.externalReference ?? '',
      checkoutSession.idempotencyKey ?? '',
      checkoutSession.paymentType,
      checkoutSession.currency,
      checkoutSession.description ?? '',
      checkoutSession.status,
      checkoutSession.paymentCustomerId ?? '',
      checkoutSession.gatewayId,
      checkoutSession.apiCredentialId ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedSearch);
  }
}
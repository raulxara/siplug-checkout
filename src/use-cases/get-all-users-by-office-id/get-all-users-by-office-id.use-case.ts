import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import type { ClientRow } from '../../modules/clients/entities/clients-repository.interface';
import { GetAllClientsByOfficeIdDtoIn } from '../../modules/clients/services/get-all-clients-by-office-id/dtos/get-all-clients-by-office-id.dto-in';
import { GetAllClientsByOfficeIdService } from '../../modules/clients/services/get-all-clients-by-office-id/get-all-clients-by-office-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { GetAllPositionsByUniqueIdsDtoIn } from '../../modules/positions/services/get-all-positions-by-unique-ids/dtos/get-all-positions-by-unique-ids.dto-in';
import { GetAllPositionsByUniqueIdsService } from '../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';

import { FindProfileByUniqueIdDtoIn } from '../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import type { UserCustomerRow } from '../../modules/user-customers/entities/user-customers-repository.interface';
import { GetAllUserCustomersByClientIdsDtoIn } from '../../modules/user-customers/services/get-all-user-customers-by-client-ids/dtos/get-all-user-customers-by-client-ids.dto-in';
import { GetAllUserCustomersByClientIdsService } from '../../modules/user-customers/services/get-all-user-customers-by-client-ids/get-all-user-customers-by-client-ids.service';

import { GetAllUserPositionsByUserCustomerIdDtoIn } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in';
import { GetAllUserPositionsByUserCustomerIdService } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';

import { GetAllUsersByOfficeIdDtoIn } from './dtos/get-all-users-by-office-id.dto-in';
import {
  GetAllUsersByOfficeIdDtoOut,
  GetAllUsersByOfficeIdItem,
  SafeOfficeUserCustomerRow,
} from './dtos/get-all-users-by-office-id.dto-out';

@Injectable()
export class GetAllUsersByOfficeIdUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly getAllClientsByOfficeIdService: GetAllClientsByOfficeIdService,
    private readonly getAllUserCustomersByClientIdsService: GetAllUserCustomersByClientIdsService,
    private readonly findProfileByUniqueIdService: FindProfileByUniqueIdService,
    private readonly getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService,
    private readonly getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetAllUsersByOfficeIdDtoIn,
  ): Promise<GetAllUsersByOfficeIdDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'getAllUsersByOfficeId',
          requiredEntity: 'user_customers',
        }),
      );

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const clientsDtoOut = await this.getAllClientsByOfficeIdService.exec(
        new GetAllClientsByOfficeIdDtoIn(dtoIn.officeId),
      );

      if (clientsDtoOut.items.length === 0) {
        return new GetAllUsersByOfficeIdDtoOut(
          dtoIn.officeId,
          [],
          0,
          dtoIn.page,
          dtoIn.perPage,
          0,
        );
      }

      const clientsById = new Map<string, ClientRow>(
        clientsDtoOut.items.map((client) => [client._id, client]),
      );

      const clientIds = clientsDtoOut.items.map((client) => client._id);

      const userCustomersDtoOut =
        await this.getAllUserCustomersByClientIdsService.exec(
          new GetAllUserCustomersByClientIdsDtoIn(clientIds),
        );

      const items: GetAllUsersByOfficeIdItem[] = [];

      for (const userCustomer of userCustomersDtoOut.items) {
        if (dtoIn.status !== null && userCustomer.status !== dtoIn.status) {
          continue;
        }

        const client = clientsById.get(userCustomer.clientId);

        if (!client) {
          continue;
        }

        const profileDtoOut = await this.findProfileByUniqueIdService.exec(
          new FindProfileByUniqueIdDtoIn(userCustomer.profileId),
        );

        const profile = profileDtoOut.profile;

        if (!this.matchesSearch(dtoIn.search, profile, client)) {
          continue;
        }

        const userPositionsDtoOut =
          await this.getAllUserPositionsByUserCustomerIdService.exec(
            new GetAllUserPositionsByUserCustomerIdDtoIn(userCustomer._id),
          );

        const positionIds = [
          ...new Set(userPositionsDtoOut.items.map((item) => item.positionId)),
        ];

        const positions =
          positionIds.length > 0
            ? (
                await this.getAllPositionsByUniqueIdsService.exec(
                  new GetAllPositionsByUniqueIdsDtoIn(positionIds),
                )
              ).items
            : [];

        items.push({
          profile,
          client,
          userCustomer: this.hideUserCustomerToken(userCustomer),
          userPositions: userPositionsDtoOut.items,
          positions,
        });
      }

      const total = items.length;
      const totalPages = Math.ceil(total / dtoIn.perPage);
      const start = (dtoIn.page - 1) * dtoIn.perPage;
      const paginatedItems = items.slice(start, start + dtoIn.perPage);

      return new GetAllUsersByOfficeIdDtoOut(
        dtoIn.officeId,
        paginatedItems,
        total,
        dtoIn.page,
        dtoIn.perPage,
        totalPages,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetAllUsersByOfficeIdUseCase',
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
          : 'error on get all users by office id use case';

      throw new Error(message);
    }
  }

  private matchesSearch(
    search: string | null,
    profile: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
    },
    client: {
      username: string;
      userType: string;
    },
  ): boolean {
    if (search === null || search.trim() === '') {
      return true;
    }

    const normalizedSearch = search.toLowerCase().trim();

    const searchable = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phone ?? '',
      client.username,
      client.userType,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedSearch);
  }

  private hideUserCustomerToken(
    userCustomer: UserCustomerRow,
  ): SafeOfficeUserCustomerRow {
    return {
      id: userCustomer.id,
      _id: userCustomer._id,
      clientId: userCustomer.clientId,
      profileId: userCustomer.profileId,
      twoFaRequired: userCustomer.twoFaRequired,
      twoFaActive: userCustomer.twoFaActive,
      config: userCustomer.config,
      changesHistory: userCustomer.changesHistory,
      status: userCustomer.status,
      createdAt: userCustomer.createdAt,
      updatedAt: userCustomer.updatedAt,
    };
  }
}
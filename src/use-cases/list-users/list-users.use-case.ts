import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { GetAllPositionsByUniqueIdsDtoIn } from '../../modules/positions/services/get-all-positions-by-unique-ids/dtos/get-all-positions-by-unique-ids.dto-in';
import { GetAllPositionsByUniqueIdsService } from '../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';

import { FindProfileByUniqueIdDtoIn } from '../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import type { UserCustomerRow } from '../../modules/user-customers/entities/user-customers-repository.interface';
import { GetAllUserCustomersDtoIn } from '../../modules/user-customers/services/get-all-user-customers/dtos/get-all-user-customers.dto-in';
import { GetAllUserCustomersService } from '../../modules/user-customers/services/get-all-user-customers/get-all-user-customers.service';

import { GetAllUserPositionsByUserCustomerIdDtoIn } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in';
import { GetAllUserPositionsByUserCustomerIdService } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';

import { ListUsersDtoIn } from './dtos/list-users.dto-in';
import {
  ListUsersDtoOut,
  ListUsersItem,
  SafeListUserCustomerRow,
} from './dtos/list-users.dto-out';

@Injectable()
export class ListUsersUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly getAllUserCustomersService: GetAllUserCustomersService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findProfileByUniqueIdService: FindProfileByUniqueIdService,
    private readonly getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService,
    private readonly getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: ListUsersDtoIn): Promise<ListUsersDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'listUsers',
          requiredEntity: 'user_customers',
        }),
      );

      if (dtoIn.officeId !== null) {
        const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
          new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
        );

        if (officeDtoOut.office.status !== 'active') {
          throw new Error('office is not active');
        }
      }

      const userCustomersDtoOut = await this.getAllUserCustomersService.exec(
        new GetAllUserCustomersDtoIn(),
      );

      const items: ListUsersItem[] = [];

      for (const userCustomer of userCustomersDtoOut.items) {
        if (dtoIn.status !== null && userCustomer.status !== dtoIn.status) {
          continue;
        }

        const clientDtoOut = await this.findClientByUniqueIdService.exec(
          new FindClientByUniqueIdDtoIn(userCustomer.clientId),
        );

        const client = clientDtoOut.client;

        if (dtoIn.officeId !== null && client.officeId !== dtoIn.officeId) {
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

      return new ListUsersDtoOut(
        paginatedItems,
        total,
        dtoIn.page,
        dtoIn.perPage,
        totalPages,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListUsersUseCase',
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
        error instanceof Error ? error.message : 'error on list users use case';

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
  ): SafeListUserCustomerRow {
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
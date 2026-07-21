import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { GetAllPositionsByUniqueIdsDtoIn } from '../../modules/positions/services/get-all-positions-by-unique-ids/dtos/get-all-positions-by-unique-ids.dto-in';
import { GetAllPositionsByUniqueIdsService } from '../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';

import { FindProfileByUniqueIdDtoIn } from '../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetAllUserAccessCodesByUserCustomerIdDtoIn } from '../../modules/user-access-codes/services/get-all-user-access-codes-by-user-customer-id/dtos/get-all-user-access-codes-by-user-customer-id.dto-in';
import { GetAllUserAccessCodesByUserCustomerIdService } from '../../modules/user-access-codes/services/get-all-user-access-codes-by-user-customer-id/get-all-user-access-codes-by-user-customer-id.service';

import { FindUserCustomerByUniqueIdDtoIn } from '../../modules/user-customers/services/find-user-customer-by-unique-id/dtos/find-user-customer-by-unique-id.dto-in';
import { FindUserCustomerByUniqueIdService } from '../../modules/user-customers/services/find-user-customer-by-unique-id/find-user-customer-by-unique-id.service';

import { GetAllUserPositionsByUserCustomerIdDtoIn } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in';
import { GetAllUserPositionsByUserCustomerIdService } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';

import { GetUserDtoIn } from './dtos/get-user.dto-in';
import {
  GetUserDtoOut,
  SafeUserAccessCodeRow,
  SafeUserCustomerRow,
} from './dtos/get-user.dto-out';

@Injectable()
export class GetUserUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findUserCustomerByUniqueIdService: FindUserCustomerByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findProfileByUniqueIdService: FindProfileByUniqueIdService,
    private readonly getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService,
    private readonly getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService,
    private readonly getAllUserAccessCodesByUserCustomerIdService: GetAllUserAccessCodesByUserCustomerIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: GetUserDtoIn): Promise<GetUserDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'getUser',
          requiredEntity: 'user_customers',
        }),
      );

      const userCustomerDtoOut =
        await this.findUserCustomerByUniqueIdService.exec(
          new FindUserCustomerByUniqueIdDtoIn(dtoIn.userCustomerId),
        );

      const userCustomer = userCustomerDtoOut.userCustomer;

      const clientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(userCustomer.clientId),
      );

      const profileDtoOut = await this.findProfileByUniqueIdService.exec(
        new FindProfileByUniqueIdDtoIn(userCustomer.profileId),
      );

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

      const accessCodesDtoOut =
        await this.getAllUserAccessCodesByUserCustomerIdService.exec(
          new GetAllUserAccessCodesByUserCustomerIdDtoIn(userCustomer._id),
        );

      return new GetUserDtoOut(
        profileDtoOut.profile,
        clientDtoOut.client,
        this.hideUserCustomerToken(userCustomer),
        userPositionsDtoOut.items,
        positions,
        accessCodesDtoOut.items.map((item) => this.hideAccessCode(item)),
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetUserUseCase',
          error,
          appFile: __filename,
          context: {
            userCustomerId: dtoIn.userCustomerId,
          },
        }),
      );

      const message =
        error instanceof Error ? error.message : 'error on get user use case';

      throw new Error(message);
    }
  }

  private hideUserCustomerToken(userCustomer: {
    id: number;
    _id: string;
    clientId: string;
    profileId: string;
    token: string;
    twoFaRequired: boolean;
    twoFaActive: boolean;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
  }): SafeUserCustomerRow {
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

  private hideAccessCode(accessCode: {
    id: number;
    _id: string;
    userCustomerId: string;
    channel: string;
    destination: string;
    code: string;
    expiresAt: string | null;
    usedAt: string | null;
    sentAt: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
  }): SafeUserAccessCodeRow {
    return {
      id: accessCode.id,
      _id: accessCode._id,
      userCustomerId: accessCode.userCustomerId,
      channel: accessCode.channel,
      destination: accessCode.destination,
      expiresAt: accessCode.expiresAt,
      usedAt: accessCode.usedAt,
      sentAt: accessCode.sentAt,
      config: accessCode.config,
      changesHistory: accessCode.changesHistory,
      status: accessCode.status,
      createdAt: accessCode.createdAt,
      updatedAt: accessCode.updatedAt,
      codeHidden: true,
    };
  }
}
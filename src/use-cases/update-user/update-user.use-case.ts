import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import type { UserPositionRow } from '../../modules/user-positions/entities/user-positions-repository.interface';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { UpdateClientDtoIn } from '../../modules/clients/services/update-client/dtos/update-client.dto-in';
import { UpdateClientService } from '../../modules/clients/services/update-client/update-client.service';
import { ValidateClientUsernameUniquenessDtoIn } from '../../modules/clients/services/validate-client-username-uniqueness/dtos/validate-client-username-uniqueness.dto-in';
import { ValidateClientUsernameUniquenessService } from '../../modules/clients/services/validate-client-username-uniqueness/validate-client-username-uniqueness.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPositionBySlugDtoIn } from '../../modules/positions/services/find-position-by-slug/dtos/find-position-by-slug.dto-in';
import { FindPositionBySlugService } from '../../modules/positions/services/find-position-by-slug/find-position-by-slug.service';

import { FindProfileByUniqueIdDtoIn } from '../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';
import { UpdateProfileDtoIn } from '../../modules/profiles/services/update-profile/dtos/update-profile.dto-in';
import { UpdateProfileService } from '../../modules/profiles/services/update-profile/update-profile.service';
import { ValidateProfileEmailUniquenessDtoIn } from '../../modules/profiles/services/validate-profile-email-uniqueness/dtos/validate-profile-email-uniqueness.dto-in';
import { ValidateProfileEmailUniquenessService } from '../../modules/profiles/services/validate-profile-email-uniqueness/validate-profile-email-uniqueness.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { FindUserCustomerByUniqueIdDtoIn } from '../../modules/user-customers/services/find-user-customer-by-unique-id/dtos/find-user-customer-by-unique-id.dto-in';
import { FindUserCustomerByUniqueIdService } from '../../modules/user-customers/services/find-user-customer-by-unique-id/find-user-customer-by-unique-id.service';
import { UpdateUserCustomerDtoIn } from '../../modules/user-customers/services/update-user-customer/dtos/update-user-customer.dto-in';
import { UpdateUserCustomerService } from '../../modules/user-customers/services/update-user-customer/update-user-customer.service';

import { CreateUserPositionDtoIn } from '../../modules/user-positions/services/create-user-position/dtos/create-user-position.dto-in';
import { CreateUserPositionService } from '../../modules/user-positions/services/create-user-position/create-user-position.service';
import { GetAllUserPositionsByUserCustomerIdDtoIn } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in';
import { GetAllUserPositionsByUserCustomerIdService } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';
import { UpdateUserPositionDtoIn } from '../../modules/user-positions/services/update-user-position/dtos/update-user-position.dto-in';
import { UpdateUserPositionService } from '../../modules/user-positions/services/update-user-position/update-user-position.service';

import { UpdateUserDtoIn } from './dtos/update-user.dto-in';
import { UpdateUserDtoOut } from './dtos/update-user.dto-out';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findUserCustomerByUniqueIdService: FindUserCustomerByUniqueIdService,
    private readonly updateUserCustomerService: UpdateUserCustomerService,

    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly updateClientService: UpdateClientService,
    private readonly validateClientUsernameUniquenessService: ValidateClientUsernameUniquenessService,

    private readonly findProfileByUniqueIdService: FindProfileByUniqueIdService,
    private readonly updateProfileService: UpdateProfileService,
    private readonly validateProfileEmailUniquenessService: ValidateProfileEmailUniquenessService,

    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findPositionBySlugService: FindPositionBySlugService,

    private readonly getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService,
    private readonly createUserPositionService: CreateUserPositionService,
    private readonly updateUserPositionService: UpdateUserPositionService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: UpdateUserDtoIn): Promise<UpdateUserDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'updateUser',
          requiredEntity: 'user_customers',
        }),
      );

      const currentUserCustomerDtoOut =
        await this.findUserCustomerByUniqueIdService.exec(
          new FindUserCustomerByUniqueIdDtoIn(dtoIn.userCustomerId),
        );

      const currentUserCustomer = currentUserCustomerDtoOut.userCustomer;

      const currentClientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(currentUserCustomer.clientId),
      );

      const currentClient = currentClientDtoOut.client;

      const currentProfileDtoOut = await this.findProfileByUniqueIdService.exec(
        new FindProfileByUniqueIdDtoIn(currentUserCustomer.profileId),
      );

      const currentProfile = currentProfileDtoOut.profile;

      const effectiveOfficeId = dtoIn.officeId ?? currentClient.officeId;

      if (!effectiveOfficeId || effectiveOfficeId.trim() === '') {
        throw new Error('officeId is required');
      }

      if (dtoIn.officeId !== null) {
        const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
          new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
        );

        if (officeDtoOut.office.status !== 'active') {
          throw new Error('office is not active');
        }
      }

      if (dtoIn.email !== null && dtoIn.email !== currentProfile.email) {
        await this.validateProfileEmailUniquenessService.exec(
          new ValidateProfileEmailUniquenessDtoIn(dtoIn.email),
        );
      }

      if (
        dtoIn.username !== null &&
        dtoIn.username !== currentClient.username
      ) {
        await this.validateClientUsernameUniquenessService.exec(
          new ValidateClientUsernameUniquenessDtoIn(dtoIn.username),
        );
      }

      const updatedProfileDtoOut = await this.updateProfileService.exec(
        new UpdateProfileDtoIn({
          _id: currentProfile._id,
          firstName: dtoIn.firstName,
          lastName: dtoIn.lastName,
          email: dtoIn.email,
          phone: dtoIn.phone,
          documentType: dtoIn.documentType,
          documentValue: dtoIn.documentValue,
          config: dtoIn.profileConfig,
          status: dtoIn.status,
          source: dtoIn.source,
        }),
      );

      const updatedClientDtoOut = await this.updateClientService.exec(
        new UpdateClientDtoIn({
          _id: currentClient._id,
          officeId: dtoIn.officeId,
          userType: dtoIn.userType,
          username: dtoIn.username,
          password: dtoIn.password,
          config: dtoIn.clientConfig,
          status: dtoIn.status,
          source: dtoIn.source,
        }),
      );

      const updatedUserCustomerDtoOut =
        await this.updateUserCustomerService.exec(
          new UpdateUserCustomerDtoIn({
            _id: currentUserCustomer._id,
            twoFaRequired: dtoIn.twoFaRequired,
            twoFaActive: dtoIn.twoFaActive,
            config: dtoIn.userCustomerConfig,
            status: dtoIn.status,
            source: dtoIn.source,
          }),
        );

      const positionSyncResult = await this.updateUserPositionIfNeeded({
        userCustomerId: currentUserCustomer._id,
        officeId: effectiveOfficeId,
        positionSlug: dtoIn.positionSlug,
        source: dtoIn.source,
      });

      return new UpdateUserDtoOut(
        updatedProfileDtoOut.profile,
        updatedClientDtoOut.client,
        updatedUserCustomerDtoOut.userCustomer,
        positionSyncResult.userPositions,
        positionSyncResult.created,
        positionSyncResult.activated,
        positionSyncResult.inactivated,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdateUserUseCase',
          error,
          appFile: __filename,
          context: {
            userCustomerId: dtoIn.userCustomerId,
            officeId: dtoIn.officeId,
            positionSlug: dtoIn.positionSlug,
            firstName: dtoIn.firstName,
            lastName: dtoIn.lastName,
            email: dtoIn.email,
            phone: dtoIn.phone,
            documentType: dtoIn.documentType,
            documentValue: dtoIn.documentValue,
            username: dtoIn.username,
            userType: dtoIn.userType,
            twoFaRequired: dtoIn.twoFaRequired,
            twoFaActive: dtoIn.twoFaActive,
            status: dtoIn.status,
            source: dtoIn.source,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update user use case';

      throw new Error(message);
    }
  }

  private async updateUserPositionIfNeeded(params: {
    userCustomerId: string;
    officeId: string;
    positionSlug: string | null;
    source: string;
  }): Promise<{
    userPositions: UserPositionRow[];
    created: UserPositionRow[];
    activated: UserPositionRow[];
    inactivated: UserPositionRow[];
  }> {
    const currentUserPositionsDtoOut =
      await this.getAllUserPositionsByUserCustomerIdService.exec(
        new GetAllUserPositionsByUserCustomerIdDtoIn(params.userCustomerId),
      );

    if (params.positionSlug === null) {
      return {
        userPositions: currentUserPositionsDtoOut.items,
        created: [],
        activated: [],
        inactivated: [],
      };
    }

    const positionDtoOut = await this.findPositionBySlugService.exec(
      new FindPositionBySlugDtoIn({
        officeId: params.officeId,
        slug: params.positionSlug,
      }),
    );

    if (positionDtoOut.position.status !== 'active') {
      throw new Error('position is not active');
    }

    const targetPositionId = positionDtoOut.position._id;

    const created: UserPositionRow[] = [];
    const activated: UserPositionRow[] = [];
    const inactivated: UserPositionRow[] = [];

    const existingTarget = currentUserPositionsDtoOut.items.find(
      (item) => item.positionId === targetPositionId,
    );

    if (!existingTarget) {
      const createdDtoOut = await this.createUserPositionService.exec(
        new CreateUserPositionDtoIn({
          userCustomerId: params.userCustomerId,
          positionId: targetPositionId,
          config: {
            source: params.source,
            positionSlug: params.positionSlug,
          },
          status: 'active',
        }),
      );

      created.push({
        id: createdDtoOut.id,
        _id: createdDtoOut._id,
        userCustomerId: createdDtoOut.userCustomerId,
        positionId: createdDtoOut.positionId,
        config: createdDtoOut.config,
        changesHistory: createdDtoOut.changesHistory,
        status: createdDtoOut.status,
        createdAt: createdDtoOut.createdAt,
        updatedAt: createdDtoOut.updatedAt,
      });
    }

    if (existingTarget && existingTarget.status !== 'active') {
      const activatedDtoOut = await this.updateUserPositionService.exec(
        new UpdateUserPositionDtoIn({
          _id: existingTarget._id,
          status: 'active',
          source: params.source,
        }),
      );

      activated.push(activatedDtoOut.userPosition);
    }

    for (const currentUserPosition of currentUserPositionsDtoOut.items) {
      const isTarget = currentUserPosition.positionId === targetPositionId;

      if (isTarget) {
        continue;
      }

      if (currentUserPosition.status !== 'active') {
        continue;
      }

      const inactivatedDtoOut = await this.updateUserPositionService.exec(
        new UpdateUserPositionDtoIn({
          _id: currentUserPosition._id,
          status: 'inactive',
          source: params.source,
        }),
      );

      inactivated.push(inactivatedDtoOut.userPosition);
    }

    const updatedUserPositionsDtoOut =
      await this.getAllUserPositionsByUserCustomerIdService.exec(
        new GetAllUserPositionsByUserCustomerIdDtoIn(params.userCustomerId),
      );

    return {
      userPositions: updatedUserPositionsDtoOut.items,
      created,
      activated,
      inactivated,
    };
  }
}
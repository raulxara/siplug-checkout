import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { CreateClientDtoIn } from '../../modules/clients/services/create-client/dtos/create-client.dto-in';
import { CreateClientService } from '../../modules/clients/services/create-client/create-client.service';
import { ValidateClientUsernameUniquenessDtoIn } from '../../modules/clients/services/validate-client-username-uniqueness/dtos/validate-client-username-uniqueness.dto-in';
import { ValidateClientUsernameUniquenessService } from '../../modules/clients/services/validate-client-username-uniqueness/validate-client-username-uniqueness.service';
import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { FindPositionBySlugDtoIn } from '../../modules/positions/services/find-position-by-slug/dtos/find-position-by-slug.dto-in';
import { FindPositionBySlugService } from '../../modules/positions/services/find-position-by-slug/find-position-by-slug.service';
import { CreateProfileDtoIn } from '../../modules/profiles/services/create-profile/dtos/create-profile.dto-in';
import { CreateProfileService } from '../../modules/profiles/services/create-profile/create-profile.service';
import { ValidateProfileEmailUniquenessDtoIn } from '../../modules/profiles/services/validate-profile-email-uniqueness/dtos/validate-profile-email-uniqueness.dto-in';
import { ValidateProfileEmailUniquenessService } from '../../modules/profiles/services/validate-profile-email-uniqueness/validate-profile-email-uniqueness.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CreateUserAccessCodeDtoIn } from '../../modules/user-access-codes/services/create-user-access-code/dtos/create-user-access-code.dto-in';
import { CreateUserAccessCodeService } from '../../modules/user-access-codes/services/create-user-access-code/create-user-access-code.service';
import { GenerateUserAccessCodeService } from '../../modules/user-access-codes/services/generate-user-access-code/generate-user-access-code.service';
import { CreateUserCustomerDtoIn } from '../../modules/user-customers/services/create-user-customer/dtos/create-user-customer.dto-in';
import { CreateUserCustomerService } from '../../modules/user-customers/services/create-user-customer/create-user-customer.service';
import { GenerateUserCustomerTokenService } from '../../modules/user-customers/services/generate-user-customer-token/generate-user-customer-token.service';
import { CreateUserPositionDtoIn } from '../../modules/user-positions/services/create-user-position/dtos/create-user-position.dto-in';
import { CreateUserPositionService } from '../../modules/user-positions/services/create-user-position/create-user-position.service';
import { RegisterUserDtoIn } from './dtos/register-user.dto-in';
import { RegisterUserDtoOut } from './dtos/register-user.dto-out';
import type { UserAccessCodeRow } from '../../modules/user-access-codes/entities/user-access-codes-repository.interface';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findPositionBySlugService: FindPositionBySlugService,
    private readonly validateProfileEmailUniquenessService: ValidateProfileEmailUniquenessService,
    private readonly validateClientUsernameUniquenessService: ValidateClientUsernameUniquenessService,
    private readonly createProfileService: CreateProfileService,
    private readonly createClientService: CreateClientService,
    private readonly generateUserCustomerTokenService: GenerateUserCustomerTokenService,
    private readonly createUserCustomerService: CreateUserCustomerService,
    private readonly createUserPositionService: CreateUserPositionService,
    private readonly generateUserAccessCodeService: GenerateUserAccessCodeService,
    private readonly createUserAccessCodeService: CreateUserAccessCodeService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: RegisterUserDtoIn): Promise<RegisterUserDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerUser',
          requiredEntity: 'user_customers',
        }),
      );

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const positionDtoOut = await this.findPositionBySlugService.exec(
        new FindPositionBySlugDtoIn({
          officeId: dtoIn.officeId,
          slug: dtoIn.positionSlug,
        }),
      );

      if (positionDtoOut.position.status !== 'active') {
        throw new Error('position is not active');
      }

      await this.validateProfileEmailUniquenessService.exec(
        new ValidateProfileEmailUniquenessDtoIn(dtoIn.email),
      );

      await this.validateClientUsernameUniquenessService.exec(
        new ValidateClientUsernameUniquenessDtoIn(dtoIn.username),
      );

      const profileDtoOut = await this.createProfileService.exec(
        new CreateProfileDtoIn({
          firstName: dtoIn.firstName,
          lastName: dtoIn.lastName,
          email: dtoIn.email,
          phone: dtoIn.phone,
          documentType: dtoIn.documentType,
          documentValue: dtoIn.documentValue,
          config: dtoIn.profileConfig,
          status: dtoIn.status,
        }),
      );

      const clientDtoOut = await this.createClientService.exec(
        new CreateClientDtoIn({
          officeId: dtoIn.officeId,
          customerId: null,
          userType: dtoIn.userType,
          username: dtoIn.username,
          password: dtoIn.password,
          config: dtoIn.clientConfig,
          status: dtoIn.status,
        }),
      );

      const userCustomerToken =
        this.generateUserCustomerTokenService.exec();

      const userCustomerDtoOut = await this.createUserCustomerService.exec(
        new CreateUserCustomerDtoIn({
          clientId: clientDtoOut._id,
          profileId: profileDtoOut._id,
          token: userCustomerToken,
          twoFaRequired: dtoIn.twoFaRequired,
          twoFaActive: false,
          config: dtoIn.userCustomerConfig,
          status: dtoIn.status,
        }),
      );

      const userPositionDtoOut = await this.createUserPositionService.exec(
        new CreateUserPositionDtoIn({
          userCustomerId: userCustomerDtoOut._id,
          positionId: positionDtoOut.position._id,
          config: {
            source: 'RegisterUserUseCase',
            positionSlug: dtoIn.positionSlug,
          },
          status: 'active',
        }),
      );

      const accessCodes: UserAccessCodeRow[] = [];

      if (dtoIn.twoFaRequired) {
        for (const channel of dtoIn.twoFaChannels) {
          const destination =
            channel === 'email' ? dtoIn.email : dtoIn.phone ?? '';

          if (destination.trim() === '') {
            throw new Error(`destination is required for channel ${channel}`);
          }

          const code = this.generateUserAccessCodeService.exec(6);

          const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000,
          )
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          const accessCodeDtoOut =
            await this.createUserAccessCodeService.exec(
              new CreateUserAccessCodeDtoIn({
                userCustomerId: userCustomerDtoOut._id,
                channel,
                destination,
                code,
                expiresAt,
                config: {
                  source: 'RegisterUserUseCase',
                  channel,
                },
                status: 'created',
              }),
            );

          accessCodes.push({
            id: accessCodeDtoOut.id,
            _id: accessCodeDtoOut._id,
            userCustomerId: accessCodeDtoOut.userCustomerId,
            channel: accessCodeDtoOut.channel,
            destination: accessCodeDtoOut.destination,
            code: accessCodeDtoOut.code,
            expiresAt: accessCodeDtoOut.expiresAt,
            usedAt: accessCodeDtoOut.usedAt,
            sentAt: accessCodeDtoOut.sentAt,
            config: accessCodeDtoOut.config,
            changesHistory: accessCodeDtoOut.changesHistory,
            status: accessCodeDtoOut.status,
            createdAt: accessCodeDtoOut.createdAt,
            updatedAt: accessCodeDtoOut.updatedAt,
          });
        }
      }

      return new RegisterUserDtoOut(
        {
          id: profileDtoOut.id,
          _id: profileDtoOut._id,
          firstName: profileDtoOut.firstName,
          lastName: profileDtoOut.lastName,
          email: profileDtoOut.email,
          phone: profileDtoOut.phone,
          documentType: profileDtoOut.documentType,
          documentValue: profileDtoOut.documentValue,
          addressStreet: profileDtoOut.addressStreet,
          addressNumber: profileDtoOut.addressNumber,
          addressComplement: profileDtoOut.addressComplement,
          addressNeighborhood: profileDtoOut.addressNeighborhood,
          addressCity: profileDtoOut.addressCity,
          addressState: profileDtoOut.addressState,
          addressCountry: profileDtoOut.addressCountry,
          config: profileDtoOut.config,
          changesHistory: profileDtoOut.changesHistory,
          status: profileDtoOut.status,
          createdAt: profileDtoOut.createdAt,
          updatedAt: profileDtoOut.updatedAt,
        },
        {
          id: clientDtoOut.id,
          _id: clientDtoOut._id,
          officeId: clientDtoOut.officeId,
          customerId: clientDtoOut.customerId,
          userType: clientDtoOut.userType,
          username: clientDtoOut.username,
          config: clientDtoOut.config,
          changesHistory: clientDtoOut.changesHistory,
          status: clientDtoOut.status,
          createdAt: clientDtoOut.createdAt,
          updatedAt: clientDtoOut.updatedAt,
        },
        {
          id: userCustomerDtoOut.id,
          _id: userCustomerDtoOut._id,
          clientId: userCustomerDtoOut.clientId,
          profileId: userCustomerDtoOut.profileId,
          token: userCustomerDtoOut.token,
          twoFaRequired: userCustomerDtoOut.twoFaRequired,
          twoFaActive: userCustomerDtoOut.twoFaActive,
          config: userCustomerDtoOut.config,
          changesHistory: userCustomerDtoOut.changesHistory,
          status: userCustomerDtoOut.status,
          createdAt: userCustomerDtoOut.createdAt,
          updatedAt: userCustomerDtoOut.updatedAt,
        },
        {
          id: userPositionDtoOut.id,
          _id: userPositionDtoOut._id,
          userCustomerId: userPositionDtoOut.userCustomerId,
          positionId: userPositionDtoOut.positionId,
          config: userPositionDtoOut.config,
          changesHistory: userPositionDtoOut.changesHistory,
          status: userPositionDtoOut.status,
          createdAt: userPositionDtoOut.createdAt,
          updatedAt: userPositionDtoOut.updatedAt,
        },
        accessCodes,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterUserUseCase',
          error,
          appFile: __filename,
          context: {
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
            twoFaChannels: dtoIn.twoFaChannels,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register user use case';

      throw new Error(message);
    }
  }
}
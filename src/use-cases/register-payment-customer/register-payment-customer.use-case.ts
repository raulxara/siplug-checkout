import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { CreatePaymentCustomerDtoIn as CreatePaymentCustomerServiceDtoIn } from '../../modules/payment-customers/services/create-payment-customer/dtos/create-payment-customer.dto-in';
import { CreatePaymentCustomerService } from '../../modules/payment-customers/services/create-payment-customer/create-payment-customer.service';

import { FindProfileByUniqueIdDtoIn } from '../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { RegisterPaymentCustomerDtoIn } from './dtos/register-payment-customer.dto-in';
import { RegisterPaymentCustomerDtoOut } from './dtos/register-payment-customer.dto-out';

@Injectable()
export class RegisterPaymentCustomerUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findProfileByUniqueIdService: FindProfileByUniqueIdService,
    private readonly createPaymentCustomerService: CreatePaymentCustomerService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: RegisterPaymentCustomerDtoIn,
  ): Promise<RegisterPaymentCustomerDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerPaymentCustomer',
          requiredEntity: 'payment_customers',
        }),
      );

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const clientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(dtoIn.clientId),
      );

      if (clientDtoOut.client.status !== 'active') {
        throw new Error('client is not active');
      }

      if (clientDtoOut.client.officeId !== dtoIn.officeId) {
        throw new Error('client does not belong to office');
      }

      if (dtoIn.profileId !== null) {
        const profileDtoOut = await this.findProfileByUniqueIdService.exec(
          new FindProfileByUniqueIdDtoIn(dtoIn.profileId),
        );

        if (profileDtoOut.profile.status !== 'active') {
          throw new Error('profile is not active');
        }
      }

      const paymentCustomerDtoOut =
        await this.createPaymentCustomerService.exec(
          new CreatePaymentCustomerServiceDtoIn({
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            profileId: dtoIn.profileId,
            externalReference: dtoIn.externalReference,
            name: dtoIn.name,
            email: dtoIn.email,
            documentType: dtoIn.documentType,
            documentValue: dtoIn.documentValue,
            phone: dtoIn.phone,
            billingAddress: dtoIn.billingAddress,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            status: dtoIn.status,
          }),
        );

      return RegisterPaymentCustomerDtoOut.fromCreatePaymentCustomerDtoOut(
        paymentCustomerDtoOut,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterPaymentCustomerUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            profileId: dtoIn.profileId,
            externalReference: dtoIn.externalReference,
            name: dtoIn.name,
            email: dtoIn.email,
            documentType: dtoIn.documentType,
            hasDocumentValue: dtoIn.documentValue !== null,
            phone: dtoIn.phone,
            hasBillingAddress: dtoIn.billingAddress !== null,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register payment customer use case';

      throw new Error(message);
    }
  }
}
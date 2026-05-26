import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPaymentCustomerByUniqueIdDtoIn } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';
import { UpdatePaymentCustomerDtoIn as UpdatePaymentCustomerServiceDtoIn } from '../../modules/payment-customers/services/update-payment-customer/dtos/update-payment-customer.dto-in';
import { UpdatePaymentCustomerService } from '../../modules/payment-customers/services/update-payment-customer/update-payment-customer.service';

import { FindProfileByUniqueIdDtoIn } from '../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { UpdatePaymentCustomerDtoIn } from './dtos/update-payment-customer.dto-in';
import { UpdatePaymentCustomerDtoOut } from './dtos/update-payment-customer.dto-out';

@Injectable()
export class UpdatePaymentCustomerUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findProfileByUniqueIdService: FindProfileByUniqueIdService,
    private readonly updatePaymentCustomerService: UpdatePaymentCustomerService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentCustomerDtoIn,
  ): Promise<UpdatePaymentCustomerDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'updatePaymentCustomer',
          requiredEntity: 'payment_customers',
        }),
      );

      const currentPaymentCustomerDtoOut =
        await this.findPaymentCustomerByUniqueIdService.exec(
          new FindPaymentCustomerByUniqueIdDtoIn(dtoIn.paymentCustomerId),
        );

      const currentPaymentCustomer =
        currentPaymentCustomerDtoOut.paymentCustomer;

      const effectiveOfficeId =
        dtoIn.officeId ?? currentPaymentCustomer.officeId;

      const effectiveClientId =
        dtoIn.clientId ?? currentPaymentCustomer.clientId;

      if (effectiveOfficeId.trim() === '') {
        throw new Error('officeId is required');
      }

      if (effectiveClientId.trim() === '') {
        throw new Error('clientId is required');
      }

      if (dtoIn.officeId !== null) {
        const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
          new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
        );

        if (officeDtoOut.office.status !== 'active') {
          throw new Error('office is not active');
        }
      }

      const clientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(effectiveClientId),
      );

      if (clientDtoOut.client.status !== 'active') {
        throw new Error('client is not active');
      }

      if (clientDtoOut.client.officeId !== effectiveOfficeId) {
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

      const updatedPaymentCustomerDtoOut =
        await this.updatePaymentCustomerService.exec(
          new UpdatePaymentCustomerServiceDtoIn({
            _id: dtoIn.paymentCustomerId,
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
            source: dtoIn.source,
          }),
        );

      return new UpdatePaymentCustomerDtoOut(
        updatedPaymentCustomerDtoOut.paymentCustomer,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdatePaymentCustomerUseCase',
          error,
          appFile: __filename,
          context: {
            paymentCustomerId: dtoIn.paymentCustomerId,
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
            source: dtoIn.source,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update payment customer use case';

      throw new Error(message);
    }
  }
}
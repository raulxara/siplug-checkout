import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { GetAllPaymentCustomersByOfficeIdDtoIn as GetAllPaymentCustomersByOfficeIdServiceDtoIn } from '../../modules/payment-customers/services/get-all-payment-customers-by-office-id/dtos/get-all-payment-customers-by-office-id.dto-in';
import { GetAllPaymentCustomersByOfficeIdService } from '../../modules/payment-customers/services/get-all-payment-customers-by-office-id/get-all-payment-customers-by-office-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetPaymentCustomersByOfficeIdDtoIn } from './dtos/get-payment-customers-by-office-id.dto-in';
import { GetPaymentCustomersByOfficeIdDtoOut } from './dtos/get-payment-customers-by-office-id.dto-out';

@Injectable()
export class GetPaymentCustomersByOfficeIdUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly getAllPaymentCustomersByOfficeIdService: GetAllPaymentCustomersByOfficeIdService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetPaymentCustomersByOfficeIdDtoIn,
  ): Promise<GetPaymentCustomersByOfficeIdDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'getPaymentCustomersByOfficeId',
          requiredEntity: 'payment_customers',
        }),
      );

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const paymentCustomersDtoOut =
        await this.getAllPaymentCustomersByOfficeIdService.exec(
          new GetAllPaymentCustomersByOfficeIdServiceDtoIn(dtoIn.officeId),
        );

      return new GetPaymentCustomersByOfficeIdDtoOut(
        paymentCustomersDtoOut.items,
        paymentCustomersDtoOut.total,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetPaymentCustomersByOfficeIdUseCase',
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
          : 'error on get payment customers by office id use case';

      throw new Error(message);
    }
  }
}

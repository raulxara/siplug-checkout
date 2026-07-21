import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPaymentCustomerByUniqueIdDtoIn as FindPaymentCustomerByUniqueIdServiceDtoIn } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetPaymentCustomerByUniqueIdDtoIn } from './dtos/get-payment-customer-by-unique-id.dto-in';
import { GetPaymentCustomerByUniqueIdDtoOut } from './dtos/get-payment-customer-by-unique-id.dto-out';

@Injectable()
export class GetPaymentCustomerByUniqueIdUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetPaymentCustomerByUniqueIdDtoIn,
  ): Promise<GetPaymentCustomerByUniqueIdDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'getPaymentCustomerByUniqueId',
          requiredEntity: 'payment_customers',
        }),
      );

      const paymentCustomerDtoOut =
        await this.findPaymentCustomerByUniqueIdService.exec(
          new FindPaymentCustomerByUniqueIdServiceDtoIn(
            dtoIn.paymentCustomerId,
          ),
        );

      const paymentCustomer = paymentCustomerDtoOut.paymentCustomer;

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(paymentCustomer.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      return new GetPaymentCustomerByUniqueIdDtoOut(paymentCustomer);
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetPaymentCustomerByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            paymentCustomerId: dtoIn.paymentCustomerId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on get payment customer by unique id use case';

      throw new Error(message);
    }
  }
}
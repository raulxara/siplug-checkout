import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetPaymentTransactionByUniqueIdDtoIn } from './dtos/get-payment-transaction-by-unique-id.dto-in';
import { GetPaymentTransactionByUniqueIdDtoOut } from './dtos/get-payment-transaction-by-unique-id.dto-out';

@Injectable()
export class GetPaymentTransactionByUniqueIdUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: GetPaymentTransactionByUniqueIdDtoIn,
  ): Promise<GetPaymentTransactionByUniqueIdDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'getPaymentTransactionByUniqueId',
          requiredEntity: 'payment_transactions',
        }),
      );

      const paymentTransactionDtoOut =
        await this.findPaymentTransactionByUniqueIdService.exec(
          new FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId),
        );

      return new GetPaymentTransactionByUniqueIdDtoOut(
        paymentTransactionDtoOut.paymentTransaction,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetPaymentTransactionByUniqueIdUseCase',
          error,
          appFile: __filename,
          context: {
            paymentTransactionId: dtoIn.paymentTransactionId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on get payment transaction by unique id use case';

      throw new Error(message);
    }
  }
}

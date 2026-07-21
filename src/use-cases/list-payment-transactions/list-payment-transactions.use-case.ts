import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPaymentTransactionsDtoIn } from '../../modules/payment-transactions/services/get-all-payment-transactions/dtos/get-all-payment-transactions.dto-in';
import { GetAllPaymentTransactionsService } from '../../modules/payment-transactions/services/get-all-payment-transactions/get-all-payment-transactions.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListPaymentTransactionsDtoIn } from './dtos/list-payment-transactions.dto-in';
import { ListPaymentTransactionsDtoOut } from './dtos/list-payment-transactions.dto-out';

@Injectable()
export class ListPaymentTransactionsUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly getAllPaymentTransactionsService: GetAllPaymentTransactionsService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListPaymentTransactionsDtoIn,
  ): Promise<ListPaymentTransactionsDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'listPaymentTransactions',
          requiredEntity: 'payment_transactions',
        }),
      );

      const paymentTransactionsDtoOut =
        await this.getAllPaymentTransactionsService.exec(
          new GetAllPaymentTransactionsDtoIn(),
        );

      return new ListPaymentTransactionsDtoOut(
        paymentTransactionsDtoOut.paymentTransactions,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListPaymentTransactionsUseCase',
          error,
          appFile: __filename,
          context: {},
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on list payment transactions use case';

      throw new Error(message);
    }
  }
}

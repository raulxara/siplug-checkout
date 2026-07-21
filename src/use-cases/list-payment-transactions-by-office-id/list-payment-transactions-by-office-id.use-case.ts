import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPaymentTransactionsByOfficeIdDtoIn } from '../../modules/payment-transactions/services/get-all-payment-transactions-by-office-id/dtos/get-all-payment-transactions-by-office-id.dto-in';
import { GetAllPaymentTransactionsByOfficeIdService } from '../../modules/payment-transactions/services/get-all-payment-transactions-by-office-id/get-all-payment-transactions-by-office-id.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListPaymentTransactionsByOfficeIdDtoIn } from './dtos/list-payment-transactions-by-office-id.dto-in';
import { ListPaymentTransactionsByOfficeIdDtoOut } from './dtos/list-payment-transactions-by-office-id.dto-out';

@Injectable()
export class ListPaymentTransactionsByOfficeIdUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly getAllPaymentTransactionsByOfficeIdService: GetAllPaymentTransactionsByOfficeIdService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ListPaymentTransactionsByOfficeIdDtoIn,
  ): Promise<ListPaymentTransactionsByOfficeIdDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'listPaymentTransactionsByOfficeId',
          requiredEntity: 'payment_transactions',
        }),
      );

      const paymentTransactionsDtoOut =
        await this.getAllPaymentTransactionsByOfficeIdService.exec(
          new GetAllPaymentTransactionsByOfficeIdDtoIn(dtoIn.officeId),
        );

      return new ListPaymentTransactionsByOfficeIdDtoOut(
        paymentTransactionsDtoOut.items,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ListPaymentTransactionsByOfficeIdUseCase',
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
          : 'error on list payment transactions by office id use case';

      throw new Error(message);
    }
  }
}

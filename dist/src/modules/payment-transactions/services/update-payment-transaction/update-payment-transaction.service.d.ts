import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { UpdatePaymentTransactionDtoIn } from './dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionDtoOut } from './dtos/update-payment-transaction.dto-out';
export declare class UpdatePaymentTransactionService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPaymentTransactionsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePaymentTransactionDtoIn): Promise<UpdatePaymentTransactionDtoOut>;
    private removeNullValues;
    private buildOldData;
}

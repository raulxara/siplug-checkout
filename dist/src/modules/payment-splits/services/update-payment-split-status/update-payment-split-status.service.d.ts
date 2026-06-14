import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { UpdatePaymentSplitStatusDtoIn } from './dtos/update-payment-split-status.dto-in';
import { UpdatePaymentSplitStatusDtoOut } from './dtos/update-payment-split-status.dto-out';
export declare class UpdatePaymentSplitStatusService {
    private readonly paymentSplitsRepository;
    private readonly buildChangesHistoryService;
    constructor(paymentSplitsRepository: IPaymentSplitsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePaymentSplitStatusDtoIn): Promise<UpdatePaymentSplitStatusDtoOut>;
    private buildNewDataForHistory;
    private validateStatus;
    private validateTransition;
    private addIfNotNull;
}

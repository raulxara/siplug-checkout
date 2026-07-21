import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { UpdatePaymentSplitDtoIn } from './dtos/update-payment-split.dto-in';
import { UpdatePaymentSplitDtoOut } from './dtos/update-payment-split.dto-out';
export declare class UpdatePaymentSplitService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPaymentSplitsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePaymentSplitDtoIn): Promise<UpdatePaymentSplitDtoOut>;
    private buildNewData;
    private buildRepositoryUpdateData;
    private buildOldData;
}

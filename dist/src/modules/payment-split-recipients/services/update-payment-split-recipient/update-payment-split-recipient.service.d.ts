import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { UpdatePaymentSplitRecipientDtoIn } from './dtos/update-payment-split-recipient.dto-in';
import { UpdatePaymentSplitRecipientDtoOut } from './dtos/update-payment-split-recipient.dto-out';
export declare class UpdatePaymentSplitRecipientService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPaymentSplitRecipientsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePaymentSplitRecipientDtoIn): Promise<UpdatePaymentSplitRecipientDtoOut>;
    private buildNewData;
    private buildRepositoryUpdateData;
    private buildOldData;
}

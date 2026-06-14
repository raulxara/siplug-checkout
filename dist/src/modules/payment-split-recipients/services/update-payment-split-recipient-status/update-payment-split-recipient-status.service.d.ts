import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { UpdatePaymentSplitRecipientStatusDtoIn } from './dtos/update-payment-split-recipient-status.dto-in';
import { UpdatePaymentSplitRecipientStatusDtoOut } from './dtos/update-payment-split-recipient-status.dto-out';
export declare class UpdatePaymentSplitRecipientStatusService {
    private readonly paymentSplitRecipientsRepository;
    private readonly buildChangesHistoryService;
    constructor(paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePaymentSplitRecipientStatusDtoIn): Promise<UpdatePaymentSplitRecipientStatusDtoOut>;
    private buildNewDataForHistory;
    private validateStatus;
    private validateTransition;
    private addIfNotNull;
}

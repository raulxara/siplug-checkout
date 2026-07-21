import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { UpdateSplitRecipientDtoIn } from './dtos/update-split-recipient.dto-in';
import { UpdateSplitRecipientDtoOut } from './dtos/update-split-recipient.dto-out';
export declare class UpdateSplitRecipientService {
    private readonly splitRecipientsRepository;
    private readonly buildChangesHistoryService;
    constructor(splitRecipientsRepository: ISplitRecipientsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateSplitRecipientDtoIn): Promise<UpdateSplitRecipientDtoOut>;
    private buildNewDataForHistory;
    private addIfNotNull;
}

import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { FindSplitRecipientByUniqueIdDtoIn } from './dtos/find-split-recipient-by-unique-id.dto-in';
import { FindSplitRecipientByUniqueIdDtoOut } from './dtos/find-split-recipient-by-unique-id.dto-out';
export declare class FindSplitRecipientByUniqueIdService {
    private readonly splitRecipientsRepository;
    constructor(splitRecipientsRepository: ISplitRecipientsRepository);
    exec(dtoIn: FindSplitRecipientByUniqueIdDtoIn): Promise<FindSplitRecipientByUniqueIdDtoOut>;
}

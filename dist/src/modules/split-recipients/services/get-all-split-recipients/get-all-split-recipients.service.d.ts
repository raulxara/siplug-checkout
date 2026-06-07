import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { GetAllSplitRecipientsDtoOut } from './dtos/get-all-split-recipients.dto-out';
export declare class GetAllSplitRecipientsService {
    private readonly splitRecipientsRepository;
    constructor(splitRecipientsRepository: ISplitRecipientsRepository);
    exec(): Promise<GetAllSplitRecipientsDtoOut>;
}

import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { GetAllSplitRecipientsByOfficeIdDtoIn } from './dtos/get-all-split-recipients-by-office-id.dto-in';
import { GetAllSplitRecipientsByOfficeIdDtoOut } from './dtos/get-all-split-recipients-by-office-id.dto-out';
export declare class GetAllSplitRecipientsByOfficeIdService {
    private readonly splitRecipientsRepository;
    constructor(splitRecipientsRepository: ISplitRecipientsRepository);
    exec(dtoIn: GetAllSplitRecipientsByOfficeIdDtoIn): Promise<GetAllSplitRecipientsByOfficeIdDtoOut>;
}

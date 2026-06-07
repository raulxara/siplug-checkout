import type { ISplitRecipientsRepository } from '../../entities/split-recipients-repository.interface';
import { CreateSplitRecipientDtoIn } from './dtos/create-split-recipient.dto-in';
import { CreateSplitRecipientDtoOut } from './dtos/create-split-recipient.dto-out';
export declare class CreateSplitRecipientService {
    private readonly splitRecipientsRepository;
    constructor(splitRecipientsRepository: ISplitRecipientsRepository);
    exec(dtoIn: CreateSplitRecipientDtoIn): Promise<CreateSplitRecipientDtoOut>;
}

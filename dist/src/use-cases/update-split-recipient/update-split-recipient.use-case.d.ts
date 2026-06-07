import { FindSplitRecipientByUniqueIdService } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
import { UpdateSplitRecipientService } from '../../modules/split-recipients/services/update-split-recipient/update-split-recipient.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateSplitRecipientDtoIn } from './dtos/update-split-recipient.dto-in';
import { UpdateSplitRecipientDtoOut } from './dtos/update-split-recipient.dto-out';
export declare class UpdateSplitRecipientUseCase {
    private readonly findSplitRecipientByUniqueIdService;
    private readonly updateSplitRecipientService;
    private readonly resolveActorAuthorizationService;
    constructor(findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService, updateSplitRecipientService: UpdateSplitRecipientService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: UpdateSplitRecipientDtoIn): Promise<UpdateSplitRecipientDtoOut>;
}

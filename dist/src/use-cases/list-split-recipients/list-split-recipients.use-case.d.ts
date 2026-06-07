import { GetAllSplitRecipientsService } from '../../modules/split-recipients/services/get-all-split-recipients/get-all-split-recipients.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSplitRecipientsDtoIn } from './dtos/list-split-recipients.dto-in';
import { ListSplitRecipientsDtoOut } from './dtos/list-split-recipients.dto-out';
export declare class ListSplitRecipientsUseCase {
    private readonly getAllSplitRecipientsService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllSplitRecipientsService: GetAllSplitRecipientsService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSplitRecipientsDtoIn): Promise<ListSplitRecipientsDtoOut>;
}

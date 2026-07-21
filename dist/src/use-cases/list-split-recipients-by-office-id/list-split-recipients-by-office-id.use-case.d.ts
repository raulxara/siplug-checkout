import { GetAllSplitRecipientsByOfficeIdService } from '../../modules/split-recipients/services/get-all-split-recipients-by-office-id/get-all-split-recipients-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSplitRecipientsByOfficeIdDtoIn } from './dtos/list-split-recipients-by-office-id.dto-in';
import { ListSplitRecipientsByOfficeIdDtoOut } from './dtos/list-split-recipients-by-office-id.dto-out';
export declare class ListSplitRecipientsByOfficeIdUseCase {
    private readonly getAllSplitRecipientsByOfficeIdService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllSplitRecipientsByOfficeIdService: GetAllSplitRecipientsByOfficeIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSplitRecipientsByOfficeIdDtoIn): Promise<ListSplitRecipientsByOfficeIdDtoOut>;
}

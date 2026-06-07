import { FindSplitRecipientByUniqueIdService } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetSplitRecipientByUniqueIdDtoIn } from './dtos/get-split-recipient-by-unique-id.dto-in';
import { GetSplitRecipientByUniqueIdDtoOut } from './dtos/get-split-recipient-by-unique-id.dto-out';
export declare class GetSplitRecipientByUniqueIdUseCase {
    private readonly findSplitRecipientByUniqueIdService;
    private readonly resolveActorAuthorizationService;
    constructor(findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: GetSplitRecipientByUniqueIdDtoIn): Promise<GetSplitRecipientByUniqueIdDtoOut>;
}

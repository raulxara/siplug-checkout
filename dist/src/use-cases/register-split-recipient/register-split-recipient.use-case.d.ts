import { CreateSplitRecipientService } from '../../modules/split-recipients/services/create-split-recipient/create-split-recipient.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterSplitRecipientDtoIn } from './dtos/register-split-recipient.dto-in';
import { RegisterSplitRecipientDtoOut } from './dtos/register-split-recipient.dto-out';
export declare class RegisterSplitRecipientUseCase {
    private readonly createSplitRecipientService;
    private readonly resolveActorAuthorizationService;
    constructor(createSplitRecipientService: CreateSplitRecipientService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: RegisterSplitRecipientDtoIn): Promise<RegisterSplitRecipientDtoOut>;
}

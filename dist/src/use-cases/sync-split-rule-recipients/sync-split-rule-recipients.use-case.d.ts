import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { FindSplitRecipientByUniqueIdService } from '../../modules/split-recipients/services/find-split-recipient-by-unique-id/find-split-recipient-by-unique-id.service';
import { FindSplitRuleByUniqueIdService } from '../../modules/split-rules/services/find-split-rule-by-unique-id/find-split-rule-by-unique-id.service';
import { CreateSplitRuleRecipientService } from '../../modules/split-rule-recipients/services/create-split-rule-recipient/create-split-rule-recipient.service';
import { FindSplitRuleRecipientByRuleAndRecipientService } from '../../modules/split-rule-recipients/services/find-split-rule-recipient-by-rule-and-recipient/find-split-rule-recipient-by-rule-and-recipient.service';
import { GetAllSplitRuleRecipientsBySplitRuleIdService } from '../../modules/split-rule-recipients/services/get-all-split-rule-recipients-by-split-rule-id/get-all-split-rule-recipients-by-split-rule-id.service';
import { UpdateSplitRuleRecipientService } from '../../modules/split-rule-recipients/services/update-split-rule-recipient/update-split-rule-recipient.service';
import { SyncSplitRuleRecipientsDtoIn } from './dtos/sync-split-rule-recipients.dto-in';
import { SyncSplitRuleRecipientsDtoOut } from './dtos/sync-split-rule-recipients.dto-out';
export declare class SyncSplitRuleRecipientsUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findSplitRuleByUniqueIdService;
    private readonly findSplitRecipientByUniqueIdService;
    private readonly findSplitRuleRecipientByRuleAndRecipientService;
    private readonly createSplitRuleRecipientService;
    private readonly updateSplitRuleRecipientService;
    private readonly getAllSplitRuleRecipientsBySplitRuleIdService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findSplitRuleByUniqueIdService: FindSplitRuleByUniqueIdService, findSplitRecipientByUniqueIdService: FindSplitRecipientByUniqueIdService, findSplitRuleRecipientByRuleAndRecipientService: FindSplitRuleRecipientByRuleAndRecipientService, createSplitRuleRecipientService: CreateSplitRuleRecipientService, updateSplitRuleRecipientService: UpdateSplitRuleRecipientService, getAllSplitRuleRecipientsBySplitRuleIdService: GetAllSplitRuleRecipientsBySplitRuleIdService);
    exec(dtoIn: SyncSplitRuleRecipientsDtoIn): Promise<SyncSplitRuleRecipientsDtoOut>;
    private validateSplitRecipientExists;
    private createRecipient;
    private updateRecipient;
}

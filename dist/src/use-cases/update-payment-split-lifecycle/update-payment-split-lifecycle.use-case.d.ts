import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { UpdatePaymentSplitRecipientStatusService } from '../../modules/payment-split-recipients/services/update-payment-split-recipient-status/update-payment-split-recipient-status.service';
import { FindPaymentSplitByUniqueIdService } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { UpdatePaymentSplitStatusService } from '../../modules/payment-splits/services/update-payment-split-status/update-payment-split-status.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdatePaymentSplitLifecycleDtoIn } from './dtos/update-payment-split-lifecycle.dto-in';
import { UpdatePaymentSplitLifecycleDtoOut } from './dtos/update-payment-split-lifecycle.dto-out';
export declare class UpdatePaymentSplitLifecycleUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findPaymentSplitByUniqueIdService;
    private readonly updatePaymentSplitStatusService;
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService;
    private readonly updatePaymentSplitRecipientStatusService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService, updatePaymentSplitStatusService: UpdatePaymentSplitStatusService, getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService, updatePaymentSplitRecipientStatusService: UpdatePaymentSplitRecipientStatusService);
    exec(dtoIn: UpdatePaymentSplitLifecycleDtoIn): Promise<UpdatePaymentSplitLifecycleDtoOut>;
    private buildRecipientsFromCurrentList;
    private resolveCurrentRecipient;
}

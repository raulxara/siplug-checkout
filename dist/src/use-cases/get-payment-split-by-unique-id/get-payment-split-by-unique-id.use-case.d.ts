import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { FindPaymentSplitByUniqueIdService } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetPaymentSplitByUniqueIdDtoIn } from './dtos/get-payment-split-by-unique-id.dto-in';
import { GetPaymentSplitByUniqueIdDtoOut } from './dtos/get-payment-split-by-unique-id.dto-out';
export declare class GetPaymentSplitByUniqueIdUseCase {
    private readonly findPaymentSplitByUniqueIdService;
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService;
    private readonly resolveActorAuthorizationService;
    constructor(findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService, getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: GetPaymentSplitByUniqueIdDtoIn): Promise<GetPaymentSplitByUniqueIdDtoOut>;
}

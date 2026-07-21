import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { GetAllPaymentSplitsByPaymentTransactionIdService } from '../../modules/payment-splits/services/get-all-payment-splits-by-payment-transaction-id/get-all-payment-splits-by-payment-transaction-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListPaymentSplitsByPaymentTransactionIdDtoIn } from './dtos/list-payment-splits-by-payment-transaction-id.dto-in';
import { ListPaymentSplitsByPaymentTransactionIdDtoOut } from './dtos/list-payment-splits-by-payment-transaction-id.dto-out';
export declare class ListPaymentSplitsByPaymentTransactionIdUseCase {
    private readonly getAllPaymentSplitsByPaymentTransactionIdService;
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllPaymentSplitsByPaymentTransactionIdService: GetAllPaymentSplitsByPaymentTransactionIdService, getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListPaymentSplitsByPaymentTransactionIdDtoIn): Promise<ListPaymentSplitsByPaymentTransactionIdDtoOut>;
}

import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { GetAllPaymentSplitsByOfficeIdService } from '../../modules/payment-splits/services/get-all-payment-splits-by-office-id/get-all-payment-splits-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListPaymentSplitsByOfficeIdDtoIn } from './dtos/list-payment-splits-by-office-id.dto-in';
import { ListPaymentSplitsByOfficeIdDtoOut } from './dtos/list-payment-splits-by-office-id.dto-out';
export declare class ListPaymentSplitsByOfficeIdUseCase {
    private readonly getAllPaymentSplitsByOfficeIdService;
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllPaymentSplitsByOfficeIdService: GetAllPaymentSplitsByOfficeIdService, getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListPaymentSplitsByOfficeIdDtoIn): Promise<ListPaymentSplitsByOfficeIdDtoOut>;
}

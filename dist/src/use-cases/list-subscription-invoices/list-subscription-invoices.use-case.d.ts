import { GetAllSubscriptionInvoicesService } from '../../modules/subscription-invoices/services/get-all-subscription-invoices/get-all-subscription-invoices.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSubscriptionInvoicesDtoIn } from './dtos/list-subscription-invoices.dto-in';
import { ListSubscriptionInvoicesDtoOut } from './dtos/list-subscription-invoices.dto-out';
export declare class ListSubscriptionInvoicesUseCase {
    private readonly getAllSubscriptionInvoicesService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllSubscriptionInvoicesService: GetAllSubscriptionInvoicesService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSubscriptionInvoicesDtoIn): Promise<ListSubscriptionInvoicesDtoOut>;
}

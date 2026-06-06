import { FindSubscriptionInvoiceByUniqueIdService } from '../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service';
import { UpdateSubscriptionInvoiceService } from '../../modules/subscription-invoices/services/update-subscription-invoice/update-subscription-invoice.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateSubscriptionInvoiceDtoIn } from './dtos/update-subscription-invoice.dto-in';
import { UpdateSubscriptionInvoiceDtoOut } from './dtos/update-subscription-invoice.dto-out';
export declare class UpdateSubscriptionInvoiceUseCase {
    private readonly findSubscriptionInvoiceByUniqueIdService;
    private readonly updateSubscriptionInvoiceService;
    private readonly resolveActorAuthorizationService;
    constructor(findSubscriptionInvoiceByUniqueIdService: FindSubscriptionInvoiceByUniqueIdService, updateSubscriptionInvoiceService: UpdateSubscriptionInvoiceService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: UpdateSubscriptionInvoiceDtoIn): Promise<UpdateSubscriptionInvoiceDtoOut>;
}

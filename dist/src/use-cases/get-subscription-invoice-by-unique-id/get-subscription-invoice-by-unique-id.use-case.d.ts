import { FindSubscriptionInvoiceByUniqueIdService } from '../../modules/subscription-invoices/services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetSubscriptionInvoiceByUniqueIdDtoIn } from './dtos/get-subscription-invoice-by-unique-id.dto-in';
import { GetSubscriptionInvoiceByUniqueIdDtoOut } from './dtos/get-subscription-invoice-by-unique-id.dto-out';
export declare class GetSubscriptionInvoiceByUniqueIdUseCase {
    private readonly findSubscriptionInvoiceByUniqueIdService;
    private readonly resolveActorAuthorizationService;
    constructor(findSubscriptionInvoiceByUniqueIdService: FindSubscriptionInvoiceByUniqueIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: GetSubscriptionInvoiceByUniqueIdDtoIn): Promise<GetSubscriptionInvoiceByUniqueIdDtoOut>;
}

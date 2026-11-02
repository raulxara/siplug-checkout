import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { GetAllSubscriptionInvoicesByOfficeIdService } from '../../modules/subscription-invoices/services/get-all-subscription-invoices-by-office-id/get-all-subscription-invoices-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSubscriptionInvoicesByOfficeIdDtoIn } from './dtos/list-subscription-invoices-by-office-id.dto-in';
import { ListSubscriptionInvoicesByOfficeIdDtoOut } from './dtos/list-subscription-invoices-by-office-id.dto-out';
export declare class ListSubscriptionInvoicesByOfficeIdUseCase {
    private readonly identity;
    private readonly getAllSubscriptionInvoicesByOfficeIdService;
    private readonly resolveActorAuthorizationService;
    constructor(identity: GetAuthContextUseCase, getAllSubscriptionInvoicesByOfficeIdService: GetAllSubscriptionInvoicesByOfficeIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSubscriptionInvoicesByOfficeIdDtoIn): Promise<ListSubscriptionInvoicesByOfficeIdDtoOut>;
}

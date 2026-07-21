import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CreateSubscriptionCycleService } from '../../modules/subscription-cycles/services/create-subscription-cycle/create-subscription-cycle.service';
import { CreateSubscriptionInvoiceService } from '../../modules/subscription-invoices/services/create-subscription-invoice/create-subscription-invoice.service';
import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { FindSubscriptionByUniqueIdService } from '../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { UpdateSubscriptionService } from '../../modules/subscriptions/services/update-subscription/update-subscription.service';
import { GenerateSubscriptionInvoiceDtoIn } from './dtos/generate-subscription-invoice.dto-in';
import { GenerateSubscriptionInvoiceDtoOut } from './dtos/generate-subscription-invoice.dto-out';
export declare class GenerateSubscriptionInvoiceUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findSubscriptionByUniqueIdService;
    private readonly findSubscriptionPlanByUniqueIdService;
    private readonly createSubscriptionCycleService;
    private readonly createSubscriptionInvoiceService;
    private readonly updateSubscriptionService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findSubscriptionByUniqueIdService: FindSubscriptionByUniqueIdService, findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService, createSubscriptionCycleService: CreateSubscriptionCycleService, createSubscriptionInvoiceService: CreateSubscriptionInvoiceService, updateSubscriptionService: UpdateSubscriptionService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GenerateSubscriptionInvoiceDtoIn): Promise<GenerateSubscriptionInvoiceDtoOut>;
    private calculatePeriodEnd;
    private buildInvoiceNumber;
    private nowAsIso;
}

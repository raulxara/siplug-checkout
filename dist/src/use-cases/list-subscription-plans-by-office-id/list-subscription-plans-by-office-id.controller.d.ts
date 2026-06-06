import { ListSubscriptionPlansByOfficeIdRequest } from './http/list-subscription-plans-by-office-id.request';
import { ListSubscriptionPlansByOfficeIdUseCase } from './list-subscription-plans-by-office-id.use-case';
export declare class ListSubscriptionPlansByOfficeIdController {
    private readonly listSubscriptionPlansByOfficeIdUseCase;
    constructor(listSubscriptionPlansByOfficeIdUseCase: ListSubscriptionPlansByOfficeIdUseCase);
    handle(request: ListSubscriptionPlansByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionPlans: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}

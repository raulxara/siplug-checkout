import { ListSubscriptionPlansRequest } from './http/list-subscription-plans.request';
import { ListSubscriptionPlansUseCase } from './list-subscription-plans.use-case';
export declare class ListSubscriptionPlansController {
    private readonly listSubscriptionPlansUseCase;
    constructor(listSubscriptionPlansUseCase: ListSubscriptionPlansUseCase);
    handle(request: ListSubscriptionPlansRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionPlans: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}

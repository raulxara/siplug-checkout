import { GetSubscriptionPlanByUniqueIdRequest } from './http/get-subscription-plan-by-unique-id.request';
import { GetSubscriptionPlanByUniqueIdUseCase } from './get-subscription-plan-by-unique-id.use-case';
export declare class GetSubscriptionPlanByUniqueIdController {
    private readonly getSubscriptionPlanByUniqueIdUseCase;
    constructor(getSubscriptionPlanByUniqueIdUseCase: GetSubscriptionPlanByUniqueIdUseCase);
    handle(request: GetSubscriptionPlanByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionPlan: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}

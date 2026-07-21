import { GetSubscriptionByUniqueIdRequest } from './http/get-subscription-by-unique-id.request';
import { GetSubscriptionByUniqueIdUseCase } from './get-subscription-by-unique-id.use-case';
export declare class GetSubscriptionByUniqueIdController {
    private readonly getSubscriptionByUniqueIdUseCase;
    constructor(getSubscriptionByUniqueIdUseCase: GetSubscriptionByUniqueIdUseCase);
    handle(request: GetSubscriptionByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscription: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}

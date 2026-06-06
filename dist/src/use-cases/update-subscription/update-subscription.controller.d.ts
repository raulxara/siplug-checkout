import { UpdateSubscriptionRequest } from './http/update-subscription.request';
import { UpdateSubscriptionUseCase } from './update-subscription.use-case';
export declare class UpdateSubscriptionController {
    private readonly updateSubscriptionUseCase;
    constructor(updateSubscriptionUseCase: UpdateSubscriptionUseCase);
    handle(request: UpdateSubscriptionRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscription: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}

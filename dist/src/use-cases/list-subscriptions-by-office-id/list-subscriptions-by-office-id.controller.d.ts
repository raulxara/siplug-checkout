import { ListSubscriptionsByOfficeIdRequest } from './http/list-subscriptions-by-office-id.request';
import { ListSubscriptionsByOfficeIdUseCase } from './list-subscriptions-by-office-id.use-case';
export declare class ListSubscriptionsByOfficeIdController {
    private readonly listSubscriptionsByOfficeIdUseCase;
    constructor(listSubscriptionsByOfficeIdUseCase: ListSubscriptionsByOfficeIdUseCase);
    handle(request: ListSubscriptionsByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptions: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}

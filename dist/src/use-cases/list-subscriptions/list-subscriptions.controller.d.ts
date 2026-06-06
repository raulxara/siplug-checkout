import { ListSubscriptionsRequest } from './http/list-subscriptions.request';
import { ListSubscriptionsUseCase } from './list-subscriptions.use-case';
export declare class ListSubscriptionsController {
    private readonly listSubscriptionsUseCase;
    constructor(listSubscriptionsUseCase: ListSubscriptionsUseCase);
    handle(request: ListSubscriptionsRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptions: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}

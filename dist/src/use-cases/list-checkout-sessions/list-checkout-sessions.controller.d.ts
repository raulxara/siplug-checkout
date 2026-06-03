import { ListCheckoutSessionsRequest } from './http/list-checkout-sessions.request';
import { ListCheckoutSessionsUseCase } from './list-checkout-sessions.use-case';
export declare class ListCheckoutSessionsController {
    private readonly listCheckoutSessionsUseCase;
    constructor(listCheckoutSessionsUseCase: ListCheckoutSessionsUseCase);
    handle(body: ListCheckoutSessionsRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/list-checkout-sessions.dto-out").ListCheckoutSessionsDtoOut;
    }>;
}

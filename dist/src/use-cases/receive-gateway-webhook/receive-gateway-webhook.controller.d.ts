import { ReceiveGatewayWebhookUseCase } from './receive-gateway-webhook.use-case';
export declare class ReceiveGatewayWebhookController {
    private readonly receiveGatewayWebhookUseCase;
    constructor(receiveGatewayWebhookUseCase: ReceiveGatewayWebhookUseCase);
    handle(provider: string, body: unknown, query: Record<string, unknown>, headers: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: import("./dtos/receive-gateway-webhook.dto-out").ReceiveGatewayWebhookDtoOut;
    }>;
    private asRecord;
}

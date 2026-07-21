import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ReceiveGatewayWebhookUseCase } from './receive-gateway-webhook.use-case';
export declare class ReceiveGatewayWebhookController {
    private readonly receiveGatewayWebhookUseCase;
    constructor(receiveGatewayWebhookUseCase: ReceiveGatewayWebhookUseCase);
    receive(gatewayProvider: string, body: Record<string, unknown>, headers: Record<string, string | string[] | undefined>, request: RawBodyRequest<Request>): Promise<{
        status: string;
        message: string;
        data: import("./dtos/receive-gateway-webhook.dto-out").ReceiveGatewayWebhookDtoOut;
    }>;
}

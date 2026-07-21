import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ReceiveStripeWebhookUseCase } from './receive-stripe-webhook.use-case';
export declare class ReceiveStripeWebhookController {
    private readonly receiveStripeWebhookUseCase;
    constructor(receiveStripeWebhookUseCase: ReceiveStripeWebhookUseCase);
    handle(apiCredentialId: string, request: RawBodyRequest<Request>, body: Record<string, unknown>, headers: Record<string, string | string[] | undefined>): Promise<{
        status: string;
        message: string;
        data: {
            paymentWebhookEvent: Record<string, unknown>;
            paymentTransaction: Record<string, unknown> | null;
            processingResult: Record<string, unknown>;
            wasAlreadyRegistered: boolean;
        };
    }>;
    private resolveRawBody;
    private resolveHeader;
    private normalizeHeaders;
}

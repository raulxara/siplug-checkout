import type { CheckoutSessionEntity } from '../../../entities/checkout-session.entity';
export declare class CreateCheckoutSessionDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly officeId: string;
    readonly clientId: string;
    readonly paymentCustomerId: string | null;
    readonly gatewayId: string;
    readonly apiCredentialId: string | null;
    readonly code: string | null;
    readonly externalReference: string | null;
    readonly idempotencyKey: string | null;
    readonly paymentType: string;
    readonly amount: number;
    readonly currency: string;
    readonly description: string | null;
    readonly successUrl: string | null;
    readonly cancelUrl: string | null;
    readonly expiresAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, officeId: string, clientId: string, paymentCustomerId: string | null, gatewayId: string, apiCredentialId: string | null, code: string | null, externalReference: string | null, idempotencyKey: string | null, paymentType: string, amount: number, currency: string, description: string | null, successUrl: string | null, cancelUrl: string | null, expiresAt: string | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: CheckoutSessionEntity): CreateCheckoutSessionDtoOut;
}

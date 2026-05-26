import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ICheckoutSessionsRepository } from './checkout-sessions-repository.interface';
export declare class CheckoutSessionEntity extends AbstractEntity {
    private readonly repository;
    officeId: string;
    clientId: string;
    paymentCustomerId: string | null;
    gatewayId: string;
    apiCredentialId: string | null;
    code: string | null;
    externalReference: string | null;
    idempotencyKey: string | null;
    paymentType: string;
    amount: number;
    currency: string;
    description: string | null;
    successUrl: string | null;
    cancelUrl: string | null;
    expiresAt: string | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: ICheckoutSessionsRepository);
    create(): Promise<CheckoutSessionEntity>;
}

import type { CheckoutSessionEntity } from './checkout-session.entity';
export type CheckoutSessionRow = {
    id: number;
    _id: string;
    officeId: string;
    clientId: string;
    paymentCustomerId: string | null;
    gatewayId: string | null;
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
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface ICheckoutSessionsRepository {
    create(entity: CheckoutSessionEntity): Promise<CheckoutSessionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<CheckoutSessionRow>;
    findByUniqueId(_id: string): Promise<CheckoutSessionRow | null>;
    getAll(): Promise<CheckoutSessionRow[]>;
    getAllByOfficeId(officeId: string): Promise<CheckoutSessionRow[]>;
}

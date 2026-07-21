import type { IPaymentSplitRecipientsRepository } from './payment-split-recipients-repository.interface';
export declare class PaymentSplitRecipientEntity {
    private readonly paymentSplitRecipientsRepository?;
    id: number | null;
    _id: string | null;
    paymentSplitId: string;
    splitRecipientId: string;
    gatewayRecipientId: string | null;
    gatewayTransferId: string | null;
    role: string;
    amount: number;
    percentage: number | null;
    currency: string;
    providerPayload: Record<string, unknown> | null;
    providerResponse: Record<string, unknown> | null;
    gatewayResponse: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
    constructor(paymentSplitRecipientsRepository?: IPaymentSplitRecipientsRepository | undefined);
    create(): Promise<PaymentSplitRecipientEntity>;
}

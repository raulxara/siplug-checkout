import type { PaymentSplitRecipientEntity } from './payment-split-recipient.entity';
export type PaymentSplitRecipientRow = {
    id: number;
    _id: string;
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
};
export interface IPaymentSplitRecipientsRepository {
    create(entity: PaymentSplitRecipientEntity): Promise<PaymentSplitRecipientEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PaymentSplitRecipientRow>;
    getAllByPaymentSplitId(paymentSplitId: string): Promise<PaymentSplitRecipientRow[]>;
    findByUniqueId(_id: string): Promise<PaymentSplitRecipientRow | null>;
}

import type { SplitRecipientEntity } from './split-recipient.entity';
export type SplitRecipientRow = {
    id: number;
    _id: string;
    officeId: string;
    clientId: string;
    gatewayId: string | null;
    apiCredentialId: string | null;
    name: string;
    documentType: string | null;
    documentValue: string | null;
    email: string | null;
    gatewayProvider: string | null;
    gatewayRecipientId: string | null;
    gatewayAccountId: string | null;
    bankData: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface ISplitRecipientsRepository {
    create(entity: SplitRecipientEntity): Promise<SplitRecipientEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SplitRecipientRow>;
    findByUniqueId(_id: string): Promise<SplitRecipientRow | null>;
    findByGatewayRecipientId(gatewayProvider: string, gatewayRecipientId: string): Promise<SplitRecipientRow | null>;
    getAll(): Promise<SplitRecipientRow[]>;
    getAllByOfficeId(officeId: string): Promise<SplitRecipientRow[]>;
}

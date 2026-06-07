import type { ISplitRecipientsRepository } from './split-recipients-repository.interface';
export declare class SplitRecipientEntity {
    private readonly splitRecipientsRepository?;
    id: number | null;
    _id: string | null;
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
    constructor(splitRecipientsRepository?: ISplitRecipientsRepository | undefined);
    create(): Promise<SplitRecipientEntity>;
}

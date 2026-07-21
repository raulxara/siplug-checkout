export declare class UpdateSplitRecipientDtoIn {
    readonly _id: string;
    readonly officeId: string | null;
    readonly clientId: string | null;
    readonly gatewayId: string | null;
    readonly apiCredentialId: string | null;
    readonly name: string | null;
    readonly documentType: string | null;
    readonly documentValue: string | null;
    readonly email: string | null;
    readonly gatewayProvider: string | null;
    readonly gatewayRecipientId: string | null;
    readonly gatewayAccountId: string | null;
    readonly bankData: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(_id: string, officeId: string | null, clientId: string | null, gatewayId: string | null, apiCredentialId: string | null, name: string | null, documentType: string | null, documentValue: string | null, email: string | null, gatewayProvider: string | null, gatewayRecipientId: string | null, gatewayAccountId: string | null, bankData: Record<string, unknown> | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string | null, source: string);
}

export declare class RegisterSplitRecipientDtoIn {
    readonly token: string;
    readonly officeId: string;
    readonly clientId: string;
    readonly gatewayId: string | null;
    readonly apiCredentialId: string | null;
    readonly name: string;
    readonly documentType: string | null;
    readonly documentValue: string | null;
    readonly email: string | null;
    readonly gatewayProvider: string | null;
    readonly gatewayRecipientId: string | null;
    readonly gatewayAccountId: string | null;
    readonly bankData: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        token?: unknown;
        officeId?: unknown;
        clientId?: unknown;
        gatewayId?: unknown;
        apiCredentialId?: unknown;
        name?: unknown;
        documentType?: unknown;
        documentValue?: unknown;
        email?: unknown;
        gatewayProvider?: unknown;
        gatewayRecipientId?: unknown;
        gatewayAccountId?: unknown;
        bankData?: unknown;
        metadata?: unknown;
        config?: unknown;
        status?: unknown;
    });
    private toNullableString;
    private toNullableObject;
}

export declare class RegisterSplitRecipientRequest {
    token?: string;
    officeId: string;
    clientId: string;
    gatewayId?: string;
    apiCredentialId?: string;
    name: string;
    documentType?: string;
    documentValue?: string;
    email?: string;
    gatewayProvider?: string;
    gatewayRecipientId?: string;
    gatewayAccountId?: string;
    bankData?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
}

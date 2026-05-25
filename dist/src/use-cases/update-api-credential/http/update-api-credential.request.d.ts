export declare class UpdateApiCredentialRequest {
    token?: string;
    apiCredentialId: string;
    officeId?: string | null;
    clientId?: string | null;
    gatewayId?: string | null;
    name?: string | null;
    slug?: string | null;
    provider?: string | null;
    providerType?: string | null;
    environment?: string | null;
    providerToken?: string | null;
    origin?: string | null;
    config?: Record<string, unknown> | null;
    expiresAt?: string | null;
    status?: string | null;
    source?: string;
}

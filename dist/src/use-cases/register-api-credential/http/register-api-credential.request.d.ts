export declare class RegisterApiCredentialRequest {
    token?: string;
    officeId?: string | null;
    clientId?: string | null;
    gatewayId?: string | null;
    name: string;
    slug: string;
    provider: string;
    providerType: string;
    environment?: string;
    providerToken: string;
    origin?: string | null;
    config?: Record<string, unknown> | null;
    expiresAt?: string | null;
    status?: string;
}

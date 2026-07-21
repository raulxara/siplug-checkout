export declare class RegisterApiCredentialDtoIn {
    readonly token: string;
    readonly officeId: string | null;
    readonly clientId: string | null;
    readonly gatewayId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly provider: string;
    readonly providerType: string;
    readonly environment: string;
    readonly providerToken: string;
    readonly origin: string | null;
    readonly config: Record<string, unknown> | null;
    readonly expiresAt: string | null;
    readonly status: string;
    constructor(params: {
        token?: string;
        officeId?: string | null;
        clientId?: string | null;
        gatewayId?: string | null;
        name?: string;
        slug?: string;
        provider?: string;
        providerType?: string;
        environment?: string;
        providerToken?: string;
        origin?: string | null;
        config?: Record<string, unknown> | null;
        expiresAt?: string | null;
        status?: string;
    });
}

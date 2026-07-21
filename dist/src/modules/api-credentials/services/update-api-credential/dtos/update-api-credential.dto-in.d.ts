export declare class UpdateApiCredentialDtoIn {
    readonly _id: string;
    readonly officeId: string | null;
    readonly clientId: string | null;
    readonly gatewayId: string | null;
    readonly name: string | null;
    readonly slug: string | null;
    readonly provider: string | null;
    readonly providerType: string | null;
    readonly environment: string | null;
    readonly token: string | null;
    readonly origin: string | null;
    readonly config: Record<string, unknown> | null;
    readonly expiresAt: string | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        officeId?: string | null;
        clientId?: string | null;
        gatewayId?: string | null;
        name?: string | null;
        slug?: string | null;
        provider?: string | null;
        providerType?: string | null;
        environment?: string | null;
        token?: string | null;
        origin?: string | null;
        config?: Record<string, unknown> | null;
        expiresAt?: string | null;
        status?: string | null;
        source?: string;
    });
}

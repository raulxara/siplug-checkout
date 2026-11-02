export declare class ResolvePaymentGatewayCredentialDtoIn {
    readonly splitRequired: boolean;
    readonly environment: string;
    readonly officeId: string;
    readonly clientId: string;
    readonly paymentType: string;
    readonly paymentMethod: string;
    readonly gatewayProvider: string | null;
    readonly gatewaySlug: string | null;
    readonly gatewayId: string | null;
    readonly apiCredentialId: string | null;
    constructor(params: {
        splitRequired?: boolean;
        environment?: string;
        officeId: string;
        clientId: string;
        paymentType: string;
        paymentMethod: string;
        gatewayProvider?: unknown;
        gatewaySlug?: unknown;
        gatewayId?: unknown;
        apiCredentialId?: unknown;
    });
}

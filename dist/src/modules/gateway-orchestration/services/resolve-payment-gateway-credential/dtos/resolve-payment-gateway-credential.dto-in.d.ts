export declare class ResolvePaymentGatewayCredentialDtoIn {
    readonly officeId: string;
    readonly clientId: string;
    readonly paymentType: string;
    readonly paymentMethod: string;
    readonly gatewayProvider: string | null;
    readonly gatewaySlug: string | null;
    readonly gatewayId: string | null;
    readonly apiCredentialId: string | null;
    constructor(params: {
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

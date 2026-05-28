export declare class CreateGatewayCardTokenDtoIn {
    readonly apiCredentialId: string;
    readonly cardNumber: string;
    readonly securityCode: string;
    readonly expirationMonth: string;
    readonly expirationYear: string;
    readonly cardholderName: string;
    readonly documentType: string;
    readonly documentValue: string;
    constructor(params: {
        apiCredentialId?: unknown;
        cardNumber?: unknown;
        securityCode?: unknown;
        expirationMonth?: unknown;
        expirationYear?: unknown;
        cardholderName?: unknown;
        documentType?: unknown;
        documentValue?: unknown;
    });
}

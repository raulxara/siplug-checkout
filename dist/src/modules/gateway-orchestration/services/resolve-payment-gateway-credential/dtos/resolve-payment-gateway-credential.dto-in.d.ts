export declare class ResolvePaymentGatewayCredentialDtoIn {
    readonly officeId: string;
    readonly clientId: string;
    readonly paymentType: string;
    readonly paymentMethod: string;
    constructor(params: {
        officeId: string;
        clientId: string;
        paymentType: string;
        paymentMethod: string;
    });
}

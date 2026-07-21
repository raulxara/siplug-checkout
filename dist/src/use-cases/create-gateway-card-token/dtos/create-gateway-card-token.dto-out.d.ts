export declare class CreateGatewayCardTokenDtoOut {
    readonly provider: string;
    readonly cardToken: string;
    readonly publicKeyPrefix: string | null;
    readonly firstSixDigits: string | null;
    readonly lastFourDigits: string | null;
    readonly expirationMonth: number | null;
    readonly expirationYear: number | null;
    readonly providerResponse: Record<string, unknown>;
    readonly gatewayResponse: Record<string, unknown>;
    constructor(provider: string, cardToken: string, publicKeyPrefix: string | null, firstSixDigits: string | null, lastFourDigits: string | null, expirationMonth: number | null, expirationYear: number | null, providerResponse: Record<string, unknown>, gatewayResponse: Record<string, unknown>);
}

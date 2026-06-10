export declare class CreatePaymentSplitDtoIn {
    readonly officeId: string;
    readonly clientId: string;
    readonly checkoutSessionId: string | null;
    readonly paymentTransactionId: string;
    readonly subscriptionId: string | null;
    readonly subscriptionInvoiceId: string | null;
    readonly splitRuleId: string | null;
    readonly gatewayProvider: string;
    readonly gatewaySplitId: string | null;
    readonly amount: number;
    readonly currency: string;
    readonly providerPayload: Record<string, unknown> | null;
    readonly providerResponse: Record<string, unknown> | null;
    readonly gatewayResponse: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(officeId: string, clientId: string, checkoutSessionId: string | null, paymentTransactionId: string, subscriptionId: string | null, subscriptionInvoiceId: string | null, splitRuleId: string | null, gatewayProvider: string, gatewaySplitId: string | null, amount: number, currency: string, providerPayload: Record<string, unknown> | null, providerResponse: Record<string, unknown> | null, gatewayResponse: Record<string, unknown> | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string);
}

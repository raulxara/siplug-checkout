export declare class ReceiveGatewayWebhookDtoIn {
    readonly provider: string;
    readonly body: Record<string, unknown>;
    readonly query: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    constructor(params: {
        provider?: string;
        body?: Record<string, unknown>;
        query?: Record<string, unknown>;
        headers?: Record<string, unknown>;
    });
}

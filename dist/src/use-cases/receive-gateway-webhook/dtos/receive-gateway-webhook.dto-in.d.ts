export declare class ReceiveGatewayWebhookDtoIn {
    readonly gatewayProvider: string;
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, string | string[] | undefined>;
    readonly rawBody: Buffer | null;
    constructor(params: {
        gatewayProvider?: unknown;
        payload?: Record<string, unknown> | null;
        headers?: Record<string, string | string[] | undefined> | null;
        rawBody?: Buffer | null;
    });
}

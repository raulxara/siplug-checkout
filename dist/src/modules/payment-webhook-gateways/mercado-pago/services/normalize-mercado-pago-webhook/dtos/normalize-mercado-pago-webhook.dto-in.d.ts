export declare class NormalizeMercadoPagoWebhookDtoIn {
    readonly payload: Record<string, unknown>;
    readonly payment: Record<string, unknown> | null;
    readonly preapproval: Record<string, unknown> | null;
    readonly headers: Record<string, unknown>;
    readonly queryParams: Record<string, unknown>;
    constructor(params: {
        payload?: unknown;
        payment?: unknown;
        preapproval?: unknown;
        headers?: unknown;
        queryParams?: unknown;
    });
    private toObject;
    private toNullableObject;
}

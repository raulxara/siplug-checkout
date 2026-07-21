export type PagSeguroWebhookSignatureMode = 'required' | 'optional';
export declare class ValidatePagSeguroWebhookDtoIn {
    readonly rawBody: string;
    readonly token: string;
    readonly xAuthenticityToken: string | null;
    readonly signatureMode: PagSeguroWebhookSignatureMode;
    constructor(params: {
        rawBody?: unknown;
        token?: unknown;
        xAuthenticityToken?: unknown;
        signatureMode?: unknown;
    });
    private toNullableString;
}

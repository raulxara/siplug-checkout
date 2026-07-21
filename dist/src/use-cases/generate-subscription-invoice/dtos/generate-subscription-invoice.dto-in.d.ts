export declare class GenerateSubscriptionInvoiceDtoIn {
    readonly token: string;
    readonly subscriptionId: string;
    readonly scheduledAt: string | null;
    readonly dueAt: string | null;
    readonly force: boolean;
    constructor(params: {
        token: string;
        subscriptionId: string;
        scheduledAt?: string | null;
        dueAt?: string | null;
        force?: boolean | null;
    });
    private normalizeNullableString;
}

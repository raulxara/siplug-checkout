export declare class UpdateCheckoutSessionItemDtoIn {
    readonly _id: string;
    readonly checkoutSessionId: string | null;
    readonly itemRef: string | null;
    readonly itemType: string | null;
    readonly name: string | null;
    readonly description: string | null;
    readonly quantity: number | null;
    readonly unitAmount: number | null;
    readonly totalAmount: number | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        checkoutSessionId?: string | null;
        itemRef?: string | null;
        itemType?: string | null;
        name?: string | null;
        description?: string | null;
        quantity?: number | null;
        unitAmount?: number | null;
        totalAmount?: number | null;
        metadata?: Record<string, unknown> | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}

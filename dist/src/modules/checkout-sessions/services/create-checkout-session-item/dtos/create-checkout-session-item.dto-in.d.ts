export declare class CreateCheckoutSessionItemDtoIn {
    readonly checkoutSessionId: string;
    readonly itemRef: string | null;
    readonly itemType: string | null;
    readonly name: string;
    readonly description: string | null;
    readonly quantity: number;
    readonly unitAmount: number;
    readonly totalAmount: number;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        checkoutSessionId: string;
        itemRef?: string | null;
        itemType?: string | null;
        name: string;
        description?: string | null;
        quantity?: number;
        unitAmount: number;
        totalAmount?: number;
        metadata?: Record<string, unknown> | null;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

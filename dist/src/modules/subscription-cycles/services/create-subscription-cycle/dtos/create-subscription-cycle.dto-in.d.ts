export declare class CreateSubscriptionCycleDtoIn {
    readonly subscriptionId: string;
    readonly cycleNumber: number;
    readonly amount: number;
    readonly currency: string;
    readonly periodStart: string | null;
    readonly periodEnd: string | null;
    readonly scheduledAt: string | null;
    readonly processedAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(subscriptionId: string, cycleNumber: number, amount: number, currency: string, periodStart: string | null, periodEnd: string | null, scheduledAt: string | null, processedAt: string | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string);
}

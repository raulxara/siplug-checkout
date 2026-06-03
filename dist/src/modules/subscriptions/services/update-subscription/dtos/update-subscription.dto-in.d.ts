export declare class UpdateSubscriptionDtoIn {
    readonly _id: string;
    readonly currentCycle: number | null;
    readonly nextBillingAt: string | null;
    readonly startedAt: string | null;
    readonly canceledAt: string | null;
    readonly endedAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(_id: string, currentCycle: number | null, nextBillingAt: string | null, startedAt: string | null, canceledAt: string | null, endedAt: string | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string | null, source: string);
}

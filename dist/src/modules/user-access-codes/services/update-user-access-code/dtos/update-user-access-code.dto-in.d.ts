export declare class UpdateUserAccessCodeDtoIn {
    readonly _id: string;
    readonly channel: string | null;
    readonly destination: string | null;
    readonly code: string | null;
    readonly expiresAt: string | null;
    readonly usedAt: string | null;
    readonly sentAt: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        channel?: string | null;
        destination?: string | null;
        code?: string | null;
        expiresAt?: string | null;
        usedAt?: string | null;
        sentAt?: string | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}

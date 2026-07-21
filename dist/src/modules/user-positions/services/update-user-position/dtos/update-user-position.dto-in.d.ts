export declare class UpdateUserPositionDtoIn {
    readonly _id: string;
    readonly userCustomerId: string | null;
    readonly positionId: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        userCustomerId?: string | null;
        positionId?: string | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}

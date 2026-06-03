export declare class CreateUserPositionDtoIn {
    readonly userCustomerId: string;
    readonly positionId: string;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        userCustomerId: string;
        positionId: string;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

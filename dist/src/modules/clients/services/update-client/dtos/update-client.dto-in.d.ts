export declare class UpdateClientDtoIn {
    readonly _id: string;
    readonly officeId: string | null;
    readonly customerId: string | null;
    readonly userType: string | null;
    readonly username: string | null;
    readonly password: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        officeId?: string | null;
        customerId?: string | null;
        userType?: string | null;
        username?: string | null;
        password?: string | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}

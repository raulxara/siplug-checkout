export declare class UpdateUserCustomerDtoIn {
    readonly _id: string;
    readonly clientId: string | null;
    readonly profileId: string | null;
    readonly token: string | null;
    readonly twoFaRequired: boolean | null;
    readonly twoFaActive: boolean | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        clientId?: string | null;
        profileId?: string | null;
        token?: string | null;
        twoFaRequired?: boolean | null;
        twoFaActive?: boolean | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}

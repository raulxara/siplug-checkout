export declare class CreateUserCustomerDtoIn {
    readonly clientId: string;
    readonly profileId: string;
    readonly token: string;
    readonly twoFaRequired: boolean;
    readonly twoFaActive: boolean;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        clientId: string;
        profileId: string;
        token: string;
        twoFaRequired?: boolean;
        twoFaActive?: boolean;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

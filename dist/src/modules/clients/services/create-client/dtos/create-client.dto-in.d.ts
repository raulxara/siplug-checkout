export declare class CreateClientDtoIn {
    readonly officeId: string;
    readonly customerId: string | null;
    readonly userType: string;
    readonly username: string;
    readonly password: string;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        officeId: string;
        customerId?: string | null;
        userType?: string;
        username: string;
        password: string;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

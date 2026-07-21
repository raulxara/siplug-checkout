export declare class CreateUserAccessCodeDtoIn {
    readonly userCustomerId: string;
    readonly channel: string;
    readonly destination: string;
    readonly code: string;
    readonly expiresAt: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        userCustomerId: string;
        channel: string;
        destination: string;
        code: string;
        expiresAt?: string | null;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

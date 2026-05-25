export declare class RegisterPositionDtoIn {
    readonly token: string;
    readonly officeId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        token?: string;
        officeId?: string | null;
        name?: string;
        slug?: string;
        description?: string | null;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

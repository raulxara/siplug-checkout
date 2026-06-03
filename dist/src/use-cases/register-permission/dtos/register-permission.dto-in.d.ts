export declare class RegisterPermissionDtoIn {
    readonly token: string;
    readonly officeId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly entity: string;
    readonly action: string;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        token?: string;
        officeId?: string | null;
        name?: string;
        slug?: string;
        description?: string | null;
        entity?: string;
        action?: string;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

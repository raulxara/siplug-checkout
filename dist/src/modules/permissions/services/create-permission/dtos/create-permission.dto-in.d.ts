export declare class CreatePermissionDtoIn {
    readonly officeId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly entity: string;
    readonly action: string;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        officeId?: string | null;
        name: string;
        slug: string;
        description?: string | null;
        entity: string;
        action: string;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

export declare class CreatePositionDtoIn {
    readonly officeId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        officeId?: string | null;
        name: string;
        slug: string;
        description?: string | null;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

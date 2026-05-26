export declare class UpdateGatewayDtoIn {
    readonly _id: string;
    readonly name: string | null;
    readonly slug: string | null;
    readonly provider: string | null;
    readonly description: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        name?: string | null;
        slug?: string | null;
        provider?: string | null;
        description?: string | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}

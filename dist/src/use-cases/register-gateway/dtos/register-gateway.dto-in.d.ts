export declare class RegisterGatewayDtoIn {
    readonly token: string;
    readonly name: string;
    readonly slug: string;
    readonly provider: string;
    readonly description: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        token?: string;
        name?: string;
        slug?: string;
        provider?: string;
        description?: string | null;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

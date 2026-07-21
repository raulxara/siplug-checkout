export declare class RegisterSplitRuleDtoIn {
    readonly token: string;
    readonly officeId: string;
    readonly clientId: string;
    readonly gatewayId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly splitType: string;
    readonly calculationBase: string;
    readonly priority: number;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        token?: unknown;
        officeId?: unknown;
        clientId?: unknown;
        gatewayId?: unknown;
        name?: unknown;
        slug?: unknown;
        description?: unknown;
        splitType?: unknown;
        calculationBase?: unknown;
        priority?: unknown;
        metadata?: unknown;
        config?: unknown;
        status?: unknown;
    });
    private toNullableString;
    private toNumber;
    private toNullableObject;
}

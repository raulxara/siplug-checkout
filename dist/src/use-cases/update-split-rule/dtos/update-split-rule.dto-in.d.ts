export declare class UpdateSplitRuleDtoIn {
    readonly token: string;
    readonly splitRuleId: string;
    readonly officeId: string | null;
    readonly clientId: string | null;
    readonly gatewayId: string | null;
    readonly name: string | null;
    readonly slug: string | null;
    readonly description: string | null;
    readonly splitType: string | null;
    readonly calculationBase: string | null;
    readonly priority: number | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    constructor(params: {
        token?: unknown;
        splitRuleId?: unknown;
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
    private toNullableNumber;
    private toNullableObject;
}

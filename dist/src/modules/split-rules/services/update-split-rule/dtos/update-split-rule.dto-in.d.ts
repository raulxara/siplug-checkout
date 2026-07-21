export declare class UpdateSplitRuleDtoIn {
    readonly _id: string;
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
    readonly source: string;
    constructor(_id: string, officeId: string | null, clientId: string | null, gatewayId: string | null, name: string | null, slug: string | null, description: string | null, splitType: string | null, calculationBase: string | null, priority: number | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string | null, source: string);
}

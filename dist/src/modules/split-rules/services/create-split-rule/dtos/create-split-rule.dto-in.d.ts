export declare class CreateSplitRuleDtoIn {
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
    constructor(officeId: string, clientId: string, gatewayId: string | null, name: string, slug: string, description: string | null, splitType: string, calculationBase: string, priority: number, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string);
}

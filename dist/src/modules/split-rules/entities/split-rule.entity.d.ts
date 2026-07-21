import type { ISplitRulesRepository } from './split-rules-repository.interface';
export declare class SplitRuleEntity {
    private readonly splitRulesRepository?;
    id: number | null;
    _id: string | null;
    officeId: string;
    clientId: string;
    gatewayId: string | null;
    name: string;
    slug: string;
    description: string | null;
    splitType: string;
    calculationBase: string;
    priority: number;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
    constructor(splitRulesRepository?: ISplitRulesRepository | undefined);
    create(): Promise<SplitRuleEntity>;
}

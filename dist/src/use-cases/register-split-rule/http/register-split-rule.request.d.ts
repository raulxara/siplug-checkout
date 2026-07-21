export declare class RegisterSplitRuleRequest {
    token?: string;
    officeId: string;
    clientId: string;
    gatewayId?: string;
    name: string;
    slug: string;
    description?: string;
    splitType?: string;
    calculationBase?: string;
    priority?: number;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
}

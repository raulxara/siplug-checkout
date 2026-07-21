export declare class UpdateGatewayRequest {
    token?: string;
    gatewayId: string;
    name?: string | null;
    slug?: string | null;
    provider?: string | null;
    description?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
}

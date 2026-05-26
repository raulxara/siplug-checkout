export declare class RegisterGatewayRequest {
    token?: string;
    name: string;
    slug: string;
    provider: string;
    description?: string | null;
    config?: Record<string, unknown> | null;
    status?: string;
}

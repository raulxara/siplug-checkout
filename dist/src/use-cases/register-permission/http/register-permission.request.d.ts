export declare class RegisterPermissionRequest {
    token?: string;
    officeId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    entity: string;
    action: string;
    config?: Record<string, unknown> | null;
    status?: string;
}

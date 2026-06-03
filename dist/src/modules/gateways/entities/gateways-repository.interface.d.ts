import type { GatewayEntity } from './gateway.entity';
export type GatewayRow = {
    id: number;
    _id: string;
    name: string;
    slug: string;
    provider: string;
    description: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IGatewaysRepository {
    create(entity: GatewayEntity): Promise<GatewayEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<GatewayRow>;
    findByUniqueId(_id: string): Promise<GatewayRow | null>;
    findBySlug(slug: string): Promise<GatewayRow | null>;
    getAll(): Promise<GatewayRow[]>;
}

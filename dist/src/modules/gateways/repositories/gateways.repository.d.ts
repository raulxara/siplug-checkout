import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { GatewayEntity } from '../entities/gateway.entity';
import type { GatewayRow, IGatewaysRepository } from '../entities/gateways-repository.interface';
export declare class GatewaysRepository implements IGatewaysRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: GatewayEntity): Promise<GatewayEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<GatewayRow>;
    findByUniqueId(_id: string): Promise<GatewayRow | null>;
    findBySlug(slug: string): Promise<GatewayRow | null>;
    getAll(): Promise<GatewayRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}

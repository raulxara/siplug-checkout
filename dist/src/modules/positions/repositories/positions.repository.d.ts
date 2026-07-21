import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PositionEntity } from '../entities/position.entity';
import type { IPositionsRepository, PositionRow } from '../entities/positions-repository.interface';
export declare class PositionsRepository implements IPositionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: PositionEntity): Promise<PositionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PositionRow>;
    findByUniqueId(_id: string): Promise<PositionRow | null>;
    findBySlug(officeId: string | null, slug: string): Promise<PositionRow | null>;
    getAll(): Promise<PositionRow[]>;
    getAllByOfficeId(officeId: string): Promise<PositionRow[]>;
    getAllByUniqueIds(_ids: string[]): Promise<PositionRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}

import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { OfficeEntity } from '../entities/office.entity';
import { IOfficesRepository, OfficeRow } from '../entities/offices-repository.interface';
export declare class OfficesRepository implements IOfficesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: OfficeEntity): Promise<OfficeEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<OfficeRow>;
    findByUniqueId(_id: string): Promise<OfficeRow | null>;
    findBySlug(slug: string): Promise<OfficeRow | null>;
    getAll(): Promise<OfficeRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}

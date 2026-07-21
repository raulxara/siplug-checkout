import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ClientEntity } from '../entities/client.entity';
import type { ClientRow, IClientsRepository } from '../entities/clients-repository.interface';
export declare class ClientsRepository implements IClientsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: ClientEntity): Promise<ClientEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<ClientRow>;
    findByUniqueId(_id: string): Promise<ClientRow | null>;
    findByUsername(username: string): Promise<ClientRow | null>;
    getAll(): Promise<ClientRow[]>;
    getAllByOfficeId(officeId: string): Promise<ClientRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}

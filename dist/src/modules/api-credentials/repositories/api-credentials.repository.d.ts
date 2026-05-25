import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ApiCredentialEntity } from '../entities/api-credential.entity';
import type { ApiCredentialRow, IApiCredentialsRepository } from '../entities/api-credentials-repository.interface';
export declare class ApiCredentialsRepository implements IApiCredentialsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: ApiCredentialEntity): Promise<ApiCredentialEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<ApiCredentialRow>;
    findByUniqueId(_id: string): Promise<ApiCredentialRow | null>;
    findBySlug(slug: string): Promise<ApiCredentialRow | null>;
    findByOfficeIdAndSlug(officeId: string | null, slug: string): Promise<ApiCredentialRow | null>;
    getAll(): Promise<ApiCredentialRow[]>;
    getAllByClientId(clientId: string): Promise<ApiCredentialRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}

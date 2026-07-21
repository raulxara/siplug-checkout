import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ProfileEntity } from '../entities/profile.entity';
import { IProfilesRepository, ProfileRow } from '../entities/profiles-repository.interface';
export declare class ProfilesRepository implements IProfilesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: ProfileEntity): Promise<ProfileEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<ProfileRow>;
    findByUniqueId(_id: string): Promise<ProfileRow | null>;
    findByEmail(email: string): Promise<ProfileRow | null>;
    findByDocument(documentType: string, documentValue: string): Promise<ProfileRow | null>;
    getAll(): Promise<ProfileRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}

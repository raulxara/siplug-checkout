import { ProfileEntity } from './profile.entity';
export type ProfileRow = {
    id: number;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    documentType: string | null;
    documentValue: string | null;
    addressStreet: string | null;
    addressNumber: string | null;
    addressComplement: string | null;
    addressNeighborhood: string | null;
    addressCity: string | null;
    addressState: string | null;
    addressCountry: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IProfilesRepository {
    create(entity: ProfileEntity): Promise<ProfileEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<ProfileRow>;
    findByUniqueId(_id: string): Promise<ProfileRow | null>;
    findByEmail(email: string): Promise<ProfileRow | null>;
    findByDocument(documentType: string, documentValue: string): Promise<ProfileRow | null>;
    getAll(): Promise<ProfileRow[]>;
}

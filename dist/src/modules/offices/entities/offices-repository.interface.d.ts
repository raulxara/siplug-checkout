import { OfficeEntity } from './office.entity';
export type OfficeRow = {
    id: number;
    _id: string;
    name: string;
    slug: string;
    language: string | null;
    currency: string | null;
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
export interface IOfficesRepository {
    create(entity: OfficeEntity): Promise<OfficeEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<OfficeRow>;
    findByUniqueId(_id: string): Promise<OfficeRow | null>;
    findBySlug(slug: string): Promise<OfficeRow | null>;
    getAll(): Promise<OfficeRow[]>;
}

import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import { IOfficesRepository } from './offices-repository.interface';
export declare class OfficeEntity extends AbstractEntity {
    private readonly repository;
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
    constructor(repository: IOfficesRepository);
    create(): Promise<OfficeEntity>;
}

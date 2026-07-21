import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import { IProfilesRepository } from './profiles-repository.interface';
export declare class ProfileEntity extends AbstractEntity {
    private readonly repository;
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
    constructor(repository: IProfilesRepository);
    create(): Promise<ProfileEntity>;
}

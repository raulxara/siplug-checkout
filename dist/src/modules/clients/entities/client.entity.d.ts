import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IClientsRepository } from './clients-repository.interface';
export declare class ClientEntity extends AbstractEntity {
    private readonly repository;
    officeId: string | null;
    customerId: string | null;
    userType: string;
    username: string;
    password: string;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IClientsRepository);
    create(): Promise<ClientEntity>;
}

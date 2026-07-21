import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IUserCustomersRepository } from './user-customers-repository.interface';
export declare class UserCustomerEntity extends AbstractEntity {
    private readonly repository;
    clientId: string;
    profileId: string;
    token: string;
    twoFaRequired: boolean;
    twoFaActive: boolean;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IUserCustomersRepository);
    create(): Promise<UserCustomerEntity>;
}

import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IUserAccessCodesRepository } from './user-access-codes-repository.interface';
export declare class UserAccessCodeEntity extends AbstractEntity {
    private readonly repository;
    userCustomerId: string;
    channel: string;
    destination: string;
    code: string;
    expiresAt: string | null;
    usedAt: string | null;
    sentAt: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IUserAccessCodesRepository);
    create(): Promise<UserAccessCodeEntity>;
}

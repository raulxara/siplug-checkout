import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IUserPositionsRepository } from './user-positions-repository.interface';
export declare class UserPositionEntity extends AbstractEntity {
    private readonly repository;
    userCustomerId: string;
    positionId: string;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IUserPositionsRepository);
    create(): Promise<UserPositionEntity>;
}

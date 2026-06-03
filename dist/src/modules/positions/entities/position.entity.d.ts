import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPositionsRepository } from './positions-repository.interface';
export declare class PositionEntity extends AbstractEntity {
    private readonly repository;
    officeId: string | null;
    name: string;
    slug: string;
    description: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IPositionsRepository);
    create(): Promise<PositionEntity>;
}

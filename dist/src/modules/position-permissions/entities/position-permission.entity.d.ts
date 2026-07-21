import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPositionPermissionsRepository } from './position-permissions-repository.interface';
export declare class PositionPermissionEntity extends AbstractEntity {
    private readonly repository;
    positionId: string;
    permissionId: string;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IPositionPermissionsRepository);
    create(): Promise<PositionPermissionEntity>;
}

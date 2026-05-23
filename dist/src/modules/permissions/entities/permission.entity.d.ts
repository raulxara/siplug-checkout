import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IPermissionsRepository } from './permissions-repository.interface';
export declare class PermissionEntity extends AbstractEntity {
    private readonly repository;
    officeId: string | null;
    name: string;
    slug: string;
    description: string | null;
    entity: string;
    action: string;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IPermissionsRepository);
    create(): Promise<PermissionEntity>;
}

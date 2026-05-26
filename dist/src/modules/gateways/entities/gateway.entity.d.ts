import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IGatewaysRepository } from './gateways-repository.interface';
export declare class GatewayEntity extends AbstractEntity {
    private readonly repository;
    name: string;
    slug: string;
    provider: string;
    description: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IGatewaysRepository);
    create(): Promise<GatewayEntity>;
}

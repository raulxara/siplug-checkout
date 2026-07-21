import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { IApiCredentialsRepository } from './api-credentials-repository.interface';
export declare class ApiCredentialEntity extends AbstractEntity {
    private readonly repository;
    officeId: string | null;
    clientId: string | null;
    gatewayId: string | null;
    name: string;
    slug: string;
    provider: string;
    providerType: string;
    environment: string;
    token: string | null;
    origin: string | null;
    config: Record<string, unknown> | null;
    expiresAt: string | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: IApiCredentialsRepository);
    create(): Promise<ApiCredentialEntity>;
}

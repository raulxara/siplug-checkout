import type { ApiCredentialEntity } from '../../../entities/api-credential.entity';
export declare class CreateApiCredentialDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly officeId: string | null;
    readonly clientId: string | null;
    readonly gatewayId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly provider: string;
    readonly providerType: string;
    readonly environment: string;
    readonly origin: string | null;
    readonly config: Record<string, unknown> | null;
    readonly expiresAt: string | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, officeId: string | null, clientId: string | null, gatewayId: string | null, name: string, slug: string, provider: string, providerType: string, environment: string, origin: string | null, config: Record<string, unknown> | null, expiresAt: string | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: ApiCredentialEntity): CreateApiCredentialDtoOut;
}

import type { ApiCredentialRow } from '../../../../modules/api-credentials/entities/api-credentials-repository.interface';
export declare class BuildDecryptedApiCredentialResponseService {
    exec(row: ApiCredentialRow): Record<string, unknown>;
}

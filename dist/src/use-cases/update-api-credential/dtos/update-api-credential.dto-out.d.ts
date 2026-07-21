import type { ApiCredentialRow } from '../../../modules/api-credentials/entities/api-credentials-repository.interface';
export type SafeUpdatedApiCredentialRow = Omit<ApiCredentialRow, 'token'> & {
    tokenUpdated: boolean;
};
export declare class UpdateApiCredentialDtoOut {
    readonly apiCredential: SafeUpdatedApiCredentialRow;
    constructor(apiCredential: SafeUpdatedApiCredentialRow);
}

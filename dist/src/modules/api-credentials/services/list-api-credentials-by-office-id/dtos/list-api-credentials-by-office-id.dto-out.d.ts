import type { ApiCredentialRow } from '../../../entities/api-credentials-repository.interface';
export declare class ListApiCredentialsByOfficeIdDtoOut {
    readonly apiCredentials: ApiCredentialRow[];
    constructor(apiCredentials: ApiCredentialRow[]);
}

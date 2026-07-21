import type { ApiCredentialRow } from '../../../entities/api-credentials-repository.interface';
export declare class FindActiveApiCredentialBySlugDtoOut {
    readonly apiCredential: ApiCredentialRow;
    constructor(apiCredential: ApiCredentialRow);
}

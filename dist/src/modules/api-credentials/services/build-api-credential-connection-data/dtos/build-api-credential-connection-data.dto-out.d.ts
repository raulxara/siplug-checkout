import type { ApiCredentialRow } from '../../../entities/api-credentials-repository.interface';
export declare class BuildApiCredentialConnectionDataDtoOut {
    readonly url: string;
    readonly token: string;
    readonly tokenPrefix: string;
    readonly origin: string | null;
    readonly timeoutSeconds: number;
    readonly headers: Record<string, string>;
    readonly expectedStatusCodes: number[];
    readonly credential: ApiCredentialRow;
    constructor(url: string, token: string, tokenPrefix: string, origin: string | null, timeoutSeconds: number, headers: Record<string, string>, expectedStatusCodes: number[], credential: ApiCredentialRow);
}

import type { ApiCredentialRow } from '../../../entities/api-credentials-repository.interface';

export class BuildApiCredentialConnectionDataDtoOut {
  constructor(
    public readonly url: string,
    public readonly token: string,
    public readonly tokenPrefix: string,
    public readonly origin: string | null,
    public readonly timeoutSeconds: number,
    public readonly headers: Record<string, string>,
    public readonly expectedStatusCodes: number[],
    public readonly credential: ApiCredentialRow,
  ) {}
}
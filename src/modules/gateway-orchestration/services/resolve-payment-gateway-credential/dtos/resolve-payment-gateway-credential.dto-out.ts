import type { ApiCredentialRow } from '../../../../api-credentials/entities/api-credentials-repository.interface';
import type { GatewayRow } from '../../../../gateways/entities/gateways-repository.interface';

export class ResolvePaymentGatewayCredentialDtoOut {
  constructor(
    public readonly gateway: GatewayRow,
    public readonly apiCredential: ApiCredentialRow,
    public readonly decryptedProviderToken: string | null,
    public readonly connectionData: Record<string, unknown>,
  ) {}
}

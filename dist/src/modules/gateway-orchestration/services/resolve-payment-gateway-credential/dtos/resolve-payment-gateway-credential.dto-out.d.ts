import type { ApiCredentialRow } from '../../../../api-credentials/entities/api-credentials-repository.interface';
import type { GatewayRow } from '../../../../gateways/entities/gateways-repository.interface';
export declare class ResolvePaymentGatewayCredentialDtoOut {
    readonly gateway: GatewayRow;
    readonly apiCredential: ApiCredentialRow;
    readonly decryptedProviderToken: string | null;
    readonly connectionData: Record<string, unknown>;
    constructor(gateway: GatewayRow, apiCredential: ApiCredentialRow, decryptedProviderToken: string | null, connectionData: Record<string, unknown>);
}

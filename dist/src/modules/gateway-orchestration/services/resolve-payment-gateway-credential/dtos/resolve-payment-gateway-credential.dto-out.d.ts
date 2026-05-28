import type { ApiCredentialRow } from '../../../../api-credentials/entities/api-credentials-repository.interface';
import type { GatewayRow } from '../../../../gateways/entities/gateways-repository.interface';
export declare class ResolvePaymentGatewayCredentialDtoOut {
    readonly gateway: GatewayRow;
    readonly apiCredential: ApiCredentialRow;
    readonly decryptedProviderToken: string;
    readonly connectionData: Record<string, unknown>;
    constructor(gateway: GatewayRow, apiCredential: ApiCredentialRow, decryptedProviderToken: string, connectionData: Record<string, unknown>);
}

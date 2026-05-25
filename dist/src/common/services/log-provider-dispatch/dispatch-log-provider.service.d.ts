import { BuildApiCredentialConnectionDataService } from '../../../modules/api-credentials/services/build-api-credential-connection-data/build-api-credential-connection-data.service';
import { DispatchLogProviderDtoIn } from './dtos/dispatch-log-provider.dto-in';
import { DispatchLogProviderDtoOut } from './dtos/dispatch-log-provider.dto-out';
export declare class DispatchLogProviderService {
    private readonly buildApiCredentialConnectionDataService;
    constructor(buildApiCredentialConnectionDataService: BuildApiCredentialConnectionDataService);
    exec(dtoIn: DispatchLogProviderDtoIn): Promise<DispatchLogProviderDtoOut>;
    private parseResponseBody;
}

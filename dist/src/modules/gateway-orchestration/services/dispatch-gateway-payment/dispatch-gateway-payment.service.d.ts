import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
import { ResolveGatewayPaymentProviderService } from '../resolve-gateway-payment-provider/resolve-gateway-payment-provider.service';
export declare class DispatchGatewayPaymentService {
    private readonly resolveGatewayPaymentProviderService;
    constructor(resolveGatewayPaymentProviderService: ResolveGatewayPaymentProviderService);
    exec(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut>;
}

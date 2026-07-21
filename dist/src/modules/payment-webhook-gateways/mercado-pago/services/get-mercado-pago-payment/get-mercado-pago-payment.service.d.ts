import { GetMercadoPagoPaymentDtoIn } from './dtos/get-mercado-pago-payment.dto-in';
import { GetMercadoPagoPaymentDtoOut } from './dtos/get-mercado-pago-payment.dto-out';
export declare class GetMercadoPagoPaymentService {
    exec(dtoIn: GetMercadoPagoPaymentDtoIn): Promise<GetMercadoPagoPaymentDtoOut>;
    private parseJson;
}

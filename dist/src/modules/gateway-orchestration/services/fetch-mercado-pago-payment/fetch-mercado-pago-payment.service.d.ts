import { FetchMercadoPagoPaymentDtoIn } from './dtos/fetch-mercado-pago-payment.dto-in';
import { FetchMercadoPagoPaymentDtoOut } from './dtos/fetch-mercado-pago-payment.dto-out';
export declare class FetchMercadoPagoPaymentService {
    exec(dtoIn: FetchMercadoPagoPaymentDtoIn): Promise<FetchMercadoPagoPaymentDtoOut>;
    private mapMercadoPagoStatusToInternalStatus;
    private mapMercadoPagoStatusToProcessStatus;
    private extractMercadoPagoErrorMessage;
    private toNullableString;
    private formatExternalDate;
    private nowAsSqlDateTime;
    private formatDateToSqlDateTime;
    private pad;
}

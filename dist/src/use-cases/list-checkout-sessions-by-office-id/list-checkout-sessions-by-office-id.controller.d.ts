import { ListCheckoutSessionsByOfficeIdRequest } from './http/list-checkout-sessions-by-office-id.request';
import { ListCheckoutSessionsByOfficeIdUseCase } from './list-checkout-sessions-by-office-id.use-case';
export declare class ListCheckoutSessionsByOfficeIdController {
    private readonly listCheckoutSessionsByOfficeIdUseCase;
    constructor(listCheckoutSessionsByOfficeIdUseCase: ListCheckoutSessionsByOfficeIdUseCase);
    handle(body: ListCheckoutSessionsByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            items: {
                createdAt: string;
                items: number;
                cart: import("../../modules/order-report/entities/order-report.entity").OrderCartItem[];
                amount: number;
                id: string;
                code: string;
                customer: string;
                email: string | null;
                currency: string;
                method: string;
                requestedMethod: string | null;
                actualMethod: string | null;
                status: string;
            }[];
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
            summary: {
                total: number;
                amount: number;
                average: number;
            };
            asOf: string;
        } | import("./dtos/list-checkout-sessions-by-office-id.dto-out").ListCheckoutSessionsByOfficeIdDtoOut;
    }>;
}

import { ListCheckoutSessionsByOfficeIdRequest } from './http/list-checkout-sessions-by-office-id.request';
import { ListCheckoutSessionsByOfficeIdUseCase } from './list-checkout-sessions-by-office-id.use-case';
export declare class ListCheckoutSessionsByOfficeIdController {
    private readonly listCheckoutSessionsByOfficeIdUseCase;
    constructor(listCheckoutSessionsByOfficeIdUseCase: ListCheckoutSessionsByOfficeIdUseCase);
    handle(body: ListCheckoutSessionsByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            products: {
                quantity: number;
                amount: number;
            }[];
            timezone: string;
            from: string;
            to: string;
            currencies: Record<string, string | number>[];
            asOf: string;
        } | import("./dtos/list-checkout-sessions-by-office-id.dto-out").ListCheckoutSessionsByOfficeIdDtoOut | {
            items: {
                createdAt: string;
                lastActivityAt: string;
                everPaid: boolean;
                paidAt: string | null;
                items: number;
                cart: import("../../modules/order-report/entities/order-report.entity").OrderCartItem[];
                amount: number;
                id: string;
                status: string;
                currency: string;
                email: string | null;
                phone?: string | null | undefined;
                code: string;
                method: string;
                paymentCustomerId?: string | null | undefined;
                customer: string;
                orderRef?: string | null | undefined;
                requestedMethod: string | null;
                actualMethod: string | null;
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
        };
    }>;
}

import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { OrderReportRepository } from '../../modules/order-report/repositories/order-report.repository';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { GetAllCheckoutSessionsByOfficeIdService } from '../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListCheckoutSessionsByOfficeIdDtoIn } from './dtos/list-checkout-sessions-by-office-id.dto-in';
import { ListCheckoutSessionsByOfficeIdDtoOut } from './dtos/list-checkout-sessions-by-office-id.dto-out';
export declare class ListCheckoutSessionsByOfficeIdUseCase {
    private readonly identity;
    private readonly report;
    private readonly resolveActorAuthorizationService;
    private readonly getAllCheckoutSessionsByOfficeIdService;
    private readonly findOfficeByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(identity: GetAuthContextUseCase, report: OrderReportRepository, resolveActorAuthorizationService: ResolveActorAuthorizationService, getAllCheckoutSessionsByOfficeIdService: GetAllCheckoutSessionsByOfficeIdService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListCheckoutSessionsByOfficeIdDtoIn): Promise<{
        products: {
            quantity: number;
            amount: number;
        }[];
        timezone: string;
        from: string;
        to: string;
        currencies: Record<string, string | number>[];
        asOf: string;
    } | ListCheckoutSessionsByOfficeIdDtoOut | {
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
    }>;
}

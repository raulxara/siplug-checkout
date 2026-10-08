export declare class ListCheckoutSessionsByOfficeIdDtoIn {
    readonly report: boolean;
    readonly filters: import('../../../modules/order-report/entities/order-report.entity').OrderReportFilters;
    readonly token: string;
    readonly officeId: string;
    constructor(params: {
        token?: string;
        officeId?: string;
        report?: boolean;
        filters?: import('../../../modules/order-report/entities/order-report.entity').OrderReportFilters;
    });
}

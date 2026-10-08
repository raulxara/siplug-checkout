export class ListCheckoutSessionsByOfficeIdDtoIn {
  public readonly report: boolean;
  public readonly filters: import('../../../modules/order-report/entities/order-report.entity').OrderReportFilters;
  public readonly token: string;
  public readonly officeId: string;

  constructor(params: {
    token?: string;
    officeId?: string;
    report?: boolean;
    filters?: import('../../../modules/order-report/entities/order-report.entity').OrderReportFilters;
  }) {
    this.report = params.report === true;
    this.filters = params.filters ?? {};
    this.token = params.token ?? '';
    this.officeId = params.officeId ?? '';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }
  }
}

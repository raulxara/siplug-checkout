export class GetAllGatewaysDtoIn {
  public readonly token: string;
  public readonly status: string | null;
  public readonly search: string | null;
  public readonly page: number;
  public readonly perPage: number;

  constructor(params: {
    token?: string;
    status?: string | null;
    search?: string | null;
    page?: number | null;
    perPage?: number | null;
  }) {
    this.token = params.token ?? '';
    this.status = params.status ?? null;
    this.search = params.search ?? null;
    this.page = params.page && params.page > 0 ? params.page : 1;
    this.perPage = params.perPage && params.perPage > 0 ? params.perPage : 20;

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.perPage > 100) {
      throw new Error('perPage cannot be greater than 100');
    }
  }
}
export declare class GetAllGatewaysDtoIn {
    readonly token: string;
    readonly status: string | null;
    readonly search: string | null;
    readonly page: number;
    readonly perPage: number;
    constructor(params: {
        token?: string;
        status?: string | null;
        search?: string | null;
        page?: number | null;
        perPage?: number | null;
    });
}

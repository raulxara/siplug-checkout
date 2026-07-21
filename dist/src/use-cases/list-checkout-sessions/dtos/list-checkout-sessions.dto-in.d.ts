export declare class ListCheckoutSessionsDtoIn {
    readonly token: string;
    readonly officeId: string;
    readonly status: string | null;
    readonly search: string | null;
    readonly page: number;
    readonly perPage: number;
    constructor(params: {
        token?: string;
        officeId?: string;
        status?: string | null;
        search?: string | null;
        page?: number | null;
        perPage?: number | null;
    });
}

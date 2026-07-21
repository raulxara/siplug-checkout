export declare class ListUsersDtoIn {
    readonly token: string;
    readonly officeId: string | null;
    readonly status: string | null;
    readonly search: string | null;
    readonly page: number;
    readonly perPage: number;
    constructor(params: {
        token?: string;
        officeId?: string | null;
        status?: string | null;
        search?: string | null;
        page?: number | null;
        perPage?: number | null;
    });
}

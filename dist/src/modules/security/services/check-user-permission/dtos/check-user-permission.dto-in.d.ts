export declare class CheckUserPermissionDtoIn {
    readonly userCustomerId: string;
    readonly requiredAction: string;
    readonly requiredEntity: string | null;
    constructor(params: {
        userCustomerId: string;
        requiredAction: string;
        requiredEntity?: string | null;
    });
}

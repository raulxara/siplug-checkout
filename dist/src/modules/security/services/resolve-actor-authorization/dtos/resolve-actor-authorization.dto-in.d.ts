export declare class ResolveActorAuthorizationDtoIn {
    readonly token: string;
    readonly requiredAction: string;
    readonly requiredEntity: string | null;
    constructor(params: {
        token: string;
        requiredAction: string;
        requiredEntity?: string | null;
    });
}

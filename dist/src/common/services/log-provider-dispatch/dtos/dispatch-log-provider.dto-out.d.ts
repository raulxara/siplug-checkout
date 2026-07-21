export declare class DispatchLogProviderDtoOut {
    readonly success: boolean;
    readonly statusCode: number;
    readonly body: Record<string, unknown>;
    constructor(success: boolean, statusCode: number, body: Record<string, unknown>);
}

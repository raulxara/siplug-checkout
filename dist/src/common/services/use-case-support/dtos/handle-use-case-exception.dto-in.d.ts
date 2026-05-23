export declare class HandleUseCaseExceptionDtoIn {
    readonly useCase: string;
    readonly error: unknown;
    readonly context: Record<string, unknown>;
    constructor(params: {
        useCase: string;
        error: unknown;
        context?: Record<string, unknown>;
    });
}

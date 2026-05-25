export declare class HandleUseCaseExceptionDtoIn {
    readonly useCase: string;
    readonly error: unknown;
    readonly context: Record<string, unknown>;
    readonly appFile: string | null;
    constructor(params: {
        useCase: string;
        error: unknown;
        context?: Record<string, unknown>;
        appFile?: string | null;
    });
}

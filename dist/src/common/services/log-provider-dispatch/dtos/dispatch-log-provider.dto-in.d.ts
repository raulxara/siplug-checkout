export declare class DispatchLogProviderDtoIn {
    readonly appName: string;
    readonly appEnv: string;
    readonly appFile: string;
    readonly useCase: string;
    readonly type: string;
    readonly message: string;
    readonly trace: string | null;
    readonly config: Record<string, unknown> | null;
    constructor(params: {
        appName: string;
        appEnv: string;
        appFile: string;
        useCase: string;
        type: string;
        message: string;
        trace?: string | null;
        config?: Record<string, unknown> | null;
    });
}

export declare class BuildChangesHistoryDtoIn {
    readonly currentChangesHistory: Array<Record<string, unknown>> | null;
    readonly oldData: Record<string, unknown>;
    readonly newData: Record<string, unknown>;
    readonly source: string;
    constructor(params: {
        currentChangesHistory?: Array<Record<string, unknown>> | null;
        oldData: Record<string, unknown>;
        newData: Record<string, unknown>;
        source?: string;
    });
}

export declare class BuildChangesHistoryDtoOut {
    readonly changesHistory: Array<Record<string, unknown>>;
    readonly details: Record<string, {
        old: unknown;
        new: unknown;
    }>;
    readonly hasChanges: boolean;
    constructor(params: {
        changesHistory: Array<Record<string, unknown>>;
        details: Record<string, {
            old: unknown;
            new: unknown;
        }>;
        hasChanges: boolean;
    });
}

export class BuildChangesHistoryDtoOut {
  public readonly changesHistory: Array<Record<string, unknown>>;
  public readonly details: Record<string, { old: unknown; new: unknown }>;
  public readonly hasChanges: boolean;

  constructor(params: {
    changesHistory: Array<Record<string, unknown>>;
    details: Record<string, { old: unknown; new: unknown }>;
    hasChanges: boolean;
  }) {
    this.changesHistory = params.changesHistory;
    this.details = params.details;
    this.hasChanges = params.hasChanges;
  }
}
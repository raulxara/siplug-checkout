export class BuildChangesHistoryDtoIn {
  public readonly currentChangesHistory: Array<Record<string, unknown>> | null;
  public readonly oldData: Record<string, unknown>;
  public readonly newData: Record<string, unknown>;
  public readonly source: string;

  constructor(params: {
    currentChangesHistory?: Array<Record<string, unknown>> | null;
    oldData: Record<string, unknown>;
    newData: Record<string, unknown>;
    source?: string;
  }) {
    this.currentChangesHistory = params.currentChangesHistory ?? null;
    this.oldData = params.oldData;
    this.newData = params.newData;
    this.source = params.source ?? 'system';
  }
}
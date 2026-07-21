import { SyncSplitRuleRecipientsRequest } from './http/sync-split-rule-recipients.request';
import { SyncSplitRuleRecipientsUseCase } from './sync-split-rule-recipients.use-case';
export declare class SyncSplitRuleRecipientsController {
    private readonly syncSplitRuleRecipientsUseCase;
    constructor(syncSplitRuleRecipientsUseCase: SyncSplitRuleRecipientsUseCase);
    handle(request: SyncSplitRuleRecipientsRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRule: Record<string, unknown>;
            splitRuleRecipients: Record<string, unknown>[];
            createdCount: number;
            updatedCount: number;
            inactivatedCount: number;
        };
    }>;
    private resolveToken;
}

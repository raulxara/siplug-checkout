export declare class SyncSplitRuleRecipientRequestItem {
    splitRecipientId: string;
    role?: string;
    percentage?: number;
    fixedAmount?: number;
    liableForGatewayFee?: boolean;
    liableForRefund?: boolean;
    priority?: number;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
}
export declare class SyncSplitRuleRecipientsRequest {
    token?: string;
    splitRuleId: string;
    recipients: SyncSplitRuleRecipientRequestItem[];
}

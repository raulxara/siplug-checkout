export declare class SyncPaymentTransactionStatusDtoIn {
    readonly token: string;
    readonly paymentTransactionId: string;
    readonly force: boolean;
    constructor(params: {
        token: string;
        paymentTransactionId: string;
        force?: boolean | null;
    });
}

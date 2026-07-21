export declare class UpdatePaymentCustomerDtoIn {
    readonly _id: string;
    readonly officeId: string | null;
    readonly clientId: string | null;
    readonly profileId: string | null;
    readonly externalReference: string | null;
    readonly name: string | null;
    readonly email: string | null;
    readonly documentType: string | null;
    readonly documentValue: string | null;
    readonly phone: string | null;
    readonly billingAddress: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        officeId?: string | null;
        clientId?: string | null;
        profileId?: string | null;
        externalReference?: string | null;
        name?: string | null;
        email?: string | null;
        documentType?: string | null;
        documentValue?: string | null;
        phone?: string | null;
        billingAddress?: Record<string, unknown> | null;
        metadata?: Record<string, unknown> | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}

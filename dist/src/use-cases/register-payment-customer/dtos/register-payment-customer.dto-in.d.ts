export declare class RegisterPaymentCustomerDtoIn {
    readonly token: string;
    readonly officeId: string;
    readonly clientId: string;
    readonly profileId: string | null;
    readonly externalReference: string | null;
    readonly name: string;
    readonly email: string | null;
    readonly documentType: string | null;
    readonly documentValue: string | null;
    readonly phone: string | null;
    readonly billingAddress: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        token?: string;
        officeId?: string;
        clientId?: string;
        profileId?: string | null;
        externalReference?: string | null;
        name?: string;
        email?: string | null;
        documentType?: string | null;
        documentValue?: string | null;
        phone?: string | null;
        billingAddress?: Record<string, unknown> | null;
        metadata?: Record<string, unknown> | null;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}

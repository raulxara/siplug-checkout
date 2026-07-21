export declare class UpdatePaymentCustomerRequest {
    token?: string;
    paymentCustomerId: string;
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
}

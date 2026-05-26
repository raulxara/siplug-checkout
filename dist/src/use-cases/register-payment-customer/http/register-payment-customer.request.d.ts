export declare class RegisterPaymentCustomerRequest {
    token?: string;
    officeId: string;
    clientId: string;
    profileId?: string | null;
    externalReference?: string | null;
    name: string;
    email?: string | null;
    documentType?: string | null;
    documentValue?: string | null;
    phone?: string | null;
    billingAddress?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string;
}

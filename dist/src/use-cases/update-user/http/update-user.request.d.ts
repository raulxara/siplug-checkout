export declare class UpdateUserRequest {
    token?: string;
    userCustomerId: string;
    officeId?: string | null;
    positionSlug?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    documentType?: string | null;
    documentValue?: string | null;
    username?: string | null;
    password?: string | null;
    userType?: string | null;
    twoFaRequired?: boolean | null;
    twoFaActive?: boolean | null;
    profileConfig?: Record<string, unknown> | null;
    clientConfig?: Record<string, unknown> | null;
    userCustomerConfig?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
}

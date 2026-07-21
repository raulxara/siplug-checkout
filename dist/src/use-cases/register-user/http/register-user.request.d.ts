export declare class RegisterUserRequest {
    token?: string;
    officeId: string;
    positionSlug?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    documentType?: string | null;
    documentValue?: string | null;
    username: string;
    password: string;
    userType?: string;
    twoFaRequired?: boolean;
    twoFaChannels?: string[];
    profileConfig?: Record<string, unknown> | null;
    clientConfig?: Record<string, unknown> | null;
    userCustomerConfig?: Record<string, unknown> | null;
    status?: string;
}

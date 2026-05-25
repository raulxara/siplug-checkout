"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDtoIn = void 0;
class RegisterUserDtoIn {
    token;
    officeId;
    positionSlug;
    firstName;
    lastName;
    email;
    phone;
    documentType;
    documentValue;
    username;
    password;
    userType;
    twoFaRequired;
    twoFaChannels;
    profileConfig;
    clientConfig;
    userCustomerConfig;
    status;
    constructor(params) {
        this.token = params.token ?? '';
        this.officeId = params.officeId ?? '';
        this.positionSlug = params.positionSlug ?? 'customer';
        this.firstName = params.firstName ?? '';
        this.lastName = params.lastName ?? '';
        this.email = params.email ?? '';
        this.phone = params.phone ?? null;
        this.documentType = params.documentType ?? null;
        this.documentValue = params.documentValue ?? null;
        this.username = params.username ?? '';
        this.password = params.password ?? '';
        this.userType = params.userType ?? 'customer';
        this.twoFaRequired = params.twoFaRequired ?? false;
        this.twoFaChannels = params.twoFaChannels ?? [];
        this.profileConfig = params.profileConfig ?? null;
        this.clientConfig = params.clientConfig ?? null;
        this.userCustomerConfig = params.userCustomerConfig ?? null;
        this.status = params.status ?? 'active';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (this.positionSlug.trim() === '') {
            throw new Error('positionSlug is required');
        }
        if (this.firstName.trim() === '') {
            throw new Error('firstName is required');
        }
        if (this.lastName.trim() === '') {
            throw new Error('lastName is required');
        }
        if (this.email.trim() === '') {
            throw new Error('email is required');
        }
        if (this.username.trim() === '') {
            throw new Error('username is required');
        }
        if (this.password.trim() === '') {
            throw new Error('password is required');
        }
        if (this.twoFaRequired && this.twoFaChannels.length === 0) {
            throw new Error('twoFaChannels is required when twoFaRequired is true');
        }
        for (const channel of this.twoFaChannels) {
            if (!['email', 'sms'].includes(channel)) {
                throw new Error('twoFaChannels contains invalid value');
            }
        }
    }
}
exports.RegisterUserDtoIn = RegisterUserDtoIn;
//# sourceMappingURL=register-user.dto-in.js.map
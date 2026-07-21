"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDtoIn = void 0;
class UpdateUserDtoIn {
    token;
    userCustomerId;
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
    twoFaActive;
    profileConfig;
    clientConfig;
    userCustomerConfig;
    status;
    source;
    constructor(params) {
        this.token = params.token ?? '';
        this.userCustomerId = params.userCustomerId ?? '';
        this.officeId = params.officeId ?? null;
        this.positionSlug = params.positionSlug ?? null;
        this.firstName = params.firstName ?? null;
        this.lastName = params.lastName ?? null;
        this.email = params.email ?? null;
        this.phone = params.phone ?? null;
        this.documentType = params.documentType ?? null;
        this.documentValue = params.documentValue ?? null;
        this.username = params.username ?? null;
        this.password = params.password ?? null;
        this.userType = params.userType ?? null;
        this.twoFaRequired = params.twoFaRequired ?? null;
        this.twoFaActive = params.twoFaActive ?? null;
        this.profileConfig = params.profileConfig ?? null;
        this.clientConfig = params.clientConfig ?? null;
        this.userCustomerConfig = params.userCustomerConfig ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateUserUseCase';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
    }
}
exports.UpdateUserDtoIn = UpdateUserDtoIn;
//# sourceMappingURL=update-user.dto-in.js.map
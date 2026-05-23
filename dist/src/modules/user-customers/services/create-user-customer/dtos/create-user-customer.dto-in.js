"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserCustomerDtoIn = void 0;
class CreateUserCustomerDtoIn {
    clientId;
    profileId;
    token;
    twoFaRequired;
    twoFaActive;
    config;
    status;
    constructor(params) {
        this.clientId = params.clientId;
        this.profileId = params.profileId;
        this.token = params.token;
        this.twoFaRequired = params.twoFaRequired ?? false;
        this.twoFaActive = params.twoFaActive ?? false;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.clientId.trim() === '') {
            throw new Error('clientId is required');
        }
        if (this.profileId.trim() === '') {
            throw new Error('profileId is required');
        }
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
    }
}
exports.CreateUserCustomerDtoIn = CreateUserCustomerDtoIn;
//# sourceMappingURL=create-user-customer.dto-in.js.map
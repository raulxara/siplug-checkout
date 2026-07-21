"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserCustomerDtoIn = void 0;
class UpdateUserCustomerDtoIn {
    _id;
    clientId;
    profileId;
    token;
    twoFaRequired;
    twoFaActive;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.clientId = params.clientId ?? null;
        this.profileId = params.profileId ?? null;
        this.token = params.token ?? null;
        this.twoFaRequired = params.twoFaRequired ?? null;
        this.twoFaActive = params.twoFaActive ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateUserCustomerDtoIn = UpdateUserCustomerDtoIn;
//# sourceMappingURL=update-user-customer.dto-in.js.map
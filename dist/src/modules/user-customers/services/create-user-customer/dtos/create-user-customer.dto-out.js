"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserCustomerDtoOut = void 0;
class CreateUserCustomerDtoOut {
    id;
    _id;
    clientId;
    profileId;
    token;
    twoFaRequired;
    twoFaActive;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, clientId, profileId, token, twoFaRequired, twoFaActive, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.clientId = clientId;
        this.profileId = profileId;
        this.token = token;
        this.twoFaRequired = twoFaRequired;
        this.twoFaActive = twoFaActive;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateUserCustomerDtoOut(entity.id ?? 0, entity._id ?? '', entity.clientId, entity.profileId, entity.token, entity.twoFaRequired, entity.twoFaActive, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateUserCustomerDtoOut = CreateUserCustomerDtoOut;
//# sourceMappingURL=create-user-customer.dto-out.js.map
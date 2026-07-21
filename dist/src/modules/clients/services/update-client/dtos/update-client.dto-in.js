"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientDtoIn = void 0;
class UpdateClientDtoIn {
    _id;
    officeId;
    customerId;
    userType;
    username;
    password;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.officeId = params.officeId ?? null;
        this.customerId = params.customerId ?? null;
        this.userType = params.userType ?? null;
        this.username = params.username ?? null;
        this.password = params.password ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateClientDtoIn = UpdateClientDtoIn;
//# sourceMappingURL=update-client.dto-in.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserAccessCodeDtoIn = void 0;
class UpdateUserAccessCodeDtoIn {
    _id;
    channel;
    destination;
    code;
    expiresAt;
    usedAt;
    sentAt;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.channel = params.channel ?? null;
        this.destination = params.destination ?? null;
        this.code = params.code ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.usedAt = params.usedAt ?? null;
        this.sentAt = params.sentAt ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateUserAccessCodeDtoIn = UpdateUserAccessCodeDtoIn;
//# sourceMappingURL=update-user-access-code.dto-in.js.map
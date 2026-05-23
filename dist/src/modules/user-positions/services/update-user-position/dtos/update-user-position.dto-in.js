"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPositionDtoIn = void 0;
class UpdateUserPositionDtoIn {
    _id;
    userCustomerId;
    positionId;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.userCustomerId = params.userCustomerId ?? null;
        this.positionId = params.positionId ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateUserPositionDtoIn = UpdateUserPositionDtoIn;
//# sourceMappingURL=update-user-position.dto-in.js.map
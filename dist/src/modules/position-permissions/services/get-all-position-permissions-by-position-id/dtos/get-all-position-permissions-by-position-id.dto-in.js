"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPositionPermissionsByPositionIdDtoIn = void 0;
class GetAllPositionPermissionsByPositionIdDtoIn {
    positionId;
    constructor(positionId) {
        this.positionId = positionId;
        if (this.positionId.trim() === '') {
            throw new Error('positionId is required');
        }
    }
}
exports.GetAllPositionPermissionsByPositionIdDtoIn = GetAllPositionPermissionsByPositionIdDtoIn;
//# sourceMappingURL=get-all-position-permissions-by-position-id.dto-in.js.map
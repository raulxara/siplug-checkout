"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserDtoOut = void 0;
class GetUserDtoOut {
    profile;
    client;
    userCustomer;
    userPositions;
    positions;
    accessCodes;
    constructor(profile, client, userCustomer, userPositions, positions, accessCodes) {
        this.profile = profile;
        this.client = client;
        this.userCustomer = userCustomer;
        this.userPositions = userPositions;
        this.positions = positions;
        this.accessCodes = accessCodes;
    }
}
exports.GetUserDtoOut = GetUserDtoOut;
//# sourceMappingURL=get-user.dto-out.js.map
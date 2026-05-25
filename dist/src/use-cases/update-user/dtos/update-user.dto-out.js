"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDtoOut = void 0;
class UpdateUserDtoOut {
    profile;
    client;
    userCustomer;
    userPositions;
    createdUserPositions;
    activatedUserPositions;
    inactivatedUserPositions;
    constructor(profile, client, userCustomer, userPositions, createdUserPositions, activatedUserPositions, inactivatedUserPositions) {
        this.profile = profile;
        this.client = client;
        this.userCustomer = userCustomer;
        this.userPositions = userPositions;
        this.createdUserPositions = createdUserPositions;
        this.activatedUserPositions = activatedUserPositions;
        this.inactivatedUserPositions = inactivatedUserPositions;
    }
}
exports.UpdateUserDtoOut = UpdateUserDtoOut;
//# sourceMappingURL=update-user.dto-out.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDtoOut = void 0;
class RegisterUserDtoOut {
    profile;
    client;
    userCustomer;
    userPosition;
    accessCodes;
    constructor(profile, client, userCustomer, userPosition, accessCodes) {
        this.profile = profile;
        this.client = client;
        this.userCustomer = userCustomer;
        this.userPosition = userPosition;
        this.accessCodes = accessCodes;
    }
}
exports.RegisterUserDtoOut = RegisterUserDtoOut;
//# sourceMappingURL=register-user.dto-out.js.map
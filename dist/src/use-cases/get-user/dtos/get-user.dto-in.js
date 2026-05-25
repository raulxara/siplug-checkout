"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserDtoIn = void 0;
class GetUserDtoIn {
    token;
    userCustomerId;
    constructor(params) {
        this.token = params.token ?? '';
        this.userCustomerId = params.userCustomerId ?? '';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
    }
}
exports.GetUserDtoIn = GetUserDtoIn;
//# sourceMappingURL=get-user.dto-in.js.map
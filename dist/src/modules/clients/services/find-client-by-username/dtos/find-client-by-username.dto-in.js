"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindClientByUsernameDtoIn = void 0;
class FindClientByUsernameDtoIn {
    username;
    constructor(username) {
        this.username = username;
        if (this.username.trim() === '') {
            throw new Error('username is required');
        }
    }
}
exports.FindClientByUsernameDtoIn = FindClientByUsernameDtoIn;
//# sourceMappingURL=find-client-by-username.dto-in.js.map
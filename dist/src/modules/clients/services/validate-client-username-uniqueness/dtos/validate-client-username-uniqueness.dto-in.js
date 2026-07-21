"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateClientUsernameUniquenessDtoIn = void 0;
class ValidateClientUsernameUniquenessDtoIn {
    username;
    constructor(username) {
        this.username = username;
        if (this.username.trim() === '') {
            throw new Error('username is required');
        }
    }
}
exports.ValidateClientUsernameUniquenessDtoIn = ValidateClientUsernameUniquenessDtoIn;
//# sourceMappingURL=validate-client-username-uniqueness.dto-in.js.map
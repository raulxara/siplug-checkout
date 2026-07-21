"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProfileByEmailDtoIn = void 0;
class FindProfileByEmailDtoIn {
    email;
    constructor(email) {
        this.email = email;
        if (this.email.trim() === '') {
            throw new Error('email is required');
        }
    }
}
exports.FindProfileByEmailDtoIn = FindProfileByEmailDtoIn;
//# sourceMappingURL=find-profile-by-email.dto-in.js.map
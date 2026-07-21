"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateProfileEmailUniquenessDtoIn = void 0;
class ValidateProfileEmailUniquenessDtoIn {
    email;
    constructor(email) {
        this.email = email;
        if (this.email.trim() === '') {
            throw new Error('email is required');
        }
    }
}
exports.ValidateProfileEmailUniquenessDtoIn = ValidateProfileEmailUniquenessDtoIn;
//# sourceMappingURL=validate-profile-email-uniqueness.dto-in.js.map
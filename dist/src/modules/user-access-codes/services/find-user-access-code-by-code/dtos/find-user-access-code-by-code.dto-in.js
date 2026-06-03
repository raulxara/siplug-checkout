"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserAccessCodeByCodeDtoIn = void 0;
class FindUserAccessCodeByCodeDtoIn {
    code;
    constructor(code) {
        this.code = code;
        if (this.code.trim() === '') {
            throw new Error('code is required');
        }
    }
}
exports.FindUserAccessCodeByCodeDtoIn = FindUserAccessCodeByCodeDtoIn;
//# sourceMappingURL=find-user-access-code-by-code.dto-in.js.map
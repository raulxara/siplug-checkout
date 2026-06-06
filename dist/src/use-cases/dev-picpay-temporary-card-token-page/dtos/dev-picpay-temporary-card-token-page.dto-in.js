"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevPicPayTemporaryCardTokenPageDtoIn = void 0;
class DevPicPayTemporaryCardTokenPageDtoIn {
    apiCredentialId;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
    }
}
exports.DevPicPayTemporaryCardTokenPageDtoIn = DevPicPayTemporaryCardTokenPageDtoIn;
//# sourceMappingURL=dev-picpay-temporary-card-token-page.dto-in.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevPagSeguroEncryptedCardPageDtoIn = void 0;
class DevPagSeguroEncryptedCardPageDtoIn {
    apiCredentialId;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
    }
}
exports.DevPagSeguroEncryptedCardPageDtoIn = DevPagSeguroEncryptedCardPageDtoIn;
//# sourceMappingURL=dev-pagseguro-encrypted-card-page.dto-in.js.map
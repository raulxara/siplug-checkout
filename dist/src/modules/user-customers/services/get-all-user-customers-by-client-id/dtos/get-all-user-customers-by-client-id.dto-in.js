"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUserCustomersByClientIdDtoIn = void 0;
class GetAllUserCustomersByClientIdDtoIn {
    clientId;
    constructor(clientId) {
        this.clientId = clientId;
        if (this.clientId.trim() === '') {
            throw new Error('clientId is required');
        }
    }
}
exports.GetAllUserCustomersByClientIdDtoIn = GetAllUserCustomersByClientIdDtoIn;
//# sourceMappingURL=get-all-user-customers-by-client-id.dto-in.js.map
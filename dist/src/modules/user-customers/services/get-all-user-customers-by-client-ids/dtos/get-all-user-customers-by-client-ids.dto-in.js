"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUserCustomersByClientIdsDtoIn = void 0;
class GetAllUserCustomersByClientIdsDtoIn {
    clientIds;
    constructor(clientIds) {
        this.clientIds = clientIds;
        if (!Array.isArray(this.clientIds) || this.clientIds.length === 0) {
            throw new Error('clientIds is required');
        }
        for (const clientId of this.clientIds) {
            if (clientId.trim() === '') {
                throw new Error('clientIds contains invalid value');
            }
        }
    }
}
exports.GetAllUserCustomersByClientIdsDtoIn = GetAllUserCustomersByClientIdsDtoIn;
//# sourceMappingURL=get-all-user-customers-by-client-ids.dto-in.js.map
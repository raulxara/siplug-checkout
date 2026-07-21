"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientDtoIn = void 0;
class CreateClientDtoIn {
    officeId;
    customerId;
    userType;
    username;
    password;
    config;
    status;
    constructor(params) {
        this.officeId = params.officeId;
        this.customerId = params.customerId ?? null;
        this.userType = params.userType ?? 'client';
        this.username = params.username;
        this.password = params.password;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (this.userType.trim() === '') {
            throw new Error('userType is required');
        }
        if (this.username.trim() === '') {
            throw new Error('username is required');
        }
        if (this.password.trim() === '') {
            throw new Error('password is required');
        }
    }
}
exports.CreateClientDtoIn = CreateClientDtoIn;
//# sourceMappingURL=create-client.dto-in.js.map
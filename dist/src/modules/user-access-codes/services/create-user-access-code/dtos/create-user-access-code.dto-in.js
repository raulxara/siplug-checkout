"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserAccessCodeDtoIn = void 0;
class CreateUserAccessCodeDtoIn {
    userCustomerId;
    channel;
    destination;
    code;
    expiresAt;
    config;
    status;
    constructor(params) {
        this.userCustomerId = params.userCustomerId;
        this.channel = params.channel;
        this.destination = params.destination;
        this.code = params.code;
        this.expiresAt = params.expiresAt ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'created';
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
        if (this.channel.trim() === '') {
            throw new Error('channel is required');
        }
        if (this.destination.trim() === '') {
            throw new Error('destination is required');
        }
        if (this.code.trim() === '') {
            throw new Error('code is required');
        }
    }
}
exports.CreateUserAccessCodeDtoIn = CreateUserAccessCodeDtoIn;
//# sourceMappingURL=create-user-access-code.dto-in.js.map
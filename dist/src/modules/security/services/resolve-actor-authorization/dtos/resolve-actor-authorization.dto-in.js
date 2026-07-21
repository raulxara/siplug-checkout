"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveActorAuthorizationDtoIn = void 0;
class ResolveActorAuthorizationDtoIn {
    token;
    requiredAction;
    requiredEntity;
    constructor(params) {
        this.token = params.token;
        this.requiredAction = params.requiredAction;
        this.requiredEntity = params.requiredEntity ?? null;
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.requiredAction.trim() === '') {
            throw new Error('requiredAction is required');
        }
    }
}
exports.ResolveActorAuthorizationDtoIn = ResolveActorAuthorizationDtoIn;
//# sourceMappingURL=resolve-actor-authorization.dto-in.js.map
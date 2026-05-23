"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveActorAuthorizationDtoOut = void 0;
class ResolveActorAuthorizationDtoOut {
    allowed;
    isAdministrator;
    requiredAction;
    requiredEntity;
    actor;
    positions;
    permissions;
    matchedPermission;
    constructor(allowed, isAdministrator, requiredAction, requiredEntity, actor, positions, permissions, matchedPermission) {
        this.allowed = allowed;
        this.isAdministrator = isAdministrator;
        this.requiredAction = requiredAction;
        this.requiredEntity = requiredEntity;
        this.actor = actor;
        this.positions = positions;
        this.permissions = permissions;
        this.matchedPermission = matchedPermission;
    }
}
exports.ResolveActorAuthorizationDtoOut = ResolveActorAuthorizationDtoOut;
//# sourceMappingURL=resolve-actor-authorization.dto-out.js.map
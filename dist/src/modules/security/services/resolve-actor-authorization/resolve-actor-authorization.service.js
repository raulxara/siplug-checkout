"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveActorAuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const find_user_customer_by_token_dto_in_1 = require("../../../user-customers/services/find-user-customer-by-token/dtos/find-user-customer-by-token.dto-in");
const find_user_customer_by_token_service_1 = require("../../../user-customers/services/find-user-customer-by-token/find-user-customer-by-token.service");
const check_user_permission_dto_in_1 = require("../check-user-permission/dtos/check-user-permission.dto-in");
const check_user_permission_service_1 = require("../check-user-permission/check-user-permission.service");
const resolve_actor_authorization_dto_out_1 = require("./dtos/resolve-actor-authorization.dto-out");
let ResolveActorAuthorizationService = class ResolveActorAuthorizationService {
    findUserCustomerByTokenService;
    checkUserPermissionService;
    constructor(findUserCustomerByTokenService, checkUserPermissionService) {
        this.findUserCustomerByTokenService = findUserCustomerByTokenService;
        this.checkUserPermissionService = checkUserPermissionService;
    }
    async exec(dtoIn) {
        try {
            const userCustomerDtoOut = await this.findUserCustomerByTokenService.exec(new find_user_customer_by_token_dto_in_1.FindUserCustomerByTokenDtoIn(dtoIn.token));
            const actor = userCustomerDtoOut.userCustomer;
            if (actor.status !== 'active') {
                throw new Error('actor is not active');
            }
            const permissionDtoOut = await this.checkUserPermissionService.exec(new check_user_permission_dto_in_1.CheckUserPermissionDtoIn({
                userCustomerId: actor._id,
                requiredAction: dtoIn.requiredAction,
                requiredEntity: dtoIn.requiredEntity,
            }));
            if (!permissionDtoOut.allowed) {
                throw new Error('actor does not have permission');
            }
            return new resolve_actor_authorization_dto_out_1.ResolveActorAuthorizationDtoOut(permissionDtoOut.allowed, permissionDtoOut.isAdministrator, dtoIn.requiredAction, dtoIn.requiredEntity, actor, permissionDtoOut.positions, permissionDtoOut.permissions, permissionDtoOut.matchedPermission);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on resolve actor authorization';
            throw new Error(message);
        }
    }
};
exports.ResolveActorAuthorizationService = ResolveActorAuthorizationService;
exports.ResolveActorAuthorizationService = ResolveActorAuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_user_customer_by_token_service_1.FindUserCustomerByTokenService,
        check_user_permission_service_1.CheckUserPermissionService])
], ResolveActorAuthorizationService);
//# sourceMappingURL=resolve-actor-authorization.service.js.map
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
exports.CheckUserPermissionService = void 0;
const common_1 = require("@nestjs/common");
const get_all_permissions_by_unique_ids_dto_in_1 = require("../../../permissions/services/get-all-permissions-by-unique-ids/dtos/get-all-permissions-by-unique-ids.dto-in");
const get_all_permissions_by_unique_ids_service_1 = require("../../../permissions/services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service");
const get_all_position_permissions_by_position_ids_dto_in_1 = require("../../../position-permissions/services/get-all-position-permissions-by-position-ids/dtos/get-all-position-permissions-by-position-ids.dto-in");
const get_all_position_permissions_by_position_ids_service_1 = require("../../../position-permissions/services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service");
const get_all_positions_by_unique_ids_dto_in_1 = require("../../../positions/services/get-all-positions-by-unique-ids/dtos/get-all-positions-by-unique-ids.dto-in");
const get_all_positions_by_unique_ids_service_1 = require("../../../positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service");
const get_all_user_positions_by_user_customer_id_dto_in_1 = require("../../../user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in");
const get_all_user_positions_by_user_customer_id_service_1 = require("../../../user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service");
const check_user_permission_dto_out_1 = require("./dtos/check-user-permission.dto-out");
let CheckUserPermissionService = class CheckUserPermissionService {
    getAllUserPositionsByUserCustomerIdService;
    getAllPositionsByUniqueIdsService;
    getAllPositionPermissionsByPositionIdsService;
    getAllPermissionsByUniqueIdsService;
    constructor(getAllUserPositionsByUserCustomerIdService, getAllPositionsByUniqueIdsService, getAllPositionPermissionsByPositionIdsService, getAllPermissionsByUniqueIdsService) {
        this.getAllUserPositionsByUserCustomerIdService = getAllUserPositionsByUserCustomerIdService;
        this.getAllPositionsByUniqueIdsService = getAllPositionsByUniqueIdsService;
        this.getAllPositionPermissionsByPositionIdsService = getAllPositionPermissionsByPositionIdsService;
        this.getAllPermissionsByUniqueIdsService = getAllPermissionsByUniqueIdsService;
    }
    async exec(dtoIn) {
        try {
            const userPositionsDtoOut = await this.getAllUserPositionsByUserCustomerIdService.exec(new get_all_user_positions_by_user_customer_id_dto_in_1.GetAllUserPositionsByUserCustomerIdDtoIn(dtoIn.userCustomerId));
            const activeUserPositions = userPositionsDtoOut.items.filter((item) => item.status === 'active');
            if (activeUserPositions.length === 0) {
                return new check_user_permission_dto_out_1.CheckUserPermissionDtoOut(false, false, dtoIn.requiredAction, dtoIn.requiredEntity, [], [], [], [], null);
            }
            const positionIds = activeUserPositions.map((item) => item.positionId);
            const positionsDtoOut = await this.getAllPositionsByUniqueIdsService.exec(new get_all_positions_by_unique_ids_dto_in_1.GetAllPositionsByUniqueIdsDtoIn(positionIds));
            const activePositions = positionsDtoOut.items.filter((item) => item.status === 'active');
            const isAdministrator = activePositions.some((position) => position.slug === 'administrator');
            if (isAdministrator) {
                return new check_user_permission_dto_out_1.CheckUserPermissionDtoOut(true, true, dtoIn.requiredAction, dtoIn.requiredEntity, activePositions, activeUserPositions, [], [], null);
            }
            if (activePositions.length === 0) {
                return new check_user_permission_dto_out_1.CheckUserPermissionDtoOut(false, false, dtoIn.requiredAction, dtoIn.requiredEntity, [], activeUserPositions, [], [], null);
            }
            const activePositionIds = activePositions.map((item) => item._id);
            const positionPermissionsDtoOut = await this.getAllPositionPermissionsByPositionIdsService.exec(new get_all_position_permissions_by_position_ids_dto_in_1.GetAllPositionPermissionsByPositionIdsDtoIn(activePositionIds));
            const activePositionPermissions = positionPermissionsDtoOut.items.filter((item) => item.status === 'active');
            if (activePositionPermissions.length === 0) {
                return new check_user_permission_dto_out_1.CheckUserPermissionDtoOut(false, false, dtoIn.requiredAction, dtoIn.requiredEntity, activePositions, activeUserPositions, [], [], null);
            }
            const permissionIds = [
                ...new Set(activePositionPermissions.map((item) => item.permissionId)),
            ];
            const permissionsDtoOut = await this.getAllPermissionsByUniqueIdsService.exec(new get_all_permissions_by_unique_ids_dto_in_1.GetAllPermissionsByUniqueIdsDtoIn(permissionIds));
            const activePermissions = permissionsDtoOut.items.filter((item) => item.status === 'active');
            const matchedPermission = activePermissions.find((permission) => {
                const actionMatches = permission.action === dtoIn.requiredAction;
                const entityMatches = dtoIn.requiredEntity === null ||
                    permission.entity === dtoIn.requiredEntity;
                return actionMatches && entityMatches;
            });
            return new check_user_permission_dto_out_1.CheckUserPermissionDtoOut(Boolean(matchedPermission), false, dtoIn.requiredAction, dtoIn.requiredEntity, activePositions, activeUserPositions, activePositionPermissions, activePermissions, matchedPermission ?? null);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on check user permission';
            throw new Error(message);
        }
    }
};
exports.CheckUserPermissionService = CheckUserPermissionService;
exports.CheckUserPermissionService = CheckUserPermissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_all_user_positions_by_user_customer_id_service_1.GetAllUserPositionsByUserCustomerIdService,
        get_all_positions_by_unique_ids_service_1.GetAllPositionsByUniqueIdsService,
        get_all_position_permissions_by_position_ids_service_1.GetAllPositionPermissionsByPositionIdsService,
        get_all_permissions_by_unique_ids_service_1.GetAllPermissionsByUniqueIdsService])
], CheckUserPermissionService);
//# sourceMappingURL=check-user-permission.service.js.map
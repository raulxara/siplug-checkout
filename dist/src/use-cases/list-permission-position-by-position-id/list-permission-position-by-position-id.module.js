"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPermissionPositionByPositionIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const position_permissions_module_1 = require("../../modules/position-permissions/position-permissions.module");
const positions_module_1 = require("../../modules/positions/positions.module");
const list_permission_position_by_position_id_controller_1 = require("./list-permission-position-by-position-id.controller");
const list_permission_position_by_position_id_use_case_1 = require("./list-permission-position-by-position-id.use-case");
let ListPermissionPositionByPositionIdModule = class ListPermissionPositionByPositionIdModule {
};
exports.ListPermissionPositionByPositionIdModule = ListPermissionPositionByPositionIdModule;
exports.ListPermissionPositionByPositionIdModule = ListPermissionPositionByPositionIdModule = __decorate([
    (0, common_1.Module)({
        imports: [positions_module_1.PositionsModule, position_permissions_module_1.PositionPermissionsModule, use_case_support_module_1.UseCaseSupportModule],
        controllers: [list_permission_position_by_position_id_controller_1.ListPermissionPositionByPositionIdController],
        providers: [list_permission_position_by_position_id_use_case_1.ListPermissionPositionByPositionIdUseCase],
        exports: [list_permission_position_by_position_id_use_case_1.ListPermissionPositionByPositionIdUseCase],
    })
], ListPermissionPositionByPositionIdModule);
//# sourceMappingURL=list-permission-position-by-position-id.module.js.map
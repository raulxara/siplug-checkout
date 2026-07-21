"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPositionByOfficeIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const positions_module_1 = require("../../modules/positions/positions.module");
const list_position_by_office_id_controller_1 = require("./list-position-by-office-id.controller");
const list_position_by_office_id_use_case_1 = require("./list-position-by-office-id.use-case");
let ListPositionByOfficeIdModule = class ListPositionByOfficeIdModule {
};
exports.ListPositionByOfficeIdModule = ListPositionByOfficeIdModule;
exports.ListPositionByOfficeIdModule = ListPositionByOfficeIdModule = __decorate([
    (0, common_1.Module)({
        imports: [positions_module_1.PositionsModule, use_case_support_module_1.UseCaseSupportModule],
        controllers: [list_position_by_office_id_controller_1.ListPositionByOfficeIdController],
        providers: [list_position_by_office_id_use_case_1.ListPositionByOfficeIdUseCase],
        exports: [list_position_by_office_id_use_case_1.ListPositionByOfficeIdUseCase],
    })
], ListPositionByOfficeIdModule);
//# sourceMappingURL=list-position-by-office-id.module.js.map
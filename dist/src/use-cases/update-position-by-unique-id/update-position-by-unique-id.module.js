"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionByUniqueIdModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const positions_module_1 = require("../../modules/positions/positions.module");
const update_position_by_unique_id_controller_1 = require("./update-position-by-unique-id.controller");
const update_position_by_unique_id_use_case_1 = require("./update-position-by-unique-id.use-case");
let UpdatePositionByUniqueIdModule = class UpdatePositionByUniqueIdModule {
};
exports.UpdatePositionByUniqueIdModule = UpdatePositionByUniqueIdModule;
exports.UpdatePositionByUniqueIdModule = UpdatePositionByUniqueIdModule = __decorate([
    (0, common_1.Module)({
        imports: [positions_module_1.PositionsModule, use_case_support_module_1.UseCaseSupportModule],
        controllers: [update_position_by_unique_id_controller_1.UpdatePositionByUniqueIdController],
        providers: [update_position_by_unique_id_use_case_1.UpdatePositionByUniqueIdUseCase],
        exports: [update_position_by_unique_id_use_case_1.UpdatePositionByUniqueIdUseCase],
    })
], UpdatePositionByUniqueIdModule);
//# sourceMappingURL=update-position-by-unique-id.module.js.map
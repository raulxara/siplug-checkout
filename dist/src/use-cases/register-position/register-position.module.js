"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPositionModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const positions_module_1 = require("../../modules/positions/positions.module");
const security_module_1 = require("../../modules/security/security.module");
const register_position_controller_1 = require("./register-position.controller");
const register_position_use_case_1 = require("./register-position.use-case");
let RegisterPositionModule = class RegisterPositionModule {
};
exports.RegisterPositionModule = RegisterPositionModule;
exports.RegisterPositionModule = RegisterPositionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            positions_module_1.PositionsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [register_position_controller_1.RegisterPositionController],
        providers: [register_position_use_case_1.RegisterPositionUseCase],
        exports: [register_position_use_case_1.RegisterPositionUseCase],
    })
], RegisterPositionModule);
//# sourceMappingURL=register-position.module.js.map
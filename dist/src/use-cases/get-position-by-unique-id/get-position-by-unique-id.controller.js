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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPositionByUniqueIdController = void 0;
const common_1 = require("@nestjs/common");
const get_position_by_unique_id_dto_in_1 = require("./dtos/get-position-by-unique-id.dto-in");
const get_position_by_unique_id_use_case_1 = require("./get-position-by-unique-id.use-case");
let GetPositionByUniqueIdController = class GetPositionByUniqueIdController {
    getPositionByUniqueIdUseCase;
    constructor(getPositionByUniqueIdUseCase) {
        this.getPositionByUniqueIdUseCase = getPositionByUniqueIdUseCase;
    }
    async handle(body) {
        const dtoOut = await this.getPositionByUniqueIdUseCase.exec(new get_position_by_unique_id_dto_in_1.GetPositionByUniqueIdDtoIn({
            positionId: body.positionId,
            _id: body._id,
        }));
        return {
            status: 'success',
            message: 'position found successfully',
            data: {
                position: dtoOut.position,
            },
        };
    }
};
exports.GetPositionByUniqueIdController = GetPositionByUniqueIdController;
__decorate([
    (0, common_1.Post)('get-by-unique-id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GetPositionByUniqueIdController.prototype, "handle", null);
exports.GetPositionByUniqueIdController = GetPositionByUniqueIdController = __decorate([
    (0, common_1.Controller)('positions'),
    __metadata("design:paramtypes", [get_position_by_unique_id_use_case_1.GetPositionByUniqueIdUseCase])
], GetPositionByUniqueIdController);
//# sourceMappingURL=get-position-by-unique-id.controller.js.map
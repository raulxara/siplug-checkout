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
exports.UpdatePositionByUniqueIdController = void 0;
const common_1 = require("@nestjs/common");
const update_position_by_unique_id_dto_in_1 = require("./dtos/update-position-by-unique-id.dto-in");
const update_position_by_unique_id_use_case_1 = require("./update-position-by-unique-id.use-case");
let UpdatePositionByUniqueIdController = class UpdatePositionByUniqueIdController {
    updatePositionByUniqueIdUseCase;
    constructor(updatePositionByUniqueIdUseCase) {
        this.updatePositionByUniqueIdUseCase = updatePositionByUniqueIdUseCase;
    }
    async handle(body) {
        const dtoOut = await this.updatePositionByUniqueIdUseCase.exec(new update_position_by_unique_id_dto_in_1.UpdatePositionByUniqueIdDtoIn({
            positionId: body.positionId,
            _id: body._id,
            officeId: body.officeId,
            name: body.name,
            slug: body.slug,
            description: body.description,
            config: body.config,
            status: body.status,
        }));
        return {
            status: 'success',
            message: 'position updated successfully',
            data: {
                position: dtoOut.position,
            },
        };
    }
};
exports.UpdatePositionByUniqueIdController = UpdatePositionByUniqueIdController;
__decorate([
    (0, common_1.Post)('update-by-unique-id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpdatePositionByUniqueIdController.prototype, "handle", null);
exports.UpdatePositionByUniqueIdController = UpdatePositionByUniqueIdController = __decorate([
    (0, common_1.Controller)('positions'),
    __metadata("design:paramtypes", [update_position_by_unique_id_use_case_1.UpdatePositionByUniqueIdUseCase])
], UpdatePositionByUniqueIdController);
//# sourceMappingURL=update-position-by-unique-id.controller.js.map
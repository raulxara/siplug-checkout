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
exports.ListPositionByOfficeIdController = void 0;
const common_1 = require("@nestjs/common");
const list_position_by_office_id_dto_in_1 = require("./dtos/list-position-by-office-id.dto-in");
const list_position_by_office_id_use_case_1 = require("./list-position-by-office-id.use-case");
let ListPositionByOfficeIdController = class ListPositionByOfficeIdController {
    listPositionByOfficeIdUseCase;
    constructor(listPositionByOfficeIdUseCase) {
        this.listPositionByOfficeIdUseCase = listPositionByOfficeIdUseCase;
    }
    async handle(body) {
        const dtoOut = await this.listPositionByOfficeIdUseCase.exec(new list_position_by_office_id_dto_in_1.ListPositionByOfficeIdDtoIn({
            officeId: body.officeId,
        }));
        return {
            status: 'success',
            message: 'positions listed successfully',
            data: {
                positions: dtoOut.positions,
                total: dtoOut.total,
            },
        };
    }
};
exports.ListPositionByOfficeIdController = ListPositionByOfficeIdController;
__decorate([
    (0, common_1.Post)('list-by-office-id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListPositionByOfficeIdController.prototype, "handle", null);
exports.ListPositionByOfficeIdController = ListPositionByOfficeIdController = __decorate([
    (0, common_1.Controller)('positions'),
    __metadata("design:paramtypes", [list_position_by_office_id_use_case_1.ListPositionByOfficeIdUseCase])
], ListPositionByOfficeIdController);
//# sourceMappingURL=list-position-by-office-id.controller.js.map
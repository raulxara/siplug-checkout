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
exports.GetPositionByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_position_by_unique_id_dto_in_1 = require("../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in");
const find_position_by_unique_id_service_1 = require("../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service");
const get_position_by_unique_id_dto_out_1 = require("./dtos/get-position-by-unique-id.dto-out");
let GetPositionByUniqueIdUseCase = class GetPositionByUniqueIdUseCase {
    findPositionByUniqueIdService;
    handleUseCaseExceptionService;
    constructor(findPositionByUniqueIdService, handleUseCaseExceptionService) {
        this.findPositionByUniqueIdService = findPositionByUniqueIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const dtoOut = await this.findPositionByUniqueIdService.exec(new find_position_by_unique_id_dto_in_1.FindPositionByUniqueIdDtoIn(dtoIn.positionId));
            return new get_position_by_unique_id_dto_out_1.GetPositionByUniqueIdDtoOut({
                ...dtoOut.position,
            });
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetPositionByUniqueIdUseCase',
                error,
                appFile: __filename,
                context: {
                    positionId: dtoIn.positionId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on get position by unique id use case';
            throw new Error(message);
        }
    }
};
exports.GetPositionByUniqueIdUseCase = GetPositionByUniqueIdUseCase;
exports.GetPositionByUniqueIdUseCase = GetPositionByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_position_by_unique_id_service_1.FindPositionByUniqueIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetPositionByUniqueIdUseCase);
//# sourceMappingURL=get-position-by-unique-id.use-case.js.map
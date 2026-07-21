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
exports.ListPositionByOfficeIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const list_positions_by_office_id_dto_in_1 = require("../../modules/positions/services/list-positions-by-office-id/dtos/list-positions-by-office-id.dto-in");
const list_positions_by_office_id_service_1 = require("../../modules/positions/services/list-positions-by-office-id/list-positions-by-office-id.service");
const list_position_by_office_id_dto_out_1 = require("./dtos/list-position-by-office-id.dto-out");
let ListPositionByOfficeIdUseCase = class ListPositionByOfficeIdUseCase {
    listPositionsByOfficeIdService;
    handleUseCaseExceptionService;
    constructor(listPositionsByOfficeIdService, handleUseCaseExceptionService) {
        this.listPositionsByOfficeIdService = listPositionsByOfficeIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const dtoOut = await this.listPositionsByOfficeIdService.exec(new list_positions_by_office_id_dto_in_1.ListPositionsByOfficeIdDtoIn({
                officeId: dtoIn.officeId,
            }));
            return new list_position_by_office_id_dto_out_1.ListPositionByOfficeIdDtoOut(dtoOut.positions.map((position) => ({
                ...position,
            })), dtoOut.positions.length);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ListPositionByOfficeIdUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on list position by office id use case';
            throw new Error(message);
        }
    }
};
exports.ListPositionByOfficeIdUseCase = ListPositionByOfficeIdUseCase;
exports.ListPositionByOfficeIdUseCase = ListPositionByOfficeIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [list_positions_by_office_id_service_1.ListPositionsByOfficeIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ListPositionByOfficeIdUseCase);
//# sourceMappingURL=list-position-by-office-id.use-case.js.map
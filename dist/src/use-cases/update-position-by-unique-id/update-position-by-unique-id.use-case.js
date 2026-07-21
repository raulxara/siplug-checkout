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
exports.UpdatePositionByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_position_by_unique_id_dto_in_1 = require("../../modules/positions/services/find-position-by-unique-id/dtos/find-position-by-unique-id.dto-in");
const find_position_by_unique_id_service_1 = require("../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service");
const update_position_by_unique_id_dto_in_1 = require("../../modules/positions/services/update-position-by-unique-id/dtos/update-position-by-unique-id.dto-in");
const update_position_by_unique_id_service_1 = require("../../modules/positions/services/update-position-by-unique-id/update-position-by-unique-id.service");
const update_position_by_unique_id_dto_out_1 = require("./dtos/update-position-by-unique-id.dto-out");
let UpdatePositionByUniqueIdUseCase = class UpdatePositionByUniqueIdUseCase {
    findPositionByUniqueIdService;
    updatePositionByUniqueIdService;
    handleUseCaseExceptionService;
    constructor(findPositionByUniqueIdService, updatePositionByUniqueIdService, handleUseCaseExceptionService) {
        this.findPositionByUniqueIdService = findPositionByUniqueIdService;
        this.updatePositionByUniqueIdService = updatePositionByUniqueIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const currentPositionDtoOut = await this.findPositionByUniqueIdService.exec(new find_position_by_unique_id_dto_in_1.FindPositionByUniqueIdDtoIn(dtoIn.positionId));
            const currentPosition = currentPositionDtoOut.position;
            if (dtoIn.officeId !== undefined &&
                currentPosition.officeId !== null &&
                currentPosition.officeId !== dtoIn.officeId) {
                throw new Error('position does not belong to informed officeId');
            }
            const updateData = this.buildUpdateData(dtoIn, currentPosition);
            const updatedPositionDtoOut = await this.updatePositionByUniqueIdService.exec(new update_position_by_unique_id_dto_in_1.UpdatePositionByUniqueIdDtoIn({
                positionId: dtoIn.positionId,
                data: updateData,
            }));
            return new update_position_by_unique_id_dto_out_1.UpdatePositionByUniqueIdDtoOut({
                ...updatedPositionDtoOut.position,
            });
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdatePositionByUniqueIdUseCase',
                error,
                appFile: __filename,
                context: {
                    positionId: dtoIn.positionId,
                    officeId: dtoIn.officeId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update position by unique id use case';
            throw new Error(message);
        }
    }
    buildUpdateData(dtoIn, currentPosition) {
        const data = {};
        const details = {};
        if (dtoIn.name !== undefined) {
            data.name = dtoIn.name;
            if (currentPosition.name !== dtoIn.name) {
                details.name = {
                    old: currentPosition.name,
                    new: dtoIn.name,
                };
            }
        }
        if (dtoIn.slug !== undefined) {
            data.slug = dtoIn.slug;
            if (currentPosition.slug !== dtoIn.slug) {
                details.slug = {
                    old: currentPosition.slug,
                    new: dtoIn.slug,
                };
            }
        }
        if (dtoIn.description !== undefined) {
            data.description = dtoIn.description;
            if (currentPosition.description !== dtoIn.description) {
                details.description = {
                    old: currentPosition.description,
                    new: dtoIn.description,
                };
            }
        }
        if (dtoIn.config !== undefined) {
            data.config = dtoIn.config;
            if (JSON.stringify(currentPosition.config ?? {}) !==
                JSON.stringify(dtoIn.config)) {
                details.config = {
                    old: currentPosition.config,
                    new: dtoIn.config,
                };
            }
        }
        if (dtoIn.status !== undefined) {
            data.status = dtoIn.status;
            if (currentPosition.status !== dtoIn.status) {
                details.status = {
                    old: currentPosition.status,
                    new: dtoIn.status,
                };
            }
        }
        data.changes_history = this.buildChangesHistory(currentPosition.changesHistory, details);
        return data;
    }
    buildChangesHistory(currentChangesHistory, details) {
        const history = this.normalizeChangesHistory(currentChangesHistory);
        return [
            ...history,
            {
                source: 'UpdatePositionByUniqueIdController',
                action: 'update',
                details,
                updated_at: this.nowAsSqlDateTime(),
            },
        ];
    }
    normalizeChangesHistory(currentChangesHistory) {
        if (Array.isArray(currentChangesHistory)) {
            return currentChangesHistory;
        }
        if (typeof currentChangesHistory === 'string') {
            try {
                const parsed = JSON.parse(currentChangesHistory);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
                return [];
            }
            catch {
                return [];
            }
        }
        return [];
    }
    nowAsSqlDateTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = this.pad(date.getMonth() + 1);
        const day = this.pad(date.getDate());
        const hours = this.pad(date.getHours());
        const minutes = this.pad(date.getMinutes());
        const seconds = this.pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    pad(value) {
        return String(value).padStart(2, '0');
    }
};
exports.UpdatePositionByUniqueIdUseCase = UpdatePositionByUniqueIdUseCase;
exports.UpdatePositionByUniqueIdUseCase = UpdatePositionByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_position_by_unique_id_service_1.FindPositionByUniqueIdService,
        update_position_by_unique_id_service_1.UpdatePositionByUniqueIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdatePositionByUniqueIdUseCase);
//# sourceMappingURL=update-position-by-unique-id.use-case.js.map
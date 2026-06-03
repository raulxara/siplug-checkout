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
exports.SyncPositionPermissionsController = void 0;
const common_1 = require("@nestjs/common");
const sync_position_permissions_dto_in_1 = require("./dtos/sync-position-permissions.dto-in");
const sync_position_permissions_request_1 = require("./http/sync-position-permissions.request");
const sync_position_permissions_use_case_1 = require("./sync-position-permissions.use-case");
let SyncPositionPermissionsController = class SyncPositionPermissionsController {
    syncPositionPermissionsUseCase;
    constructor(syncPositionPermissionsUseCase) {
        this.syncPositionPermissionsUseCase = syncPositionPermissionsUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.syncPositionPermissionsUseCase.exec(new sync_position_permissions_dto_in_1.SyncPositionPermissionsDtoIn({
                token,
                positionId: body.positionId,
                permissionIds: body.permissionIds,
                source: body.source ?? 'SyncPositionPermissionsController',
            }));
            return {
                status: 'success',
                message: 'position permissions synced successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on sync position permissions controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.SyncPositionPermissionsController = SyncPositionPermissionsController;
__decorate([
    (0, common_1.Post)('sync'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_position_permissions_request_1.SyncPositionPermissionsRequest, String]),
    __metadata("design:returntype", Promise)
], SyncPositionPermissionsController.prototype, "handle", null);
exports.SyncPositionPermissionsController = SyncPositionPermissionsController = __decorate([
    (0, common_1.Controller)('position-permissions'),
    __metadata("design:paramtypes", [sync_position_permissions_use_case_1.SyncPositionPermissionsUseCase])
], SyncPositionPermissionsController);
//# sourceMappingURL=sync-position-permissions.controller.js.map
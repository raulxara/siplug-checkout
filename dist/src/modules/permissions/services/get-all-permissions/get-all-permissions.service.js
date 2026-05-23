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
exports.GetAllPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const permissions_tokens_1 = require("../../tokens/permissions.tokens");
const get_all_permissions_dto_out_1 = require("./dtos/get-all-permissions.dto-out");
let GetAllPermissionsService = class GetAllPermissionsService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        dtoIn;
        try {
            const rows = await this.repository.getAll();
            return new get_all_permissions_dto_out_1.GetAllPermissionsDtoOut(rows, rows.length);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on get all permissions';
            throw new Error(message);
        }
    }
};
exports.GetAllPermissionsService = GetAllPermissionsService;
exports.GetAllPermissionsService = GetAllPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(permissions_tokens_1.PERMISSIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetAllPermissionsService);
//# sourceMappingURL=get-all-permissions.service.js.map
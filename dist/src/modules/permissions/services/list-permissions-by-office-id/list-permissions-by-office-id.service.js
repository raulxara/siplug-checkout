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
exports.ListPermissionsByOfficeIdService = void 0;
const common_1 = require("@nestjs/common");
const permissions_tokens_1 = require("../../tokens/permissions.tokens");
const list_permissions_by_office_id_dto_out_1 = require("./dtos/list-permissions-by-office-id.dto-out");
let ListPermissionsByOfficeIdService = class ListPermissionsByOfficeIdService {
    permissionsRepository;
    constructor(permissionsRepository) {
        this.permissionsRepository = permissionsRepository;
    }
    async exec(dtoIn) {
        try {
            const permissions = await this.permissionsRepository.getAllByOfficeId(dtoIn.officeId);
            return new list_permissions_by_office_id_dto_out_1.ListPermissionsByOfficeIdDtoOut(permissions);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on list permissions by office id';
            throw new Error(message);
        }
    }
};
exports.ListPermissionsByOfficeIdService = ListPermissionsByOfficeIdService;
exports.ListPermissionsByOfficeIdService = ListPermissionsByOfficeIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(permissions_tokens_1.PERMISSIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ListPermissionsByOfficeIdService);
//# sourceMappingURL=list-permissions-by-office-id.service.js.map
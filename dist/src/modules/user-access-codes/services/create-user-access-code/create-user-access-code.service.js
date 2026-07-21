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
exports.CreateUserAccessCodeService = void 0;
const common_1 = require("@nestjs/common");
const user_access_code_entity_1 = require("../../entities/user-access-code.entity");
const user_access_codes_tokens_1 = require("../../tokens/user-access-codes.tokens");
const create_user_access_code_dto_out_1 = require("./dtos/create-user-access-code.dto-out");
let CreateUserAccessCodeService = class CreateUserAccessCodeService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new user_access_code_entity_1.UserAccessCodeEntity(this.repository);
            entity.userCustomerId = dtoIn.userCustomerId;
            entity.channel = dtoIn.channel;
            entity.destination = dtoIn.destination;
            entity.code = dtoIn.code;
            entity.expiresAt = dtoIn.expiresAt;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            await entity.create();
            return create_user_access_code_dto_out_1.CreateUserAccessCodeDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create user access code';
            throw new Error(message);
        }
    }
};
exports.CreateUserAccessCodeService = CreateUserAccessCodeService;
exports.CreateUserAccessCodeService = CreateUserAccessCodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_access_codes_tokens_1.USER_ACCESS_CODES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateUserAccessCodeService);
//# sourceMappingURL=create-user-access-code.service.js.map
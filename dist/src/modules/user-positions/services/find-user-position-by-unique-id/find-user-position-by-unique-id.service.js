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
exports.FindUserPositionByUniqueIdService = void 0;
const common_1 = require("@nestjs/common");
const user_positions_tokens_1 = require("../../tokens/user-positions.tokens");
const find_user_position_by_unique_id_dto_out_1 = require("./dtos/find-user-position-by-unique-id.dto-out");
let FindUserPositionByUniqueIdService = class FindUserPositionByUniqueIdService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const userPosition = await this.repository.findByUniqueId(dtoIn._id);
            if (!userPosition) {
                throw new Error('user position not found');
            }
            return new find_user_position_by_unique_id_dto_out_1.FindUserPositionByUniqueIdDtoOut(userPosition);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on find user position';
            throw new Error(message);
        }
    }
};
exports.FindUserPositionByUniqueIdService = FindUserPositionByUniqueIdService;
exports.FindUserPositionByUniqueIdService = FindUserPositionByUniqueIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_positions_tokens_1.USER_POSITIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindUserPositionByUniqueIdService);
//# sourceMappingURL=find-user-position-by-unique-id.service.js.map
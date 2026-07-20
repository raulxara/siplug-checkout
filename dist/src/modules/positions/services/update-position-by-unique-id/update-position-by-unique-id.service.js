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
exports.UpdatePositionByUniqueIdService = void 0;
const common_1 = require("@nestjs/common");
const positions_tokens_1 = require("../../tokens/positions.tokens");
const update_position_by_unique_id_dto_out_1 = require("./dtos/update-position-by-unique-id.dto-out");
let UpdatePositionByUniqueIdService = class UpdatePositionByUniqueIdService {
    positionsRepository;
    constructor(positionsRepository) {
        this.positionsRepository = positionsRepository;
    }
    async exec(dtoIn) {
        try {
            const position = await this.positionsRepository.updateByUniqueId(dtoIn.positionId, dtoIn.data);
            return new update_position_by_unique_id_dto_out_1.UpdatePositionByUniqueIdDtoOut(position);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update position by unique id';
            throw new Error(message);
        }
    }
};
exports.UpdatePositionByUniqueIdService = UpdatePositionByUniqueIdService;
exports.UpdatePositionByUniqueIdService = UpdatePositionByUniqueIdService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(positions_tokens_1.POSITIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdatePositionByUniqueIdService);
//# sourceMappingURL=update-position-by-unique-id.service.js.map
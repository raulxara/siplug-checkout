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
exports.GetAllGatewaysController = void 0;
const common_1 = require("@nestjs/common");
const get_all_gateways_dto_in_1 = require("./dtos/get-all-gateways.dto-in");
const get_all_gateways_request_1 = require("./http/get-all-gateways.request");
const get_all_gateways_use_case_1 = require("./get-all-gateways.use-case");
let GetAllGatewaysController = class GetAllGatewaysController {
    getAllGatewaysUseCase;
    constructor(getAllGatewaysUseCase) {
        this.getAllGatewaysUseCase = getAllGatewaysUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.getAllGatewaysUseCase.exec(new get_all_gateways_dto_in_1.GetAllGatewaysDtoIn({
                token,
                status: body.status ?? null,
                search: body.search ?? null,
                page: body.page ?? 1,
                perPage: body.perPage ?? 20,
            }));
            return {
                status: 'success',
                message: 'gateways listed successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on get all gateways controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.GetAllGatewaysController = GetAllGatewaysController;
__decorate([
    (0, common_1.Post)('get-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_gateways_request_1.GetAllGatewaysRequest, String]),
    __metadata("design:returntype", Promise)
], GetAllGatewaysController.prototype, "handle", null);
exports.GetAllGatewaysController = GetAllGatewaysController = __decorate([
    (0, common_1.Controller)('gateways'),
    __metadata("design:paramtypes", [get_all_gateways_use_case_1.GetAllGatewaysUseCase])
], GetAllGatewaysController);
//# sourceMappingURL=get-all-gateways.controller.js.map
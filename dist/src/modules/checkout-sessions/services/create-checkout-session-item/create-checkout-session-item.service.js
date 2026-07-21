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
exports.CreateCheckoutSessionItemService = void 0;
const common_1 = require("@nestjs/common");
const checkout_session_item_entity_1 = require("../../entities/checkout-session-item.entity");
const checkout_sessions_tokens_1 = require("../../tokens/checkout-sessions.tokens");
const create_checkout_session_item_dto_out_1 = require("./dtos/create-checkout-session-item.dto-out");
let CreateCheckoutSessionItemService = class CreateCheckoutSessionItemService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new checkout_session_item_entity_1.CheckoutSessionItemEntity(this.repository);
            entity.checkoutSessionId = dtoIn.checkoutSessionId;
            entity.itemRef = dtoIn.itemRef;
            entity.itemType = dtoIn.itemType;
            entity.name = dtoIn.name;
            entity.description = dtoIn.description;
            entity.quantity = dtoIn.quantity;
            entity.unitAmount = dtoIn.unitAmount;
            entity.totalAmount = dtoIn.totalAmount;
            entity.metadata = dtoIn.metadata;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            await entity.create();
            return create_checkout_session_item_dto_out_1.CreateCheckoutSessionItemDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create checkout session item';
            throw new Error(message);
        }
    }
};
exports.CreateCheckoutSessionItemService = CreateCheckoutSessionItemService;
exports.CreateCheckoutSessionItemService = CreateCheckoutSessionItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(checkout_sessions_tokens_1.CHECKOUT_SESSION_ITEMS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateCheckoutSessionItemService);
//# sourceMappingURL=create-checkout-session-item.service.js.map
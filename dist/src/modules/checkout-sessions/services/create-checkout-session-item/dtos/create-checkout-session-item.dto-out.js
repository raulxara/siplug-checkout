"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutSessionItemDtoOut = void 0;
class CreateCheckoutSessionItemDtoOut {
    id;
    _id;
    checkoutSessionId;
    itemRef;
    itemType;
    name;
    description;
    quantity;
    unitAmount;
    totalAmount;
    metadata;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, checkoutSessionId, itemRef, itemType, name, description, quantity, unitAmount, totalAmount, metadata, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.checkoutSessionId = checkoutSessionId;
        this.itemRef = itemRef;
        this.itemType = itemType;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.unitAmount = unitAmount;
        this.totalAmount = totalAmount;
        this.metadata = metadata;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateCheckoutSessionItemDtoOut(entity.id ?? 0, entity._id ?? '', entity.checkoutSessionId, entity.itemRef, entity.itemType, entity.name, entity.description, entity.quantity, entity.unitAmount, entity.totalAmount, entity.metadata, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateCheckoutSessionItemDtoOut = CreateCheckoutSessionItemDtoOut;
//# sourceMappingURL=create-checkout-session-item.dto-out.js.map
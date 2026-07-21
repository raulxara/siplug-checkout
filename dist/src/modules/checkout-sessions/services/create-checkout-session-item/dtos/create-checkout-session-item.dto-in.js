"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutSessionItemDtoIn = void 0;
class CreateCheckoutSessionItemDtoIn {
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
    status;
    constructor(params) {
        this.checkoutSessionId = params.checkoutSessionId;
        this.itemRef = params.itemRef ?? null;
        this.itemType = params.itemType ?? null;
        this.name = params.name;
        this.description = params.description ?? null;
        this.quantity = params.quantity ?? 1;
        this.unitAmount = Number(params.unitAmount);
        this.totalAmount =
            params.totalAmount ?? this.quantity * Number(params.unitAmount);
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.checkoutSessionId.trim() === '') {
            throw new Error('checkoutSessionId is required');
        }
        if (this.name.trim() === '') {
            throw new Error('name is required');
        }
        if (!Number.isFinite(this.quantity) || this.quantity <= 0) {
            throw new Error('quantity must be greater than zero');
        }
        if (!Number.isFinite(this.unitAmount) || this.unitAmount <= 0) {
            throw new Error('unitAmount must be greater than zero');
        }
        if (!Number.isFinite(this.totalAmount) || this.totalAmount <= 0) {
            throw new Error('totalAmount must be greater than zero');
        }
    }
}
exports.CreateCheckoutSessionItemDtoIn = CreateCheckoutSessionItemDtoIn;
//# sourceMappingURL=create-checkout-session-item.dto-in.js.map
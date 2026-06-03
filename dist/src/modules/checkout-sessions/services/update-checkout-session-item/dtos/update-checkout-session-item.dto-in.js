"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCheckoutSessionItemDtoIn = void 0;
class UpdateCheckoutSessionItemDtoIn {
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
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.checkoutSessionId = params.checkoutSessionId ?? null;
        this.itemRef = params.itemRef ?? null;
        this.itemType = params.itemType ?? null;
        this.name = params.name ?? null;
        this.description = params.description ?? null;
        this.quantity = params.quantity ?? null;
        this.unitAmount = params.unitAmount ?? null;
        this.totalAmount = params.totalAmount ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateCheckoutSessionItemService';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateCheckoutSessionItemDtoIn = UpdateCheckoutSessionItemDtoIn;
//# sourceMappingURL=update-checkout-session-item.dto-in.js.map
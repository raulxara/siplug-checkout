"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentSplitDtoIn = void 0;
class UpdatePaymentSplitDtoIn {
    _id;
    gatewaySplitId;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
    status;
    source;
    constructor(params) {
        this._id = String(params._id ?? '').trim();
        this.gatewaySplitId = this.toOptionalNullableString(params.gatewaySplitId);
        this.providerPayload = this.toOptionalNullableObject(params.providerPayload, 'providerPayload');
        this.providerResponse = this.toOptionalNullableObject(params.providerResponse, 'providerResponse');
        this.gatewayResponse = this.toOptionalNullableObject(params.gatewayResponse, 'gatewayResponse');
        this.metadata = this.toOptionalNullableObject(params.metadata, 'metadata');
        this.config = this.toOptionalNullableObject(params.config, 'config');
        this.status =
            params.status !== undefined && params.status !== null
                ? String(params.status).trim()
                : undefined;
        this.source = String(params.source ?? 'UpdatePaymentSplitService').trim();
        if (this._id === '') {
            throw new Error('_id is required');
        }
        if (this.status !== undefined && this.status === '') {
            throw new Error('status cannot be empty');
        }
    }
    toOptionalNullableString(value) {
        if (value === undefined) {
            return undefined;
        }
        if (value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toOptionalNullableObject(value, field) {
        if (value === undefined) {
            return undefined;
        }
        if (value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.UpdatePaymentSplitDtoIn = UpdatePaymentSplitDtoIn;
//# sourceMappingURL=update-payment-split.dto-in.js.map
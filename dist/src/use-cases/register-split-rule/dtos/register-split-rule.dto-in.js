"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSplitRuleDtoIn = void 0;
class RegisterSplitRuleDtoIn {
    token;
    officeId;
    clientId;
    gatewayId;
    name;
    slug;
    description;
    splitType;
    calculationBase;
    priority;
    metadata;
    config;
    status;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.officeId = String(params.officeId ?? '').trim();
        this.clientId = String(params.clientId ?? '').trim();
        this.gatewayId = this.toNullableString(params.gatewayId);
        this.name = String(params.name ?? '').trim();
        this.slug = String(params.slug ?? '').trim();
        this.description = this.toNullableString(params.description);
        this.splitType = this.toNullableString(params.splitType) ?? 'percentage';
        this.calculationBase =
            this.toNullableString(params.calculationBase) ?? 'gross_amount';
        this.priority = this.toNumber(params.priority, 0);
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        this.status = this.toNullableString(params.status) ?? 'active';
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
        if (this.clientId === '') {
            throw new Error('clientId is required');
        }
        if (this.name === '') {
            throw new Error('name is required');
        }
        if (this.slug === '') {
            throw new Error('slug is required');
        }
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toNumber(value, fallback) {
        if (value === undefined || value === null || value === '') {
            return fallback;
        }
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            throw new Error(`invalid number value: ${String(value)}`);
        }
        return numberValue;
    }
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('value must be an object');
        }
        return value;
    }
}
exports.RegisterSplitRuleDtoIn = RegisterSplitRuleDtoIn;
//# sourceMappingURL=register-split-rule.dto-in.js.map
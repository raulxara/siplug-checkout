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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentSplitLifecycleRequest = exports.UpdatePaymentSplitLifecycleRecipientRequest = void 0;
const class_validator_1 = require("class-validator");
class UpdatePaymentSplitLifecycleRecipientRequest {
    paymentSplitRecipientId;
    splitRecipientId;
    status;
    gatewayRecipientId;
    gatewayTransferId;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
}
exports.UpdatePaymentSplitLifecycleRecipientRequest = UpdatePaymentSplitLifecycleRecipientRequest;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "paymentSplitRecipientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "splitRecipientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "gatewayRecipientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "gatewayTransferId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "providerPayload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "providerResponse", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "gatewayResponse", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRecipientRequest.prototype, "config", void 0);
class UpdatePaymentSplitLifecycleRequest {
    token;
    paymentSplitId;
    status;
    gatewaySplitId;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
    recipients;
}
exports.UpdatePaymentSplitLifecycleRequest = UpdatePaymentSplitLifecycleRequest;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRequest.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRequest.prototype, "paymentSplitId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRequest.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentSplitLifecycleRequest.prototype, "gatewaySplitId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRequest.prototype, "providerPayload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRequest.prototype, "providerResponse", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRequest.prototype, "gatewayResponse", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRequest.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdatePaymentSplitLifecycleRequest.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdatePaymentSplitLifecycleRequest.prototype, "recipients", void 0);
//# sourceMappingURL=update-payment-split-lifecycle.request.js.map
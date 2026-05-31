"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveGatewayWebhookDtoIn = void 0;
class ReceiveGatewayWebhookDtoIn {
    gatewayProvider;
    payload;
    headers;
    rawBody;
    constructor(params) {
        this.gatewayProvider = String(params.gatewayProvider ?? '').trim();
        this.payload = params.payload ?? {};
        this.headers = params.headers ?? {};
        this.rawBody = params.rawBody ?? null;
        if (this.gatewayProvider === '') {
            throw new Error('gatewayProvider is required');
        }
    }
}
exports.ReceiveGatewayWebhookDtoIn = ReceiveGatewayWebhookDtoIn;
//# sourceMappingURL=receive-gateway-webhook.dto-in.js.map
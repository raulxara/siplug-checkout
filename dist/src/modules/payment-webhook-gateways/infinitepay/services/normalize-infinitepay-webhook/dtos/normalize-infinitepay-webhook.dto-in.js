"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeInfinitePayWebhookDtoIn = void 0;
class NormalizeInfinitePayWebhookDtoIn {
    payload;
    headers;
    constructor(params) {
        if (!params.payload ||
            typeof params.payload !== 'object' ||
            Array.isArray(params.payload)) {
            throw new Error('InfinitePay webhook payload is required');
        }
        this.payload = params.payload;
        this.headers = params.headers ?? {};
    }
}
exports.NormalizeInfinitePayWebhookDtoIn = NormalizeInfinitePayWebhookDtoIn;
//# sourceMappingURL=normalize-infinitepay-webhook.dto-in.js.map
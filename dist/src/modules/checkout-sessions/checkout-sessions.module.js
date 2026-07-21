"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const checkout_session_items_repository_1 = require("./repositories/checkout-session-items.repository");
const checkout_sessions_repository_1 = require("./repositories/checkout-sessions.repository");
const create_checkout_session_item_service_1 = require("./services/create-checkout-session-item/create-checkout-session-item.service");
const create_checkout_session_service_1 = require("./services/create-checkout-session/create-checkout-session.service");
const find_checkout_session_by_unique_id_service_1 = require("./services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service");
const get_all_checkout_session_items_by_checkout_session_id_service_1 = require("./services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service");
const get_all_checkout_sessions_by_office_id_service_1 = require("./services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service");
const update_checkout_session_item_service_1 = require("./services/update-checkout-session-item/update-checkout-session-item.service");
const update_checkout_session_service_1 = require("./services/update-checkout-session/update-checkout-session.service");
const checkout_sessions_tokens_1 = require("./tokens/checkout-sessions.tokens");
let CheckoutSessionsModule = class CheckoutSessionsModule {
};
exports.CheckoutSessionsModule = CheckoutSessionsModule;
exports.CheckoutSessionsModule = CheckoutSessionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: checkout_sessions_tokens_1.CHECKOUT_SESSIONS_REPOSITORY,
                useClass: checkout_sessions_repository_1.CheckoutSessionsRepository,
            },
            {
                provide: checkout_sessions_tokens_1.CHECKOUT_SESSION_ITEMS_REPOSITORY,
                useClass: checkout_session_items_repository_1.CheckoutSessionItemsRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            create_checkout_session_service_1.CreateCheckoutSessionService,
            update_checkout_session_service_1.UpdateCheckoutSessionService,
            find_checkout_session_by_unique_id_service_1.FindCheckoutSessionByUniqueIdService,
            get_all_checkout_sessions_by_office_id_service_1.GetAllCheckoutSessionsByOfficeIdService,
            create_checkout_session_item_service_1.CreateCheckoutSessionItemService,
            update_checkout_session_item_service_1.UpdateCheckoutSessionItemService,
            get_all_checkout_session_items_by_checkout_session_id_service_1.GetAllCheckoutSessionItemsByCheckoutSessionIdService,
        ],
        exports: [
            checkout_sessions_tokens_1.CHECKOUT_SESSIONS_REPOSITORY,
            checkout_sessions_tokens_1.CHECKOUT_SESSION_ITEMS_REPOSITORY,
            create_checkout_session_service_1.CreateCheckoutSessionService,
            update_checkout_session_service_1.UpdateCheckoutSessionService,
            find_checkout_session_by_unique_id_service_1.FindCheckoutSessionByUniqueIdService,
            get_all_checkout_sessions_by_office_id_service_1.GetAllCheckoutSessionsByOfficeIdService,
            create_checkout_session_item_service_1.CreateCheckoutSessionItemService,
            update_checkout_session_item_service_1.UpdateCheckoutSessionItemService,
            get_all_checkout_session_items_by_checkout_session_id_service_1.GetAllCheckoutSessionItemsByCheckoutSessionIdService,
        ],
    })
], CheckoutSessionsModule);
//# sourceMappingURL=checkout-sessions.module.js.map
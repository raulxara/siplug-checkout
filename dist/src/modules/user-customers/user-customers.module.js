"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCustomersModule = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const user_customers_repository_1 = require("./repositories/user-customers.repository");
const create_user_customer_service_1 = require("./services/create-user-customer/create-user-customer.service");
const find_user_customer_by_token_service_1 = require("./services/find-user-customer-by-token/find-user-customer-by-token.service");
const find_user_customer_by_unique_id_service_1 = require("./services/find-user-customer-by-unique-id/find-user-customer-by-unique-id.service");
const generate_user_customer_token_service_1 = require("./services/generate-user-customer-token/generate-user-customer-token.service");
const get_all_user_customers_by_client_id_service_1 = require("./services/get-all-user-customers-by-client-id/get-all-user-customers-by-client-id.service");
const get_all_user_customers_service_1 = require("./services/get-all-user-customers/get-all-user-customers.service");
const update_user_customer_service_1 = require("./services/update-user-customer/update-user-customer.service");
const user_customers_tokens_1 = require("./tokens/user-customers.tokens");
let UserCustomersModule = class UserCustomersModule {
};
exports.UserCustomersModule = UserCustomersModule;
exports.UserCustomersModule = UserCustomersModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: user_customers_tokens_1.USER_CUSTOMERS_REPOSITORY,
                useClass: user_customers_repository_1.UserCustomersRepository,
            },
            build_changes_history_service_1.BuildChangesHistoryService,
            generate_user_customer_token_service_1.GenerateUserCustomerTokenService,
            create_user_customer_service_1.CreateUserCustomerService,
            update_user_customer_service_1.UpdateUserCustomerService,
            find_user_customer_by_unique_id_service_1.FindUserCustomerByUniqueIdService,
            find_user_customer_by_token_service_1.FindUserCustomerByTokenService,
            get_all_user_customers_service_1.GetAllUserCustomersService,
            get_all_user_customers_by_client_id_service_1.GetAllUserCustomersByClientIdService,
        ],
        exports: [
            user_customers_tokens_1.USER_CUSTOMERS_REPOSITORY,
            generate_user_customer_token_service_1.GenerateUserCustomerTokenService,
            create_user_customer_service_1.CreateUserCustomerService,
            update_user_customer_service_1.UpdateUserCustomerService,
            find_user_customer_by_unique_id_service_1.FindUserCustomerByUniqueIdService,
            find_user_customer_by_token_service_1.FindUserCustomerByTokenService,
            get_all_user_customers_service_1.GetAllUserCustomersService,
            get_all_user_customers_by_client_id_service_1.GetAllUserCustomersByClientIdService,
        ],
    })
], UserCustomersModule);
//# sourceMappingURL=user-customers.module.js.map
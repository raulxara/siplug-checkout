"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./infra/database/prisma/prisma.module");
const health_module_1 = require("./modules/health/health.module");
const offices_module_1 = require("./modules/offices/offices.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const clients_module_1 = require("./modules/clients/clients.module");
const user_customers_module_1 = require("./modules/user-customers/user-customers.module");
const positions_module_1 = require("./modules/positions/positions.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const position_permissions_module_1 = require("./modules/position-permissions/position-permissions.module");
const user_positions_module_1 = require("./modules/user-positions/user-positions.module");
const security_module_1 = require("./modules/security/security.module");
const register_permission_module_1 = require("./use-cases/register-permission/register-permission.module");
const api_credentials_module_1 = require("./modules/api-credentials/api-credentials.module");
const register_api_credential_module_1 = require("./use-cases/register-api-credential/register-api-credential.module");
const register_position_module_1 = require("./use-cases/register-position/register-position.module");
const sync_position_permissions_module_1 = require("./use-cases/sync-position-permissions/sync-position-permissions.module");
const user_access_codes_module_1 = require("./modules/user-access-codes/user-access-codes.module");
const register_user_module_1 = require("./use-cases/register-user/register-user.module");
const update_user_module_1 = require("./use-cases/update-user/update-user.module");
const get_user_module_1 = require("./use-cases/get-user/get-user.module");
const list_users_module_1 = require("./use-cases/list-users/list-users.module");
const get_all_users_by_office_id_module_1 = require("./use-cases/get-all-users-by-office-id/get-all-users-by-office-id.module");
const update_api_credential_module_1 = require("./use-cases/update-api-credential/update-api-credential.module");
const gateways_module_1 = require("./modules/gateways/gateways.module");
const register_gateway_module_1 = require("./use-cases/register-gateway/register-gateway.module");
const update_gateway_module_1 = require("./use-cases/update-gateway/update-gateway.module");
const get_all_gateways_module_1 = require("./use-cases/get-all-gateways/get-all-gateways.module");
const payment_customers_module_1 = require("./modules/payment-customers/payment-customers.module");
const register_payment_customer_module_1 = require("./use-cases/register-payment-customer/register-payment-customer.module");
const update_payment_customer_module_1 = require("./use-cases/update-payment-customer/update-payment-customer.module");
const list_payment_customers_module_1 = require("./use-cases/list-payment-customers/list-payment-customers.module");
const get_payment_customer_by_unique_id_module_1 = require("./use-cases/get-payment-customer-by-unique-id/get-payment-customer-by-unique-id.module");
const checkout_sessions_module_1 = require("./modules/checkout-sessions/checkout-sessions.module");
const register_checkout_session_module_1 = require("./use-cases/register-checkout-session/register-checkout-session.module");
const update_checkout_session_module_1 = require("./use-cases/update-checkout-session/update-checkout-session.module");
const list_checkout_sessions_module_1 = require("./use-cases/list-checkout-sessions/list-checkout-sessions.module");
const get_checkout_session_by_unique_id_module_1 = require("./use-cases/get-checkout-session-by-unique-id/get-checkout-session-by-unique-id.module");
const payment_transactions_module_1 = require("./modules/payment-transactions/payment-transactions.module");
const process_payment_module_1 = require("./use-cases/process-payment/process-payment.module");
const gateway_orchestration_module_1 = require("./modules/gateway-orchestration/gateway-orchestration.module");
const dispatch_payment_transaction_to_gateway_module_1 = require("./use-cases/dispatch-payment-transaction-to-gateway/dispatch-payment-transaction-to-gateway.module");
const receive_gateway_webhook_module_1 = require("./use-cases/receive-gateway-webhook/receive-gateway-webhook.module");
const create_gateway_card_token_module_1 = require("./use-cases/create-gateway-card-token/create-gateway-card-token.module");
const dev_pagseguro_encrypted_card_page_module_1 = require("./use-cases/dev-pagseguro-encrypted-card-page/dev-pagseguro-encrypted-card-page.module");
const get_payment_transaction_by_unique_id_module_1 = require("./use-cases/get-payment-transaction-by-unique-id/get-payment-transaction-by-unique-id.module");
const list_payment_transactions_module_1 = require("./use-cases/list-payment-transactions/list-payment-transactions.module");
const list_payment_transactions_by_office_id_module_1 = require("./use-cases/list-payment-transactions-by-office-id/list-payment-transactions-by-office-id.module");
const update_payment_transaction_module_1 = require("./use-cases/update-payment-transaction/update-payment-transaction.module");
const sync_payment_transaction_status_module_1 = require("./use-cases/sync-payment-transaction-status/sync-payment-transaction-status.module");
const register_subscription_plan_module_1 = require("./use-cases/register-subscription-plan/register-subscription-plan.module");
const register_subscription_module_1 = require("./use-cases/register-subscription/register-subscription.module");
const generate_subscription_invoice_module_1 = require("./use-cases/generate-subscription-invoice/generate-subscription-invoice.module");
const process_recurring_payment_module_1 = require("./use-cases/process-recurring-payment/process-recurring-payment.module");
const dev_mercado_pago_card_token_page_module_1 = require("./use-cases/dev-mercado-pago-card-token-page/dev-mercado-pago-card-token-page.module");
const dev_picpay_temporary_card_token_page_module_1 = require("./use-cases/dev-picpay-temporary-card-token-page/dev-picpay-temporary-card-token-page.module");
const get_subscription_plan_by_unique_id_module_1 = require("./use-cases/get-subscription-plan-by-unique-id/get-subscription-plan-by-unique-id.module");
const list_subscription_plans_module_1 = require("./use-cases/list-subscription-plans/list-subscription-plans.module");
const list_subscription_plans_by_office_id_module_1 = require("./use-cases/list-subscription-plans-by-office-id/list-subscription-plans-by-office-id.module");
const update_subscription_plan_module_1 = require("./use-cases/update-subscription-plan/update-subscription-plan.module");
const get_subscription_by_unique_id_module_1 = require("./use-cases/get-subscription-by-unique-id/get-subscription-by-unique-id.module");
const list_subscriptions_module_1 = require("./use-cases/list-subscriptions/list-subscriptions.module");
const list_subscriptions_by_office_id_module_1 = require("./use-cases/list-subscriptions-by-office-id/list-subscriptions-by-office-id.module");
const update_subscription_module_1 = require("./use-cases/update-subscription/update-subscription.module");
const get_subscription_invoice_by_unique_id_module_1 = require("./use-cases/get-subscription-invoice-by-unique-id/get-subscription-invoice-by-unique-id.module");
const list_subscription_invoices_module_1 = require("./use-cases/list-subscription-invoices/list-subscription-invoices.module");
const list_subscription_invoices_by_office_id_module_1 = require("./use-cases/list-subscription-invoices-by-office-id/list-subscription-invoices-by-office-id.module");
const update_subscription_invoice_module_1 = require("./use-cases/update-subscription-invoice/update-subscription-invoice.module");
const register_split_recipient_module_1 = require("./use-cases/register-split-recipient/register-split-recipient.module");
const get_split_recipient_by_unique_id_module_1 = require("./use-cases/get-split-recipient-by-unique-id/get-split-recipient-by-unique-id.module");
const list_split_recipients_module_1 = require("./use-cases/list-split-recipients/list-split-recipients.module");
const list_split_recipients_by_office_id_module_1 = require("./use-cases/list-split-recipients-by-office-id/list-split-recipients-by-office-id.module");
const update_split_recipient_module_1 = require("./use-cases/update-split-recipient/update-split-recipient.module");
const register_split_rule_module_1 = require("./use-cases/register-split-rule/register-split-rule.module");
const sync_split_rule_recipients_module_1 = require("./use-cases/sync-split-rule-recipients/sync-split-rule-recipients.module");
const get_split_rule_by_unique_id_module_1 = require("./use-cases/get-split-rule-by-unique-id/get-split-rule-by-unique-id.module");
const list_split_rules_module_1 = require("./use-cases/list-split-rules/list-split-rules.module");
const list_split_rules_by_office_id_module_1 = require("./use-cases/list-split-rules-by-office-id/list-split-rules-by-office-id.module");
const update_split_rule_module_1 = require("./use-cases/update-split-rule/update-split-rule.module");
const calculate_payment_split_module_1 = require("./use-cases/calculate-payment-split/calculate-payment-split.module");
const register_payment_split_module_1 = require("./use-cases/register-payment-split/register-payment-split.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            offices_module_1.OfficesModule,
            profiles_module_1.ProfilesModule,
            clients_module_1.ClientsModule,
            user_customers_module_1.UserCustomersModule,
            positions_module_1.PositionsModule,
            permissions_module_1.PermissionsModule,
            position_permissions_module_1.PositionPermissionsModule,
            user_positions_module_1.UserPositionsModule,
            security_module_1.SecurityModule,
            register_permission_module_1.RegisterPermissionModule,
            register_api_credential_module_1.RegisterApiCredentialModule,
            api_credentials_module_1.ApiCredentialsModule,
            register_position_module_1.RegisterPositionModule,
            sync_position_permissions_module_1.SyncPositionPermissionsModule,
            user_access_codes_module_1.UserAccessCodesModule,
            register_user_module_1.RegisterUserModule,
            update_user_module_1.UpdateUserModule,
            get_user_module_1.GetUserModule,
            list_users_module_1.ListUsersModule,
            get_all_users_by_office_id_module_1.GetAllUsersByOfficeIdModule,
            update_api_credential_module_1.UpdateApiCredentialModule,
            gateways_module_1.GatewaysModule,
            register_gateway_module_1.RegisterGatewayModule,
            update_gateway_module_1.UpdateGatewayModule,
            get_all_gateways_module_1.GetAllGatewaysModule,
            payment_customers_module_1.PaymentCustomersModule,
            register_payment_customer_module_1.RegisterPaymentCustomerModule,
            update_payment_customer_module_1.UpdatePaymentCustomerModule,
            list_payment_customers_module_1.ListPaymentCustomersModule,
            get_payment_customer_by_unique_id_module_1.GetPaymentCustomerByUniqueIdModule,
            checkout_sessions_module_1.CheckoutSessionsModule,
            register_checkout_session_module_1.RegisterCheckoutSessionModule,
            update_checkout_session_module_1.UpdateCheckoutSessionModule,
            list_checkout_sessions_module_1.ListCheckoutSessionsModule,
            get_checkout_session_by_unique_id_module_1.GetCheckoutSessionByUniqueIdModule,
            payment_transactions_module_1.PaymentTransactionsModule,
            process_payment_module_1.ProcessPaymentModule,
            gateway_orchestration_module_1.GatewayOrchestrationModule,
            dispatch_payment_transaction_to_gateway_module_1.DispatchPaymentTransactionToGatewayModule,
            receive_gateway_webhook_module_1.ReceiveGatewayWebhookModule,
            create_gateway_card_token_module_1.CreateGatewayCardTokenModule,
            dev_pagseguro_encrypted_card_page_module_1.DevPagSeguroEncryptedCardPageModule,
            get_payment_transaction_by_unique_id_module_1.GetPaymentTransactionByUniqueIdModule,
            list_payment_transactions_module_1.ListPaymentTransactionsModule,
            list_payment_transactions_by_office_id_module_1.ListPaymentTransactionsByOfficeIdModule,
            update_payment_transaction_module_1.UpdatePaymentTransactionModule,
            sync_payment_transaction_status_module_1.SyncPaymentTransactionStatusModule,
            register_subscription_plan_module_1.RegisterSubscriptionPlanModule,
            register_subscription_module_1.RegisterSubscriptionModule,
            generate_subscription_invoice_module_1.GenerateSubscriptionInvoiceModule,
            process_recurring_payment_module_1.ProcessRecurringPaymentModule,
            dev_mercado_pago_card_token_page_module_1.DevMercadoPagoCardTokenPageModule,
            dev_picpay_temporary_card_token_page_module_1.DevPicPayTemporaryCardTokenPageModule,
            get_subscription_plan_by_unique_id_module_1.GetSubscriptionPlanByUniqueIdModule,
            list_subscription_plans_module_1.ListSubscriptionPlansModule,
            list_subscription_plans_by_office_id_module_1.ListSubscriptionPlansByOfficeIdModule,
            update_subscription_plan_module_1.UpdateSubscriptionPlanModule,
            get_subscription_by_unique_id_module_1.GetSubscriptionByUniqueIdModule,
            list_subscriptions_module_1.ListSubscriptionsModule,
            list_subscriptions_by_office_id_module_1.ListSubscriptionsByOfficeIdModule,
            update_subscription_module_1.UpdateSubscriptionModule,
            get_subscription_invoice_by_unique_id_module_1.GetSubscriptionInvoiceByUniqueIdModule,
            list_subscription_invoices_module_1.ListSubscriptionInvoicesModule,
            list_subscription_invoices_by_office_id_module_1.ListSubscriptionInvoicesByOfficeIdModule,
            update_subscription_invoice_module_1.UpdateSubscriptionInvoiceModule,
            register_split_recipient_module_1.RegisterSplitRecipientModule,
            get_split_recipient_by_unique_id_module_1.GetSplitRecipientByUniqueIdModule,
            list_split_recipients_module_1.ListSplitRecipientsModule,
            list_split_recipients_by_office_id_module_1.ListSplitRecipientsByOfficeIdModule,
            update_split_recipient_module_1.UpdateSplitRecipientModule,
            register_split_rule_module_1.RegisterSplitRuleModule,
            sync_split_rule_recipients_module_1.SyncSplitRuleRecipientsModule,
            get_split_rule_by_unique_id_module_1.GetSplitRuleByUniqueIdModule,
            list_split_rules_module_1.ListSplitRulesModule,
            list_split_rules_by_office_id_module_1.ListSplitRulesByOfficeIdModule,
            update_split_rule_module_1.UpdateSplitRuleModule,
            calculate_payment_split_module_1.CalculatePaymentSplitModule,
            register_payment_split_module_1.RegisterPaymentSplitModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
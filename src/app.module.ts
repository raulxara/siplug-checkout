import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { OfficesModule } from './modules/offices/offices.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ClientsModule } from './modules/clients/clients.module';
import { UserCustomersModule } from './modules/user-customers/user-customers.module';
import { PositionsModule } from './modules/positions/positions.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PositionPermissionsModule } from './modules/position-permissions/position-permissions.module';
import { UserPositionsModule } from './modules/user-positions/user-positions.module';
import { SecurityModule } from './modules/security/security.module';
import { RegisterPermissionModule } from './use-cases/register-permission/register-permission.module';
import { ApiCredentialsModule } from './modules/api-credentials/api-credentials.module';
import { RegisterApiCredentialModule } from './use-cases/register-api-credential/register-api-credential.module';
import { RegisterPositionModule } from './use-cases/register-position/register-position.module';
import { SyncPositionPermissionsModule } from './use-cases/sync-position-permissions/sync-position-permissions.module';
import { UserAccessCodesModule } from './modules/user-access-codes/user-access-codes.module';
import { RegisterUserModule } from './use-cases/register-user/register-user.module';
import { UpdateUserModule } from './use-cases/update-user/update-user.module';
import { GetUserModule } from './use-cases/get-user/get-user.module';
import { ListUsersModule } from './use-cases/list-users/list-users.module';
import { GetAllUsersByOfficeIdModule } from './use-cases/get-all-users-by-office-id/get-all-users-by-office-id.module';
import { UpdateApiCredentialModule } from './use-cases/update-api-credential/update-api-credential.module';

import { RegisterGatewayModule } from './use-cases/register-gateway/register-gateway.module';
import { UpdateGatewayModule } from './use-cases/update-gateway/update-gateway.module';
import { GetAllGatewaysModule } from './use-cases/get-all-gateways/get-all-gateways.module';
import { PaymentCustomersModule } from './modules/payment-customers/payment-customers.module';
import { RegisterPaymentCustomerModule } from './use-cases/register-payment-customer/register-payment-customer.module';
import { UpdatePaymentCustomerModule } from './use-cases/update-payment-customer/update-payment-customer.module';
import { ListPaymentCustomersModule } from './use-cases/list-payment-customers/list-payment-customers.module';
import { GetPaymentCustomerByUniqueIdModule } from './use-cases/get-payment-customer-by-unique-id/get-payment-customer-by-unique-id.module';
import { CheckoutSessionsModule } from './modules/checkout-sessions/checkout-sessions.module';
import { RegisterCheckoutSessionModule } from './use-cases/register-checkout-session/register-checkout-session.module';
import { UpdateCheckoutSessionModule } from './use-cases/update-checkout-session/update-checkout-session.module';
import { ListCheckoutSessionsModule } from './use-cases/list-checkout-sessions/list-checkout-sessions.module';
import { GetCheckoutSessionByUniqueIdModule } from './use-cases/get-checkout-session-by-unique-id/get-checkout-session-by-unique-id.module';
import { PaymentTransactionsModule } from './modules/payment-transactions/payment-transactions.module';
import { ProcessPaymentModule } from './use-cases/process-payment/process-payment.module';
import { GatewayOrchestrationModule } from './modules/gateway-orchestration/gateway-orchestration.module';
import { DispatchPaymentTransactionToGatewayModule } from './use-cases/dispatch-payment-transaction-to-gateway/dispatch-payment-transaction-to-gateway.module';
import { ReceiveGatewayWebhookModule } from './use-cases/receive-gateway-webhook/receive-gateway-webhook.module';
import { CreateGatewayCardTokenModule } from './use-cases/create-gateway-card-token/create-gateway-card-token.module';
import { DevPagSeguroEncryptedCardPageModule } from './use-cases/dev-pagseguro-encrypted-card-page/dev-pagseguro-encrypted-card-page.module';
import { GetPaymentTransactionByUniqueIdModule } from './use-cases/get-payment-transaction-by-unique-id/get-payment-transaction-by-unique-id.module';
import { ListPaymentTransactionsModule } from './use-cases/list-payment-transactions/list-payment-transactions.module';
import { ListPaymentTransactionsByOfficeIdModule } from './use-cases/list-payment-transactions-by-office-id/list-payment-transactions-by-office-id.module';
import { UpdatePaymentTransactionModule } from './use-cases/update-payment-transaction/update-payment-transaction.module';
import { SyncPaymentTransactionStatusModule } from './use-cases/sync-payment-transaction-status/sync-payment-transaction-status.module';
import { RegisterSubscriptionPlanModule } from './use-cases/register-subscription-plan/register-subscription-plan.module';
import { RegisterSubscriptionModule } from './use-cases/register-subscription/register-subscription.module';
import { GenerateSubscriptionInvoiceModule } from './use-cases/generate-subscription-invoice/generate-subscription-invoice.module';
import { ProcessRecurringPaymentModule } from './use-cases/process-recurring-payment/process-recurring-payment.module';
import { DevMercadoPagoCardTokenPageModule } from './use-cases/dev-mercado-pago-card-token-page/dev-mercado-pago-card-token-page.module';
import { DevPicPayTemporaryCardTokenPageModule } from './use-cases/dev-picpay-temporary-card-token-page/dev-picpay-temporary-card-token-page.module';
import { GetSubscriptionPlanByUniqueIdModule } from './use-cases/get-subscription-plan-by-unique-id/get-subscription-plan-by-unique-id.module';
import { ListSubscriptionPlansModule } from './use-cases/list-subscription-plans/list-subscription-plans.module';
import { ListSubscriptionPlansByOfficeIdModule } from './use-cases/list-subscription-plans-by-office-id/list-subscription-plans-by-office-id.module';
import { UpdateSubscriptionPlanModule } from './use-cases/update-subscription-plan/update-subscription-plan.module';
import { GetSubscriptionByUniqueIdModule } from './use-cases/get-subscription-by-unique-id/get-subscription-by-unique-id.module';
import { ListSubscriptionsModule } from './use-cases/list-subscriptions/list-subscriptions.module';
import { ListSubscriptionsByOfficeIdModule } from './use-cases/list-subscriptions-by-office-id/list-subscriptions-by-office-id.module';
import { UpdateSubscriptionModule } from './use-cases/update-subscription/update-subscription.module';
import { GetSubscriptionInvoiceByUniqueIdModule } from './use-cases/get-subscription-invoice-by-unique-id/get-subscription-invoice-by-unique-id.module';
import { ListSubscriptionInvoicesModule } from './use-cases/list-subscription-invoices/list-subscription-invoices.module';
import { ListSubscriptionInvoicesByOfficeIdModule } from './use-cases/list-subscription-invoices-by-office-id/list-subscription-invoices-by-office-id.module';
import { UpdateSubscriptionInvoiceModule } from './use-cases/update-subscription-invoice/update-subscription-invoice.module';
import { RegisterSplitRecipientModule } from './use-cases/register-split-recipient/register-split-recipient.module';
import { GetSplitRecipientByUniqueIdModule } from './use-cases/get-split-recipient-by-unique-id/get-split-recipient-by-unique-id.module';
import { ListSplitRecipientsModule } from './use-cases/list-split-recipients/list-split-recipients.module';
import { ListSplitRecipientsByOfficeIdModule } from './use-cases/list-split-recipients-by-office-id/list-split-recipients-by-office-id.module';
import { UpdateSplitRecipientModule } from './use-cases/update-split-recipient/update-split-recipient.module';
import { RegisterSplitRuleModule } from './use-cases/register-split-rule/register-split-rule.module';
import { SyncSplitRuleRecipientsModule } from './use-cases/sync-split-rule-recipients/sync-split-rule-recipients.module';
import { GetSplitRuleByUniqueIdModule } from './use-cases/get-split-rule-by-unique-id/get-split-rule-by-unique-id.module';
import { ListSplitRulesModule } from './use-cases/list-split-rules/list-split-rules.module';
import { ListSplitRulesByOfficeIdModule } from './use-cases/list-split-rules-by-office-id/list-split-rules-by-office-id.module';
import { UpdateSplitRuleModule } from './use-cases/update-split-rule/update-split-rule.module';
import { CalculatePaymentSplitModule } from './use-cases/calculate-payment-split/calculate-payment-split.module';
import { RegisterPaymentSplitModule } from './use-cases/register-payment-split/register-payment-split.module';
import { GetPaymentSplitByUniqueIdModule } from './use-cases/get-payment-split-by-unique-id/get-payment-split-by-unique-id.module';
import { ListPaymentSplitsByPaymentTransactionIdModule } from './use-cases/list-payment-splits-by-payment-transaction-id/list-payment-splits-by-payment-transaction-id.module';
import { ListPaymentSplitsByOfficeIdModule } from './use-cases/list-payment-splits-by-office-id/list-payment-splits-by-office-id.module';
import { UpdatePaymentSplitLifecycleModule } from './use-cases/update-payment-split-lifecycle/update-payment-split-lifecycle.module';
import { ProcessPaymentWebhookEventModule } from './use-cases/process-payment-webhook-event/process-payment-webhook-event.module';
import { ReceiveStripeWebhookModule } from './use-cases/receive-stripe-webhook/receive-stripe-webhook.module';
import { ReceiveMercadoPagoWebhookModule } from './use-cases/receive-mercado-pago-webhook/receive-mercado-pago-webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    OfficesModule,
    ProfilesModule,
    ClientsModule,
    UserCustomersModule,
    PositionsModule,
    PermissionsModule,
    PositionPermissionsModule,
    UserPositionsModule,
    SecurityModule,
    RegisterPermissionModule,
    RegisterApiCredentialModule,
    ApiCredentialsModule,
    RegisterPositionModule,
    SyncPositionPermissionsModule,
    UserAccessCodesModule,
    RegisterUserModule,
    UpdateUserModule,
    GetUserModule,
    ListUsersModule,
    GetAllUsersByOfficeIdModule,
    UpdateApiCredentialModule,
    RegisterGatewayModule,
    UpdateGatewayModule,
    GetAllGatewaysModule,
    PaymentCustomersModule,
    RegisterPaymentCustomerModule,
    UpdatePaymentCustomerModule,
    ListPaymentCustomersModule,
    GetPaymentCustomerByUniqueIdModule,
    CheckoutSessionsModule,
    RegisterCheckoutSessionModule,
    UpdateCheckoutSessionModule,
    ListCheckoutSessionsModule,
    GetCheckoutSessionByUniqueIdModule,
    PaymentTransactionsModule,
    ProcessPaymentModule,
    GatewayOrchestrationModule,
    DispatchPaymentTransactionToGatewayModule,
    ReceiveGatewayWebhookModule,
    CreateGatewayCardTokenModule,
    DevPagSeguroEncryptedCardPageModule,
    GetPaymentTransactionByUniqueIdModule,
    ListPaymentTransactionsModule,
    ListPaymentTransactionsByOfficeIdModule,
    UpdatePaymentTransactionModule,
    SyncPaymentTransactionStatusModule,
    RegisterSubscriptionPlanModule,
    RegisterSubscriptionModule,
    GenerateSubscriptionInvoiceModule,
    ProcessRecurringPaymentModule,
    DevMercadoPagoCardTokenPageModule,
    DevPicPayTemporaryCardTokenPageModule,
    GetSubscriptionPlanByUniqueIdModule,
    ListSubscriptionPlansModule,
    ListSubscriptionPlansByOfficeIdModule,
    UpdateSubscriptionPlanModule,
    GetSubscriptionByUniqueIdModule,
    ListSubscriptionsModule,
    ListSubscriptionsByOfficeIdModule,
    UpdateSubscriptionModule,
    GetSubscriptionInvoiceByUniqueIdModule,
    ListSubscriptionInvoicesModule,
    ListSubscriptionInvoicesByOfficeIdModule,
    UpdateSubscriptionInvoiceModule,
    RegisterSplitRecipientModule,
    GetSplitRecipientByUniqueIdModule,
    ListSplitRecipientsModule,
    ListSplitRecipientsByOfficeIdModule,
    UpdateSplitRecipientModule,
    RegisterSplitRuleModule,
    SyncSplitRuleRecipientsModule,
    GetSplitRuleByUniqueIdModule,
    ListSplitRulesModule,
    ListSplitRulesByOfficeIdModule,
    UpdateSplitRuleModule,
    CalculatePaymentSplitModule,
    RegisterPaymentSplitModule,
    GetPaymentSplitByUniqueIdModule,
    ListPaymentSplitsByPaymentTransactionIdModule,
    ListPaymentSplitsByOfficeIdModule,
    UpdatePaymentSplitLifecycleModule,
    ProcessPaymentWebhookEventModule,
    ReceiveStripeWebhookModule,
    ReceiveMercadoPagoWebhookModule,
  ],
})
export class AppModule {}

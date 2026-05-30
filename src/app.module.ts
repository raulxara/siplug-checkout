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
import { GatewaysModule } from './modules/gateways/gateways.module';
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
    GatewaysModule,
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
  ],
})
export class AppModule {}

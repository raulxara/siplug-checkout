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
  ],
})
export class AppModule {}
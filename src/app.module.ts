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
  ],
})
export class AppModule {}
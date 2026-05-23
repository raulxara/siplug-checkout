import { Module } from '@nestjs/common';
import { PermissionsModule } from '../permissions/permissions.module';
import { PositionPermissionsModule } from '../position-permissions/position-permissions.module';
import { PositionsModule } from '../positions/positions.module';
import { UserCustomersModule } from '../user-customers/user-customers.module';
import { UserPositionsModule } from '../user-positions/user-positions.module';
import { CheckUserPermissionService } from './services/check-user-permission/check-user-permission.service';
import { ResolveActorAuthorizationService } from './services/resolve-actor-authorization/resolve-actor-authorization.service';

@Module({
  imports: [
    UserCustomersModule,
    UserPositionsModule,
    PositionsModule,
    PositionPermissionsModule,
    PermissionsModule,
  ],
  providers: [CheckUserPermissionService, ResolveActorAuthorizationService],
  exports: [CheckUserPermissionService, ResolveActorAuthorizationService],
})
export class SecurityModule {}
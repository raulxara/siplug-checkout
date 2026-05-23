import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PositionPermissionsRepository } from './repositories/position-permissions.repository';
import { CreatePositionPermissionService } from './services/create-position-permission/create-position-permission.service';
import { FindPositionPermissionByPositionAndPermissionService } from './services/find-position-permission-by-position-and-permission/find-position-permission-by-position-and-permission.service';
import { FindPositionPermissionByUniqueIdService } from './services/find-position-permission-by-unique-id/find-position-permission-by-unique-id.service';
import { GetAllPositionPermissionsByPositionIdService } from './services/get-all-position-permissions-by-position-id/get-all-position-permissions-by-position-id.service';
import { GetAllPositionPermissionsByPositionIdsService } from './services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service';
import { GetAllPositionPermissionsService } from './services/get-all-position-permissions/get-all-position-permissions.service';
import { UpdatePositionPermissionService } from './services/update-position-permission/update-position-permission.service';
import { POSITION_PERMISSIONS_REPOSITORY } from './tokens/position-permissions.tokens';

@Module({
  providers: [
    {
      provide: POSITION_PERMISSIONS_REPOSITORY,
      useClass: PositionPermissionsRepository,
    },
    BuildChangesHistoryService,
    CreatePositionPermissionService,
    UpdatePositionPermissionService,
    FindPositionPermissionByUniqueIdService,
    FindPositionPermissionByPositionAndPermissionService,
    GetAllPositionPermissionsService,
    GetAllPositionPermissionsByPositionIdService,
    GetAllPositionPermissionsByPositionIdsService,
  ],
  exports: [
    POSITION_PERMISSIONS_REPOSITORY,
    CreatePositionPermissionService,
    UpdatePositionPermissionService,
    FindPositionPermissionByUniqueIdService,
    FindPositionPermissionByPositionAndPermissionService,
    GetAllPositionPermissionsService,
    GetAllPositionPermissionsByPositionIdService,
    GetAllPositionPermissionsByPositionIdsService,
  ],
})
export class PositionPermissionsModule {}
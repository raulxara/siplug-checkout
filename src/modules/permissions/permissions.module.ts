import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PermissionsRepository } from './repositories/permissions.repository';
import { CreatePermissionService } from './services/create-permission/create-permission.service';
import { FindPermissionBySlugService } from './services/find-permission-by-slug/find-permission-by-slug.service';
import { FindPermissionByUniqueIdService } from './services/find-permission-by-unique-id/find-permission-by-unique-id.service';
import { GetAllPermissionsByOfficeIdService } from './services/get-all-permissions-by-office-id/get-all-permissions-by-office-id.service';
import { GetAllPermissionsByUniqueIdsService } from './services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service';
import { GetAllPermissionsService } from './services/get-all-permissions/get-all-permissions.service';
import { UpdatePermissionService } from './services/update-permission/update-permission.service';
import { ValidatePermissionSlugUniquenessService } from './services/validate-permission-slug-uniqueness/validate-permission-slug-uniqueness.service';
import { PERMISSIONS_REPOSITORY } from './tokens/permissions.tokens';
import { ListPermissionsByOfficeIdService } from './services/list-permissions-by-office-id/list-permissions-by-office-id.service';

@Module({
  providers: [
    {
      provide: PERMISSIONS_REPOSITORY,
      useClass: PermissionsRepository,
    },
    BuildChangesHistoryService,
    CreatePermissionService,
    UpdatePermissionService,
    FindPermissionByUniqueIdService,
    FindPermissionBySlugService,
    GetAllPermissionsService,
    GetAllPermissionsByOfficeIdService,
    GetAllPermissionsByUniqueIdsService,
    ValidatePermissionSlugUniquenessService,
    ListPermissionsByOfficeIdService,
  ],
  exports: [
    PERMISSIONS_REPOSITORY,
    CreatePermissionService,
    UpdatePermissionService,
    FindPermissionByUniqueIdService,
    FindPermissionBySlugService,
    GetAllPermissionsService,
    GetAllPermissionsByOfficeIdService,
    GetAllPermissionsByUniqueIdsService,
    ValidatePermissionSlugUniquenessService,
    ListPermissionsByOfficeIdService,
  ],
})
export class PermissionsModule {}
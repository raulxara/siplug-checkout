import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PermissionsModule } from '../../modules/permissions/permissions.module';
import { GetPermissionByUniqueIdController } from './get-permission-by-unique-id.controller';
import { GetPermissionByUniqueIdUseCase } from './get-permission-by-unique-id.use-case';

@Module({
  imports: [PermissionsModule, UseCaseSupportModule],
  controllers: [GetPermissionByUniqueIdController],
  providers: [GetPermissionByUniqueIdUseCase],
  exports: [GetPermissionByUniqueIdUseCase],
})
export class GetPermissionByUniqueIdModule {}

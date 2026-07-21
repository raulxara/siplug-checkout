import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PermissionsModule } from '../../modules/permissions/permissions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { RegisterPermissionController } from './register-permission.controller';
import { RegisterPermissionUseCase } from './register-permission.use-case';

@Module({
  imports: [PermissionsModule, SecurityModule, UseCaseSupportModule],
  controllers: [RegisterPermissionController],
  providers: [RegisterPermissionUseCase],
  exports: [RegisterPermissionUseCase],
})
export class RegisterPermissionModule {}
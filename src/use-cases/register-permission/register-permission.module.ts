import { Module } from '@nestjs/common';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { PermissionsModule } from '../../modules/permissions/permissions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { RegisterPermissionController } from './register-permission.controller';
import { RegisterPermissionUseCase } from './register-permission.use-case';

@Module({
  imports: [PermissionsModule, SecurityModule],
  controllers: [RegisterPermissionController],
  providers: [RegisterPermissionUseCase, HandleUseCaseExceptionService],
  exports: [RegisterPermissionUseCase],
})
export class RegisterPermissionModule {}
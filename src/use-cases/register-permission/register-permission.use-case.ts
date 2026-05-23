import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { CreatePermissionDtoIn } from '../../modules/permissions/services/create-permission/dtos/create-permission.dto-in';
import { CreatePermissionService } from '../../modules/permissions/services/create-permission/create-permission.service';
import { ValidatePermissionSlugUniquenessDtoIn } from '../../modules/permissions/services/validate-permission-slug-uniqueness/dtos/validate-permission-slug-uniqueness.dto-in';
import { ValidatePermissionSlugUniquenessService } from '../../modules/permissions/services/validate-permission-slug-uniqueness/validate-permission-slug-uniqueness.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterPermissionDtoIn } from './dtos/register-permission.dto-in';
import { RegisterPermissionDtoOut } from './dtos/register-permission.dto-out';

@Injectable()
export class RegisterPermissionUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly validatePermissionSlugUniquenessService: ValidatePermissionSlugUniquenessService,
    private readonly createPermissionService: CreatePermissionService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: RegisterPermissionDtoIn,
  ): Promise<RegisterPermissionDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerPermission',
          requiredEntity: 'permissions',
        }),
      );

      await this.validatePermissionSlugUniquenessService.exec(
        new ValidatePermissionSlugUniquenessDtoIn({
          officeId: dtoIn.officeId,
          slug: dtoIn.slug,
        }),
      );

      const permissionDtoOut = await this.createPermissionService.exec(
        new CreatePermissionDtoIn({
          officeId: dtoIn.officeId,
          name: dtoIn.name,
          slug: dtoIn.slug,
          description: dtoIn.description,
          entity: dtoIn.entity,
          action: dtoIn.action,
          config: dtoIn.config,
          status: dtoIn.status,
        }),
      );

      return RegisterPermissionDtoOut.fromCreatePermissionDtoOut(
        permissionDtoOut,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterPermissionUseCase',
          error,
          context: {
            officeId: dtoIn.officeId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            entity: dtoIn.entity,
            action: dtoIn.action,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register permission use case';

      throw new Error(message);
    }
  }
}
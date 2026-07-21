import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { FindPermissionBySlugDtoIn } from './dtos/find-permission-by-slug.dto-in';
import { FindPermissionBySlugDtoOut } from './dtos/find-permission-by-slug.dto-out';

@Injectable()
export class FindPermissionBySlugService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
  ) {}

  async exec(
    dtoIn: FindPermissionBySlugDtoIn,
  ): Promise<FindPermissionBySlugDtoOut> {
    try {
      const permission = await this.repository.findBySlug(
        dtoIn.officeId,
        dtoIn.slug,
      );

      if (!permission) {
        throw new Error('permission not found');
      }

      return new FindPermissionBySlugDtoOut(permission);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find permission by slug';

      throw new Error(message);
    }
  }
}
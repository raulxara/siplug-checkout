import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { PERMISSIONS_REPOSITORY } from '../../tokens/permissions.tokens';
import { ValidatePermissionSlugUniquenessDtoIn } from './dtos/validate-permission-slug-uniqueness.dto-in';

@Injectable()
export class ValidatePermissionSlugUniquenessService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY)
    private readonly repository: IPermissionsRepository,
  ) {}

  async exec(dtoIn: ValidatePermissionSlugUniquenessDtoIn): Promise<void> {
    try {
      const permission = await this.repository.findBySlug(
        dtoIn.officeId,
        dtoIn.slug,
      );

      if (permission) {
        throw new Error('permission slug already exists');
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on validate permission slug uniqueness';

      throw new Error(message);
    }
  }
}
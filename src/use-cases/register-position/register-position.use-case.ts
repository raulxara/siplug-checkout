import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { CreatePositionDtoIn } from '../../modules/positions/services/create-position/dtos/create-position.dto-in';
import { CreatePositionService } from '../../modules/positions/services/create-position/create-position.service';
import { ValidatePositionSlugUniquenessDtoIn } from '../../modules/positions/services/validate-position-slug-uniqueness/dtos/validate-position-slug-uniqueness.dto-in';
import { ValidatePositionSlugUniquenessService } from '../../modules/positions/services/validate-position-slug-uniqueness/validate-position-slug-uniqueness.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterPositionDtoIn } from './dtos/register-position.dto-in';
import { RegisterPositionDtoOut } from './dtos/register-position.dto-out';

@Injectable()
export class RegisterPositionUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly validatePositionSlugUniquenessService: ValidatePositionSlugUniquenessService,
    private readonly createPositionService: CreatePositionService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: RegisterPositionDtoIn): Promise<RegisterPositionDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerPosition',
          requiredEntity: 'positions',
        }),
      );

      if (dtoIn.officeId !== null) {
        await this.findOfficeByUniqueIdService.exec(
          new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
        );
      }

      await this.validatePositionSlugUniquenessService.exec(
        new ValidatePositionSlugUniquenessDtoIn({
          officeId: dtoIn.officeId,
          slug: dtoIn.slug,
        }),
      );

      const positionDtoOut = await this.createPositionService.exec(
        new CreatePositionDtoIn({
          officeId: dtoIn.officeId,
          name: dtoIn.name,
          slug: dtoIn.slug,
          description: dtoIn.description,
          config: dtoIn.config,
          status: dtoIn.status,
        }),
      );

      return RegisterPositionDtoOut.fromCreatePositionDtoOut(positionDtoOut);
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterPositionUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            description: dtoIn.description,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register position use case';

      throw new Error(message);
    }
  }
}
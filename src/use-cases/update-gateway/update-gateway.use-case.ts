import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindGatewayByUniqueIdDtoIn } from '../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';
import { UpdateGatewayDtoIn as UpdateGatewayServiceDtoIn } from '../../modules/gateways/services/update-gateway/dtos/update-gateway.dto-in';
import { UpdateGatewayService } from '../../modules/gateways/services/update-gateway/update-gateway.service';
import { ValidateGatewaySlugUniquenessDtoIn } from '../../modules/gateways/services/validate-gateway-slug-uniqueness/dtos/validate-gateway-slug-uniqueness.dto-in';
import { ValidateGatewaySlugUniquenessService } from '../../modules/gateways/services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateGatewayDtoIn } from './dtos/update-gateway.dto-in';
import { UpdateGatewayDtoOut } from './dtos/update-gateway.dto-out';

@Injectable()
export class UpdateGatewayUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findGatewayByUniqueIdService: FindGatewayByUniqueIdService,
    private readonly validateGatewaySlugUniquenessService: ValidateGatewaySlugUniquenessService,
    private readonly updateGatewayService: UpdateGatewayService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: UpdateGatewayDtoIn): Promise<UpdateGatewayDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'updateGateway',
          requiredEntity: 'gateways',
        }),
      );

      const currentGatewayDtoOut =
        await this.findGatewayByUniqueIdService.exec(
          new FindGatewayByUniqueIdDtoIn(dtoIn.gatewayId),
        );

      const currentGateway = currentGatewayDtoOut.gateway;

      if (dtoIn.slug !== null && dtoIn.slug !== currentGateway.slug) {
        await this.validateGatewaySlugUniquenessService.exec(
          new ValidateGatewaySlugUniquenessDtoIn(dtoIn.slug),
        );
      }

      const updatedGatewayDtoOut = await this.updateGatewayService.exec(
        new UpdateGatewayServiceDtoIn({
          _id: dtoIn.gatewayId,
          name: dtoIn.name,
          slug: dtoIn.slug,
          provider: dtoIn.provider,
          description: dtoIn.description,
          config: dtoIn.config,
          status: dtoIn.status,
          source: dtoIn.source,
        }),
      );

      return new UpdateGatewayDtoOut(updatedGatewayDtoOut.gateway);
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdateGatewayUseCase',
          error,
          appFile: __filename,
          context: {
            gatewayId: dtoIn.gatewayId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            provider: dtoIn.provider,
            description: dtoIn.description,
            status: dtoIn.status,
            source: dtoIn.source,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update gateway use case';

      throw new Error(message);
    }
  }
}
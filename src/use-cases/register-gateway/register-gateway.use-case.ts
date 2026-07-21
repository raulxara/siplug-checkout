import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { CreateGatewayDtoIn } from '../../modules/gateways/services/create-gateway/dtos/create-gateway.dto-in';
import { CreateGatewayService } from '../../modules/gateways/services/create-gateway/create-gateway.service';
import { ValidateGatewaySlugUniquenessDtoIn } from '../../modules/gateways/services/validate-gateway-slug-uniqueness/dtos/validate-gateway-slug-uniqueness.dto-in';
import { ValidateGatewaySlugUniquenessService } from '../../modules/gateways/services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterGatewayDtoIn } from './dtos/register-gateway.dto-in';
import { RegisterGatewayDtoOut } from './dtos/register-gateway.dto-out';

@Injectable()
export class RegisterGatewayUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly validateGatewaySlugUniquenessService: ValidateGatewaySlugUniquenessService,
    private readonly createGatewayService: CreateGatewayService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: RegisterGatewayDtoIn): Promise<RegisterGatewayDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerGateway',
          requiredEntity: 'gateways',
        }),
      );

      await this.validateGatewaySlugUniquenessService.exec(
        new ValidateGatewaySlugUniquenessDtoIn(dtoIn.slug),
      );

      const gatewayDtoOut = await this.createGatewayService.exec(
        new CreateGatewayDtoIn({
          name: dtoIn.name,
          slug: dtoIn.slug,
          provider: dtoIn.provider,
          description: dtoIn.description,
          config: dtoIn.config,
          status: dtoIn.status,
        }),
      );

      return RegisterGatewayDtoOut.fromCreateGatewayDtoOut(gatewayDtoOut);
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterGatewayUseCase',
          error,
          appFile: __filename,
          context: {
            name: dtoIn.name,
            slug: dtoIn.slug,
            provider: dtoIn.provider,
            description: dtoIn.description,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register gateway use case';

      throw new Error(message);
    }
  }
}
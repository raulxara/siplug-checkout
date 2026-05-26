import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import type { GatewayRow } from '../../modules/gateways/entities/gateways-repository.interface';
import { GetAllGatewaysDtoIn as GetAllGatewaysServiceDtoIn } from '../../modules/gateways/services/get-all-gateways/dtos/get-all-gateways.dto-in';
import { GetAllGatewaysService } from '../../modules/gateways/services/get-all-gateways/get-all-gateways.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllGatewaysDtoIn } from './dtos/get-all-gateways.dto-in';
import { GetAllGatewaysDtoOut } from './dtos/get-all-gateways.dto-out';

@Injectable()
export class GetAllGatewaysUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly getAllGatewaysService: GetAllGatewaysService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: GetAllGatewaysDtoIn): Promise<GetAllGatewaysDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'getAllGateways',
          requiredEntity: 'gateways',
        }),
      );

      const gatewaysDtoOut = await this.getAllGatewaysService.exec(
        new GetAllGatewaysServiceDtoIn(),
      );

      const filteredItems = gatewaysDtoOut.items.filter((gateway) => {
        if (dtoIn.status !== null && gateway.status !== dtoIn.status) {
          return false;
        }

        if (!this.matchesSearch(dtoIn.search, gateway)) {
          return false;
        }

        return true;
      });

      const total = filteredItems.length;
      const totalPages = Math.ceil(total / dtoIn.perPage);
      const start = (dtoIn.page - 1) * dtoIn.perPage;
      const paginatedItems = filteredItems.slice(start, start + dtoIn.perPage);

      return new GetAllGatewaysDtoOut(
        paginatedItems,
        total,
        dtoIn.page,
        dtoIn.perPage,
        totalPages,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'GetAllGatewaysUseCase',
          error,
          appFile: __filename,
          context: {
            status: dtoIn.status,
            search: dtoIn.search,
            page: dtoIn.page,
            perPage: dtoIn.perPage,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on get all gateways use case';

      throw new Error(message);
    }
  }

  private matchesSearch(search: string | null, gateway: GatewayRow): boolean {
    if (search === null || search.trim() === '') {
      return true;
    }

    const normalizedSearch = search.toLowerCase().trim();

    const searchable = [
      gateway.name,
      gateway.slug,
      gateway.provider,
      gateway.description ?? '',
      gateway.status,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedSearch);
  }
}
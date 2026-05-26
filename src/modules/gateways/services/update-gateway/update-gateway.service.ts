import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  GatewayRow,
  IGatewaysRepository,
} from '../../entities/gateways-repository.interface';
import { GATEWAYS_REPOSITORY } from '../../tokens/gateways.tokens';
import { UpdateGatewayDtoIn } from './dtos/update-gateway.dto-in';
import { UpdateGatewayDtoOut } from './dtos/update-gateway.dto-out';

@Injectable()
export class UpdateGatewayService {
  constructor(
    @Inject(GATEWAYS_REPOSITORY)
    private readonly repository: IGatewaysRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdateGatewayDtoIn): Promise<UpdateGatewayDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('gateway not found');
      }

      const newDataForHistory = this.removeNullValues({
        name: dtoIn.name,
        slug: dtoIn.slug,
        provider: dtoIn.provider,
        description: dtoIn.description,
        config: dtoIn.config,
        status: dtoIn.status,
      });

      const historyDtoOut = this.buildChangesHistoryService.exec(
        new BuildChangesHistoryDtoIn({
          currentChangesHistory: currentRow.changesHistory,
          oldData: this.buildOldData(currentRow),
          newData: newDataForHistory,
          source: dtoIn.source,
        }),
      );

      const row = await this.repository.updateByUniqueId(dtoIn._id, {
        name: dtoIn.name,
        slug: dtoIn.slug,
        provider: dtoIn.provider,
        description: dtoIn.description,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateGatewayDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on update gateway';

      throw new Error(message);
    }
  }

  private removeNullValues(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null),
    );
  }

  private buildOldData(row: GatewayRow): Record<string, unknown> {
    return {
      name: row.name,
      slug: row.slug,
      provider: row.provider,
      description: row.description,
      config: row.config,
      status: row.status,
    };
  }
}
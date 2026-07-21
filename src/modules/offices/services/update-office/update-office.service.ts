import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IOfficesRepository,
  OfficeRow,
} from '../../entities/offices-repository.interface';
import { OFFICES_REPOSITORY } from '../../tokens/offices.tokens';
import { UpdateOfficeDtoIn } from './dtos/update-office.dto-in';
import { UpdateOfficeDtoOut } from './dtos/update-office.dto-out';

@Injectable()
export class UpdateOfficeService {
  constructor(
    @Inject(OFFICES_REPOSITORY)
    private readonly repository: IOfficesRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdateOfficeDtoIn): Promise<UpdateOfficeDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('office not found');
      }

      const newDataForHistory = this.removeNullValues({
        name: dtoIn.name,
        slug: dtoIn.slug,
        language: dtoIn.language,
        currency: dtoIn.currency,
        addressStreet: dtoIn.addressStreet,
        addressNumber: dtoIn.addressNumber,
        addressComplement: dtoIn.addressComplement,
        addressNeighborhood: dtoIn.addressNeighborhood,
        addressCity: dtoIn.addressCity,
        addressState: dtoIn.addressState,
        addressCountry: dtoIn.addressCountry,
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
        language: dtoIn.language,
        currency: dtoIn.currency,
        address_street: dtoIn.addressStreet,
        address_number: dtoIn.addressNumber,
        address_complement: dtoIn.addressComplement,
        address_neighborhood: dtoIn.addressNeighborhood,
        address_city: dtoIn.addressCity,
        address_state: dtoIn.addressState,
        address_country: dtoIn.addressCountry,
        config: dtoIn.config,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateOfficeDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on update office';

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

  private buildOldData(row: OfficeRow): Record<string, unknown> {
    return {
      name: row.name,
      slug: row.slug,
      language: row.language,
      currency: row.currency,
      addressStreet: row.addressStreet,
      addressNumber: row.addressNumber,
      addressComplement: row.addressComplement,
      addressNeighborhood: row.addressNeighborhood,
      addressCity: row.addressCity,
      addressState: row.addressState,
      addressCountry: row.addressCountry,
      config: row.config,
      status: row.status,
    };
  }
}
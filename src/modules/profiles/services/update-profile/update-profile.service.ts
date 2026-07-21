import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  IProfilesRepository,
  ProfileRow,
} from '../../entities/profiles-repository.interface';
import { PROFILES_REPOSITORY } from '../../tokens/profiles.tokens';
import { UpdateProfileDtoIn } from './dtos/update-profile.dto-in';
import { UpdateProfileDtoOut } from './dtos/update-profile.dto-out';

@Injectable()
export class UpdateProfileService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly repository: IProfilesRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdateProfileDtoIn): Promise<UpdateProfileDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('profile not found');
      }

      const newDataForHistory = this.removeNullValues({
        firstName: dtoIn.firstName,
        lastName: dtoIn.lastName,
        email: dtoIn.email,
        phone: dtoIn.phone,
        documentType: dtoIn.documentType,
        documentValue: dtoIn.documentValue,
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
        first_name: dtoIn.firstName,
        last_name: dtoIn.lastName,
        email: dtoIn.email,
        phone: dtoIn.phone,
        document_type: dtoIn.documentType,
        document_value: dtoIn.documentValue,
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

      return new UpdateProfileDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on update profile';

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

  private buildOldData(row: ProfileRow): Record<string, unknown> {
    return {
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      documentType: row.documentType,
      documentValue: row.documentValue,
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
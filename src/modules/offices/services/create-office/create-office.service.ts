import { Inject, Injectable } from '@nestjs/common';
import { OfficeEntity } from '../../entities/office.entity';
import type { IOfficesRepository } from '../../entities/offices-repository.interface';
import { OFFICES_REPOSITORY } from '../../tokens/offices.tokens';
import { CreateOfficeDtoIn } from './dtos/create-office.dto-in';
import { CreateOfficeDtoOut } from './dtos/create-office.dto-out';

@Injectable()
export class CreateOfficeService {
  constructor(
    @Inject(OFFICES_REPOSITORY)
    private readonly repository: IOfficesRepository,
  ) {}

  async exec(dtoIn: CreateOfficeDtoIn): Promise<CreateOfficeDtoOut> {
    try {
      const entity = new OfficeEntity(this.repository);

      entity.name = dtoIn.name;
      entity.slug = dtoIn.slug;
      entity.language = dtoIn.language;
      entity.currency = dtoIn.currency;
      entity.addressStreet = dtoIn.addressStreet;
      entity.addressNumber = dtoIn.addressNumber;
      entity.addressComplement = dtoIn.addressComplement;
      entity.addressNeighborhood = dtoIn.addressNeighborhood;
      entity.addressCity = dtoIn.addressCity;
      entity.addressState = dtoIn.addressState;
      entity.addressCountry = dtoIn.addressCountry;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateOfficeDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on create office';

      throw new Error(message);
    }
  }
}
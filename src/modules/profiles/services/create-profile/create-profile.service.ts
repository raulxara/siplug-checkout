import { Inject, Injectable } from '@nestjs/common';
import { ProfileEntity } from '../../entities/profile.entity';
import type { IProfilesRepository } from '../../entities/profiles-repository.interface';
import { PROFILES_REPOSITORY } from '../../tokens/profiles.tokens';
import { CreateProfileDtoIn } from './dtos/create-profile.dto-in';
import { CreateProfileDtoOut } from './dtos/create-profile.dto-out';

@Injectable()
export class CreateProfileService {
  constructor(
    @Inject(PROFILES_REPOSITORY)
    private readonly repository: IProfilesRepository,
  ) {}

  async exec(dtoIn: CreateProfileDtoIn): Promise<CreateProfileDtoOut> {
    try {
      const entity = new ProfileEntity(this.repository);

      entity.firstName = dtoIn.firstName;
      entity.lastName = dtoIn.lastName;
      entity.email = dtoIn.email;
      entity.phone = dtoIn.phone;
      entity.documentType = dtoIn.documentType;
      entity.documentValue = dtoIn.documentValue;
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

      return CreateProfileDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on create profile';

      throw new Error(message);
    }
  }
}
import { ProfileRow } from '../../../entities/profiles-repository.interface';

export class UpdateProfileDtoOut {
  constructor(public readonly profile: ProfileRow) {}
}
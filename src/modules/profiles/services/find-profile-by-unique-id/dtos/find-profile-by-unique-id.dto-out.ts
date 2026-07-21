import { ProfileRow } from '../../../entities/profiles-repository.interface';

export class FindProfileByUniqueIdDtoOut {
  constructor(public readonly profile: ProfileRow) {}
}
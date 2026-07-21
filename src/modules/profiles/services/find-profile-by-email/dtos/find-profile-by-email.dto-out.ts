import { ProfileRow } from '../../../entities/profiles-repository.interface';

export class FindProfileByEmailDtoOut {
  constructor(public readonly profile: ProfileRow) {}
}
import { ProfileRow } from '../../../entities/profiles-repository.interface';

export class FindProfileByDocumentDtoOut {
  constructor(public readonly profile: ProfileRow) {}
}
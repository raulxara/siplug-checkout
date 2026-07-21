import { ProfileRow } from '../../../entities/profiles-repository.interface';

export class GetAllProfilesDtoOut {
  constructor(
    public readonly items: ProfileRow[],
    public readonly total: number,
  ) {}
}
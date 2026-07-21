import { OfficeRow } from '../../../entities/offices-repository.interface';

export class GetAllOfficesDtoOut {
  constructor(
    public readonly items: OfficeRow[],
    public readonly total: number,
  ) {}
}
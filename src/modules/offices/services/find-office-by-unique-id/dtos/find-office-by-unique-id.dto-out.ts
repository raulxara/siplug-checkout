import { OfficeRow } from '../../../entities/offices-repository.interface';

export class FindOfficeByUniqueIdDtoOut {
  constructor(public readonly office: OfficeRow) {}
}
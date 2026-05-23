import { OfficeRow } from '../../../entities/offices-repository.interface';

export class FindOfficeBySlugDtoOut {
  constructor(public readonly office: OfficeRow) {}
}
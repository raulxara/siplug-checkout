import { OfficeRow } from '../../../entities/offices-repository.interface';

export class UpdateOfficeDtoOut {
  constructor(public readonly office: OfficeRow) {}
}
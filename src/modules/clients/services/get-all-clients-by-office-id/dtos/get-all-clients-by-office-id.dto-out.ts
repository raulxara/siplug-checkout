import type { ClientRow } from '../../../entities/clients-repository.interface';

export class GetAllClientsByOfficeIdDtoOut {
  constructor(
    public readonly items: ClientRow[],
    public readonly total: number,
  ) {}
}
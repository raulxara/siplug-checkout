import type { ClientRow } from '../../../entities/clients-repository.interface';

export class GetAllClientsDtoOut {
  constructor(
    public readonly items: ClientRow[],
    public readonly total: number,
  ) {}
}
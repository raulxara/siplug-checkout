import type { ClientRow } from '../../../entities/clients-repository.interface';

export class FindClientByUniqueIdDtoOut {
  constructor(public readonly client: ClientRow) {}
}
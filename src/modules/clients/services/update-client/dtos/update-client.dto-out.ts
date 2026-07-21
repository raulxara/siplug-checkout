import type { ClientRow } from '../../../entities/clients-repository.interface';

export class UpdateClientDtoOut {
  constructor(public readonly client: ClientRow) {}
}
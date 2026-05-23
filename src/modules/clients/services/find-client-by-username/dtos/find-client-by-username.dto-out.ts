import type { ClientRow } from '../../../entities/clients-repository.interface';

export class FindClientByUsernameDtoOut {
  constructor(public readonly client: ClientRow) {}
}
import type { ClientEntity } from './client.entity';

export type ClientRow = {
  id: number;
  _id: string;
  officeId: string | null;
  customerId: string | null;
  userType: string;
  username: string;
  config: Record<string, unknown> | null;
  changesHistory: Array<Record<string, unknown>> | null;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export interface IClientsRepository {
  create(entity: ClientEntity): Promise<ClientEntity>;

  updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<ClientRow>;

  findByUniqueId(_id: string): Promise<ClientRow | null>;

  findByUsername(username: string): Promise<ClientRow | null>;

  getAll(): Promise<ClientRow[]>;

  getAllByOfficeId(officeId: string): Promise<ClientRow[]>;
}
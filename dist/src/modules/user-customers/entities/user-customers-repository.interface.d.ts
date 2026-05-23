import type { UserCustomerEntity } from './user-customer.entity';
export type UserCustomerRow = {
    id: number;
    _id: string;
    clientId: string;
    profileId: string;
    token: string;
    twoFaRequired: boolean;
    twoFaActive: boolean;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IUserCustomersRepository {
    create(entity: UserCustomerEntity): Promise<UserCustomerEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<UserCustomerRow>;
    findByUniqueId(_id: string): Promise<UserCustomerRow | null>;
    findByToken(token: string): Promise<UserCustomerRow | null>;
    getAll(): Promise<UserCustomerRow[]>;
    getAllByClientId(clientId: string): Promise<UserCustomerRow[]>;
}

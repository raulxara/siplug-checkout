import type { UserPositionEntity } from './user-position.entity';
export type UserPositionRow = {
    id: number;
    _id: string;
    userCustomerId: string;
    positionId: string;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IUserPositionsRepository {
    create(entity: UserPositionEntity): Promise<UserPositionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<UserPositionRow>;
    findByUniqueId(_id: string): Promise<UserPositionRow | null>;
    findByUserCustomerAndPosition(userCustomerId: string, positionId: string): Promise<UserPositionRow | null>;
    getAll(): Promise<UserPositionRow[]>;
    getAllByUserCustomerId(userCustomerId: string): Promise<UserPositionRow[]>;
    getAllByUserCustomerIds(userCustomerIds: string[]): Promise<UserPositionRow[]>;
}

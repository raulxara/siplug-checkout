import type { UserAccessCodeEntity } from './user-access-code.entity';
export type UserAccessCodeRow = {
    id: number;
    _id: string;
    userCustomerId: string;
    channel: string;
    destination: string;
    code: string;
    expiresAt: string | null;
    usedAt: string | null;
    sentAt: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IUserAccessCodesRepository {
    create(entity: UserAccessCodeEntity): Promise<UserAccessCodeEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<UserAccessCodeRow>;
    findByUniqueId(_id: string): Promise<UserAccessCodeRow | null>;
    findByCode(code: string): Promise<UserAccessCodeRow | null>;
    getAllByUserCustomerId(userCustomerId: string): Promise<UserAccessCodeRow[]>;
}

import type { UserAccessCodeEntity } from '../../../entities/user-access-code.entity';
export declare class CreateUserAccessCodeDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly userCustomerId: string;
    readonly channel: string;
    readonly destination: string;
    readonly code: string;
    readonly expiresAt: string | null;
    readonly usedAt: string | null;
    readonly sentAt: string | null;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, userCustomerId: string, channel: string, destination: string, code: string, expiresAt: string | null, usedAt: string | null, sentAt: string | null, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: UserAccessCodeEntity): CreateUserAccessCodeDtoOut;
}

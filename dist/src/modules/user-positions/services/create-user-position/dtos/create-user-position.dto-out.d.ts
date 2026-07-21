import type { UserPositionEntity } from '../../../entities/user-position.entity';
export declare class CreateUserPositionDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly userCustomerId: string;
    readonly positionId: string;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, userCustomerId: string, positionId: string, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: UserPositionEntity): CreateUserPositionDtoOut;
}

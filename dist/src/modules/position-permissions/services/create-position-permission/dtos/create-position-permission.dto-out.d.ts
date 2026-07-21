import type { PositionPermissionEntity } from '../../../entities/position-permission.entity';
export declare class CreatePositionPermissionDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly positionId: string;
    readonly permissionId: string;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, positionId: string, permissionId: string, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: PositionPermissionEntity): CreatePositionPermissionDtoOut;
}

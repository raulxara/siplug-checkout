import type { PermissionEntity } from '../../../entities/permission.entity';
export declare class CreatePermissionDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly officeId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly entity: string;
    readonly action: string;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, officeId: string | null, name: string, slug: string, description: string | null, entity: string, action: string, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: PermissionEntity): CreatePermissionDtoOut;
}

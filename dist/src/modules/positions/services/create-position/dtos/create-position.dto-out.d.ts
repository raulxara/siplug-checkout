import type { PositionEntity } from '../../../entities/position.entity';
export declare class CreatePositionDtoOut {
    readonly id: number;
    readonly _id: string;
    readonly officeId: string | null;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
    readonly config: Record<string, unknown> | null;
    readonly changesHistory: Array<Record<string, unknown>> | null;
    readonly status: string;
    readonly createdAt: string | null;
    readonly updatedAt: string | null;
    constructor(id: number, _id: string, officeId: string | null, name: string, slug: string, description: string | null, config: Record<string, unknown> | null, changesHistory: Array<Record<string, unknown>> | null, status: string, createdAt: string | null, updatedAt: string | null);
    static fromEntity(entity: PositionEntity): CreatePositionDtoOut;
}

import type { PositionEntity } from './position.entity';
export type PositionRow = {
    id: number;
    _id: string;
    officeId: string | null;
    name: string;
    slug: string;
    description: string | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface IPositionsRepository {
    create(entity: PositionEntity): Promise<PositionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<PositionRow>;
    findByUniqueId(_id: string): Promise<PositionRow | null>;
    findBySlug(officeId: string | null, slug: string): Promise<PositionRow | null>;
    getAll(): Promise<PositionRow[]>;
    getAllByOfficeId(officeId: string): Promise<PositionRow[]>;
    getAllByUniqueIds(_ids: string[]): Promise<PositionRow[]>;
}
